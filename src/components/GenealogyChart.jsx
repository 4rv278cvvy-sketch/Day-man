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
  // restaure l'affichage normal. (Le redimensionnement hors-écran via
  // position:fixed + décalage négatif énorme casse la capture — testé —
  // donc on redimensionne en place, caché derrière l'overlay "exporting".)
  //
  // On n'utilise PAS <a download>.click() : un clic synthétique sur un lien
  // download est ignoré sans erreur par Safari iOS et par beaucoup de
  // navigateurs intégrés à une app (dont celui de l'app Claude) — seul un VRAI
  // tap de l'utilisateur sur un lien déclenche l'enregistrement là-bas. On
  // ouvre donc un onglet vide de façon SYNCHRONE dès le clic (avant tout
  // await, sinon le navigateur bloque l'ouverture comme un pop-up), puis on y
  // affiche le résultat avec un vrai lien à taper soi-même, plus un aperçu
  // (image ou PDF intégré) pour un appui long / le partage natif du lecteur
  // PDF comme alternative.
  //
  // Autre piège rencontré : une blob: URL n'est utilisable QUE dans la
  // fenêtre où elle a été enregistrée (outputTab.URL.createObjectURL, pas
  // URL.createObjectURL de cette page-ci) — et même ainsi, Chrome refuse
  // qu'un script d'une AUTRE fenêtre navigue l'onglet vers cette blob: URL
  // (outputTab.location.href = ... échoue silencieusement). Il faut
  // uniquement s'en servir comme src/href de balises écrites dans l'onglet.
  async function exportTree(format) {
    const chart = chartRef.current;
    const cont = containerRef.current;
    if (!chart || !cont || exporting) return;
    const outputTab = window.open("", "_blank");
    if (outputTab) {
      outputTab.document.write(
        '<title>شجرة نسب قبيلة سيد الفالي</title><body style="margin:0;background:#111;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;padding:20px;box-sizing:border-box">جاري تحضير الملف… — Préparation du fichier…</body>'
      );
    }
    setExporting(true);
    await new Promise((r) => requestAnimationFrame(r)); // laisse l'overlay s'afficher avant le redimensionnement
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

      if (outputTab && !outputTab.closed) {
        const blobUrl = outputTab.URL.createObjectURL(blob);
        const downloadBar = `<div style="padding:10px;background:#222;color:#fff;font-family:sans-serif;text-align:center;direction:rtl;flex:none">
          <a download="${filename}" href="${blobUrl}" style="color:#9cf;font-weight:bold">اضغط هنا للتنزيل — Tap here to download</a>
          — ${format === "png" ? "أو اضغط مطولاً على الصورة" : "أو استخدم أيقونة المشاركة أسفل المعاينة"}
        </div>`;
        const preview =
          format === "png"
            ? `<img src="${blobUrl}" style="max-width:100%;height:auto" />`
            : `<iframe src="${blobUrl}" style="flex:1;border:none;width:100%"></iframe>`;
        outputTab.document.open();
        outputTab.document.write(
          `<title>شجرة نسب قبيلة سيد الفالي</title><body style="margin:0;background:#111;display:flex;flex-direction:column;height:100vh">${downloadBar}${preview}</body>`
        );
        outputTab.document.close();
      } else {
        // Le navigateur a bloqué l'ouverture d'onglet (rare vu qu'on l'ouvre en
        // synchrone) : on retombe sur un lien de téléchargement dans la page
        // actuelle, à taper soi-même.
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        link.textContent = "تنزيل الملف — Télécharger le fichier";
        link.style.cssText = "position:fixed;inset:0;z-index:600;display:flex;align-items:center;justify-content:center;background:#111;color:#9cf;font-size:20px";
        link.onclick = () => setTimeout(() => link.remove(), 300);
        document.body.appendChild(link);
      }
    } finally {
      cont.style.width = prevStyle.width;
      cont.style.height = prevStyle.height;
      chart.updateTree({ tree_position: "main_to_middle", transition_time: 0 });
      setExporting(false);
    }
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
    </div>
  );
}
