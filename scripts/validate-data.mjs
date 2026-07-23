#!/usr/bin/env node
// Valide le jeu de données généalogique (src/data/*) indépendamment de l'UI :
// références cassées, incohérences de genre, dates Hijri/Grégorien
// incompatibles, doublons d'id, cycles de filiation, corrections orphelines.
//
// Usage : node scripts/validate-data.mjs [--json]

import { RAW } from "../src/data/people.js";
import { CORRECTIONS } from "../src/data/corrections.js";
import { applyCorrections } from "../src/data/apply-corrections.js";

const asJson = process.argv.includes("--json");
const issues = [];
function report(category, message, id) {
  issues.push({ category, message, id: id || null });
}

// --- 1. Doublons d'id dans RAW -------------------------------------------
{
  const seen = new Map();
  for (const p of RAW) {
    if (seen.has(p.id)) report("duplicate-id", `id "${p.id}" apparaît ${seen.get(p.id) + 1} fois dans RAW`, p.id);
    seen.set(p.id, (seen.get(p.id) || 0) + 1);
  }
}

// --- 2. Corrections orphelines (référencent un id absent de RAW) --------
{
  const rawIds = new Set(RAW.map((p) => p.id));
  for (const [dupId, keepId] of CORRECTIONS.merges) {
    if (!rawIds.has(dupId)) report("orphan-correction", `merge: id fusionné "${dupId}" absent de RAW`, dupId);
    if (!rawIds.has(keepId)) report("orphan-correction", `merge: id conservé "${keepId}" absent de RAW`, keepId);
  }
  for (const { id } of CORRECTIONS.setField) {
    if (!rawIds.has(id)) report("orphan-correction", `setField: id "${id}" absent de RAW`, id);
  }
}

// --- Applique les corrections pour valider le jeu de données final -------
const RAW_FILTERED = RAW.filter((p) => p.id !== "P14w_placeholder");
const PEOPLE = applyCorrections(RAW_FILTERED, { merges: [], setField: [] });
const byId = Object.fromEntries(PEOPLE.map((p) => [p.id, p]));

// --- 3. Références cassées (father/mother/spouses vers un id inexistant) -
for (const p of PEOPLE) {
  if (p.father && !byId[p.father]) report("broken-reference", `father "${p.father}" inexistant`, p.id);
  if (p.mother && !byId[p.mother]) report("broken-reference", `mother "${p.mother}" inexistant`, p.id);
  for (const s of p.spouses || []) {
    if (!byId[s]) report("broken-reference", `spouse "${s}" inexistant`, p.id);
  }
}

// --- 4. Cohérence de genre (père = M, mère = F) --------------------------
for (const p of PEOPLE) {
  if (p.father && byId[p.father] && byId[p.father].g !== "M") {
    report("gender-mismatch", `father "${p.father}" n'est pas marqué M (g=${byId[p.father].g})`, p.id);
  }
  if (p.mother && byId[p.mother] && byId[p.mother].g !== "F") {
    report("gender-mismatch", `mother "${p.mother}" n'est pas marquée F (g=${byId[p.mother].g})`, p.id);
  }
}

// --- 5. Auto-référence et cycles de filiation ----------------------------
for (const p of PEOPLE) {
  if (p.father === p.id) report("self-reference", `est son propre père`, p.id);
  if (p.mother === p.id) report("self-reference", `est sa propre mère`, p.id);

  const seen = new Set([p.id]);
  let cur = p;
  let depth = 0;
  while (cur && cur.father && depth < 200) {
    if (seen.has(cur.father)) {
      report("ancestry-cycle", `cycle de filiation détecté via father="${cur.father}"`, p.id);
      break;
    }
    seen.add(cur.father);
    cur = byId[cur.father];
    depth++;
  }
}

// --- 6. Réciprocité des liens d'épouses -----------------------------------
for (const p of PEOPLE) {
  for (const s of p.spouses || []) {
    const spouse = byId[s];
    if (spouse && !(spouse.spouses || []).includes(p.id)) {
      report("non-reciprocal-spouse", `"${p.id}" cite "${s}" comme époux/se, sans lien retour`, p.id);
    }
  }
}

// --- 7. Cohérence Hijri / Grégorien dans "dates" --------------------------
// Approximation standard : G ≈ H - H/33 + 622. Tolérance de 3 ans (le
// calendrier hégirien étant lunaire, l'écart varie selon le mois exact).
function hijriToGregorianApprox(h) {
  return Math.round(h - h / 33 + 622);
}
const DATE_PAIR_RE = /(\d{3,4})\s*هـ\s*\/\s*(\d{3,4})\s*م/g;
for (const p of PEOPLE) {
  if (!p.dates) continue;
  for (const match of p.dates.matchAll(DATE_PAIR_RE)) {
    const [, hijriStr, gregStr] = match;
    const hijri = parseInt(hijriStr, 10);
    const greg = parseInt(gregStr, 10);
    const expected = hijriToGregorianApprox(hijri);
    if (Math.abs(expected - greg) > 3) {
      report(
        "date-mismatch",
        `${hijriStr}هـ/${gregStr}م incohérent (attendu ~${expected}م ± 3)`,
        p.id
      );
    }
  }
}

// --- Rapport ---------------------------------------------------------------
const byCategory = {};
for (const issue of issues) {
  (byCategory[issue.category] ||= []).push(issue);
}

if (asJson) {
  console.log(JSON.stringify({ total: PEOPLE.length, issueCount: issues.length, issues }, null, 2));
} else {
  console.log(`Personnes (après corrections) : ${PEOPLE.length}`);
  console.log(`Total anomalies : ${issues.length}\n`);
  for (const [category, list] of Object.entries(byCategory)) {
    console.log(`## ${category} (${list.length})`);
    for (const issue of list.slice(0, 20)) {
      console.log(`  - [${issue.id}] ${issue.message}`);
    }
    if (list.length > 20) console.log(`  ... et ${list.length - 20} de plus`);
    console.log("");
  }
}

process.exit(issues.length > 0 ? 1 : 0);
