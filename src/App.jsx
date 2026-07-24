import React, { useMemo, useState, useCallback } from "react";
import { APP_VERSION, APP_VERSION_DATE, APP_VERSION_LOG } from "./data/changelog.js";
import { RAW } from "./data/people.js";
import { applyCorrections } from "./data/apply-corrections.js";
import { toFamilyChartData } from "./lib/family-chart-data.js";
import GenealogyChart from "./components/GenealogyChart.jsx";

const RAW_FILTERED = RAW.filter((p) => p.id !== "P14w_placeholder");
let PEOPLE = applyCorrections(RAW_FILTERED, { merges: [], setField: [] });
let byId = Object.fromEntries(PEOPLE.map((p) => [p.id, p]));

/* ============================================================================
   GRAPHE : construction des liens parent<->enfant et époux<->épouse
============================================================================ */

function buildGraph() {
  const adj = {}; // id -> [{to, type}]
  const addEdge = (a, b, type) => {
    if (!a || !b || !byId[a] || !byId[b]) return;
    adj[a] = adj[a] || [];
    adj[b] = adj[b] || [];
    if (!adj[a].some((e) => e.to === b && e.type === type)) adj[a].push({ to: b, type });
  };
  PEOPLE.forEach((p) => {
    if (p.father) {
      addEdge(p.id, p.father, "parent"); // p -> son père
      addEdge(p.father, p.id, "enfant"); // père -> p
    }
    if (p.mother) {
      addEdge(p.id, p.mother, "parent"); // p -> sa mère
      addEdge(p.mother, p.id, "enfant"); // mère -> p
    }
    (p.spouses || []).forEach((s) => {
      addEdge(p.id, s, "epoux");
      addEdge(s, p.id, "epoux");
    });
  });
  return adj;
}
let GRAPH = buildGraph();

// Reconstruit PEOPLE / byId / GRAPH à partir des corrections utilisateur (stockage persistant).
// Comme toutes les fonctions ci-dessous lisent PEOPLE/byId/GRAPH comme variables de module
// (et non des copies figées), les réaffecter ici suffit à propager le changement partout,
// y compris dans les composants déjà montés, dès qu'on force un re-rendu React.
function rebuildDataset(userCorrections) {
  PEOPLE = applyCorrections(RAW_FILTERED, userCorrections);
  byId = Object.fromEntries(PEOPLE.map((p) => [p.id, p]));
  GRAPH = buildGraph();
}

function fullName(p) {
  if (!p) return "?";
  return p.name;
}

function ancestryChain(id) {
  // liste [id, id_pere, id_grandpere, ...] jusqu'à la racine
  const chain = [];
  let cur = id;
  const seen = new Set();
  while (cur && !seen.has(cur)) {
    chain.push(cur);
    seen.add(cur);
    cur = byId[cur]?.father || null;
  }
  return chain;
}

function rootName(nm) {
  // ne garde que le prénom (avant le premier marqueur de filiation)
  return (nm || "").split(/\s+(?:بن|بنت|ولد|ول|منت|مانت)\s+/)[0];
}

function displayFullName(p) {
  // renvoie la chaîne complète : le champ fullName s'il existe, sinon reconstruite depuis les pères
  if (!p) return "";
  if (p.fullName) return p.fullName;
  const chain = ancestryChain(p.id).map((cid) => rootName(byId[cid]?.name));
  if (chain.length <= 1) return "";
  const marker = p.g === "F" ? " بنت " : " بن ";
  return chain[0] + marker + chain.slice(1).join(" بن ");
}

function chainNameTokens(id) {
  // Tokenise le nom de la personne + de tous ses ascendants (père, grand-père, ...),
  // dans l'ordre, pour permettre une recherche du type "أحمد بن محمد بن علي".
  const names = ancestryChain(id).map((cid) => byId[cid]?.name || "");
  return names.join(" ").replace(/[()]/g, " ").split(/\s+/).filter(Boolean);
}

