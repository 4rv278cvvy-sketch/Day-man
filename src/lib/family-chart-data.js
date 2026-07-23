// Convertit le jeu de données de l'arbre (father/mother/spouses par personne)
// vers le format attendu par la librairie family-chart : chaque personne liste
// aussi ses enfants et ses deux parents ensemble (rels.parents), reconstruits
// ici par lookup inverse puisque RAW ne stocke que father/mother sur l'enfant.
export function isUnnamed(name) {
  if (!name) return false;
  const first = name.trim().split(/\s+/)[0];
  return first === "فلانة" || first === "فالن" || first === "فلان";
}

export function toFamilyChartData(allPeople, { hideExt = false } = {}) {
  const people = hideExt ? allPeople.filter((p) => !p.ext) : allPeople;
  const validIds = new Set(people.map((p) => p.id));

  const childrenOf = {};
  for (const p of people) {
    if (p.father && validIds.has(p.father)) (childrenOf[p.father] ||= []).push(p.id);
    if (p.mother && validIds.has(p.mother)) (childrenOf[p.mother] ||= []).push(p.id);
  }

  return people.map((p) => ({
    id: p.id,
    data: {
      gender: p.g,
      name: p.name,
      dates: p.dates || "",
      place: p.place || "",
      unnamed: isUnnamed(p.name),
      ext: !!p.ext,
    },
    rels: {
      parents: [p.father, p.mother].filter((id) => id && validIds.has(id)),
      spouses: (p.spouses || []).filter((id) => validIds.has(id)),
      children: childrenOf[p.id] || [],
    },
  }));
}
