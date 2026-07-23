/* ============================================================================
   CORRECTIONS MANUELLES — zone d'édition, séparée des données brutes RAW.
   ============================================================================
   But : corriger des erreurs découvertes après coup (doublons de personnes,
   mauvaise filiation, etc.) sans avoir à rouvrir et modifier les ~2000 entrées
   de RAW. Toute correction se résume à UNE ligne ici.

   Deux types de corrections :

   1) merges: fusionne un identifiant EN DOUBLE (même personne présente deux
      fois sous deux id différents) dans l'identifiant à conserver. Toutes les
      références (father / mother / spouses, où qu'elles soient dans RAW) sont
      automatiquement redirigées vers l'id conservé, et les champs manquants
      (dates/place/note) du doublon sont recopiés s'ils manquent sur l'id gardé.
      Format : ["id_en_double", "id_a_garder", "commentaire pour se souvenir pourquoi"]

   2) setField: force la valeur d'un champ précis (father, mother, note, dates,
      place, g) pour un id donné — utile pour corriger une filiation erronée
      sans fusion de personnes.
      Format : { id: "...", field: "...", value: "...", note: "pourquoi" }

   Après chaque nouvelle famille intégrée ou correction signalée par l'utilisateur,
   ajouter une ligne ici plutôt que de rééditer RAW à la main.
  ========================================================================== */
export const CORRECTIONS = {
  merges: [
    // Fatimetou (mère de Mohamed Mbareck/Z61, épouse de Medal/Z58 ET de Mohameden/M47)
    // avait été créée deux fois : une fois correctement comme fille de P26 (Ahmed b.
    // Abou Mohamed, ماهي) via M47, une fois par erreur comme fille de P8 via Z58.
    // On garde M47w2 (déjà reliée à Ahmed fils d'Ebou = P26) et on y fusionne Z58w2.
    ["Z58w2", "M47w2", "Fatimetou : doublon — fille d'Ahmed b. Abou (P26), pas de P8. Signalé par l'utilisateur."],
  ],
  setField: [
    // Exemple de format, à dupliquer pour toute future correction ponctuelle :
    // { id: "XXX", field: "father", value: "YYY", note: "raison de la correction" },
    { id: "Z79w1", field: "name", value: "حاجه", note: "Prénom corrigé manuellement (était : حاجو بنت الحسن...)" },
    { id: "Z142w1", field: "name", value: "خدجية (الناه)", note: "Prénom corrigé manuellement (était : خدجية بنت الحسن...)" },
    { id: "Z142w1", field: "name", value: "انّاه (خديجة)", note: "Prénom re-corrigé manuellement — remplace la correction précédente" },
    { id: "P27s2", field: "spouses", value: ["Z141d2"], note: "Époux d'أم الخيري (Z141d2, أهل المزضف) — signalé par l'utilisateur" },
    { id: "Z141d2", field: "spouses", value: ["P27s2"], note: "Épouse de المختار بن محمذن باب (P27s2, أهل ماهي) — lien réciproque" },
    { id: "Z141w1", field: "name", value: "كوريو (فاطمة)", note: "Prénom corrigé manuellement" },
    { id: "Z141w1", field: "father", value: "F7", note: "Père corrigé(e) manuellement" },
    { id: "Z141w1", field: "mother", value: "F7w1", note: "Mère (اكرامو) retrouvée dans le document source de اما, page 7 — signalé par l'utilisateur" },
  ],
};
