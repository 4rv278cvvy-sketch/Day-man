import { useEffect, useRef, useState } from "react";
import * as f3 from "family-chart";
import "family-chart/styles/family-chart.css";
import { toBlob, toJpeg } from "html-to-image";
import { jsPDF } from "jspdf";

// Arbre interactif (ascendants + conjoint(e)s + descendants autour d'une
// personne, pan/zoom, générations dépliables) construit avec family-chart,
// une librairie D3 pensée pour ce genre de structure (parents multiples,
// polygamie) plutôt que pour une simple hiérarchie à un seul parent.
// Couleur/pointillés des liens parent<->enfant, appliqués en attributs SVG
// directs (pas seulement en CSS) : l'export en image ne peut pas récupérer
// la feuille de style externe (police Google Fonts bloquée par le bac à
// sable réseau fait échouer l'inlining de tout le CSS chez html-to-image),
// et retomberait alors sur le stroke="#fff" par défaut de la librairie,
// invisible sur le fond crème.
function paintLinks(cont) {
  cont.querySelectorAll("path.link").forEach((path) => {
    path.setAttribute("stroke", "#8C6D3F");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-dasharray", "1 5");
    path.setAttribute("stroke-linecap", "round");
  });
}

export default function GenealogyChart({ data, mainId, onSelect }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const onSelectRef = useRef(onSelect);
  const [ancestryDepth, setAncestryDepth] = useState(2);
  const [progenyDepth, setProgenyDepth] = useState(1);
  const [exporting, setExporting] = useState(false);
  // { url, filename, format } | null — résultat affiché en plein écran DANS
  // cette même page (pas un nouvel onglet, pas de feuille de partage) : ça
  // s'est avéré être la seule approche fiable sur mobile après plusieurs
  // échecs (voir exportTree ci-dessous pour l'historique des essais ratés).
  const [exportResult, setExportResult] = useState(null);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!containerRef.current || !data.length) return;
    const cont = containerRef.current;

    const chart = f3
      .createChart(cont, data)
      .setTransitionTime(500)
      .setCardXSpacing(230)
      .setCardYSpacing(140)
      .setOrientationVertical()
      .setSingleParentEmptyCard(true, { label: "؟" })
      .setShowSiblingsOfMain(false)
      .setAncestryDepth(ancestryDepth)
      .setProgenyDepth(progenyDepth)
      .setAfterUpdate(() => paintLinks(cont));

    chart
      .setCardHtml()
      .setCardDisplay([["name"], ["dates"]])
      .setStyle("rect")
      .setOnCardClick((e, d) => {
        chart.updateMainId(d.data.id);
        chart.updateTree({ tree_position: "main_to_middle" });
        onSelectRef.current(d.data.id);
      });

    if (mainId) chart.updateMainId(mainId);
    // "initial: true" force un fit qui zoome sur toute la largeur visible (illisible
    // dès qu'une personne a beaucoup d'enfants) ; on force le centrage à l'échelle
    // naturelle (scale 1) sur la personne sélectionnée à la place.
    chart.updateTree({ initial: false, tree_position: "main_to_middle" });
    chartRef.current = chart;

    return () => {
      cont.innerHTML = "";
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const isFirstMainUpdate = useRef(true);
  useEffect(() => {
    if (isFirstMainUpdate.current) {
      isFirstMainUpdate.current = false;
      return;
    }
    if (chartRef.current && mainId) {
      chartRef.current.updateMainId(mainId);
      chartRef.current.updateTree({ tree_position: "main_to_middle" });
    }
  }, [mainId]);

  // Empêche la page de fond de défiler pendant que le résultat plein écran
  // est ouvert (sinon le "position: fixed" reste correct mais l'utilisateur
  // peut faire défiler la page derrière, ce qui prête à confusion).
  useEffect(() => {
    if (!exportResult) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [exportResult]);

  // "fit" (plutôt que "main_to_middle") après un changement de profondeur : une
  // famille nombreuse sur plusieurs générations peut s'étaler sur des milliers
  // de pixels, et centrer à l'échelle 1 pousserait alors les cartes hors du
  // cadre visible. "fit" garantit que tout ce qui est chargé reste visible.
  function changeAncestryDepth(delta) {
    const next = Math.max(1, Math.min(8, ancestryDepth + delta));
    setAncestryDepth(next);
    if (chartRef.current) {
      chartRef.current.setAncestryDepth(next);
      chartRef.current.updateTree({ tree_position: "fit" });
    }
  }

  function changeProgenyDepth(delta) {
    const next = Math.max(1, Math.min(8, progenyDepth + delta));
    setProgenyDepth(next);
    if (chartRef.current) {
      chartRef.current.setProgenyDepth(next);
      chartRef.current.updateTree({ tree_position: "fit" });
    }
  }

  // Exporte la portion de l'arbre actuellement chargée (la profondeur choisie
  // avec les boutons +/- ci-dessus) en une seule image nette, plutôt que la
  // capture du petit cadre visible à l'écran : on agrandit temporairement le
  // conteneur à la taille réelle de l'arbre, on le réajuste avec "fit" pour
  // qu'il occupe tout cet espace à l'échelle naturelle, on capture, puis on
  // restaure l'affichage normal.
  //
  // Historique des approches essayées pour livrer le résultat, et pourquoi
  // chacune a été abandonnée (utile si ce code est retouché un jour) :
  //  1. <a download>.click() synthétique → ignoré sans erreur par Safari iOS
  //     et les navigateurs intégrés à une app.
  //  2. Onglet ouvert avec window.open + vrai lien <a download> à taper →
  //     un blob: URL n'est utilisable que dans la fenêtre qui l'a créé, et
  //     même corrigé, Chrome pour iOS ignore quand même l'attribut download
  //     (aucun navigateur iOS autre que Safari lui-même ne construit cette
  //     intégration par-dessus WebKit).
  //  3. navigator.share() (feuille de partage native, fournie par WebKit/iOS
  //     et donc homogène entre navigateurs) → marche en théorie, mais échoue
  //     silencieusement quand la page tourne dans un iframe/cadre sandboxé
  //     (le cas de l'aperçu d'artefact) sans qu'on puisse le détecter à coup sûr.
  // Solution retenue : rien de tout ça. On affiche l'image en plein écran
  // DANS cette même page (donc aucune histoire de fenêtre/onglet/permission),
  // zoomable au pincement, avec comme mécanisme d'enregistrement le geste le
  // plus basique qui soit : l'appui long natif du navigateur sur une image
  // pour l'enregistrer — une fonctionnalité du système, pas du JavaScript,
  // qui marche partout sur iOS quel que soit le navigateur.
  async function exportTree(format) {
    const chart = chartRef.current;
    const cont = containerRef.current;
    if (!chart || !cont || exporting) return;

    setExporting(true);
    const prevStyle = { width: cont.style.width, height: cont.style.height };
    try {
      const tree = chart.store.getTree();
      const pad = 80;
      const width = Math.ceil((tree?.dim?.width || 1600) + pad * 2);
      const height = Math.ceil((tree?.dim?.height || 900) + pad * 2);

      cont.style.width = `${width}px`;
      cont.style.height = `${height}px`;
      chart.updateTree({ tree_position: "fit", transition_time: 0 });
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      let blob;
      let filename;
      if (format === "png") {
        // PNG : sans perte, pour un usage d'archive/retouche.
        blob = await toBlob(cont, { width, height, backgroundColor: "#FBF6E9", pixelRatio: 2 });
        filename = "شجرة-نسب-سيد-الفالي.png";
      } else {
        // JPEG (pas PNG) dans le PDF : un PNG plein cadre à pixelRatio 2 produit
        // un PDF de 20-25 Mo pour un simple diagramme à aplats de couleur — le
        // JPEG réduit ça à quelques Mo sans perte de lisibilité du texte.
        const dataUrl = await toJpeg(cont, { width, height, backgroundColor: "#FBF6E9", pixelRatio: 2, quality: 0.92 });
        const pdf = new jsPDF({ orientation: width >= height ? "landscape" : "portrait", unit: "px", format: [width, height] });
        pdf.addImage(dataUrl, "JPEG", 0, 0, width, height);
        blob = pdf.output("blob");
        filename = "شجرة-نسب-سيد-الفالي.pdf";
      }

      // Même document, même fenêtre : pas de restriction blob: cross-fenêtre ici.
      const url = URL.createObjectURL(blob);
      setExportResult({ url, filename, format });
    } finally {
      cont.style.width = prevStyle.width;
      cont.style.height = prevStyle.height;
      chart.updateTree({ tree_position: "main_to_middle", transition_time: 0 });
      setExporting(false);
    }
  }

  function closeExportResult() {
    if (exportResult) URL.revokeObjectURL(exportResult.url);
    setExportResult(null);
  }

  return (
    <div className="genealogy-chart-wrap">
      <div className="genealogy-chart-controls">
        <div className="pedigree-depth-control">
          <span>الأجداد — ascendants</span>
          <button onClick={() => changeAncestryDepth(-1)}>−</button>
          <span>{ancestryDepth}</span>
          <button onClick={() => changeAncestryDepth(1)}>+</button>
        </div>
        <div className="pedigree-depth-control">
          <span>الأحفاد — descendants</span>
          <button onClick={() => changeProgenyDepth(-1)}>−</button>
          <span>{progenyDepth}</span>
          <button onClick={() => changeProgenyDepth(1)}>+</button>
        </div>
        <div className="pedigree-depth-control genealogy-export-control">
          <span>تصدير الجزء المعروض — Exporter</span>
          <button disabled={exporting} onClick={() => exportTree("png")}>PNG</button>
          <button disabled={exporting} onClick={() => exportTree("pdf")}>PDF</button>
          {exporting && <span className="genealogy-export-spinner">…</span>}
        </div>
      </div>
      <div className="genealogy-chart-cont f3" ref={containerRef} />
      {exporting && (
        <div className="genealogy-export-overlay">
          <span>جاري تحضير الصورة… — Génération de l'export…</span>
        </div>
      )}
      {exportResult && (
        <div className="genealogy-result-overlay">
          <div className="genealogy-result-bar">
            <span>
              {exportResult.format === "png"
                ? "اضغط مطولاً على الصورة لحفظها — Long-press the image to save it"
                : "استخدم أيقونة المشاركة في أسفل الشاشة — Use the share icon at the bottom of the viewer"}
            </span>
            <a href={exportResult.url} download={exportResult.filename}>تنزيل — Download</a>
            <button onClick={closeExportResult}>✕ إغلاق</button>
          </div>
          <div className="genealogy-result-body">
            {exportResult.format === "png" ? (
              <img src={exportResult.url} alt="شجرة النسب" />
            ) : (
              <iframe src={exportResult.url} title="شجرة النسب PDF" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
