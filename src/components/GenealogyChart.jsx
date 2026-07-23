import { useEffect, useRef, useState } from "react";
import * as f3 from "family-chart";
import "family-chart/styles/family-chart.css";

// Arbre interactif (ascendants + conjoint(e)s + descendants autour d'une
// personne, pan/zoom, générations dépliables) construit avec family-chart,
// une librairie D3 pensée pour ce genre de structure (parents multiples,
// polygamie) plutôt que pour une simple hiérarchie à un seul parent.
export default function GenealogyChart({ data, mainId, onSelect }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const onSelectRef = useRef(onSelect);
  const [ancestryDepth, setAncestryDepth] = useState(2);
  const [progenyDepth, setProgenyDepth] = useState(1);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!containerRef.current || !data.length) return;

    const chart = f3
      .createChart(containerRef.current, data)
      .setTransitionTime(500)
      .setCardXSpacing(230)
      .setCardYSpacing(140)
      .setOrientationVertical()
      .setSingleParentEmptyCard(true, { label: "؟" })
      .setShowSiblingsOfMain(false)
      .setAncestryDepth(ancestryDepth)
      .setProgenyDepth(progenyDepth);

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

    const cont = containerRef.current;
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
      </div>
      <div className="genealogy-chart-cont f3" ref={containerRef} />
    </div>
  );
}
