import { CORRECTIONS } from "./corrections.js";

// Applique CORRECTIONS (fusions de doublons + forçages de champ) plus les
// corrections ajoutées par l'utilisateur en session (mêmes formats) à un
// tableau RAW-like de personnes, et renvoie le tableau nettoyé.
export function applyCorrections(rawPeople, userCorrections) {
  const uc = userCorrections || { merges: [], setField: [] };
  const allMerges = [...CORRECTIONS.merges.map((m) => [m[0], m[1]]), ...uc.merges.map((m) => [m.dupId, m.keepId])];
  const allSetField = [...CORRECTIONS.setField, ...uc.setField];

  const mergeMap = {};
  for (const [dupId, keepId] of allMerges) mergeMap[dupId] = keepId;
  function resolve(id) {
    const seen = new Set();
    while (mergeMap[id] && !seen.has(id)) {
      seen.add(id);
      id = mergeMap[id];
    }
    return id;
  }

  const byIdTemp = Object.fromEntries(rawPeople.map((p) => [p.id, p]));
  for (const [dupId, keepId] of allMerges) {
    const dup = byIdTemp[dupId];
    const keep = byIdTemp[resolve(keepId)];
    if (!dup || !keep) continue;
    const mergedSpouses = Array.from(new Set([...(keep.spouses || []), ...(dup.spouses || [])]));
    if (mergedSpouses.length) keep.spouses = mergedSpouses;
    for (const f of ["dates", "place", "note"]) {
      if (!keep[f] && dup[f]) keep[f] = dup[f];
    }
  }

  const dupIds = new Set(allMerges.map((m) => m[0]));
  let people = rawPeople
    .filter((p) => !dupIds.has(p.id))
    .map((p) => ({
      ...p,
      father: p.father ? resolve(p.father) : p.father,
      mother: p.mother ? resolve(p.mother) : p.mother,
      spouses: p.spouses ? p.spouses.map(resolve) : p.spouses,
    }));

  const byIdFinal = Object.fromEntries(people.map((p) => [p.id, p]));
  for (const { id, field, value } of allSetField) {
    const person = byIdFinal[resolve(id)];
    if (person) person[field] = value;
  }

  return people;
}