function searchByGenealogyChain(query, limit = 20) {
  const qTokens = query
    .replace(/\bبنت\b|\bبن\b/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
  if (qTokens.length === 0) return [];

  const scored = [];
  for (const p of PEOPLE) {
    const chainToks = chainNameTokens(p.id);
    // sous-séquence dans l'ordre : chaque mot tapé doit se retrouver, dans l'ordre,
    // en descendant la chaîne personne -> père -> grand-père -> ...
    let ci = 0;
    let matchedAll = true;
    let firstMatchIdx = -1;
    for (const qt of qTokens) {
      let found = false;
      while (ci < chainToks.length) {
        if (chainToks[ci].includes(qt) || qt.includes(chainToks[ci])) {
          if (firstMatchIdx === -1) firstMatchIdx = ci;
          found = true;
          ci++;
          break;
        }
        ci++;
      }
      if (!found) {
        matchedAll = false;
        break;
      }
    }
    if (matchedAll) scored.push({ p, firstMatchIdx, span: ci });
  }

  // Priorité : correspondance qui commence par le propre nom de la personne (firstMatchIdx===0),
  // puis les têtes de paragraphe (backbone documenté), puis la génération la plus basse.
  scored.sort((a, b) => {
    if (a.firstMatchIdx !== b.firstMatchIdx) return a.firstMatchIdx - b.firstMatchIdx;
    const aPara = a.p.para ? 0 : 1;
    const bPara = b.p.para ? 0 : 1;
    if (aPara !== bPara) return aPara - bPara;
    return generationNumber(a.p.id) - generationNumber(b.p.id);
  });
  return scored.slice(0, limit).map((s) => s.p);
}

function isUnnamed(name) {
  if (!name) return false;
  const first = name.trim().split(/\s+/)[0];
  return first === "فلانة" || first === "فالن" || first === "فلانة" || first === "فلان";
}

function generationNumber(id) {
  // Nombre de générations depuis سيد الفالي (T0), racine de la tribu
  return Math.max(0, ancestryChain(id).length - 1);
}

function familyOf(id) {
  if (!id) return null;
  if (id === "T0" || id.startsWith("T0-")) return { key: "tribe", label: "الجد الجامع" };
  if (id.startsWith("P")) return { key: "mahi", label: "أهل ماهي" };
  if (id.startsWith("K")) return { key: "karim", label: "أهل محمد الكريم" };
  if (id.startsWith("M")) return { key: "metili", label: "أهل متيلي" };
  if (id.startsWith("N")) return { key: "bani", label: "أهل محمذن بن باني (حليفة)" };
  if (id.startsWith("H")) return { key: "aslitin", label: "أهل حبلل اسليطين (حليفة)" };
  if (id.startsWith("W")) return { key: "abdallah", label: "أهل محمد بن عبد الله (حليفة)" };
  if (id.startsWith("Z")) return { key: "mozdaf", label: "أهل المزضف" };
  if (id.startsWith("Y")) return { key: "chfagha", label: "أهل اشفغ الأمين" };
  if (id.startsWith("L")) return { key: "milud", label: "أهل ميلود" };
  if (id.startsWith("J")) return { key: "ajel", label: "أهل آلچ" };
  if (id.startsWith("E")) return { key: "amine", label: "أهل الأمين عمي" };
  if (id.startsWith("R")) return { key: "zrouq", label: "أهل أحمد زروق" };
  if (id.startsWith("S")) return { key: "sidmohamed", label: "أهل سيد محمد" };
  if (id.startsWith("D")) return { key: "abdallahfrere", label: "أهل عبد الله (شقيق سيد الفالي)" };
  if (id.startsWith("V")) return { key: "bahnin", label: "أهل باهنين (حليفة)" };
  if (id.startsWith("I")) return { key: "ibrahim", label: "أهل ابراهيم" };
  if (id.startsWith("F")) return { key: "ama", label: "أهل اما (الماقور)" };
  if (id.startsWith("G")) return { key: "modimalik", label: "أهل مودي مالك (حليفة)" };
  return null;
}
function familyShortLabel(key) {
  return { mahi: "ماهي", karim: "الكريم", metili: "متيلي", bani: "بن باني", aslitin: "اسليطين", abdallah: "ولد عبدالله", mozdaf: "المزضف", chfagha: "اشفغ الأمين", milud: "ميلود", ajel: "آلچ", amine: "الأمين عمي", zrouq: "أحمد زروق", sidmohamed: "سيد محمد", abdallahfrere: "عبد الله (شقيق)", bahnin: "باهنين", ibrahim: "ابراهيم", ama: "اما (الماقور)", modimalik: "مودي مالك" }[key] || "";
}

function generationLabel(g, direction) {
  // direction: 'up' = ancêtre (g>=1), 'down' = descendant
  const upTerms = ["", "parent (père/mère)", "grand-parent", "arrière-grand-parent"];
  const downTerms = ["", "enfant", "petit-enfant", "arrière-petit-enfant"];
  const terms = direction === "up" ? upTerms : downTerms;
  if (g < terms.length) return terms[g];
  const prefix = "arrière-".repeat(g - 2) ;
  return direction === "up" ? `${prefix}arrière-grand-parent (${g}e génération)` : `${prefix}arrière-petit-enfant (${g}e génération)`;
}

function bloodRelationLabel(gA, gB, genderB, siblingType) {
  // gA = distance A->LCA, gB = distance B->LCA. Décrit ce qu'est B par rapport à A.
  // siblingType (uniquement pertinent si gA===gB===1) : "germain" | "consanguin" | "utérin"
  const f = genderB === "F";
  if (gA === 0 && gB === 0) return "la même personne";
  if (gA === 0) {
    // A EST l'ancêtre commun → A est un ancêtre de B → B est le descendant de A
    if (gB === 1) return f ? "sa fille" : "son fils";
    if (gB === 2) return f ? "sa petite-fille" : "son petit-fils";
    return `${"arrière-".repeat(gB - 2)}${f ? "arrière-petite-fille" : "arrière-petit-fils"} (${gB}e génération descendante)`;
  }
  if (gB === 0) {
    // B EST l'ancêtre commun → B est un ancêtre de A
    if (gA === 1) return f ? "sa mère" : "son père";
    if (gA === 2) return f ? "sa grand-mère" : "son grand-père";
    return `${"arrière-".repeat(gA - 2)}${f ? "arrière-grand-mère" : "arrière-grand-père"} (${gA}e génération ascendante)`;
  }
  const diff = Math.abs(gA - gB);
  const minG = Math.min(gA, gB);
  if (minG === 1 && diff === 0) {
    if (siblingType === "consanguin") return f ? "sa sœur consanguine (même père)" : "son frère consanguin (même père)";
    if (siblingType === "utérin") return f ? "sa sœur utérine (même mère)" : "son frère utérin (même mère)";
    return f ? "sa sœur germaine (même père et même mère)" : "son frère germain (même père et même mère)";
  }
  if (minG === 1 && diff >= 1) {
    // l'un est oncle/tante de l'autre
    const label = f ? "tante" : "oncle";
    if (gA < gB) {
      // A est frère/sœur d'un ancêtre de B -> A est oncle/tante de B, donc B est neveu/nièce
      return diff === 1 ? (f ? "sa nièce" : "son neveu") : `${"petit-".repeat(diff - 1)}${f ? "petite-nièce" : "petit-neveu"} (à ${diff} générations d'écart)`;
    } else {
      return diff === 1 ? (f ? "sa tante" : "son oncle") : `${"grand-".repeat(diff - 1)}${label} (à ${diff} générations d'écart)`;
    }
  }
  if (minG >= 2 && diff === 0) {
    const degre = minG - 1;
    const noms = { 1: "cousins germains (1er degré)", 2: "cousins issus de germains (2e degré)" };
    return `${f ? "cousine" : "cousin"} — ${noms[degre] || `cousinage au ${degre}e degré`}`;
  }
  return `${f ? "cousine" : "cousin"} éloigné·e (branches à ${gA} et ${gB} générations de l'ancêtre commun)`;
}

function ancestorDistances(id) {
  // BFS remontant via père ET mère : Map(ancêtreId -> distance minimale)
  const dist = new Map();
  dist.set(id, 0);
  const queue = [id];
  let qi = 0;
  while (qi < queue.length) {
    const cur = queue[qi++];
    const d = dist.get(cur);
    const p = byId[cur];
    if (!p) continue;
    const parents = [p.father, p.mother].filter(Boolean);
    for (const par of parents) {
      if (!dist.has(par)) {
        dist.set(par, d + 1);
        queue.push(par);
      }
    }
  }
  return dist;
}

function sideOf(id, ancestorId) {
  // Détermine si ancestorId se trouve du côté paternel ou maternel de id (à la première bifurcation)
  const p = byId[id];
  if (!p || id === ancestorId) return null;
  const distFather = p.father ? ancestorDistances(p.father) : null;
  const distMother = p.mother ? ancestorDistances(p.mother) : null;
  const viaFather = distFather && distFather.has(ancestorId);
  const viaMother = distMother && distMother.has(ancestorId);
  if (viaFather && !viaMother) return "paternel";
  if (viaMother && !viaFather) return "maternel";
  return null;
}

function pathToAncestor(fromId, ancestorId) {
  // Reconstruit la chaîne ORDONNÉE (via père ou mère) menant de fromId à ancestorId :
  // retourne [fromId, ..., ancestorId].
  if (fromId === ancestorId) return [fromId];
  const path = [fromId];
  let cur = fromId;
  const seen = new Set();
  for (let i = 0; i < 20; i++) {
    if (cur === ancestorId) break;
    if (seen.has(cur)) break;
    seen.add(cur);
    const p = byId[cur];
    if (!p) break;
    let next = null;
    if (p.father && (p.father === ancestorId || ancestorDistances(p.father).has(ancestorId))) next = p.father;
    else if (p.mother && (p.mother === ancestorId || ancestorDistances(p.mother).has(ancestorId))) next = p.mother;
    if (!next) break;
    path.push(next);
    cur = next;
  }
  return path;
}

function findAllBloodRelations(idA, idB) {
  // Cherche TOUS les ancêtres communs (via père ou mère) entre A et B — permet de
  // détecter des liens de sang multiples (ex. cousins à la fois côté père et côté mère).
  if (idA === idB) return [];
  const distA = ancestorDistances(idA);
  const distB = ancestorDistances(idB);
  const candidates = [];
  for (const [anc, gA] of distA) {
    if (distB.has(anc)) candidates.push({ lca: anc, gA, gB: distB.get(anc) });
  }
  candidates.sort((x, y) => x.gA + x.gB - (y.gA + y.gB));
  // Filtre de Pareto : on retire les ancêtres communs "redondants" (déjà impliqués
  // par un ancêtre commun strictement plus proche des deux côtés), pour ne garder
  // que les relations réellement informatives (y compris les doubles liens).
  const kept = [];
  for (const c of candidates) {
    const dominated = kept.some((k) => k.gA <= c.gA && k.gB <= c.gB && (k.gA < c.gA || k.gB < c.gB));
    if (!dominated) kept.push(c);
  }
  return kept.slice(0, 10);
}

// Recherche tous les chemins simples (sang + alliance) entre deux personnes, PAR PROFONDEUR
// CROISSANTE (1, 2, 3... jusqu'à 15) — garantit que les chemins les plus courts sont trouvés
// en premier, plutôt qu'une DFS qui peut se remplir de chemins longs avant les courts.
// Déduplique aussi les variantes qui ne diffèrent que par le choix d'un frère/sœur en cours de
// route (même signature de types d'arêtes = un seul exemple conservé).
function findAllPaths(startId, endId, maxDepth = 15, maxPaths = 10) {
  const results = [];
  const seenSignatures = new Set();

  function dfsAtDepth(limit) {
    const visited = new Set([startId]);
    const path = [startId];
    const edgeTypes = [];
    function dfs() {
      if (results.length >= maxPaths) return;
      const cur = path[path.length - 1];
      if (cur === endId && path.length > 1) {
        const sig = edgeTypes.join(",");
        if (!seenSignatures.has(sig)) {
          seenSignatures.add(sig);
          results.push({ path: [...path], edgeTypes: [...edgeTypes] });
        }
        return;
      }
      if (path.length - 1 >= limit) return;
      const neighbors = GRAPH[cur] || [];
      for (const { to, type } of neighbors) {
        if (visited.has(to)) continue;
        if (results.length >= maxPaths) return;
        visited.add(to);
        path.push(to);
        edgeTypes.push(type);
        dfs();
        edgeTypes.pop();
        path.pop();
        visited.delete(to);
      }
    }
    dfs();
  }

  // Profondeur croissante : dès qu'on a trouvé au moins un chemin à une profondeur donnée,
  // on explore encore un cran de plus (pour capter des variantes courtes alternatives) puis on
  // s'arrête, plutôt que de continuer jusqu'à 15 systématiquement.
  let foundAtDepth = null;
  for (let d = 1; d <= maxDepth; d++) {
    const before = results.length;
    dfsAtDepth(d);
    if (results.length > before && foundAtDepth === null) {
      foundAtDepth = d;
    }
    if (foundAtDepth !== null && d >= foundAtDepth + 2) break;
    if (results.length >= maxPaths) break;
  }
  results.sort((a, b) => a.path.length - b.path.length);
  return results;
}

function ChainNode({ id, onSelect, highlight }) {
  const p = byId[id];
  if (!p) return <div className="pedigree-node pedigree-empty">؟</div>;
  return (
    <button className={`pedigree-node ${p.g === "F" ? "pedigree-f" : "pedigree-m"} ${highlight ? "pedigree-hl" : ""}`} onClick={() => onSelect(id)} title={p.name}>
      <span className="pedigree-node-name">{p.name}{isUnnamed(p.name) && " (X)"}</span>
      {p.dates && <span className="pedigree-node-dates">{p.dates}</span>}
    </button>
  );
}

// Arbre reliant réellement A et B : l'ancêtre commun (LCA) en haut, puis deux branches qui
// redescendent chacune jusqu'à A et jusqu'à B respectivement.
function RelationLcaTree({ personA, personB, lca, onSelect }) {
  const chainA = pathToAncestor(personA, lca); // [personA, ..., lca]
  const chainB = pathToAncestor(personB, lca); // [personB, ..., lca]
  const downToA = [...chainA].reverse().slice(1); // du dessous du LCA jusqu'à A
  const downToB = [...chainB].reverse().slice(1); // du dessous du LCA jusqu'à B
  return (
    <div className="pedigree-wrap">
      <div className="pedigree-header">
        <span>شجرة الرابط — Arbre reliant {byId[personA]?.name} et {byId[personB]?.name} (ancêtre commun en haut)</span>
      </div>
      <div className="pedigree-scroll">
        <div className="relpath-root">
          <ChainNode id={lca} onSelect={onSelect} highlight />
          <div className="relpath-branches">
            <div className="relpath-branch">
              {downToA.map((id) => (
                <React.Fragment key={id}>
                  <div className="relpath-connector" />
                  <ChainNode id={id} onSelect={onSelect} highlight={id === personA} />
                </React.Fragment>
              ))}
              {downToA.length === 0 && <div className="relpath-connector" />}
            </div>
            <div className="relpath-branch">
              {downToB.map((id) => (
                <React.Fragment key={id}>
                  <div className="relpath-connector" />
                  <ChainNode id={id} onSelect={onSelect} highlight={id === personB} />
                </React.Fragment>
              ))}
              {downToB.length === 0 && <div className="relpath-connector" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Chaîne linéaire pour un "chemin complet" (peut inclure des mariages, donc pas une pure
// remontée d'ancêtres) : affiche simplement la séquence exacte trouvée, dans l'ordre.
function LinearPathChain({ path, onSelect }) {
  return (
    <div className="pedigree-wrap">
      <div className="pedigree-header">
        <span>سلسلة الرابط — Chaîne du chemin (سلسلة كاملة تشمل الزيجات إن وجدت)</span>
      </div>
      <div className="pedigree-scroll">
        <div className="relpath-linear">
          {path.map((id, i) => (
            <React.Fragment key={id}>
              {i > 0 && <div className="relpath-connector relpath-connector-h" />}
              <ChainNode id={id} onSelect={onSelect} highlight={i === 0 || i === path.length - 1} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function describePath(res) {
  const steps = [];
  for (let i = 0; i < res.path.length - 1; i++) {
    const from = byId[res.path[i]];
    const to = byId[res.path[i + 1]];
    const type = res.edgeTypes[i];
    // Le verbe qualifie le SUJET (from), pas la destination (to).
    let verb;
    if (type === "parent") verb = `est ${from.g === "F" ? "la fille" : "le fils"} de`;
    if (type === "enfant") verb = `est ${from.g === "F" ? "la mère" : "le père"} de`;
    if (type === "epoux") verb = `est ${from.g === "F" ? "l'épouse" : "l'époux"} de`;
    steps.push({ from: fullName(from), verb, to: fullName(to), type });
  }
  return steps;
}

/* ============================================================================
   COMPOSANTS UI
============================================================================ */

function Ornament() {
  return (
    <svg viewBox="0 0 200 16" className="ornament" aria-hidden="true">
      <line x1="0" y1="8" x2="70" y2="8" stroke="currentColor" strokeWidth="1" />
      <polygon points="100,1 108,8 100,15 92,8" fill="currentColor" />
      <line x1="130" y1="8" x2="200" y2="8" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function PersonPill({ id, onClick, highlight }) {
  const p = byId[id];
  if (!p) return null;
  return (
    <button className={`pill ${highlight ? "pill-hl" : ""}`} onClick={() => onClick(id)}>
      {p.name}
    </button>
  );
}

function PersonDetail({ id, onSelect, onMerge, onSetField, debug }) {
  const p = byId[id];
  const [action, setAction] = useState(null); // null | 'merge' | 'father' | 'mother' | 'edit'
  const [target, setTarget] = useState(null);
  const [note, setNote] = useState("");
  const [editFields, setEditFields] = useState(null);

  if (!p) return <div className="detail-empty">Sélectionnez une personne dans l'arbre ou la recherche.</div>;
  const children = PEOPLE.filter((c) => c.father === id);
  const chain = ancestryChain(id).slice(1); // exclut soi-même
  const spouses = (p.spouses || []).map((s) => byId[s]).filter(Boolean);

  const resetAction = () => { setAction(null); setTarget(null); setNote(""); setEditFields(null); };
  const confirmMerge = () => {
    if (!target) return;
    const husbandId = (p.spouses || [])[0];
    const snapshot = {
      dupName: p.name,
      dupSpouseId: husbandId || null,
      dupSpouseName: husbandId ? byId[husbandId]?.name || null : null,
    };
    onMerge(id, target, note || `Doublon signalé manuellement (${p.name} = ${byId[target]?.name})`, snapshot);
    resetAction();
  };
  const confirmSetField = (field) => {
    if (!target) return;
    onSetField(id, field, target, note || `${field === "father" ? "Père" : "Mère"} corrigé(e) manuellement`);
    resetAction();
  };
  const confirmAddSpouse = () => {
    if (!target) return;
    const current = p.spouses || [];
    if (current.includes(target)) { resetAction(); return; }
    onSetField(id, "spouses", [...current, target], note || `Époux/épouse ajouté(e) manuellement (${byId[target]?.name})`);
    resetAction();
  };
  const removeSpouse = (spouseId) => {
    const current = p.spouses || [];
    onSetField(id, "spouses", current.filter((s) => s !== spouseId), `Époux/épouse retiré(e) manuellement (${byId[spouseId]?.name})`);
  };
  const startEdit = () => {
    setEditFields({ name: p.name || "", dates: p.dates || "", place: p.place || "", g: p.g || "M" });
    setAction("edit");
  };
  const confirmEdit = () => {
    if (!editFields) return;
    const fieldLabels = { name: "Prénom", dates: "Dates", place: "Lieu", g: "Sexe" };
    for (const field of ["name", "dates", "place", "g"]) {
      const newVal = editFields[field];
      const oldVal = p[field] || "";
      if (newVal !== oldVal) {
        onSetField(id, field, newVal, note || `${fieldLabels[field]} modifié manuellement`);
      }
    }
    resetAction();
  };

  return (
    <div className="detail">
      <div className="detail-header">
        <div className="detail-eyebrow">
          {p.g === "F" ? "امرأة · Femme" : "رجل · Homme"} · الجيل {generationNumber(id)}
          {p.para ? ` · ف.${p.para}` : ""}
          {familyOf(id) && familyOf(id).key !== "tribe" ? ` · ${familyOf(id).label}` : ""}
        </div>
        <h2 className="detail-name">
          {p.name}
          {isUnnamed(p.name) && <span className="badge-unknown badge-unknown-lg" title="اسمها غير مسجّل في المصدر الأصلي — Identité non enregistrée dans le document source">X</span>}
          {p.ext && <span className="badge-ext" title="ينتمي إلى قبيلة خارج قبيلة سيد الفالي — Lignée extérieure à la tribu">قبيلة خارجية{p.tribe ? ` · ${p.tribe}` : ""}</span>}
          {p.src && <span className="badge-src" title="شخص مستخرج من سلسلة نسب مذكورة في المصدر، وليس من فقرة مستقلة — Ascendant reconstitué à partir d'une chaîne de filiation">سلسلة نسب</span>}
        </h2>
        {displayFullName(p) && <div className="detail-fullname">{displayFullName(p)}</div>}
        {isUnnamed(p.name) && <div className="detail-unknown-note">اسم غير مسجَّل في الوثيقة الأصلية — Identité non précisée dans le document source (désignation générique).</div>}
        {p.src && <div className="detail-ext-note">النجمة (*) تعني أن هذا الشخص لم يرد في فقرة مستقلة، بل استُخرج من سلسلة نسب — L'astérisque signale une généalogie reconstituée ex nihilo à partir d'une chaîne de filiation.</div>}
        {p.ext && <div className="detail-ext-note">هذا الشخص من قبيلة خارجية{p.tribe ? ` (${p.tribe})` : ""}، أُدرج لأنه ورد ضمن سلسلة نسب أحد أفراد القبيلة — Personne extérieure à la tribu, présente uniquement via une chaîne de filiation.</div>}
        {debug && (
          <div className="dbg-box">
            <div><b>id</b> {p.id}{p.para ? <> · <b>الفقرة</b> {p.para}</> : null}{familyOf(p.id) ? <> · <b>famille</b> {familyOf(p.id).key}</> : null}</div>
            <div><b>father</b> {p.father || "—"} · <b>mother</b> {p.mother || "—"}</div>
            {p.spouses && p.spouses.length > 0 && <div><b>spouses</b> {p.spouses.join(", ")}</div>}
            <div>{p.src ? <><b>src</b> {p.src} · </> : null}{p.ext ? <><b>ext</b> true · </> : null}{p.tribe ? <><b>tribe</b> {p.tribe} · </> : null}{p.crossLink ? <b>crossLink</b> : null}</div>
          </div>
        )}
        {p.dates && <div className="detail-dates">{p.dates}</div>}
        {p.place && <div className="detail-place">📍 {p.place}</div>}
        {p.note && <div className="detail-note">{p.note}</div>}
      </div>

      {chain.length > 0 && (
        <div className="detail-block">
          <div className="detail-block-title">Filiation (remontée par le père)</div>
          <div className="chain-row">
            {chain.map((cid, i) => (
              <React.Fragment key={cid}>
                {i > 0 && <span className="chain-sep">←</span>}
                <PersonPill id={cid} onClick={onSelect} />
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {p.mother && byId[p.mother] && (
        <div className="detail-block">
          <div className="detail-block-title">الأم — Mère</div>
          <div className="chain-row">
            <PersonPill id={p.mother} onClick={onSelect} highlight={byId[p.mother].crossLink} />
          </div>
        </div>
      )}

      {(spouses.length > 0 || onMerge) && (
        <div className="detail-block">
          <div className="detail-block-title">Époux / Épouse(s)</div>
          <div className="chain-row">
            {spouses.map((s) => (
              <span key={s.id} className="spouse-pill-wrap">
                <PersonPill id={s.id} onClick={onSelect} highlight={s.crossLink} />
                {onMerge && (
                  <button className="spouse-remove-btn" title="Retirer ce lien d'époux/épouse" onClick={() => removeSpouse(s.id)}>✕</button>
                )}
              </span>
            ))}
            {onMerge && !action && (
              <button className="correct-btn correct-btn-sm" onClick={() => setAction("spouse")}>➕ Ajouter</button>
            )}
          </div>
          {p.extraSpouses && (
            <div className="extra-note">Autres épouses mentionnées : {p.extraSpouses.join(" · ")}</div>
          )}
          {action === "spouse" && (
            <div className="correct-form" style={{ marginTop: 10 }}>
              <div className="correct-form-label">Ajouter un époux / une épouse à {p.name} :</div>
              <PersonPicker label="" value={target} onChange={setTarget} placeholder="Nom, ou chaîne : أحمد محمد علي…" />
              <input
                className="correct-note-input"
                placeholder="Note / justification (optionnel)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="correct-form-actions">
                <button className="correct-confirm-btn" disabled={!target} onClick={confirmAddSpouse}>Confirmer</button>
                <button className="correct-cancel-btn" onClick={resetAction}>Annuler</button>
              </div>
            </div>
          )}
        </div>
      )}

      {children.length > 0 && (
        <div className="detail-block">
          <div className="detail-block-title">Enfants ({children.length})</div>
          <div className="chain-row">
            {children
              .sort((a, b) => (a.para || 999) - (b.para || 999))
              .map((c) => (
                <PersonPill key={c.id} id={c.id} onClick={onSelect} />
              ))}
          </div>
        </div>
      )}

      {onMerge && (
        <div className="detail-block detail-correct-block">
          <div className="detail-block-title">✏️ Corriger cette fiche</div>
          {!action && (
            <div className="correct-actions">
              <button className="correct-btn" onClick={startEdit}>📝 Modifier les informations</button>
              <button className="correct-btn" onClick={() => setAction("merge")}>🔗 Signaler un doublon</button>
              <button className="correct-btn" onClick={() => setAction("father")}>👨 Corriger le père</button>
              <button className="correct-btn" onClick={() => setAction("mother")}>👩 Corriger la mère</button>
            </div>
          )}
          {action === "edit" && editFields && (
            <div className="correct-form">
              <div className="correct-form-label">Modifier les informations de {p.name} :</div>
              <label className="edit-field-label">
                الاسم — Prénom
                <input
                  className="correct-note-input"
                  value={editFields.name}
                  onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                />
              </label>
              <label className="edit-field-label">
                التواريخ — Dates (ex. 1360هـ/1941م – 1420هـ/1999م)
                <input
                  className="correct-note-input"
                  value={editFields.dates}
                  onChange={(e) => setEditFields({ ...editFields, dates: e.target.value })}
                  placeholder="laisser vide si inconnu"
                />
              </label>
              <label className="edit-field-label">
                مكان الوفاة — Lieu
                <input
                  className="correct-note-input"
                  value={editFields.place}
                  onChange={(e) => setEditFields({ ...editFields, place: e.target.value })}
                  placeholder="laisser vide si inconnu"
                />
              </label>
              <label className="edit-field-label">
                الجنس — Sexe
                <select
                  className="correct-note-input"
                  value={editFields.g}
                  onChange={(e) => setEditFields({ ...editFields, g: e.target.value })}
                >
                  <option value="M">رجل — Homme</option>
                  <option value="F">امرأة — Femme</option>
                </select>
              </label>
              <input
                className="correct-note-input"
                placeholder="Note / justification (optionnel)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="correct-form-actions">
                <button className="correct-confirm-btn" onClick={confirmEdit}>Enregistrer</button>
                <button className="correct-cancel-btn" onClick={resetAction}>Annuler</button>
              </div>
            </div>
          )}
          {action && action !== "edit" && action !== "spouse" && (
            <div className="correct-form">
              <div className="correct-form-label">
                {action === "merge" && `${p.name} est en réalité la même personne que :`}
                {action === "father" && `Le vrai père de ${p.name} est :`}
                {action === "mother" && `La vraie mère de ${p.name} est :`}
              </div>
              <PersonPicker label="" value={target} onChange={setTarget} placeholder="Nom, ou chaîne : أحمد محمد علي…" />
              <input
                className="correct-note-input"
                placeholder="Note / justification (optionnel)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="correct-form-actions">
                <button
                  className="correct-confirm-btn"
                  disabled={!target}
                  onClick={() => (action === "merge" ? confirmMerge() : confirmSetField(action))}
                >
                  Confirmer
                </button>
                <button className="correct-cancel-btn" onClick={resetAction}>Annuler</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PersonPicker({ label, value, onChange, placeholder }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const results = useMemo(() => searchByGenealogyChain(q, 14), [q]);
  const selected = value ? byId[value] : null;

  return (
    <div className="picker">
      <label className="picker-label">{label}</label>
      <div className="picker-input-wrap">
        <input
          className="picker-input"
          value={selected ? selected.name : q}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(null);
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        {selected && (
          <button className="picker-clear" onClick={() => { onChange(null); setQ(""); }}>
            ×
          </button>
        )}
      </div>
      {open && results.length > 0 && !selected && (
        <div className="picker-dropdown">
          {results.map((r) => (
            <button
              key={r.id}
              className="picker-option"
              onClick={() => {
                onChange(r.id);
                setQ("");
                setOpen(false);
              }}
            >
              <span className="picker-option-main">
                <span>{r.name}</span>
                {isUnnamed(r.name) && <span className="badge-unknown badge-unknown-sm" title="اسمها غير مسجّل">X</span>}
                <span className="picker-option-father">
                  {ancestryChain(r.id).slice(1, 5).map((aid) => byId[aid]?.name).filter(Boolean).join(" ← ")}
                </span>
              </span>
              <span className="picker-option-tags">
                {familyOf(r.id) && familyOf(r.id).key !== "tribe" && (
                  <span className={`tree-fam tree-fam-${familyOf(r.id).key}`}>{familyShortLabel(familyOf(r.id).key)}</span>
                )}
                {r.para && <span className="picker-option-para">ف.{r.para}</span>}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RelationFinder({ onSelectPerson }) {
  const [a, setA] = useState(null);
  const [b, setB] = useState(null);
  const [result, setResult] = useState(null);
  const [pedigreeFocus, setPedigreeFocus] = useState(null); // { type: "lca", personA, personB, lca } | { type: "path", path }

  const run = useCallback(() => {
    if (!a || !b || a === b) return;
    let bloods = findAllBloodRelations(a, b);
    // Regrouper les cas frère/sœur (gA=gB=1) : si deux ancêtres communs distincts existent à
    // cette distance (père ET mère partagés), c'est un frère/sœur germain ; sinon consanguin
    // (père commun seul) ou utérin (mère commune seule), déterminé via le rôle du LCA.
    const siblingEntries = bloods.filter((r) => r.gA === 1 && r.gB === 1);
    if (siblingEntries.length > 0) {
      const pa = byId[a];
      let siblingType = "germain";
      if (siblingEntries.length === 1) {
        const lca = siblingEntries[0].lca;
        if (pa && pa.father === lca) siblingType = "consanguin";
        else if (pa && pa.mother === lca) siblingType = "utérin";
      }
      const merged = { ...siblingEntries[0], siblingType, lcas: siblingEntries.map((r) => r.lca) };
      bloods = [merged, ...bloods.filter((r) => !(r.gA === 1 && r.gB === 1))];
    }
    const paths = findAllPaths(a, b);
    setResult({ bloods, paths });
    setPedigreeFocus(null);
  }, [a, b]);

  const showPedigreeForBlood = (rel) => {
    setPedigreeFocus({ type: "lca", personA: a, personB: b, lca: rel.lca });
  };

  const showPedigreeForPath = (res) => {
    setPedigreeFocus({ type: "path", path: res.path });
  };

  return (
    <div className="finder">
      <div className="finder-title">
        <Ornament />
        <span>مقارنة القرابة — Comparateur de parenté</span>
        <Ornament />
      </div>
      <div className="finder-grid">
        <PersonPicker label="Personne A" value={a} onChange={setA} placeholder="Nom, ou chaîne : أحمد محمد علي…" />
        <PersonPicker label="Personne B" value={b} onChange={setB} placeholder="Nom, ou chaîne : أحمد محمد علي…" />
      </div>
      <button className="finder-btn" disabled={!a || !b || a === b} onClick={run}>
        Trouver tous les liens de parenté
      </button>

      {result && (
        <div className="finder-results">
          {result.bloods.length > 0 ? (
            result.bloods.map((rel, i) => (
              <div className="result-blood result-blood-clickable" key={i} onClick={() => showPedigreeForBlood(rel)} title="Cliquer pour voir l'arbre généalogique du chemin">
                <div className="result-blood-title">
                  Lien de sang {result.bloods.length > 1 ? `#${i + 1}` : "direct"}
                  {i === 0 && result.bloods.length > 1 ? " (le plus proche)" : ""}
                  <span className="result-blood-hint">🌳 voir l'arbre</span>
                </div>
                <p>
                  <strong>{byId[b]?.name}</strong> est {bloodRelationLabel(rel.gA, rel.gB, byId[b]?.g, rel.siblingType)}
                  {rel.gB === 0 && rel.gA >= 2 && sideOf(a, rel.lca) && ` (côté ${sideOf(a, rel.lca)})`}
                  {rel.gA === 0 && rel.gB >= 2 && sideOf(b, rel.lca) && ` (côté ${sideOf(b, rel.lca)})`}
                  {" "}de{" "}
                  <strong>{byId[a]?.name}</strong>.
                </p>
                <p className="result-blood-sub">
                  {rel.lcas ? (
                    <>Ancêtres communs : {rel.lcas.map((l, li) => (
                      <React.Fragment key={l}>
                        {li > 0 && " et "}
                        <PersonPill id={l} onClick={onSelectPerson} />
                      </React.Fragment>
                    ))}</>
                  ) : (
                    <>Ancêtre commun : <PersonPill id={rel.lca} onClick={onSelectPerson} /></>
                  )}
                  {" "}— {byId[a]?.name} s'en écarte de {rel.gA} génération(s), {byId[b]?.name} de {rel.gB} génération(s).
                </p>
              </div>
            ))
          ) : (
            <div className="result-blood result-blood-none">Aucun lien de sang (par père ou par mère) trouvé entre ces deux personnes dans l'arbre.</div>
          )}

          <div className="result-block-title">
            Tous les chemins de parenté trouvés dans l'arbre ({result.paths.length}) — sang et alliance confondus
          </div>
          {result.paths.length === 0 && <div className="result-empty">Aucun chemin trouvé (personnes non reliées dans les données disponibles).</div>}
          {result.paths.map((res, idx) => (
            <div className="path-card path-card-clickable" key={idx} onClick={() => showPedigreeForPath(res)} title="Cliquer pour voir l'arbre généalogique de ce chemin">
              <div className="path-card-head">Chemin {idx + 1} · {res.path.length - 1} lien(s) <span className="result-blood-hint">🌳 voir l'arbre</span></div>
              <ol className="path-steps">
                {describePath(res).map((s, i) => (
                  <li key={i}>
                    <span className={s.type === "epoux" ? "step-alliance" : "step-blood"}>{s.from}</span>
                    {" "}{s.verb}{" "}
                    <span className={s.type === "epoux" ? "step-alliance" : "step-blood"}>{s.to}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}

          {pedigreeFocus && pedigreeFocus.type === "lca" && (
            <RelationLcaTree personA={pedigreeFocus.personA} personB={pedigreeFocus.personB} lca={pedigreeFocus.lca} onSelect={onSelectPerson} />
          )}
          {pedigreeFocus && pedigreeFocus.type === "path" && (
            <LinearPathChain path={pedigreeFocus.path} onSelect={onSelectPerson} />
          )}
        </div>
      )}
    </div>
  );
}

function isLongChainName(name) {
  // Detecte les noms qui contiennent encore une chaine de filiation non resolue
  // (typiquement "فلانة بنت X بن Y بن Z...") plutôt qu'un simple prénom.
  if (!name) return false;
  const chainMarkers = (name.match(/\bبن\b|\bبنت\b/g) || []).length;
  return chainMarkers >= 2 || name.length > 25;
}

function DataQualityPanel({ onSelectPerson }) {
  const [subTab, setSubTab] = useState("noparents");

  const noFather = [];
  const noMother = [];
  const longNames = [];
  for (const p of PEOPLE) {
    // Les personnes hors du périmètre tribal (lignées alliées ou étrangères) sont
    // exclues : leur filiation n'a pas vocation à être documentée ici, et leur nom
    // conserve légitimement la chaîne généalogique qui permet de les identifier.
    if (p.ext) continue;
    if (!p.father) noFather.push(p);
    if (p.g === "F" && p.father && !p.mother) noMother.push(p);
    if (isLongChainName(p.name)) longNames.push(p);
  }
  // tri : par prefixe de famille puis id, pour une lecture plus naturelle
  const sortFn = (a, b) => a.id.localeCompare(b.id, "en", { numeric: true });
  noFather.sort(sortFn);
  noMother.sort(sortFn);
  longNames.sort(sortFn);

  const lists = {
    noparents: { title: `بدون أب أو أم — Sans père ou sans mère`, items: null },
    longnames: { title: `أسماء تحتاج مراجعة — Prénoms à réviser (chaîne de filiation non résolue)`, items: longNames },
  };

  return (
    <div className="quality-panel">
      <div className="quality-header">
        <h2>فحص جودة البيانات — Vérification qualité des données</h2>
        <p className="quality-sub">Ces listes aident à repérer les personnes dont l'identité ou la filiation reste incomplète. Les lignées extérieures à la tribu en sont exclues — لا تشمل هذه القوائم من هم خارج نطاق القبيلة.</p>
      </div>
      <div className="quality-subtabs">
        <button className={`quality-subtab ${subTab === "noparents" ? "quality-subtab-active" : ""}`} onClick={() => setSubTab("noparents")}>
          بدون أب/أم ({noFather.length + noMother.length})
        </button>
        <button className={`quality-subtab ${subTab === "longnames" ? "quality-subtab-active" : ""}`} onClick={() => setSubTab("longnames")}>
          أسماء طويلة ({longNames.length})
        </button>
      </div>

      {subTab === "noparents" && (
        <div className="quality-body">
          <div className="quality-section">
            <div className="quality-section-title">بدون أب — Sans père enregistré ({noFather.length})</div>
            <div className="quality-note">Racines de familles (normal) et personnes dont le père n'a pas été identifié dans le document source.</div>
            <div className="quality-pills">
              {noFather.map((p) => (
                <button key={p.id} className="quality-pill" onClick={() => onSelectPerson(p.id)} title={p.id}>
                  {p.name}{isUnnamed(p.name) && " (X)"}
                </button>
              ))}
            </div>
          </div>
          <div className="quality-section">
            <div className="quality-section-title">بدون أم — Sans mère enregistrée, mais avec père connu ({noMother.length})</div>
            <div className="quality-note">Femmes dont le père a plusieurs épouses (ou aucune identifiée) — la bonne mère reste à déterminer.</div>
            <div className="quality-pills">
              {noMother.map((p) => (
                <button key={p.id} className="quality-pill" onClick={() => onSelectPerson(p.id)} title={p.id}>
                  {p.name}{isUnnamed(p.name) && " (X)"} — {byId[p.father]?.name || "?"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {subTab === "longnames" && (
        <div className="quality-body">
          <div className="quality-section">
            <div className="quality-section-title">{lists.longnames.title} ({longNames.length})</div>
            <div className="quality-note">Le prénom contient encore une chaîne de filiation complète (« بنت X بن Y بن Z... ») au lieu d'un simple prénom — signe qu'elle n'a pas encore été rattachée à un père existant dans l'arbre.</div>
            <div className="quality-pills">
              {longNames.map((p) => (
                <button key={p.id} className="quality-pill quality-pill-long" onClick={() => onSelectPerson(p.id)} title={p.id}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="quality-section quality-version-log">
        <div className="quality-section-title">سجل الإصدارات — Journal de version (actuel : v{APP_VERSION}, {APP_VERSION_DATE})</div>
        <ol className="version-log-list">
          {APP_VERSION_LOG.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function CorrectionsPanel({ userCorrections, onRemove, onSelectPerson }) {
  const total = userCorrections.merges.length + userCorrections.setField.length;
  const exportText = JSON.stringify(userCorrections, null, 2);
  const [copied, setCopied] = useState(false);
  const [unresolvedFilter, setUnresolvedFilter] = useState("");

  const copyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { /* presse-papier indisponible */ }
  };

  const unresolvedWives = useMemo(() => {
    return PEOPLE.filter((p) => p.g === "F" && !p.father && !isUnnamed(p.name) && (p.name || "").includes("بن"))
      .filter((p) => !unresolvedFilter || p.name.includes(unresolvedFilter));
  }, [unresolvedFilter, PEOPLE]);

  return (
    <div className="finder">
      <div className="finder-title">
        <Ornament />
        <span>التصحيحات — Corrections manuelles</span>
        <Ornament />
      </div>

      <p className="corrections-intro">
        Corrections que vous avez signalées vous-même dans l'arbre (fusions de doublons, filiations corrigées).
        Elles sont enregistrées automatiquement et s'appliquent à chaque ouverture de l'application. Utilisez
        « Exporter » pour envoyer la liste à Claude afin de les intégrer définitivement aux données de base.
      </p>

      {total === 0 && <div className="result-empty">Aucune correction enregistrée pour l'instant. Ouvrez une fiche personne et utilisez « ✏️ Corriger cette fiche ».</div>}

      {userCorrections.merges.length > 0 && (
        <div className="result-block-title">Fusions de doublons ({userCorrections.merges.length})</div>
      )}
      {userCorrections.merges.map((m, i) => (
        <div className="path-card" key={"m" + i}>
          <div className="path-card-head">Fusion</div>
          <div className="correction-row">
            {byId[m.dupId] ? (
              <PersonPill id={m.dupId} onClick={onSelectPerson} />
            ) : (
              <span className="merged-away-label" title="Cette fiche a été fusionnée — voici son identité et son époux au moment de la fusion">
                {m.dupName || "(personne fusionnée)"}
                {m.dupSpouseName && <> — épouse de <strong>{m.dupSpouseName}</strong></>}
              </span>
            )}
            <span>→ fusionné dans →</span> <PersonPill id={m.keepId} onClick={onSelectPerson} />
          </div>
          {m.note && <div className="correction-note">{m.note}</div>}
          <div className="correction-meta">{m.date}</div>
          <button className="correct-cancel-btn" onClick={() => onRemove("merges", i)}>Annuler cette fusion</button>
        </div>
      ))}

      {userCorrections.setField.length > 0 && (
        <div className="result-block-title">Filiations et informations corrigées ({userCorrections.setField.length})</div>
      )}
      {userCorrections.setField.map((s, i) => {
        const isPersonField = s.field === "father" || s.field === "mother";
        const fieldLabel = { father: "Père corrigé", mother: "Mère corrigée", name: "Prénom modifié", dates: "Dates modifiées", place: "Lieu modifié", g: "Sexe modifié" }[s.field] || `Champ « ${s.field} » corrigé`;
        return (
          <div className="path-card" key={"s" + i}>
            <div className="path-card-head">{fieldLabel}</div>
            <div className="correction-row">
              <PersonPill id={s.id} onClick={onSelectPerson} /> <span>→ {s.field} →</span>{" "}
              {isPersonField ? <PersonPill id={s.value} onClick={onSelectPerson} /> : <strong>{s.value || "(vide)"}</strong>}
            </div>
            {s.note && <div className="correction-note">{s.note}</div>}
            <div className="correction-meta">{s.date}</div>
            <button className="correct-cancel-btn" onClick={() => onRemove("setField", i)}>Annuler cette correction</button>
          </div>
        );
      })}

      {total > 0 && (
        <div className="corrections-export">
          <button className="finder-btn" onClick={copyExport}>{copied ? "✓ Copié !" : "📋 Exporter (copier en JSON)"}</button>
          <textarea className="corrections-export-area" readOnly value={exportText} />
        </div>
      )}

      <div className="result-block-title" style={{ marginTop: 30 }}>
        Épouses à filiation connue mais non rattachées ({unresolvedWives.length})
      </div>
      <p className="corrections-intro">
        Ces femmes ont une filiation partiellement décrite dans le document source (« بنت فلان بن فلان… ») mais
        n'ont pas été reliées automatiquement à leur père réel dans l'arbre — soit parce qu'aucune correspondance
        fiable n'a été trouvée, soit parce que sa famille n'est pas encore intégrée. Cliquez sur une fiche puis
        utilisez « ✏️ Corriger cette fiche → Corriger le père » pour la relier vous-même si vous la reconnaissez.
      </p>
      <input
        className="filter-input"
        style={{ marginBottom: 12 }}
        placeholder="Filtrer par nom…"
        value={unresolvedFilter}
        onChange={(e) => setUnresolvedFilter(e.target.value)}
      />
      <div className="unresolved-list">
        {unresolvedWives.slice(0, 200).map((p) => (
          <PersonPill key={p.id} id={p.id} onClick={onSelectPerson} />
        ))}
      </div>
      {unresolvedWives.length > 200 && <div className="correction-meta">… et {unresolvedWives.length - 200} de plus (affinez le filtre)</div>}
    </div>
  );
}

/* ============================================================================
   APP
============================================================================ */

const CORRECTIONS_STORAGE_KEY = "sidi-elvali-user-corrections";

export default function App() {
  const [selectedId, setSelectedId] = useState("P1");
  const [hideExt, setHideExt] = useState(true);
  const [debug, setDebug] = useState(false);
  const [tab, setTab] = useState("tree"); // 'tree' | 'finder' | 'corrections'
  const [userCorrections, setUserCorrections] = useState({ merges: [], setField: [] });
  const [datasetVersion, setDatasetVersion] = useState(0);
  const [correctionsLoaded, setCorrectionsLoaded] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const familyChartData = useMemo(() => toFamilyChartData(PEOPLE, { hideExt }), [datasetVersion, hideExt]);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(CORRECTIONS_STORAGE_KEY, false);
        const loaded = res && res.value ? JSON.parse(res.value) : { merges: [], setField: [] };
        rebuildDataset(loaded);
        setUserCorrections(loaded);
      } catch (e) {
        rebuildDataset({ merges: [], setField: [] });
      } finally {
        setCorrectionsLoaded(true);
        setDatasetVersion((v) => v + 1);
      }
    })();
  }, []);

  const persistCorrections = useCallback(async (next) => {
    setUserCorrections(next);
    rebuildDataset(next);
    setDatasetVersion((v) => v + 1);
    try {
      await window.storage.set(CORRECTIONS_STORAGE_KEY, JSON.stringify(next), false);
    } catch (e) {
      /* stockage indisponible : la correction reste active pour cette session */
    }
  }, []);

  const addMerge = useCallback(
    (dupId, keepId, note, snapshot) => {
      const next = { ...userCorrections, merges: [...userCorrections.merges, { dupId, keepId, note, date: new Date().toISOString().slice(0, 10), ...(snapshot || {}) }] };
      persistCorrections(next);
    },
    [userCorrections, persistCorrections]
  );

  const addSetField = useCallback(
    (id, field, value, note) => {
      const next = { ...userCorrections, setField: [...userCorrections.setField, { id, field, value, note, date: new Date().toISOString().slice(0, 10) }] };
      persistCorrections(next);
    },
    [userCorrections, persistCorrections]
  );

  const removeCorrection = useCallback(
    (kind, index) => {
      const next = { ...userCorrections, [kind]: userCorrections[kind].filter((_, i) => i !== index) };
      persistCorrections(next);
    },
    [userCorrections, persistCorrections]
  );

  return (
    <div className="app">
      <style>{CSS}</style>
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-title-block">
            <div className="app-eyebrow">قبيلة سيد الفالي — 18 أسرة مدمجة (كل الفصول الـ16 مدمجة)</div>
            <h1 className="app-title">شجرة نسب قبيلة سيد الفالي</h1>
            <div className="app-subtitle">12 أسرة نسب كاملة · عائلة شقيق سيد الفالي · 5 أسر حليفة — l'ensemble des 16 documents sources de la tribu est maintenant intégré</div>
          </div>
          <div className="app-version-badge" title={APP_VERSION_LOG.join("\n\n")}>
            v{APP_VERSION}
            <span className="app-version-date">{APP_VERSION_DATE}</span>
          </div>
          <Ornament />
        </div>
        <nav className="app-tabs">
          <button className={`app-tab ${tab === "tree" ? "app-tab-active" : ""}`} onClick={() => setTab("tree")}>
            التصفح — Parcourir l'arbre
          </button>
          <button className={`app-tab ${tab === "finder" ? "app-tab-active" : ""}`} onClick={() => setTab("finder")}>
            القرابة — Comparateur de parenté
          </button>
          <button className={`app-tab ${tab === "corrections" ? "app-tab-active" : ""}`} onClick={() => setTab("corrections")}>
            التصحيحات — Corrections {(userCorrections.merges.length + userCorrections.setField.length) > 0 && `(${userCorrections.merges.length + userCorrections.setField.length})`}
          </button>
          <button className={`app-tab ${tab === "quality" ? "app-tab-active" : ""}`} onClick={() => setTab("quality")}>
            الفحص — Vérification
          </button>
        </nav>
      </header>

      {!correctionsLoaded && <div className="loading-banner">تحميل التصحيحات المحفوظة… — Chargement…</div>}

      {tab === "tree" && (
        <main className="app-main" key={`tree-${datasetVersion}`}>
          <aside className="sidebar">
            <div className="sidebar-smart-search">
              <PersonPicker label="" value={null} onChange={setSelectedId} placeholder="بحث ذكي بالاسم أو السلسلة — أحمد محمد علي…" />
            </div>
            <label className="ext-toggle">
              <input type="checkbox" checked={hideExt} onChange={(e) => setHideExt(e.target.checked)} />
              <span>إخفاء القبائل الخارجية — Masquer les lignées extérieures</span>
              <span className="ext-count">{RAW.filter((x) => x.ext).length}</span>
            </label>
            <label className="ext-toggle">
              <input type="checkbox" checked={debug} onChange={(e) => setDebug(e.target.checked)} />
              <span>وضع التصحيح: إظهار المعرّفات — Mode debug : identifiants techniques</span>
            </label>
            <div className="sidebar-legend sidebar-legend-wrap">
              <span className="tree-fam tree-fam-mahi">ماهي</span>
              <span className="tree-fam tree-fam-karim">الكريم</span>
              <span className="tree-fam tree-fam-metili">متيلي</span>
              <span className="tree-fam tree-fam-bani">بن باني</span>
              <span className="tree-fam tree-fam-aslitin">اسليطين</span>
              <span className="tree-fam tree-fam-abdallah">ولد عبدالله</span>
              <span className="tree-fam tree-fam-mozdaf">المزضف</span>
              <span className="tree-fam tree-fam-chfagha">اشفغ الأمين</span>
              <span className="tree-fam tree-fam-milud">ميلود</span>
              <span className="tree-fam tree-fam-ajel">آلچ</span>
              <span className="tree-fam tree-fam-amine">الأمين عمي</span>
              <span className="tree-fam tree-fam-zrouq">أحمد زروق</span>
              <span className="tree-fam tree-fam-sidmohamed">سيد محمد</span>
              <span className="tree-fam tree-fam-abdallahfrere">عبد الله (شقيق)</span>
              <span className="tree-fam tree-fam-bahnin">باهنين</span>
              <span className="tree-fam tree-fam-ibrahim">ابراهيم</span>
              <span className="tree-fam tree-fam-ama">اما (الماقور)</span>
              <span className="tree-fam tree-fam-modimalik">مودي مالك</span>
              <span className="legend-note"><span className="legend-dot legend-cross" /> lien croisé confirmé (mariage) — les 3 dernières familles sont des alliées par mariage, non des descendantes de sang de سيد الفالي</span>
              <span className="legend-note"><span className="badge-unknown badge-unknown-sm" /> = identité non enregistrée dans le document source (désignation générique « فلانة »/« فالن »)</span>
            </div>
          </aside>
          <section className="content content-with-chart">
            <GenealogyChart data={familyChartData} mainId={selectedId} onSelect={setSelectedId} />
            <PersonDetail id={selectedId} onSelect={setSelectedId} onMerge={addMerge} onSetField={addSetField} debug={debug} />
          </section>
        </main>
      )}

      {tab === "finder" && (
        <main className="app-main app-main-single" key={`finder-${datasetVersion}`}>
          <RelationFinder onSelectPerson={(id) => { setSelectedId(id); setTab("tree"); }} />
        </main>
      )}

      {tab === "corrections" && (
        <main className="app-main app-main-single">
          <CorrectionsPanel userCorrections={userCorrections} onRemove={removeCorrection} onSelectPerson={(id) => { setSelectedId(id); setTab("tree"); }} />
        </main>
      )}

      {tab === "quality" && (
        <main className="app-main app-main-single">
          <DataQualityPanel onSelectPerson={(id) => { setSelectedId(id); setTab("tree"); }} />
        </main>
      )}

      <footer className="app-footer">
        Reconstruction établie à partir de documents PDF scannés (OCR) — أهل ماهي (ف.5), أهل محمد الكريم (ف.8),
        أهل متيلي (ف.2), أهل المزضف (ف.4), أهل اشفغ الأمين (ف.3), أهل ميلود (ف.11), أهل آلچ (ف.12),
        أهل الأمين عمي (ف.9), أهل أحمد زروق (ف.10), أهل سيد محمد (ف.13), أهل ابراهيم (ف.6), أهل اما/الماقور (ف.7),
        أهل عبد الله (ف.14 — أخو سيد الفالي, ليس من ذريته), أهل محمذن بن باني (ف.17), أهل حبلل اسليطين (ف.18),
        أهل محمد بن عبد الله (ف.19), أهل باهنين (ف.15) et أهل مودي مالك (ف.16) — ces 5 dernières alliées.
        Les 16 documents sources de la tribu سيد الفالي sont maintenant tous intégrés. Pour أهل اشفغ
        الأمين (196
        paragraphes, la plus grande famille), la structure (filiation) a été reconstruite depuis l'index détaillé du
        document ; les dates numériques y sont trop dégradées par l'OCR pour être fiables et ont donc été omises,
        et les filles non centrales résumées en note plutôt que développées individuellement.
      </footer>
    </div>
  );
}

/* ============================================================================
   STYLE — identité "manuscrit saharien"
============================================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700&family=Lora:ital@0;1&display=swap');

:root {
  --sand: #EFE3C6;
  --sand-deep: #E4D3AC;
  --ink: #241D12;
  --ink-soft: #4A3F2C;
  --indigo: #23395E;
  --indigo-deep: #16273F;
  --gold: #A9781F;
  --brick: #8C3B2E;
  --line: #C9B78C;
  --card: #FBF6E9;
}

* { box-sizing: border-box; }

.app {
  min-height: 100vh;
  background: var(--sand);
  background-image:
    radial-gradient(circle at 1px 1px, rgba(36,29,18,0.06) 1px, transparent 0);
  background-size: 22px 22px;
  color: var(--ink);
  font-family: 'Cairo', 'Lora', sans-serif;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: var(--indigo-deep);
  color: var(--sand);
  border-bottom: 4px solid var(--gold);
  padding: 20px 24px 0;
}
.app-header-inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
}
.app-version-badge {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 6px 12px; border-radius: 8px; border: 1px solid var(--gold); background: rgba(255,255,255,0.6);
  font-family: 'Cairo'; font-size: 13px; font-weight: 700; color: var(--indigo-deep); cursor: help;
  white-space: nowrap; margin-bottom: 4px;
}
.app-version-date { font-size: 10px; font-weight: 400; color: var(--ink-soft); }
.quality-version-log { border-top: 1px solid var(--line); padding-top: 18px; margin-top: 8px; }
.version-log-list { padding-inline-start: 20px; direction: rtl; font-size: 12.5px; color: var(--ink); line-height: 1.8; }
.version-log-list li { margin-bottom: 6px; }
.app-eyebrow {
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
  font-family: 'Cairo', sans-serif;
  margin-bottom: 4px;
}
.app-title {
  font-family: 'Amiri', serif;
  font-size: 40px;
  line-height: 1.1;
  margin: 0;
  direction: rtl;
}
.app-subtitle {
  font-size: 13px;
  color: #C9BFA0;
  margin-top: 6px;
  font-style: italic;
}
.ornament { width: 110px; height: 14px; color: var(--gold); flex-shrink: 0; margin-bottom: 8px; }

.app-tabs {
  max-width: 1200px;
  margin: 16px auto 0;
  display: flex;
  gap: 4px;
}
.app-tab {
  background: transparent;
  border: none;
  color: #C9BFA0;
  padding: 10px 18px;
  font-family: 'Cairo', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  border-bottom: 3px solid transparent;
}
.app-tab-active {
  background: var(--sand);
  color: var(--indigo-deep);
  border-bottom: 3px solid var(--gold);
}

.quality-panel { padding: 24px 28px; max-width: 1100px; margin: 0 auto; direction: rtl; }
.quality-header h2 { font-family: 'Amiri'; font-size: 22px; color: var(--indigo-deep); margin: 0 0 6px; }
.quality-sub { font-size: 13px; color: var(--ink-soft); margin: 0 0 20px; direction: ltr; text-align: left; }
.quality-subtabs { display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid var(--line); flex-wrap: wrap; }
.quality-subtab {
  padding: 8px 16px; border: none; background: transparent; cursor: pointer;
  font-family: 'Cairo'; font-size: 14px; color: var(--ink-soft); border-bottom: 3px solid transparent;
}
.quality-subtab-active { color: var(--indigo-deep); border-bottom-color: var(--gold); font-weight: 700; }
.quality-section { margin-bottom: 28px; }
.quality-section-title { font-family: 'Amiri'; font-size: 17px; color: var(--indigo-deep); margin-bottom: 4px; }
.quality-note { font-size: 12px; color: var(--ink-soft); direction: ltr; text-align: left; margin-bottom: 12px; }
.quality-pills { display: flex; flex-wrap: wrap; gap: 6px; }
.quality-pill {
  padding: 5px 12px; border-radius: 14px; border: 1px solid var(--line); background: #fff;
  font-family: 'Cairo'; font-size: 12.5px; cursor: pointer; color: var(--ink);
}
.quality-pill:hover { border-color: var(--gold); background: var(--sand-deep); }
.quality-pill-long { max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border-color: var(--brick); color: var(--brick); }

.app-main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 20px;
  padding: 20px 24px 40px;
}
.app-main-single { grid-template-columns: 1fr; max-width: 820px; }

@media (max-width: 800px) {
  .app-main { grid-template-columns: 1fr; }
  .app-title { font-size: 28px; }
}

/* Sidebar / tree */
.sidebar {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: 78vh;
}
.sidebar-smart-search { margin-bottom: 8px; }
.sidebar-smart-search .picker-label { display: none; }

.filter-input {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  font-family: 'Cairo', sans-serif;
  font-size: 14px;
  direction: rtl;
  margin-bottom: 10px;
  background: #fff;
}
.sidebar-scroll { overflow-y: auto; padding-right: 4px; }
.sidebar-legend {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed var(--line);
  font-size: 11px;
  color: var(--ink-soft);
  display: flex;
  align-items: center;
  gap: 6px;
}
.sidebar-legend-wrap { flex-wrap: wrap; }
.legend-note { display: flex; align-items: center; gap: 4px; width: 100%; margin-top: 6px; line-height: 1.5; }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.legend-cross { background: var(--brick); }

.tree-node { direction: rtl; }
.tree-row { display: flex; align-items: center; gap: 4px; padding: 2px 0; padding-right: calc(var(--depth) * 14px); }
.tree-row-sel .tree-label { background: var(--indigo); color: var(--sand); }
.twisty {
  width: 18px; height: 18px; border: 1px solid var(--line); background: #fff;
  border-radius: 4px; font-size: 12px; line-height: 1; cursor: pointer; color: var(--ink-soft);
  flex-shrink: 0;
}
.twisty-empty { border: none; background: transparent; }
.tree-label {
  flex: 1; text-align: right; background: transparent; border: none; cursor: pointer;
  padding: 4px 8px; border-radius: 6px; font-family: 'Cairo', sans-serif; font-size: 13.5px;
  display: flex; gap: 6px; align-items: baseline; flex-wrap: wrap;
}
.tree-label:hover { background: var(--sand-deep); }
.tree-name { font-weight: 600; }
.is-fem .tree-name { font-weight: 500; color: var(--brick); }
.tree-gen { font-size: 9px; color: #fff; background: var(--ink-soft); border-radius: 4px; padding: 1px 5px; font-family: 'Cairo'; opacity: 0.7; }
.tree-fam { font-size: 9px; border-radius: 4px; padding: 1px 5px; font-family: 'Cairo'; font-weight: 700; }
.tree-fam-mahi { background: #DCE6F0; color: var(--indigo-deep); }
.tree-fam-karim { background: #F0DCD4; color: var(--brick); }
.tree-fam-metili { background: #E3EEDC; color: #3E6B3A; }
.tree-fam-bani { background: #EDE3F0; color: #6B3E8A; }
.tree-fam-aslitin { background: #F0EAD6; color: #8A6E1E; }
.tree-fam-abdallah { background: #E0EFF0; color: #1E6E7A; }
.tree-fam-mozdaf { background: #F5E6D3; color: #8C5A1E; }
.tree-fam-chfagha { background: #DDE8E3; color: #2A5A47; }
.tree-fam-milud { background: #EAE0F5; color: #5A3A8A; }
.tree-fam-ajel { background: #F5E0E8; color: #8A3A5F; }
.tree-fam-amine { background: #E5EDF5; color: #2E5A8A; }
.tree-fam-zrouq { background: #EDF0DC; color: #5A6B2A; }
.tree-fam-sidmohamed { background: #F0E5DC; color: #8A5A2E; }
.tree-fam-abdallahfrere { background: #DCD5C8; color: #5A4A32; }
.tree-fam-bahnin { background: #D5E8E0; color: #2E6B52; }
.tree-fam-ibrahim { background: #E8DCD5; color: #6B4A2E; }
.tree-fam-ama { background: #DCE8DC; color: #2E6B3A; }
.tree-fam-modimalik { background: #E8E0D5; color: #7A5A2E; }

.badge-unknown {
  display: inline-flex; align-items: center; justify-content: center;
  width: 16px; height: 16px; border-radius: 50%; background: repeating-linear-gradient(45deg, #B5453E, #B5453E 3px, #9C3B35 3px, #9C3B35 6px);
  color: #fff; font-size: 10px; font-weight: 700; font-family: 'Cairo'; cursor: help; flex-shrink: 0;
}
.badge-unknown-lg { width: 22px; height: 22px; font-size: 13px; margin-right: 8px; vertical-align: middle; }
.badge-unknown-sm { width: 13px; height: 13px; font-size: 8px; }
.detail-unknown-note { font-size: 12px; color: #9C3B35; font-style: italic; margin-top: 4px; }
.badge-ext {
  display: inline-flex; align-items: center; gap: 4px;
  background: #EDE3F2; color: #5B3A73; border: 1px solid #B48FCB;
  border-radius: 10px; padding: 1px 9px; font-size: 11px; font-weight: 600;
  font-family: 'Cairo'; vertical-align: middle; margin-right: 8px; cursor: help;
}
.badge-ext-sm { font-size: 9px; padding: 0 6px; margin-right: 4px; }
.badge-src {
  display: inline-flex; align-items: center; background: #F1EAD9; color: #7a6a3e;
  border: 1px dashed var(--gold); border-radius: 10px; padding: 1px 9px;
  font-size: 11px; font-family: 'Cairo'; vertical-align: middle; margin-right: 6px; cursor: help;
}
.detail-ext-note { font-size: 12px; color: #5B3A73; font-style: italic; margin-top: 4px; }
.dbg-id {
  font-family: monospace; direction: ltr; font-size: 9px; color: #4a6fa5;
  background: #E8EEF7; border: 1px solid #C3D3E8; border-radius: 3px; padding: 0 4px;
}
.dbg-box {
  font-family: monospace; direction: ltr; text-align: left; font-size: 11.5px; line-height: 1.8;
  background: #EDF2F9; border: 1px solid #C3D3E8; border-radius: 6px;
  padding: 8px 11px; margin: 8px 0; color: #2f4a70;
}
.dbg-box b { color: #7a4f9c; font-weight: 700; }
.ext-toggle {
  display: flex; align-items: center; gap: 7px; padding: 7px 9px; margin: 6px 0;
  background: #F6F1E8; border: 1px solid var(--line); border-radius: 7px;
  font-size: 12px; font-family: 'Cairo'; color: var(--ink-soft); cursor: pointer; direction: rtl;
}
.ext-toggle input { accent-color: #7a4f9c; cursor: pointer; }
.ext-count { margin-right: auto; background: #EDE3F2; color: #5B3A73; border-radius: 9px; padding: 0 7px; font-size: 11px; }
.detail-fullname { font-family: 'Amiri', serif; font-size: 15px; color: #7a6a3e; margin: 2px 0 6px; line-height: 1.7; }
.tree-para { font-size: 10px; color: var(--gold); border: 1px solid var(--gold); border-radius: 4px; padding: 0 4px; }
.tree-dates { font-size: 10px; color: #8a7d5e; }
.tree-children { border-right: 1px dashed var(--line); margin-right: 8px; }

/* Arbre interactif (family-chart) */
.content-with-chart { display: flex; flex-direction: column; gap: 20px; }
.genealogy-chart-wrap { display: flex; flex-direction: column; gap: 10px; }
.genealogy-chart-controls { display: flex; gap: 20px; flex-wrap: wrap; direction: rtl; }
.genealogy-export-control button {
  width: auto; height: auto; border-radius: 6px; padding: 4px 10px;
  font-family: 'Cairo'; font-weight: 700;
}
.genealogy-export-control button:disabled { opacity: 0.5; cursor: wait; }
.genealogy-export-spinner { color: var(--gold); }
.genealogy-export-overlay {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(36, 29, 18, 0.55);
  display: flex; align-items: center; justify-content: center;
  color: var(--sand); font-family: 'Cairo'; font-size: 16px; font-weight: 700;
  direction: rtl;
}
.genealogy-chart-cont {
  width: 100%;
  height: 62vh;
  min-height: 420px;
  border: 1px solid var(--line);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  /* Fonds clairs + texte sombre pour les deux genres : plus de contraste
     à garantir par genre, lisible dans tous les cas (l'ancien bleu marine
     avec texte sombre était illisible). */
  --female-color: #E4D3AC;
  --male-color: #AEC2D6;
  --genderless-color: #D8D0BA;
  --background-color: #FBF6E9;
  --text-color: #241D12;
  font-family: 'Cairo', sans-serif;
  direction: ltr; /* la mise en page de l'arbre (position des cartes) reste LTR ; le texte arabe s'affiche correctement dans chaque carte */
}
.genealogy-chart-cont .card-html .card-inner { direction: rtl; font-family: 'Cairo', sans-serif; }
.genealogy-chart-cont .card-html .card-main-outline { stroke: var(--indigo); stroke-width: 3px; }
/* Les liens parent<->enfant étaient tracés en blanc sur fond clair (invisibles) ;
   ligne pointillée bien visible pour bien suivre qui est relié à qui. */
.genealogy-chart-cont .link {
  stroke: #8C6D3F;
  stroke-width: 2px;
  stroke-dasharray: 1 5;
  stroke-linecap: round;
}

/* Detail */
.content { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 26px; direction: rtl; }
.detail-empty { color: var(--ink-soft); text-align: center; padding: 60px 0; }
.detail-eyebrow { font-size: 11px; letter-spacing: 0.08em; color: var(--gold); text-transform: uppercase; font-family: 'Cairo'; }
.detail-name { font-family: 'Amiri', serif; font-size: 34px; margin: 4px 0 6px; }
.detail-dates, .detail-place { font-size: 14px; color: var(--ink-soft); margin-bottom: 2px; }
.detail-note { font-size: 13px; color: var(--brick); margin-top: 6px; font-style: italic; }
.detail-block { margin-top: 22px; padding-top: 16px; border-top: 1px solid var(--line); }

.loading-banner { text-align: center; padding: 8px; font-size: 12px; color: var(--ink-soft); background: var(--sand-deep); }

.detail-correct-block { background: #FBF3E7; border-radius: 8px; padding: 14px; border-top: 1px dashed var(--gold); }
.correct-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.correct-btn {
  background: #fff; border: 1px solid var(--gold); color: var(--indigo-deep); border-radius: 999px;
  padding: 7px 14px; font-family: 'Cairo'; font-size: 12.5px; cursor: pointer;
}
.correct-btn:hover { background: var(--gold); color: #fff; }
.correct-btn-sm { padding: 5px 12px; font-size: 11.5px; }
.spouse-pill-wrap { display: inline-flex; align-items: center; gap: 2px; }
.spouse-remove-btn {
  width: 16px; height: 16px; border-radius: 50%; border: 1px solid var(--brick); background: #fff;
  color: var(--brick); font-size: 9px; line-height: 1; cursor: pointer; display: flex;
  align-items: center; justify-content: center; padding: 0;
}
.spouse-remove-btn:hover { background: var(--brick); color: #fff; }
.merged-away-label { font-size: 13px; color: var(--ink-soft); font-style: italic; }

.pedigree-wrap { margin-top: 26px; padding-top: 18px; border-top: 2px solid var(--gold); }
.pedigree-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;
  font-family: 'Amiri'; font-size: 14px; color: var(--indigo-deep); flex-wrap: wrap; gap: 8px;
}
.pedigree-depth-control { display: flex; align-items: center; gap: 8px; font-family: 'Cairo'; font-size: 12px; color: var(--ink-soft); }
.pedigree-depth-control button {
  width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--gold); background: #fff;
  cursor: pointer; font-size: 14px; line-height: 1; color: var(--indigo-deep);
}
.pedigree-depth-control button:hover { background: var(--gold); color: #fff; }
.pedigree-scroll { overflow-x: auto; padding: 6px 4px 22px; direction: ltr; }
.pedigree-branch { display: inline-flex; flex-direction: column-reverse; align-items: center; direction: rtl; gap: 16px; }
.pedigree-node {
  padding: 6px 10px; border-radius: 8px; border: 1px solid var(--line); background: #fff;
  font-family: 'Cairo'; font-size: 11px; cursor: pointer; white-space: nowrap; min-width: 64px;
  display: flex; flex-direction: column; align-items: center; gap: 2px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.pedigree-node:hover { border-color: var(--gold); background: var(--sand-deep); }
.pedigree-node.pedigree-f { border-right: 3px solid #B5453E; }
.pedigree-node.pedigree-m { border-right: 3px solid #2E6B7A; }
.pedigree-node.pedigree-hl { background: var(--gold); border-color: var(--gold); }
.pedigree-node.pedigree-hl .pedigree-node-name { color: #fff; font-weight: 700; }
.pedigree-node-name { font-weight: 600; color: var(--ink); }
.pedigree-node-dates { font-size: 9px; color: var(--ink-soft); }
.pedigree-node.pedigree-empty { opacity: 0.35; box-shadow: none; cursor: default; }

.relpath-root { display: inline-flex; flex-direction: column; align-items: center; gap: 18px; direction: rtl; }
.relpath-branches { display: flex; gap: 32px; }
.relpath-branch { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.relpath-connector { width: 1px; height: 14px; background: var(--line); }
.relpath-connector-h { width: 22px; height: 1px; background: var(--line); align-self: center; }
.relpath-linear { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; direction: rtl; }
.pedigree-parents { display: flex; gap: 18px; position: relative; }
.pedigree-parents > .pedigree-branch { position: relative; }
.correct-form { display: flex; flex-direction: column; gap: 8px; }
.correct-form-label { font-size: 13px; color: var(--ink); font-weight: 600; }
.correct-note-input {
  padding: 8px 10px; border: 1px solid var(--line); border-radius: 6px; font-family: 'Cairo';
  font-size: 13px; direction: rtl; background: #fff;
}
.edit-field-label {
  display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--ink-soft);
  font-family: 'Cairo'; text-align: right;
}
.correct-form-actions { display: flex; gap: 8px; }
.correct-confirm-btn {
  background: var(--indigo); color: #fff; border: none; border-radius: 999px; padding: 8px 18px;
  font-family: 'Cairo'; font-weight: 700; font-size: 13px; cursor: pointer;
}
.correct-confirm-btn:disabled { background: #C9BFA0; cursor: not-allowed; }
.correct-cancel-btn {
  background: none; border: 1px solid var(--line); color: var(--ink-soft); border-radius: 999px;
  padding: 8px 18px; font-family: 'Cairo'; font-size: 13px; cursor: pointer;
}

.corrections-intro { font-size: 13px; color: var(--ink-soft); line-height: 1.7; margin-bottom: 20px; direction: rtl; }
.correction-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 13px; direction: rtl; }
.correction-note { font-size: 12px; color: var(--ink-soft); font-style: italic; margin-top: 6px; direction: rtl; }
.correction-meta { font-size: 10px; color: #a89a78; margin-top: 4px; }
.corrections-export { margin-top: 20px; }
.corrections-export-area {
  width: 100%; height: 160px; margin-top: 10px; font-family: monospace; font-size: 11px;
  padding: 10px; border: 1px solid var(--line); border-radius: 8px; direction: ltr; resize: vertical;
}
.unresolved-list { display: flex; flex-wrap: wrap; gap: 6px; max-height: 400px; overflow-y: auto; direction: rtl; }
.detail-block-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-soft); margin-bottom: 10px; font-family: 'Cairo'; }
.chain-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.chain-sep { color: var(--gold); }
.extra-note { font-size: 12px; color: var(--ink-soft); margin-top: 8px; }

.pill {
  background: #fff; border: 1px solid var(--line); border-radius: 999px;
  padding: 6px 14px; font-family: 'Cairo'; font-size: 13px; cursor: pointer; color: var(--ink);
}
.pill:hover { background: var(--indigo); color: var(--sand); border-color: var(--indigo); }
.pill-hl { border-color: var(--brick); box-shadow: 0 0 0 1px var(--brick) inset; }

/* Finder */
.finder { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 28px; }
.finder-title {
  font-family: 'Amiri', serif; font-size: 22px; text-align: center; direction: rtl;
  display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 22px; color: var(--indigo-deep);
}
.finder-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 620px) { .finder-grid { grid-template-columns: 1fr; } }
.picker { position: relative; direction: rtl; }
.picker-label { display: block; font-size: 12px; color: var(--ink-soft); margin-bottom: 6px; font-family: 'Cairo'; }
.picker-input-wrap { position: relative; }
.picker-input {
  width: 100%; padding: 10px 34px 10px 12px; border: 1px solid var(--line); border-radius: 8px;
  font-family: 'Cairo'; font-size: 14px; background: #fff; direction: rtl;
}
.picker-clear {
  position: absolute; left: 8px; top: 50%; transform: translateY(-50%);
  border: none; background: transparent; font-size: 18px; cursor: pointer; color: var(--brick);
}
.picker-dropdown {
  position: absolute; z-index: 10; top: 100%; margin-top: 4px; width: 100%;
  background: #fff; border: 1px solid var(--line); border-radius: 8px; max-height: 220px; overflow-y: auto;
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}
.picker-option {
  width: 100%; text-align: right; padding: 8px 12px; background: none; border: none; cursor: pointer;
  font-family: 'Cairo'; font-size: 13.5px; display: flex; justify-content: space-between; align-items: center; gap: 8px;
}
.picker-option:hover { background: var(--sand); }
.picker-option-main { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.picker-option-father { font-size: 10.5px; color: var(--ink-soft); font-weight: 400; }
.picker-option-tags { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.picker-option-para { font-size: 10px; color: var(--gold); }

.finder-btn {
  display: block; margin: 22px auto 0; background: var(--indigo); color: var(--sand);
  border: none; padding: 12px 26px; border-radius: 999px; font-family: 'Cairo'; font-weight: 700;
  font-size: 14px; cursor: pointer;
}
.finder-btn:disabled { background: #C9BFA0; cursor: not-allowed; color: #8a7d5e; }
.finder-btn:not(:disabled):hover { background: var(--indigo-deep); }

.finder-results { margin-top: 28px; direction: rtl; }
.result-blood { background: #fff; border: 1px solid var(--gold); border-radius: 10px; padding: 16px 18px; margin-bottom: 20px; }
.result-blood-clickable { cursor: pointer; transition: box-shadow 0.15s, transform 0.1s; }
.result-blood-clickable:hover { box-shadow: 0 3px 10px rgba(0,0,0,0.1); transform: translateY(-1px); }
.result-blood-hint { float: left; font-size: 11px; color: var(--gold); font-weight: 400; }
.path-card-clickable { cursor: pointer; transition: box-shadow 0.15s, transform 0.1s; }
.path-card-clickable:hover { box-shadow: 0 3px 10px rgba(0,0,0,0.1); transform: translateY(-1px); }
.result-blood-none { border-color: var(--line); color: var(--ink-soft); }
.result-blood-title { font-family: 'Cairo'; font-weight: 700; color: var(--indigo-deep); margin-bottom: 8px; font-size: 13px; text-transform: uppercase; }
.result-blood-sub { font-size: 12.5px; color: var(--ink-soft); margin-top: 6px; }
.result-block-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-soft); margin: 18px 0 10px; font-family: 'Cairo'; }
.result-empty { color: var(--ink-soft); font-size: 13px; }

.path-card { background: #fff; border: 1px solid var(--line); border-radius: 8px; padding: 12px 16px; margin-bottom: 10px; }
.path-card-head { font-size: 11px; color: var(--gold); font-family: 'Cairo'; font-weight: 700; margin-bottom: 6px; }
.path-steps { margin: 0; padding-right: 18px; font-size: 13.5px; line-height: 1.9; }
.step-blood { color: var(--indigo-deep); font-weight: 600; }
.step-alliance { color: var(--brick); font-weight: 600; }

.app-footer { text-align: center; font-size: 11px; color: var(--ink-soft); padding: 18px; direction: rtl; }
`;
