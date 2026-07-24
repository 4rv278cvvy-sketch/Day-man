import { useEffect, useRef, useState } from "react";
import * as f3 from "family-chart";
import "family-chart/styles/family-chart.css";
import { toPng, toJpeg } from "html-to-image";
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
  async function exportTree(format) {
    const chart = chartRef.current;
    const cont = containerRef.current;
    if (!chart || !cont || exporting) return;
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

      const link = document.createElement("a");
      if (format === "png") {
        // PNG : sans perte, pour un usage d'archive/retouche.
        const dataUrl = await toPng(cont, { width, height, backgroundColor: "#FBF6E9", pixelRatio: 2 });
        link.href = dataUrl;
        link.download = "شجرة-نسب-سيد-الفالي.png";
        link.click();
      } else {
        // JPEG (pas PNG) dans le PDF : un PNG plein cadre à pixelRatio 2 produit
        // un PDF de 20-25 Mo pour un simple diagramme à aplats de couleur — le
        // JPEG réduit ça à quelques Mo sans perte de lisibilité du texte.
        const dataUrl = await toJpeg(cont, { width, height, backgroundColor: "#FBF6E9", pixelRatio: 2, quality: 0.92 });
        const pdf = new jsPDF({ orientation: width >= height ? "landscape" : "portrait", unit: "px", format: [width, height] });
        pdf.addImage(dataUrl, "JPEG", 0, 0, width, height);
        pdf.save("شجرة-نسب-سيد-الفالي.pdf");
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
