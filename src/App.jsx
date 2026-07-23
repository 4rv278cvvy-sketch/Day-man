import React, { useMemo, useState, useCallback } from "react";

/* ============================================================================
   VERSION DE L'APPLICATION
   Incrémenter à chaque évolution (correction de données, nouvelle fonctionnalité,
   correction de bug d'interface). Historique succinct pour traçabilité.
============================================================================ */
const APP_VERSION = "1.71.0";
const APP_VERSION_DATE = "2026-07-10";
const APP_VERSION_LOG = [
  "1.71.0 — RE-PARSING DE المزضف §75-85. 31 personnes ajoutees. §75: la QUATRIEME epouse ليلة بنت يكرب et ses trois filles (ميمونو, الغاليو, عائشة). §76: la seconde epouse عائشة بنت أحمد et les trois enfants — le paragraphe n en avait aucun. §77: les quatre enfants (ابن, أحمد, سكينو, فلان), egalement absents. §78: la TROISIEME epouse السنيو بنت الشيخ بويا avec ses deux filles, le fils خالد de زينب, et deux filles de la premiere epouse (اميَّم et حاجو). §79: les trois filles يسلم, ابن, النَّـنَّ — aucune n etait enregistree. §80: la fille أم الخيري. §81: la fille نفيسو. §82: les quatre enfants. §84: le fils محمدن mort en bas age a محجوبو. §85: les quatre enfants (مريم السالمو, ايمين, محمد, عبد الله). DATES: عيشتونو (§80) portait 1234هـ/1916م, impossible puisque 1234هـ correspond a 1818م — corrige en 1334هـ/1916م. ددانو (§80) n avait que 1945هـ؟ — completee en 1364هـ/1945م – 1402هـ/1982م avec son lieu. عائشة (§81) portait sa date de deces comme naissance. MATERNITES: امباركو السالكو rattachee a عائشة (1re epouse du §84), باكّو a صفيو (§83). Arbre : 6842 personnes",
  "1.70.0 — RE-PARSING DE المزضف §73-75. 10 personnes ajoutees. §73 (أحمد بن ابن عبدم): la source lui donne QUATRE epouses; il en manquait une, أم المؤمنين بنت محمذن بن الأمين (fille de Z148), et les enfants etaient presque tous rattaches a la mauvaise. Repartition retablie selon l ordre du texte: العاليو a عيشنو; مريم, مسعوده (ajoutee) et بنت خويلد a أم المؤمنين; محمد (§74) a أم الخيري بنت مام; أحمد سالم (ajoute, مفقود) et الأمين (§80) et السالمو a أم الخيري بنت أحمد امبيريك. Les deux dernieres epouses ont ete identifiees par leurs notes, qui nomment exactement leurs enfants. §74: la DEUXIEME epouse الغاليو بنت محمد بن سيد أحمد restituee; دود (فاطمة) lui est rendue et son fils أحمد (mort en bas age, بوتلميت) ajoute; deux filles de la troisieme epouse عيشو ajoutees (اَمِّن et عائشة). §75: la TROISIEME epouse اَميـن بنت هيدي restituee, avec sa fille أم الخيري; اميو ajoutee a نفيسو; فتيه rattachee a la premiere epouse الخيت. SIGNALE: I13d2 figure comme epouse supplementaire du §74 alors qu elle a les memes parents que Z74w1 et une note renvoyant a la meme fille — possible doublon a arbitrer. Arbre : 6810 personnes",
  "1.69.0 — GRAND NETTOYAGE DES DOUBLONS ETOILES (signalement utilisateur). Les noeuds marques d une etoile sont reconstitues a partir d une genealogie feminine; ils dupliquent souvent un fils reel sous une graphie OCR legerement differente. Nouvelle mesure de similarite tolerant: permutation des mots (ابن عبدم / عبدم ابن), interversion du prenom et de sa glose (ولد الحاج (عبد الله) / عبد الله (ولد الحاج)), troncatures (ايمين / اديني, tous deux gloses الأمين), et variantes de lettres (امين / امني, البرا / الربا, أحمد / أحمذ). Appliquee d abord entre freres (31 noeuds absorbes: F79s1 et F79s2 -> F80 §80, F79s3 -> F93 §93, Z108s1 -> Z109 §109), puis sur la chaine genealogique complete a profondeur egale (215 noeuds), puis six fusions ciblees dont الربا -> البرا (§132), chaines identiques sur neuf generations. TOTAL: 252 noeuds absorbes, arbre 7052 -> 6800. VERIFICATION: les 1443 noeuds portant un numero de paragraphe sont TOUS conserves, et les 252 supprimes sont TOUS des noeuds etoiles — aucune personne documentee n a ete perdue. RESTE signale: onze paires de freres etoiles a nom voisin mais probablement distincts (سيد الفالي / الفالي, الشيخ السالم / الشيخ الناجي, بابارميد / باباحنيد, محمد فال / محمذن فال). Arbre : 6800 personnes",
  "1.68.0 — RE-PARSING DE المزضف §62-72. 26 personnes ajoutees, 5 doublons fusionnes. §63: les DEUX epouses manquantes restituees — مام كمبو -سنغال- (mere de ادَّد §68) et زينب بنت دحود (mere de هالة/عائشة); dates de خيرا completees (deces 1436هـ/2015م, ecrit 6341هـ/5162م par inversion OCR). §64: trois enfants. §65: la seconde epouse آمنة بنت بياد et cinq enfants. §66: la troisieme epouse مريم سومارنو -اندنوسيا- et huit enfants repartis entre les trois epouses. §67: le fils محمد. §68: les deux fils جمال et رسول. §69: les quatre filles أم الخيرات, اماتو, خديجة, مريم (لم تعقب) et le lieu أبير حيبلل. DOUBLONS PAR INVERSION DE MOTS: la source ecrit tantot ابن عبدم tantot عبدم ابن, ce qui avait engendre deux faux fils du §71 et leur descendance. Z71s1 et Z71s2 sont le §72 lui-meme; leurs enfants doublonnaient les siens, avec dates et lieux identiques: K132w1 = Z72d2 (ممموه, 1276-1363هـ, أبير حيبلل), K88w1 = Z72d1 (ايا عايشا, 1273هـ, أبير حيبلل), Z71s1s1 = Z83 (عمر). §72: la SECONDE epouse فاطمة بنت احميدَّ restituee; عمر (§83), ايا et ممموه lui sont rattaches, أم الخيري et أحمد (§73) restant a خدجية. VERIFIE SANS CHANGEMENT: le §70 et ses cinq epouses, dont la repartition des quatorze enfants correspond deja exactement a la source. Arbre : 7052 personnes",
  "1.67.0 — RE-PARSING DE المزضف §52-61. 26 personnes ajoutees. §52: سيد عمار, أحمد سالم et آسية (de la premiere epouse شوت), محمد المختار (de la seconde نبغوها); maternite de العمره rattachee a شوت. §54: cinq enfants absents — مريم (avec sa note de descendance), الأمين, أم الخيري, أحمد سالم, آمنة. §55: le fils فلان. §56: les quatre enfants فايزه, القطب, محمدن, توت — le paragraphe n en avait aucun. §57: la SECONDE epouse مريم بنت رمظان (1400هـ) et les quatre enfants (محمد et أحمد de بركو; عصا موسى et ابَّابَّو de مريم); dates completees (deces 1437هـ/2016م) et lieu تنبيعلي ajoute. §59: les cinq enfants أحمد, ابَّـدَّ (محمد اليدالي), اباه, احبيبو, توت. §60: la fille باره. §61: la fille النصره. DATES: احبيبه (§58) portait un avertissement identique a celui de باره — sa date est un DECES (1433هـ/2012م), coherent avec le deces de son mari en 1410هـ/1990م. مينمي (§60) portait 1413هـ/1983م, incoherent (1413هـ = 1992م); la source ecrit 5041هـ/5891م, soit 1405هـ/1985م par inversion OCR des chiffres. مريم (§53) corrigee de 1354 a 1355هـ/1936م. Arbre : 7030 personnes",
  "1.66.0 — RE-PARSING DE المزضف §44-51. EPOUSE DEPLACEE: ميمونو بنت ابن عمر بن محمود (lieu تاتيلت) figurait comme epouse du §49; la source en fait la SECONDE epouse du §46 (أحمد بن محمد الباقر). Ses cinq enfants lui sont rendus: الدَّاه (§49), عبد الرحمن (§69), ابَّيَّو, اخديجات et عايشا; les quatre autres restent a la premiere epouse اخديجات بنت الأمين. EPOUSE RESTITUEE: le §49 avait donc perdu la sienne — c est فاطمة بنت اَّمِّن بن بوبكر (lieu اكماط), deja presente sous Z21d2, dont la note disait litteralement «أم أبناء الدَّاه بن أحمد بن محمد الباقر». Ses six enfants lui sont rattaches. DATES RECTIFIEES (motif (....-XXXX) = deces, non naissance): §48 أحمد et §49 الدَّاه et §62 أحمد, ainsi que باره (§50) et منت بدي (§51). Le noeud باره portait justement un avertissement signalant que sa date contredisait le deces de son mari: elle est morte en 1396هـ/1976م, lui en 1380هـ/1961م — tout concorde une fois la date lue comme un deces. Dates ajoutees au §51 (1319هـ/1901م – 1375هـ/1955م) et corrigees pour آيَّو (1363هـ/1944م). MATERNITES du §51: كمبو et آيَّو a la premiere epouse عائشة, اتويتاه a la seconde منت بدي. AJOUTS: le fils محمد du §46 (لم يعقب), la fille ميمونو du §49 (لم تعقب), la fille عائشة du §50 (1357هـ/1938م). Arbre : 7004 personnes",
  "1.65.0 — PANNEAU QUALITE: les personnes hors du perimetre tribal (ext) sont desormais exclues des trois listes — sans pere, sans mere, prenoms a reviser. Leur filiation n a pas vocation a etre documentee ici et leur nom conserve legitimement la chaine genealogique qui permet de les identifier; elles saturaient les listes sans representer un defaut a corriger. Effet: sans pere 545 -> 183, sans mere 779 -> 320, noms longs 4 -> 2. Mention ajoutee dans l en-tete du panneau. Arbre inchange : 7001 personnes",
  "1.64.0 — PRINCIPE STRUCTUREL (signalement utilisateur): aucun homme de la tribu ne doit porter un identifiant XA. Les noeuds XA sont des ascendants reconstitues a partir des chaines genealogiques d epouses; un homme qui descend de la tribu existe forcement deja sous son identifiant de famille. Constat: les 1339 noeuds XA etaient TOUS masculins, dont 268 remontaient a une racine tribale (233 vers محنض, 35 vers مودي مالك). FUSIONS (119): appariement par chaine genealogique complete de profondeur identique avec tolerance aux variantes OCR — 116 correspondances uniques, dont XA1->E43 (السبيتي/السبتي), XA2->E46, XA3->E44, XA5->G83 (الزضف/المزضف), XA11->D57, XA17->Z16, XA25->K18; puis 3 cas resolus par concordance des trois premieres generations avec une seule divergence: XA45->D49, XA66->Z62, XA95->F83 (ou محي est une troncature de محيين et محمذن sa glose). RENOMMAGES (149): les XA tribaux restants sont des fils reels non documentes dans les paragraphes, connus seulement par la genealogie d une epouse. Ils recoivent un identifiant conforme, pere + suffixe s, resolu de haut en bas en sept iterations (ex. XA6 -> G83s1, XA7 -> G83s1s1). RESULTAT: 0 homme tribal en XA. Les 1071 XA subsistants appartiennent tous a des lignees exterieures a la tribu, ou la reconstitution est legitime. Arbre : 7001 personnes, tous controles a zero",
  "1.63.0 — RE-PARSING DE المزضف §37-43 + correction de maternites erronees. AJOUTS (16 personnes omises): §37 le fils محمد (لم يعقب); §38 le fils محمد (لم يعقب) et les filles تسلم et مريم; §39 les SIX enfants (أحمد سالم, علي, محمد, ناصر الدين, أم كلثوم, خديجة) — le paragraphe n en avait aucun; §40 أم المؤمنين (1355-1437هـ, أحسي السعادة) et فاطمة; §41 آمنة; §42 les deux fils المختار et محمدن — le paragraphe n en avait aucun; §43 أم المؤمنين (لم تعقب). FUSIONS: la chaine reconstituee XA74 (السبيت) dupliquait E43 (السبتي, §43 de الأمين عمي), avec en cascade XA75->E49 (المختار) et XA157->E44 (أحمدون); Z43w1 (مرمين بنت السبيت) dupliquait E43d1 (مريم بنت السبتي) — lignee identique sur huit generations et note explicite «أم أبناء أحمد المبارك». Le §43 n a donc qu une epouse, conformement a la source. CORRECTION DATES: le §39 portait 1429هـ/2008م comme NAISSANCE alors que la source ecrit (....-1429هـ/2008م), soit un DECES — il a six enfants. MATERNITES: cinq enfants avaient pour mere la mere de leur propre pere (grand-mere), sequelle d une passe automatique. Corriges par deduction quand le pere n a qu une epouse: E20w2 -> الزهراء/Z109w1, F53w1 -> نبغوها/Z52w2, G66d1 -> G66w1; maternite fausse retiree quand le pere est polygame: D58, V5w1. OUTILLAGE: le validateur ignorait les objets multi-lignes ecrivant «spouses: [» avec une espace, ce qui produisait de faux mariages non reciproques; corrige. RESTE a arbitrer sur PDF: M38, L16d1, F15w1 (mere non mariee au pere, et qui n est pas la mere du pere). Arbre : 7120 personnes",
  "1.62.0 — CORRECTION de F72 (اكاه/ببكر بن محمد بن ايّاي), §72 famille اما, apres lecture de la source. La source ne lui donne qu'UNE SEULE epouse — مريم بنت اميني (الأمين) بن سيد بن محمد (F72w1, nee 1365هـ) — et SEPT enfants: محمدن (§73), الطبيب محمد (§74), اندي أم الخيرات, ففّه, عبد الله (§75), فاطمة, محمد فال. La pretendue 2e epouse F72w2 «مدّال» etait une invention: le «مدال بن المختار بن اكي الكوري» de la source est le grand-pere du mari de la fille ففّه (dont le mari est الشيخ أحمد = M48, fils de دَّالم/M47), et non une epouse de F72. F72w2 supprimee, ses trois enfants (F75, F72s1, F100w1) rattaches a l'unique mere F72w1. Rappel: أمه/K79w1 avait deja ete corrigee (fille de M47=دَّالم, un homme). Validation: 0 pere feminin, 0 mere masculine, 0 doublon, 0 reference cassee. Arbre : 7108 personnes",
  "1.61.0 — CORRECTION de K79w1 (أمه/ميمونه) apres verification approfondie. Son parent مدال (chaine: أمه بنت مدال بن المختار بن اگّي الكوري بن ايب بن محمذن بن الأمين) est M47 = دَّالم, un HOMME (§47 famille متيلي, ne 1341-1396هـ) — «مدّال» et «دَّالم» sont la meme forme, l'OCR ayant interverti les lettres. أمه est donc sa FILLE: father:M47, rattachee a la fratrie M47d1/M48/M47d2/M47d3. Les corrections erronees des deux tours precedents (mother:F72 puis father/mother:F72w2) sont annulees. Verification: 0 enfant ayant une femme pour pere, 0 mere de genre masculin. NOTE: F72w2 (مدّال, enregistree comme epouse de F72 avec 3 enfants) partage la meme lignee normalisee que M47 — possible doublon homme/femme a arbitrer sur le PDF, laisse en l'etat. Arbre : 7109 personnes",
  "1.60.0 — CORRECTION du rattachement de K79w1 (أمه/ميمونه) apres verification. مدّال (F72w2) est une FEMME, fille de la famille متيلي (via M46), mariee a F72 (اكاه/ببكر, §72 de la famille اما). أمه descend bien d'elle (chaine identique: بنت مدال بن المختار بن اگّي الكوري بن ايب بن محمذن بن الأمين), mais le lien etait errone: مدّال etant une femme, elle est la MERE de أمه et non son pere. Corrige father:F72w2 -> mother:F72w2. Verification globale: 0 enfant ayant une femme pour pere, 0 mere de genre masculin. Arbre : 7109 personnes",
  "1.59.0 — MATERNITES MANQUANTES (signalement utilisateur sur توت بنت أحمد سالم, sans mere). 109 enfants etaient rattaches a un pere n'ayant qu'une seule epouse, sans que la maternite soit renseignee: la mere etant alors sans ambiguite, elle a ete ajoutee (ex. توت/Z84w2 -> mere Z100w1, unique epouse de son pere Z100). Verification de coherence: 0 mere de genre masculin, 0 mere descendante de son enfant, 0 mere==enfant apres correction. Un cas rejete: K79w1 avait recu comme mere F72 qui est en realite le MARI de son ascendante مدّال (F72w2) — retire. Maternites G32s*/G33s1 corrigees: elles pointaient vers G31w1 (leur grand-mere, epouse de G30) au lieu des epouses de G32 et G33 — sequelle du re-parsing du §30. 7 mariages symetrises. RESTE signale pour arbitrage: 8 enfants dont la mere enregistree est deja mariee a un autre homme (M38, L16d1, E20w2, D58, V5w1, F15w1, F53w1, G66d1) — probablement des grand-meres prises pour meres ou des rattachements a verifier sur le PDF. Arbre : 7109 personnes",
  "1.58.0 — ALLEGEMENT (suite) sous le megaoctet. Les 1042 champs fullName qui se reconstruisent exactement a partir de la chaine des peres ont ete supprimes du bloc de donnees; une fonction displayFullName() les reconstitue a la volee a l'affichage (prenom + بن/بنت + noms des ascendants), de sorte que la fiche montre exactement la meme chaine qu'avant. Les 308 fullName non deductibles (noeuds exterieurs a la tribu, dont la lignee n'est pas dans l'arbre) sont conserves. Espaces des listes spouses compactes. Taille : 1293 Ko au depart -> 999 Ko (-23%). Aucune donnee genealogique perdue: 7109 personnes, validation complete a zero.",
  "1.57.0 — ALLEGEMENT DU FICHIER pour permettre la publication de l'artefact (limite de taille atteinte). Aucune donnee genealogique modifiee: 7109 personnes inchangees, tous les champs conserves. Optimisations: (1) src: \"سلسلة نسب\" remplace par src: 1 (meme sens, teste comme booleen dans l'interface) sur 1342 noeuds; (2) espacement du bloc de donnees compacte (indentation et espaces autour des cles retires); (3) APP_VERSION_LOG condense pour les versions <= 1.47. Taille reduite d'environ 1293 Ko a 1111 Ko (-14%). Validation complete: 0 doublon, 0 reference cassee, 0 erreur de compilation, RAW parseable par Node.",
  "1.01.0 – 1.47.0 — Historique condensé : construction initiale des 18 familles, correction OCR (و→ه, 0→5, ولد/ول/منت), séparation tribu/extérieurs, mode debug, fusion massive des doublons (fratries homonymes, ascendants reconstitués, croisements fille/épouse), matérialisation des mariages « أم أبناء X », complétion des paragraphes manquants. Détail complet conservé dans le journal de développement hors artefact.",
  "1.56.0 — CORRECTION (suite) du §37 de المزضف (signalement utilisateur). Repartition des enfants entre les deux epouses: مريم بنت محمد محمود (Z37w1) est la mere des deux fils (أحمد سالم, محمد محمود) ET de cinq des six filles (أم كلثوم, آمنة, الصغرى, محجوبه, خديجة). La seconde epouse فلانة -اديقب- (Z37w2) est uniquement la mere de النَّانَّه. Arbre : 7109 personnes",
  "1.55.0 — CORRECTION du §37 de المزضف (signalement utilisateur). Le §37 (محمد بن بوبكر) n'a que DEUX epouses, non six: مريم بنت محمد محمود (mere des deux fils أحمد سالم et محمد محمود) et une seconde epouse inconnue فلانة -اديقب- (mere des six filles أم كلثوم, آمنة, الصغرى, محجوبه, خديجة, النَّانَّه). Erreur du tour precedent: les notes «أم X» qui suivent chaque fille decrivent le MARI de la fille (mere des enfants de...), et non une co-epouse de محمد; j'avais cree a tort une epouse فلانة par fille. Les quatre noeuds-epouses fictifs (Z37w3 a Z37w6) sont fusionnes dans Z37w2 et toutes les filles rattachees a cette meme mere. Arbre : 7109 personnes",
  "1.54.0 — RE-PARSING DE المزضف, §27 a §38. 28 personnes ajoutees. §29: la fille مـيِّي, la 2e epouse خديجة بنت العتيق السالم et leurs trois enfants (مام, فاطمة, أحمد). §30: trois enfants (محمد, اتَّـات, محمد فال). §31: عزيز et آمال. §32: la 2e epouse ربيعو -dates OCR corrigees 5041هـ/5891م -> 1405هـ/1985م- et ses deux fils فلان. §34: deux fils فلان. §35: la fille ميمونه. §37 (polygame majeur): six epouses فلانة distinctes et leurs filles أم كلثوم, آمنة, الصغرى, محجوبه, خديجة, النَّانَّه, chacune avec sa note de descendance. §38: أم كلثوم. CORRECTION: le §37 (محمد بن بوبكر) portait le marqueur «لم يعقب» alors qu'il a une nombreuse descendance — retire (motif OCR inverse deja rencontre: يعقب lu لم يعقب). Maternite de محمدن (§28) rattachee a la 1re epouse امباركه. Famille Z desormais 466 personnes. Arbre : 7113 personnes",
  "1.53.0 — RE-PARSING DE المزضف, §18 a §26. 14 personnes ajoutees: §18 محمدن (لم يعقب) et la 2e epouse بت بنت ابراهيم, mere de عائشة; §21 deux epouses omises (رقيه -ادوعلي- et مريم بنت المختار بن اسحاق) et leur fille فاطمة (اكماط); §22 أحمد البرا, محمد, محمد سالم et عبد الله (tous لم يعقب); §25 زينب, عيشه, أحمد حيدره; §26 les deux filles فلانة (لم تعقب). MATERNITES ET MARIAGES CORRIGES: خديجة بنت محمد فال بن ابن غازي (Z10w1) etait rattachee comme epouse de بكْن (§22) alors que la source en fait l'epouse de امِّن (§21) — sa propre note «أم أحمد بن اَّمِّـن» le confirme; son fils أحمد (§35) recoit sa maternite. اخت امها (Z12d1), creee au tour precedent depuis le §12, est l'epouse du §22: sa note enumere exactement les quatre fils de بكْن; المختار (§23) recoit sa maternite. La 2e epouse du §22 n'etait pas اميمه بنت ابابك mais فطيمو بنت أحمد المبارك (Z26w1), qui a epouse successivement les deux freres بكْن et اليدالي; حامد (§24) recoit sa maternite. Le noeud Z22w2 etait un doublon de Z21w4 (اميمه بنت ابابك), fusionne avec son ascendant XA499 -> XA498. Maternites completees: الأمين (§70) fils de امهوه, مريم fille de la 2e epouse du §20, عائشة fille de la 2e epouse du §18. Arbre : 7085 personnes",
  "1.52.0 — RE-PARSING DE المزضف, §8 a §17 confrontes a la source. AJOUTS (12 personnes omises): §11 الصغرى (لم تعقب); §12 اخت امها avec sa note de descendance; §13 أحمد (لم يعقب); §15 الزهره (لم تعقب); §16 صفيّه (1367هـ) et أحمد (1372-1402هـ, لم يعقب) ainsi que la SECONDE EPOUSE أم الخيري بنت الأمين, mere de عائشة; §17 cinq enfants absents — محمد فال, الدَّاه (محمد عبد الله), يسر, ساره, أحمد. FUSIONS de doublons non detectes auparavant: la chaine XA303->XA304->XA305 dupliquait Z9 (محمود الله) -> Z13 (اخميطرات) -> Z14 (محمد فال), les variantes محمود لله et محمود الله ayant echappe a la normalisation; XA16 «أحمد دلني» dupliquait Z15 (أحمد الأمين), «دلني» etant une lecture erronee de «الأمين»; R2w1 (امنيانه, epouse de R2) etait la meme personne que Z8d1 (امينيانه) — confirme par sa note «أم أبناء بابارميد (المختار) بن أحمد زروق», qui designe exactement R2. Note de bas de page du §10 ajoutee sur خديجة. Arbre : 7073 personnes",
  "1.51.0 — DERNIERES FUSIONS FEMININES a dates concordantes. Les 19 paires masculines sont laissees de cote sur decision de l'utilisateur. Parmi les 11 paires feminines restantes, 5 avaient des dates de naissance concordantes; 4 ont ete fusionnees: G63w1<-G95Bd2 (بنت الصربو / منت الصبرو — منت et بنت sont le meme marqueur de filiation), M38w2<-V31bw1 (مريم, meme annee gregorienne 1983, l'ecart hegirien 1403/1413 etant une erreur de lecture), D71w2<-Y160w2 (مريم 1367هـ), K63w1<-K20d1 (اَّمانه / مانا 1401هـ). ECARTEE: L18d4 / L18d6 (ميمهنه et اميه, meme pere, meme annee 1401هـ) — deux fiches-filles distinctes dans la meme fiche paternelle avec des prenoms nettement differents: il s'agit de jumelles, non d'un doublon, conformement a la regle etablie avec فاطمو et فاطمة du §47 de ماهي. Arbre : 7066 personnes. Controles a zero",
  "1.50.0 — FUSION DES CROISEMENTS FILLE / EPOUSE. Filtrage successif des 178 paires candidates: ecartees celles aux prenoms clairement differents (16, ex. أحمد / عبد الله), celles ou les deux portent la designation generique فلانة (55, un pere peut avoir plusieurs filles non nommees), et celles aux annees de naissance differentes (27, ex. ابَّاه 1402هـ et سيد 1404هـ, deux freres). Restaient 65 paires; parmi elles, appliquees les 35 impliquant deux femmes en croisement fiche-fille (d) et noeud-epouse (w). La comparaison des prenoms traite desormais le nom principal et la glose entre parentheses sans distinction, car la source les intervertit parfois (منت النبي (فاطمة) / فاطمة (منت النبي)), et tolere les variantes orthographiques (خدجية / خديجة). La fiche fille est conservee comme ancrage identitaire et recoit prenom le plus complet, mere, dates, lieu, chaine, notes et mariages. ECARTEES pour glose contradictoire ou nom trop eloigne: M56d1 (خديجة) / Y45w1 (فاطمة), K20d1 / K63w1, F17d1 / F102w1. Arbre : 7070 personnes",
  "1.49.0 — DETECTION MULTI-CRITERES DES DOUBLONS (declenchee par Z100w1 = K31d1). Les detections precedentes reposaient sur l'egalite des prenoms normalises, ce qui laissait passer les troncatures OCR: «ت (عائشة)» contre «نشت (عائشة)». Nouveau score combinant meme mere (+3), memes dates (+3), meme lieu (+2), prenom compatible (+3, en comparant aussi les gloses entre parentheses), avec malus si les deux portent un numero de paragraphe (-6). 178 paires candidates. Fusion appliquee aux 15 paires de score >= 9, soit 11 groupes et 13 noeuds absorbes: Z100w1<-K31d1, Z105w2<-K30w2+K4d2, G106w1<-K34w3+G91d1, Z152w1<-F32d1, Z87w1<-K115d3, K37w1<-K40d1, Z52w2<-Z110w1, Z127w3<-I7d2, J26w1<-J18d1, R11w1<-F95d1, F83w1<-F26d2. Le noeud conserve recoit le prenom le plus complet ainsi que mere, dates, lieu, chaine, notes et mariages. 163 paires de score 6-8 laissees a l'arbitrage: une meme mere et un prenom voisin ne suffisent pas, comme l'a montre le cas فاطمو / فاطمة du §47 de ماهي. Arbre : 7105 personnes",
  "1.48.0 — DOUBLONS D'ASCENDANTS RECONSTITUES (signalement utilisateur sur les enfants de الأمين بن محم بن ابو الحس). Nouvelle detection par SIGNATURE DE LIGNEE (nom + trois generations normalisees) au lieu de la seule fratrie: 41 groupes ou un noeud cree (*) doublait un noeud reel et 27 groupes de creations entre elles — 70 noeuds absorbes. Exemples: XA35 -> Z71 (عبد الله §71), XA40 et XA1431 -> Z98 (محمد §98), XA102 -> Z99, XA103 -> Z100. DEUX CHAINES A GENERATION PARASITE re-ancrees puis fusionnees en cascade: محمد الباقر et حمم etaient rattaches a الأمين (§70) alors que la source ne lui donne pour fils que عبد الله, حيب الله, عبد الودود, محمد, محمذن et احمد — ils sont en realite fils de محم (Z19) et de ابو الحس (Z8). XA63->Z45, XA64->Z46, XA96->Z19, XA97->Z44. Enfin les deux اخديجات filles de الأمين, toutes deux mariees a Z46, sont reunies (Z46w1 -> Z70d2): la source n'en mentionne qu'une. Arbre : 7118 personnes",
];

/* ============================================================================
   DONNÉES — أهل ماه
   Reconstruites à partir du document "الفصل 5: أهل ماه" (51 paragraphes).
   id = identifiant technique. "para" = numéro de فقرة dans le PDF source (si applicable).
   father = id du père (lien de sang, agnatique). spouses = liste d'id d'épouses/époux.
   Certaines épouses ont été identifiées, avec un haut degré de confiance, comme
   étant elles-mêmes descendantes de ماه (mariages entre les deux branches) : ces
   liens sont marqués crossLink:true et permettent au comparateur de trouver des
   parentés supplémentaires par alliance.
============================================================================ */

const RAW = [
{id:"T0",name:"سيد الفالي",g:"M",father:"T0-hamnadh",
    note: "الجد الجامع لقبيلة سيد الفالي — ancêtre commun de la tribu"},
{id:"T0-kawri",name:"الكوري",g:"M",father:"T0",note:"بن سيد الفالي"},
{id:"T0-fali",name:"الفالي",g:"M",father:"T0-kawri",note:"بن الكوري بن سيد الفالي",spouses:["Y1d6"]},
{id:"P1",para:1,name:"ماهي (ماه)",g:"M",father:"T0",family:"mahi",
    dates: "1061هـ/1651م – ....",place:"قرب ترتالس",
    note: "بن سيد الفالي",
    spouses:["P1w1","P1w2"]},
{id:"P1w1",name:"متونت",g:"F",father:"XA314",spouses:["P1"],ext:true},
{id:"P1w2",name:"امنيانه",g:"F",father:null,place:"تنرتدل",spouses:["P1"]},
{id:"P1s1",name:"الخير",g:"M",father:"P1",place:"تينشيكل",note:"لم يعقب"},
{id:"P1s2",name:"المختار",g:"M",father:"P1",dates:"1272هـ/1662م – ....",place:"تنيجدماره",note:"لم يعقب"},
{id:"P2",para:2,name:"با (الأمين)",g:"M",father:"P1",mother:"P1w2",place:"تنرتدل",spouses:["P2w1","G3d1"]},
{id:"P2w1",name:"اجيه",g:"F",father:"G3",mother:"G3w1",spouses:["P2"],crossLink:true},
{id:"P2d2",name:"عايشا",g:"F",father:"P2",mother:"P2w1",note:"أم بعض أبناء محمد بن اشفغ الدختار با"},
{id:"P2d3",name:"فلانة",g:"F",father:"P2",mother:"P2w1",note:"زوجة كامل بن حبلل بن ماه — رابط entre les deux branches",spouses:["P49"],crossLink:true},
{id:"P2d4",name:"فلانة",g:"F",father:"P2",mother:"P2w1",note:"أم سيد وغادجيو، ابنَي محمد اغربظ بن محمد الكرم"},
{id:"P3",para:3,name:"عركاب (حمم)",g:"M",father:"P2",mother:"P2w1",place:"تنيخلف",spouses:["G4d1","G36d1b"],
    extraSpouses: ["امباركو — أم فاطمة من أبناء سعدون بن محمذن بن أحمد زروق","جرفونو — أم أبناء عاش قرنا بن محمد بن اشفغ الدختار با","صفيو — أم محمذن ميلود واينو من أبناء السمهودي","بوزه — أم أبناء الحص بن محمد بن سيد الأمين"]},
{id:"P4",para:4,name:"سلمان",g:"M",father:"P3",mother:"G4d1",note:"لا ذرية ذكور موثّقة",spouses:["P4w1"]},
{id:"P4w1",name:"فلانة",g:"F",father:"XA1163",spouses:["P4"],fullName:"فلانة بنت عاش قرنا بن محمد بن اشفغ الدختار با",ext:true},
{id:"P4d1",name:"أم المؤمنين",g:"F",father:"P4",mother:"P4w1",note:"لم تعقب"},
{id:"P5",para:5,name:"محمذن",g:"M",father:"P3",mother:"G4d1",place:"تنياشل",spouses:["P48d1"]},
{id:"P5d1",name:"فاطمه",g:"F",father:"P5",mother:"P48d1",note:"أم أبناء الحفيد بن حيب الله بن الفايل بن أحمد زروق"},
{id:"P6",para:6,name:"محمد",g:"M",father:"P5",mother:"P48d1",place:"آشكركط",spouses:["Z70d5"]},
{id:"P7",para:7,name:"اَّمي محمد",g:"M",father:"P6",mother:"Z70d5",dates:"1228هـ/1813م – 1323هـ/1905م",place:"أبير حيبلل",spouses:["P51d1"]},
{id:"P7d1",name:"خدّج",g:"F",father:"P7",mother:"P51d1",note:"أم أبناء محمذن بن ابامين (الأمين) بن المختار بن أحمد الهنكر"},
{id:"P7d2",name:"فاطمه",g:"F",father:"P7",mother:"P51d1",note:"أم محمدون ومحمذن وعائشة وأم الخير وأمرام من أبناء حمّ بن انداه (المختار)"},
{id:"P7d3",name:"مريم",g:"F",father:"P7",mother:"P51d1",note:"أم أبناء ختّار (المختار السالم) بن محمذن ميلود",spouses:["K81"]},
{id:"P8",para:8,name:"ابَّا (عبد الله)",g:"M",father:"P7",mother:"P51d1",dates:"1277هـ/1861م – 1344هـ/1926م",place:"أبير حيبلل",
    spouses:["P8w1","P8w2"]},
{id:"P8w1",name:"باتّه (امباركه)",g:"F",father:"Z105",mother:"Z105w2",spouses:["P8"],fullName:"باتّه (امباركه) بنت سيد بن محمد بن الأمين بن حمم ول أبو الحس بن المزضف"},
{id:"P8w2",name:"مريم",g:"F",father:null,place:"دليلحو",spouses:["P8"]},
{id:"P8d1",name:"مرم",g:"F",father:"P8",note:"زوجة هيدي (سيد) بن ابو محمد — رابط داخلي بالأسرة",spouses:["P19"],crossLink:true},
{id:"P9",para:9,name:"ببها",g:"M",father:"P8",dates:"1335هـ/1917م – 1430هـ/2009م",place:"تنيخلف",
    spouses:["P9w1"]},
{id:"P9w1",name:"الما",g:"F",father:"Z131",spouses:["P9"],fullName:"الما بنت الأمين بن سيد بن محمد بن الأمين بن حمم بن أبو الحس"},
{id:"P9d0",name:"صفيه",g:"F",father:"P9",mother:"P9w1",dates:"1367هـ/1948م –",note:"بنت ببها بن ابَّا (عبد الله) بن اَّمي محمد بن محمد بن محمذن بن عركاب (حمم) بن ابوبا بن ماهي — رابط بين الأسرتين",spouses:["F54"],crossLink:true},
{id:"P9d1",name:"باتّه",g:"F",father:"P9",mother:"P9w1",note:"زوجة محمد المختار بن هيدي — رابط داخلي بالأسرة",spouses:["P20"],crossLink:true},
{id:"P9d2",name:"آسية",g:"F",father:"P9",mother:"P9w1",note:"زوجة يحي بن أحمد بن ابَّا — رابط داخلي بالأسرة",spouses:["P14"],crossLink:true},
{id:"P9d3",name:"صباح",g:"F",father:"P9",mother:"P9w1",note:"أم أحمد محمود وغيره من أبناء محمد بن عبدالله بن محمد فال"},
{id:"P10",para:10,name:"أحمد",g:"M",father:"P9",mother:"P9w1",dates:"1378هـ/1959م –",spouses:["P10w1","P10w2"]},
{id:"P10w1",name:"بنت خويلد",g:"F",father:"G90",mother:"G86d2",dates:"1386هـ/1966م –",note:"بنت بدديه (محمدن) بن محمد بن بييين بن امحيد بن المزضف — رابط بين الأسرتين (سلالة مودي مالك)؛ متزوجة من P10 ومن I36 (احمد)",spouses:["P10","I36"],crossLink:true},
{id:"P10w2",name:"النعمه",g:"F",father:"XA1096",spouses:["P10"],ext:true},
{id:"P10s1",name:"محمدن",g:"M",father:"P10"},
{id:"P10s2",name:"الحسين",g:"M",father:"P10"},
{id:"P10d1",name:"ملكه",g:"F",father:"P10"},
{id:"P10d2",name:"الناهه",g:"F",father:"P10"},
{id:"P10s3",name:"ببها",g:"M",father:"P10"},
{id:"P10s4",name:"الشيخ",g:"M",father:"P10"},
{id:"P10d3",name:"باتّه",g:"F",father:"P10"},
{id:"P11",para:11,name:"ابو (محمد)",g:"M",father:"P9",mother:"P9w1",dates:"1381هـ/1962م –",spouses:["P13d2"]},
{id:"P11d1",name:"عيشه",g:"F",father:"P11",mother:"P13d2"},
{id:"P11s1",name:"عبد الله",g:"M",father:"P11",mother:"P13d2",place:"انواكشوط",note:"توفي"},
{id:"P11d2",name:"باتّه",g:"F",father:"P11",mother:"P13d2"},
{id:"P11s2",name:"سيد محمود",g:"M",father:"P11",mother:"P13d2"},
{id:"P11d3",name:"منى (مريم السالمه)",g:"F",father:"P11",mother:"P13d2"},
{id:"P12",para:12,name:"سيد محمد",g:"M",father:"P8",dates:"1339هـ/1921م – 1436هـ/2015م",place:"تنيخلف",spouses:["P12w1"]},
{id:"P12w1",name:"أم الخير",g:"F",father:"XA503",spouses:["P12"],ext:true},
{id:"P12s1",name:"عبد الله",g:"M",father:"P12",mother:"P12w1",note:"توفي صغيرًا"},
{id:"P12d2",name:"اميه",g:"F",father:"P12",mother:"P12w1",dates:"1379هـ/1960م –",note:"بنت سيد محمد بن ابَّا (عبد الله) بن اَّمي محمد بن محمد بن محمذن بن عركاب (حمم) بن ابوبا بن ماهي — رابط بين الأسرتين",spouses:["F66"],crossLink:true},
{id:"P13",para:13,name:"أحمد",g:"M",father:"P8",dates:"1341هـ/1923م –",spouses:["P13w1"]},
{id:"P13w1",name:"عائشة",g:"F",father:"XA503",spouses:["P13"],ext:true},
{id:"P14",para:14,name:"يحي",g:"M",father:"P13",mother:"P13w1",dates:"1378هـ/1959م –",spouses:["P9d2"]},
{id:"P13d1",name:"اَّمن",g:"F",father:"P13",mother:"P13w1",dates:"1381هـ/1962م –",note:"بنت أحمد بن ابَّا (عبد الله) بن اَّمي محمد بن محمد بن محمذن بن عركاب (حمم) بن ابوبا بن ماهي — رابط بين الأسرتين",spouses:["F68"],crossLink:true},
{id:"P15",para:15,name:"محمدن",g:"M",father:"P13",mother:"P13w1",dates:"1382هـ/1963م –",spouses:["P15w1"]},
{id:"P13d2",name:"فاطمة",g:"F",father:"P13",mother:"P13w1" ,spouses:["P11"]},
{id:"P16",para:16,name:"زين العابدين (عبد الله)",g:"M",father:"P13",mother:"P13w1",dates:"1391هـ/1971م –",spouses:["P16w1"]},
{id:"P13s1",name:"ابن",g:"M",father:"P13",mother:"P13w1"},
{id:"P13d3",name:"توت",g:"F",father:"P13",mother:"P13w1",dates:"1397هـ/1977م –",note:"أم أبناء محمدن بن محمد عبد الله بن الحسن بن سيد بن محمد بن الأمين بن حمم بن ابو الحس بن المزضف — رابط بين الأسرتين",spouses:["Z146"],crossLink:true},
{id:"P17",para:17,name:"ابَّاه (محمد فال)",g:"M",father:"P13",mother:"P13w1",dates:"1402هـ/1982م –",spouses:["K127d1"]},
{id:"P13s2",name:"سيد (محمد فال)",g:"M",father:"P13",mother:"P13w1",dates:"1404هـ/1984م –"},
{id:"P14w_placeholder",name:"(آسية — voir P9d2)",g:"F",father:null},
{id:"P14s1",name:"أحمد",g:"M",father:"P14",mother:"P9d2"},
{id:"P14d1",name:"عيشه",g:"F",father:"P14",mother:"P9d2"},
{id:"P14s2",name:"اباه",g:"M",father:"P14",mother:"P9d2"},
{id:"P14d2",name:"آمال",g:"F",father:"P14",mother:"P9d2"},
{id:"P14d3",name:"باتّه",g:"F",father:"P14",mother:"P9d2"},
{id:"P15w1",name:"بنت يسلم",g:"F",father:"XA503",spouses:["P15"],ext:true},
{id:"P15s1",name:"محمد الأمين",g:"M",father:"P15",mother:"P15w1"},
{id:"P15d1",name:"عيشه",g:"F",father:"P15",mother:"P15w1"},
{id:"P15d2",name:"لمروه",g:"F",father:"P15",mother:"P15w1"},
{id:"P15d3",name:"تكيبر",g:"F",father:"P15",mother:"P15w1"},
{id:"P15d4",name:"اميمن",g:"F",father:"P15",mother:"P15w1"},
{id:"P16w1",name:"الدَّرة",g:"F",father:"XA316",spouses:["P16"],ext:true},
{id:"P16s1",name:"الحاج أحمد",g:"M",father:"P16",mother:"P16w1",dates:"1432هـ/2011م –"},
{id:"P16s2",name:"محمد علي",g:"M",father:"P16",mother:"P16w1",dates:"1434هـ/2013م –"},
{id:"P17d1",name:"اَّمن",g:"F",father:"P17",mother:"K127d1",dates:"1436هـ/2016م –"},
{id:"P18",para:18,name:"ابو (محمد)",g:"M",father:"P7",mother:"P51d1",dates:"1281هـ/1865م – 1381هـ/1962م",place:"تنيخلف",spouses:["P18w1"]},
{id:"P18w1",name:"أمه (ميمونه)",g:"F",father:"Y71",mother:"Y71w1",dates:"…؟… – 1377هـ/1958م",place:"تنيخلف",note:"زواج بين الأسرتين (اشفغ الأمين)",spouses:["P18"],crossLink:true},
{id:"P18s1",name:"محمذن",g:"M",father:"P18",mother:"P18w1",note:"لم يعقب"},
{id:"P19",para:19,name:"هيدي (سيد)",g:"M",father:"P18",mother:"P18w1",dates:"1404هـ/1984م –",place:"تنيخلف",spouses:["P8d1"]},
{id:"P18s2",name:"عبد الله",g:"M",father:"P18",mother:"P18w1",note:"لم يعقب"},
{id:"P26",para:26,name:"أحمد",g:"M",father:"P18",mother:"P18w1",dates:"1333هـ/1915م – 1422هـ/2001م",place:"تنيخلف" ,spouses:["N7d2","K121d3"]},
{id:"P18s3",name:"البرا",g:"M",father:"P18",mother:"P18w1",note:"لم يعقب"},
{id:"P20",para:20,name:"محمد المختار",g:"M",father:"P19",mother:"P8d1",dates:"1365هـ/1946م –",spouses:["P9d1"]},
{id:"P23",para:23,name:"الگناني (يحظيه)",g:"M",father:"P19",mother:"P8d1",dates:"1368هـ/1949م –",spouses:["P23w1"]},
{id:"P24",para:24,name:"حبيب",g:"M",father:"P19",mother:"P8d1",dates:"1372هـ/1953م –",spouses:["P24w1"]},
{id:"P25",para:25,name:"ولد الطلبه (محمد)",g:"M",father:"P19",mother:"P8d1",dates:"1376هـ/1957م –",spouses:["P25w1","P25w2"]},
{id:"P19d1",name:"نو",g:"F",father:"P19",mother:"P8d1"},
{id:"P21",para:21,name:"محمد",g:"M",father:"P20",mother:"P9d1",dates:"1397هـ/1977م –",spouses:["P21w1"]},
{id:"P22",para:22,name:"عبد الله",g:"M",father:"P20",mother:"P9d1",dates:"1401هـ/1981م –",spouses:["P22w1"]},
{id:"P20s1",name:"أحمد",g:"M",father:"P20",mother:"P9d1",dates:"1402هـ/1982م –"},
{id:"P20d1",name:"لمروه",g:"F",father:"P20",mother:"P9d1"},
{id:"P20d3",name:"مريم",g:"F",father:"P20",mother:"P9d1" ,spouses:["Z131"]},
{id:"P20d4",name:"فضيله",g:"F",father:"P20",mother:"P9d1"},
{id:"P21w1",name:"فرحه",g:"F",father:"W1",mother:"W1w1",spouses:["P21"],crossLink:true,fullName:"فرحه بنت د(محمد) بن الربا"},
{id:"P21s1",name:"ببها",g:"M",father:"P21",mother:"P21w1"},
{id:"P21s2",name:"سيد",g:"M",father:"P21",mother:"P21w1"},
{id:"P21s3",name:"أحمد",g:"M",father:"P21",mother:"P21w1"},
{id:"P22w1",name:"الزاكية",g:"F",father:"K19",mother:"K19w1",spouses:["P22"]},
{id:"P22d1",name:"فلانة",g:"F",father:"P22",mother:"P22w1"},
{id:"P23w1",name:"النبه (فاطمة)",g:"F",father:"XA318",spouses:["P23"],ext:true},
{id:"P23s1",name:"بدالي",g:"M",father:"P23",mother:"P23w1"},
{id:"P23s2",name:"محمد",g:"M",father:"P23",mother:"P23w1"},
{id:"P23s3",name:"محمدن",g:"M",father:"P23",mother:"P23w1"},
{id:"P23s4",name:"أحمد",g:"M",father:"P23",mother:"P23w1"},
{id:"P23s5",name:"عبد الفتاح",g:"M",father:"P23",mother:"P23w1"},
{id:"P23d1",name:"زينب",g:"F",father:"P23",mother:"P23w1"},
{id:"P23s6",name:"عبد الله",g:"M",father:"P23",mother:"P23w1"},
{id:"P24w1",name:"عائشة",g:"F",father:"G75",spouses:["P24"],mother:"G70w2",dates:"1393هـ/1973م –",note:"أم أبناء حبيب بن هيدي (سيدي) بن ابو (محمد) بن أمين بن محمد بن محمذن بن عركاب (حمم) بن ابوبا (الأمين) بن ماهي"},
{id:"P24s1",name:"محمدن",g:"M",father:"P24",mother:"P24w1"},
{id:"P24s2",name:"بدالي",g:"M",father:"P24",mother:"P24w1"},
{id:"P24d1",name:"تنم",g:"F",father:"P24",mother:"P24w1"},
{id:"P24s3",name:"سيد",g:"M",father:"P24",mother:"P24w1"},
{id:"P24d2",name:"نصيره",g:"F",father:"P24",mother:"P24w1"},
{id:"P24d3",name:"باتّه",g:"F",father:"P24",mother:"P24w1"},
{id:"P24s4",name:"ببها",g:"M",father:"P24",mother:"P24w1"},
{id:"P25w1",name:"بنت خير محمد الطالب أخيار",g:"F",father:null,spouses:["P25"]},
{id:"P25w2",name:"النَّيّه",g:"F",father:"I82",mother:"I82w1",dates:"1386هـ/1966م –",note:"زواج بين الأسرتين (ابراهيم)",spouses:["P25","V22"],crossLink:true,fullName:"النَّيّه بنت هايل (سيد الفالي) بن ددالي (محمذن اليدالي) بن محمد بن شيبة بن الفالي بن عميا بن ابراهيم"},
{id:"P25s1",name:"سيد أحمد",g:"M",father:"P25",mother:"P25w1",dates:"1417هـ/1997م –"},
{id:"P25d1",name:"مريم",g:"F",father:"P25",mother:"P25w1"},
{id:"P25s2",name:"يوسف",g:"M",father:"P25",mother:"P25w1",dates:"1426هـ/2006م –"},
{id:"P25s3",name:"الحسين",g:"M",father:"P25",mother:"P25w1",dates:"1429هـ/2008م –"},
{id:"P25d2",name:"ميمونه",g:"F",father:"P25",mother:"P25w2",dates:"1422هـ/2001م –"},
{id:"P27",para:27,name:"محمذن باب",g:"M",father:"P26",mother:"K121d3",dates:"1367هـ/1948م –",spouses:["P27w1"]},
{id:"P27w1",name:"خديجة",g:"F",father:"XA1100",note:"زوجة محمذن باب (P27) حسب مصدر ماهي — لا يُدمج مع خديجة أخرى دون تطابق كامل للنسب",spouses:["P27"],ext:true},
{id:"P28",para:28,name:"اكنين",g:"M",father:"P26",mother:"K121d3",dates:"1372هـ/1953م –",spouses:["P28w1"]},
{id:"P29",para:29,name:"محمدن",g:"M",father:"P26",mother:"N7d2",dates:"1379هـ/1960م –",spouses:["G70d2"]},
{id:"P30",para:30,name:"اسالم (هيدي)",g:"M",father:"P26",mother:"N7d2",dates:"1395هـ/1975م –",spouses:["P30w1"]},
{id:"P31",para:31,name:"عابدين (عبد الله)",g:"M",father:"P26",mother:"N7d2",dates:"1398هـ/1978م –",spouses:["P31w1"]},
{id:"P27d1",name:"تنم (ميمونه)",g:"F",father:"P27",mother:"P27w1",dates:"1401هـ/1981م –",note:"بنت محمذن باب بن أحمد بن ابو (محمد) بن اَّمي بن محمد بن محمذن بن عركاب (حمم) بن ابوبا (الأمين) بن ماهي — رابط بين الأسرتين",spouses:["Z147"]},
{id:"P27s1",name:"سيد",g:"M",father:"P27",mother:"P27w1"},
{id:"P27s2",name:"المختار",g:"M",father:"P27",mother:"P27w1"},
{id:"P27d2",name:"توت",g:"F",father:"P27",mother:"P27w1"},
{id:"P27d3",name:"الزاكيه",g:"F",father:"P27",mother:"P27w1"},
{id:"P28w1",name:"مرم",g:"F",father:"XA320",spouses:["P28"],ext:true},
{id:"P28s1",name:"اقريني (محمد فال)",g:"M",father:"P28",mother:"P28w1"},
{id:"P28s2",name:"السالك",g:"M",father:"P28",mother:"P28w1"},
{id:"P29s1",name:"أحمد",g:"M",father:"P29",mother:"G70d2"},
{id:"P29s2",name:"محمد",g:"M",father:"P29",mother:"G70d2"},
{id:"P29d1",name:"فضيله",g:"F",father:"P29",mother:"G70d2"},
{id:"P29d2",name:"عائشة",g:"F",father:"P29",mother:"G70d2"},
{id:"P29d3",name:"أمه",g:"F",father:"P29",mother:"G70d2"},
{id:"P30w1",name:"أمه (مرم)",g:"F",father:"XA1102",spouses:["P30"],ext:true},
{id:"P30s1",name:"أحمد",g:"M",father:"P30",mother:"P30w1"},
{id:"P30d1",name:"السالمه",g:"F",father:"P30",mother:"P30w1"},
{id:"P30d2",name:"عيشه",g:"F",father:"P30",mother:"P30w1"},
{id:"P31w1",name:"الديده (أولاد غيلان)",g:"F",father:null,spouses:["P31"]},
{id:"P31d1",name:"الزهره",g:"F",father:"P31",mother:"P31w1"},
{id:"P32",para:32,name:"الأمين",g:"M",father:"P7",mother:"P51d1",place:"تفنانيت",spouses:["P32w1"]},
{id:"P32w1",name:"عيشتونه",g:"F",father:"Z12",mother:"Z12w1",spouses:["P32"]},
{id:"P32d1",name:"مريم",g:"F",father:"P32",mother:"P32w1",dates:"1351هـ/1932م –",place:"اركيز",note:"بنت الأمين بن اَّمي محمد بن محمد بن محمذن بن عركاب (حمم) بن ابوبا بن ماهي — رابط بين الأسرتين؛ بنت الأمين بن اَّمي محمد بن محمذن بن عركاب بن با (الأمين) بن ماهي — رابط بين الفرعين",spouses:["F50","K81"],crossLink:true},
{id:"P33",para:33,name:"سيد الفالي",g:"M",father:"P5",mother:"P48d1",place:"مدينة كايي (شرق روصو)",spouses:["P33w1"]},
{id:"P33w1",name:"عيندنا (آمنة)",g:"F",father:"XA322",spouses:["P33"],ext:true},
{id:"P34",para:34,name:"أسلم",g:"M",father:"P33",mother:"P33w1",place:"أبير حيبلل",spouses:["P34w1","P34w2","E46d1"]},
{id:"P33d1",name:"خديجة",g:"F",father:"P33",mother:"P33w1",note:"لم تعقب"},
{id:"P33d2",name:"العاليه",g:"F",father:"P33",mother:"P33w1"},
{id:"P34w1",name:"خديجة",g:"F",father:"E46",place:"محجوبو",spouses:["P34"]},
{id:"P34w2",name:"عائشة",g:"F",father:"K61",dates:"1333هـ/1915م – 1424هـ/2003م",place:"أبير حيبلل",spouses:["P34"],crossLink:true,mother:"K123d2"},
{id:"P35",para:35,name:"محمد",g:"M",father:"P34",dates:"1333هـ/1915م – 1405هـ/1985م",place:"أبير حيبلل",spouses:["M30d2"]},
{id:"P41",para:41,name:"السيد",g:"M",father:"P34",dates:"1341هـ/1923م – 1416هـ/1996م",place:"أبير حيبلل",spouses:["P41w1","E45d1"]},
{id:"P45",para:45,name:"اباه",g:"M",father:"P34",dates:"1376هـ/1957م –",spouses:["P45w1","P45w2"]},
{id:"P36",para:36,name:"حمّم",g:"M",father:"P35",mother:"M30d2",dates:"1371هـ/1952م –",spouses:["P36w1"]},
{id:"P35d1",name:"غمبوجه (آمنة)",g:"F",father:"P35",mother:"M30d2"},
{id:"P37",para:37,name:"ولد اباه (أحمّد)",g:"M",father:"P35",mother:"M30d2",dates:"1375هـ/1956م –",spouses:["K115d1"]},
{id:"P38",para:38,name:"محمدن",g:"M",father:"P35",mother:"M30d2",dates:"1378هـ/1959م –",spouses:["P38w1"]},
{id:"P39",para:39,name:"امّم (محمذن)",g:"M",father:"P35",mother:"M30d2",dates:"1381هـ/1962م –",spouses:["P39w1"]},
{id:"P40",para:40,name:"أحمد",g:"M",father:"P35",mother:"M30d2",dates:"1384هـ/1964م –",spouses:["Z140w1"]},
{id:"P35s1",name:"ابو",g:"M",father:"P35",mother:"M30d2",dates:"1386هـ/1966م – 1426هـ/2006م",place:"انواذيبو",note:"لم يعقب"},
{id:"P35s2",name:"المختار",g:"M",father:"P35",mother:"M30d2",dates:"1397هـ/1977م –"},
{id:"P36w1",name:"َمْيمه",g:"F",father:"I15",dates:"1375هـ/1956م –",spouses:["P36"],crossLink:true,fullName:"َمْيمه بنت أحمد سالم بن عبد الله بن ابوبا (ببكر) بن المختار بن سيد أحمد بن حبلل بن ابراهيم",mother:"I15w1",note:"أم أبناء حمّم بن محمد بن اسلم بن سيد الفالي بن محمذن بن عركاب (حمم) بن ابوبا (الأمين) بن ماه"},
{id:"P36d1",name:"ملكه (طيما)",g:"F",father:"P36",mother:"P36w1"},
{id:"P36d2",name:"فايزه (مريم)",g:"F",father:"P36",mother:"P36w1"},
{id:"P36s1",name:"محمد",g:"M",father:"P36",mother:"P36w1"},
{id:"P37d1",name:"مريم",g:"F",father:"P37",mother:"K115d1"},
{id:"P37s1",name:"ددالي",g:"M",father:"P37",mother:"K115d1"},
{id:"P37s2",name:"محمد",g:"M",father:"P37",mother:"K115d1"},
{id:"P37s3",name:"امّم (محمذن)",g:"M",father:"P37",mother:"K115d1"},
{id:"P38w1",name:"ميمونه",g:"F",father:"XA323",spouses:["P38"],ext:true},
{id:"P38d1",name:"حسينه",g:"F",father:"P38",mother:"P38w1"},
{id:"P38s1",name:"فالن",g:"M",father:"P38",mother:"P38w1"},
{id:"P39w1",name:"اغله العزه (أولاد الناصر)",g:"F",father:null,spouses:["P39"]},
{id:"P39d1",name:"طيما",g:"F",father:"P39",mother:"P39w1"},
{id:"P39s1",name:"أسلم",g:"M",father:"P39",mother:"P39w1"},
{id:"P39d2",name:"انويثي",g:"F",father:"P39",mother:"P39w1"},
{id:"P40s1",name:"المصطفى",g:"M",father:"P40",mother:"Z140w1"},
{id:"P40s2",name:"محمد الأمين",g:"M",father:"P40",mother:"Z140w1"},
{id:"P41w1",name:"عائشة",g:"F",father:"E45",dates:"1354هـ/1935م –",spouses:["P41"]},
{id:"P41s1",name:"محمدن",g:"M",father:"P41",mother:"P41w1"},
{id:"P41s2",name:"الشيخ",g:"M",father:"P41",mother:"P41w1",note:"توفي صغيرًا"},
{id:"P42",para:42,name:"محمد فال",g:"M",father:"P41",mother:"P41w1",dates:"1382هـ/1963م –",spouses:["P42w1"]},
{id:"P43",para:43,name:"أحمّد",g:"M",father:"P41",mother:"P41w1",dates:"1386هـ/1966م –",spouses:["P43w1"]},
{id:"P44",para:44,name:"ابو (لمرابط)",g:"M",father:"P41",mother:"P41w1",dates:"1389هـ/1969م –",spouses:["P44w1"]},
{id:"P41s3",name:"الشيخ أحمد",g:"M",father:"P41",mother:"P41w1"},
{id:"P41d3",name:"مريم لمباركو",g:"F",father:"P41",mother:"P41w1"},
{id:"P42w1",name:"الماه",g:"F",father:"XA324",spouses:["P42"],ext:true},
{id:"P42s1",name:"السيد",g:"M",father:"P42",mother:"P42w1"},
{id:"P42d1",name:"فاطمة",g:"F",father:"P42",mother:"P42w1"},
{id:"P42d2",name:"ساره",g:"F",father:"P42",mother:"P42w1"},
{id:"P42s2",name:"يحظيه",g:"M",father:"P42",mother:"P42w1"},
{id:"P43w1",name:"ابتسام (مرم)",g:"F",father:"XA350",spouses:["P43"],ext:true},
{id:"P43s1",name:"محمد",g:"M",father:"P43",mother:"P43w1"},
{id:"P43s2",name:"يوسف (السيد)",g:"M",father:"P43",mother:"P43w1"},
{id:"P43d1",name:"عائشة",g:"F",father:"P43",mother:"P43w1"},
{id:"P44w1",name:"مرم",g:"F",father:"XA1105",spouses:["P44"]},
{id:"P44d1",name:"عائشة",g:"F",father:"P44",mother:"P44w1"},
{id:"P44d2",name:"فلانة",g:"F",father:"P44",mother:"P44w1"},
{id:"P45w1",name:"كوريه",g:"F",father:"XA325",spouses:["P45"],ext:true},
{id:"P45w2",name:"تمّ",g:"F",father:"XA327",spouses:["P45"],ext:true},
{id:"P46",para:46,name:"محمد",g:"M",father:"P45",mother:"P45w1",dates:"1406هـ/1986م –",spouses:["P46w1"]},
{id:"P45s1",name:"أحمد",g:"M",father:"P45",mother:"P45w1",dates:"1408هـ/1988م –"},
{id:"P45s2",name:"احاده (محمدن)",g:"M",father:"P45",mother:"P45w2"},
{id:"P45d1",name:"خديجة",g:"F",father:"P45",mother:"P45w2"},
{id:"P45d2",name:"عيشه",g:"F",father:"P45",mother:"P45w2"},
{id:"P45d3",name:"آمنة",g:"F",father:"P45",mother:"P45w2"},
{id:"P46w1",name:"فلانة",g:"F",father:null,spouses:["P46"]},
{id:"P46d1",name:"محجوبه",g:"F",father:"P46",mother:"P46w1"},
{id:"P47",para:47,name:"حبلل",g:"M",father:"P1",mother:"P1w2",place:"حبلل",spouses:["P47w1","P47w2","Z2d1"]},
{id:"P47w1",name:"اجيه",g:"F",father:"Z2",mother:"Z2w1",spouses:["P47","V3"]},
{id:"P47w2",name:"مرم",g:"F",father:"N1",spouses:["P47"],crossLink:true,fullName:"مرم بنت محمذن بن الهبنضام",ext:true},
{id:"P48",para:48,name:"فوك",g:"M",father:"P47",mother:"P47w1",place:"تفنانيت",spouses:["P48w1"]},
{id:"P49",para:49,name:"كامل",g:"M",father:"P47",mother:"P47w1",place:"تفنانيت",spouses:["P2d3"]},
{id:"P47d1",name:"امنيانه",g:"F",father:"P47",mother:"P47w1",note:"أم أحمد والأمين والمصطفى وعائشة من أبناء وَن (محمذن) بن أحمد زروق؛ بنت حبلل بن ماهي — رابط بين الأسرتين",spouses:["R53"]},
{id:"P47d2",name:"فاطمه",g:"F",father:"P47",mother:"P47w2",note:"أم أبناء المختار بن محمد الكريم",spouses:["K84"]},
{id:"P47d3",name:"فاطمة",g:"F",father:"P47",mother:"P47w2",note:"أم أحمد والأمين ابنَي أبيهم بن أبا الصالح (يعقوب) بن أحمد بن اشفغ اوبك بن مهنض امغر"},
{id:"P48w1",name:"اجيه",g:"F",father:"G36",mother:"G36w1",note:"أم أبناء احمد ميلود بن شدَّار بن اشفغ الأمين",spouses:["P48"]},
{id:"P48d2",name:"فطيمه",g:"F",father:"P48",mother:"P48w1",note:"أم أبناء الأمين بن الماح بن الحسن دوبك",spouses:["XA1363"]},
{id:"P48d1",name:"اعزيزه",g:"F",father:"P48",mother:"P48w1",note:"أم محمد من أبناء محمذن بن عركاب (حمم) بن ابَّـوبا (الأمين) بن ماه — رابط داخلي بالأسرة",spouses:["P5"],crossLink:true},
{id:"P49s1",name:"عبد الله",g:"M",father:"P49",mother:"P2d3",dates:"1277هـ/1861م –",note:"لم يعقب"},
{id:"P50",para:50,name:"محمذن",g:"M",father:"P49",mother:"P2d3",spouses:["P50w1"]},
{id:"P49d1",name:"فلانة",g:"F",father:"P49",mother:"P2d3",note:"أم أبناء حيب الله بن الفايل بن أحمد زروق"},
{id:"P50w1",name:"صفيه",g:"F",father:"F134",mother:"Y118d5",note:"بنت محم بن اما (الماقور) — أم أبناء محمذن بن كامل بن حبلل بن ماه؛ رابط بين الأسرتين",spouses:["P50"],crossLink:true},
{id:"P51",para:51,name:"عبد الله",g:"M",father:"P50",mother:"P50w1",place:"تنيخلف",spouses:["I25d1"]},
{id:"P50d3",name:"فاطمه",g:"F",father:"P50",mother:"P50w1",note:"لم تعقب"},
{id:"P51d1",name:"الشيّه (صفي)",g:"F",father:"P51",mother:"I25d1",note:"زوجة اَّمي محمد بن محمد بن محمذن — رابط داخلي بالأسرة",spouses:["P7"],crossLink:true},
{id:"K1",para:1,name:"محمد الكريم",g:"M",father:"T0-fali",mother:"Y1d6",
    dates: "1082هـ/1672م – 1144هـ/1732م",place:"تنورم",
    note: "بن الفالي بن الكوري بن سيد الفالي",spouses:["K1w1"],extraSpouses:["مريم -أولاد الحسين- (مère de محمد اغربظ, K152)"]},
{id:"K1w1",name:"امينيانه",g:"F",father:"P1",note:"بنت ماهي — رابط تأسيسي بين الفرعين",spouses:["K1"],crossLink:true},
{id:"K1d1",name:"أم فالات",g:"F",father:"K1",mother:"K1w1",note:"أم فلانة بنت المبارك بن المصطفى بن حمم سعيد"},
{id:"K1d2",name:"فلانة",g:"F",father:"K1",mother:"K1w1",note:"لم تعقب"},
{id:"K2",para:2,name:"احجاب",g:"M",father:"K1",mother:"K1w1",spouses:["K2w1"]},
{id:"K2w1",name:"عائشة",g:"F",father:"F134",mother:"Y118d5",note:"بنت محم بن اما (الماقور) — رابط بين الأسرتين",spouses:["K2"],crossLink:true},
{id:"K2s1",name:"أحمد",g:"M",father:"K2",mother:"K2w1",note:"لم يعقب"},
{id:"K3",para:3,name:"محمذن",g:"M",father:"K2",mother:"K2w1",spouses:["K3w1"]},
{id:"K3w1",name:"افيطيمه",g:"F",father:"Z7",spouses:["K3"]},
{id:"K3d1",name:"أم المؤمنين",g:"F",father:"K3",mother:"K3w1",note:"بنت محمذن بن احجاب بن محمد الكريم — رابط بين الأسرتين",spouses:["Y31","F20"]},
{id:"K3d2",name:"شربظ",g:"F",father:"K3",mother:"K3w1",note:"أم أبناء الحسين بن المختار سعيد؛ بنت محمذن بن احجاب بن محمد الكريم — رابط بين الأسرتين",spouses:["F16"]},
{id:"K4",para:4,name:"اَّكاه (ببكر)",g:"M",father:"K3",mother:"K3w1",dates:"1221هـ/1806م – 1322هـ/1904م",place:"أبير حيبلل",spouses:["K4w1","Y20d2"]},
{id:"K4w1",name:"ميمهنه",g:"F",father:"Y20",mother:"Y20w1",spouses:["K4"]},
{id:"K4s1",name:"المختار",g:"M",father:"K4",mother:"K4w1",dates:"1256هـ/1840م – 1286هـ/1869م",place:"حبلل",note:"لم يعقب"},
{id:"K5",para:5,name:"أُم (أحمد)",g:"M",father:"K4",mother:"K4w1",dates:"1357هـ/1938م –",place:"أبير حيبلل",spouses:["K5w1"]},
{id:"K4s2",name:"ابَّا (محمذن)",g:"M",father:"K4",mother:"K4w1",dates:"1250هـ/1835م – 1303هـ/1886م",place:"تنيخلف",note:"لم يعقب"},
{id:"K4d1",name:"دوبا (منت وهب)",g:"F",father:"K4",mother:"K4w1"},
{id:"K4d3",name:"بت (فاطمة)",g:"F",father:"K4",mother:"K4w1",place:"أبير حيبلل",note:"بنت اَّكاه (ببكر) بن محمذن بن احجاب بن محمد الكريم — رابط بين الأسرتين",spouses:["E44"]},
{id:"K4d4",name:"خديجة",g:"F",father:"K4",mother:"K4w1"},
{id:"K4d5",name:"ميَّـم (مريم)",g:"F",father:"K4",mother:"K4w1",note:"رابط بين الأسرتين؛ بنت اكاه (ببكر) بن محمذن بن احجاب بن محمد الكريم — رابط بين الأسرتين",spouses:["Z96","F79"]},
{id:"K5w1",name:"بنت وهب",g:"F",father:"Y83",mother:"Y83w1",spouses:["K5"]},
{id:"K5s1",name:"محمدن",g:"M",father:"K5",mother:"K5w1",note:"لم يعقب"},
{id:"K5d1",name:"فاطمة",g:"F",father:"K5",mother:"K5w1"},
{id:"K6",para:6,name:"سيد",g:"M",father:"K3",mother:"K3w1",spouses:["K6w1"]},
{id:"K6w1",name:"فاطمه",g:"F",father:"I64",spouses:["K6"],mother:"I64w1",note:"أم أبناء سيد بن محمذن بن احجاب بن محمد الكريم"},
{id:"K7",para:7,name:"محمذن",g:"M",father:"K6",mother:"K6w1",spouses:["Y145d1"]},
{id:"K6d1",name:"عائشة",g:"F",father:"K6",mother:"K6w1" ,spouses:["F134","I12"] ,place:"امبمب" ,note:"رابط بين الأسرتين محتمل؛ بنت سيد بن محمذن بن احجاب بن محمد الكريم — رابط بين الأسرتين" ,crossLink:true},
{id:"K8",para:8,name:"المختار",g:"M",father:"K6",mother:"K6w1",spouses:["E44d1"]},
{id:"K7s1",name:"أحمد",g:"M",father:"K7",mother:"Y145d1",note:"لم يعقب"},
{id:"K7d1",name:"مريم",g:"F",father:"K7",mother:"Y145d1"},
{id:"K8d1",name:"اميّم (مريم)",g:"F",father:"K8",mother:"E44d1",note:"لم تعقب"},
{id:"K8d2",name:"فاطمة",g:"F",father:"K8",mother:"E44d1",dates:"1304هـ/1887م –",note:"لم تعقب"},
{id:"K9",para:9,name:"أحمد انهكر",g:"M",father:"K1",mother:"K1w1",place:"آشكركط",spouses:["K9w1"]},
{id:"K9w1",name:"أم هاني",g:"F",father:"XA1109",spouses:["K9"]},
{id:"K9d1",name:"مريم",g:"F",father:"K9",mother:"K9w1",note:"أم ابني المصطفى بن اشفغ مينحنو؛ بنت أحمد انهكر بن محمد الكريم — رابط بين الأسرتين",spouses:["G83"]},
{id:"K10",para:10,name:"عبد الله",g:"M",father:"K9",mother:"K9w1",spouses:["K10w1"]},
{id:"K10w1",name:"ياي",g:"F",father:"XA622",spouses:["K10"],ext:true},
{id:"K11",para:11,name:"الفاظل",g:"M",father:"K9",mother:"K9w1",spouses:["K11w1","K11w2","K11w3","K11w4"]},
{id:"K11w1",name:"أم هاني",g:"F",father:"XA896",spouses:["K11"],ext:true},
{id:"K12",para:12,name:"النَّن (محمذن)",g:"M",father:"K11",mother:"K11w1",place:"تنيخلف",spouses:["K12w1"]},
{id:"K11w2",name:"فاطمة",g:"F",father:"XA334",spouses:["K11"],ext:true},
{id:"K16",para:16,name:"الحسن",g:"M",father:"K11",mother:"K11w2",spouses:["K16w1"]},
{id:"K11s1",name:"الحسين",g:"M",father:"K11",mother:"K11w2",note:"لم يعقب"},
{id:"K11w3",name:"مريم",g:"F",father:"I25",spouses:["K11"],crossLink:true,mother:"I25w1",note:"أم باب من أبناء الفاظل بن احمد اهنكر بن محمد الكريم"},
{id:"K17",para:17,name:"باب",g:"M",father:"K11",mother:"K11w3",spouses:["K17w1"]},
{id:"K11w4",name:"مريم",g:"F",father:"XA335",spouses:["K11"],ext:true},
{id:"K11d1",name:"أم الحسن",g:"F",father:"K11",mother:"K11w4"},
{id:"K12w1",name:"آبَّـيه",g:"F",father:"Z46",mother:"Z49w1",spouses:["K12"],fullName:"آبَّـيه بنت أحمد بن محمد الباقر بن حمم بن أبو الحس بن المزضف"},
{id:"K13",para:13,name:"النَّـا (محمد فال)",g:"M",father:"K12",mother:"K12w1",dates:"1362هـ/1943م –",place:"أبير حيبلل",spouses:["E3d1","K142d2"]},
{id:"K12s1",name:"سيد الفالي",g:"M",father:"K12",mother:"K12w1",note:"لم يعقب"},
{id:"K12s2",name:"محمد سالم",g:"M",father:"K12",mother:"K12w1",note:"لم يعقب"},
{id:"K14",para:14,name:"السيد",g:"M",father:"K13",mother:"E3d1",dates:"1333هـ/1915م – 1375هـ/1956م",place:"البعلاتيو",spouses:["K151d2"]},
{id:"K13d1",name:"تسلم",g:"F",father:"K13",mother:"K142d2",place:"دليلحو"},
{id:"K15",para:15,name:"ولد (الكوري)",g:"M",father:"K14",mother:"K151d2",dates:"1372هـ/1953م –",spouses:["K15w1"]},
{id:"K15w1",name:"افيطمات",g:"F",father:"XA336",spouses:["K15"],ext:true},
{id:"K15s1",name:"السيد",g:"M",father:"K15",mother:"K15w1",note:"مات صغيرًا"},
{id:"K16w1",name:"هند",g:"F",father:"XA1113",spouses:["K16"]},
{id:"K16s1",name:"الكوري",g:"M",father:"K16",mother:"K16w1",dates:"1320هـ/1902م –",place:"مراكش",note:"لم يعقب"},
{id:"K16s2",name:"محمدن",g:"M",father:"K16",mother:"K16w1",note:"لم يعقب"},
{id:"K16s3",name:"محمذن",g:"M",father:"K16",mother:"K16w1",note:"لم يعقب"},
{id:"K16d1",name:"احبيبه",g:"F",father:"K16",mother:"K16w1" ,spouses:["K66"]},
{id:"K17w1",name:"آمنة",g:"F",father:"XA337",spouses:["K17"],ext:true},
{id:"K17s1",name:"ببكر لمغني",g:"M",father:"K17",mother:"K17w1",note:"لم يعقب"},
{id:"K17s2",name:"سيد الفالي",g:"M",father:"K17",mother:"K17w1",note:"لم يعقب"},
{id:"K18",para:18,name:"محمد",g:"M",father:"K17",mother:"K17w1",dates:"1357هـ/1938م –",place:"أبير حيبلل",spouses:["V12d1","K18w2","E5d5"]},
{id:"K18s1",name:"محمد باب",g:"M",father:"K18",dates:"1361هـ/1942م –",note:"لم يعقب"},
{id:"K19",para:19,name:"فال (محمد فال)",g:"M",father:"K18",mother:"V12d1",dates:"1315هـ/1898م – 1402هـ/1982م",place:"أبير حيبلل",spouses:["K19w1"]},
{id:"K18w2",name:"هلاله",g:"F",father:"E5",spouses:["K18"],crossLink:true},
{id:"K22",para:22,name:"ابَّامين (الأمين)",g:"M",father:"K18",mother:"K18w2",dates:"1334هـ/1916م – 1424هـ/2003م",place:"أبير حيبلل",spouses:["K22w1"]},
{id:"K19w1",name:"أمانِي",g:"F",father:"K33",dates:"1330هـ/1912م – 1384هـ/1964م",place:"أبير حيبلل",spouses:["K19"],note:"زواج داخلي بالأسرة"},
{id:"K20",para:20,name:"الحاج",g:"M",father:"K19",mother:"K19w1",dates:"1357هـ/1938م –",spouses:["K20w1"]},
{id:"K21",para:21,name:"اَّمين",g:"M",father:"K19",mother:"K19w1",dates:"1359هـ/1940م –",spouses:["Z87w1"]},
{id:"K20w1",name:"جنيت",g:"F",father:"XA1114",dates:"1420هـ/1999م –",place:"انواكشوط",spouses:["K20"]},
{id:"K20s1",name:"أحمد",g:"M",father:"K20",mother:"K20w1",dates:"1402هـ/1982م –"},
{id:"K20s2",name:"محمد فال",g:"M",father:"K20",mother:"K20w1",dates:"1409هـ/1989م –"},
{id:"K20d2",name:"عائشة",g:"F",father:"K20",mother:"K20w1",dates:"1404هـ/1984م –" ,spouses:["F113"] ,note:"رابط بين الأسرتين محتمل" ,crossLink:true},
{id:"K20d3",name:"فاطمة",g:"F",father:"K20",mother:"K20w1",dates:"1409هـ/1989م –"},
{id:"K21s1",name:"محمدن",g:"M",father:"K21",mother:"Z87w1",dates:"1396هـ/1976م –"},
{id:"K21s2",name:"حيدره",g:"M",father:"K21",mother:"Z87w1",dates:"1402هـ/1982م –"},
{id:"K21s3",name:"أحمد",g:"M",father:"K21",mother:"Z87w1",dates:"1407هـ/1987م –"},
{id:"K21d1",name:"جميله (ايَّات)",g:"F",father:"K21",mother:"Z87w1",dates:"1393هـ/1973م –" ,spouses:["K36"]},
{id:"K21d2",name:"الزاكيه",g:"F",father:"K21",mother:"Z87w1",dates:"1411هـ/1991م –"},
{id:"K22w1",name:"النومه",g:"F",father:"Z82s1s1",place:"حسي السعاده",spouses:["K22"],fullName:"النومه بنت محمدن بن اليدالي بن أحمد بن الأمين بن أحمد بن محمد العاقل",ext:true},
{id:"K22s1",name:"ولد والي محمد",g:"M",father:"K22",mother:"K22w1",dates:"1365هـ/1946م – 1435هـ/2015م",place:"حسي السعاده",note:"لم يعقب"},
{id:"K23",para:23,name:"محمدن",g:"M",father:"K22",mother:"K22w1",dates:"1370هـ/1951م –",spouses:["K23w1"]},
{id:"K25",para:25,name:"باب",g:"M",father:"K22",mother:"K22w1",dates:"1375هـ/1956م –",spouses:["K25w1","K25w2"]},
{id:"K26",para:26,name:"الجوده (محمد فال)",g:"M",father:"K22",mother:"K22w1",dates:"1378هـ/1959م –",spouses:["K26w1"]},
{id:"K27",para:27,name:"الطاهر",g:"M",father:"K22",mother:"K22w1",dates:"1393هـ/1973م –",spouses:["K27w1"]},
{id:"K22d1",name:"بنت وهب",g:"F",father:"K22",mother:"K22w1",dates:"1377هـ/1958م –"},
{id:"K23w1",name:"عائشة",g:"F",father:"XA345",spouses:["K23"],ext:true},
{id:"K24",para:24,name:"انجيه (الأمين)",g:"M",father:"K23",mother:"K23w1",dates:"1402هـ/1982م –",spouses:["K24w1"]},
{id:"K23s1",name:"حامد",g:"M",father:"K23",mother:"K23w1",dates:"1406هـ/1986م –"},
{id:"K23d1",name:"النومه",g:"F",father:"K23",mother:"K23w1"},
{id:"K24w1",name:"فلانة",g:"F",father:"XA347",spouses:["K24"],ext:true},
{id:"K24s1",name:"فالن",g:"M",father:"K24",mother:"K24w1"},
{id:"K25w1",name:"الخاثره",g:"F",father:"XA349",dates:"1386هـ/1966م –",spouses:["K25"],ext:true},
{id:"K25s1",name:"محمد فال",g:"M",father:"K25",mother:"K25w1",dates:"1404هـ/1984م –"},
{id:"K25s2",name:"ولد الحسن",g:"M",father:"K25",mother:"K25w1",dates:"1407هـ/1987م –"},
{id:"K25w2",name:"فتحيه",g:"F",father:"I19",dates:"1393هـ/1973م –",spouses:["K25"],crossLink:true,fullName:"فتحيه بنت أحمد سالم بن أبوبا (ببكر) بن المختار بن سيد أحمد بن حبلل بن ابراهيم",mother:"I19w2",note:"أم صغار أبناء باب بن ابامين بن محمد بن باب بن الفاظل بن احمد اهنكر بن محمد الكريم"},
{id:"K25s3",name:"محمد",g:"M",father:"K25",mother:"K25w2",dates:"1421هـ/2000م –"},
{id:"K25s4",name:"أحمد",g:"M",father:"K25",mother:"K25w2",dates:"1425هـ/2004م –"},
{id:"K25d1",name:"منى",g:"F",father:"K25",mother:"K25w2",dates:"1419هـ/1998م –"},
{id:"K25d2",name:"صباح (العاليه)",g:"F",father:"K25",mother:"K25w2",dates:"1427هـ/2006م –"},
{id:"K26w1",name:"الديميه (ميمونه)",g:"F",father:"XA351",spouses:["K26"],ext:true},
{id:"K26s1",name:"محي الدين",g:"M",father:"K26",mother:"K26w1",dates:"1410هـ/1990م –"},
{id:"K26d1",name:"المراد",g:"F",father:"K26",mother:"K26w1",dates:"1413هـ/1993م –"},
{id:"K27w1",name:"الزهرة",g:"F",father:"XA622",spouses:["K27"],ext:true},
{id:"K27d1",name:"كريمه",g:"F",father:"K27",mother:"K27w1",dates:"1429هـ/2008م –"},
{id:"K27d2",name:"أم المؤمنين",g:"F",father:"K27",mother:"K27w1",dates:"1431هـ/2010م –"},
{id:"K28",para:28,name:"محمذن خي",g:"M",father:"K9",mother:"K9w1",spouses:["K28w1"]},
{id:"K28w1",name:"امنمنات",g:"F",father:"P50",mother:"P50w1",note:"أم بزيد بن محمذن خير بن أحمد انهكر بن محمد الكريم — لم يعقب — رابط بين الأسرتين",spouses:["K28"],crossLink:true},
{id:"K28s1",name:"بزيد",g:"M",father:"K28",mother:"K28w1",note:"لم يعقب"},
{id:"K29",para:29,name:"المختار",g:"M",father:"K9",mother:"K9w1",spouses:["K29w1"]},
{id:"K29w1",name:"آجّمه",g:"F",father:"P50",mother:"P50w1",note:"أم أبناء المختار بن أحمد انهكر بن محمد الكريم — رابط بين الأسرتين",spouses:["K29"],crossLink:true},
{id:"K30",para:30,name:"ابَّامين (الأمين)",g:"M",father:"K29",mother:"K29w1",dates:"1230هـ/1815م – 1328هـ/1910م",place:"أبير حيبلل",spouses:["J3d2","Z105w2","K67d1","K30w4"]},
{id:"K48",para:48,name:"عبد السلام",g:"M",father:"K29",mother:"K29w1",spouses:["R67d3"]},
{id:"K29s1",name:"لغويل",g:"M",father:"K29",mother:"K29w1",note:"لم يعقب"},
{id:"K29d1",name:"منت النبي (فاطمة)",g:"F",father:"K29",mother:"K29w1",note:"بنت المختار بن أحمد انهكر — زواج داخلي بالأسرة",spouses:["K149"]},
{id:"K31",para:31,name:"محمذن",g:"M",father:"K30",mother:"J3d2",dates:"1314هـ/1897م –",place:"تنيخلف",spouses:["K31w1"]},
{id:"K42",para:42,name:"العتيق",g:"M",father:"K30",mother:"Z105w2",dates:"1312هـ/1895م –",spouses:["K42w1"]},
{id:"K30s1",name:"سمي النبي",g:"M",father:"K30",mother:"Z105w2",note:"لم يعقب"},
{id:"K30d1",name:"فاطمه",g:"F",father:"K30",mother:"Z105w2",note:"لم تعقب"},
{id:"K30s2",name:"المعتمد",g:"M",father:"K30",mother:"K67d1",note:"لم يعقب"},
{id:"K45",para:45,name:"عبد السلام",g:"M",father:"K30",mother:"K67d1",place:"أبير حيبلل",spouses:["K45w1"]},
{id:"K30w4",name:"أم العلاء",g:"F",father:"N1",place:"أبير حيبلل",spouses:["K30","J15"],crossLink:true,fullName:"أم العلاء بنت محمذن بن الخلف",ext:true},
{id:"K47",para:47,name:"المختار",g:"M",father:"K30",mother:"K30w4",dates:"1361هـ/1942م –",place:"أبير حيبلل",spouses:["K47w1"]},
{id:"K31w1",name:"خَّدج",g:"F",father:"P6",mother:"Z70d5",note:"بنت اَّم بن محمد بن محمذن بن عركاب (حمم) بن با (الأمين) بن ماهي — رابط بين الفرعين",place:"تفنانيت",spouses:["K31"],crossLink:true},
{id:"K32",para:32,name:"أحمد",g:"M",father:"K31",mother:"K31w1",place:"أبير حيبلل",spouses:["K49d1"]},
{id:"K33",para:33,name:"الكريم",g:"M",father:"K31",mother:"K31w1",dates:"1299هـ/1882م – 1362هـ/1943م",place:"تنيخلف",spouses:["J24d3","Y109d4","F93d1"]},
{id:"K31d2",name:"مريم",g:"F",father:"K31",mother:"K31w1",note:"لم تعقب"},
{id:"K32d1",name:"خديجة",g:"F",father:"K32",mother:"K49d1",dates:"1369هـ/1950م –"},
{id:"K33d1",name:"تايَّا (أم الخيرات)",g:"F",father:"K33",mother:"J24d3",dates:"1330هـ/1912م – 1384هـ/1964م",place:"أبير حيبلل"},
{id:"K33d2",name:"عائشة",g:"F",father:"K33",mother:"Y109d4",dates:"1335هـ/1917م – 1432هـ/2011م",place:"أبير حيبلل",note:"لم تعقب"},
{id:"K34",para:34,name:"محمدن",g:"M",father:"K33",mother:"F93d1",dates:"1345هـ/1927م – 1410هـ/1990م",place:"دليلحو",spouses:["Z113w2","K34w2","G106w1","K34w4","K34w5"]},
{id:"K40",para:40,name:"الشيخ",g:"M",father:"K33",mother:"F93d1",dates:"1348هـ/1930م – 1430هـ/2009م",place:"أبير حيبلل",spouses:["K40w1"]},
{id:"K35",para:35,name:"عبد الله",g:"M",father:"K34",mother:"Z113w2",dates:"1374هـ/1955م –",spouses:["K35w1"]},
{id:"K36",para:36,name:"المنير",g:"M",father:"K34",mother:"Z113w2",dates:"1376هـ/1957م –",spouses:["K21d1"]},
{id:"K34w2",name:"امَّم (السالمه)",g:"F",father:"XA359",dates:"1365هـ/1946م –",spouses:["K34"],ext:true},
{id:"K37",para:37,name:"عارف",g:"M",father:"K34",mother:"K34w2",dates:"1384هـ/1964م –",spouses:["K37w1","Z140w3"]},
{id:"K38",para:38,name:"محمد فال",g:"M",father:"K34",mother:"G106w1",dates:"1388هـ/1968م –",spouses:["K38w1","K38w2"]},
{id:"K34w4",name:"تُر (خدجية)",g:"F",father:"XA359",dates:"1369هـ/1950م – 1396هـ/1976م",place:"تنيخلف",spouses:["K34"],ext:true},
{id:"K39",para:39,name:"متروش (أحمد)",g:"M",father:"K34",mother:"K34w4",dates:"1396هـ/1976م –",spouses:["K117d2"]},
{id:"K34w5",name:"سلمه",g:"F",father:"D58",dates:"1365هـ/1946م –",spouses:["K34"],fullName:"سلمه بنت آبوه (أحمد) بن ببكر بن مختّري بن أحمد بن حيب الله بن باب أحمد بن سيد (المختار) بن عبد الله"},
{id:"K34s1",name:"صباح (سيد أحمد)",g:"M",father:"K34",mother:"K34w5",dates:"1397هـ/1977م –"},
{id:"K34s2",name:"ايمين (الأمين)",g:"M",father:"K34",mother:"K34w5",dates:"1399هـ/1979م –"},
{id:"K34s3",name:"الشيخ أحمد",g:"M",father:"K34",mother:"K34w5",dates:"1405هـ/1985م –"},
{id:"K35w1",name:"اَّماه",g:"F",father:"P9",mother:"P9w1",note:"بنت ببها بن ابَّا (عبد الله) بن اَّمي محمد بن محمذن بن عركاب (حمم) بن با (الأمين) بن ماهي — رابط بين الفرعين",dates:"1386هـ/1966م –",spouses:["K35"],crossLink:true},
{id:"K35s1",name:"محمدن",g:"M",father:"K35",mother:"K35w1",dates:"1412هـ/1992م –"},
{id:"K35s2",name:"أحمد",g:"M",father:"K35",mother:"K35w1",dates:"1416هـ/1996م –"},
{id:"K35s3",name:"ابَّاه",g:"M",father:"K35",mother:"K35w1",dates:"1427هـ/2006م –"},
{id:"K35d1",name:"فتيَّه",g:"F",father:"K35",mother:"K35w1",dates:"1407هـ/1987م –" ,spouses:["F74"] ,note:"رابط بين الأسرتين محتمل" ,crossLink:true},
{id:"K36s1",name:"محمد",g:"M",father:"K36",mother:"K21d1",dates:"1416هـ/1996م –"},
{id:"K36s2",name:"اباه",g:"M",father:"K36",mother:"K21d1",dates:"1414هـ/1994م –"},
{id:"K36d1",name:"اميه",g:"F",father:"K36",mother:"K21d1",dates:"1422هـ/2001م –"},
{id:"K36d2",name:"صفية",g:"F",father:"K36",mother:"K21d1",dates:"1431هـ/2010م –"},
{id:"K37w1",name:"ابَّابه (مريم)",g:"F",father:"K40",mother:"K40w1",note:"زواج داخلي بالأسرة",dates:"1396هـ/1976م –",spouses:["K37"]},
{id:"K37s1",name:"سيد أحمد",g:"M",father:"K37",dates:"1420هـ/1999م – 1435هـ/2015م",note:"مات صغيرًا"},
{id:"K37s2",name:"محمد المختار",g:"M",father:"K37",dates:"1421هـ/2000م – 1434هـ/2014م",note:"مات صغيرًا"},
{id:"K37d1",name:"عيشه",g:"F",father:"K37",dates:"1423هـ/2002م –"},
{id:"K37s3",name:"محمدن",g:"M",father:"K37",dates:"1428هـ/2007م –"},
{id:"K37s4",name:"أحمد",g:"M",father:"K37",dates:"1430هـ/2009م –"},
{id:"K37s5",name:"الشيخ التيجاني",g:"M",father:"K37",dates:"1433هـ/2012م –"},
{id:"K37s6",name:"يسلم",g:"M",father:"K37",dates:"1434هـ/2013م –"},
{id:"K37s7",name:"أَّمن",g:"M",father:"K37",dates:"1438هـ/2017م –"},
{id:"K37d2",name:"مريم",g:"F",father:"K37",dates:"1436هـ/2015م –"},
{id:"K38w1",name:"يـما",g:"F",father:"F44s1",note:"الجد 'أمين بن دياه' غير موجود بعد في بياناتي — إلى تحقيق لاحق",dates:"1405هـ/1985م –",spouses:["K38"]},
{id:"K38s1",name:"سيد أحمد",g:"M",father:"K38",dates:"1425هـ/2004م –"},
{id:"K38w2",name:"فضيله",g:"F",father:"F83",dates:"1409هـ/1989م –",spouses:["K38"],crossLink:true,fullName:"فضيله بنت المختار بن محني (محمذن) بن دداه (أحمّد) بن محمذن بن بازيد بن محمذن بن الفالي بن المبارك"},
{id:"K38d1",name:"فلانة",g:"F",father:"K38"},
{id:"K39d1",name:"عيشان",g:"F",father:"K39",mother:"K117d2",dates:"1428هـ/2007م –"},
{id:"K39d2",name:"الزهراء",g:"F",father:"K39",mother:"K117d2",dates:"1430هـ/2009م –"},
{id:"K39d3",name:"فلانة",g:"F",father:"K39",mother:"K117d2",dates:"1433هـ/2012م –"},
{id:"K39d4",name:"فلانة",g:"F",father:"K39",mother:"K117d2",dates:"1435هـ/2014م –"},
{id:"K40w1",name:"اَّدبه (فاطمة)",g:"F",father:"P9",mother:"P9w1",note:"بنت ببها بن ابَّا (عبد الله)... بن با (الأمين) بن ماهي — أخت زوجة عبد الله K35 — رابط بين الفرعين",dates:"1374هـ/1955م –",spouses:["K40"],crossLink:true},
{id:"K41",para:41,name:"يحي (أحمد)",g:"M",father:"K40",mother:"K40w1",dates:"1393هـ/1973م –",spouses:["K41w1"]},
{id:"K40s1",name:"محمدن",g:"M",father:"K40",mother:"K40w1",dates:"1404هـ/1984م –"},
{id:"K40s2",name:"محمد",g:"M",father:"K40",mother:"K40w1",dates:"1407هـ/1987م –"},
{id:"K40s3",name:"محمد فال",g:"M",father:"K40",mother:"K40w1",dates:"1412هـ/1992م –"},
{id:"K40d2",name:"عائشة",g:"F",father:"K40",mother:"K40w1",dates:"1402هـ/1982م –"},
{id:"K41w1",name:"مريم السالمه",g:"F",father:"Z17",dates:"1408هـ/1988م –",spouses:["K41"],fullName:"مريم السالمه بنت (محمد عبد الرحمن) نح بن محمد سالم بن أحمد دلني بن محمد فال بن اخميطرات بن محمود الله بن أبو الحس بن المزضف"},
{id:"K41d1",name:"أماني",g:"F",father:"K41",mother:"K41w1",dates:"1431هـ/2010م –"},
{id:"K42w1",name:"امبريكه",g:"F",father:"XA19",spouses:["K42"]},
{id:"K43",para:43,name:"أحمد",g:"M",father:"K42",mother:"K42w1",place:"بوبكر",spouses:["K43w1"]},
{id:"K43w1",name:"مريم",g:"F",father:"D21",dates:"1401هـ/1981م –",place:"أبير حيبلل",spouses:["K43"]},
{id:"K44",para:44,name:"محمد محمود",g:"M",father:"K43",mother:"K43w1",dates:"1355هـ/1936م –",spouses:["J6d2"]},
{id:"K44s1",name:"الخميني (محمد فال)",g:"M",father:"K44",mother:"J6d2",dates:"1399هـ/1979م –"},
{id:"K44s2",name:"ايمين (الأمين)",g:"M",father:"K44",mother:"J6d2",dates:"1401هـ/1981م –"},
{id:"K44s3",name:"بدالي (أحمد)",g:"M",father:"K44",mother:"J6d2",dates:"1406هـ/1986م –"},
{id:"K44s4",name:"بغد",g:"M",father:"K44",mother:"J6d2",dates:"1415هـ/1995م –"},
{id:"K44s5",name:"ولد اعبيد (محمد)",g:"M",father:"K44",mother:"J6d2",dates:"1424هـ/2003م –"},
{id:"K44d2",name:"منت الغزواني (خديجة)",g:"F",father:"K44",mother:"J6d2",dates:"1398هـ/1978م –"},
{id:"K44d3",name:"ميمهنه",g:"F",father:"K44",mother:"J6d2",dates:"1411هـ/1991م –"},
{id:"K45w1",name:"مريم",g:"F",father:"XA365",spouses:["K45"],ext:true},
{id:"K46",para:46,name:"لمرابط (ابامين)",g:"M",father:"K45",mother:"K45w1",dates:"1367هـ/1948م – 1418هـ/1997م",place:"أبير حيبلل",spouses:["K46w1"]},
{id:"K46w1",name:"دماه -اتواجني-",g:"F",father:null,dates:"1430هـ/2009م –",spouses:["K46"] ,note:"⚠️ تاريخ الميلاد في المصدر الأصلي يتعارض مع وفاة الزوج — قد يكون خطأ OCR في الوثيقة الأصلية"},
{id:"K46d2",name:"مريم",g:"F",father:"K46",mother:"K46w1",dates:"1399هـ/1979م –"},
{id:"K46d3",name:"تحيه",g:"F",father:"K46",mother:"K46w1"},
{id:"K46d4",name:"هدى",g:"F",father:"K46",mother:"K46w1"},
{id:"K46d5",name:"فرحه",g:"F",father:"K46",mother:"K46w1"},
{id:"K47w1",name:"توت",g:"F",father:"I96",dates:"1306هـ/1889م – 1407هـ/1987م",place:"أبير حيبلل",spouses:["K47"],mother:"I96w2",note:"أم احمد وعبد بن المختار بن ابامين (الأمين) بن المختار بن احمد اهنكر بن محمد الكريم — لم يعقب"},
{id:"K47s1",name:"أحمد عبدود",g:"M",father:"K47",mother:"K47w1",dates:"1348هـ/1930م – 1427هـ/2006م",place:"دليلحو",note:"لم يعقب"},
{id:"K49",para:49,name:"محنض باب",g:"M",father:"K48",mother:"R67d3",dates:"1358هـ/1939م –",spouses:["E57d3"]},
{id:"K48d1",name:"أم الخيرات",g:"F",father:"K48",mother:"R67d3",note:"لم تعقب"},
{id:"K48d3",name:"فاطمة",g:"F",father:"K48",mother:"R67d3",note:"لم تعقب"},
{id:"K48d4",name:"مريم",g:"F",father:"K48",mother:"R67d3",note:"لم تعقب"},
{id:"K49d1",name:"فاطمة",g:"F",father:"K49",mother:"E57d3",note:"أم خديجة بنت أحمد بن محمذن بن ابَّا (الأمين) بن المختار بن أحمد انهكر" ,spouses:["K32"]},
{id:"K50",para:50,name:"آِّمين",g:"M",father:"K1",mother:"K1w1",spouses:["G55d1"]},
{id:"K51",para:51,name:"حبلل",g:"M",father:"K50",mother:"G55d1",spouses:["K51w1","K51w2","K51w3"]},
{id:"K51w1",name:"أم هاني",g:"F",father:"XA368",spouses:["K51"],ext:true},
{id:"K52",para:52,name:"سيد أحمد",g:"M",father:"K51",mother:"K51w1",spouses:["K52w1"]},
{id:"K51w2",name:"فلانة -أولاد اشفغ حيبلل-",g:"F",father:null,spouses:["K51"]},
{id:"K54",para:54,name:"المختار",g:"M",father:"K51",mother:"K51w2",spouses:["K54w1"]},
{id:"K51w3",name:"فلانة -أولاد البوعليو-",g:"F",father:null,spouses:["K51"]},
{id:"K51s1",name:"أحمد",g:"M",father:"K51",note:"لم يعقب"},
{id:"K51s2",name:"آمين",g:"M",father:"K51",note:"لم يعقب"},
{id:"K55",para:55,name:"محمذن",g:"M",father:"K51",mother:"K51w3",spouses:["F135d2","K55w2"]},
{id:"K52w1",name:"تتّميه",g:"F",father:"I73",mother:"I73w1",spouses:["K52"]},
{id:"K53",para:53,name:"الكوري ضال",g:"M",father:"K52",mother:"K52w1",spouses:["K53w1","K53w2"]},
{id:"K53w1",name:"أم النبي",g:"F",father:"XA1116",spouses:["K53"],ext:true},
{id:"K53s1",name:"سليم",g:"M",father:"K53",note:"لم يعقب"},
{id:"K53w2",name:"فلانة -اديبسات-",g:"F",father:null,spouses:["K53"]},
{id:"K53s2",name:"أحمد",g:"M",father:"K53",dates:"1347هـ/1929م –",note:"لم يعقب"},
{id:"K53d2",name:"فلانة",g:"F",father:"K53"},
{id:"K53d3",name:"فلانة",g:"F",father:"K53",note:"لم تعقب"},
{id:"K54w1",name:"الحمرياء",g:"F",father:"XA372",spouses:["K54"],ext:true},
{id:"K54s1",name:"آمين",g:"M",father:"K54",mother:"K54w1",note:"لم يعقب"},
{id:"K56",para:56,name:"فتن",g:"M",father:"K55",spouses:["K56w1"]},
{id:"K55d1",name:"فاظيم",g:"F",father:"K55",note:"لم تعقب"},
{id:"K55w2",name:"فلانة",g:"F",father:"XA373",spouses:["K55"],ext:true},
{id:"K55s1",name:"المختار",g:"M",father:"K55",note:"لم يعقب"},
{id:"K56w1",name:"فلانة",g:"F",father:null,spouses:["K56"]},
{id:"K56s1",name:"الأمين",g:"M",father:"K56",mother:"K56w1",note:"لم يعقب"},
{id:"K56s2",name:"محنض",g:"M",father:"K56",mother:"K56w1",note:"لم يعقب"},
{id:"K56d1",name:"عيشه",g:"F",father:"K56",mother:"K56w1",note:"لم تعقب"},
{id:"K57",para:57,name:"سيد عبد الله",g:"M",father:"K1",mother:"K1w1",spouses:["K57w1"]},
{id:"K57w1",name:"فلانة",g:"F",father:"XA323",spouses:["K57"],ext:true},
{id:"K58",para:58,name:"خير الورى",g:"M",father:"K57",mother:"K57w1",spouses:["K58w1","K152d1"]},
{id:"K58w1",name:"غادجيه",g:"F",father:"K152",mother:"K152w1",note:"بنت محمد اغربظ بن محمد الكريم — زواج داخلي بالأسرة",spouses:["K58"]},
{id:"K59",para:59,name:"أحمذ",g:"M",father:"K58",mother:"K58w1",spouses:["F137d1"]},
{id:"K58s1",name:"القرشي",g:"M",father:"K58",mother:"K58w1",note:"لم يعقب"},
{id:"K68",para:68,name:"المختار",g:"M",father:"K58",mother:"K58w1",spouses:["K68w1"]},
{id:"K60",para:60,name:"محمذن",g:"M",father:"K59",mother:"F137d1",spouses:["K67d2"]},
{id:"K67",para:67,name:"المختار",g:"M",father:"K59",mother:"F137d1",spouses:["K68d2"]},
{id:"K59d1",name:"أم الحسن",g:"F",father:"K59",mother:"F137d1",note:"لم تعقب"},
{id:"K61",para:61,name:"أحمد",g:"M",father:"K60",mother:"K67d2",dates:"1345هـ/1927م –",place:"إلى خير",spouses:["K123d2"]},
{id:"K60s1",name:"أحمد فال",g:"M",father:"K60",mother:"K67d2",note:"لم يعقب"},
{id:"K66",para:66,name:"الكوري",g:"M",father:"K60",mother:"K67d2",spouses:["K16d1"]},
{id:"K62",para:62,name:"المختار",g:"M",father:"K61",mother:"K123d2",dates:"1338هـ/1920م – 1395هـ/1975م",place:"إلى خير",spouses:["M11d3"]},
{id:"K61d2",name:"سلمه",g:"F",father:"K61",mother:"K123d2",dates:"1336هـ/1918م – 1432هـ/2011م",place:"أبير حيبلل"},
{id:"K63",para:63,name:"أحمد",g:"M",father:"K62",mother:"M11d3",dates:"1378هـ/1959م – 1434هـ/2013م",place:"أبير حيبلل",spouses:["K63w1"]},
{id:"K64",para:64,name:"محمد الأمين",g:"M",father:"K62",mother:"M11d3",dates:"1382هـ/1963م –",spouses:["K64w1"]},
{id:"K65",para:65,name:"عبد الله الورى",g:"M",father:"K62",mother:"M11d3",dates:"1390هـ/1970م –",spouses:["K144d4"]},
{id:"K62d1",name:"اشريفه",g:"F",father:"K62",mother:"M11d3",dates:"1386هـ/1966م –"},
{id:"K62d2",name:"افياله (عائشة)",g:"F",father:"K62",mother:"M11d3",dates:"– 1975م" ,spouses:["Z156"] ,place:"اويد لمعيز" ,crossLink:true},
{id:"K63w1",name:"اَّمانه",g:"F",father:"K20",mother:"K20w1",note:"زواج داخلي بالأسرة",dates:"1401هـ/1981م –",spouses:["K63"],fullName:"مانا بنت الحاج بن فال (محمد فال) بن محمدن بن باب بن الفاظل بن أحمد انهكر بن محمد الكريم"},
{id:"K63s1",name:"المختار",g:"M",father:"K63",mother:"K63w1",dates:"1420هـ/1999م –"},
{id:"K63s2",name:"أمين",g:"M",father:"K63",mother:"K63w1",dates:"1423هـ/2002م –"},
{id:"K63s3",name:"محمد",g:"M",father:"K63",mother:"K63w1",dates:"1427هـ/2006م –"},
{id:"K64w1",name:"فضيله",g:"F",father:"F61",mother:"I23d1",dates:"1403هـ/1983م –",spouses:["K64"],crossLink:true},
{id:"K64s1",name:"محمدن",g:"M",father:"K64",mother:"K64w1",dates:"1427هـ/2006م –"},
{id:"K64d1",name:"مريم",g:"F",father:"K64",mother:"K64w1",dates:"1425هـ/2004م –"},
{id:"K64d2",name:"آمنة",g:"F",father:"K64",mother:"K64w1",dates:"1429هـ/2008م –" ,spouses:["F36"] ,crossLink:true},
{id:"K65s1",name:"أحمد",g:"M",father:"K65",mother:"K144d4",dates:"1435هـ/2014م –"},
{id:"K66s1",name:"حمدن",g:"M",father:"K66",mother:"K16d1",note:"لم يعقب"},
{id:"K67d1",name:"أم الخيري",g:"F",father:"K67",mother:"K68d2" ,spouses:["K30"]},
{id:"K67d2",name:"مريم",g:"F",father:"K67",mother:"K68d2",note:"لم تعقب" ,spouses:["K60"]},
{id:"K67d3",name:"ميمهنه",g:"F",father:"K67",mother:"K68d2",note:"لم تعقب" ,spouses:["K90"]},
{id:"K68w1",name:"امنا",g:"F",father:"XA376",spouses:["K68"],ext:true},
{id:"K68s1",name:"محمد",g:"M",father:"K68",mother:"K68w1",note:"لم يعقب"},
{id:"K68d2",name:"فاطمة",g:"F",father:"K68",mother:"K68w1" ,spouses:["K67"]},
{id:"K68d3",name:"مريم",g:"F",father:"K68",mother:"K68w1"},
{id:"K69",para:69,name:"عاون",g:"M",father:"K1",mother:"K1w1",spouses:["K69w1","K69w2"]},
{id:"K69w1",name:"فلانة -اجيجبو-",g:"F",father:null,spouses:["K69"]},
{id:"K70",para:70,name:"حبلل",g:"M",father:"K69",mother:"K69w1",spouses:["K70w1"]},
{id:"K69w2",name:"فلانة",g:"F",father:"XA378",spouses:["K69"],ext:true},
{id:"K82",para:82,name:"بناي",g:"M",father:"K69",mother:"K69w1",spouses:["K82w1","R23d1"]},
{id:"K70w1",name:"مانه",g:"F",father:"Z70",place:"أبير حيبلل",spouses:["K70"],fullName:"مانه بنت الأمين بن حمم بن أبو الحس بن المزضف",mother:"Z70w1",note:"أم أبناء حبلل بن عاون بن محمد الكريم"},
{id:"K70s1",name:"أحمد",g:"M",father:"K70",mother:"K70w1",note:"لم يعقب"},
{id:"K71",para:71,name:"محمذن ميلود",g:"M",father:"K70",mother:"K70w1",dates:"1286هـ/1869م –",place:"أبير حيبلل",spouses:["K71w1","K71w2"]},
{id:"K70d1",name:"فاطمة",g:"F",father:"K70",mother:"K70w1",note:"لم تعقب"},
{id:"K71w1",name:"اتَّلهي",g:"F",father:"P51",mother:"I25d1",note:"بنت عبد الله بن محمذن بن كامل بن حبلل بن ماهي — رابط بين الفرعين",place:"تنيخلف",spouses:["K71"],crossLink:true},
{id:"K71s1",name:"اَّركاه",g:"M",father:"K71",mother:"K71w1",place:"انتمركاي",note:"لم يعقب"},
{id:"K72",para:72,name:"حَّم (محمد)",g:"M",father:"K71",mother:"K71w1",dates:"1348هـ/1930م –",spouses:["K72w1","R68d1"]},
{id:"K81",para:81,name:"ختّار (المختار السالم)",g:"M",father:"K71",mother:"K71w1",dates:"1333هـ/1915م –",place:"أبير حيبلل",spouses:["P32d1","P7d3"]},
{id:"K71d2",name:"أم الخيري",g:"F",father:"K71",mother:"K71w1",note:"لم تعقب"},
{id:"K71w2",name:"مريم",g:"F",father:"XA32",spouses:["K71"]},
{id:"K71d3",name:"خديجة",g:"F",father:"K71",mother:"K71w2",dates:"1270هـ/1854م –",place:"أبير حيبلل"},
{id:"K72w1",name:"فاطمة",g:"F",father:"Y93",mother:"M24d3",place:"تنبيعلي",note:"بنت الربا (البرا) بن بگي (أبوبكر) بن سيد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين — رابط بين الأسرتين",spouses:["K72"],crossLink:true},
{id:"K73",para:73,name:"ديّديه (سيد الأمين)",g:"M",father:"K72",mother:"K72w1",dates:"1304هـ/1887م – 1379هـ/1960م",place:"أبير حيبلل",spouses:["K73w1","Y77d2"]},
{id:"K78",para:78,name:"محمدن",g:"M",father:"K72",mother:"R68d1",dates:"1348هـ/1930م – 1387هـ/1967م",place:"أبير حيبلل",spouses:["K114d2"]},
{id:"K73w1",name:"باكّه (امباركه)",g:"F",father:"Z83",mother:"Z83w1",dates:"1316هـ/1899م – 1401هـ/1981م",place:"أبير حيبلل",spouses:["K73"],fullName:"باكّه (امباركه) بنت عمر بن عبدم ابن بن عبد الله بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"K73d1",name:"شاشه (مريم السالمه)",g:"F",father:"K73",mother:"K73w1",dates:"1343هـ/1925م – 1397هـ/1977م",spouses:["Z16"],crossLink:true},
{id:"K74",para:74,name:"اباه",g:"M",father:"K73",mother:"Y77d2",dates:"1368هـ/1949م –",spouses:["K74w1","K74w2"]},
{id:"K76",para:76,name:"القاضي",g:"M",father:"K73",mother:"Y77d2",dates:"1376هـ/1957م –",spouses:["K76w1","J11d1","D58d2"]},
{id:"K77",para:77,name:"الخليفه",g:"M",father:"K73",mother:"Y77d2",dates:"1379هـ/1960م –",spouses:["K77w1"]},
{id:"K74w1",name:"دماه",g:"F",father:"Z132",dates:"1386هـ/1966م –",spouses:["K74","Z59"],fullName:"دماه بنت الربا بن اديني (الأمين) بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"K75",para:75,name:"ايمين (الأمين)",g:"M",father:"K74",mother:"K74w1",dates:"1402هـ/1982م –",spouses:["K75w1"]},
{id:"K74w2",name:"عيشه",g:"F",father:"P12",mother:"P12w1",note:"بنت سيد محمد بن ابَّا (عبد الله)... بن با (الأمين) بن ماهي — رابط بين الفرعين",dates:"1382هـ/1963م –",spouses:["K74"],crossLink:true},
{id:"K74s1",name:"فتحي (سيد الأمين)",g:"M",father:"K74",mother:"K74w2",dates:"1405هـ/1985م –"},
{id:"K74s2",name:"يعقوب (محمد عبد الله)",g:"M",father:"K74",mother:"K74w2",dates:"1408هـ/1988م –"},
{id:"K74s3",name:"أحمد",g:"M",father:"K74",mother:"K74w2",dates:"1414هـ/1994م –"},
{id:"K74s4",name:"نصر الله (عبد الله)",g:"M",father:"K74",mother:"K74w2",dates:"1421هـ/2000م –"},
{id:"K74d1",name:"حاجه",g:"F",father:"K74",mother:"K74w2",dates:"1411هـ/1991م –"},
{id:"K75w1",name:"آمال",g:"F",father:"P20",mother:"P9d1",note:"بنت محمد المختار بن هيدي (سيد) بن ابو (محمد) — رابط بين الفرعين",dates:"1405هـ/1985م –",spouses:["K75"],crossLink:true},
{id:"K75d1",name:"عزيزه (البتول)",g:"F",father:"K75",mother:"K75w1",dates:"1433هـ/2012م –"},
{id:"K75d2",name:"إيمان",g:"F",father:"K75",mother:"K75w1"},
{id:"K76w1",name:"توت",g:"F",father:"D58",dates:"1372هـ/1953م –",spouses:["K76"]},
{id:"K76s1",name:"يسلم",g:"M",father:"K76",dates:"1406هـ/1986م –"},
{id:"K76s2",name:"ولد الحسن",g:"M",father:"K76",dates:"1409هـ/1989م –"},
{id:"K76d1",name:"مريم",g:"F",father:"K76",dates:"1410هـ/1990م –"},
{id:"K76d2",name:"نفيسه",g:"F",father:"K76",dates:"1412هـ/1992م –"},
{id:"K76s3",name:"محمد الأمين",g:"M",father:"K76",dates:"1424هـ/2003م –"},
{id:"K76s4",name:"اباه",g:"M",father:"K76",dates:"1426هـ/2005م –"},
{id:"K77w1",name:"الغاليه",g:"F",father:"XA379",spouses:["K77"],ext:true},
{id:"K77s1",name:"عب",g:"M",father:"K77",mother:"K77w1",dates:"1411هـ/1991م –"},
{id:"K77d1",name:"امات",g:"F",father:"K77",mother:"K77w1",dates:"1408هـ/1988م –"},
{id:"K77d2",name:"شاشه",g:"F",father:"K77",mother:"K77w1",dates:"1414هـ/1994م –"},
{id:"K77d3",name:"البتول",g:"F",father:"K77",mother:"K77w1",dates:"1421هـ/2000م –"},
{id:"K79",para:79,name:"حَّم (محمد)",g:"M",father:"K78",mother:"K114d2",dates:"1384هـ/1964م –",spouses:["K79w1"]},
{id:"K80",para:80,name:"محمد عبد الله",g:"M",father:"K78",mother:"K114d2",dates:"1387هـ/1967م –",spouses:["K80w1"]},
{id:"K79w1",name:"أمه (ميمونه)",g:"F",father:"M47",dates:"1393هـ/1973م –",spouses:["K79"],fullName:"أمه (ميمونه) بنت مدال بن المختار بن اكي (الكوري) بن ايب بن محمذن بن الأمين بن الماما",ext:true},
{id:"K79s1",name:"محمدن",g:"M",father:"K79",mother:"K79w1",dates:"1416هـ/1996م –"},
{id:"K79s2",name:"محمد ناصر",g:"M",father:"K79",mother:"K79w1",dates:"1437هـ/2016م –"},
{id:"K79d1",name:"اميم",g:"F",father:"K79",mother:"K79w1",dates:"1425هـ/2004م –"},
{id:"K79d2",name:"انَّاه (عيشان)",g:"F",father:"K79",mother:"K79w1",dates:"1427هـ/2006م –"},
{id:"K79d3",name:"الخيت",g:"F",father:"K79",mother:"K79w1",dates:"1430هـ/2009م –"},
{id:"K79d4",name:"عائشة",g:"F",father:"K79",mother:"K79w1",dates:"1434هـ/2013م –"},
{id:"K80w1",name:"دلروه",g:"F",father:"K90s1s1",note:"زواج داخلي بالأسرة",dates:"1397هـ/1977م –",spouses:["K80"],fullName:"دلروه بنت الب بن أحمد طابا بن حمم بن انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم"},
{id:"K80s1",name:"سيد الأمين",g:"M",father:"K80",mother:"K80w1",dates:"1437هـ/2015م –"},
{id:"K80d1",name:"عيشان",g:"F",father:"K80",mother:"K80w1",dates:"1438هـ/2017م –"},
{id:"K81s1",name:"محمد",g:"M",father:"K81",mother:"P32d1",note:"لم يعقب"},
{id:"K81s2",name:"ولد الفظيل (محمذن)",g:"M",father:"K81",mother:"P32d1",note:"لم يعقب"},
{id:"K81d1",name:"أمهخته",g:"F",father:"K81",mother:"P32d1",dates:"1319هـ/1901م – 1402هـ/1982م"},
{id:"K81d2",name:"عيشنّه",g:"F",father:"K81",mother:"P32d1",note:"لم تعقب"},
{id:"K82w1",name:"فلانة",g:"F",father:"R23",mother:"R23w1",spouses:["K82"]},
{id:"K83",para:83,name:"المختار باب",g:"M",father:"K82",mother:"K82w1",spouses:["K83w1"]},
{id:"K82d1",name:"امبيلحه",g:"F",father:"K82",mother:"K82w1",note:"لم تعقب"},
{id:"K83w1",name:"فاطمة",g:"F",father:"Z13",mother:"Z13w1",spouses:["K83"]},
{id:"K84",para:84,name:"المختار",g:"M",father:"K1",mother:"K1w1",dates:"1105هـ/1694م – 1172هـ/1759م",place:"تنياشل",spouses:["K84w1","P47d2"]},
{id:"K84w1",name:"فاطمه",g:"F",father:"P47",mother:"P47w1",note:"بنت حبلل بن ماهي — رابط بين الفرعين",place:"تنيخلف",spouses:["K84"],crossLink:true},
{id:"K85",para:85,name:"بنيوك (محمذن)",g:"M",father:"K84",mother:"K84w1",dates:"1148هـ/1736م – 1237هـ/1822م",place:"تنرتدل",spouses:["K85w1"]},
{id:"K84s1",name:"سيد",g:"M",father:"K84",mother:"K84w1",note:"لم يعقب"},
{id:"K84d2",name:"آمنة",g:"F",father:"K84",mother:"K84w1"},
{id:"K84d3",name:"غديجه",g:"F",father:"K84",mother:"K84w1",note:"لم تعقب"},
{id:"K85w1",name:"الصغرى",g:"F",father:"XA31",mother:"I2d5",place:"تنيخلف",spouses:["K85"]},
{id:"K86",para:86,name:"انداه (المختار)",g:"M",father:"K85",mother:"K85w1",dates:"1209هـ/1795م – 1272هـ/1856م",place:"تنيخلف",spouses:["F135d1"]},
{id:"K122",para:122,name:"سيد الفالي",g:"M",father:"K85",mother:"K85w1",dates:"1297هـ/1880م –",place:"تنيخلف",spouses:["R56d1","K122w2"]},
{id:"K85d3",name:"ميمهنه",g:"F",father:"K85",mother:"K85w1"},
{id:"K87",para:87,name:"اَّدد (أحمد)",g:"M",father:"K86",mother:"F135d1",spouses:["Z73w2","F133d1"]},
{id:"K90",para:90,name:"محم",g:"M",father:"K86",mother:"F135d1",dates:"1326هـ/1908م –",place:"حبلل",spouses:["K90w1","K90w2","K67d3"]},
{id:"K104",para:104,name:"محمذن",g:"M",father:"K86",mother:"F135d1",dates:"1236هـ/1821م – 1291هـ/1874م",place:"اودش",spouses:["K104w1"]},
{id:"K86d3",name:"سلمه",g:"F",father:"K86",mother:"F135d1"},
{id:"K88",para:88,name:"أُم (محمذن)",g:"M",father:"K87",mother:"Z73w2",spouses:["Z72d1"]},
{id:"K89",para:89,name:"المختار",g:"M",father:"K87",mother:"F133d1",dates:"1340هـ/1922م –",spouses:["K119d2"]},
{id:"K88s1",name:"المختار السالم",g:"M",father:"K88",mother:"Z72d1",note:"لم يعقب"},
{id:"K88d1",name:"خديجة",g:"F",father:"K88",mother:"Z72d1",dates:"1349هـ/1930م –",note:"لم تعقب"},
{id:"K88d3",name:"مريم",g:"F",father:"K88",mother:"Z72d1"},
{id:"K89s1",name:"محمد سالم",g:"M",father:"K89",mother:"K119d2",note:"لم يعقب"},
{id:"K89s2",name:"محمد عبد الله",g:"M",father:"K89",mother:"K119d2",place:"كيص (سنغال)",note:"لم يعقب"},
{id:"K90w1",name:"أَّم فاطمه",g:"F",father:"P6",mother:"Z70d5",note:"بنت أمين بن محمد بن محمذن بن عركاب (حمم) بن با (الأمين) بن ماهي — رابط بين الفرعين",place:"أبير حيبلل",spouses:["K90"],crossLink:true},
{id:"K91",para:91,name:"محمذن",g:"M",father:"K90",mother:"K90w1",dates:"1349هـ/1931م –",place:"بدغوغو",spouses:["K119d3"]},
{id:"K96",para:96,name:"محمودن",g:"M",father:"K90",mother:"K90w1",dates:"1347هـ/1929م –",place:"أبير حيبلل",spouses:["K96w1"]},
{id:"K90d1",name:"أم الخيري",g:"F",father:"K90",mother:"K90w1",note:"لم تعقب"},
{id:"K90w2",name:"فاطمة",g:"F",father:"Y157",place:"تنيخلف",spouses:["K90"],mother:"Y157w1",note:"أم احمد طاب وخدجية من أبناء محم بن انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم"},
{id:"K97",para:97,name:"طاب أحمد",g:"M",father:"K90",mother:"K90w2",dates:"1334هـ/1916م –",place:"تنيخلف",spouses:["Z104w2"]},
{id:"K90d5",name:"بنت وهب",g:"F",father:"K90",mother:"K67d3",note:"لم تعقب"},
{id:"K92",para:92,name:"سيد أحمد",g:"M",father:"K91",mother:"K119d3",dates:"1338هـ/1920م – 1422هـ/2001م",place:"أبير حيبلل",spouses:["R71d1"]},
{id:"K93",para:93,name:"السالك",g:"M",father:"K92",mother:"R71d1",dates:"1386هـ/1966م – 1435هـ/2015م",place:"حسي السعاده",spouses:["K93w1"]},
{id:"K94",para:94,name:"انداه",g:"M",father:"K92",mother:"R71d1",dates:"1392هـ/1972م –",spouses:["K94w1"]},
{id:"K95",para:95,name:"محمد",g:"M",father:"K92",mother:"R71d1",dates:"1401هـ/1981م –",spouses:["K95w1"]},
{id:"K92s1",name:"محم",g:"M",father:"K92",mother:"R71d1",dates:"1406هـ/1986م –"},
{id:"K92d2",name:"الزهراء",g:"F",father:"K92",mother:"R71d1",dates:"1388هـ/1968م –" ,spouses:["K128"]},
{id:"K92d3",name:"عيشه",g:"F",father:"K92",mother:"R71d1",dates:"1396هـ/1976م –"},
{id:"K92d4",name:"قاله",g:"F",father:"K92",mother:"R71d1",dates:"1403هـ/1983م –"},
{id:"K93w1",name:"مريم",g:"F",father:"G50",spouses:["K93"],fullName:"مريم بنت محمد بن امنّاه (محمد سالم) بن سيد الأمين بن مدّي بن عبد الله بن المبارك بن اشفغ مينحنو"},
{id:"K93s1",name:"محمد",g:"M",father:"K93",mother:"K93w1",dates:"1422هـ/2001م –"},
{id:"K93s2",name:"انداه",g:"M",father:"K93",mother:"K93w1",dates:"1431هـ/2010م –"},
{id:"K93d1",name:"فاطمة (متّومه)",g:"F",father:"K93",mother:"K93w1",dates:"1426هـ/2005م –"},
{id:"K94w1",name:"أم المؤمنين",g:"F",father:"D6s1",dates:"1398هـ/1978م –",spouses:["K94"]},
{id:"K94s1",name:"سيد أحمد",g:"M",father:"K94",mother:"K94w1"},
{id:"K94s2",name:"محمذن",g:"M",father:"K94",mother:"K94w1"},
{id:"K94d1",name:"اينه",g:"F",father:"K94",mother:"K94w1"},
{id:"K95w1",name:"فلانة",g:"F",father:null,spouses:["K95"]},
{id:"K96w1",name:"آمه (مريم السالم)",g:"F",father:"Z105",mother:"Z105w2",dates:"1299هـ/1882م – 1393هـ/1973م",place:"دليلحو",spouses:["K96"],fullName:"آمه (مريم السالم) بنت سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"K96s1",name:"محمد",g:"M",father:"K96",mother:"K96w1",dates:"1330هـ/1912م – 1419هـ/1998م",place:"دليلحو",note:"لم يعقب"},
{id:"K96s2",name:"المختار",g:"M",father:"K96",mother:"K96w1",dates:"1338هـ/1920م – 1414هـ/1994م",place:"دليلحو",note:"لم يعقب"},
{id:"K96s3",name:"عبدات",g:"M",father:"K96",mother:"K96w1",dates:"1340هـ/1922م – 1427هـ/2006م",place:"دليلحو",note:"لم يعقب"},
{id:"K96s4",name:"البخاري",g:"M",father:"K96",mother:"K96w1",note:"مات صغيرًا"},
{id:"K98",para:98,name:"محمدن",g:"M",father:"K97",mother:"Z104w2",dates:"1388هـ/1968م –",place:"أبير حيبلل",spouses:["K98w1","K98w2"]},
{id:"K98w1",name:"الخيت",g:"F",father:"Z104",mother:"Z104w1",dates:"1333هـ/1915م – 1420هـ/1999م",place:"أبير حيبلل",spouses:["K98"],fullName:"الخيت بنت محمد الأمين بن محمذن بن محمد بن الأمين بن حمم بن أبو الحس"},
{id:"K99",para:99,name:"طاب",g:"M",father:"K98",mother:"K98w1",dates:"1352هـ/1933م – 1422هـ/2001م",place:"أبير حيبلل",spouses:["K99w1","K99w2"]},
{id:"K101",para:101,name:"محمد",g:"M",father:"K98",mother:"K98w1",dates:"1355هـ/1936م – 1434هـ/2013م",place:"أبير حيبلل",spouses:["K101w1"]},
{id:"K98w2",name:"السالمه",g:"F",father:"I42",dates:"1341هـ/1923م – 1422هـ/2001م",place:"إلى سيدَّن",spouses:["K98"],mother:"I42w1",note:"أم محمد عبد الله من أبناء محمدن بن احمد طاب بن حمم بن انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم"},
{id:"K102",para:102,name:"محمد عبد الله",g:"M",father:"K98",mother:"K98w2",dates:"1373هـ/1954م – 1405هـ/1985م",place:"حسي السعاده",spouses:["K102w1"]},
{id:"K99w1",name:"عائشة",g:"F",father:"XA387",spouses:["K99"],ext:true},
{id:"K100",para:100,name:"حبيب",g:"M",father:"K99",mother:"K99w1",dates:"1387هـ/1967م –",spouses:["J19d1"]},
{id:"K99s1",name:"حَّماده (محمد)",g:"M",father:"K99",mother:"K99w1",dates:"1389هـ/1969م –"},
{id:"K99d1",name:"آَّمه (مريم السالمه)",g:"F",father:"K99",mother:"K99w1",dates:"– 1971م"},
{id:"K99w2",name:"خدجية",g:"F",father:"XA1120",dates:"1371هـ/1952م –",spouses:["K99"],ext:true},
{id:"K99s2",name:"امبارك (محمدن)",g:"M",father:"K99",mother:"K99w2",dates:"1404هـ/1984م –"},
{id:"K99d2",name:"لمروه",g:"F",father:"K99",mother:"K99w2",dates:"1397هـ/1977م –"},
{id:"K99d3",name:"هيبه",g:"F",father:"K99",mother:"K99w2",dates:"1401هـ/1981م –"},
{id:"K100s1",name:"ابن",g:"M",father:"K100",mother:"J19d1",dates:"1429هـ/2008م –"},
{id:"K100d1",name:"دجانه",g:"F",father:"K100",mother:"J19d1",dates:"1432هـ/2011م –"},
{id:"K100d2",name:"خديجة",g:"F",father:"K100",mother:"J19d1",dates:"1434هـ/2012م –"},
{id:"K101w1",name:"لحبوس",g:"F",father:"P12",mother:"P12w1",note:"بنت سيد محمد بن ابَّا (عبد الله)... بن با (الأمين) بن ماهي — رابط بين الفرعين",dates:"1375هـ/1956م –",spouses:["K101"],crossLink:true},
{id:"K101s1",name:"محمدن",g:"M",father:"K101",mother:"K101w1",dates:"1392هـ/1972م –"},
{id:"K101d1",name:"منت الأمّنها (خديجة)",g:"F",father:"K101",mother:"K101w1",dates:"1390هـ/1970م –" ,spouses:["Z128"] ,note:"رابط بين الأسرتين" ,crossLink:true},
{id:"K101d2",name:"عائشة",g:"F",father:"K101",mother:"K101w1",dates:"1396هـ/1976م –" ,spouses:["Z120"] ,note:"رابط بين الأسرتين" ,crossLink:true},
{id:"K102w1",name:"مفيده",g:"F",father:"Z18",mother:"Z18w1",spouses:["K102"],fullName:"مفيده بنت اموه (محمودن) بن محمد فال بن المختار بن محنض بن محمذن بن متيلي بن أحمد بن الحسن دوبك"},
{id:"K103",para:103,name:"توره (المختار)",g:"M",father:"K102",mother:"K102w1",dates:"1404هـ/1984م –",spouses:["K108d1"]},
{id:"K103s1",name:"فالن",g:"M",father:"K103",mother:"K108d1",dates:"1435هـ/2014م –"},
{id:"K104w1",name:"مسعوده",g:"F",father:"XA32",place:"حلجورية",spouses:["K104"]},
{id:"K105",para:105,name:"سيد أحمد لحبيب",g:"M",father:"K104",mother:"K104w1",dates:"1339هـ/1921م –",place:"سنغال",spouses:["K105w1","K105w2","K105w3"]},
{id:"K109",para:109,name:"محم",g:"M",father:"K104",mother:"K104w1",dates:"1324هـ/1906م –",place:"اكدرنيت",spouses:["K109w1"]},
{id:"K110",para:110,name:"محمودن",g:"M",father:"K104",mother:"K104w1",dates:"1270هـ/1854م – 1328هـ/1910م",place:"سنغال",spouses:["K110w1"]},
{id:"K119",para:119,name:"المختار الكوري",g:"M",father:"K104",mother:"K104w1",dates:"1326هـ/1908م –",place:"سنغال",spouses:["K119w1"]},
{id:"K105w1",name:"أمن",g:"F",father:"Z148",spouses:["K105"],fullName:"أمن بنت محمذن بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"K106",para:106,name:"محمدن",g:"M",father:"K105",mother:"K105w1",dates:"1349هـ/1930م –",place:"سنغال",spouses:["K106w1"]},
{id:"K105w2",name:"عائشة",g:"F",father:"K90",mother:"K90w1",note:"بنت محم بن انداه (المختار) — زواج داخلي بالأسرة",spouses:["K105"]},
{id:"K107",para:107,name:"حمود",g:"M",father:"K105",mother:"K105w2",dates:"1398هـ/1978م –",place:"دار جلف (سنغال)",spouses:["K107w1"]},
{id:"K105w3",name:"مريم",g:"F",father:"K87",note:"بنت اَّدد (أحمد) بن انداه (المختار) — زواج داخلي بالأسرة",spouses:["K105"]},
{id:"K105d1",name:"خَّديج",g:"F",father:"K105",mother:"K105w3",dates:"1355هـ/1936م –",place:"حسي شداد" ,spouses:["Z23"] ,note:"زواج داخلي بالأسرة" ,crossLink:true},
{id:"K106w1",name:"فاطمة",g:"F",father:"XA389",spouses:["K106"],ext:true},
{id:"K107w1",name:"فلانة -تندغو-",g:"F",father:null,spouses:["K107"]},
{id:"K108",para:108,name:"الشيخ",g:"M",father:"K107",mother:"K107w1",spouses:["K108w1"]},
{id:"K107s1",name:"سيد أحمد",g:"M",father:"K107",mother:"K107w1"},
{id:"K107d1",name:"مام جار (عائشة)",g:"F",father:"K107",mother:"K107w1"},
{id:"K108w1",name:"فلانة -ادوعيش-",g:"F",father:null,spouses:["K108"]},
{id:"K108d1",name:"حوريه",g:"F",father:"K108",mother:"K108w1" ,spouses:["K103"]},
{id:"K109w1",name:"أم الخيري",g:"F",father:"F19",mother:"F19w1",spouses:["K109"],crossLink:true},
{id:"K109s1",name:"المختار السالم",g:"M",father:"K109",mother:"K109w1",note:"لم يعقب"},
{id:"K110w1",name:"والن (ميمونه)",g:"F",father:"D46s2s1s1s1s1",place:"تنيخلف",spouses:["K110"]},
{id:"K111",para:111,name:"المختار",g:"M",father:"K110",mother:"K110w1",dates:"1302هـ/1885م – 1389هـ/1969م",place:"حسي السعاده",spouses:["K111w1","L17d2"]},
{id:"K114",para:114,name:"ددّالي (محمد اليدالي)",g:"M",father:"K110",mother:"K110w1",dates:"1307هـ/1890م – 1400هـ/1980م",place:"أبير حيبلل",spouses:["M25d2","K114w2"]},
{id:"K118",para:118,name:"ناصر الدين",g:"M",father:"K110",mother:"K110w1",dates:"1309هـ/1892م – 1396هـ/1976م",place:"أبير اتورس",spouses:["K118w1"]},
{id:"K110d1",name:"فاطمة",g:"F",father:"K110",mother:"K110w1",note:"لم تعقب"},
{id:"K111w1",name:"أم الخيري",g:"F",father:"F89",mother:"F89w1",dates:"1358هـ/1939م –",place:"تندوجو",spouses:["K111"],crossLink:true,fullName:"أم الخيري بنت أحمد بزيد بن محمذن بن بازيد بن محمذن بن الفالي بن المبارك بن الماما"},
{id:"K112",para:112,name:"محمذن",g:"M",father:"K111",mother:"L17d2",dates:"1368هـ/1949م –",spouses:["K112w1"]},
{id:"K112w1",name:"مريم دلره",g:"F",father:"XA393",dates:"1376هـ/1957م –",spouses:["K112"],ext:true},
{id:"K113",para:113,name:"المختار",g:"M",father:"K112",mother:"K112w1",dates:"1394هـ/1974م –",spouses:["K113w1"]},
{id:"K112s1",name:"اناه (أحمد)",g:"M",father:"K112",mother:"K112w1",dates:"1397هـ/1977م –"},
{id:"K112s2",name:"محمودن",g:"M",father:"K112",mother:"K112w1",dates:"1405هـ/1985م –"},
{id:"K112d1",name:"فاطمة",g:"F",father:"K112",mother:"K112w1",dates:"1401هـ/1981م –" ,spouses:["L20"] ,note:"زواج داخلي بأسرة محمد الكريم" ,crossLink:true},
{id:"K112d2",name:"مريم",g:"F",father:"K112",mother:"K112w1",dates:"1408هـ/1988م –"},
{id:"K112d3",name:"هال (فاطمه فال)",g:"F",father:"K112",mother:"K112w1",dates:"1414هـ/1994م –"},
{id:"K112d4",name:"ميمهنه",g:"F",father:"K112",mother:"K112w1",dates:"1416هـ/1996م –"},
{id:"K113w1",name:"فلانة",g:"F",father:"XA395",spouses:["K113"],ext:true},
{id:"K113d1",name:"فلانة",g:"F",father:"K113",mother:"K113w1"},
{id:"K114w2",name:"عيشان",g:"F",father:"XA1123",dates:"1341هـ/1923م – 1427هـ/2006م",place:"أبير حيبلل",spouses:["K114"],fullName:"عيشان بنت أَّمم (محمذن) بن اَّيا (أحمذ) بن ايب بن محمذن بن الأمين بن الفالي"},
{id:"K115",para:115,name:"أحمد",g:"M",father:"K114",mother:"K114w2",dates:"1351هـ/1932م – 1438هـ/2016م",place:"أبير حيبلل",spouses:["K115w1","I38d2"]},
{id:"K114d2",name:"عيشه",g:"F",father:"K114",mother:"K114w2",dates:"1369هـ/1950م –" ,spouses:["K78"]},
{id:"K117",para:117,name:"بنيوك (يحي)",g:"M",father:"K114",mother:"K114w2",dates:"1371هـ/1952م –",spouses:["K117w1"]},
{id:"K114d3",name:"فاطمة",g:"F",father:"K114",mother:"K114w2",dates:"1374هـ/1955م –"},
{id:"K115w1",name:"ايايا (أم الخيرات)",g:"F",father:"I38",dates:"1377هـ/1958م –",spouses:["K115"],fullName:"ايايا (أم الخيرات) بنت السيد بن اَّميو (محمذن) بن سيد أحممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم"},
{id:"K116",para:116,name:"محمدن",g:"M",father:"K115",mother:"K115w1",dates:"1396هـ/1976م –",spouses:["K116w1"]},
{id:"K115s1",name:"ددالي",g:"M",father:"K115",mother:"K115w1",dates:"1407هـ/1987م –"},
{id:"K115s2",name:"محمذن",g:"M",father:"K115",mother:"K115w1",dates:"1409هـ/1989م –"},
{id:"K115s3",name:"ناصر الدين",g:"M",father:"K115",mother:"K115w1",dates:"1411هـ/1991م –"},
{id:"K115d1",name:"النّون",g:"F",father:"K115",mother:"K115w1",dates:"1398هـ/1978م –",spouses:["P37"]},
{id:"K116w1",name:"فلانة",g:"F",father:"XA397",spouses:["K116"],ext:true},
{id:"K116s1",name:"أحمد",g:"M",father:"K116",mother:"K116w1"},
{id:"K117w1",name:"خدي",g:"F",father:"Z108",dates:"1386هـ/1966م –",spouses:["K117"],fullName:"خدي بنت حمم بن مَّن (محمذين) بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"K117s1",name:"ددالي",g:"M",father:"K117",mother:"K117w1",dates:"1414هـ/1994م –"},
{id:"K117s2",name:"محمودن",g:"M",father:"K117",mother:"K117w1",dates:"1419هـ/1998م –"},
{id:"K117d1",name:"ابتسام (مريم)",g:"F",father:"K117",mother:"K117w1",dates:"1409هـ/1989م –"},
{id:"K117d2",name:"ابتهاج (عائشة)",g:"F",father:"K117",mother:"K117w1",dates:"1411هـ/1991م –" ,spouses:["K39"]},
{id:"K117d3",name:"ساميه (آمنة)",g:"F",father:"K117",mother:"K117w1",dates:"1413هـ/1993م –" ,note:"رابط بين الأسرتين محتمل" ,crossLink:true,spouses:["F75"]},
{id:"K118w1",name:"عيشه",g:"F",father:"F89",mother:"F89w2",dates:"1341هـ/1923م – 1428هـ/2007م",place:"حسي السعاده",spouses:["K118"],crossLink:true,fullName:"عيشه بنت أحمد بزيد بن محمذن بن بازيد بن محمذن بن الفالي بن المبارك بن الماما"},
{id:"K118d1",name:"والنون",g:"F",father:"K118",mother:"K118w1",dates:"1372هـ/1953م –",note:"بنت ناصر الدين بن محمودن بن محمذن بن انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",spouses:["L21"]},
{id:"K119w1",name:"العايشه",g:"F",father:"K43",mother:"K43w1",place:"تنيخلف",spouses:["K119"],fullName:"العايشه بنت أحمد باب بن العتيق بن أحمد خرشي بن الخراشي بن مسكو بن باركلل بن أحمد بزيد",ext:true},
{id:"K120",para:120,name:"محمذن",g:"M",father:"K119",mother:"K119w1",dates:"1328هـ/1910م –",spouses:["M25d1"]},
{id:"K121",para:121,name:"محمد",g:"M",father:"K119",mother:"K119w1",dates:"1336هـ/1918م –",place:"أبير حيبلل",spouses:["K121w1","Y52d2"]},
{id:"K119s1",name:"أحمد باب",g:"M",father:"K119",mother:"K119w1",note:"لم يعقب"},
{id:"K119s2",name:"حامد",g:"M",father:"K119",mother:"K119w1",dates:"1398هـ/1978م –",place:"أبير حيبلل",note:"لم يعقب"},
{id:"K119d1",name:"أم المؤمنين",g:"F",father:"K119",mother:"K119w1",dates:"1376هـ/1957م –",place:"تنيخلف"},
{id:"K119d2",name:"سوده (مسعوده)",g:"F",father:"K119",mother:"K119w1" ,spouses:["K89"] ,note:"زواج داخلي بالأسرة" ,crossLink:true},
{id:"K119d3",name:"ميمهنه",g:"F",father:"K119",mother:"K119w1" ,spouses:["K91"]},
{id:"K119d5",name:"مريم",g:"F",father:"K119",mother:"K119w1",note:"لم تعقب"},
{id:"K119d6",name:"زيزه",g:"F",father:"K119",mother:"K119w1",note:"لم تعقب"},
{id:"K119d7",name:"بَّا (أم الخيري)",g:"F",father:"K119",mother:"K119w1",dates:"1401هـ/1981م –",place:"أبير حيبلل",note:"بنت المختار الكوري بن محمذن بن انداه (المختار) بن بنيوك (محمذن) بن المختار — رابط بين الأسرتين",spouses:["M26"]},
{id:"K121w1",name:"يـمَّا (مريم)",g:"F",father:"Y52",dates:"1305هـ/1888م – 1394هـ/1974م",place:"أبير حيبلل",spouses:["K121"],fullName:"يـمَّا (مريم) بنت الكوري بن محيين بن الجمد بن حرمه بن المختار بن المعزوز",mother:"Y52w2"},
{id:"K121d2",name:"الزهراء",g:"F",father:"K121",mother:"K121w1",dates:"1409هـ/1989م –"},
{id:"K121d3",name:"الخيت",g:"F",father:"K121",mother:"K121w1",dates:"1335هـ/1917م – 1428هـ/2007م",place:"أبير حيبلل" ,spouses:["P26"]},
{id:"K123",para:123,name:"محمذن",g:"M",father:"K122",mother:"R56d1",spouses:["K123w1"]},
{id:"K122w2",name:"مريم",g:"F",father:"I71",spouses:["K122"],mother:"I71w1",note:"أم احمد والمختار وابوبكر وافيطيمو وميمونو من أبناء سيد الفالي بن بنيوك (محمذن) بن المختار بن محمد الكريم"},
{id:"K122s1",name:"أبوبكر",g:"M",father:"K122",mother:"K122w2",note:"لم يعقب"},
{id:"K141",para:141,name:"أحمد",g:"M",father:"K122",mother:"K122w2",spouses:["K141w1","K141w2","R3d1"]},
{id:"K149",para:149,name:"المختار",g:"M",father:"K122",mother:"K122w2",place:"حبلل",spouses:["K29d1"]},
{id:"K122d2",name:"ميمهنه",g:"F",father:"K122",mother:"K122w2"},
{id:"K123w1",name:"اعويشه",g:"F",father:"F20",spouses:["K123"],crossLink:true,mother:"E3d3"},
{id:"K124",para:124,name:"اتّو (الكوري)",g:"M",father:"K123",mother:"K123w1",dates:"1346هـ/1928م –",place:"المذرذره",spouses:["K124w1"]},
{id:"K132",para:132,name:"سيد",g:"M",father:"K123",mother:"K123w1",dates:"1334هـ/1916م –",place:"أبير حيبلل",spouses:["Z72d2"]},
{id:"K133",para:133,name:"مولود",g:"M",father:"K123",mother:"K123w1",place:"اجدر لخظر",spouses:["K133w1"]},
{id:"K123d1",name:"فاطمة",g:"F",father:"K123",mother:"K123w1"},
{id:"K123d2",name:"خديجة",g:"F",father:"K123",mother:"K123w1" ,spouses:["K61"]},
{id:"K123d3",name:"مريم فال",g:"F",father:"K123",mother:"K123w1",dates:"1334هـ/1916م –",note:"لم تعقب"},
{id:"K124w1",name:"آيه (العاليه)",g:"F",father:"F13",mother:"F13w1",place:"تنيخلف",spouses:["K124"],crossLink:true},
{id:"K125",para:125,name:"الحسن",g:"M",father:"K124",mother:"K124w1",dates:"1315هـ/1898م – 1380هـ/1961م",place:"تنيخلف",spouses:["K125w1"]},
{id:"K129",para:129,name:"ديدي",g:"M",father:"K124",mother:"K124w1",dates:"1320هـ/1902م – 1392هـ/1972م",place:"حبلل",spouses:["M40w1"]},
{id:"K124d2",name:"ابونيا و",g:"F",father:"K124",mother:"K124w1",dates:"1326هـ/1908م – 1409هـ/1989م",place:"أبير حيبلل"},
{id:"K125w1",name:"عيشه",g:"F",father:"I81",dates:"1330هـ/1912م – 1418هـ/1997م",place:"حسي السعاده",spouses:["K125"]},
{id:"K125s1",name:"محمدن",g:"M",father:"K125",mother:"K125w1",dates:"1359هـ/1940م – 1438هـ/2017م",place:"حسي السعاده",note:"لم يعقب"},
{id:"K126",para:126,name:"ددّالي",g:"M",father:"K125",mother:"K125w1",dates:"1363هـ/1944م –",spouses:["K126w1","K126w2","K126w3"]},
{id:"K128",para:128,name:"ولد ابياه (محمد)",g:"M",father:"K125",mother:"K125w1",dates:"1367هـ/1948م –",spouses:["K92d2"]},
{id:"K125s2",name:"عبد الله",g:"M",father:"K125",mother:"K125w1",dates:"1376هـ/1957م –"},
{id:"K126w1",name:"آمنة",g:"F",father:"XA406",dates:"1369هـ/1950م –",spouses:["K126"],ext:true},
{id:"K126d1",name:"عيشه",g:"F",father:"K126",mother:"K126w1",dates:"1393هـ/1973م –"},
{id:"K126w2",name:"والنون (خديجة)",g:"F",father:"Z140",dates:"1373هـ/1954م –",spouses:["K126"],fullName:"والنون (خديجة) بنت محمد عبد الله بن الحسن بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"K127",para:127,name:"ماَّم (محمد)",g:"M",father:"K126",mother:"K126w2",dates:"1399هـ/1979م –",spouses:["Z141d1"]},
{id:"K126d2",name:"نزيهه",g:"F",father:"K126",mother:"K126w2",dates:"1398هـ/1978م –"},
{id:"K126w3",name:"عائشة",g:"F",father:"XA408",spouses:["K126"],ext:true},
{id:"K126s1",name:"الحسن",g:"M",father:"K126",mother:"K126w3",dates:"1426هـ/2005م –"},
{id:"K126d3",name:"كريمه",g:"F",father:"K126",mother:"K126w3",dates:"1421هـ/2000م –"},
{id:"K127d1",name:"أم الخيري",g:"F",father:"K127",mother:"Z141d1",dates:"1436هـ/2015م –" ,spouses:["P17"] ,crossLink:true},
{id:"K128s1",name:"الحسن",g:"M",father:"K128",mother:"K92d2",dates:"1407هـ/1987م –"},
{id:"K128s2",name:"محمذن",g:"M",father:"K128",mother:"K92d2",dates:"1412هـ/1992م –"},
{id:"K128s3",name:"المختار",g:"M",father:"K128",mother:"K92d2",dates:"1415هـ/1995م –"},
{id:"K128s4",name:"سيد أحمد",g:"M",father:"K128",mother:"K92d2",dates:"1427هـ/2006م –"},
{id:"K130",para:130,name:"محمدن",g:"M",father:"K129",mother:"M40w1",dates:"1375هـ/1956م –",spouses:["K130w1","K130w2"]},
{id:"K131",para:131,name:"عبد الله",g:"M",father:"K129",mother:"M40w1",dates:"1385هـ/1965م –",spouses:["V21d1"]},
{id:"K129d1",name:"آيَّه",g:"F",father:"K129",mother:"M40w1",dates:"1380هـ/1961م –"},
{id:"K130w1",name:"فلانة -اجيجبو-",g:"F",father:null,spouses:["K130"]},
{id:"K130w2",name:"تر باه",g:"F",father:"XA409",spouses:["K130"],ext:true},
{id:"K130s1",name:"شغالي",g:"M",father:"K130",mother:"K130w2",dates:"1408هـ/1988م –"},
{id:"K130s2",name:"محمد",g:"M",father:"K130",mother:"K130w2",dates:"1411هـ/1991م –"},
{id:"K130s3",name:"أحمد",g:"M",father:"K130",mother:"K130w2",dates:"1420هـ/1999م –"},
{id:"K130d2",name:"احبيبه",g:"F",father:"K130",mother:"K130w2",dates:"1418هـ/1997م –"},
{id:"K131s1",name:"المختار",g:"M",father:"K131",mother:"V21d1",dates:"1427هـ/2006م –"},
{id:"K131d1",name:"احبيبه",g:"F",father:"K131",mother:"V21d1",dates:"1423هـ/2002م –"},
{id:"K131d2",name:"خديجة",g:"F",father:"K131",mother:"V21d1",dates:"1431هـ/2010م –"},
{id:"K132s1",name:"أحمد",g:"M",father:"K132",mother:"Z72d2",dates:"1352هـ/1933م –",note:"لم يعقب"},
{id:"K132d2",name:"فت (خديجة)",g:"F",father:"K132",mother:"Z72d2",dates:"1318هـ/1900م – 1403هـ/1983م",place:"دليلحو"},
{id:"K133w1",name:"امَّمي",g:"F",father:"F22",mother:"K154d1",place:"أبير حلل",spouses:["K133"],crossLink:true},
{id:"K134",para:134,name:"مبَّ",g:"M",father:"K133",mother:"K133w1",dates:"1322هـ/1904م – 1406هـ/1986م",place:"أبير حيبلل",spouses:["K134w1"]},
{id:"K133s1",name:"محمد",g:"M",father:"K133",mother:"K133w1",note:"لم يعقب"},
{id:"K138",para:138,name:"محمذن باب",g:"M",father:"K133",mother:"K133w1",dates:"1359هـ/1940م –",place:"حسي السعاده",spouses:["R26d1"]},
{id:"K133s2",name:"المختار",g:"M",father:"K133",mother:"K133w1",note:"لم يعقب"},
{id:"K133d1",name:"اتواه (بنت وهب)",g:"F",father:"K133",mother:"K133w1"},
{id:"K134w1",name:"سلمه",g:"F",father:"K59",mother:"F137d1",note:"بنت أحمذ بن خير الورى بن سيد عبد الله بن محمد الكريم — زواج داخلي بالأسرة",dates:"1336هـ/1918م – 1432هـ/2011م",place:"أبير حيبلل",spouses:["K134"]},
{id:"K135",para:135,name:"محمذن",g:"M",father:"K134",mother:"K134w1",dates:"1368هـ/1949م –",spouses:["K139d1"]},
{id:"K134s1",name:"محمدن",g:"M",father:"K134",mother:"K134w1",dates:"1375هـ/1956م – 1435هـ/2014م",note:"لم يعقب"},
{id:"K137",para:137,name:"عبد الله",g:"M",father:"K134",mother:"K134w1",dates:"1377هـ/1958م –",spouses:["R57d2"]},
{id:"K134d1",name:"خديجة",g:"F",father:"K134",mother:"K134w1",dates:"1374هـ/1955م – 1399هـ/1979م",note:"لم تعقب"},
{id:"K136",para:136,name:"الشيخ أحمد",g:"M",father:"K135",mother:"K139d1",dates:"1407هـ/1987م –",spouses:["R28d1"]},
{id:"K136d1",name:"آمنة",g:"F",father:"K136",mother:"R28d1"},
{id:"K137s1",name:"أحمد",g:"M",father:"K137",mother:"R57d2",dates:"1419هـ/1998م –"},
{id:"K139",para:139,name:"سيد محمد",g:"M",father:"K138",mother:"R26d1",dates:"1344هـ/1926م – 1430هـ/2009م",place:"أبير حيبلل",spouses:["V25d2"]},
{id:"K139s1",name:"محمدن",g:"M",father:"K139",mother:"V25d2",dates:"1387هـ/1967م –"},
{id:"K140",para:140,name:"احدي (محمد فال)",g:"M",father:"K139",mother:"V25d2",dates:"1394هـ/1974م –",spouses:["K140w1","K140w2"]},
{id:"K139d1",name:"امينه",g:"F",father:"K139",mother:"V25d2",dates:"1384هـ/1964م –" ,spouses:["K135"]},
{id:"K140w1",name:"البتول",g:"F",father:"E48s1",spouses:["K140"],crossLink:true,fullName:"البتول بنت مسعود"},
{id:"K140s1",name:"المختار",g:"M",father:"K140",mother:"K140w1",dates:"1415هـ/1995م –"},
{id:"K140s2",name:"محمد",g:"M",father:"K140",mother:"K140w1",dates:"1418هـ/1997م –"},
{id:"K140w2",name:"مرمب",g:"F",father:"XA410",spouses:["K140"],ext:true},
{id:"K140s3",name:"سيد محمد",g:"M",father:"K140",mother:"K140w2"},
{id:"K140s4",name:"أحمد عبد",g:"M",father:"K140",mother:"K140w2"},
{id:"K140d1",name:"ميم",g:"F",father:"K140",mother:"K140w2",dates:"1423هـ/2002م –"},
{id:"K141w1",name:"ابنيهّ",g:"F",father:"XA1126",spouses:["K141"]},
{id:"K142",para:142,name:"سيد",g:"M",father:"K141",mother:"K141w1",spouses:["M24d2"]},
{id:"K141w2",name:"فلانة",g:"F",father:"XA1243",spouses:["K141"],fullName:"فلانة بنت الأمين بن ابيهم بن أبا الصالح (يعقوب) بن أحمد بن اشفغ اوبك بن مهنض امغر",ext:true},
{id:"K141d2",name:"عيشه",g:"F",father:"K141",mother:"K141w2",note:"لم تعقب"},
{id:"K143",para:143,name:"أحمدناه",g:"M",father:"K142",mother:"M24d2",place:"أبير حيبلل",spouses:["K143w1"]},
{id:"K142d1",name:"الغاليه",g:"F",father:"K142",mother:"M24d2" ,spouses:["E58"] ,place:"أبير حيبلل" ,crossLink:true},
{id:"K142d2",name:"منت البار",g:"F",father:"K142",mother:"M24d2" ,spouses:["K13"]},
{id:"K143w1",name:"بيده (مريم)",g:"F",father:"K132",mother:"Z72d2",note:"بنت سيد بن محمذن بن سيد الفالي بن بنيوك (محمذن) بن المختار — زواج داخلي بالأسرة",dates:"1406هـ/1986م –",place:"أبير حيبلل",spouses:["K143"]},
{id:"K144",para:144,name:"الب",g:"M",father:"K143",mother:"K143w1",dates:"1341هـ/1923م – 1406هـ/1986م",place:"أبير حيبلل",spouses:["W4d1","K144w2","K144w3","M62d1","Y50d3"]},
{id:"K145",para:145,name:"محمدن",g:"M",father:"K144",mother:"W4d1",dates:"1373هـ/1954م –",spouses:["K145w1"]},
{id:"K144d1",name:"النجاح",g:"F",father:"K144",mother:"W4d1",dates:"1377هـ/1958م –" ,spouses:["F83"] ,note:"زوجة أخرى لا ابنة" ,crossLink:true},
{id:"K144w2",name:"منت الخير",g:"F",father:"Y30s1s2s1",place:"أبير حيبلل",spouses:["K144"]},
{id:"K146",para:146,name:"أحمدناه",g:"M",father:"K144",mother:"K144w2",dates:"1386هـ/1966م –",spouses:["K146w1"]},
{id:"K144d2",name:"مموه (ميمونه)",g:"F",father:"K144",mother:"K144w2",dates:"1389هـ/1969م – 1400هـ/1980م",place:"انواكشوط",note:"لم تعقب"},
{id:"K144w3",name:"خدجية",g:"F",father:"K22",mother:"K22w1",note:"بنت أحمد بن محمذن بن ابَّامين (الأمين) بن المختار بن أحمد انهكر — زواج داخلي بالأسرة",dates:"1369هـ/1950م –",spouses:["K144"]},
{id:"K144d3",name:"اللو",g:"F",father:"K144",mother:"K144w3",dates:"1397هـ/1977م –"},
{id:"K147",para:147,name:"اطول عمر (سيد أحمد)",g:"M",father:"K144",mother:"M62d1",dates:"1399هـ/1979م –",spouses:["K147w1"]},
{id:"K148",para:148,name:"أحمد سالم (باكا)",g:"M",father:"K144",mother:"M62d1",dates:"1402هـ/1982م –",spouses:["R58d1"]},
{id:"K144d4",name:"عكدي (أم الخيري)",g:"F",father:"K144",mother:"M62d1",dates:"1404هـ/1984م –" ,spouses:["K65","F121"] ,note:"رابط بين الأسرتين محتمل" ,crossLink:true},
{id:"K145w1",name:"اطّشه (عائشة)",g:"F",father:"R57",dates:"1393هـ/1973م –",spouses:["K145"]},
{id:"K145s1",name:"سيد الفالي",g:"M",father:"K145",mother:"K145w1",dates:"1415هـ/1995م –"},
{id:"K145s2",name:"أحمد",g:"M",father:"K145",mother:"K145w1",dates:"1424هـ/2003م –"},
{id:"K145s3",name:"الأمين",g:"M",father:"K145",mother:"K145w1",dates:"1425هـ/2004م –"},
{id:"K145d1",name:"نواره",g:"F",father:"K145",mother:"K145w1",dates:"1418هـ/1997م –"},
{id:"K146w1",name:"فاطمة",g:"F",father:"Z63",mother:"Z63w1",dates:"1393هـ/1973م –",spouses:["K146"],crossLink:true,fullName:"فاطمة بنت محمد الأمين بن أحمد بن الداده (عبد الله) بن أحمد بن محمد الباقر بن حمم بن أبو الحس بن المزضف"},
{id:"K146s1",name:"محمد الأمين",g:"M",father:"K146",mother:"K146w1",dates:"1425هـ/2004م –"},
{id:"K146s2",name:"المختار",g:"M",father:"K146",mother:"K146w1",dates:"1428هـ/2007م –"},
{id:"K146d1",name:"ميمهنه",g:"F",father:"K146",mother:"K146w1",dates:"1423هـ/2002م –"},
{id:"K146d2",name:"امباركه",g:"F",father:"K146",mother:"K146w1",dates:"1430هـ/2009م –"},
{id:"K146d3",name:"منت الخير",g:"F",father:"K146",mother:"K146w1",dates:"1432هـ/2011م –"},
{id:"K147w1",name:"هالة (عائشة)",g:"F",father:"Z63",mother:"Z63w3",dates:"1408هـ/1988م –",spouses:["K147"],fullName:"هالة (عائشة) بنت محمد الأمين بن أحمد بن الداده بن أحمد بن محمد الباقر بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"K147s1",name:"عودود",g:"M",father:"K147",mother:"K147w1",dates:"1431هـ/2010م –"},
{id:"K148d1",name:"مريم",g:"F",father:"K148",mother:"R58d1",dates:"1435هـ/2014م –"},
{id:"K150",para:150,name:"المحقق (محمذن)",g:"M",father:"K149",mother:"K29d1",place:"بوزبره",spouses:["K150w1"]},
{id:"K149d1",name:"عيشه فال",g:"F",father:"K149",mother:"K29d1",note:"لم تعقب"},
{id:"K150w1",name:"ميمهنه",g:"F",father:"K140",place:"أم حلفر",spouses:["K150"],fullName:"ميمهنه بنت محمد فال بن سيد محمد -تنواجيه-"},
{id:"K151",para:151,name:"ولد (الكوري)",g:"M",father:"K150",mother:"K150w1",dates:"1377هـ/1958م –",place:"زيرت الخليفه",spouses:["K151w1"]},
{id:"K150s1",name:"محمد فال",g:"M",father:"K150",mother:"K150w1",place:"تايب (سنغال)",note:"لم يعقب"},
{id:"K151w1",name:"امّته (سعاد)",g:"F",father:"K140s5",place:"أبير حيبلل",spouses:["K151"],fullName:"امّته (سعاد) بنت الخليفه بن هيب (محمد فال) بن سيد محمد -تنواجيه-"},
{id:"K151d1",name:"النجاة",g:"F",father:"K151",mother:"K151w1",dates:"1336هـ/1918م – 1435هـ/2014م",place:"أبير حيبلل"},
{id:"K151d2",name:"توت (فاطمة الزهراء)",g:"F",father:"K151",mother:"K151w1",dates:"1341هـ/1923م – 1421هـ/2000م",place:"أبير حيبلل" ,spouses:["K14"]},
{id:"K152",para:152,name:"محمد اغربظ",g:"M",father:"K1",mother:"K1w1",note:"من الزوجة الثانية مريم -أولاد الحسين-",spouses:["K152w1"]},
{id:"K152w1",name:"فلانة",g:"F",father:"P2",mother:"P2w1",note:"بنت با (الأمين) بن ماهي — رابط بين الفرعين",spouses:["K152"],crossLink:true},
{id:"K153",para:153,name:"سيد",g:"M",father:"K152",mother:"K152w1",spouses:["K153w1"]},
{id:"K152d1",name:"غاديجه",g:"F",father:"K152",mother:"K152w1",note:"أم أبناء خير الورى بن سيد عبد الله بن محمد الكريم (K58)",spouses:["K58"]},
{id:"K153w1",name:"عايشا",g:"F",father:"I73",spouses:["K153"],mother:"I73w1",note:"أم الكوري وشقيقته ابني سيد بن محمد اغربظ بن محمد الكريم"},
{id:"K154",para:154,name:"الكوري",g:"M",father:"K153",mother:"K153w1",spouses:["E4d1"]},
{id:"K153d1",name:"فلانة",g:"F",father:"K153",mother:"K153w1",note:"أم سيديا بن محنض باب — لم يعقب"},
{id:"K154d1",name:"مريم",g:"F",father:"K154",mother:"E4d1",note:"بنت الكوري بن سيد بن محمد اغربظ بن محمد الكريم — رابط بين الأسرتين",spouses:["R16","F22"]},
{id:"M1",para:1,name:"متيلي (المختار)",g:"M",father:"T0",
    dates: "1072هـ/1662م –",place:"تنجماره",
    note: "بن سيد الفالي",spouses:["M1w1","M1w2","M1w3","M1w4"]},
{id:"M1w1",name:"تسلم",g:"F",father:"XA412",place:"شمال غرب تفرغ زين",spouses:["M1"],ext:true},
{id:"M1d1",name:"أم هاني",g:"F",father:"M1",mother:"M1w1",note:"أم أبناء خالونا بن الفالي بن المختار اكد عثمان"},
{id:"M1d2",name:"حنه",g:"F",father:"M1",mother:"M1w1",note:"أم المختار وتنغيس، وأم جاكوكئذن وشقيقتها"},
{id:"M1w2",name:"خدجيه",g:"F",father:"XA414",spouses:["M1"],ext:true},
{id:"M2",para:2,name:"خيليد (حبيب الله)",g:"M",father:"M1",mother:"M1w2",place:"أكننت",spouses:["M2w1"]},
{id:"M1d3",name:"امنيانه",g:"F",father:"M1",mother:"M1w2",note:"أم أبناء أحمد شينان بن بوشنكور (الماح)",spouses:["XA629"]},
{id:"M1d4",name:"مريم (الشفاء)",g:"F",father:"M1",mother:"M1w3",note:"أم أبناء المصطفى بن بل (عبد الله) بن المختار اكد عثمان",spouses:["XA477"]},
{id:"M1w3",name:"هينيه",g:"F",father:"XA416",spouses:["M1"],ext:true},
{id:"M4",para:4,name:"بو الماح",g:"M",father:"M1",mother:"M1w3",dates:"1061هـ/1651م –",place:"ظايت بوالماح",spouses:["M4w1"]},
{id:"M1w4",name:"فلانة",g:"F",father:"XA419",spouses:["M1"],ext:true},
{id:"M1s1",name:"اعبط",g:"M",father:"M1",mother:"M1w4",note:"لم يعقب"},
{id:"M20",para:20,name:"الفالي",g:"M",father:"M1",mother:"M1w4",spouses:["M20w1","M20w3"]},
{id:"M1s2",name:"القاضي",g:"M",father:"M1",mother:"M1w4",place:"الخواره",note:"لم يعقب"},
{id:"M1s3",name:"المصطفى",g:"M",father:"M1",mother:"M1w4",place:"ترتالس",note:"لم يعقب"},
{id:"M1s4",name:"الهادي",g:"M",father:"M1",mother:"M1w4",place:"الخواره",note:"لم يعقب"},
{id:"M2w1",name:"عاد",g:"F",father:"XA323",spouses:["M2"],ext:true},
{id:"M3",para:3,name:"المعصوم",g:"M",father:"M2",mother:"M2w1",spouses:["M3w1"]},
{id:"M3w1",name:"فلانة",g:"F",father:"N1",spouses:["M3"],crossLink:true,fullName:"فلانة بنت محمذن بن أحمد شب",ext:true},
{id:"M3d1",name:"النبراس",g:"F",father:"M3",mother:"M3w1",note:"أم محمذن ومريم من أبناء سيد أحمد بن حبلل بن ابراهيم؛ رابط بين الأسرتين — تزوجت F137 ثم F138",spouses:["I3","F137","F138"]},
{id:"M4w1",name:"فلانة",g:"F",father:"XA424",spouses:["M4"],ext:true},
{id:"M5",para:5,name:"باركلل",g:"M",father:"M4",mother:"M4w1",spouses:["M5w1","D46d1"]},
{id:"M5w1",name:"متتها",g:"F",father:"D46",mother:"D46w1",spouses:["M5"]},
{id:"M6",para:6,name:"الغالي",g:"M",father:"M5",mother:"M5w1",spouses:["M6w1"]},
{id:"M19",para:19,name:"اللبيد",g:"M",father:"M5",mother:"M5w1",spouses:["M19w1"]},
{id:"M5d1",name:"أحمامه",g:"F",father:"M5",mother:"M5w1",note:"أم أبناء الأمين بن حوبك بن الفالي بن المختار اكد عثمان",spouses:["XA783"]},
{id:"M5d2",name:"أم هاني",g:"F",father:"M5",mother:"M5w1",note:"أم أبناء الذيبو بن محمذن بن اعمر يزكئذن"},
{id:"M5d3",name:"خديجه",g:"F",father:"M5",mother:"M5w1",note:"أم أبناء اشفغ المختار بن حبلل بن الفالي بن اشفغ اوبك"},
{id:"M5d4",name:"مريم",g:"F",father:"M5",mother:"M5w1",note:"أم أبناء المنويفل بن المختار بن المصطفى بن بل (عبد الله)"},
{id:"M5d5",name:"هينه",g:"F",father:"M5",mother:"M5w1",note:"أم أبناء محمد بن أبو الحس بن بل (عبد الله)"},
{id:"M6w1",name:"مانه",g:"F",father:"XA425",spouses:["M6"],ext:true},
{id:"M7",para:7,name:"محمذن",g:"M",father:"M6",mother:"M6w1",spouses:["M7w1"]},
{id:"M6d1",name:"حنه",g:"F",father:"M6",mother:"M6w1",note:"أم بنت النبي ومريم مانو"},
{id:"M6d2",name:"فلانة",g:"F",father:"M6",mother:"M6w1",note:"أم أبناء ياحمّذ بن حبلل بن الكريم"},
{id:"M6d3",name:"فلانة",g:"F",father:"M6",mother:"M6w1",note:"أم ابني بتاجه بن ماندي (محنض)"},
{id:"M6d4",name:"فلانة",g:"F",father:"M6",mother:"M6w1",note:"أم أبناء أحمد دام -أولاد بنعمر-"},
{id:"M6d5",name:"فلانة",g:"F",father:"M6",mother:"M6w1",note:"أم محمود فال بن حبيب الله"},
{id:"M7w1",name:"ت (تُّب)",g:"F",father:"K2",mother:"K2w1",note:"بنت احجاب بن محمد الكريم — رابط بين الأسرتين؛ أم أبناء محمذن بن الغالي بن باركلل بن بوالماح بن متيلي",spouses:["M7"],crossLink:true},
{id:"M8",para:8,name:"المختار",g:"M",father:"M7",mother:"M7w1",spouses:["M8w1"]},
{id:"M7s1",name:"أحمد",g:"M",father:"M7",mother:"M7w1",note:"لم يعقب"},
{id:"M7d1",name:"البنيه",g:"F",father:"M7",mother:"M7w1",note:"أم أبناء أحممد بن حبلل اسليطني؛ بنت محمذن بن الغالي بن باركلل بن بوالماح بن متيلي — رابط بالمصاهرة",spouses:["H2","Z92"]},
{id:"M7d2",name:"مريم",g:"F",father:"M7",mother:"M7w1",note:"أم أبناء بيوه بن ميلود بن المصطفى بن حمم سعيد"},
{id:"M8w1",name:"كا كا",g:"F",father:"I52",mother:"I52w1",spouses:["M8"]},
{id:"M9",para:9,name:"آمن (أحمد)",g:"M",father:"M8",mother:"M8w1",spouses:["M9w1"]},
{id:"M12",para:12,name:"محمذن",g:"M",father:"M8",mother:"M8w1",spouses:["M12w1"]},
{id:"M15",para:15,name:"ابراهيم",g:"M",father:"M8",mother:"M8w1",spouses:["M15w1"]},
{id:"M8d1",name:"هرم",g:"F",father:"M8",mother:"M8w1"},
{id:"M9w1",name:"أُد (آمنة)",g:"F",father:"M52",note:"بنت المختار بن محمذن بن الأمين بن الفالي بن متيلي — زواج داخلي بالأسرة؛ أم أبناء آمن (أحمد) بن المختار بن محمذن بن الغالي بن باركلل بن بوالماح بن متيلي",spouses:["M9"],mother:"F132d2"},
{id:"M9s1",name:"سيد الأمين",g:"M",father:"M9",mother:"M9w1",place:"تنيخلف",note:"لم يعقب"},
{id:"M10",para:10,name:"محمد",g:"M",father:"M9",mother:"M9w1",dates:"1345هـ/1927م –",spouses:["M10w1"]},
{id:"M11",para:11,name:"محمذن",g:"M",father:"M9",mother:"M9w1",place:"الجراريو",spouses:["M11w1"]},
{id:"M9d1",name:"خديجه فال",g:"F",father:"M9",mother:"M9w1",note:"أم أبناء محنض باب بن دياه (سيد الفالي) بن محمذن بن الفالي بن المبارك بن اما (الماقور)",spouses:["F48"]},
{id:"M9d2",name:"ميمهنه",g:"F",father:"M9",mother:"M9w1",note:"لم تعقب"},
{id:"M10w1",name:"تُّت (فاطمة)",g:"F",father:"I12",mother:"I12w1",dates:"1462هـ/1982م –",place:"تنيخلف",spouses:["M10"]},
{id:"M10s1",name:"محمد سالم",g:"M",father:"M10",mother:"M10w1",dates:"1344هـ/1926م –"},
{id:"M11w1",name:"تُّت (خدجية)",g:"F",father:"K132",mother:"Z72d2",note:"بنت سيد بن محمذن بن سيد الفالي بن بنيوك (محمذن) بن المختار — رابط بين الأسرتين",dates:"1318هـ/1966م – 1463هـ/1983م",place:"دليلحو",spouses:["M11"],crossLink:true},
{id:"M11d3",name:"أدُّ (آمنة)",g:"F",father:"M11",mother:"M11w1",dates:"1354هـ/1935م – 1418هـ/1997م",place:"دليلحو" ,spouses:["K62"] ,crossLink:true},
{id:"M12w1",name:"اخدجيه فال",g:"F",father:"XA761",spouses:["M12"],ext:true},
{id:"M12s1",name:"أحمد",g:"M",father:"M12",mother:"M12w1",note:"لم يعقب"},
{id:"M13",para:13,name:"اسحاق",g:"M",father:"M12",mother:"M12w1",spouses:["M13w1"]},
{id:"M14",para:14,name:"اسماعيل",g:"M",father:"M12",mother:"M12w1",dates:"1345هـ/1927م –",spouses:["M14w1"]},
{id:"M12s2",name:"يعقوب",g:"M",father:"M12",mother:"M12w1",dates:"1362هـ/1943م –",note:"لم يعقب"},
{id:"M13w1",name:"مريم",g:"F",father:"M53",mother:"M53w1",note:"بنت عبد العزيز بن المختار بن محمذن بن الأمين بن الفالي بن متيلي — زواج داخلي بالأسرة",spouses:["M13"]},
{id:"M13s1",name:"محمذن",g:"M",father:"M13",mother:"M13w1",note:"لم يعقب"},
{id:"M13s2",name:"المختار",g:"M",father:"M13",mother:"M13w1",dates:"1351هـ/1932م –",note:"لم يعقب"},
{id:"M13d1",name:"عايشا",g:"F",father:"M13",mother:"M13w1",note:"لم تعقب"},
{id:"M14w1",name:"الخيت",g:"F",father:"F48",mother:"F48w1",spouses:["M14"],crossLink:true,fullName:"الخيت بنت محنض باب بن سيد الفالي بن محمذن بن الفالي بن المبارك بن اما (الماقور)"},
{id:"M14s1",name:"باب",g:"M",father:"M14",mother:"M14w1",note:"لم يعقب"},
{id:"M15w1",name:"مريم",g:"F",father:"P33",mother:"P33w1",note:"بنت سيد الفالي بن محمذن بن عركاب (حمم) بن ابوبا (الأمين) بن ماهي — رابط بين الأسرتين",spouses:["M15"],crossLink:true},
{id:"M16",para:16,name:"محمدن",g:"M",father:"M15",mother:"M15w1",spouses:["M16w1"]},
{id:"M15d1",name:"بُّت",g:"F",father:"M15",mother:"M15w1",note:"أم عائشة من أبناء محمودن بن محمد فال"},
{id:"M16w1",name:"فاطمة",g:"F",father:"XA430",spouses:["M16"],ext:true},
{id:"M16d1",name:"أم الخير",g:"F",father:"M16",mother:"M16w1",dates:"1326هـ/1908م – 1426هـ/2005م",place:"انتفاشيت",note:"أم زينب بنت أحمد بن السالك -آكند-؛ أم أبناء دداه بن عبد الحي -اهل اشفغ موسى-"},
{id:"M17",para:17,name:"محمد",g:"M",father:"M16",mother:"M16w1",dates:"1343هـ/1925م – 1418هـ/1997م",place:"اعويفيو",spouses:["M17w1","M17w2"]},
{id:"M18",para:18,name:"الداه",g:"M",father:"M16",mother:"M16w1",dates:"1357هـ/1938م – 1421هـ/2000م",place:"حسي السعاده",spouses:["M18w1"]},
{id:"M16s1",name:"أحمد بزيد",g:"M",father:"M16",mother:"M16w1",note:"لم يعقب"},
{id:"M16s2",name:"محمد يحي",g:"M",father:"M16",mother:"M16w1",note:"لم يعقب"},
{id:"M16s3",name:"الكوري",g:"M",father:"M16",mother:"M16w1",note:"لم يعقب"},
{id:"M16d2",name:"آمنة",g:"F",father:"M16",mother:"M16w1",place:"اعويفيو",note:"لم تعقب"},
{id:"M16d3",name:"فلانة",g:"F",father:"M16",mother:"M16w1",note:"أم أبناء شّ آمن"},
{id:"M16d4",name:"فلانة",g:"F",father:"M16",mother:"M16w1",note:"أم أسلم بن اجويري"},
{id:"M17w1",name:"فلانة",g:"F",father:"XA708",spouses:["M17"],ext:true},
{id:"M17s1",name:"عزيز",g:"M",father:"M17",mother:"M17w1",dates:"1395هـ/1975م –"},
{id:"M17w2",name:"آمنة -لبيدات-",g:"F",father:null,spouses:["M17"]},
{id:"M17s2",name:"محمدن",g:"M",father:"M17",mother:"M17w2"},
{id:"M17d1",name:"العاليه",g:"F",father:"M17",mother:"M17w2"},
{id:"M17d2",name:"سلمه",g:"F",father:"M17",mother:"M17w2"},
{id:"M17d3",name:"غزيزه",g:"F",father:"M17",mother:"M17w2"},
{id:"M18w1",name:"فلانة",g:"F",father:"XA432",spouses:["M18"],ext:true},
{id:"M18s1",name:"محمدن",g:"M",father:"M18",mother:"M18w1",dates:"1406هـ/1986م –"},
{id:"M18s2",name:"الحسين",g:"M",father:"M18",mother:"M18w1",dates:"1421هـ/2000م –"},
{id:"M18d1",name:"زينب",g:"F",father:"M18",mother:"M18w1",dates:"1421هـ/2000م –"},
{id:"M19w1",name:"فلانة",g:"F",father:"XA1132",spouses:["M19"],ext:true},
{id:"M19s1",name:"محمذن",g:"M",father:"M19",mother:"M19w1",note:"لم يعقب"},
{id:"M19d1",name:"غاديجه",g:"F",father:"M19",mother:"M19w1",note:"أم الدامي بن أحمد ميلود"},
{id:"M20w1",name:"متغجس",g:"F",father:null,spouses:["M20"]},
{id:"M20d1",name:"عائشة",g:"F",father:"M20",mother:"M20w1",note:"أم بعض أبناء أبو الحس بن بل (عبد الله) بن المختار اكد عثمان"},
{id:"M20w3",name:"فلانة",g:"F",father:"XA433",spouses:["M20"],ext:true},
{id:"M21",para:21,name:"المختار",g:"M",father:"M20",mother:"M20w3",spouses:["L1d3"]},
{id:"M22",para:22,name:"الأمين",g:"M",father:"M20",mother:"M20w3",spouses:["M22w1"]},
{id:"M21d1",name:"أم الحسن",g:"F",father:"M21",mother:"L1d3",note:"أم أبناء خليل -أدابلحسن-"},
{id:"M21d2",name:"عايشا",g:"F",father:"M21",mother:"L1d3",note:"أم أحممد بن المختار خير"},
{id:"M22w1",name:"فاطمة",g:"F",father:"XA434",spouses:["M22"],ext:true},
{id:"M23",para:23,name:"محمذن",g:"M",father:"M22",mother:"M22w1",spouses:["F136d1"]},
{id:"M22d1",name:"مريم",g:"F",father:"M22",mother:"M22w1",note:"لم تعقب"},
{id:"M24",para:24,name:"ابَّا (أحمذ)",g:"M",father:"M23",mother:"F136d1",place:"تنيخلف",spouses:["M24w1"]},
{id:"M23s1",name:"العادل",g:"M",father:"M23",mother:"F136d1",note:"لم يعقب"},
{id:"M52",para:52,name:"المختار",g:"M",father:"M23",mother:"F136d1",spouses:["M52w1","F132d2"]},
{id:"M23d2",name:"صفي",g:"F",father:"M23",mother:"F136d1",note:"لم تعقب"},
{id:"M23d3",name:"معلومه",g:"F",father:"M23",mother:"F136d1",note:"أم أبناء بنعمر بن محمذن -ادودنيقب-"},
{id:"M24w1",name:"عايشا",g:"F",father:"Z70",spouses:["M24"],fullName:"عايشا بنت الأمين بن حمم بن أبو الحس بن المزضف",mother:"Z70w3",note:"أم أبناء ايبّا (أحمذ) بن محمذن بن الأمين بن الفالي بن متيلي (المختار)"},
{id:"M25",para:25,name:"اگّي (الكوري)",g:"M",father:"M24",mother:"M24w1",dates:"1333هـ/1915م –",place:"تنيخلف",spouses:["M67d1"]},
{id:"M50",para:50,name:"محمذن",g:"M",father:"M24",mother:"M24w1",dates:"1342هـ/1924م –",spouses:["M50w1"]},
{id:"M51",para:51,name:"مولود",g:"M",father:"M24",mother:"M24w1",spouses:["M51w1"]},
{id:"M24d2",name:"مامنينه",g:"F",father:"M24",mother:"M24w1",note:"أم أبناء سيد بن أحمد بن سيد الفالي بن بنيوك؛ بنت ايبّا (أحمذ) بن محمذن بن الأمين بن الفالي بن متيلي — رابط بين الأسرتين" ,spouses:["K142","R43"]},
{id:"M24d3",name:"النصفي",g:"F",father:"M24",mother:"M24w1",place:"تنيخلف",note:"أم أبناء الربا (البرا) بن بگي — épouse de Y93",spouses:["Y93"]},
{id:"M26",para:26,name:"ببكر",g:"M",father:"M25",mother:"M67d1",dates:"1286هـ/1869م – 1364هـ/1945م",place:"لكوارب",spouses:["M26w1","M26w2","K119d7","I65d3"]},
{id:"M30",para:30,name:"اَّمم (محمذن)",g:"M",father:"M25",mother:"M67d1",dates:"1292هـ/1875م – 1378هـ/1959م",place:"تنيخلف",spouses:["R67d4"]},
{id:"M45",para:45,name:"محمّد",g:"M",father:"M25",mother:"M67d1",dates:"1300هـ/1883م –",place:"التاكانت",spouses:["M45w1","F32d2","M49w1"]},
{id:"M25d1",name:"احبيبه",g:"F",father:"M25",mother:"M67d1",dates:"1362هـ/1885م – 1363هـ/1944م",place:"محجوبو" ,spouses:["K120"]},
{id:"M25s1",name:"أحمّد",g:"M",father:"M25",mother:"M67d1",dates:"1365هـ/1888م – 1335هـ/1917م",note:"لم يعقب"},
{id:"M46",para:46,name:"المختار",g:"M",father:"M25",mother:"M67d1",dates:"1367هـ/1896م – 1348هـ/1936م",place:"أبير حيبلل",spouses:["M46w1"]},
{id:"M25d2",name:"ميمهنه",g:"F",father:"M25",mother:"M67d1",dates:"1319هـ/1901م – 1362هـ/1943م" ,spouses:["K114"]},
{id:"M26w1",name:"مريم",g:"F",father:"I65",spouses:["M26"],fullName:"مريم بنت ديدا (محمد فال) بن محمذن بن الفالي بن ابراهيم",mother:"I65w1",note:"أم فاطمو فال والزهراء من أبناء ببكر بن اكي (الكوري) بن ايبا (احمذ) بن محمذن بن الأمين بن الفالي بن متيلي — لم تعقبا"},
{id:"M26d1",name:"الزهراء",g:"F",father:"M26",mother:"M26w1",dates:"1328هـ/1916م – 1411هـ/1991م",place:"دليلحو",note:"لم تعقب"},
{id:"M26d2",name:"فاطمه فال",g:"F",father:"M26",mother:"M26w1",dates:"1322هـ/1914م – 1414هـ/1994م",place:"دليلحو",note:"لم تعقب"},
{id:"M26w2",name:"امينا",g:"F",father:"I65",mother:"I65w1",spouses:["M26"],fullName:"امينا بنت ديدا (محمد فال) بن محمذن بن الفالي بن ابراهيم"},
{id:"M27",para:27,name:"ديد",g:"M",father:"M26",mother:"K119d7",dates:"1346هـ/1922م – 1436هـ/2015م",place:"أبير حيبلل",spouses:["M27w1"]},
{id:"M26s1",name:"المختار",g:"M",father:"M26",mother:"K119d7",dates:"1353هـ/1934م –",note:"لم يعقب"},
{id:"M29",para:29,name:"يب (محمد باب)",g:"M",father:"M26",mother:"K119d7",dates:"1363هـ/1944م –",spouses:["M29w1"]},
{id:"M27w1",name:"لعزيبه",g:"F",father:"XA435",spouses:["M27"],ext:true},
{id:"M27d1",name:"احبيبه",g:"F",father:"M27",mother:"M27w1",dates:"1394هـ/1974م –"},
{id:"M28",para:28,name:"الكوري",g:"M",father:"M27",mother:"M27w1",dates:"1396هـ/1976م –",spouses:["M28w1","M28w2","M28w3"]},
{id:"M27d3",name:"خيبا (أم الخيري)",g:"F",father:"M27",mother:"M27w1",dates:"1399هـ/1979م –"},
{id:"M27d4",name:"عيشه",g:"F",father:"M27",mother:"M27w1",dates:"1402هـ/1982م –"},
{id:"M27s1",name:"ببكر",g:"M",father:"M27",mother:"M27w1",dates:"1404هـ/1984م –"},
{id:"M27d5",name:"ميمهنه",g:"F",father:"M27",mother:"M27w1",dates:"1406هـ/1986م –"},
{id:"M27d6",name:"حاجه",g:"F",father:"M27",mother:"M27w1",dates:"1408هـ/1988م –"},
{id:"M27s2",name:"محمذن",g:"M",father:"M27",mother:"M27w1",dates:"1411هـ/1991م –"},
{id:"M28w1",name:"فاطمة",g:"F",father:"XA436",spouses:["M28"],ext:true},
{id:"M28d1",name:"عايشا",g:"F",father:"M28",mother:"M28w1",dates:"1424هـ/2003م –"},
{id:"M28w2",name:"فاطمة السالمه",g:"F",father:"XA865",spouses:["M28"],ext:true},
{id:"M28s1",name:"ديد",g:"M",father:"M28",mother:"M28w2",dates:"1425هـ/2004م –"},
{id:"M28w3",name:"فاطمة",g:"F",father:"XA1072",spouses:["M28"],ext:true},
{id:"M28d2",name:"أم الخيري",g:"F",father:"M28",mother:"M28w3",dates:"1427هـ/2006م –"},
{id:"M28s2",name:"المختار",g:"M",father:"M28",mother:"M28w3",dates:"1436هـ/2015م –"},
{id:"M29w1",name:"آمنة",g:"F",father:"M62",mother:"M62w3",note:"بنت سيد أحمد بن الأمين بن عبد العزيز بن المختار بن محمذن بن الأمين بن الفالي بن متيلي — زواج داخلي بالأسرة",spouses:["M29"]},
{id:"M29d1",name:"خيبا",g:"F",father:"M29",mother:"M29w1",dates:"1425هـ/2004م –"},
{id:"M29d2",name:"عايشا",g:"F",father:"M29",mother:"M29w1",dates:"1427هـ/2006م –"},
{id:"M31",para:31,name:"محمد",g:"M",father:"M30",mother:"R67d4",dates:"1323هـ/1905م – 1413هـ/1993م",place:"تنيخلف",spouses:["M31w1"]},
{id:"M40",para:40,name:"الخليفه",g:"M",father:"M30",mother:"R67d4",dates:"1330هـ/1912م – 1406هـ/1986م",place:"أبير حيبلل",spouses:["M40w1"]},
{id:"M41",para:41,name:"بداه",g:"M",father:"M30",mother:"R67d4",dates:"1335هـ/1917م – 1424هـ/2003م",place:"أبير حيبلل",spouses:["M57d2"]},
{id:"M30d1",name:"عيشان",g:"F",father:"M30",mother:"R67d4",dates:"1341هـ/1923م – 1427هـ/2006م",place:"أبير حيبلل"},
{id:"M30d2",name:"طيما",g:"F",father:"M30",mother:"R67d4",dates:"1346هـ/1928م – 1422هـ/2001م",place:"أبير حيبلل",note:"أم أبناء محمد بن اسلم بن سيد الفالي بن محمذن بن عركاب (حمم) بن ابوبا (الأمين) بن ماهي — رابط بين الأسرتين",spouses:["P35"],crossLink:true},
{id:"M31w1",name:"تُّت (فاطمة السالمه)",g:"F",father:"F93",dates:"1337هـ/1919م – 1438هـ/2017م",place:"تنيخلف",spouses:["M31"],ext:true},
{id:"M32",para:32,name:"اَّكاه",g:"M",father:"M31",mother:"M31w1",dates:"1364هـ/1945م –",spouses:["M32w1","M32w2","M32w3","M32w4","M32w5","M32w6","M32w7","M32w8","I77d5","M32w10","M32w11","M32w12"]},
{id:"M34",para:34,name:"أحمد",g:"M",father:"M31",mother:"M31w1",dates:"1367هـ/1948م –",spouses:["M34w1"]},
{id:"M35",para:35,name:"محمدن",g:"M",father:"M31",mother:"M31w1",dates:"1368هـ/1949م –",spouses:["F7d1"]},
{id:"M37",para:37,name:"عبد الله",g:"M",father:"M31",mother:"M31w1",dates:"1376هـ/1957م –",spouses:["M37w1"]},
{id:"M38",para:38,name:"محمدي",g:"M",father:"M31",mother:"M33w1",dates:"1378هـ/1959م – 1422هـ/2001م",place:"تنيخلف",spouses:["M38w1","M38w2"]},
{id:"M31d1",name:"صفيه",g:"F",father:"M31",mother:"M31w1",dates:"1372هـ/1953م –"},
{id:"M32w1",name:"فاطمة",g:"F",father:"XA882",spouses:["M32"],ext:true},
{id:"M33",para:33,name:"اَّمم (ديد)",g:"M",father:"M32",mother:"M32w1",dates:"1393هـ/1973م –",spouses:["M33w1","M33w2"]},
{id:"M32w2",name:"عائشة -تندغو-",g:"F",father:null,spouses:["M32"]},
{id:"M32d1",name:"نوره",g:"F",father:"M32",mother:"M32w2",dates:"1396هـ/1976م –"},
{id:"M32w3",name:"أم النبي",g:"F",father:"P41",mother:"P41w1",note:"بنت السيد بن أسلم بن سيد الفالي بن محمذن بن عركاب (حمم) بن ابوبا (الأمين) بن ماهي — رابط بين الأسرتين",dates:"1373هـ/1954م –",spouses:["M32"],crossLink:true},
{id:"M32w4",name:"عيشه",g:"F",father:"XA444",spouses:["M32"],ext:true},
{id:"M32s12",name:"ادي",g:"M",father:"M32",mother:"M32w4",dates:"1399هـ/1979م –"},
{id:"M32w5",name:"آمنة",g:"F",father:"XA462",spouses:["M32"],ext:true},
{id:"M32d5",name:"توت",g:"F",father:"M32",mother:"M32w5",dates:"1406هـ/1986م –"},
{id:"M32w6",name:"الزهراء",g:"F",father:"XA446",spouses:["M32"],ext:true},
{id:"M32w7",name:"مامه",g:"F",father:"XA447",spouses:["M32"],ext:true},
{id:"M32w8",name:"زينب -الشرفو-",g:"F",father:null,spouses:["M32"]},
{id:"M32w10",name:"خداجه",g:"F",father:"I19",dates:"1386هـ/1966م –",spouses:["M32"],crossLink:true,fullName:"خداجه بنت أحمد سالم بن ابوبا (ببكر) بن المختار بن سيد أحمد بن حبلل بن ابراهيم",mother:"I19w2",note:"أم زينب من أبناء اكاه بن محمد بن امم بن اكي (الكوري) بن ايبا (احمذ) بن محمذن بن الأمين بن الفالي بن متيلي"},
{id:"M32w11",name:"امنيانه",g:"F",father:"G84s1",dates:"1393هـ/1973م –",spouses:["M32"]},
{id:"M32w12",name:"منت اباه (زينب)",g:"F",father:"Y18",dates:"1396هـ/1976م –",spouses:["M32"],crossLink:true,mother:"Y18w1",note:"أم بعض أبناء اكاه بن محمد بن أمّم (محمذن) بن اكي (الكوري) بن ايبا (احمذ) بن محمذن بن الأمين بن الفالي بن متيلي"},
{id:"M32s1",name:"أحمد",g:"M",father:"M32",mother:"M32w3",dates:"1398هـ/1978م –",place:"محجوبو",note:"مات صغيرًا"},
{id:"M32s2",name:"يعقوب",g:"M",father:"M32",mother:"M32w5",dates:"1402هـ/1982م –"},
{id:"M32s3",name:"عزيز",g:"M",father:"M32",mother:"M32w6",dates:"1404هـ/1984م –"},
{id:"M32s4",name:"محمد",g:"M",father:"M32",mother:"M32w7",dates:"1408هـ/1988م –"},
{id:"M32s5",name:"أحمّد",g:"M",father:"M32",mother:"M32w7",dates:"1409هـ/1989م –"},
{id:"M32s6",name:"التجاني",g:"M",father:"M32",mother:"M32w8",dates:"1411هـ/1991م –"},
{id:"M32s7",name:"صدام",g:"M",father:"M32",mother:"I77d5",dates:"1411هـ/1991م –"},
{id:"M32s8",name:"أحمد",g:"M",father:"M32",mother:"I77d5",dates:"1413هـ/1993م –"},
{id:"M32d2",name:"صفيه",g:"F",father:"M32",mother:"I77d5",dates:"1414هـ/1994م –"},
{id:"M32d3",name:"زينب",g:"F",father:"M32",mother:"M32w10",dates:"1421هـ/2000م –"},
{id:"M32s9",name:"المصطفى",g:"M",father:"M32",mother:"M32w11",dates:"1425هـ/2004م –"},
{id:"M32d4",name:"الساره (زينب)",g:"F",father:"M32",mother:"M32w12",dates:"1427هـ/2006م –"},
{id:"M32s10",name:"ابَّاه",g:"M",father:"M32",mother:"M32w12",dates:"1428هـ/2007م –"},
{id:"M32s11",name:"عبد الفتاح",g:"M",father:"M32",mother:"M32w12",dates:"1431هـ/2010م –"},
{id:"M33w1",name:"الَّـله",g:"F",father:null,spouses:["M33"]},
{id:"M33s1",name:"محمدي",g:"M",father:"M33"},
{id:"M33w2",name:"الرفعه",g:"F",father:"XA450",spouses:["M33"],ext:true},
{id:"M33d1",name:"توت (فاطمة)",g:"F",father:"M33",mother:"M33w2"},
{id:"M34w1",name:"عيشه",g:"F",father:"P26",mother:"K121d3",note:"بنت أحمد بن ابو (محمد) بن محمذن بن اَّمي محمد بن محمذن بن عركاب بن ابوبا (الأمين) بن ماهي، من زوجته الخيت — رابط بين الأسرتين",dates:"1374هـ/1955م –",spouses:["M34"],crossLink:true},
{id:"M34d1",name:"تنمّه",g:"F",father:"M34",mother:"M34w1",dates:"1396هـ/1976م –",note:"أم ازهور"},
{id:"M34s1",name:"محمد السالك",g:"M",father:"M34",mother:"M34w1",dates:"1401هـ/1981م –"},
{id:"M34s2",name:"اليماني",g:"M",father:"M34",mother:"M34w1",dates:"1405هـ/1985م –"},
{id:"M34d2",name:"منت الحسن",g:"F",father:"M34",mother:"M34w1",dates:"1407هـ/1987م –"},
{id:"M34s3",name:"محمد فال",g:"M",father:"M34",mother:"M34w1",dates:"1414هـ/1994م –"},
{id:"M34s4",name:"محمدن (الميمون)",g:"M",father:"M34",mother:"M34w1",dates:"1416هـ/1996م –"},
{id:"M36",para:36,name:"يحي (أحمد)",g:"M",father:"M35",mother:"F7d1",dates:"1401هـ/1981م –",spouses:["M36w1"]},
{id:"M35s1",name:"حيدره",g:"M",father:"M35",mother:"F7d1",dates:"1404هـ/1984م –"},
{id:"M35d1",name:"انتصار",g:"F",father:"M35",mother:"F7d1",dates:"1411هـ/1991م –"},
{id:"M35s2",name:"محمد الأمين",g:"M",father:"M35",mother:"F7d1",dates:"1414هـ/1994م –"},
{id:"M36w1",name:"مريم السالمه",g:"F",father:"Z17",mother:"Z17w1",dates:"1408هـ/1988م –",spouses:["M36"]},
{id:"M36s1",name:"محمد سالم",g:"M",father:"M36",mother:"M36w1",dates:"1438هـ/2017م –"},
{id:"M37w1",name:"عائشة سيديب",g:"F",father:null,spouses:["M37"]},
{id:"M37d1",name:"اميه",g:"F",father:"M37",mother:"M37w1",dates:"1408هـ/1988م –"},
{id:"M37d2",name:"توت",g:"F",father:"M37",mother:"M37w1"},
{id:"M37d3",name:"ميمهنه",g:"F",father:"M37",mother:"M37w1"},
{id:"M37s1",name:"محمد يحي",g:"M",father:"M37",mother:"M37w1"},
{id:"M38w1",name:"الهلاليه",g:"F",father:"XA452",spouses:["M38"],ext:true},
{id:"M39",para:39,name:"يعقوب",g:"M",father:"M38",mother:"M38w1",dates:"1406هـ/1986م –",spouses:["M39w1"]},
{id:"M38w2",name:"مريم",g:"F",father:"K115",mother:"K115w1",note:"بنت أحمد بن ددّالي (محمد اليدالي) بن محمودن بن محمذن بن انداه (المختار) بن بنيوك (محمذن) بن المختار — رابط بين الأسرتين؛ بنت أحمد بن ددّالي بن محمودن بن محمذن بن انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",dates:"1403هـ/1983م –",spouses:["M38","V31b"],crossLink:true},
{id:"M38d1",name:"توت",g:"F",father:"M38",mother:"M38w2",dates:"1401هـ/2001م –"},
{id:"M39w1",name:"بات",g:"F",father:"D47",mother:"D47w1",spouses:["M39"]},
{id:"M39s1",name:"محمدي",g:"M",father:"M39",mother:"M39w1"},
{id:"M40w1",name:"احبيبه",g:"F",father:"K114",mother:"M25d2",note:"بنت ددّالي (محمد اليدالي) بن محمودن بن محمذن بن انداه (المختار) بن بنيوك (محمذن) بن المختار — رابط بين الأسرتين",dates:"1343هـ/1925م – 1412هـ/1992م",place:"أبير حيبلل",spouses:["M40","K129"],crossLink:true},
{id:"M40d1",name:"ميّم",g:"F",father:"M40",mother:"M40w1",dates:"1367هـ/1948م –",note:"أم الخيت من أبناء حمني بن الصالح بن محمد بن بكاك بن الجمد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين؛ زواج داخلي بالأسرة (متيلي)",fullName:"ميَّم بنت الخليفه بن اَّمم (محمذن) بن اگّي (الكوري) بن ايْـبَّا (احمذ) بن محمذن بن الأمين بن الفالي بن متيلي",spouses:["Y46"]},
{id:"M40d2",name:"النون",g:"F",father:"M40",mother:"M40w1"},
{id:"M42",para:42,name:"أحمّد",g:"M",father:"M41",mother:"M57d2",dates:"1378هـ/1959م –",spouses:["M42w1"]},
{id:"M43",para:43,name:"اَّمم",g:"M",father:"M41",mother:"M57d2",dates:"1381هـ/1962م –",spouses:["E7d1"]},
{id:"M44",para:44,name:"محمد المختار",g:"M",father:"M41",mother:"M57d2",dates:"1386هـ/1966م –",spouses:["M44w1"]},
{id:"M42w1",name:"فاطمة",g:"F",father:"XA454",spouses:["M42"],ext:true},
{id:"M42s1",name:"محمد",g:"M",father:"M42",mother:"M42w1",dates:"1415هـ/1995م –"},
{id:"M42s2",name:"الخليل (بداه)",g:"M",father:"M42",mother:"M42w1",dates:"1418هـ/1997م –"},
{id:"M42s3",name:"اسماعيل",g:"M",father:"M42",mother:"M42w1",dates:"1422هـ/2001م –"},
{id:"M43s1",name:"بداه",g:"M",father:"M43",mother:"E7d1",dates:"1424هـ/2003م –"},
{id:"M43s2",name:"ببكر",g:"M",father:"M43",mother:"E7d1",dates:"1425هـ/2004م –"},
{id:"M43s3",name:"محمد",g:"M",father:"M43",mother:"E7d1",dates:"1428هـ/2007م –"},
{id:"M44w1",name:"ببها",g:"F",father:"XA1142",spouses:["M44"],ext:true},
{id:"M44s1",name:"بداه",g:"M",father:"M44",mother:"M44w1",dates:"1425هـ/2004م –"},
{id:"M44s2",name:"محمد",g:"M",father:"M44",mother:"M44w1",dates:"1427هـ/2006م –"},
{id:"M44s3",name:"عزيز",g:"M",father:"M44",mother:"M44w1",dates:"1428هـ/2007م –"},
{id:"M44s4",name:"عبد الله",g:"M",father:"M44",mother:"M44w1",dates:"1436هـ/2015م –"},
{id:"M45w1",name:"ميمهنه",g:"F",father:"XA1146",spouses:["M45"],ext:true},
{id:"M45s1",name:"محمد",g:"M",father:"M45",mother:"M45w1",note:"لم يعقب"},
{id:"M45s2",name:"الكوري",g:"M",father:"M45",mother:"F32d2",note:"لم يعقب"},
{id:"M46w1",name:"فاطمة",g:"F",father:"K119",mother:"K119w1",note:"بنت المختار الكوري بن محمذن بن انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",place:"تينشيكل",spouses:["M46"],crossLink:true},
{id:"M47",para:47,name:"دَّالم",g:"M",father:"M46",mother:"M46w1",dates:"1341هـ/1923م – 1396هـ/1976م",place:"كيص (سنغال)",spouses:["M47w1","M47w2"]},
{id:"M47w1",name:"ميّم (مريم)",g:"F",father:"M26",mother:"M26w2",note:"بنت ببكر بن اگّي (الكوري) بن ابَّا (أحمذ) بن محمذن بن الأمين بن الفالي بن متيلي — زواج داخلي بالأسرة",dates:"1335هـ/1917م – 1429هـ/2008م",place:"دليلحو",spouses:["M47"]},
{id:"M47d1",name:"أمين",g:"F",father:"M47",mother:"M47w1",dates:"1381هـ/1962م –"},
{id:"M47w2",name:"فاطمة",g:"F",father:"P26",mother:"K121d3",note:"بنت أحمد بن ابو (محمد) بن محمذن بن اَّمي محمد بن محمذن بن عركاب بن ابوبا (الأمين) بن ماهي — رابط بين الأسرتين",dates:"1362هـ/1943م –",spouses:["M47"],crossLink:true},
{id:"M48",para:48,name:"الشيخ أحمّد",g:"M",father:"M47",mother:"M47w2",dates:"1386هـ/1996م –",spouses:["F72d2"]},
{id:"M47d2",name:"منت الهادي (السالمه)",g:"F",father:"M47",mother:"M47w2",dates:"1386هـ/1969م –"},
{id:"M47d3",name:"أُمه (ميمونه)",g:"F",father:"M47",mother:"M47w2",dates:"1393هـ/1973م –"},
{id:"M48d1",name:"الخيت",g:"F",father:"M48",mother:"F72d2",dates:"1436هـ/2015م –"},
{id:"M49w1",name:"مريم",g:"F",father:"K110",mother:"K110w1",note:"بنت محمودن بن محمذن بن انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",place:"الصدريات الخظر",spouses:["M45","M49"],crossLink:true},
{id:"M49d1",name:"عايشا",g:"F",father:"M49",mother:"M49w1",note:"أم أبناء الداه بن محمد فال بن الغوث بن محمد بن المعزوز بن احبيت بن حبلل بن حبيين بن حمد اكذا المختار"},
{id:"M50w1",name:"الما",g:"F",father:"Y84",place:"تنيخلف",spouses:["M50"]},
{id:"M56d1",name:"الد (خديجة)",g:"F",father:"M50",mother:"M50w1",dates:"1396هـ/1976م –",place:"أبير حيبلل",note:"أم مريم من أبناء بداه (أحمذ) بن محمذن بن أحمد فال بن الفالي بن المبارك بن اما (الماقور)؛ رابط بين الأسرتين",spouses:["F37"],fullName:"اد (خديجة) بنت محمذن بن ايبّا (أحمذ) بن محمذن بن الأمين بن الفالي بن متيلي"},
{id:"M56d3",name:"امباركه",g:"F",father:"M50",mother:"M50w1",dates:"1397هـ/1977م –",place:"أبير حيبلل",note:"أم سيد أحمد واكرامو ابني الأمين بن عبد العزيز بن المختار بن محمذن بن الأمين بن الفالي بن متيلي"},
{id:"M56d4",name:"صفي",g:"F",father:"M50",mother:"M50w1",note:"لم تعقب"},
{id:"M56d5",name:"لـم",g:"F",father:"M50",mother:"M50w1",dates:"1394هـ/1974م –",place:"أبير حيبلل",note:"أم أبناء المختار السالم بن عبد العزيز بن المختار بن محمذن بن الأمين بن الفالي بن متيلي",spouses:["M57"]},
{id:"M56d6",name:"منت الخير",g:"F",father:"M50",mother:"M50w1",dates:"1394هـ/1974م –",note:"لم تعقب"},
{id:"M51w1",name:"مريم",g:"F",father:"Z99",spouses:["M51","Z50"],fullName:"مريم بنت محمذن بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"M51s1",name:"أحمّد سالم",g:"M",father:"M51",mother:"M51w1",note:"لم يعقب"},
{id:"M52w1",name:"مريم",g:"F",father:"K86",mother:"F135d1",note:"بنت انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",spouses:["M52","R14"],crossLink:true},
{id:"M53",para:53,name:"عبد العزيز",g:"M",father:"M52",mother:"M52w1",dates:"1325هـ/1907م –",place:"أبير حيبلل",spouses:["M53w1"]},
{id:"M67",para:67,name:"دَّالم (محمد فال)",g:"M",father:"M52",mother:"F132d2",dates:"1333هـ/1915م –",place:"أبير حيبلل",spouses:["M67w1"]},
{id:"M52d3",name:"فاطمة",g:"F",father:"M52",mother:"F132d2",note:"أم أبناء الحسن بن خيليد بن محمذن بن الماح"},
{id:"M53w1",name:"الصغرى",g:"F",father:"M24",mother:"M24w1",note:"بنت ابَّا (أحمذ) بن محمذن بن الأمين بن الفالي بن متيلي — زواج داخلي بالأسرة",spouses:["M53"]},
{id:"M54",para:54,name:"محمد سالم",g:"M",father:"M53",mother:"M53w1",dates:"1380هـ/1961م –",place:"تنيخلف",spouses:["R30d1","M54w2"]},
{id:"M57",para:57,name:"المختار السالم",g:"M",father:"M53",mother:"M53w1",dates:"1352هـ/1933م –",place:"تنيخلف",spouses:["M57w1","M56d5"]},
{id:"M61",para:61,name:"الأمين",g:"M",father:"M53",mother:"M53w1",dates:"1360هـ/1941م –",place:"حاس لمرابط",spouses:["M61w1"]},
{id:"M55",para:55,name:"الداوي",g:"M",father:"M54",mother:"R30d1",dates:"1357هـ/1938م –",spouses:["M55w1"]},
{id:"M54w2",name:"هيته (الخيت)",g:"F",father:"Y36",dates:"1335هـ/1917م – 1421هـ/2000م",place:"أبير حيبلل",spouses:["M54"],mother:"Y34d1",note:"أم مريم السالمه من أبناء محمد سالم بن عبد العزيز بن المختار بن محمذن بن الأمين بن الفالي بن متيلي (المختار)"},
{id:"M54d1",name:"مريم السالو",g:"F",father:"M54",mother:"M54w2",dates:"1375هـ/1956م –"},
{id:"M55w1",name:"عائشة",g:"F",father:"M58",mother:"M58w1",note:"بنت محمد بن المختار السالم بن عبد العزيز بن المختار بن محمذن بن الأمين بن الفالي بن متيلي — زواج داخلي بالأسرة",dates:"1375هـ/1956م –",spouses:["M55"]},
{id:"M56",para:56,name:"محمد",g:"M",father:"M55",mother:"M55w1",dates:"1403هـ/1983م –",spouses:["M56w1"]},
{id:"M55d1",name:"نعيمه (منصوره)",g:"F",father:"M55",mother:"M55w1",dates:"1401هـ/1981م –"},
{id:"M55d2",name:"أم الخيري",g:"F",father:"M55",mother:"M55w1",dates:"1405هـ/1985م –"},
{id:"M55d3",name:"فضيله",g:"F",father:"M55",mother:"M55w1",dates:"1407هـ/1987م –"},
{id:"M56w1",name:"حتيه",g:"F",father:"R9",mother:"R9w1",dates:"1407هـ/1987م –",spouses:["M56"],fullName:"حتيه بنت ابن بن محمدن بن الهلال بن محمذن بن يبالل بن باب أحنيد بن أحمد زروق"},
{id:"M56d7",name:"حماس (عائشة)",g:"F",father:"M56",mother:"M56w1",dates:"1429هـ/2008م –"},
{id:"M56d8",name:"اَّمي",g:"F",father:"M56",mother:"M56w1"},
{id:"M56s1",name:"صالح",g:"M",father:"M56",mother:"M56w1"},
{id:"M57w1",name:"مل",g:"F",father:"M24",mother:"M24w1",note:"بنت ابَّا (أحمذ) بن محمذن بن الأمين بن الفالي بن متيلي — زواج داخلي بالأسرة",dates:"1394هـ/1974م –",place:"أبير حيبلل",spouses:["M57"]},
{id:"M57d3",name:"ميمهنه",g:"F",father:"M57",mother:"M57w1",dates:"1336هـ/1918م – 1406هـ/1986م",note:"أم عيشو وميام من بنات مدال بن أحمد بن سيد الفالي بن الإمام أحمد بن محمذن بن الأمين عمي"},
{id:"M58",para:58,name:"محمد",g:"M",father:"M57",mother:"M57w1",dates:"1338هـ/1920م – 1426هـ/2005م",place:"تنيخلف",spouses:["M58w1"]},
{id:"M57d1",name:"بنت وهب",g:"F",father:"M57",mother:"M57w1",dates:"1348هـ/1930م – 1404هـ/1984م",place:"محجوبو",note:"لم تعقب"},
{id:"M57d2",name:"الزهراء",g:"F",father:"M57",mother:"M57w1",dates:"1354هـ/1935م – 1422هـ/2001م",place:"أبير حيبلل" ,spouses:["M41"]},
{id:"M58w1",name:"احبيبه",g:"F",father:"M26",mother:"K119d7",note:"بنت ببكر بن اگّي (الكوري) بن ابَّا (أحمذ) بن محمذن بن الأمين بن الفالي بن متيلي — زواج داخلي بالأسرة",dates:"1354هـ/1935م – 1424هـ/2003م",place:"تنيخلف",spouses:["M58"]},
{id:"M58s1",name:"أحمد",g:"M",father:"M58",mother:"M58w1",dates:"1378هـ/1959م – 1394هـ/1974م",note:"لم يعقب"},
{id:"M59",para:59,name:"ببكر",g:"M",father:"M58",mother:"M58w1",dates:"1380هـ/1961م –",spouses:["M59w1"]},
{id:"M60",para:60,name:"محمدن",g:"M",father:"M58",mother:"M58w1",dates:"1384هـ/1926م –",spouses:["M60w1","Y104d2"]},
{id:"M58s2",name:"الشيخ",g:"M",father:"M58",mother:"M58w1",dates:"1386هـ/1969م –"},
{id:"M58d2",name:"مريم",g:"F",father:"M58",mother:"M58w1",dates:"1381هـ/1962م –"},
{id:"M59w1",name:"خدي",g:"F",father:"XA1150",dates:"1396هـ/1976م –",spouses:["M59"]},
{id:"M59d1",name:"عيشه",g:"F",father:"M59",mother:"M59w1",dates:"1415هـ/1995م –"},
{id:"M59d2",name:"فاطمة",g:"F",father:"M59",mother:"M59w1",dates:"1418هـ/1997م –"},
{id:"M59s1",name:"محمد",g:"M",father:"M59",mother:"M59w1",dates:"1421هـ/2000م –"},
{id:"M59d3",name:"احبيبه",g:"F",father:"M59",mother:"M59w1",dates:"1424هـ/2003م –"},
{id:"M59s2",name:"الشيخ",g:"M",father:"M59",mother:"M59w1",dates:"1428هـ/2007م –"},
{id:"M60w1",name:"تُّت",g:"F",father:"Y94s1",dates:"1403هـ/1983م –",spouses:["M60"]},
{id:"M60s1",name:"ابَّاه",g:"M",father:"M60",mother:"M60w1",dates:"1423هـ/2002م –"},
{id:"M60s2",name:"اَّمح (محمد)",g:"M",father:"M60",mother:"M60w1",dates:"1425هـ/2004م –"},
{id:"M60s3",name:"ديد",g:"M",father:"M60",mother:"M60w1",dates:"1427هـ/2006م –"},
{id:"M60s4",name:"فاضل",g:"M",father:"M60",mother:"M60w1",dates:"1429هـ/2008م –"},
{id:"M61w1",name:"امباركه",g:"F",father:"M23",mother:"F136d1",note:"بنت محمذن بن ابَّا (أحمذ) بن محمذن بن الأمين بن الفالي بن متيلي — زواج داخلي بالأسرة",dates:"1397هـ/1977م –",place:"أبير حيبلل",spouses:["M61"]},
{id:"M62",para:62,name:"سيد أحمد",g:"M",father:"M61",mother:"M61w1",dates:"1333هـ/1915م –",spouses:["M62w1","M62w2","M62w3"]},
{id:"M62w1",name:"فاله",g:"F",father:"XA461",spouses:["M62"],ext:true},
{id:"M63",para:63,name:"الخليفه",g:"M",father:"M62",mother:"M62w1",dates:"1363هـ/1944م –",spouses:["M63w1","M63w2","M63w3"]},
{id:"M62w2",name:"مريم",g:"F",father:"XA463",dates:"1331هـ/1913م – 1431هـ/2010م",spouses:["M62"],ext:true},
{id:"M62d1",name:"والنون",g:"F",father:"M62",mother:"M62w2",note:"أم صغار أبناء الب بن أحمدناه بن سيد بن أحمد بن سيد الفالي" ,spouses:["K144"]},
{id:"M62w3",name:"فاطمة",g:"F",father:"XA503",spouses:["M62"],ext:true},
{id:"M62s1",name:"الشيخ",g:"M",father:"M62",mother:"M62w3",note:"لم يعقب"},
{id:"M65",para:65,name:"محمد",g:"M",father:"M62",mother:"M62w3",spouses:["M65w1"]},
{id:"M66",para:66,name:"ناصر الدين",g:"M",father:"M62",mother:"M62w3",dates:"1388هـ/1968م –",spouses:["M66w1"]},
{id:"M62d2",name:"باكه",g:"F",father:"M62",mother:"M62w3"},
{id:"M62d3",name:"خديجة",g:"F",father:"M62",mother:"M62w3"},
{id:"M62d4",name:"سكينه",g:"F",father:"M62",mother:"M62w3"},
{id:"M63w1",name:"فلانة -لغلال-",g:"F",father:null,spouses:["M63"]},
{id:"M64",para:64,name:"عبد العزيز",g:"M",father:"M63",mother:"M63w1",dates:"1395هـ/1975م –",spouses:["M64w1"]},
{id:"M63w2",name:"فلانة -أولاد أحمد-",g:"F",father:null,spouses:["M63"]},
{id:"M63s1",name:"محمد محمود",g:"M",father:"M63",mother:"M63w2",dates:"1403هـ/1983م –"},
{id:"M63w3",name:"فلانة",g:"F",father:null,spouses:["M63"]},
{id:"M63d1",name:"باكه",g:"F",father:"M63",mother:"M63w3",dates:"1416هـ/1996م –"},
{id:"M63d2",name:"مريم",g:"F",father:"M63",mother:"M63w3",dates:"1419هـ/1999م –"},
{id:"M64w1",name:"فلانة -تاكنانت-",g:"F",father:null,spouses:["M64"]},
{id:"M64d1",name:"زينب",g:"F",father:"M64",mother:"M64w1",dates:"1428هـ/2007م –"},
{id:"M65w1",name:"الكهله",g:"F",father:"XA464",spouses:["M65"],ext:true},
{id:"M65s1",name:"المختار",g:"M",father:"M65",mother:"M65w1"},
{id:"M65s2",name:"افّك",g:"M",father:"M65",mother:"M65w1"},
{id:"M65s3",name:"باب",g:"M",father:"M65",mother:"M65w1"},
{id:"M66w1",name:"الكهله",g:"F",father:"XA465",spouses:["M66"],ext:true},
{id:"M66s1",name:"الشيخ",g:"M",father:"M66",mother:"M66w1"},
{id:"M66d1",name:"الزهره",g:"F",father:"M66",mother:"M66w1"},
{id:"M66s2",name:"مان (تُّ)",g:"M",father:"M66",mother:"M66w1"},
{id:"M67w1",name:"عايشا",g:"F",father:"K87",mother:"Z73w2",note:"بنت أحمّد (اَّدد) بن انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",spouses:["M67"],crossLink:true},
{id:"M67d1",name:"ميّم (مريم)",g:"F",father:"M67",mother:"M67w1",note:"أم أبناء اگّي (الكوري) بن أحمذ بن محمذن بن الأمين بن الفالي بن متيلي؛ بنت دَّالم (محمد فال) بن المختار بن محمذن بن الأمين بن الفالي بن متيلي — زواج داخلي بالأسرة",spouses:["M25"]},
{id:"N1",para:1,name:"محمذن",g:"M",father:"XA434",
    note: "بن عبدالله بن اعمر — أسرة حليفة (غير سليلة من سيد الفالي بالنسب)",
    spouses:["N1w1"],ext:true},
{id:"N1w1",name:"فاطمه فال",g:"F",father:"K10",mother:"K10w1",note:"بنت عبد الله بن أحمد انهكر بن محمد الكريم — رابط بالمصاهرة",spouses:["N1"],crossLink:true},
{id:"N1s1",name:"ابَّا",g:"M",father:"N1",mother:"N1w1",note:"لم يعقب",ext:true},
{id:"N2",para:2,name:"ببّاه (سيد الفالي)",g:"M",father:"N1",mother:"N1w1",spouses:["N2w1"],ext:true},
{id:"N16",para:16,name:"المختار",g:"M",father:"N1",mother:"N1w1",spouses:["N16w1"],ext:true},
{id:"N17",para:17,name:"الأمين",g:"M",father:"N1",mother:"N1w1",spouses:["N17w1","N17w2"],ext:true},
{id:"N2w1",name:"ميمهنه",g:"F",father:"XA468",spouses:["N2"],ext:true},
{id:"N2s1",name:"أحمد",g:"M",father:"N2",mother:"N2w1",note:"لم يعقب",ext:true},
{id:"N3",para:3,name:"أحمد سالم",g:"M",father:"N2",mother:"N2w1",spouses:["N3w1"],ext:true},
{id:"N4",para:4,name:"محمدن",g:"M",father:"N2",mother:"N2w1",spouses:["N4w1"],ext:true},
{id:"N15",para:15,name:"محمذن",g:"M",father:"N2",mother:"N2w1",spouses:["N15w1"],ext:true},
{id:"N2d1",name:"أم المؤمنين",g:"F",father:"N2",mother:"N2w1",note:"لم تعقب",ext:true},
{id:"N2d2",name:"امات",g:"F",father:"N2",mother:"N2w1",note:"لم تعقب",ext:true},
{id:"N2d3",name:"توت",g:"F",father:"N2",mother:"N2w1",note:"لم تعقب",ext:true},
{id:"N3w1",name:"فلانة",g:"F",father:"XA387",spouses:["N3"],ext:true},
{id:"N3s1",name:"أحمد",g:"M",father:"N3",mother:"N3w1",ext:true},
{id:"N3s2",name:"محمد المامي",g:"M",father:"N3",mother:"N3w1",ext:true},
{id:"N3s3",name:"محمد عبد الله",g:"M",father:"N3",mother:"N3w1",ext:true},
{id:"N4w1",name:"صفيه",g:"F",father:"K48",mother:"R67d3",note:"بنت عبد السلام بن المختار بن أحمد انهكر بن محمد الكريم — رابط بالمصاهرة",place:"لكصر (انواكشوط)",spouses:["N4"],crossLink:true},
{id:"N5",para:5,name:"ابن",g:"M",father:"N4",mother:"N4w1",place:"أبير حيبلل",spouses:["N5w1"],ext:true},
{id:"N7",para:7,name:"سيد",g:"M",father:"N4",mother:"N4w1",place:"أبير حيبلل",spouses:["N7w1"],ext:true},
{id:"N9",para:9,name:"محمد الكريم",g:"M",father:"N4",mother:"N4w1",place:"لميلحو",spouses:["N9w1","N9w2"],ext:true},
{id:"N5w1",name:"فطمة",g:"F",father:"J35",place:"حسي السعاده",spouses:["N5"],fullName:"فطمة بنت محادن بن محمد بن محمذن بن أحمد البزي بن آجل (الفالي)"},
{id:"N5d1",name:"تسلم",g:"F",father:"N5",mother:"N5w1",dates:"1375هـ/1956م –",ext:true},
{id:"N6",para:6,name:"ينجح",g:"M",father:"N5",mother:"N5w1",dates:"1378هـ/1959م –",spouses:["N6w1"],ext:true},
{id:"N6w1",name:"توت",g:"F",father:null,spouses:["N6"],fullName:"توت بنت الحافظ",ext:true,note:"نسبها غير مؤكد — رُبطت خطأً بابنها الحافظ"},
{id:"N6s1",name:"ابن",g:"M",father:"N6",mother:"N6w1",ext:true},
{id:"N6s2",name:"الحافظ",g:"M",father:"N6",mother:"N6w1",ext:true},
{id:"N7w1",name:"الزهراء",g:"F",father:"F37",mother:"F37w1",dates:"1294هـ/1917م –",place:"أبير حيبلل",spouses:["N7"],crossLink:true},
{id:"N7d1",name:"نبغوها",g:"F",father:"N7",mother:"N7w1",note:"لم تعقب",ext:true},
{id:"N7d2",name:"اَّمم (السالمه)",g:"F",father:"N7",mother:"N7w1",dates:"1365هـ/1946م –",ext:true,fullName:"الما (السالمه) بنت سيد بن محمدن بن بباه (سيد الفالي)",spouses:["P26"]},
{id:"N7d3",name:"ما غيرت (خديجة)",g:"F",father:"N7",mother:"N7w1",dates:"1959م – 1976م",ext:true},
{id:"N7d4",name:"خيرا",g:"F",father:"N7",mother:"N7w1",dates:"1373هـ/1954م –",ext:true},
{id:"N8",para:8,name:"المفضل",g:"M",father:"N7",mother:"N7w1",dates:"1376هـ/1957م –",spouses:["N8w1","N8w2","N8w3"],ext:true},
{id:"N7d5",name:"صفيّه",g:"F",father:"N7",mother:"N7w1",dates:"1379هـ/1969م –",ext:true},
{id:"N7s1",name:"فالن",g:"M",father:"N7",mother:"N7w1",note:"مات صغيرًا",ext:true},
{id:"N8w1",name:"زيب",g:"F",father:"XA323",spouses:["N8"],ext:true},
{id:"N8d1",name:"فائزه",g:"F",father:"N8",mother:"N8w1",ext:true},
{id:"N8d2",name:"عزيزه",g:"F",father:"N8",mother:"N8w1",ext:true},
{id:"N8s1",name:"الحسن",g:"M",father:"N8",mother:"N8w1",ext:true},
{id:"N8w2",name:"ينصرها",g:"F",father:"XA1154",spouses:["N8"],ext:true},
{id:"N8s2",name:"محمد المختار",g:"M",father:"N8",mother:"N8w2",ext:true},
{id:"N8w3",name:"ماهي",g:"F",father:"K46",mother:"K46w1",note:"بنت ابامين (لمرابط) بن عبد السلام بن ابامين (الأمين) بن المختار بن أحمد انهكر بن محمد الكريم — رابط بالمصاهرة",spouses:["N8"],crossLink:true ,dates:"1396هـ/1976م –"},
{id:"N8d4",name:"بنغوها",g:"F",father:"N8",mother:"N8w3",ext:true},
{id:"N8s3",name:"ابامين",g:"M",father:"N8",mother:"N8w3",ext:true},
{id:"N8s4",name:"سيد",g:"M",father:"N8",mother:"N8w3",ext:true},
{id:"N8s5",name:"أحمد",g:"M",father:"N8",mother:"N8w3",ext:true},
{id:"N8d5",name:"خديجة",g:"F",father:"N8",mother:"N8w3",ext:true},
{id:"N9w1",name:"ابيبه",g:"F",father:null,spouses:["N9"]},
{id:"N10",para:10,name:"عبد الله",g:"M",father:"N9",mother:"N9w1",spouses:["N10w1"],ext:true},
{id:"N9d1",name:"عائشة",g:"F",father:"N9",mother:"N9w1",ext:true},
{id:"N9w2",name:"توت",g:"F",father:"P1s2",spouses:["N9"],fullName:"توت بنت المختار أم بن ماهِ بن البيتوره (زين العابدين) بن أحممد بن عبدلل بن اعمر"},
{id:"N13",para:13,name:"محمدن",g:"M",father:"N9",mother:"N9w2",spouses:["N13w1"],ext:true},
{id:"N14",para:14,name:"ابوبكر",g:"M",father:"N9",mother:"N9w2",spouses:["N14w1"],ext:true},
{id:"N9s1",name:"عمر",g:"M",father:"N9",mother:"N9w2",ext:true},
{id:"N9s2",name:"عثمان",g:"M",father:"N9",mother:"N9w2",ext:true},
{id:"N9d2",name:"علي (صفيّه)",g:"F",father:"N9",mother:"N9w2",ext:true},
{id:"N12",para:12,name:"التجاني",g:"M",father:"N9",mother:"N9w1",dates:"1365هـ/1946م –",spouses:["N12w1"],ext:true},
{id:"N10w1",name:"علي",g:"F",father:"XA1157",spouses:["N10"]},
{id:"N10s1",name:"اباه",g:"M",father:"N10",mother:"N10w1",ext:true},
{id:"N11",para:11,name:"محمد المامي",g:"M",father:"N10",mother:"N10w1",spouses:["N11w1"],ext:true},
{id:"N10s2",name:"التجاني",g:"M",father:"N10",mother:"N10w1",ext:true},
{id:"N10d1",name:"مريم",g:"F",father:"N10",mother:"N10w1",ext:true},
{id:"N10d2",name:"عليّه",g:"F",father:"N10",mother:"N10w1",ext:true},
{id:"N11w1",name:"عيشه",g:"F",father:"N8",mother:"N8w2",note:"بنت المفضل بن سيد بن محمدن بن ببّاه (سيد الفالي) بن محمذن بن باني — زواج داخلي بالأسرة",spouses:["N11"],ext:true},
{id:"N11s1",name:"محمد الكريم",g:"M",father:"N11",mother:"N11w1",ext:true},
{id:"N12w1",name:"مريم بنك",g:"F",father:null,spouses:["N12"]},
{id:"N12s1",name:"أحمد",g:"M",father:"N12",mother:"N12w1",ext:true},
{id:"N12s2",name:"سيد محمد",g:"M",father:"N12",mother:"N12w1",ext:true},
{id:"N12d1",name:"آمنة",g:"F",father:"N12",mother:"N12w1",ext:true},
{id:"N12d2",name:"سلمه",g:"F",father:"N12",mother:"N12w1",ext:true},
{id:"N12d3",name:"فائزه",g:"F",father:"N12",mother:"N12w1",ext:true},
{id:"N13w1",name:"فلانة",g:"F",father:"XA503",spouses:["N13"],ext:true},
{id:"N13s1",name:"أحمد",g:"M",father:"N13",mother:"N13w1",ext:true},
{id:"N13d1",name:"توت",g:"F",father:"N13",mother:"N13w1",ext:true},
{id:"N13d2",name:"فتاة",g:"F",father:"N13",mother:"N13w1",ext:true},
{id:"N14w1",name:"فلانة",g:"F",father:null,spouses:["N14"]},
{id:"N14s1",name:"فالن",g:"M",father:"N14",mother:"N14w1",ext:true},
{id:"N15w1",name:"شت",g:"F",father:"XA1161",spouses:["N15"],ext:true},
{id:"N15s1",name:"محمد محمود",g:"M",father:"N15",mother:"N15w1",ext:true},
{id:"N16w1",name:"فطمة",g:"F",father:"XA474",spouses:["N16"],ext:true},
{id:"N16s1",name:"فالن",g:"M",father:"N16",mother:"N16w1",ext:true},
{id:"N17w1",name:"شربظ",g:"F",father:"K68",mother:"K68w1",note:"بنت المختار بن خير الورى بن سيد عبد الله بن محمد الكريم — رابط بالمصاهرة",spouses:["N17"],crossLink:true},
{id:"N17d1",name:"عاشا",g:"F",father:"N17",mother:"N17w1",ext:true},
{id:"N17w2",name:"فلانة",g:"F",father:null,spouses:["N17"]},
{id:"N17d2",name:"خديجة",g:"F",father:"N17",mother:"N17w2",ext:true},
{id:"H1",para:1,name:"حبلل اسليطين",g:"M",father:null,
    note: "بن سيد أحمد بن سيد المختار بن أحمد بن محمد بن هكار (ذو العباءة) — أسرة حليفة",
    spouses:["H1w1"],tribe:"أتواجني"},
{id:"H1w1",name:"مريم",g:"F",father:"XA1163",spouses:["H1"],note:"الجد المذكور في السلسلة غير مسجل في الشجرة",ext:true},
{id:"H2",para:2,name:"أحممد",g:"M",father:"H1",mother:"H1w1",spouses:["M7d1"]},
{id:"H13",para:13,name:"البخاري",g:"M",father:"H1",mother:"H1w1",spouses:["H13w1"]},
{id:"H17",para:17,name:"المختار",g:"M",father:"H1",mother:"H1w1",spouses:["H17w1"]},
{id:"H1d1",name:"منت اعمر",g:"F",father:"H1",mother:"H1w1"},
{id:"H1d2",name:"فلانة",g:"F",father:"H1",mother:"H1w1"},
{id:"H3",para:3,name:"محمذن",g:"M",father:"H2",mother:"M7d1",spouses:["H3w1"]},
{id:"H2d1",name:"الجده",g:"F",father:"H2",mother:"M7d1"},
{id:"H2d2",name:"مريم",g:"F",father:"H2",mother:"M7d1"},
{id:"H3w1",name:"شربظ",g:"F",father:"I3",spouses:["H3"],crossLink:true,mother:"I3w4",note:"أم أبناء محمذن بن احممد بن حبلل اسليطين"},
{id:"H4",para:4,name:"أحمد سالم",g:"M",father:"H3",mother:"H3w1",spouses:["H4w1"]},
{id:"H7",para:7,name:"المختار السالم",g:"M",father:"H3",mother:"H3w1",spouses:["H7w1","E11d1"]},
{id:"H4w1",name:"مريم تنصر",g:"F",father:"M12",mother:"M12w1",note:"بنت محمذن بن المختار بن محمذن بن الغالي بن باركلل بن بوالماح بن متيلي — رابط بالمصاهرة",spouses:["H4"],crossLink:true},
{id:"H4s1",name:"أحمد",g:"M",father:"H4",mother:"H4w1",place:"محجوبو",note:"لم يعقب"},
{id:"H5",para:5,name:"محمذن",g:"M",father:"H4",mother:"H4w1",spouses:["H5w1"]},
{id:"H5w1",name:"الجده",g:"F",father:"Y130",spouses:["H5"],mother:"Y188d1",note:"أم عبد الله بن محمذن بن احمد سالم بن محمذن بن احممد بن حبلل اسليطين"},
{id:"H6",para:6,name:"عبد الله كوتو",g:"M",father:"H5",mother:"H5w1",spouses:["H6w1"]},
{id:"H6w1",name:"فلانة -سنغال-",g:"F",father:null,spouses:["H6"]},
{id:"H6s1",name:"اكاه",g:"M",father:"H6",mother:"H6w1"},
{id:"H6d1",name:"فلانة",g:"F",father:"H6",mother:"H6w1"},
{id:"H7w1",name:"اجنبابن (بنت وهب)",g:"F",father:"XA1169",spouses:["H7"],ext:true},
{id:"H8",para:8,name:"حمود",g:"M",father:"H7",mother:"H7w1",spouses:["H8w1","H8w2"]},
{id:"H10",para:10,name:"زياد",g:"M",father:"H7",mother:"H7w1",dates:"1312هـ/1895م –",place:"محجوبو",spouses:["H10w1","H10w2"]},
{id:"H7s1",name:"لبات",g:"M",father:"H7",mother:"H7w1",note:"لم يعقب"},
{id:"H7d1",name:"نبغوه",g:"F",father:"H7",mother:"E11d1"},
{id:"H8w1",name:"فطمة",g:"F",father:"K5",mother:"K5w1",note:"بنت أُم (أحمد) بن اَّكاه (ببكر) بن محمذن بن احجاب بن محمد الكريم — رابط بالمصاهرة",place:"تنيخلف",spouses:["H8"],crossLink:true},
{id:"H8d1",name:"َّامن",g:"F",father:"H8",mother:"H8w1",dates:"1354هـ/1935م –"},
{id:"H8w2",name:"ابنيّه",g:"F",father:"K124",mother:"K124w1",note:"بنت اتّو (الكوري) بن محمذن بن سيد الفالي بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بالمصاهرة",dates:"1324هـ/1907م – 1400هـ/1980م",place:"أبير حيبلل",spouses:["H8"],crossLink:true},
{id:"H9",para:9,name:"عبد الرحمن",g:"M",father:"H8",mother:"H8w2",dates:"1357هـ/1938م –",spouses:["R57d1"]},
{id:"H9d1",name:"منت الغزواني",g:"F",father:"H9",mother:"R57d1",dates:"1396هـ/1976م –"},
{id:"H9d2",name:"منت السالك",g:"F",father:"H9",mother:"R57d1",dates:"1401هـ/1981م –"},
{id:"H9s1",name:"المدير",g:"M",father:"H9",mother:"R57d1",dates:"1405هـ/1985م –"},
{id:"H10w1",name:"امنيانه",g:"F",father:"D23",spouses:["H10"],crossLink:true,fullName:"امنيانه بنت محمد بن محمذن (ولد سيدَّن) بن أحمذ بن ابييب بن يالليل بن أحموذيلل بن سيد (المختار) بن عبد الله",mother:"D23w1",note:"أم اكرامو من أبناء زياد بن المختار السالم بن محمذن بن احممد بن حبلل اسليطين"},
{id:"H10d1",name:"اكرامه",g:"F",father:"H10",mother:"H10w1",dates:"1357هـ/1938م –"},
{id:"H10w2",name:"فلانة -اجغماجك-",g:"F",father:null,spouses:["H10"]},
{id:"H11",para:11,name:"المختار السالم",g:"M",father:"H10",mother:"H10w2",dates:"1365هـ/1946م –",spouses:["H11w1"]},
{id:"H12",para:12,name:"عبد الفتاح",g:"M",father:"H10",mother:"H10w2",dates:"1368هـ/1949م –",spouses:["H12w1"]},
{id:"H11w1",name:"فلانة -؟-",g:"F",father:null,spouses:["H11"]},
{id:"H11s1",name:"فالن",g:"M",father:"H11",mother:"H11w1"},
{id:"H11d1",name:"فالن",g:"F",father:"H11",mother:"H11w1"},
{id:"H12w1",name:"فلانة -؟-",g:"F",father:null,spouses:["H12"]},
{id:"H12s1",name:"فالن",g:"M",father:"H12",mother:"H12w1"},
{id:"H12d1",name:"فالن",g:"F",father:"H12",mother:"H12w1"},
{id:"H13w1",name:"فلانة -؟-",g:"F",father:null,spouses:["H13"]},
{id:"H14",para:14,name:"أحمد سالم",g:"M",father:"H13",mother:"H13w1",spouses:["H14w1"]},
{id:"H13d2",name:"الزهراء",g:"F",father:"H13",mother:"H13w1"},
{id:"H14w1",name:"شام",g:"F",father:"XA481",spouses:["H14"],ext:true},
{id:"H15",para:15,name:"محمد",g:"M",father:"H14",mother:"H14w1",spouses:["H15w1"]},
{id:"H14s1",name:"أحمذ",g:"M",father:"H14",mother:"H14w1"},
{id:"H14d1",name:"مريم شار",g:"F",father:"H14",mother:"H14w1"},
{id:"H15w1",name:"فاطمه",g:"F",father:"XA1176",spouses:["H15"]},
{id:"H16",para:16,name:"أحمد سالم",g:"M",father:"H15",mother:"H15w1",spouses:["H16w1"]},
{id:"H15s1",name:"اداه",g:"M",father:"H15",mother:"H15w1"},
{id:"H16w1",name:"أم الخيري",g:"F",father:"XA1177",spouses:["H16"]},
{id:"H16d1",name:"منداها",g:"F",father:"H16",mother:"H16w1"},
{id:"H17w1",name:"غيده",g:"F",father:"XA1178",spouses:["H17"],ext:true},
{id:"H17d1",name:"ميه",g:"F",father:"H17",mother:"H17w1"},
{id:"W1",para:1,name:"محمد",g:"M",father:"XA387",
    note: "بن محمودن — أسرة حليفة",spouses:["W1w1"]},
{id:"W1w1",name:"عمرانه",g:"F",father:"D6",spouses:["W1"]},
{id:"W2",para:2,name:"أحمد يوره",g:"M",father:"W1",mother:"W1w1",spouses:["W2w1","E49d1"]},
{id:"W3",para:3,name:"المختار",g:"M",father:"W1",mother:"W1w1",spouses:["R18d2"]},
{id:"W5",para:5,name:"اَّمم (محمذن ميلود)",g:"M",father:"W1",mother:"W1w1",spouses:["W5w1","R14d3"]},
{id:"W1d1",name:"خديجة",g:"F",father:"W1",mother:"W1w1"},
{id:"W2w1",name:"افييت",g:"F",father:"E49",spouses:["W2"]},
{id:"W2d2",name:"الغاليه",g:"F",father:"W2",mother:"W2w1",place:"أبير حيبلل" ,spouses:["E47"] ,crossLink:true},
{id:"W2d3",name:"مريم",g:"F",father:"W2",mother:"W2w1",note:"لم تعقب"},
{id:"W4",para:4,name:"محمد",g:"M",father:"W3",mother:"R18d2",place:"أبير حيبلل",spouses:["W4w1"]},
{id:"W4w1",name:"عايشا",g:"F",father:"I54",place:"أبير حيبلل",spouses:["W4"],crossLink:true,mother:"I54w1",dates:"1318هـ/1900م – 1423هـ/2002م",note:"أم البتول بنت محمد بن المختار بن محمد بن عبد الله بن محمودن"},
{id:"W4d1",name:"البتول",g:"F",father:"W4",mother:"W4w1" ,spouses:["K144"]},
{id:"W5w1",name:"العاليه",g:"F",father:"Z73",mother:"Z73w1",place:"تنيخلف",spouses:["W5"],fullName:"العاليه بنت أحمد بن ابن عبدم بن عبد الله بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"W5d1",name:"خديجة",g:"F",father:"W5",mother:"W5w1"},
{id:"W6",para:6,name:"أحمد",g:"M",father:"W5",mother:"R14d3",place:"أبير حيبلل",spouses:["W6w1","W6w2"]},
{id:"W5s1",name:"المانه",g:"M",father:"W5",mother:"R14d3",note:"لم يعقب"},
{id:"W8",para:8,name:"محمد",g:"M",father:"W5",mother:"R14d3",place:"أبير حيبلل",spouses:["W8w1","W8w2","D9d3"]},
{id:"W5d2",name:"مريم تنصر",g:"F",father:"W5",mother:"R14d3",place:"أبير حيبلل" ,spouses:["F124"] ,crossLink:true},
{id:"W6w1",name:"اشتيه (عائشة)",g:"F",father:"W2",mother:"W2w1",note:"بنت أحمد يوره بن محمد بن عبد الله بن محمودن — زواج داخلي بالأسرة",place:"أبير حيبلل",spouses:["W6"]},
{id:"W6s1",name:"ببا",g:"M",father:"W6",mother:"W6w1"},
{id:"W6w2",name:"مريم",g:"F",father:"XA482",spouses:["W6"],ext:true},
{id:"W6d2",name:"رحمه",g:"F",father:"W6",mother:"W6w2"},
{id:"W7",para:7,name:"عبد الله",g:"M",father:"W6",mother:"W6w2",dates:"1368هـ/1949م –",spouses:["W7w1"]},
{id:"W7w1",name:"فطمة",g:"F",father:"XA483",spouses:["W7"],ext:true},
{id:"W7d1",name:"مريم",g:"F",father:"W7",mother:"W7w1"},
{id:"W7s1",name:"محمد فال",g:"M",father:"W7",mother:"W7w1"},
{id:"W8w1",name:"خدجية",g:"F",father:"D9",mother:"D9w1",spouses:["W8"],fullName:"خدجية بنت اليدالي بن أحمد بن أحميميد بن المختار بن القاضي بن أحموذيلل بن سيد (المختار) بن عبد الله"},
{id:"W8s1",name:"اليدالي",g:"M",father:"W8",mother:"W8w1",place:"محجوبو",note:"لم يعقب"},
{id:"W8w2",name:"فطمة",g:"F",father:"I48",spouses:["W8"]},
{id:"W8s2",name:"يسلم",g:"M",father:"W8",mother:"W8w2",place:"أبير حيبلل",note:"لم يعقب"},
{id:"W8d2",name:"خديجة",g:"F",father:"W8",mother:"W8w2"},
{id:"W8d3",name:"منت اباه",g:"F",father:"W8",mother:"W8w2" ,spouses:["E48"] ,dates:"1374هـ/1955م –" ,crossLink:true},
{id:"Z1",para:1,name:"المزضف",g:"M",father:"T0",dates:"1071هـ/1661م –",place:"انتين",
    note: "بن سيد الفالي",spouses:["Z1w1","Z1w3"]},
{id:"Z1w1",name:"خدحية",g:"F",father:"XA1183",spouses:["Z1"],ext:true},
{id:"Z1s1",name:"أحمد",g:"M",father:"Z1",mother:"Z1w1",dates:"1072هـ/1662م –",place:"تنجماره",note:"لم يعقب"},
{id:"Z1s2",name:"عبد الله",g:"M",father:"Z1",mother:"Z1w1",dates:"1072هـ/1662م –",place:"تنجماره",note:"لم يعقب"},
{id:"Z2",para:2,name:"محمد",g:"M",father:"Z1",mother:"Z1w1",dates:"1071هـ/1661م –",place:"انتين",spouses:["Z2w1"]},
{id:"Z2d1",name:"ايجه",g:"F",father:"Z2",mother:"Z2w1",place:"حبلل",note:"أم فوك وكامل وامنيانو من أبناء حبلل بن ماهي؛ أم فلانة بنت الجيّد بن باني",spouses:["P47"]},
{id:"Z1s3",name:"مولود",g:"M",father:"Z1",mother:"Z1w1",dates:"1071هـ/1661م –",place:"انتين",note:"لم يعقب"},
{id:"Z1s4",name:"الأمين",g:"M",father:"Z1",mother:"Z1w1",dates:"1072هـ/1662م –",place:"تنجماره",note:"لم يعقب"},
{id:"Z1w3",name:"مريم",g:"F",father:"XA485",spouses:["Z1"],ext:true},
{id:"Z8",para:8,name:"ابو الحس",g:"M",father:"Z1",mother:"Z1w3",dates:"1070هـ/1660م –",place:"آمكيني",spouses:["Z8w1","Z8w4"]},
{id:"Z2w1",name:"فلانة",g:"F",father:"XA489",spouses:["Z2"],ext:true},
{id:"Z3",para:3,name:"خيلوم (خير الأنام)",g:"M",father:"Z2",mother:"Z2w1",place:"المنحر",spouses:["Z3w1","Z3w2","V1d1"]},
{id:"Z3w1",name:"آبيه",g:"F",father:"XA900",spouses:["Z3"],ext:true},
{id:"Z4",para:4,name:"محمد",g:"M",father:"Z3",mother:"Z3w1",spouses:["Z4w1"]},
{id:"Z3d2",name:"عيوه",g:"F",father:"Z3",mother:"Z3w1",note:"أم حبلل بن سيد أحمد بن حبلل بن بوزيدن (الفالي) بن اشفغ اوبك بن اشفغ مكر"},
{id:"Z3d3",name:"فلانة",g:"F",father:"Z3",mother:"Z3w1",note:"أم أبناء الأمين بن أحمذ حييا -اذمامره-"},
{id:"Z5",para:5,name:"الأمين",g:"M",father:"Z3",mother:"Z3w2",spouses:["R2d1"]},
{id:"Z5d1",name:"فاطمة",g:"F",father:"Z5",mother:"R2d1",note:"أم اتاه (المختار) من أبناء سيد أحمد بن حبلل بن ابراهيم؛ أم فلانة بنت سيد بن أحمد ميلود بن شدار بن اشفغ الأمين — لم تعقب؛ أم فلانه بنت سيد بن احمد ميلود بن شدار بن اشفغ الأمين — لم تعقب؛ أم اتَّاه (المختار) بن سيد احمد بن حبلل بن ابراهيم",spouses:["I3","Y150"]},
{id:"Z7",para:7,name:"محمذن",g:"M",father:"Z3",mother:"Z3w2",spouses:["Z7w1","Z7w2"]},
{id:"Z4w1",name:"فاله",g:"F",father:"N1",spouses:["Z4","E53"],crossLink:true,fullName:"فاله بنت محمذن بن ميجود -اديبسات-",ext:true},
{id:"Z6",para:6,name:"اسويدي",g:"M",father:"Z5",mother:"R2d1",spouses:["Z6w1","G101d1"]},
{id:"Z6w1",name:"فلانة",g:"F",father:"G101",spouses:["Z6"]},
{id:"Z7w1",name:"أم المؤمنين",g:"F",father:"K84",mother:"K84w1",note:"بنت المختار بن محمد الكريم — رابط بين الأسرتين",spouses:["Z7","L8"],crossLink:true},
{id:"Z7w2",name:"جيها",g:"F",father:"XA493",mother:"G100d1",spouses:["Z7"],ext:true},
{id:"Z7s1",name:"سيد الفالي",g:"M",father:"Z7",note:"لم يعقب"},
{id:"Z8w1",name:"مريم",g:"F",father:"N1",spouses:["Z8"],crossLink:true,fullName:"مريم بنت محمذن بن اشفغ حيبلل",ext:true},
{id:"Z8d1",name:"امينيانه",g:"F",father:"Z8",mother:"Z8w1",note:"أم أبناء بابارميد (المختار) بن أحمد زروق",spouses:["R2"],fullName:"امنيانه بنت أبو الحس بن المزضف"},
{id:"Z8d2",name:"الوفيه",g:"F",father:"Z8",mother:"Z8w1",note:"أم سيد والصغرى ومريم من أبناء سكم بن محمذن بن اعمر يزكئذن بن محنضنلل بن اعمر اديقب"},
{id:"Z9",para:9,name:"محمود الله",g:"M",father:"Z8",mother:"Z8w1",spouses:["Z9w1"]},
{id:"Z8w4",name:"فلانة",g:"F",father:"D46s3s1",spouses:["Z8"]},
{id:"Z19",para:19,name:"محم",g:"M",father:"Z8",mother:"Z8w4",place:"لحجوريو",spouses:["Z19w1"]},
{id:"Z9w1",name:"اسهيله",g:"F",father:"K50",mother:"G55d1",note:"بنت آمين بن محمد الكريم — رابط بين الأسرتين",spouses:["Z9"],crossLink:true},
{id:"Z10",para:10,name:"الجمد",g:"M",father:"Z9",mother:"Z9w1",spouses:["Z10w1"]},
{id:"Z11",para:11,name:"اسويدي",g:"M",father:"Z9",mother:"Z9w1",spouses:["E55d2"]},
{id:"Z13",para:13,name:"اخميطرات",g:"M",father:"Z9",mother:"Z9w1",place:"أبير حيبلل",spouses:["Z13w1"]},
{id:"Z10w1",name:"خدجية",g:"F",father:"J3",mother:"E54d1",spouses:["Z10","Z21"],fullName:"خدجية بنت محمد فال بن ابن غازي بن آجل (الفالي)",note:"أم أحمد بن اَّمِّـن (محمذن) بن بوبكر بن محم بن ابو الحس بن المزضف"},
{id:"Z10s1",name:"مولود",g:"M",father:"Z10",mother:"Z10w1",note:"لم يعقب"},
{id:"Z10s2",name:"فالن",g:"M",father:"Z10",mother:"Z10w1",note:"لم يعقب"},
{id:"Z12",para:12,name:"حامدين",g:"M",father:"Z11",mother:"E55d2",spouses:["Z12w1"]},
{id:"Z12w1",name:"مريم",g:"F",father:"Z13",mother:"Z13w1",note:"زواج داخلي بالأسرة",spouses:["Z12"]},
{id:"Z13w1",name:"خيرات",g:"F",father:"Z44",mother:"Z44w1",spouses:["Z13"]},
{id:"Z14",para:14,name:"محمد فال",g:"M",father:"Z13",mother:"Z13w1",dates:"1316هـ/1899م –",place:"أبير حيبلل",spouses:["Z14w1"]},
{id:"Z14w1",name:"مريم",g:"F",father:"Z46",mother:"Z70d2",spouses:["Z14"],fullName:"مريم بنت أحمد بن محمد الباقر بن حمم بن أبو الحس بن المزضف"},
{id:"Z15",para:15,name:"أحمد الأمين",g:"M",father:"Z14",mother:"Z14w1",dates:"1341هـ/1923م –",place:"أبير حيبلل",spouses:["Z15w1","Z15w2"]},
{id:"Z14s1",name:"بيبات",g:"M",father:"Z14",mother:"Z14w1",note:"لم يعقب"},
{id:"Z18",para:18,name:"محمودن",g:"M",father:"Z14",mother:"Z14w1",place:"أبير حيبلل",spouses:["Z18w1","Z18w2"]},
{id:"Z15w1",name:"أم الخيري سلمه",g:"F",father:"M51",mother:"M51w1",note:"بنت مولود بن ابّا (أحمذ) بن محمذن بن الأمين بن الفالي بن متيلي — رابط بين الأسرتين؛ بنت مولود بن ابّا (أحمذ)... بن الفالي بن متيلي — رابط بين الأسرتين؛ بنت مولود بن ايبّا (أحمذ) بن محمذن بن الأمين بن الفالي بن متيلي — رابط بين الأسرتين (نفس زوجة Z15/Z48)",dates:"1305هـ/1888م – 1402هـ/1982م",place:"أبير حيبلل",spouses:["Z15","Z48","F125"],crossLink:true},
{id:"Z15w2",name:"فاطمة السالمه",g:"F",father:"K88",mother:"Z72d1",note:"رابط بين الأسرتين",dates:"1354هـ/1935م –",place:"أحسي شداد",spouses:["Z15"],crossLink:true},
{id:"Z16",para:16,name:"محمد سالم",g:"M",father:"Z15",mother:"Z15w2",dates:"1339هـ/1921م – 1437هـ/2016م",place:"أبير حيبلل",spouses:["K73d1","Z16w2"]},
{id:"Z17",para:17,name:"النّح (محمد عبد الرحمن)",g:"M",father:"Z16",mother:"K73d1",dates:"1376هـ/1957م –",spouses:["Z17w1"]},
{id:"Z17w1",name:"فاطمة",g:"F",father:"Z101",mother:"Z101w1",dates:"1382هـ/1963م –",spouses:["Z17"],fullName:"فاطمة بنت سيد بن أحمد سالم بن محمذن بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z18w1",name:"الشاهره",g:"F",father:"F42",mother:"F42w1",spouses:["Z18"],crossLink:true,note:"أم محمذن بن محمودن بن محمد فال بن اخميطرات بن محمود الله بن أبو الحس بن المزضف — لم يعقب"},
{id:"Z19w1",name:"امهوه (ميمونه)",g:"F",father:"XA1185",spouses:["Z19"],note:"الجد المذكور في السلسلة غير مسجل في الشجرة",ext:true},
{id:"Z20",para:20,name:"بوبكر",g:"M",father:"Z19",mother:"Z19w1",spouses:["Z20w1","Z20w2","Z20w3"]},
{id:"Z20w3",name:"مريم",g:"F",father:"XA494",spouses:["Z20"],ext:true},
{id:"Z44",para:44,name:"سيد",g:"M",father:"Z19",mother:"Z19w1",spouses:["Z44w1"]},
{id:"Z45",para:45,name:"محمد الباقر",g:"M",father:"Z19",mother:"Z19w1",spouses:["Z45w1"]},
{id:"Z19d1",name:"فاطمة",g:"F",father:"Z19",mother:"Z19w1",place:"لبهيگو",note:"أم والد وأحمد محمود ومريم من أبناء عمي مودي بن محمذن بن الأمين بن اشفغ موسان -اچكوچي-"},
{id:"Z20w1",name:"امّي",g:"F",father:"K85",mother:"K85w1",spouses:["Z20"],fullName:"امّي بنت محمذن فال بن المختار سعيد بن محمد اليدالي بن المختار بن حمم سعيد",ext:true},
{id:"Z21",para:21,name:"امّن (محمذن)",g:"M",father:"Z20",mother:"Z20w1",place:"الصدريات الخضر",spouses:["Z21w1","Z21w2","Y121d1","Z21w4","Z10w1","Z21w6","Z21w7"]},
{id:"Z21w2",name:"ام المؤمنين",g:"F",father:"Z11",mother:"E55d2",note:"زواج داخلي بالأسرة",spouses:["Z21"]},
{id:"Z21d1",name:"مايّم (مريم)",g:"F",father:"Z21",mother:"Y121d1",note:"لم تعقب"},
{id:"Z21w4",name:"اميمه",g:"F",father:"XA498",spouses:["Z21"],ext:true},
{id:"Z20w2",name:"فاطمة",g:"F",father:"XA323",spouses:["Z20"],ext:true},
{id:"Z21w1",name:"أم الخيرات",g:"F",father:"Z11",mother:"E55d2",note:"زواج داخلي بالأسرة",spouses:["Z21"]},
{id:"Z22",para:22,name:"بكن (أبوبكر)",g:"M",father:"Z21",mother:"Z21w1",dates:"1265هـ/1849م – 1339هـ/1921م",place:"دليلحو",spouses:["Z12d1","Z26w1"]},
{id:"Z26",para:26,name:"اليدالي",g:"M",father:"Z21",mother:"Z21w2",place:"تنيخلف",spouses:["Z26w1"]},
{id:"Z27",para:27,name:"محمد فال",g:"M",father:"Z21",mother:"Z21w4",spouses:["Z27w1","Z27w2"]},
{id:"Z23",para:23,name:"المختار",g:"M",father:"Z22",mother:"Z12d1",spouses:["K105d1"]},
{id:"Z24",para:24,name:"حامد",g:"M",father:"Z22",mother:"Z26w1",dates:"1365هـ/1946م –",place:"إلى سيدَّن",spouses:["Z24w1"]},
{id:"Z23s1",name:"محمد فال",g:"M",father:"Z23",mother:"K105d1",note:"لم يعقب"},
{id:"Z24w1",name:"السالمه",g:"F",father:"Z73",mother:"Z93d1",note:"زواج داخلي بالأسرة — ⚠️ تاريخ الميلاد في المصدر الأصلي يتعارض مع وفاة الزوج — قد يكون خطأ OCR في الوثيقة الأصلية",dates:"1325هـ/1907م – 1362هـ/1943م",place:"شك الخيمو",spouses:["Z24"],fullName:"السالمه بنت أحمد بن ابن عبدم بن عبد الله بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z25",para:25,name:"أحمد سالم",g:"M",father:"Z24",mother:"Z24w1",dates:"1354هـ/1935م – 1429هـ/2008م",place:"إلى سيدَّن",spouses:["Z25w1"]},
{id:"Z24s1",name:"عمر",g:"M",father:"Z24",mother:"Z24w1",note:"لم يعقب"},
{id:"Z24s2",name:"محمد",g:"M",father:"Z24",mother:"Z24w1",note:"لم يعقب"},
{id:"Z25w1",name:"ايا (عايشا)",g:"F",father:"F38",mother:"F38w1",dates:"1375هـ/1956م –",spouses:["Z25"],crossLink:true},
{id:"Z25s1",name:"يحي (محمد)",g:"M",father:"Z25",mother:"Z25w1",dates:"1396هـ/1976م –"},
{id:"Z25d1",name:"دود (فاطمة)",g:"F",father:"Z25",mother:"Z25w1",dates:"1402هـ/1982م –"},
{id:"Z25s2",name:"أحمد",g:"M",father:"Z25",mother:"Z25w1",dates:"1405هـ/1985م –"},
{id:"Z25s3",name:"محمدن",g:"M",father:"Z25",mother:"Z25w1",dates:"1410هـ/1990م –"},
{id:"Z26w1",name:"فطيمه",g:"F",father:"Z43",mother:"E43d1",spouses:["Z26","Z22"],fullName:"فطيمه بنت أحمد المبارك بن بوبكر بن حمم بن أبو الحس بن المزضف"},
{id:"Z27w1",name:"امباركه",g:"F",father:"W1",mother:"W1w1",spouses:["Z27"],crossLink:true,fullName:"امباركه بنت محمد بن أحمد محدي -تياب إلى عتام-"},
{id:"Z28",para:28,name:"محمدن",g:"M",father:"Z27",spouses:["Z28w1"],mother:"Z27w1"},
{id:"Z27w2",name:"عيشه الفاخيو -الدم-",g:"F",father:null,spouses:["Z27"]},
{id:"Z34",para:34,name:"أحمد",g:"M",father:"Z27",mother:"Z27w2",spouses:["Z34w1"]},
{id:"Z28w1",name:"توت (فاطمة)",g:"F",father:"XA502",dates:"1425هـ/2004م –",place:"أبير حيبلل",spouses:["Z28"],ext:true},
{id:"Z29",para:29,name:"لمرابط",g:"M",father:"Z28",mother:"Z28w1",dates:"1354هـ/1935م –",spouses:["R27d1","Z29w2"]},
{id:"Z30",para:30,name:"يرب (محمدن)",g:"M",father:"Z29",mother:"R27d1",dates:"1384هـ/1964م –",spouses:["Z30w1"]},
{id:"Z31",para:31,name:"البرا",g:"M",father:"Z29",mother:"R27d1",dates:"1388هـ/1968م –",spouses:["Z31w1"]},
{id:"Z32",para:32,name:"المختار",g:"M",father:"Z29",mother:"R27d1",dates:"1393هـ/1973م –",spouses:["R29d1","Z32w2"]},
{id:"Z33",para:33,name:"ابوبكر",g:"M",father:"Z29",mother:"R27d1",dates:"1403هـ/1983م –",spouses:["Z33w1"]},
{id:"Z30w1",name:"عائشة",g:"F",father:"Z41",mother:"Z41w1",dates:"1399هـ/1979م –",spouses:["Z30"],fullName:"عائشة بنت محمد سالم بن محمد محمود بن محمد بن بوبكر بن حمم بن أبو الحس بن المزضف"},
{id:"Z31w1",name:"ميننه",g:"F",father:"XA503",spouses:["Z31"],ext:true},
{id:"Z33w1",name:"عائشة",g:"F",father:"Z16",mother:"Z16w2",dates:"1411هـ/1991م –",spouses:["Z33"]},
{id:"Z34w1",name:"فلانة -الدم-",g:"F",father:null,spouses:["Z34"]},
{id:"Z34s1",name:"امّن (محمذن)",g:"M",father:"Z34",mother:"Z34w1",note:"لم يعقب"},
{id:"Z35",para:35,name:"أحمد",g:"M",father:"Z21",mother:"Z10w1",spouses:["Z35w1"]},
{id:"Z35w1",name:"ابنتّه",g:"F",father:"K12",mother:"K12w1",note:"رابط بين الأسرتين",spouses:["Z35"],crossLink:true},
{id:"Z36",para:36,name:"امّن (محمذن)",g:"M",father:"Z35",mother:"Z35w1",spouses:["Z36w1"]},
{id:"Z36w1",name:"فاطمة",g:"F",father:"Z99",spouses:["Z36"],fullName:"فاطمة بنت محمذن بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z36s1",name:"الحسين",g:"M",father:"Z36",mother:"Z36w1",note:"لم يعقب"},
{id:"Z37",para:37,name:"محمد",g:"M",father:"Z20",mother:"Z20w2",spouses:["Z37w1","Z37w2"]},
{id:"Z37w1",name:"مريم",g:"F",father:"XA507",spouses:["Z37"],ext:true},
{id:"Z38",para:38,name:"أحمد سالم",g:"M",father:"Z37",mother:"Z37w1",spouses:["Z38w1"]},
{id:"Z40",para:40,name:"محمد محمود",g:"M",father:"Z37",mother:"Z37w1",spouses:["Z40w1"]},
{id:"Z38w1",name:"الزهراء",g:"F",father:"K44s5",spouses:["Z38"]},
{id:"Z39",para:39,name:"محمد",g:"M",father:"Z38",mother:"Z38w1",dates:"– 1429هـ/2008م",place:"انواكشوط",spouses:["Z39w1"]},
{id:"Z39w1",name:"سكينه",g:"F",father:"K44s6s1",spouses:["Z39"]},
{id:"Z40w1",name:"فطيمه",g:"F",father:"XA323",spouses:["Z40"],ext:true},
{id:"Z41",para:41,name:"محمد سالم",g:"M",father:"Z40",mother:"Z40w1",dates:"1358هـ/1939م – 1436هـ/2015م",place:"أحسي السعادة",spouses:["Z41w1"]},
{id:"Z41w1",name:"فاطمة",g:"F",father:"XA514",spouses:["Z41"],ext:true},
{id:"Z42",para:42,name:"أحمد سالم",g:"M",father:"Z41",mother:"Z41w1",spouses:["Z42w1"]},
{id:"Z42w1",name:"آمي",g:"F",father:"Z29",mother:"R27d1",note:"زواج داخلي بالأسرة",dates:"1391هـ/1971م –",spouses:["Z42"],fullName:"آمي بنت لمرابط بن محمدن بن محمد فال بن امّن (محمذن) بن بوبكر بن حمم بن أبو الحس بن المزضف"},
{id:"Z43",para:43,name:"أحمد المبارك",g:"M",father:"Z20",mother:"Z20w3",spouses:["E43d1"]},
{id:"Z43s1",name:"محمذن",g:"M",father:"Z43",mother:"E43d1",note:"لم يعقب"},
{id:"Z44w1",name:"الزغمه",g:"F",father:"XA517",spouses:["Z44"],ext:true},
{id:"Z45w1",name:"فاطمة",g:"F",father:"W1",mother:"W1w1",spouses:["Z45"],crossLink:true,fullName:"فاطمة بنت محمد بن اخطريه"},
{id:"Z46",para:46,name:"أحمد",g:"M",father:"Z45",mother:"Z45w1",place:"أبير حيبلل",spouses:["Z70d2","Z49w1"]},
{id:"Z47",para:47,name:"حمّن (محمذن)",g:"M",father:"Z46",mother:"Z70d2",spouses:["Z47w1"]},
{id:"Z49",para:49,name:"الداه (عبد الله)",g:"M",father:"Z46",mother:"Z49w1",dates:"– 1321هـ/1903م",place:"اللوكو (سنغال)",spouses:["Z21d2"]},
{id:"Z47w1",name:"خدجية",g:"F",father:"K4",mother:"K4w1",note:"بنت اَّكاه (ببكر) بن محمذن بن احجاب بن محمد الكريم — رابط بين الأسرتين",place:"أبير حيبلل",spouses:["Z47"],crossLink:true},
{id:"Z48",para:48,name:"أحمد",g:"M",father:"Z47",mother:"Z47w1",dates:"– 1380هـ/1961م",place:"تنيخلف",spouses:["Z15w1"]},
{id:"Z48s1",name:"حمّن (محمذن)",g:"M",father:"Z48",mother:"Z15w1",note:"لم يعقب"},
{id:"Z49w1",name:"ميمهنه",g:"F",father:"XA1190",place:"تاتيلت",spouses:["Z46"],ext:true},
{id:"Z50",para:50,name:"ادّد (أحمد)",g:"M",father:"Z49",mother:"Z21d2",dates:"1282هـ/1866م – 1380هـ/1961م",place:"تنيخلف",spouses:["M51w1","Z50w2"]},
{id:"Z62",para:62,name:"أحمد",g:"M",father:"Z49",mother:"Z21d2",dates:"– 1359هـ/1940م",place:"اللوكو (سنغال)",spouses:["Z62w1"]},
{id:"Z49s1",name:"اسليمان",g:"M",father:"Z49",mother:"Z21d2",place:"تنيخلف",note:"لم يعقب"},
{id:"Z49s2",name:"الجيلاني",g:"M",father:"Z49",mother:"Z21d2",place:"تنيخلف",note:"لم يعقب"},
{id:"Z49s3",name:"محمد",g:"M",father:"Z49",mother:"Z21d2",place:"تنيخلف",note:"لم يعقب"},
{id:"Z51",para:51,name:"محمد",g:"M",father:"Z50",mother:"M51w1",spouses:["Z51w1","Z51w2"],dates:"1319هـ/1901م – 1375هـ/1955م"},
{id:"Z53",para:53,name:"محمذن",g:"M",father:"Z50",mother:"M51w1",dates:"1321هـ/1903م – 1364هـ/1945م",place:"تنيخلف",spouses:["Z53w1"]},
{id:"Z50w2",name:"باره",g:"F",father:"F123",mother:"F123w2",dates:"– 1396هـ/1976م",place:"تنيخلف",spouses:["Z50"],crossLink:true ,note:"توفيت 1396هـ/1976م بعد زوجها المتوفى 1380هـ/1961م — صُحّح: التاريخ في المصدر تاريخ وفاة لا ميلاد",fullName:"باره بنت الأمين بن بيبات بن حمم بن المبارك بن اما (الماقور)"},
{id:"Z57",para:57,name:"أحمد سالم",g:"M",father:"Z50",mother:"Z50w2",dates:"1341هـ/1923م – 1437هـ/2016م",spouses:["Z57w1","Z57w2"],place:"تنبيعلي"},
{id:"Z58",para:58,name:"محمدن",g:"M",father:"Z50",mother:"Z50w2",dates:"1345هـ/1927م – 1410هـ/1990م",place:"دليلحو",spouses:["Z58w1","Z58w2"]},
{id:"Z51w1",name:"عائشة",g:"F",father:"K124",mother:"K124w1",note:"بنت اتّو (الكوري) بن محمذن بن سيد الفالي بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",dates:"1323هـ/1905م – 1397هـ/1977م",place:"أبير حيبلل",spouses:["Z51"],crossLink:true},
{id:"Z51w2",name:"منت بدي (زينت)",g:"F",father:"Z152",mother:"Z152w2",dates:"– 1341هـ/1923م",place:"أبير حيبلل",spouses:["Z51"],fullName:"منت بدي (زينت) بنت ندمّي (سيد الأمين) بن آياه (بوبكر) بن أحمد بن الأمين بن حمم"},
{id:"Z52",para:52,name:"احييه (أحمد)",g:"M",father:"Z51",mother:"Z51w2",dates:"1372هـ/1953م –",spouses:["Z52w1","Z52w2"]},
{id:"Z52w1",name:"شوت",g:"F",father:"R6",dates:"1390هـ/1970م – 1422هـ/2001م",place:"دليلحو",spouses:["Z52"],fullName:"شوت بنت محمدن بن الهلال بن محمذن بن بالليل بن بابارميد بن أحمد زروق",mother:"R6w2"},
{id:"Z52w2",name:"نبغوها",g:"F",father:"F38",mother:"F38w1",dates:"1388هـ/1968م –",spouses:["Z52","Z110"],crossLink:true},
{id:"Z53w1",name:"الخيت",g:"F",father:"Z152",mother:"Z152w1",dates:"1335هـ/1917م – 1425هـ/2004م",place:"أبير حيبلل",spouses:["Z53"],fullName:"الخيت بنت ندمّي (سيد الأمين) بن آياه (بوبكر) بن أحمد بن الأمين بن حمم"},
{id:"Z54",para:54,name:"عبد الله",g:"M",father:"Z53",mother:"Z53w1",dates:"1357هـ/1938م – 1426هـ/2005م",place:"أبير حيبلل",spouses:["Z54w1"]},
{id:"Z56",para:56,name:"دمّين",g:"M",father:"Z53",mother:"Z53w1",dates:"1363هـ/1944م –",spouses:["Z56w1"]},
{id:"Z54w1",name:"اماه",g:"F",father:"XA518",spouses:["Z54"],ext:true},
{id:"Z55",para:55,name:"ادّد",g:"M",father:"Z54",mother:"Z54w1",dates:"1396هـ/1976م –",spouses:["Z55w1"]},
{id:"Z55w1",name:"فلانة",g:"F",father:"XA339",spouses:["Z55"],ext:true},
{id:"Z56w1",name:"أم الخيري",g:"F",father:"XA523",spouses:["Z56"],ext:true},
{id:"Z57w1",name:"بركه",g:"F",father:"XA524",dates:"1376هـ/1957م –",spouses:["Z57"],ext:true},
{id:"Z58w1",name:"احبيبه",g:"F",father:"F40",mother:"F40w1",dates:"– 1433هـ/2012م",place:"تنيخلف",spouses:["Z58"] ,note:"توفيت 1433هـ/2012م بعد زوجها المتوفى 1410هـ/1990م — صُحّح: التاريخ في المصدر تاريخ وفاة لا ميلاد",fullName:"احبيبه بنت محمذن بن محمد بن أحمد بن محمذن بن منيره بن حبيبنا المختار"},
{id:"Z59",para:59,name:"النّگرش (محمذن)",g:"M",father:"Z58",mother:"Z58w1",dates:"1368هـ/1949م –",spouses:["K74w1"]},
{id:"Z58w2",name:"فاطمة",g:"F",father:"P8",note:"بنت أحمد بن ابو (محمد) بن اَّمي بن محمد بن محمذن بن عركاب (حمم) بن ابوبا (الأمين) بن ماهي — رابط بين الأسرتين",dates:"1362هـ/1943م –",spouses:["Z58"],crossLink:true},
{id:"Z60",para:60,name:"يحي",g:"M",father:"Z58",mother:"Z58w2",dates:"1401هـ/1981م –",spouses:["V27d2"]},
{id:"Z61",para:61,name:"محمد امبارك",g:"M",father:"Z58",mother:"Z58w2",dates:"1403هـ/1983م –",spouses:["Z61w1"]},
{id:"Z61w1",name:"اميه (مريم)",g:"F",father:"I27s1s1s1",dates:"1410هـ/1990م –",spouses:["Z61"]},
{id:"Z62w1",name:"مانه",g:"F",father:"K88",spouses:["Z62"],crossLink:true,fullName:"مانه بنت محمذن بن آمن (أحمد) بن سعدنا (المختار) بن نميّماه (محمذن) بن اخيار (المختار) بن محنض بن أبوبك بن يدنمّس"},
{id:"Z63",para:63,name:"محمد الأمين",g:"M",father:"Z62",mother:"Z62w1",dates:"1348هـ/1930م – 1421هـ/2000م",place:"تنيخلف",spouses:["Z63w1","Z63w2","Z63w3"]},
{id:"Z63w1",name:"خيرا",g:"F",father:"R65s1s1s1s1s1",dates:"1357هـ/1938م – 1436هـ/2015م",place:"تنيخلف",note:"سلالة آبين محنض بونا — ليست من ابراهيم (تصحيح رابط خاطئ)",spouses:["Z63"]},
{id:"Z64",para:64,name:"اد (أحمد)",g:"M",father:"Z63",mother:"Z63w1",dates:"1378هـ/1959م –",spouses:["Z64w1"]},
{id:"Z65",para:65,name:"محمد المختار",g:"M",father:"Z63",mother:"Z63w1",dates:"1382هـ/1963م –",spouses:["Z65w1","Z65w2"]},
{id:"Z66",para:66,name:"جمال",g:"M",father:"Z63",mother:"Z63w1",dates:"1388هـ/1968م –",spouses:["Z66w1","Z66w3","Z66w2"]},
{id:"Z67",para:67,name:"امفال",g:"M",father:"Z63",mother:"Z63w1",dates:"1393هـ/1973م –",spouses:["Z67w1"]},
{id:"Z68",para:68,name:"ادّد (أحمد)",g:"M",father:"Z63",mother:"Z63w2",dates:"1379هـ/1960م –",spouses:["Z68w1"]},
{id:"Z64w1",name:"حاجه",g:"F",father:"Y89",dates:"1380هـ/1961م –",spouses:["Z64"],crossLink:true,mother:"Y50d1",note:"أم أبناء اد (احمد) بن محمد الأمين بن احمد بن الداه (عبد الله) بن احمد بن محمد الباقر بن حمم بن ابو الحس بن المزضف"},
{id:"Z65w1",name:"اشريفه",g:"F",father:"XA527",spouses:["Z65"],ext:true},
{id:"Z66w1",name:"الزهراء",g:"F",father:"W1",mother:"W1w1",spouses:["Z66"],crossLink:true,fullName:"الزهراء بنت محمد بن المختار -تندغو-"},
{id:"Z66w2",name:"ابيّه",g:"F",father:"F83",dates:"1407هـ/1987م –",spouses:["Z66"],crossLink:true},
{id:"Z67w1",name:"مينه (آمنة)",g:"F",father:"Z109",mother:"Z109w1",dates:"1403هـ/1983م –",spouses:["Z67"],fullName:"مينه (آمنة) بنت محمدن بن حمم بن ممّن (محمذين) بن سيد بن حمم بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z68w1",name:"اندي فات -سنغال-",g:"F",father:null,spouses:["Z68"]},
{id:"Z69",para:69,name:"عبد الرحمن",g:"M",father:"Z46",mother:"Z49w1",spouses:["Z69w1"],place:"أبير حيبلل"},
{id:"Z69w1",name:"جويريه",g:"F",father:"Z21",mother:"Z21w7",note:"زواج داخلي بالأسرة",spouses:["Z69"],fullName:"جويريه بنت امّن (محمذن) بن بوبكر بن حمم بن أبو الحس بن المزضف"},
{id:"Z69s1",name:"محنض باب",g:"M",father:"Z69",mother:"Z69w1",note:"لم يعقب"},
{id:"Z70w1",name:"ميمهنه",g:"F",father:"XA528",spouses:["Z70"],ext:true},
{id:"Z71",para:71,name:"عبد الله",g:"M",father:"Z70",mother:"Z70w1",spouses:["Z71w1"]},
{id:"Z70w2",name:"سلمه",g:"F",father:"XA530",spouses:["Z70"],ext:true},
{id:"Z70s1",name:"حيب الله",g:"M",father:"Z70",mother:"Z70w2",note:"لم يعقب"},
{id:"Z92",para:92,name:"عبد الودود",g:"M",father:"Z70",mother:"Z70w2",dates:"1256هـ/1840م –",place:"لحجوريو",spouses:["Z92w1","M7d1"]},
{id:"Z98",para:98,name:"محمد",g:"M",father:"Z70",mother:"Z70w2",place:"آبريدجات لعجول",spouses:["Y82d1"]},
{id:"Z70w3",name:"مريم",g:"F",father:"K85",mother:"K85w1",place:"تنيخلف",note:"رابط بين الأسرتين محتمل",spouses:["Z70"],crossLink:true},
{id:"Z70d2",name:"اخديجات",g:"F",father:"Z70",mother:"Z70w3",note:"أم محّن (محمذن) ومحمد ومريم والسالكو من أبناء أحمد بن محمد الباقر بن حمم بن أبو الحس بن المزضف",spouses:["Z46"],fullName:"اخدجيات بنت الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z70d3",name:"ام البنين",g:"F",father:"Z70",mother:"Z70w3",note:"أم محمد فال والمختار باب ابني جدام بن ببكر بن حرمه بن المختار بن المعزوز بن اشفغ الأمين؛ رابط بين الأسرتين محتمل",fullName:"ام البنين بنت الأمين بن حمم بن أبو الحس بن المزضف",spouses:["Y25"]},
{id:"Z70d5",name:"مامنينه",g:"F",father:"Z70",mother:"Z70w3",place:"تنيخلف",note:"أم آمي بن محمد بن محمذن بن عركاب (حمم) بن ابوبا (حمم) بن ماه؛ أم أبناء محمد بن حيب الله بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",fullName:"مامنينه بنت الأمين بن حمم بن أبو الحس بن المزضف",spouses:["P6","Y70"]},
{id:"Z70d6",name:"ميمهنه",g:"F",father:"Z70",mother:"Z70w3",note:"أم أبناء امحيّد بن الفالي بن الغالوي بن أحمد الورع بن الفالي بن باب أحمد"},
{id:"Z70w4",name:"كوكه",g:"F",father:null,place:"تنيخلف",spouses:["Z70"]},
{id:"Z149",para:149,name:"أحمد",g:"M",father:"Z70",mother:"Z70w4",place:"تنيخلف",spouses:["Z149w1"]},
{id:"Z70w5",name:"مريم",g:"F",father:"F3",note:"رابط بين الأسرتين محتمل",spouses:["Z70"],crossLink:true},
{id:"Z70d7",name:"ام الحسن",g:"F",father:"Z70",mother:"Z70w5",note:"أم الكوري بن الفاظل — لم يعقب"},
{id:"Z71w1",name:"الزاهيه",g:"F",father:"XA1195",spouses:["Z71"],ext:true},
{id:"Z72",para:72,name:"ابن عبدم",g:"M",father:"Z71",mother:"Z71w1",dates:"1233هـ/1818م – 1286هـ/1869م",place:"حبلل",spouses:["Z72w1","Z72w2"]},
{id:"Z72d1",name:"ايا (عايشا)",g:"F",father:"Z72",mother:"Z72w2",dates:"1273هـ/1857م –",place:"أبير حيبلل",note:"أم أبناء اميو (محمذن) بن ادّد (أحمد) بن انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم",spouses:["K88"],fullName:"اي بنت اَّا (عايشا) عبدم ابن بن عبد الله بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z72d2",name:"مموه (ميمونه)",g:"F",father:"Z72",mother:"Z72w2",dates:"1276هـ/1860م – 1363هـ/1944م",place:"أبير حيبلل",note:"أم أبناء سيد بن محمذن بن سيد الفالي بن بنيوك (محمذن) بن المختار بن محمد الكريم",spouses:["K132"],fullName:"دموه (ميمونه) بنت عبدم ابن بن عبد الله بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z72w1",name:"خدجية",g:"F",father:"K71",note:"بنت محمذن ميلود بن حبلل بن عاون بن محمد الكريم — رابط بين الأسرتين",dates:"1270هـ/1854م –",place:"أبير حيبلل",spouses:["Z72"],crossLink:true},
{id:"Z73",para:73,name:"أحمد",g:"M",father:"Z72",mother:"Z72w1",dates:"1270هـ/1854م – 1355هـ/1936م",place:"البعلاتيو",spouses:["Z73w1","Z73w3","Z73w2","Z93d1"]},
{id:"Z83",para:83,name:"عمر",g:"M",father:"Z72",mother:"Z72w2",dates:"1271هـ/1855م – 1334هـ/1916م",place:"أبير حيبلل",spouses:["Z83w1"]},
{id:"Z73w1",name:"عيشنه",g:"F",father:"XA533",spouses:["Z73"],ext:true},
{id:"Z73w2",name:"أم الخيري",g:"F",father:"Z96",mother:"R67d1",note:"زواج داخلي بالأسرة",dates:"1310هـ/1893م –",place:"تنيخلف",spouses:["Z73","K87"],fullName:"أم الخيري بنت مام (محمد) بن عبد الودود بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z74",para:74,name:"مام (محمد)",g:"M",father:"Z73",mother:"Z73w2",dates:"1310هـ/1893م – 1397هـ/1977م",place:"أبير حيبلل",spouses:["Z74w1","Z74w4","Z74w2","I13d2"]},
{id:"Z80",para:80,name:"الأمين",g:"M",father:"Z73",mother:"Z93d1",dates:"1319هـ/1901م – 1380هـ/1961م",place:"دليلحو",spouses:["Z80w1"]},
{id:"Z74w1",name:"امّم",g:"F",father:"I13",mother:"I13w2",note:"بنت ابوبا (ببكر) بن المختار بن سيد أحمد بن حبلل بن ابراهيم — même que I13w2? homonymie",dates:"1319هـ/1901م – 1343هـ/1925م",place:"أبير حيبلل",spouses:["Z74"],crossLink:true},
{id:"Z74w2",name:"عيشه",g:"F",father:"K121",mother:"K121w1",note:"بنت محمد بن المختار الكوري بن محمذن بن انداه (المختار) بن بنيوك (محمذن) — رابط بين الأسرتين",dates:"1326هـ/1908م – 1413هـ/1994م",place:"دليلحو",spouses:["Z74"],crossLink:true},
{id:"Z75",para:75,name:"ابن",g:"M",father:"Z74",mother:"Z74w2",dates:"1352هـ/1933م – 1429هـ/2008م",place:"أبير حيبلل",spouses:["Z75w1","Z75w2","Z75w3","Z75w4"]},
{id:"Z78",para:78,name:"يسلم",g:"M",father:"Z74",mother:"Z74w2",dates:"1369هـ/1950م –",spouses:["Z78w1","Z78w2","Z78w3"]},
{id:"Z75w1",name:"الخيت",g:"F",father:"XA541",dates:"1369هـ/1950م –",spouses:["Z75"],ext:true},
{id:"Z75w2",name:"نفيسه",g:"F",father:"Y60s1",dates:"1369هـ/1950م –",spouses:["Z75"],fullName:"نفيسه بنت المختار بن الحسن بن عبد الله بن محادي"},
{id:"Z76",para:76,name:"محمد",g:"M",father:"Z75",mother:"Z75w2",dates:"1393هـ/1973م –",spouses:["Z76w1","Z76w2"]},
{id:"Z77",para:77,name:"المختار",g:"M",father:"Z75",mother:"Z75w2",dates:"1396هـ/1976م –",spouses:["Z77w1"]},
{id:"Z76w1",name:"نفيسه",g:"F",father:"Z78",mother:"Z78w1",note:"زواج داخلي بالأسرة؛ بنت يسلم بن مام (محمد) بن أحمد بن ابن عبدم بن عبد الله بن الأمين بن حمم بن أبو الحس بن المزضف — رابط بين الأسرتين",dates:"1398هـ/1978م –",spouses:["Z76","F84"],fullName:"نفيسه بنت يسلم بن مام (محمد) بن أحمد بن ابن عبدم بن عبد الله بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z77w1",name:"السالمه",g:"F",father:"XA1199",dates:"1401هـ/1981م –",spouses:["Z77"],ext:true},
{id:"Z78w1",name:"اميدينه",g:"F",father:"XA543",dates:"1371هـ/1952م –",spouses:["Z78"],ext:true},
{id:"Z79",para:79,name:"يحي",g:"M",father:"Z78",mother:"Z78w1",dates:"1396هـ/1976م –",spouses:["Z79w1"]},
{id:"Z78w2",name:"زينب",g:"F",father:"XA1114",spouses:["Z78"],ext:true},
{id:"Z79w1",name:"حاجه",g:"F",father:"Z144",mother:"Z144w1",note:"زواج داخلي بالأسرة",dates:"1405هـ/1985م –",spouses:["Z79"],fullName:"حاجه بنت الحسن بن محمد عبد الله بن الحسن بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z80w1",name:"عيشتونه",g:"F",father:"Z104",mother:"Z104w2",dates:"1334هـ/1916م – 1422هـ/2001م",place:"أبير حيبلل",spouses:["Z80"],fullName:"عيشتونه بنت محمد الأمين بن محمذن بن محمد بن الأمين بن حمم بن أبو الحس"},
{id:"Z81",para:81,name:"عبد الله",g:"M",father:"Z80",mother:"Z80w1",dates:"1357هـ/1938م –",spouses:["Z81w1"]},
{id:"Z82",para:82,name:"أحمد",g:"M",father:"Z80",mother:"Z80w1",dates:"1371هـ/1952م – 1431هـ/2010م",place:"الحجون (مكة المكرمة)",spouses:["Z82w1"]},
{id:"Z81w1",name:"عائشة",g:"F",father:"XA375",dates:"– 1430هـ/2009م",place:"انتيشط",spouses:["Z81"],ext:true},
{id:"Z82w1",name:"أم الخيرات",g:"F",father:"I29",dates:"1382هـ/1963م –",spouses:["Z82"],crossLink:true,fullName:"أم الخيرات بنت كاكاه (ببكر) بن اميو (محمذن) بن سيد أحممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم",mother:"I29w2",note:"أم أبناء احمد بن الأمين بن احمد بن ابن عبدم بن الأمين بن حمم بن ابو الحس بن المزضف"},
{id:"Z83w1",name:"صفيه",g:"F",father:"XA547",dates:"1287هـ/1870م – 1367هـ/1948م",place:"أبير حيبلل",spouses:["Z83"],ext:true},
{id:"Z84",para:84,name:"محمد",g:"M",father:"Z83",mother:"Z83w1",dates:"1319هـ/1901م – 1419هـ/1998م",place:"أبير حيبلل",spouses:["Z84w1","Z84w2"]},
{id:"Z90",para:90,name:"ببكر",g:"M",father:"Z83",mother:"Z83w1",dates:"1322هـ/1904م – 1408هـ/1988م",place:"أبير حيبلل",spouses:["Z90w1"]},
{id:"Z84w1",name:"عائشة",g:"F",father:"Z139",mother:"Z139w2",note:"زواج داخلي بالأسرة",dates:"1330هـ/1912م – 1405هـ/1985م",place:"دليلحو",spouses:["Z84","I19"],fullName:"عائشة بنت الحسن بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z84w2",name:"توت",g:"F",father:"Z100",mother:"Z100w1",dates:"1335هـ/1917م – 1420هـ/1999م",place:"أبير حيبلل",spouses:["Z84"],fullName:"توت بنت أحمد سالم بن محمذن ول محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z85",para:85,name:"أحمد",g:"M",father:"Z84",mother:"Z84w2",dates:"1365هـ/1946م –",spouses:["Z85w1"]},
{id:"Z86",para:86,name:"محمدن",g:"M",father:"Z84",mother:"Z84w2",dates:"1367هـ/1948م –",spouses:["Z86w1"]},
{id:"Z89",para:89,name:"محمذن",g:"M",father:"Z84",mother:"Z84w2",dates:"1372هـ/1953م –",spouses:["Z89w1"]},
{id:"Z85w1",name:"اتويتاه (فاطمة)",g:"F",father:"Z51",mother:"Z51w2",dates:"1375هـ/1955م –",spouses:["Z85"],fullName:"اتويتاه (فاطمة) بنت محمد بن ادّد (أحمد) بن الداه (عبد الله) بن أحمد بن محمد الباقر بن حمم بن أبو الحس بن المزضف"},
{id:"Z86w1",name:"عائشة",g:"F",father:"Z108",mother:"Z108w1",dates:"1375هـ/1955م –",spouses:["Z86"],fullName:"عائشة بنت حمم بن ممّن (محمذين) بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z87",para:87,name:"اشريف",g:"M",father:"Z86",mother:"Z86w1",dates:"1399هـ/1979م –",spouses:["Z87w1"]},
{id:"Z88",para:88,name:"أحمد",g:"M",father:"Z86",mother:"Z86w1",dates:"1402هـ/1982م –",spouses:["Z88w1"]},
{id:"Z87w1",name:"فاطمة",g:"F",father:"K115",mother:"K115w1",note:"رابط بين الأسرتين",dates:"1405هـ/1985م –",spouses:["Z87","K21"],crossLink:true,fullName:"فاطمة بنت أحمد بن ددايل بن محمودن بن محمذن بن انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم"},
{id:"Z88w1",name:"العمره",g:"F",father:"Z52",mother:"Z52w1",dates:"1408هـ/1988م –",spouses:["Z88","Z154"],fullName:"العمره بنت احيو (أحمد) بن محمد بن ادّد (أحمد) بن الداه (عبد الله) بن أحمد بن محمد الباقر"},
{id:"Z89w1",name:"أم الخيرات",g:"F",father:"K139",mother:"V25d2",note:"رابط بين الأسرتين",dates:"1386هـ/1966م –",spouses:["Z89"],crossLink:true},
{id:"Z90w1",name:"عيشه",g:"F",father:"M45",note:"بنت محمد بن اگّي (الكوري) بن ابّا (أحمذ) بن محمذن بن الأمين بن الفالي بن متيلي — رابط بين الأسرتين؛ أم أحمد وصفيو من أبناء ببكر بن عمر بن ابن عبدم بن عبد الله بن الأمين بن حمم بن أبو الحس بن المزضف",dates:"1335هـ/1917م – 1426هـ/2005م",place:"أبير حيبلل",spouses:["Z90"],crossLink:true,mother:"F32d2"},
{id:"Z91",para:91,name:"أحمد",g:"M",father:"Z90",mother:"Z90w1",dates:"1376هـ/1957م –",spouses:["Z91w1"]},
{id:"Z90s1",name:"عمر",g:"M",father:"Z90",mother:"Z90w1",dates:"1386هـ/1966م – 1406هـ/1986م",place:"دليلحو",note:"لم يعقب"},
{id:"Z91w1",name:"امنّاه",g:"F",father:"I35",dates:"1382هـ/1963م –",spouses:["Z91"],crossLink:true,fullName:"امنّاه بنت أحمد بن اميو (محمذن) بن سيد أحممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم",mother:"I35w1",note:"أم أبناء احمد بن ببكر بن عمر بن ابن عبدم بن عبد الله بن الأمين بن حمم بن ابو الحس بن المزضف"},
{id:"Z92w1",name:"احبيبه",g:"F",father:"XA32",place:"لحجوريو",spouses:["Z92"]},
{id:"Z92d1",name:"خديجة",g:"F",father:"Z92",mother:"Z92w1",note:"لم تعقب"},
{id:"Z92d2",name:"منت الحارث",g:"F",father:"Z92",mother:"M7d1",note:"أم محمذن بن الأمين بن صالحي بن محمذن بن آبين (محنض بونا)"},
{id:"Z93w1",name:"السالمه",g:"F",father:"Z148",spouses:["Z93"],fullName:"السالمه بنت محمذن بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z93",para:93,name:"أحمد امبيريك",g:"M",father:"Z92",mother:"Z92w1",dates:"1322هـ/1904م –",spouses:["Z93w1"]},
{id:"Z93d1",name:"أم الخيري",g:"F",father:"Z93",mother:"Z93w1",note:"أم أحمد سادل والأمين والسالمه من أبناء أحمد بن ابن عبدم بن عبد الله بن الأمين بن حمم بن أبو الحس بن المزضف",spouses:["Z73"]},
{id:"Z93d2",name:"مريم",g:"F",father:"Z93",mother:"Z93w1",note:"أم أحمد بن محمد عبد الله بن شيخ البيظان (محمّد) بن المختار بن قطرب بن محنض بن الغالوي بن الفالي بن باب أحمد"},
{id:"Z94",para:94,name:"محمد",g:"M",father:"Z93",mother:"Z93w1",spouses:["Z94w1"]},
{id:"Z96",para:96,name:"مام (محمد)",g:"M",father:"Z92",mother:"Z92w1",spouses:["R67d1","K4d5"]},
{id:"Z97",para:97,name:"المختار",g:"M",father:"Z92",mother:"Z92w1",spouses:["Z97w1"]},
{id:"Z94w1",name:"فاطمة",g:"F",father:"F36",spouses:["Z94"],crossLink:true,mother:"K64d2"},
{id:"Z95",para:95,name:"أحمد سالم",g:"M",father:"Z94",mother:"Z94w1",spouses:["Z95w1"]},
{id:"Z94s1",name:"السالم",g:"M",father:"Z94",mother:"Z94w1",note:"لم يعقب"},
{id:"Z95w1",name:"فاطمة",g:"F",father:"XA548",dates:"1429هـ/2008م –",spouses:["Z95"],ext:true},
{id:"Z96s1",name:"محمدن",g:"M",father:"Z96",mother:"K4d5",note:"لم يعقب"},
{id:"Z97w1",name:"السالكه",g:"F",father:"Z46",mother:"Z70d2",spouses:["Z97"],fullName:"السالكه بنت أحمد بن محمد الباقر بن حمم بن أبو الحس بن المزضف"},
{id:"Z99",para:99,name:"محمذن",g:"M",father:"Z98",mother:"Y82d1",dates:"1229هـ/1814م – 1324هـ/1906م",place:"اجدر لخظر",spouses:["Z99w1","Y52w1","Y121d3"]},
{id:"Z105",para:105,name:"سيد",g:"M",father:"Z98",mother:"Y82d1",dates:"1248هـ/1833م – 1344هـ/1925م",place:"تنيخلف",spouses:["Z105w1","Z105w2"]},
{id:"Z99w1",name:"ميمهنه",g:"F",father:"F16",mother:"K3d2",spouses:["Z99"],crossLink:true},
{id:"Z100",para:100,name:"أحمد سالم",g:"M",father:"Z99",mother:"Z99w1",dates:"1289هـ/1872م – 1364هـ/1945م",place:"حاسي لمرابط",spouses:["Z100w1"]},
{id:"Z104",para:104,name:"محمد الأمين",g:"M",father:"Z99",mother:"Y52w1",dates:"1294هـ/1877م – 1359هـ/1940م",place:"تنيخلف",spouses:["Z104w1","Z104w2"]},
{id:"Z100w1",name:"نشت (عائشة)",g:"F",father:"K31",mother:"K31w1",note:"بنت محمذن بن ابامين (الأمين) بن المختار بن أحمد انهكر بن محمد الكريم — رابط بين الأسرتين — ⚠️ تاريخ الميلاد في المصدر الأصلي يتعارض مع وفاة الزوج — قد يكون خطأ OCR في الوثيقة الأصلية",dates:"1386هـ/1966م –",place:"تنيخلف",spouses:["Z100"],crossLink:true},
{id:"Z101",para:101,name:"سيد",g:"M",father:"Z100",mother:"Z100w1",dates:"1388هـ/1920م – 1430هـ/2009م",place:"تنيخلف",spouses:["Z101w1"]},
{id:"Z100s1",name:"محمد",g:"M",father:"Z100",mother:"Z100w1",dates:"1345هـ/1927م – 1427هـ/2006م",place:"أبير حيبلل",note:"لم يعقب"},
{id:"Z100s2",name:"البرا",g:"M",father:"Z100",mother:"Z100w1",place:"أبير حيبلل",note:"لم يعقب"},
{id:"Z101w1",name:"امامن",g:"F",father:"Z107",dates:"1356هـ/1937م –",spouses:["Z101"],fullName:"امامن بنت ممّن (محمذين) بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z102",para:102,name:"أحمد",g:"M",father:"Z101",mother:"Z101w1",dates:"1386هـ/1966م –",spouses:["Z102w1","Y104d1"]},
{id:"Z103",para:103,name:"عابدين",g:"M",father:"Z101",mother:"Z101w1",dates:"1392هـ/1972م –",spouses:["J39d4"]},
{id:"Z101s1",name:"ممّن",g:"M",father:"Z101",mother:"Z101w1",dates:"1396هـ/1976م – 1435هـ/2014م",place:"أبير حيبلل",note:"لم يعقب"},
{id:"Z102w1",name:"توت",g:"F",father:"Y104",dates:"1396هـ/1976م –",spouses:["Z102"]},
{id:"Z104w1",name:"مريم",g:"F",father:"Z73",mother:"Z73w3",note:"زواج داخلي بالأسرة",dates:"1298هـ/1881م – 1363هـ/1944م",place:"المذرذره",spouses:["Z104"],fullName:"مريم بنت أحمد بن ابن عبدم بن عبد الله بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z104w2",name:"مرجانه",g:"F",father:"Y75",mother:"Y75w1",dates:"1364هـ/1945م –",place:"كازماصو",spouses:["Z104","K97"] ,note:"⚠️ تاريخ الميلاد في المصدر الأصلي يتعارض مع وفاة الزوج — قد يكون خطأ OCR في الوثيقة الأصلية"},
{id:"Z105w1",name:"أم الخيري",g:"F",father:"Z72",mother:"Z72w1",note:"زواج داخلي بالأسرة",dates:"1268هـ/1852م –",place:"تنيخلف",spouses:["Z105"],fullName:"أم الخيري بنت ابن عبدم بن عبد الله بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z105s1",name:"أحمد",g:"M",father:"Z105",mother:"Z105w1",note:"لم يعقب"},
{id:"Z106",para:106,name:"ببا (ابن عبدم)",g:"M",father:"Z105",mother:"Z105w1",dates:"1362هـ/1943م –",place:"النباغيو (العكلو)",spouses:["Z106w1"]},
{id:"Z105s2",name:"محمد",g:"M",father:"Z105",mother:"Z105w1",dates:"1305هـ/1888م –",place:"الحجون (مكة المكرمة)",note:"لم يعقب"},
{id:"Z105s3",name:"محمد",g:"M",father:"Z105",mother:"Z105w1",note:"لم يعقب"},
{id:"Z105w2",name:"امّامن (عائشة)",g:"F",father:"K4",mother:"K4w1",note:"بنت اَّكاه (ببكر) بن محمذن بن احجاب بن محمد الكريم — رابط بين الأسرتين؛ بنت اَّكاه (ببكر) بن محمذن بن احجاب — زواج داخلي — ⚠️ تاريخ الميلاد في المصدر الأصلي يتعارض مع وفاة الزوج — قد يكون خطأ OCR في الوثيقة الأصلية",dates:"1344هـ/1926م –",place:"أبير حيبلل",spouses:["Z105","K30"],crossLink:true},
{id:"Z107",para:107,name:"ممّن (محمذيني)",g:"M",father:"Z105",mother:"Z105w2",dates:"1289هـ/1872م – 1361هـ/1942م",place:"تنيخلف",spouses:["Z107w1","Z107w2","Z107w3","Y62d1","I11d1"]},
{id:"Z131",para:131,name:"ايمين (الأمين)",g:"M",father:"Z105",mother:"Z105w2",dates:"1294هـ/1877م – 1401هـ/1981م",place:"أبير حيبلل",spouses:["P20d3","Z131w2","V24d1"]},
{id:"Z139",para:139,name:"الحسن",g:"M",father:"Z105",mother:"Z105w2",dates:"1297هـ/1880م – 1388هـ/1920م",place:"الجراريو",spouses:["Y84d1","Z139w2"]},
{id:"Z105s4",name:"أحمد الكوري",g:"M",father:"Z105",mother:"Z105w2",place:"المذرذره",note:"لم يعقب"},
{id:"Z106w1",name:"خدخية",g:"F",father:"W5",dates:"1364هـ/1945م –",place:"النباغيو (العكلو)",spouses:["Z106"],fullName:"خدخية بنت امّم بن محمد بن عبد الله بن محمودن",ext:true},
{id:"Z106s1",name:"فالن",g:"M",father:"Z106",mother:"Z106w1",note:"مات صغيرًا"},
{id:"Z107w1",name:"هاوا",g:"F",father:"I11",mother:"I11w1",place:"تفنانيت",spouses:["Z107"]},
{id:"Z107w2",name:"امرام",g:"F",father:"K90",mother:"K67d3",note:"رابط بين الأسرتين",place:"شك الخيمو",spouses:["Z107"],crossLink:true,fullName:"امرام بنت حمم بن انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم"},
{id:"Z108",para:108,name:"محم",g:"M",father:"Z107",mother:"Z107w2",dates:"1331هـ/1913م – 1429هـ/2008م",place:"أبير حيبلل",spouses:["Z108w1"]},
{id:"Z113",para:113,name:"ديد",g:"M",father:"Z107",mother:"Z107w2",dates:"1333هـ/1915م –",place:"محجوبو",spouses:["Z113w1","Z113w2"]},
{id:"Z107w3",name:"توت",g:"F",father:"R16",mother:"K154d1",dates:"1304هـ/1887م – 1399هـ/1979م",place:"أبير حيبلل",spouses:["Z107"],fullName:"توت بنت محم بن أحمّذ بن ياحمّذ بن بابارميد بن أحمد زروق"},
{id:"Z117",para:117,name:"أحمد",g:"M",father:"Z107",mother:"Z107w3",dates:"1341هـ/1923م – 1423هـ/2002م",place:"أبير حيبلل",spouses:["Z117w1"]},
{id:"Z123",para:123,name:"السيد",g:"M",father:"Z107",mother:"Z107w3",dates:"1342هـ/1924م – 1430هـ/2009م",place:"اركيز",spouses:["Z123w1","Z123w2","I18d4","D97d2"]},
{id:"Z127",para:127,name:"الحسين",g:"M",father:"Z107",dates:"1361هـ/1942م –",spouses:["Z127w1","Z127w2","Z127w3"]},
{id:"Z108w1",name:"مريم",g:"F",father:"M11",mother:"M11w1",note:"رابط بين الأسرتين",dates:"1337هـ/1919م – 1424هـ/2003م",place:"أبير حيبلل",spouses:["Z108"],crossLink:true,fullName:"مريم بنت محمذن بن أحمد بن المختار بن محمذن بن الغالي بن باركلل بن بوالماح بن متيلي"},
{id:"Z109",para:109,name:"محمدن",g:"M",father:"Z108",mother:"Z108w1",dates:"1370هـ/1951م –",spouses:["Z109w1"]},
{id:"Z110",para:110,name:"محمد",g:"M",father:"Z108",mother:"Z108w1",dates:"1372هـ/1953م – 1422هـ/2001م",place:"أبير حيبلل",spouses:["Z52w2"]},
{id:"Z111",para:111,name:"عبد الله",g:"M",father:"Z108",mother:"Z108w1",dates:"1380هـ/1961م –",spouses:["Z111w1"]},
{id:"Z112",para:112,name:"عبد الرحمن",g:"M",father:"Z108",mother:"Z108w1",dates:"1388هـ/1968م –",spouses:["Z112w1","Z112w2"]},
{id:"Z109w1",name:"الزهراء",g:"F",father:"P41",mother:"P41w1",note:"رابط بين الأسرتين",dates:"1379هـ/1960م –",spouses:["Z109"],crossLink:true},
{id:"Z111w1",name:"افروح (مريم)",g:"F",father:"F99",dates:"1402هـ/1982م –",spouses:["Z111"],crossLink:true,fullName:"افروح (مريم) بنت أحمد بن أحمد سالم بن الكوري بن بازيد بن محمذن بن الفالي بن المبارك بن اما (الماقور)",mother:"F26d1"},
{id:"Z112w1",name:"خدجية",g:"F",father:"Z127",note:"بنت الحسين بن ممّن (محمذيني) بن سيد بن محمد بن الأمين بن محم بن أبو الحس بن المزضف — رابط بين الأسرتين",dates:"1403هـ/1983م –",spouses:["Z112"],crossLink:true},
{id:"Z112w2",name:"الشفاء",g:"F",father:"XA555",spouses:["Z112"],ext:true},
{id:"Z113w1",name:"اللو",g:"F",father:"XA556",spouses:["Z113"],ext:true},
{id:"Z113w2",name:"عيشه فال",g:"F",father:"F91",mother:"F91w2",dates:"1337هـ/1919م – 1436هـ/2015م",place:"دليلحو",spouses:["Z113","K34"],crossLink:true},
{id:"Z114",para:114,name:"ممّن",g:"M",father:"Z113",mother:"Z113w2",dates:"1368هـ/1949م –",spouses:["Z114w1"]},
{id:"Z116",para:116,name:"عبد الله",g:"M",father:"Z113",mother:"Z113w2",dates:"1378هـ/1959م –",spouses:["Z116w1"]},
{id:"Z114w1",name:"خدجية",g:"F",father:"Z123",dates:"1376هـ/1957م – 1407هـ/1987م",place:"انواكشوط",spouses:["Z114"],fullName:"خدجية بنت السيد بن ممّن (محمذين) بن سيد بن محمد بن الأمين بن حمم بن أبو الحس"},
{id:"Z115",para:115,name:"اماني (محمد الأمين)",g:"M",father:"Z114",mother:"Z114w1",dates:"1407هـ/1987م –",spouses:["R72d1"]},
{id:"Z116w1",name:"فلانة -آزنافري-",g:"F",father:null,spouses:["Z116"]},
{id:"Z117w1",name:"نكمبه",g:"F",father:"Z51",mother:"Z51w1",dates:"1358هـ/1939م –",spouses:["Z117"],fullName:"نكمبه بنت محمد بن ادّد (أحمد) بن الداه (عبد الله) بن أحمد بن محمد الباقر بن حمم بن أبو الحس بن المزضف"},
{id:"Z118",para:118,name:"محمد الحبيب",g:"M",father:"Z117",mother:"Z117w1",dates:"1376هـ/1957م –",spouses:["Z118w1","Z153d2"]},
{id:"Z119",para:119,name:"أحمد",g:"M",father:"Z117",mother:"Z117w1",dates:"1380هـ/1961م –",spouses:["Z119w1"]},
{id:"Z120",para:120,name:"محمدن",g:"M",father:"Z117",mother:"Z117w1",dates:"1386هـ/1966م –",spouses:["K101d2"]},
{id:"Z121",para:121,name:"ممّن",g:"M",father:"Z117",mother:"Z117w1",dates:"1392هـ/1972م –",spouses:["Z121w1"]},
{id:"Z117s1",name:"محمد الأمين",g:"M",father:"Z117",mother:"Z117w1",dates:"1394هـ/1974م –"},
{id:"Z122",para:122,name:"يحي",g:"M",father:"Z117",mother:"Z117w1",dates:"1398هـ/1978م –",spouses:["Z122w1","Z122w2"]},
{id:"Z117s2",name:"اباه",g:"M",father:"Z117",mother:"Z117w1",dates:"1401هـ/1981م –"},
{id:"Z118w1",name:"الشفاء",g:"F",father:"XA560",dates:"1371هـ/1952م –",spouses:["Z118"],ext:true},
{id:"Z119w1",name:"متتان (امباركه)",g:"F",father:"Z137",dates:"1398هـ/1978م –",spouses:["Z119"],fullName:"متتان (امباركه) بنت ديد بن اديني (الأمين) بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z121w1",name:"فرحه",g:"F",father:"Z145",mother:"Z145w1",note:"زواج داخلي بالأسرة",dates:"1407هـ/1987م –",spouses:["Z121"],fullName:"فرحه بنت جمال (أحمد) بن محمد عبد الله بن الحسن بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z122w1",name:"فضيله",g:"F",father:"Y1",dates:"1406هـ/1986م –",spouses:["Z122"]},
{id:"Z122w2",name:"فلانة -إلى اشفغ موسى-",g:"F",father:null,spouses:["Z122"]},
{id:"Z123w1",name:"ابوّه",g:"F",father:"D81",place:"أبير حيبلل",spouses:["Z123"],fullName:"ابوّه بنت مني بن التجاني بن الصالح بن حمم بن المختار باب بن سيد (المختار) بن عبد الله"},
{id:"Z123w2",name:"عائشة",g:"F",father:"D97",dates:"1344هـ/1926م – 1431هـ/2010م",place:"اركيز",spouses:["Z123"],fullName:"عائشة بنت أحمّذ بن أحممد فال بن محنض بن اعلجئذن بن بتاجه بن محمذن بن سيد (المختار)"},
{id:"Z124",para:124,name:"ممّن",g:"M",father:"Z123",mother:"Z123w2",dates:"1375هـ/1955م –",spouses:["F112w1","Z124w2"]},
{id:"Z125",para:125,name:"الحسن",g:"M",father:"Z123",mother:"Z123w2",dates:"1377هـ/1958م –",spouses:["Z125w1"]},
{id:"Z126",para:126,name:"محمدن",g:"M",father:"Z123",mother:"Z123w2",dates:"1386هـ/1966م –",spouses:["Z126w1"]},
{id:"Z124w2",name:"محجوبه",g:"F",father:"I77",dates:"1388هـ/1968م –",spouses:["Z124"],mother:"I77w1",note:"أم محمد يحي بن محمد لمين بن امد -مدلش-؛ أم صغار أبناء من (محمذين) بن سيد بن محمد بن الأمين بن حمم بن ابو الحس بن المزضف"},
{id:"Z125w1",name:"عائشة (منت محمدي)",g:"F",father:"Z117",mother:"Z117w1",dates:"1390هـ/1970م –",spouses:["Z125"],fullName:"عائشة (منت محمدي) بنت أحمد بن ممّن (محمذين) بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z126w1",name:"سهام",g:"F",father:"G92",dates:"1397هـ/1977م –",spouses:["Z126"],fullName:"سهام بنت محمد بن وَّاليل (سيد الفالي) بن بييين بن امحيد بن المزضف بن الأمين بن اشفغ مينحنو",mother:"G92w1",note:"أم ملكو من بنات السيد بن محمدن بن أحمد سالم بن أحمد بن محمد فال بن ابن غازي بن آلچ (الفالي)، وأم أبناء محمدن بن السيد بن من (محمذين) بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z127w1",name:"اخريبيشه (زينب)",g:"F",father:"W1",mother:"W1w1",dates:"1428هـ/2007م –",place:"أحسي السعادة",spouses:["Z127"],crossLink:true,fullName:"اخريبيشه (زينب) بنت محمد بن أحمد -اتواجي-"},
{id:"Z128",para:128,name:"ممّن الأمين",g:"M",father:"Z127",mother:"Z127w1",dates:"1386هـ/1966م –",spouses:["K101d1"]},
{id:"Z127w2",name:"ممّي",g:"F",father:"XA503",spouses:["Z127"],ext:true},
{id:"Z129",para:129,name:"بدبّد",g:"M",father:"Z127",mother:"Z127w2",dates:"1392هـ/1972م –",spouses:["Z129w1"]},
{id:"Z130",para:130,name:"محمد المامي",g:"M",father:"Z127",mother:"Z127w2",dates:"1395هـ/1975م –",spouses:["Z130w1","Z130w2"]},
{id:"Z127w3",name:"الجيله (اماته)",g:"F",father:"I7",mother:"I7w2",dates:"1381هـ/1962م –",note:"بنت أحمد بن أحممد بن ميلود بن سيد أحمد بن حبلل بن ابراهيم — قد تكون نفس I7d2/اچليلو (نفس التاريخ) — إلى تحقيق؛ أم الدّاه وخدجية من أبناء الحسين بن من (محمذين) بن سيد بن محمد بن الأمين بن حمم بن ابو الحس بن المزضف",spouses:["Z127"],crossLink:true},
{id:"Z129w1",name:"دلليحه",g:"F",father:"XA562",spouses:["Z129"],ext:true},
{id:"Z130w1",name:"زينب",g:"F",father:"XA1100",dates:"1403هـ/1983م –",spouses:["Z130"]},
{id:"Z130w2",name:"اتفاك",g:"F",father:"Z143",mother:"Z143w1",note:"زواج داخلي بالأسرة",dates:"1401هـ/1981م –",spouses:["Z130"],fullName:"اتفاك بنت أحمد بن محمد عبد الله بن الحسن بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z131s1",name:"ولد حبيب الرحمن",g:"M",father:"Z131",dates:"1335هـ/1917م –",note:"لم يعقب"},
{id:"Z131w2",name:"عيشان",g:"F",father:"Y93",mother:"M24d3",note:"بنت الربا (البرا) بن بگي (أبوبكر) بن سيد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين — رابط بين الأسرتين",dates:"1375هـ/1955م –",place:"أبير حيبلل",spouses:["Z131"],crossLink:true},
{id:"Z132",para:132,name:"البرا",g:"M",father:"Z131",mother:"Z131w2",dates:"1339هـ/1921م – 1394هـ/1974م",place:"أبير حيبلل",spouses:["Z132w1"]},
{id:"Z137",para:137,name:"ديد",g:"M",father:"Z131",mother:"V24d1",dates:"1361هـ/1942م –",spouses:["Z137w1","Z137w2","Z137w3"]},
{id:"Z132w1",name:"عايشا",g:"F",father:"Y85",dates:"1354هـ/1935م –",spouses:["Z132"]},
{id:"Z133",para:133,name:"يحي",g:"M",father:"Z132",mother:"Z132w1",dates:"1377هـ/1958م –",spouses:["F72d1"]},
{id:"Z134",para:134,name:"محمد الأمين",g:"M",father:"Z132",mother:"Z132w1",dates:"1382هـ/1963م –",spouses:["Z134w1"]},
{id:"Z135",para:135,name:"أحمد",g:"M",father:"Z132",mother:"Z132w1",dates:"1390هـ/1970م –",spouses:["Z135w1"]},
{id:"Z136",para:136,name:"محمدن",g:"M",father:"Z132",mother:"Z132w1",dates:"1390هـ/1970م –",spouses:["Z136w1"]},
{id:"Z134w1",name:"لبابه (خدجية)",g:"F",father:"XA1218",dates:"1387هـ/1967م –",spouses:["Z134"],ext:true},
{id:"Z135w1",name:"عائشة",g:"F",father:"G92",dates:"1400هـ/1980م –",spouses:["Z135"],fullName:"عائشة بنت محمد بن وَّاليل (سيد الفالي) بن بييين بن امحيد بن المصطفى بن الأمين بن اشفغ مينحنو"},
{id:"Z136w1",name:"هدى (عائشة)",g:"F",father:"Z137",dates:"1400هـ/1980م –",spouses:["Z136"],fullName:"هدى (عائشة) بنت ديد بن اديني (الأمين) بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z137w1",name:"ابيبه",g:"F",father:"Z16",mother:"K73d1",dates:"1375هـ/1955م –",spouses:["Z137"]},
{id:"Z137w2",name:"امينه",g:"F",father:"P19",mother:"P8d1",note:"بنت هيدي (سيد) بن ابو (محمد) بن اَّمي بن محمد بن محمذن بن عركاب (حمم) بن ابوبا بن ماهي — رابط بين الأسرتين",dates:"1378هـ/1959م –",spouses:["Z137"],crossLink:true},
{id:"Z138",para:138,name:"محمد محمود",g:"M",father:"Z137",mother:"Z137w2",dates:"1395هـ/1975م –",spouses:["Z138w1","Y99d2"]},
{id:"Z137w3",name:"السالمه",g:"F",father:"I35",dates:"1372هـ/1953م –",spouses:["Z137"],crossLink:true,fullName:"السالمه بنت أحمد بن اميو (محمذن) بن سيد أحممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم",mother:"I35w1",note:"أم محمد عبد الله واميين وفرحو وامم من أبناء ديد بن اميين (الأمين) بن سيد بن محمد بن الأمين بن حمم بن ابو الحس بن المزضف"},
{id:"Z138w1",name:"ورده",g:"F",father:"Y99",dates:"1400هـ/1980م –",spouses:["Z138"]},
{id:"Z139w2",name:"بنت خويلد",g:"F",father:"Z73",mother:"Z73w3",dates:"1304هـ/1887م – 1395هـ/1975م",place:"أبير حيبلل",spouses:["Z139"],fullName:"بنت خويلد بنت أحمد بن ابن عبدم بن عبد الله بن الأمين بن حمم بن أبو الحس"},
{id:"Z140",para:140,name:"محمد عبد الله",g:"M",father:"Z139",mother:"Z139w2",dates:"1335هـ/1917م – 1407هـ/1987م",place:"أبير حيبلل",spouses:["Z140w1","Z140w2","Z140w3"]},
{id:"Z140w1",name:"أم الخيري",g:"F",father:"Z74",mother:"Z74w1",note:"زواج داخلي بالأسرة",dates:"1341هـ/1923م – 1435هـ/2014م",place:"أبير حيبلل",spouses:["Z140","P40"],fullName:"أم الخيري بنت مام (محمد) بن أحمد بن ابن عبدم بن عبد الله بن الأمين بن حمم"},
{id:"Z141",para:141,name:"يحي",g:"M",father:"Z140",mother:"Z140w1",dates:"1365هـ/1946م –",spouses:["Z141w1"]},
{id:"Z143",para:143,name:"أحمد",g:"M",father:"Z140",mother:"Z140w1",dates:"1368هـ/1949م – 1433هـ/2012م",place:"أبير حيبلل",spouses:["Z143w1"]},
{id:"Z140w2",name:"محجوبه",g:"F",father:"XA570",dates:"1354هـ/1935م – 1437هـ/2016م",place:"شكار",spouses:["Z140"],ext:true},
{id:"Z144",para:144,name:"الحسن",g:"M",father:"Z140",mother:"Z140w2",dates:"1372هـ/1953م –",spouses:["Z144w1","Z144w2"]},
{id:"Z140w3",name:"حاجه",g:"F",father:"Z74",mother:"Z74w2",note:"زواج داخلي بالأسرة",dates:"1357هـ/1938م –",spouses:["Z140","K37"],fullName:"حاجه بنت مام (محمد) بن أحمد بن ابن عبدم بن عبد الله بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z145",para:145,name:"جمال (أحمد)",g:"M",father:"Z140",mother:"Z140w3",dates:"1378هـ/1959م – 1422هـ/2001م",place:"أبير حيبلل",spouses:["Z145w1"]},
{id:"Z146",para:146,name:"محمدن",g:"M",father:"Z140",spouses:["P13d3"]},
{id:"Z147",para:147,name:"محمد المختار",g:"M",father:"Z140",dates:"1390هـ/1970م –",spouses:["P27d1"]},
{id:"Z141w1",name:"كوريه (فاطمة)",g:"F",father:"F7",mother:"F7w1",dates:"1382هـ/1963م –",spouses:["Z141"],fullName:"كوريه (فاطمة) بنت أحمد بن أحمد ادّاه بن حمم بن محمذن بن حلويج بن العادل بن اما (الماقور)"},
{id:"Z142",para:142,name:"سوار (محمد عبد الله)",g:"M",father:"Z141",mother:"Z141w1",dates:"1405هـ/1985م –",spouses:["Z142w1"]},
{id:"Z141s1",name:"أحمد",g:"M",father:"Z141",mother:"Z141w1",dates:"1406هـ/1986م –"},
{id:"Z141d1",name:"مريم",g:"F",father:"Z141",mother:"Z141w1",dates:"1408هـ/1988م –" ,spouses:["K127"] ,crossLink:true},
{id:"Z141d2",name:"أم الخيري",g:"F",father:"Z141",mother:"Z141w1",dates:"1413هـ/1993م –",note:"أم أم الخيري بنت مام (محمد) بن ددّايل بن الحسن بن اتّو (الكوري) بن محمذن بن سيد الفالي بن بنيوك (محمذن) بن المختار بن محمد الكريم"},
{id:"Z142w1",name:"خدجية",g:"F",father:"Z144",mother:"Z144w1",note:"زواج داخلي بالأسرة",dates:"1409هـ/1989م –",spouses:["Z142"],fullName:"خدجية بنت الحسن بن محمد عبد الله بن الحسن بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z143w1",name:"فاطمة",g:"F",father:"XA572",dates:"1371هـ/1952م –",spouses:["Z143"],ext:true},
{id:"Z144w1",name:"فتيه (عيشه)",g:"F",father:"Z75",mother:"Z75w1",note:"زواج داخلي بالأسرة",dates:"1387هـ/1967م –",spouses:["Z144"],fullName:"فتيه (عيشه) بنت ابن بن مام (محمد) بن أحمد بن ابن عبدم بن عبد الله بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z144w2",name:"انّاه (خديجة)",g:"F",father:"Z78",mother:"Z78w1",note:"زواج داخلي بالأسرة",dates:"1409هـ/1989م –",spouses:["Z144"],fullName:"انّاه (خديجة) بنت يسلم بن مام (محمد) بن أحمد بن ابن عبدم بن عبد الله بن الأمين بن حمم"},
{id:"Z145w1",name:"ففه",g:"F",father:"Y18",dates:"1388هـ/1968م –",spouses:["Z145"],mother:"Y18w1",note:"أم أبناء جمال (احمد) بن محمد عبد الله بن الحسن بن سيد بن محمد بن الأمين بن حمم بن المزضف"},
{id:"Z148",para:148,name:"محمذن",g:"M",father:"Z70",mother:"Z70w3",spouses:["Z148w1","Z148w2"]},
{id:"Z148w1",name:"اخدجيات (خدجية)",g:"F",father:"Z46",mother:"Z49w1",spouses:["Z148"],fullName:"اخدجيات (خدجية) بنت أحمد بن محمد الباقر بن حمم بن أبو الحس بن المزضف"},
{id:"Z148w2",name:"ما اتواسي العار (فاطمة)",g:"F",father:"Y106",spouses:["Z148"]},
{id:"Z149w1",name:"مريم",g:"F",father:"Z20",place:"أبير حيبلل",spouses:["Z149","F44"],fullName:"مريم بنت بوبكر بن حمم بن أبو الحس بن المزضف",mother:"Z20w2"},
{id:"Z150",para:150,name:"آياه (بوبكر)",g:"M",father:"Z149",mother:"Z149w1",place:"أبير حيبلل",spouses:["Z150w1","Y128d3","Z150w3"]},
{id:"Z150w1",name:"امّات",g:"F",father:"F80",mother:"F80w2",spouses:["Z150"],crossLink:true,fullName:"امّات بنت محمذن بن بازيد بن محمذن بن الفالي بن المبارك بن اما (الماقور)"},
{id:"Z151",para:151,name:"محمد محمود",g:"M",father:"Z150",mother:"Z150w1",spouses:["Z151w1"]},
{id:"Z150w3",name:"ميّم",g:"F",father:null,dates:"1307هـ/1890م – 1402هـ/1982م",place:"أبير حيبلل",spouses:["Z150"],note:"أم أحمد بن محمد بن اتاه (المختار) بن بيبات؛ أم محمدن وفاطمة ابني حمادن بن محمد بن محمذن بن أحمد البزي بن آلچ (الفالي)"},
{id:"Z152",para:152,name:"دمّين (سيد الأمين)",g:"M",father:"Z150",mother:"Y128d3",dates:"1358هـ/1939م –",place:"كولخ (سنغال)",spouses:["Z152w1","Z152w2"]},
{id:"Z156",para:156,name:"محمدن",g:"M",father:"Z150",mother:"Y128d3",dates:"1355هـ/1936م –",spouses:["I96d3","K62d2"]},
{id:"Z151w1",name:"دلات",g:"F",father:"F89",mother:"F89w2",spouses:["Z151"],crossLink:true,fullName:"دلات بنت أحمد بن محمذن بن بازيد بن محمذن بن الفالي بن المبارك بن اما (الماقور)"},
{id:"Z151s1",name:"الأمين",g:"M",father:"Z151",mother:"Z151w1",note:"لم يعقب"},
{id:"Z152w1",name:"امّامه (أم الخيري)",g:"F",father:"F32",mother:"F32w1",dates:"1307هـ/1890م – 1402هـ/1982م",place:"أبير حيبلل",spouses:["Z152"],crossLink:true,fullName:"أم الخيري بنت الكوري بن أحمد فال بن الفالي بن المبارك بن اما (الماقور)",note:"أم أبناء دمّين (سيد الأمين) بن آياه (بوبكر) بن أحمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z152w2",name:"عائشة",g:"F",father:null,place:"أبير حيبلل",spouses:["Z152"],note:"لم تعقب"},
{id:"Z153",para:153,name:"أحمد سالم",g:"M",father:"Z152",mother:"Z152w1",dates:"1352هـ/1933م –",spouses:["Z153w1","Z153w2"]},
{id:"Z155",para:155,name:"عبد الله",g:"M",father:"Z152",mother:"Z152w1",dates:"1357هـ/1938م –",spouses:["Z155w1"]},
{id:"Z153w1",name:"عائشة",g:"F",father:"XA375",dates:"1430هـ/2009م –",place:"انتيشط",spouses:["Z153"],ext:true},
{id:"Z153w2",name:"توت",g:"F",father:"XA579",dates:"1413هـ/1994م –",place:"انتفاشيت",spouses:["Z153"],ext:true},
{id:"Z153d1",name:"فاطمة",g:"F",father:"Z153",mother:"Z153w1",dates:"1390هـ/1970م –"},
{id:"Z154",para:154,name:"أحمد فال",g:"M",father:"Z153",mother:"Z153w2",dates:"1388هـ/1968م –",spouses:["E34d3","Z88w1"]},
{id:"Z153s1",name:"ابن",g:"M",father:"Z153",mother:"Z153w2",dates:"1393هـ/1973م –"},
{id:"Z153d2",name:"اميننتاه (عائشة)",g:"F",father:"Z153",mother:"Z153w2",dates:"1396هـ/1976م –",note:"أم صغار أبناء محمد الحبيب بن أحمد بن نمّن (محمذين) بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف",fullName:"امنّتاه (عائشة) بنت أحمد سالم بن ندمّي (سيد الأمين) بن آياه (بوبكر) بن أحمد بن الأمين بن حمم بن أبو الحس",spouses:["Z118"]},
{id:"Z155w1",name:"باته",g:"F",father:"Z132",spouses:["Z155"],fullName:"باته بنت الربا بن اديني (الأمين) بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Z155s1",name:"الأستاذ (البرا)",g:"M",father:"Z155",mother:"Z155w1",dates:"1396هـ/1976م –"},
{id:"Z156s1",name:"أحمد سالم",g:"M",father:"Z156",mother:"I96d3",note:"لم يعقب"},
{id:"Z156s2",name:"السيد",g:"M",father:"Z156",mother:"I96d3",dates:"1348هـ/1930م –",note:"لم يعقب"},
{id:"Z156d1",name:"فاطمة",g:"F",father:"Z156",mother:"K62d2",dates:"1402هـ/1982م –",note:"لم تعقب"},
{id:"Y1",para:1,name:"اشفغ الأمين",g:"M",father:"T0",dates:"1010هـ/1602م – 1101هـ/1690م",place:"باجليالي",note:"بن سيد الفالي",spouses:["Y1w1","Y1w2"]},
{id:"Y2",para:2,name:"محنض",g:"M",father:"Y1",mother:"Y1w1",dates:"1043هـ/1634م – 1084هـ/1673م",place:"ترتالس",spouses:["Y2w1"]},
{id:"Y3",para:3,name:"والد",g:"M",father:"Y2",mother:"Y2w1",spouses:["Y3w1","Y3w2"]},
{id:"Y4",para:4,name:"حبلل",g:"M",father:"Y1",mother:"Y1w1",dates:"1047هـ/1638م –",place:"تنيخلف",spouses:["Y4w1","Y4w2"]},
{id:"Y5",para:5,name:"ايتاب",g:"M",father:"Y4",mother:"Y4w2",spouses:["Y5w1"]},
{id:"Y6",para:6,name:"سيد",g:"M",father:"Y5",mother:"Y5w1",spouses:["Y121d1","Y125d1"]},
{id:"Y7",para:7,name:"امحيمدا",g:"M",father:"Y6",mother:"Y121d1",spouses:["Y7w1"]},
{id:"Y8",para:8,name:"محمذن",g:"M",father:"Y5",mother:"Y5w1",spouses:["Y8w1","Y8w2"]},
{id:"Y9",para:9,name:"سيد الفالي",g:"M",father:"Y8",mother:"Y8w1",spouses:["Y9w1"]},
{id:"Y10",para:10,name:"محمد مولود",g:"M",father:"Y5",mother:"Y5w1",spouses:["Y10w1"]},
{id:"Y11",para:11,name:"المعزوز",g:"M",father:"Y1",mother:"Y1w1",dates:"1051هـ/1641م – 1130هـ/1718م",place:"قرب تنيخلف",spouses:["Y11w1","Y11w2"]},
{id:"Y12",para:12,name:"اللديب",g:"M",father:"Y11",mother:"Y11w1",spouses:["Y12w1","Y118d5","Y12w3"]},
{id:"Y13",para:13,name:"ابن",g:"M",father:"Y12"},
{id:"Y14",para:14,name:"احمد",g:"M",father:"Y12",mother:"Y12w1",spouses:["Y14w1"]},
{id:"Y15",para:15,name:"اگذواچي (سيد عبد الله)",g:"M",father:"Y14",mother:"Y14w1",place:"تينشيكل",spouses:["Y15w1"]},
{id:"Y16",para:16,name:"محمذن",g:"M",father:"Y15",mother:"Y15w1",spouses:["Y16w1"]},
{id:"Y16w1",name:"زوجة",g:"F",father:"P51",mother:"I25d1",note:"بنت عبد الله بن محمذن بن كامل بن حبلل بن ماهي — رابط بين الأسرتين",spouses:["Y16"],crossLink:true},
{id:"Y17",para:17,name:"محمد",g:"M",father:"Y16",mother:"Y16w1",dates:"…؟… – 1341هـ/1923م",place:"ابير حيبلل",spouses:["Y17w1"]},
{id:"Y18",para:18,name:"السيد",g:"M",father:"Y17",mother:"Y17w1",dates:"1337هـ/1919م – 1432هـ/2011م",place:"ابير حيبلل",spouses:["Y18w1"]},
{id:"Y19",para:19,name:"سيد ميلو (أحمد)",g:"M",father:"Y18",mother:"Y18w1",dates:"1392هـ/1972م –",spouses:["Y19w1","Y19w2"]},
{id:"Y20",para:20,name:"عمر",g:"M",father:"Y12",mother:"Y118d5",place:"تينشيكل",spouses:["Y20w1"]},
{id:"Y21",para:21,name:"محمذن",g:"M",father:"Y20",mother:"Y20w1",dates:"…؟… – 1277هـ/1861م",place:"تنيخلف",spouses:["Y121d3"]},
{id:"Y22",para:22,name:"المختار",g:"M",father:"Y11",mother:"Y11w2",place:"ابير حيبلل",spouses:["Y22w1"]},
{id:"Y23",para:23,name:"حرمه",g:"M",father:"Y22",mother:"Y22w1",place:"ابير حيبلل",spouses:["Y23w1"]},
{id:"Y23w1",name:"ديجات (اخديجات)",g:"F",father:"I2",mother:"I2w1",place:"تينشيكل",note:"بنت حبلل بن ابراهيم — زوجة حرمه، رابط بين الأسرتين",spouses:["Y23"],crossLink:true},
{id:"Y23s1",name:"زين",g:"M",father:"Y23",mother:"Y23w1",note:"لم يعقب"},
{id:"Y23s2",name:"المعزوز",g:"M",father:"Y23",mother:"Y23w1",note:"لم يعقب"},
{id:"Y23d1",name:"منت النبي",g:"F",father:"Y23",mother:"Y23w1",place:"آوسرد",note:"أم محمد بن حبلل بن الأمين بن اشفغ حبلل"},
{id:"Y24",para:24,name:"بابكر",g:"M",father:"Y23",mother:"Y23w1",place:"تينشيكل",spouses:["Y24w1"]},
{id:"Y25",para:25,name:"جد ام",g:"M",father:"Y24",mother:"Y24w1",place:"تنشيكل",spouses:["Z70d3","Y25w2","Y25w3"]},
{id:"Y30",para:30,name:"الجمد (أحمد)",g:"M",father:"Y23",mother:"Y23w1",place:"اغزكريت",spouses:["Y30w1"]},
{id:"Y31",para:31,name:"بكاك (ببكر)",g:"M",father:"Y30",mother:"Y30w1",place:"تنيشيكل",spouses:["K3d1","Y31w2","Y31w3","E4d2"]},
{id:"Y36",para:36,name:"المختار",g:"M",father:"Y35",mother:"Y35w1",dates:"1294هـ/1877م –",spouses:["Y133d2","Y34d1"]},
{id:"Y37",para:37,name:"الشريف",g:"M",father:"Y36",mother:"Y133d2",dates:"…؟… – 1361هـ/1942م",spouses:["Y47d2"]},
{id:"Y38",para:38,name:"محمذن",g:"M",father:"Y35",mother:"Y35w1",dates:"1298هـ/1881م – 1362هـ/1943م",place:"ابير حيبلل",spouses:["Y38w1"]},
{id:"Y39",para:39,name:"الهادي",g:"M",father:"Y38",mother:"Y38w1",dates:"1339هـ/1921م – 1413هـ/1993م",place:"لميلحو",spouses:["Y65d1"]},
{id:"Y40",para:40,name:"محمد المختار",g:"M",father:"Y39",mother:"Y65d1",dates:"1376هـ/1957م –",spouses:["Y40w1"]},
{id:"Y41",para:41,name:"بگي",g:"M",father:"Y39",mother:"Y65d1",dates:"1382هـ/1963م –",spouses:["Y41w1"]},
{id:"Y42",para:42,name:"محمذن",g:"M",father:"Y39",mother:"Y65d1",dates:"1386هـ/1967م –",spouses:["Y42w1"]},
{id:"Y43",para:43,name:"محمدن",g:"M",father:"Y39",mother:"Y65d1",dates:"1388هـ/1968م –",spouses:["Y104d3"]},
{id:"Y44",para:44,name:"عبد الله",g:"M",father:"Y39",mother:"Y65d1",dates:"1396هـ/1976م –",spouses:["Y44w1"]},
{id:"Y45",para:45,name:"الصالح",g:"M",father:"Y35",mother:"Y35w1",dates:"1303هـ/1886م – 1347هـ/1929م",spouses:["Y45w1"]},
{id:"Y46",para:46,name:"حَ ـمَّين (محمذن)",g:"M",father:"Y45",mother:"Y45w1",dates:"1347هـ/1929م – 1423هـ/2002م",place:"ابير حيبلل",spouses:["Y46w1","M40d1","Y46w3"]},
{id:"Y46w1",name:"زوجة",g:"F",father:"M40",mother:"M40w1",note:"بنت الخليفه بن اَّمم (محمذن) بن اگّي (الكوري)... بن الفالي بن متيلي — رابط بين الأسرتين",spouses:["Y46"],crossLink:true},
{id:"Y48",para:48,name:"حميني (محمد)",g:"M",father:"Y30",mother:"Y30w1",place:"اغزكريت",spouses:["Y48w1","Y48w2"]},
{id:"Y48w1",name:"زوجة",g:"F",father:"K122",note:"بنت سيد الفالي بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",spouses:["Y48"],crossLink:true},
{id:"Y49",para:49,name:"سيد",g:"M",father:"Y48",mother:"Y48w1",place:"تينشيكل",spouses:["Y49w1"]},
{id:"Y50",para:50,name:"محمد",g:"M",father:"Y49",mother:"Y49w1",dates:"…؟… – 1379هـ/1960م",place:"ابير حيبلل",spouses:["Y50w1"]},
{id:"Y51",para:51,name:"محمد فال",g:"M",father:"Y50",mother:"Y50w1",dates:"1351هـ/1932م – 1402هـ/1982م",place:"ابير حيبلل",spouses:["Y51w1"]},
{id:"Y52",para:52,name:"الكوري",g:"M",father:"Y48",mother:"Y48w1",place:"اكدرنيت",spouses:["Y52w1","Y52w2"]},
{id:"Y53",para:53,name:"المختار",g:"M",father:"Y48",mother:"Y48w1",spouses:["Y53w1"]},
{id:"Y53w1",name:"زوجة",g:"F",father:"K83",mother:"K83w1",note:"بنت المختار باب بن بناي بن عاون بن محمد الكريم — رابط بين الأسرتين",spouses:["Y53"],crossLink:true},
{id:"Y54",para:54,name:"المختار",g:"M",father:"Y30",mother:"Y30w1",spouses:["Y57d1","Y54w2"]},
{id:"Y55",para:55,name:"حبيب",g:"M",father:"Y54",mother:"Y57d1",spouses:["Y55w1"]},
{id:"Y56",para:56,name:"محمد",g:"M",father:"Y55",mother:"Y55w1",spouses:["Y56w1"]},
{id:"Y57",para:57,name:"حيب الله",g:"M",father:"Y23",mother:"Y23w1",place:"تينشيكل",spouses:["Y57w1","Y57w2","Y12d1"]},
{id:"Y57w1",name:"زوجة",g:"F",father:"K85",mother:"K85w1",note:"بنت بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",spouses:["Y57"],crossLink:true},
{id:"Y70",para:70,name:"محمد",g:"M",father:"Y57",mother:"Y57w1",place:"اعكيلت الوزغو",spouses:["Z70d5"]},
{id:"Y71",para:71,name:"سيد احمد",g:"M",father:"Y70",mother:"Z70d5",place:"ابير حيبلل",spouses:["Y71w1"]},
{id:"Y71w1",name:"خديجة",g:"F",father:"K90",mother:"K90w2",note:"بنت حمم بن انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",spouses:["Y71"],crossLink:true,place:"أبير حيبلل"},
{id:"Y72",para:72,name:"احمد",g:"M",father:"Y71",mother:"Y71w1",dates:"1361هـ/1942م –",place:"تنكجيج (سنغال)",spouses:["V14d1"]},
{id:"Y73",para:73,name:"المختار",g:"M",father:"Y70",mother:"Z70d5",dates:"1334هـ/1916م –",spouses:["Y73w1"]},
{id:"Y74",para:74,name:"محمد",g:"M",father:"Y73",mother:"Y73w1",dates:"1334هـ/1916م –",place:"احسي اهل المختار",spouses:["Y61d1"]},
{id:"Y75",para:75,name:"الأمين",g:"M",father:"Y70",mother:"Z70d5",place:"اعكيلت الوزغه",spouses:["Y75w1"]},
{id:"Y75w1",name:"زوجة",g:"F",father:"K4",mother:"K4w1",note:"بنت اَّكاه (ببكر) بن محمذن بن احجاب بن محمد الكريم — رابط بين الأسرتين",spouses:["Y75"],crossLink:true},
{id:"Y76",para:76,name:"حامد",g:"M",father:"Y75",mother:"Y75w1",spouses:["Y76w1","Y76w2"]},
{id:"Y77",para:77,name:"محمودن",g:"M",father:"Y75",mother:"Y75w1",dates:"1347هـ/1929م –",place:"تنكجيج (سنغال)",spouses:["Y84d1","Y77w2","Y77w3","G28d2"]},
{id:"Y79",para:79,name:"ديد",g:"M",father:"Y78",mother:"Y78w1",dates:"1374هـ/1955م –",spouses:["Y80d1","Y79w2"]},
{id:"Y81",para:81,name:"الأمين",g:"M",father:"Y80",mother:"Y80w1",dates:"1381هـ/1962م –",spouses:["Y81w1","Y81w2"]},
{id:"Y83w1",name:"حاجه",g:"F",father:"K86",mother:"F135d1",note:"بنت انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",spouses:["Y83"],crossLink:true},
{id:"Y87",para:87,name:"بالهي",g:"M",father:"Y86",mother:"Y86w1",dates:"1359هـ/1940م –",spouses:["Y87w1"]},
{id:"Y89",para:89,name:"المختار اسالم",g:"M",father:"Y88",mother:"Y61d1",dates:"1324هـ/1906م – 1378هـ/1959م",place:"تنيخلف",spouses:["Y50d1"]},
{id:"Y90",para:90,name:"ابَّد (محمد)",g:"M",father:"Y89",mother:"Y50d1",dates:"1363هـ/1944م –",spouses:["J26d1"]},
{id:"Y91",para:91,name:"بگي",g:"M",father:"Y89",mother:"Y50d1",dates:"1367هـ/1948م – 1413هـ/1993م",place:"ابير حيبلل",spouses:["Y91w1"]},
{id:"Y92",para:92,name:"محمد",g:"M",father:"Y91",mother:"Y91w1",spouses:["Y92w1"]},
{id:"Y92w1",name:"زوجة",g:"F",father:"K77",mother:"K77w1",note:"بنت الخليفه بن ديّديه (سيد الأمين) بن محّم بن محمذن ميلود بن حبلل بن عاون بن محمد الكريم — رابط بين الأسرتين",spouses:["Y92"],crossLink:true},
{id:"Y94",para:94,name:"بد (محمد)",g:"M",father:"Y93",mother:"M24d3",dates:"1285هـ/1868م – 1362هـ/1943م",place:"ابير حيبلل",spouses:["Y94w1"]},
{id:"Y95",para:95,name:"ببكر",g:"M",father:"Y94",mother:"Y94w1",dates:"1330هـ/1912م – 1374هـ/1955م",place:"تنيخلف",spouses:["Y159d2","Y146d1"]},
{id:"Y96",para:96,name:"منَّ",g:"M",father:"Y95",mother:"Y159d2",dates:"1359هـ/1940م – 1427هـ/2006م",place:"لميلحه",spouses:["Y96w1","Y96w2"]},
{id:"Y97",para:97,name:"بد (محمد)",g:"M",father:"Y96",mother:"Y96w2",dates:"1395هـ/1975م –",spouses:["Y97w1"]},
{id:"Y98",para:98,name:"محمد الأمين",g:"M",father:"Y96",mother:"Y96w2",dates:"1405هـ/1985م –",spouses:["Y98w1"]},
{id:"Y99",para:99,name:"احمد",g:"M",father:"Y95",mother:"Y146d1",dates:"1364هـ/1945م – 1419هـ/1998م",place:"لكران",spouses:["Y99w1"]},
{id:"Y100",para:100,name:"محمد",g:"M",father:"Y95",mother:"Y146d1",dates:"1367هـ/1948م –",spouses:["Y100w1"]},
{id:"Y101",para:101,name:"عبد الله",g:"M",father:"Y95",mother:"Y146d1",dates:"1370هـ/1951م –",spouses:["Y101w1"]},
{id:"Y102",para:102,name:"ببا (البرا)",g:"M",father:"Y95",mother:"Y146d1",dates:"1374هـ/1955م –",spouses:["Y102w1"]},
{id:"Y103",para:103,name:"احمد",g:"M",father:"Y94",mother:"Y94w1",dates:"1334هـ/1916م – 1364هـ/1945م",place:"ابير حيبلل",spouses:["Y103w1"]},
{id:"Y104",para:104,name:"بد (محمد)",g:"M",father:"Y103",mother:"Y103w1",dates:"1364هـ/1945م –",spouses:["Y104w1"]},
{id:"Y105",para:105,name:"الأمين",g:"M",father:"Y104",mother:"Y104w1",dates:"1401هـ/1981م –",spouses:["Y105w1"]},
{id:"Y107",para:107,name:"سيد احمد لحبيب",g:"M",father:"Y106",mother:"Y106w1",spouses:["Y107w1"]},
{id:"Y108",para:108,name:"احمد",g:"M",father:"Y107",mother:"Y107w1",spouses:["Y76d1"]},
{id:"Y109",para:109,name:"سيد المختار",g:"M",father:"Y106",mother:"Y106w1",spouses:["Y109w1","Y109w2"]},
{id:"Y110",para:110,name:"مولود فال",g:"M",father:"Y106",mother:"Y119d7",place:"تينشيكل",spouses:["Y110w1"]},
{id:"Y116",para:116,name:"سيد احمد",g:"M",father:"Y115",mother:"Y115w1"},
{id:"Y118",para:118,name:"بوبكر",g:"M",father:"Y1",mother:"Y1w2",dates:"1090هـ/1679م – 1184هـ/1770م",place:"تنيخلف",spouses:["Y118w1"]},
{id:"Y119",para:119,name:"الفظيل",g:"M",father:"Y118",mother:"Y118w1",place:"تينشيكل",spouses:["Y119w1","Y119w2","Y119w3"]},
{id:"Y120",para:120,name:"محمذن (جالي الظالم)",g:"M",father:"Y118",mother:"Y118w1",place:"اهل خير",spouses:["Y120w1"]},
{id:"Y121",para:121,name:"زين",g:"M",father:"Y120",mother:"Y120w1",place:"تينشيكل",spouses:["Y121w1","Y121w2","Y119d7","Y121w4"]},
{id:"Y122",para:122,name:"باري",g:"M",father:"Y121",mother:"Y119d7",place:"تينشيكل",spouses:["Y122w1"]},
{id:"Y123",para:123,name:"محمذن",g:"M",father:"Y122",mother:"Y122w1",spouses:["Y123w1"]},
{id:"Y124",para:124,name:"باب الدين",g:"M",father:"Y1",mother:"Y1w2",dates:"1093هـ/1682م – 1185هـ/1771م",place:"تنيخلف",spouses:["Y124w1","Y124w2","I1d4"]},
{id:"Y125",para:125,name:"عبدي",g:"M",father:"Y124",mother:"Y124w1",spouses:["Y125w1","Y125w2"]},
{id:"Y126",para:126,name:"ابريك",g:"M",father:"Y125",mother:"Y125w2",spouses:["Y126w1"]},
{id:"Y127",para:127,name:"ابن الحسين",g:"M",father:"Y125",mother:"Y125w2",place:"المذرذره",spouses:["Y82d1","Y127w2"]},
{id:"Y128",para:128,name:"محمذن",g:"M",father:"Y127",mother:"Y127w2",place:"المذرذره",spouses:["Y128w1","Y128w2","I79d1"]},
{id:"Y129",para:129,name:"ابًا",g:"M",father:"Y128",mother:"Y128w1",spouses:["Y129w1"]},
{id:"Y130",para:130,name:"ببكر",g:"M",father:"Y129",mother:"Y129w1",place:"المذرذره",spouses:["Y188d1"]},
{id:"Y131",para:131,name:"محمودن",g:"M",father:"Y129",mother:"Y129w1",spouses:["Y131w1","Y110d1"]},
{id:"Y132",para:132,name:"احمد",g:"M",father:"Y131",mother:"Y131w1",spouses:["Y77d2"]},
{id:"Y133",para:133,name:"ابن",g:"M",father:"Y128",mother:"Y128w1",spouses:["Y133w1"]},
{id:"Y134",para:134,name:"آمين",g:"M",father:"Y133",mother:"Y133w1",spouses:["Y110d1"]},
{id:"Y135",para:135,name:"سيد",g:"M",father:"Y125",mother:"Y125w2",spouses:["Y121d1"]},
{id:"Y136",para:136,name:"المبارك",g:"M",father:"Y124",mother:"Y124w2",spouses:["Y136w1","Y136w2"]},
{id:"Y137",para:137,name:"سيد احمد",g:"M",father:"Y136",spouses:["Y137w1"]},
{id:"Y137w1",name:"زوجة",g:"F",father:"K85",mother:"K85w1",note:"بنت بنيوك (محمذن) بن المختار بن محمد الكريم (أخرى) — رابط بين الأسرتين",spouses:["Y137"],crossLink:true},
{id:"Y138",para:138,name:"سيد",g:"M",father:"Y136",mother:"Y136w2",place:"انتماظي",spouses:["Y138w1","Y14d2"]},
{id:"Y139",para:139,name:"احمد",g:"M",father:"Y138",mother:"Y138w1",dates:"1235هـ/1820م – 1315هـ/1898م",place:"انتماظي",spouses:["Y139w1","Y143d1"]},
{id:"Y140",para:140,name:"محمذن فال",g:"M",father:"Y138",mother:"Y138w1",spouses:["Y140w1","D27d2"]},
{id:"Y141",para:141,name:"سيديا",g:"M",father:"Y140",mother:"Y140w1",spouses:["Y141w1"]},
{id:"Y142",para:142,name:"محنض",g:"M",father:"Y124",mother:"Y124w2",spouses:["Y142w1"]},
{id:"Y143",para:143,name:"علي",g:"M",father:"Y142",mother:"Y142w1",spouses:["Y143w1"]},
{id:"Y144",para:144,name:"محمد سهل",g:"M",father:"Y143",mother:"Y143w1",spouses:["Y57d1"]},
{id:"Y145",para:145,name:"محمذن",g:"M",father:"Y144",mother:"Y57d1",spouses:["Y31d1"]},
{id:"Y146",para:146,name:"سيد",g:"M",father:"Y145",mother:"Y31d1",place:"كازماص (سنغال)",spouses:["Y146w1","Y146w2"]},
{id:"Y147",para:147,name:"هَد (احمد)",g:"M",father:"Y146",mother:"Y146w1",dates:"1331هـ/1913م – 1434هـ/2013م",place:"لميلحو",spouses:["Y96w2","Y147w2"]},
{id:"Y148",para:148,name:"شدَّار",g:"M",father:"Y1",mother:"Y1w2",dates:"1100هـ/1689م – 1180هـ/1767م",place:"آشكركط",spouses:["Y148w1","R1d2"]},
{id:"Y149",para:149,name:"احمد ميلود",g:"M",father:"Y148",mother:"Y148w1",spouses:["Y149w1","G36d2"]},
{id:"Y150",para:150,name:"سيد",g:"M",father:"Y149",mother:"Y149w1",spouses:["Y150w1","Z5d1"]},
{id:"Y151",para:151,name:"محمد لدخن",g:"M",father:"Y149",mother:"Y149w1",spouses:["Y151w1"]},
{id:"Y152",para:152,name:"امبيريك",g:"M",father:"Y151",mother:"Y151w1",spouses:["Y152w1","Y126d1"]},
{id:"Y153",para:153,name:"محمذن",g:"M",father:"Y152",mother:"Y152w1",spouses:["Y144d1"]},
{id:"Y154",para:154,name:"محمذن",g:"M",father:"Y149",mother:"Y149w1",spouses:["Y121w1"]},
{id:"Y155",para:155,name:"يَكوه (محمد)",g:"M",father:"Y154",mother:"Y121w1",dates:"1230هـ/1815م – 1304هـ/1887م",place:"اجدر لخظر",spouses:["Y155w1"]},
{id:"Y156",para:156,name:"يعقوب",g:"M",father:"Y149",mother:"Y149w1",spouses:["Y194d1"]},
{id:"Y157",para:157,name:"زيدن",g:"M",father:"Y156",mother:"Y194d1",spouses:["Y157w1"]},
{id:"Y158",para:158,name:"محمد",g:"M",father:"Y157",mother:"Y157w1",place:"اكدرنيت",spouses:["Y31d1"]},
{id:"Y159",para:159,name:"محمد",g:"M",father:"Y158",mother:"Y31d1",dates:"…؟… – 1345هـ/1927م",place:"ابير حيبلل",spouses:["Y159w1"]},
{id:"Y160",para:160,name:"أوفَّا (محمد فال)",g:"M",father:"Y159",mother:"Y159w1",dates:"1333هـ/1915م – 1421هـ/2000م",place:"لميلحو",spouses:["Y160w1","D71w2"]},
{id:"Y161",para:161,name:"النَّاه",g:"M",father:"Y160",mother:"Y160w1",dates:"1372هـ/1953م –",spouses:["Y161w1"]},
{id:"Y162",para:162,name:"محمدن",g:"M",father:"Y160",mother:"D71w2",dates:"1386هـ/1966م –",spouses:["Y162w1"]},
{id:"Y163",para:163,name:"احمد",g:"M",father:"Y160",mother:"D71w2",dates:"1389هـ/1969م –",spouses:["Y163w1"]},
{id:"Y164",para:164,name:"عبد الله",g:"M",father:"Y160",mother:"D71w2",dates:"1392هـ/1972م –",spouses:["Y164w1"]},
{id:"Y165",para:165,name:"حامد",g:"M",father:"Y159",mother:"Y159w1",dates:"1338هـ/1920م – 1436هـ/2015م",place:"دليلحو",spouses:["Y78w2"]},
{id:"Y166",para:166,name:"احمد",g:"M",father:"Y165",mother:"Y78w2",dates:"1405هـ/1985م –",spouses:["Y166w1"]},
{id:"Y167",para:167,name:"سيد الفالي",g:"M",father:"Y156",mother:"Y194d1",spouses:["Y167w1"]},
{id:"Y168",para:168,name:"احمد",g:"M",father:"Y167",mother:"Y167w1",spouses:["Y168w1","Y168w2"]},
{id:"Y168w1",name:"زوجة",g:"F",father:"P33",mother:"P33w1",note:"بنت سيد الفالي بن محمذن بن عركاب (حمم) بن ابوبا بن ماهي — رابط بين الأسرتين",spouses:["Y168"],crossLink:true},
{id:"Y169",para:169,name:"محمد عبد الله",g:"M",father:"Y168",mother:"Y168w1",spouses:["Y169w1"]},
{id:"Y170",para:170,name:"سيد الفالي",g:"M",father:"Y148",mother:"Y148w1",spouses:["Y170w1"]},
{id:"Y171",para:171,name:"عبد الله",g:"M",father:"Y148",mother:"Y148w1",spouses:["Y171w1"]},
{id:"Y172",para:172,name:"محمذن فال",g:"M",father:"Y171",mother:"Y171w1",spouses:["Y172w1"]},
{id:"Y173",para:173,name:"ابن عمر",g:"M",father:"Y172",mother:"Y172w1",spouses:["Y173w1"]},
{id:"Y174",para:174,name:"عبد الله",g:"M",father:"Y173",mother:"Y173w1",spouses:["Y167d1"]},
{id:"Y175",para:175,name:"محمودن",g:"M",father:"Y173",mother:"Y173w1",spouses:["Y175w1"]},
{id:"Y176",para:176,name:"محنض",g:"M",father:"Y148",mother:"Y148w1",spouses:["Y176w1x","Y176w1"]},
{id:"Y176w1",name:"زوجة",g:"F",father:"K84",mother:"K84w1",note:"بنت المختار بن محمد الكريم — رابط بين الأسرتين",spouses:["Y176"],crossLink:true},
{id:"Y177",para:177,name:"ابن المعالي",g:"M",father:"Y176",mother:"Y176w1x",spouses:["Y177w1"]},
{id:"Y178",para:178,name:"سيد الفالي",g:"M",father:"Y177",mother:"Y177w1",spouses:["Y178w1"]},
{id:"Y179",para:179,name:"المختار فال",g:"M",father:"Y178",mother:"Y178w1",spouses:["Y179w1"]},
{id:"Y180",para:180,name:"ابَّدَّه (محمد اليدالي)",g:"M",father:"Y179",mother:"Y179w1",dates:"1307هـ/1890م – 1397هـ/1977م",place:"المذرذره",spouses:["Y180w1","Y180w2"]},
{id:"Y181",para:181,name:"اكاه",g:"M",father:"Y180",mother:"Y180w2",dates:"1361هـ/1942م – 1416هـ/1996م",place:"لمبلحو",spouses:["Y181w1","Y95d1"]},
{id:"Y182",para:182,name:"الوالي",g:"M",father:"Y181",mother:"Y181w1",dates:"1396هـ/1976م –",spouses:["Y182w1"]},
{id:"Y183",para:183,name:"شدَّار",g:"M",father:"Y180",mother:"Y180w2",dates:"1365هـ/1946م –",spouses:["Y183w1","Y183w2"]},
{id:"Y184",para:184,name:"باب",g:"M",father:"Y179",mother:"Y179w1",spouses:["Y184w1"]},
{id:"Y185",para:185,name:"المزضف",g:"M",father:"Y148",mother:"Y148w1",spouses:["Y185w1"]},
{id:"Y186",para:186,name:"حبلل",g:"M",father:"Y185",mother:"Y185w1",spouses:["Y186w1"]},
{id:"Y187",para:187,name:"محمذن",g:"M",father:"Y186",mother:"Y186w1",spouses:["Y187w1","Y187w2"]},
{id:"Y188",para:188,name:"احمد",g:"M",father:"Y187",mother:"Y187w1",spouses:["Y188w1","Y188w2"]},
{id:"Y188w1",name:"زوجة",g:"F",father:"K4",mother:"K4w1",note:"بنت اَّكاه (ببكر) بن محمذن بن احجاب بن محمد الكريم (أخرى) — رابط بين الأسرتين",spouses:["Y188"],crossLink:true},
{id:"Y189",para:189,name:"ببكر",g:"M",father:"Y188",mother:"Y188w2",spouses:["Y34d1"]},
{id:"Y190",para:190,name:"محمذن",g:"M",father:"Y188",mother:"Y188w2",dates:"1290هـ/1873م – 1347هـ/1929م",place:"تواون (سنغال)",spouses:["Y190w1"]},
{id:"Y191",para:191,name:"احمد",g:"M",father:"Y190",mother:"Y190w1",dates:"1345هـ/1927م – 1412هـ/1992م",place:"تواون (سنغال)",spouses:["Y191w1","Y191w2"]},
{id:"Y192",para:192,name:"شدَّار",g:"M",father:"Y185",mother:"Y185w1",spouses:["Y82w1"]},
{id:"Y193",para:193,name:"ميني",g:"M",father:"Y148",mother:"Y148w1",spouses:["Y193w1"]},
{id:"Y194",para:194,name:"يامحمذ",g:"M",father:"Y148",mother:"Y148w1",spouses:["Y194w1","Y194w2"]},
{id:"Y195",para:195,name:"عبد الله",g:"M",father:"Y194",mother:"Y194w1",spouses:["Y195w1"]},
{id:"L1",para:1,name:"ميلود",g:"M",father:"T0-fali",mother:"Y1d6",note:"بن الفالي بن الكوري بن سيد الفالي",spouses:["L1w1","L1w2","L1w3"]},
{id:"L1w1",name:"أم هاني",g:"F",father:"Y1",spouses:["L1"],crossLink:true,mother:"Y1w1",note:"أم اللين (الأمين) بن ميلود بن الفالي بن الكوري"},
{id:"L2",para:2,name:"اللين (الأمين)",g:"M",father:"L1",mother:"L1w1",spouses:["L2w1","R1d3"]},
{id:"L1w2",name:"مريم",g:"F",father:"XA581",spouses:["L1"],ext:true},
{id:"L23",para:23,name:"حارود",g:"M",father:"L1",mother:"L1w2",spouses:["L23w1","L23w2"]},
{id:"L26",para:26,name:"حبلل",g:"M",father:"L1",mother:"L1w2",spouses:["G55d1"]},
{id:"L1d1",name:"امنيانه",g:"F",father:"L1",mother:"L1w1",note:"أم بعض أبناء محمد بن اشفغ المختار باب"},
{id:"L1d2",name:"مانه",g:"F",father:"L1",mother:"L1w1",note:"لم تعقب"},
{id:"L1w3",name:"فلانة",g:"F",father:"T0-hamnadh",spouses:["L1"],crossLink:true,fullName:"فلانة بنت محنض بن يندكسعد"},
{id:"L1d3",name:"فاطمه",g:"F",father:"L1",mother:"L1w2",note:"أم حرمه بن المختار بن المعزوز بن اشفغ الأمين، وأم بنيت المختار بن الفالي بن متيلي",spouses:["M21"],crossLink:true},
{id:"L2w1",name:"فلانة",g:"F",father:"R1",mother:"R1w1",spouses:["L2"]},
{id:"L3",para:3,name:"بليهي (عبد الله)",g:"M",father:"L2",mother:"L2w1",spouses:["L3w1"]},
{id:"L8",para:8,name:"الفظيل",g:"M",father:"L2",mother:"L2w1",spouses:["Z7w1"]},
{id:"L2d1",name:"خدّيج",g:"F",father:"L2",mother:"L2w1",note:"أم أبناء الغالوي بن أحمد الورع بن الفالي بن باب أحمد"},
{id:"L2d2",name:"فاطمة",g:"F",father:"L2",mother:"L2w1",note:"أم أبناء محمذن بن الأمين عمي؛ بنت اللين (الأمين) بن ميلود بن الفالي — رابط بين الأسرتين",spouses:["E28"]},
{id:"L2d3",name:"مريم",g:"F",father:"L2",mother:"L2w1",note:"أم أبناء المختار سعيد بن محمد اليدالي بن المختار بن حمم سعيد",spouses:["XA496"]},
{id:"L3w1",name:"خيرا",g:"F",father:"D17",spouses:["L3"],mother:"D17w1",note:"أم الكوري وامبريكو ابني بليهي (عبد الله) بن اللين (الأمين) بن ميلود؛ أم آمنة وام المومنين وام راص من أبناء الغزالي بن اعديج بن احمد الورع بن الفالي بن باب احمد"},
{id:"L4",para:4,name:"الكوري",g:"M",father:"L3",mother:"L3w1",spouses:["L4w1","L4w2"]},
{id:"L3d1",name:"امبيريكه",g:"F",father:"L3",mother:"L3w1",note:"أم محمذن ميلود من أبناء المامون بن الفگيگي بن الغالوي بن الفالي بن باب أحمد",spouses:["D46s2s1s2s2"]},
{id:"L4w1",name:"تكروريه",g:"F",father:"L24",mother:"L24w1",note:"زواج داخلي بالأسرة",spouses:["L4"]},
{id:"L4d2",name:"مريم",g:"F",father:"L4",mother:"L4w1",note:"أم أبناء محمذن بن أحمد بن ون (محمذن) بن أحمد زروق",spouses:["R55"],crossLink:true},
{id:"L4w2",name:"عيشتونه",g:"F",father:"L15",note:"زواج داخلي بالأسرة؛ أم أحمد سالم ومحمذن من أبناء الكوري بن بليهي (عبد الله) بن اللين (الأمين) بن ميلود",spouses:["L4"] ,mother:"L15w1"},
{id:"L5",para:5,name:"أحمد سالم",g:"M",father:"L4",mother:"L4w2",spouses:["L5w1"]},
{id:"L7",para:7,name:"محمذن",g:"M",father:"L4",mother:"L4w2",spouses:["L7w1"]},
{id:"L5w1",name:"مريم بنو -إلى آكمتار-",g:"F",father:null,spouses:["L5"]},
{id:"L6",para:6,name:"محمد لمجد",g:"M",father:"L5",mother:"L5w1",spouses:["L6w1"]},
{id:"L5d1",name:"بنت وهب",g:"F",father:"L5",mother:"L5w1",place:"محجوبو",note:"لم تعقب"},
{id:"L5d2",name:"فاطمة",g:"F",father:"L5",mother:"L5w1",note:"لم تعقب"},
{id:"L6w1",name:"مل",g:"F",father:"L7",mother:"L7w1",note:"بنت محمذن بن الكوري بن بليهي (عبد الله) بن اللين (الأمين) بن ميلود — زواج داخلي بالأسرة (corrigé : rattachée à L7, pas L4 directement)",place:"أبير حيبلل",spouses:["L6"]},
{id:"L6d1",name:"فاطمة السالمه",g:"F",father:"L6",mother:"L6w1",note:"أم محمدن والخامس من أبناء أحمد سالم؛ بنت محمد لمجد بن أحمد سالم بن الكوري بن بليهي (عبد الله) بن اللين (الأمين) بن ميلود — رابط بين الأسرتين",spouses:["E7"]},
{id:"L7w1",name:"امانه",g:"F",father:"E5",spouses:["L7"],crossLink:true,mother:"E5w1",note:"أم أبناء محمذن بن الكوري بن بليهي (عبد الله) بن اللين (الأمين) بن ميلود"},
{id:"L7s1",name:"المختار",g:"M",father:"L7",mother:"L7w1",note:"لم يعقب"},
{id:"L7s2",name:"محمد",g:"M",father:"L7",mother:"L7w1",note:"لم يعقب"},
{id:"L8s1",name:"سيد أحمد",g:"M",father:"L8",mother:"Z7w1",note:"لم يعقب"},
{id:"L9",para:9,name:"محمذن",g:"M",father:"L8",mother:"Z7w1",spouses:["I25d1"]},
{id:"L15",para:15,name:"المختار",g:"M",father:"L8",mother:"Z7w1",dates:"1167هـ/1754م – 1237هـ/1822م",spouses:["L15w1","L15w2"]},
{id:"L8d1",name:"مريم",g:"F",father:"L8",mother:"Z7w1",note:"لم تعقب"},
{id:"L10",para:10,name:"سيد أحمد",g:"M",father:"L9",mother:"I25d1",spouses:["R42d2","L10w2"]},
{id:"L11",para:11,name:"المختار",g:"M",father:"L9",mother:"I25d1",spouses:["L11w1"]},
{id:"L10d1",name:"عايشا",g:"F",father:"L10",mother:"R42d2",note:"لم تعقب"},
{id:"L10w2",name:"فلانة",g:"F",father:"XA584",spouses:["L10"],ext:true},
{id:"L10s1",name:"محمذن",g:"M",father:"L10",mother:"L10w2",note:"لم يعقب"},
{id:"L10d2",name:"أم الخير",g:"F",father:"L10",mother:"L10w2",note:"لم تعقب"},
{id:"L10d3",name:"أم المؤمنين",g:"F",father:"L10",mother:"L10w2",note:"لم تعقب"},
{id:"L10d4",name:"حاجه",g:"F",father:"L10",mother:"L10w2",note:"لم تعقب"},
{id:"L10d5",name:"سلمه",g:"F",father:"L10",mother:"L10w2",note:"لم تعقب"},
{id:"L11w1",name:"ديده (خدجية)",g:"F",father:"M52",note:"بنت المختار بن محمذن بن الأمين بن الفالي بن متيلي — رابط بين الأسرتين؛ أم أبناء المختار بن محمذن بن الفظيل بن اللين (الأمين) بن ميلود",spouses:["L11"],crossLink:true,mother:"F132d2"},
{id:"L12",para:12,name:"أحمد",g:"M",father:"L11",mother:"L11w1",spouses:["L12w1"]},
{id:"L13",para:13,name:"محمد سالم",g:"M",father:"L11",mother:"L11w1",spouses:["L13w1","L13w2"]},
{id:"L14",para:14,name:"الأمين",g:"M",father:"L11",mother:"L11w1",spouses:["R55d1","L14w2"]},
{id:"L11d1",name:"أم المؤمنين",g:"F",father:"L11",mother:"L11w1",note:"أم أبناء أحمد بن سيد الفالي بن الإمام أحمد بن محمذن بن الأمين عمي",spouses:["E32"]},
{id:"L12w1",name:"مريم",g:"F",father:"XA1219",spouses:["L12"],ext:true},
{id:"L12s1",name:"محمد",g:"M",father:"L12",mother:"L12w1",note:"لم يعقب"},
{id:"L12d1",name:"السالمه",g:"F",father:"L12",mother:"L12w1",note:"لم تعقب"},
{id:"L12d2",name:"ييّه (مريم)",g:"F",father:"L12",mother:"L12w1",note:"أم بنات الأمين بن محمد بن محمذن فال بن عبدي بن أوطا"},
{id:"L13w1",name:"مريم",g:"F",father:"F5",place:"أبير حيبلل",spouses:["L13"]},
{id:"L13d1",name:"وهاه (عشات)",g:"F",father:"L13",mother:"L13w1",place:"أبير حيبلل",note:"لم تعقب"},
{id:"L13w2",name:"فلانة",g:"F",father:null,spouses:["L13"]},
{id:"L13d2",name:"فاطمه",g:"F",father:"L13",mother:"L13w2",note:"لم تعقب"},
{id:"L14d1",name:"فاطمة",g:"F",father:"L14",mother:"R55d1",note:"لم تعقب"},
{id:"L14w2",name:"أم الحسين",g:"F",father:"XA585",spouses:["L14"],ext:true},
{id:"L14d2",name:"أم النبي",g:"F",father:"L14",mother:"L14w2",note:"لم تعقب"},
{id:"L15w1",name:"بنت وهب",g:"F",father:"XA339",spouses:["L15","Y83"],ext:true},
{id:"L16",para:16,name:"محمذن",g:"M",father:"L15",mother:"L15w1",place:"امبنب",dates:"1316هـ/1898م –",spouses:["L16w1","L16w2"]},
{id:"L15w2",name:"فلانة",g:"F",father:"XA676",spouses:["L15"],ext:true},
{id:"L15d2",name:"فاطمه",g:"F",father:"L15",mother:"L15w1",note:"لم تعقب"},
{id:"L15d3",name:"فلانة",g:"F",father:"L15",mother:"L15w2",note:"لم تعقب"},
{id:"L16w1",name:"أم النبي",g:"F",father:"M5s1s1s1",place:"حاس معروف",spouses:["L16"]},
{id:"L17",para:17,name:"أحمد",g:"M",father:"L16",mother:"L16w1",place:"امبنب",dates:"1384هـ/1964م –",spouses:["L17w1","L17w2"]},
{id:"L16w2",name:"فاطمه",g:"F",father:"L4",note:"زواج داخلي بالأسرة؛ أم أم النبي من أبناء محمذن بن المختار بن الفظيل بن اللين (الأمين) بن ميلود",spouses:["L16"],mother:"L4w1"},
{id:"L16d1",name:"أم النبي",g:"F",father:"L16",mother:"L4w2",note:"أم مريم لمباركو ومومني (أم المؤمنين) وسلم بوها والشالو (الزهراء)"},
{id:"L17w1",name:"مريم",g:"F",father:"XA591",spouses:["L17"],ext:true},
{id:"L17d1",name:"العاليه",g:"F",father:"L17",mother:"L17w1",place:"أبير التورس"},
{id:"L17w2",name:"عيشة",g:"F",father:"XA593",spouses:["L17"],ext:true},
{id:"L17d2",name:"سلمه",g:"F",father:"L17",mother:"L17w2" ,spouses:["K111"] ,dates:"1338هـ/1920م –" ,crossLink:true},
{id:"L18",para:18,name:"محلّل (محمذن)",g:"M",father:"L17",mother:"L17w2",dates:"1341هـ/1923م –",spouses:["L18w1"]},
{id:"L21",para:21,name:"عبد",g:"M",father:"L17",mother:"L17w2",dates:"1351هـ/1933م –",spouses:["K118d1"]},
{id:"L18w1",name:"مريم",g:"F",father:"K111",note:"بنت المختار بن محمودن بن محمذن بن انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",spouses:["L18"],crossLink:true,mother:"K111w1",dates:"1357هـ/1938م –"},
{id:"L18d1",name:"أم الخيري",g:"F",father:"L18",mother:"L18w1",note:"أم أبناء محمدن بن سيد باب بن أحممد بن أحمد يوره بن محمذن بن أحمد بن محمد العاقل"},
{id:"L19",para:19,name:"محمدن",g:"M",father:"L18",mother:"L18w1",dates:"1382هـ/1963م –",spouses:["L19w1"]},
{id:"L18d2",name:"عيشه",g:"F",father:"L18",mother:"L18w1",note:"أم أحمد بن ادّ (أحمد) بن أحمد بن أحمد بن محدن بن محمد فال بن أحمد بن محمد العاقل؛ homonyme de L18d2 (autre fille de L18 portant le même prénom) — corrigé après signalement de l'utilisateur",dates:"1388هـ/1968م –",spouses:["F92"]},
{id:"L18d4",name:"ميمهنه",g:"F",father:"L18",mother:"L18w1" ,spouses:["F86"] ,dates:"1401هـ/1981م –" ,crossLink:true},
{id:"L20",para:20,name:"حمدن",g:"M",father:"L18",mother:"L18w1",dates:"1396هـ/1976م –",spouses:["K112d1"]},
{id:"L18s1",name:"المختار",g:"M",father:"L18",mother:"L18w1"},
{id:"L18d6",name:"اميه",g:"F",father:"L18",mother:"L18w1",dates:"1401هـ/1981م –"},
{id:"L19w1",name:"ورده",g:"F",father:"XA595",spouses:["L19"],ext:true},
{id:"L19d1",name:"لبابه",g:"F",father:"L19",mother:"L19w1"},
{id:"L19s1",name:"أحمد",g:"M",father:"L19",mother:"L19w1"},
{id:"L19s2",name:"المختار",g:"M",father:"L19",mother:"L19w1"},
{id:"L20s1",name:"أحمد",g:"M",father:"L20",mother:"K112d1"},
{id:"L22",para:22,name:"أحمد",g:"M",father:"L21",mother:"K118d1",dates:"1389هـ/1969م –",spouses:["L22w1"]},
{id:"L21s1",name:"المختار",g:"M",father:"L21",mother:"K118d1"},
{id:"L21s2",name:"محمدن",g:"M",father:"L21",mother:"K118d1"},
{id:"L21s3",name:"محمذن",g:"M",father:"L21",mother:"K118d1"},
{id:"L21s4",name:"ددالي",g:"M",father:"L21",mother:"K118d1"},
{id:"L21d1",name:"ميّم (ميمونه)",g:"F",father:"L21",mother:"K118d1"},
{id:"L21s5",name:"الكوري",g:"M",father:"L21",mother:"K118d1"},
{id:"L21d2",name:"اميه (فاطمة)",g:"F",father:"L21",mother:"K118d1"},
{id:"L21d3",name:"ربيعة (الشفاء)",g:"F",father:"L21",mother:"K118d1"},
{id:"L22w1",name:"هال (فاطمه فال)",g:"F",father:"L18",mother:"L18w1",note:"بنت محلّل (محمذن) بن أحمد بن محمذن بن المختار بن الفظيل بن اللين (الأمين) بن ميلود — زواج داخلي بالأسرة؛ أم عيشو بنت أحمد بن عبد بن أحمد بن محمذن بن المختار بن الفظيل بن اللين (الأمين) بن ميلود",spouses:["L22"],dates:"1401هـ/1981م –"},
{id:"L22s1",name:"عيشه",g:"M",father:"L22",mother:"L22w1"},
{id:"L23w1",name:"عيشة",g:"F",father:"XA495",spouses:["L23"],ext:true},
{id:"L23s1",name:"اشفغ",g:"M",father:"L23",mother:"L23w1",note:"لم يعقب"},
{id:"L23d1",name:"مريم تكروريا",g:"F",father:"L23",mother:"L23w1" ,spouses:["V10"] ,crossLink:true},
{id:"L23w2",name:"ياميام (مريم)",g:"F",father:"XA495",note:"أخت الزوجة الأولى",spouses:["L23"],ext:true},
{id:"L24",para:24,name:"محمذن",g:"M",father:"L23",mother:"L23w2",dates:"1190هـ/1776م –",place:"أغنجبرت",spouses:["L24w1"]},
{id:"L23d3",name:"عيشة",g:"F",father:"L23",mother:"L23w2",note:"لم تعقب"},
{id:"L24w1",name:"فلانة",g:"F",father:"XA596",spouses:["L24"],ext:true},
{id:"L25",para:25,name:"سيد الفالي",g:"M",father:"L24",mother:"L24w1",spouses:["L25w1"]},
{id:"L25w1",name:"فلانة",g:"F",father:null,spouses:["L25"]},
{id:"L25d1",name:"فلانة",g:"F",father:"L25",mother:"L25w1",note:"لم تعقب"},
{id:"L26d1",name:"فلانة",g:"F",father:"L26",mother:"G55d1",note:"أم أبناء حبيب الله بن بليل بن محنض بن سيد أحمد بن سيد المختار -لهواكري-"},
{id:"T0-sbubakar",name:"سيد بوبكر",g:"M",father:"T0",note:"بن سيد الفالي"},
{id:"T0-sbubakar-mahom",name:"محم",g:"M",father:"T0-sbubakar",note:"بن سيد بوبكر بن سيد الفالي"},
{id:"J1",para:1,name:"آلچ (الفالي)",g:"M",father:"T0-sbubakar-mahom",note:"بن محم بن سيد بوبكر بن سيد الفالي",spouses:["J1w1"]},
{id:"J1w1",name:"امبيكله",g:"F",father:"XA598",spouses:["J1"],ext:true},
{id:"J2",para:2,name:"ابن غازي",g:"M",father:"J1",mother:"J1w1",spouses:["E2d2"]},
{id:"J22",para:22,name:"أحمد البزي",g:"M",father:"J1",mother:"J1w1",spouses:["J22w1"]},
{id:"J2s1",name:"أحمد",g:"M",father:"J2",mother:"E2d2",dates:"1282هـ/1866م –",note:"لم يعقب"},
{id:"J3",para:3,name:"محمد فال",g:"M",father:"J2",mother:"E2d2",dates:"1285هـ/1869م –",spouses:["E54d1"]},
{id:"J4",para:4,name:"أحمد",g:"M",father:"J3",mother:"E54d1",spouses:["J4w1"]},
{id:"J15",para:15,name:"البناني",g:"M",father:"J3",mother:"E54d1",dates:"1319هـ/1901م –",place:"أبير حيبلل",spouses:["K30w4","R14d4"]},
{id:"J3s1",name:"المختار",g:"M",father:"J3",mother:"E54d1",dates:"1301هـ/1884م –",note:"لم يعقب"},
{id:"J3d1",name:"خديجة",g:"F",father:"J3",mother:"E54d1",note:"أم أحمد بن امّن (محمذن) بن بوبكر بن أبو الحس بن المزضف، وأم ابني أحمد بن محمود الله"},
{id:"J3d2",name:"عائشة",g:"F",father:"J3",mother:"E54d1",note:"أم محمذن من أبناء ابامين (الأمين) بن المختار بن أحمد انهكر بن محمد الكريم" ,spouses:["K30"] ,crossLink:true},
{id:"J3d3",name:"مريم",g:"F",father:"J3",mother:"E54d1",note:"لم تعقب"},
{id:"J4w1",name:"العيشه",g:"F",father:"I4",spouses:["J4"],crossLink:true,mother:"I4w1",note:"أم أبناء احمد بن محمد فال بن ابنغازي بن آلچ (الفالي)"},
{id:"J5",para:5,name:"أحمد سالم",g:"M",father:"J4",mother:"J4w1",dates:"1351هـ/1932م –",spouses:["E57d4"]},
{id:"J4d1",name:"أم الخيري",g:"F",father:"J4",mother:"J4w1",note:"لم تعقب"},
{id:"J4d2",name:"فطيمه",g:"F",father:"J4",mother:"J4w1",note:"أم بنيت المختار بن محمذن بن سعدن بن ون (محمذن) بن أحمد زروق"},
{id:"J6",para:6,name:"محمد فال",g:"M",father:"J5",mother:"E57d4",dates:"1333هـ/1915م – 1399هـ/1979م",place:"أبير حيبلل",spouses:["J6w1"]},
{id:"J7",para:7,name:"محمدن",g:"M",father:"J5",mother:"E57d4",dates:"1335هـ/1917م – 1388هـ/1968م",place:"أبير حيبلل",spouses:["J7w1"]},
{id:"J10",para:10,name:"أحماده",g:"M",father:"J5",mother:"E57d4",dates:"1337هـ/1919م – 1416هـ/1996م",place:"أبير حيبلل",spouses:["R62d1"]},
{id:"J11",para:11,name:"المختار",g:"M",father:"J5",mother:"E57d4",dates:"1345هـ/1927م – 1436هـ/2015م",place:"أبير حيبلل",spouses:["V25d1"]},
{id:"J5d1",name:"خديجة",g:"F",father:"J5",mother:"E57d4",note:"لم تعقب"},
{id:"J6w1",name:"تسلم",g:"F",father:"K73",note:"بنت سيد الأمين بن محّم (محمد) بن محمذن ميلود بن حبلل بن عاون بن محمد الكريم — رابط بين الأسرتين",dates:"1355هـ/1936م –",spouses:["J6"],crossLink:true,mother:"K73w1"},
{id:"J6d1",name:"عائشة",g:"F",father:"J6",mother:"J6w1",dates:"1372هـ/1953م –",note:"أم أبناء عبد الله بن أحمياده بن محمد بن محمذن بن أحمد البزي بن آلچ",spouses:["J33"]},
{id:"J6d2",name:"زينب",g:"F",father:"J6",mother:"J6w1",dates:"1378هـ/1959م –",note:"أم أبناء محمد محمود بن أحمد بن العتيق بن ابامين (الأمين) بن المختار بن أحمد انهكر بن محمد الكريم" ,spouses:["K44"] ,crossLink:true},
{id:"J6s1",name:"امبيريك",g:"M",father:"J6",mother:"J6w1",dates:"1388هـ/1968م –"},
{id:"J7w1",name:"عائشة",g:"F",father:"I29",dates:"1357هـ/1938م –",spouses:["J7"],crossLink:true,fullName:"عائشة بنت كاكاه (ببكر) بن اميو (محمذن) بن سيد أحممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم",mother:"I96d4",note:"أم أبناء محمدن بن احمد سالم بن احمد بن محمد فال بن ابن غازي بن آلچ (الفالي)"},
{id:"J8",para:8,name:"أحمد",g:"M",father:"J7",mother:"J7w1",dates:"1372هـ/1953م –",spouses:["J8w1"]},
{id:"J9",para:9,name:"السيد",g:"M",father:"J7",mother:"J7w1",dates:"1376هـ/1957م –",spouses:["J9w1"]},
{id:"J8w1",name:"اللو",g:"F",father:"J26",mother:"J26w1",note:"بنت محمد فال بن أحمياده بن محمد بن محمذن بن أحمد البزي بن آلچ — زواج داخلي بالأسرة",dates:"1388هـ/1968م –",spouses:["J8"]},
{id:"J8s1",name:"محمدن",g:"M",father:"J8",mother:"J8w1",dates:"1409هـ/1989م –"},
{id:"J8s2",name:"حيدره",g:"M",father:"J8",mother:"J8w1"},
{id:"J8s3",name:"السيد",g:"M",father:"J8",mother:"J8w1"},
{id:"J8d2",name:"مريم",g:"F",father:"J8",mother:"J8w1"},
{id:"J8s4",name:"محمد فال",g:"M",father:"J8",mother:"J8w1"},
{id:"J8s5",name:"سيد الأمين",g:"M",father:"J8",mother:"J8w1"},
{id:"J9w1",name:"سهام",g:"F",father:"G83s2s1s1",dates:"1397هـ/1977م –",spouses:["J9"]},
{id:"J9d1",name:"ملكه",g:"F",father:"J9",mother:"J9w1",dates:"1411هـ/1991م –"},
{id:"J9d2",name:"هدى",g:"F",father:"J9",mother:"J9w1",dates:"1418هـ/1998م –"},
{id:"J9d3",name:"امهنه",g:"F",father:"J9",mother:"J9w1",dates:"1421هـ/2001م –"},
{id:"J9d4",name:"الشاله",g:"F",father:"J9",mother:"J9w1",dates:"1428هـ/2008م –"},
{id:"J9d5",name:"امه (فاطمة)",g:"F",father:"J9",mother:"J9w1",dates:"1430هـ/2009م –"},
{id:"J9d6",name:"العالية",g:"F",father:"J9",mother:"J9w1",dates:"1430هـ/2009م –"},
{id:"J9d7",name:"توت",g:"F",father:"J9",mother:"J9w1",dates:"1435هـ/2014م –"},
{id:"J9d8",name:"العمره",g:"F",father:"J9",mother:"J9w1"},
{id:"J9d9",name:"هيبه",g:"F",father:"J9",mother:"J9w1"},
{id:"J10s1",name:"الوحيد",g:"M",father:"J10",mother:"R62d1",dates:"1384هـ/1964م –"},
{id:"J10d2",name:"مت",g:"F",father:"J10",mother:"R62d1",dates:"1393هـ/1973م –"},
{id:"J10d3",name:"ففه",g:"F",father:"J10",mother:"R62d1",dates:"1396هـ/1976م –"},
{id:"J10s2",name:"محمدن",g:"M",father:"J10",mother:"R62d1",dates:"1402هـ/1982م –"},
{id:"J12",para:12,name:"أحمد",g:"M",father:"J11",mother:"V25d1",dates:"1384هـ/1964م –",spouses:["V27d1"]},
{id:"J13",para:13,name:"اد (الجد)",g:"M",father:"J11",mother:"V25d1",dates:"1387هـ/1967م –",spouses:["J13w1"]},
{id:"J14",para:14,name:"محمد",g:"M",father:"J11",mother:"V25d1",dates:"1399هـ/1979م –",spouses:["J14w1"]},
{id:"J11d1",name:"حبيبه",g:"F",father:"J11",mother:"V25d1",dates:"1396هـ/1976م –" ,spouses:["K76"] ,crossLink:true},
{id:"J12d1",name:"فاطمة",g:"F",father:"J12",mother:"V27d1",dates:"1424هـ/2003م –"},
{id:"J12d2",name:"توت (آمنة)",g:"F",father:"J12",mother:"V27d1",dates:"1429هـ/2008م –"},
{id:"J13w1",name:"اللجنه",g:"F",father:"J10",mother:"R62d1",note:"بنت أحماده بن أحمد سالم بن أحمد بن محمد فال بن ابن غازي بن آلچ — زواج داخلي بالأسرة",dates:"1398هـ/1978م –",spouses:["J13"]},
{id:"J13s1",name:"أحمد سالم",g:"M",father:"J13",mother:"J13w1",dates:"1433هـ/2012م –"},
{id:"J13d1",name:"آمنة",g:"F",father:"J13",mother:"J13w1",dates:"1435هـ/2014م –"},
{id:"J14w1",name:"حاجه",g:"F",father:"J39",mother:"V20d1",note:"بنت محمذن السالم بن محمذن بن مولود بن المختار بن أحمد البزي بن آلچ — زواج داخلي بالأسرة",dates:"1404هـ/1984م –",spouses:["J14"]},
{id:"J14d1",name:"ميم",g:"F",father:"J14",mother:"J14w1",dates:"1432هـ/2011م –"},
{id:"J16",para:16,name:"محمد",g:"M",father:"J15",mother:"K30w4",spouses:["J16w1"]},
{id:"J17",para:17,name:"أحمد",g:"M",father:"J15",mother:"R14d4",dates:"1334هـ/1916م –",place:"أبير حيبلل",spouses:["J17w1"]},
{id:"J16w1",name:"العاليه",g:"F",father:"M15",mother:"M15w1",note:"بنت ابراهيم بن المختار بن محمذن بن الغالي بن باركلل بن بوالماح بن متيلي — رابط بين الأسرتين؛ أم أبناء محمّد بن البناني بن محمد فال بن ابن غازي",spouses:["J16"],crossLink:true},
{id:"J16s1",name:"محمد",g:"M",father:"J16",mother:"J16w1",note:"لم يعقب"},
{id:"J16s2",name:"محمدن",g:"M",father:"J16",mother:"J16w1",note:"لم يعقب"},
{id:"J16d1",name:"فاطمة",g:"F",father:"J16",mother:"J16w1",note:"أم بعض أبناء باباه بن عبد الله بن باباه (محمد امبارك) بن ببكر بن سعيد بن المختار بن اشفغ حيبلل"},
{id:"J16d2",name:"مريم",g:"F",father:"J16",mother:"J16w1",place:"تنبيعلي",note:"أم أبناء أحمد السالك بن محمد -اداشغره-"},
{id:"J17w1",name:"امناه (أم النبي)",g:"F",father:"F5",place:"أبير حيبلل",spouses:["J17"]},
{id:"J18",para:18,name:"امفال (محمد فال)",g:"M",father:"J17",mother:"J17w1",dates:"1324هـ/1906م – 1416هـ/1996م",place:"أبير حيبلل",spouses:["J18w1","J18w2","G91d2"]},
{id:"J20",para:20,name:"سيد الأمين",g:"M",father:"J17",mother:"J17w1",dates:"1339هـ/1921م – 1423هـ/2002م",place:"أبير حيبلل",spouses:["J20w1"]},
{id:"J18w1",name:"انامه -اجيجب-",g:"F",father:null,spouses:["J18"]},
{id:"J18w2",name:"خدجية",g:"F",father:"G83s2s1",dates:"1357هـ/1938م – 1433هـ/2012م",place:"أبير حيبلل",spouses:["J18"]},
{id:"J19",para:19,name:"أحمد",g:"M",father:"J18",mother:"J18w2",dates:"1384هـ/1964م –",spouses:["J19w1"]},
{id:"J19w1",name:"خداجه",g:"F",father:"Y103",mother:"Y103w1",dates:"1384هـ/1964م –",spouses:["J19"]},
{id:"J19d1",name:"امناه (أم النبي)",g:"F",father:"J19",mother:"J19w1",dates:"1409هـ/1989م –" ,spouses:["K100"] ,crossLink:true},
{id:"J19d2",name:"عيشه",g:"F",father:"J19",mother:"J19w1",dates:"1412هـ/1992م –"},
{id:"J19d3",name:"السالمه",g:"F",father:"J19",mother:"J19w1",dates:"1416هـ/1996م –"},
{id:"J20w1",name:"فاطمة",g:"F",father:"F125",mother:"F125w1",dates:"1335هـ/1917م – 1392هـ/1972م",place:"أبير حيبلل",spouses:["J20"],crossLink:true,fullName:"فاطمة بنت الخليفه بن الأمين بن بيبات بن حمم بن المبارك بن اما (الماقور)"},
{id:"J20s1",name:"دداه (محمد عبد الله)",g:"M",father:"J20",mother:"J20w1",dates:"1376هـ/1957م –"},
{id:"J21",para:21,name:"يحي",g:"M",father:"J20",mother:"J20w1",dates:"1378هـ/1959م –",spouses:["J21w1"]},
{id:"J20d1",name:"ميّم",g:"F",father:"J20",mother:"J20w1",dates:"1382هـ/1963م –"},
{id:"J21w1",name:"تيته",g:"F",father:"I20",dates:"1397هـ/1977م –",spouses:["J21"],crossLink:true,fullName:"تيته بنت قار بن أحمد سالم بن أبوبا (ببكر) بن المختار بن سيد أحمد بن حبلل بن ابراهيم",mother:"I20w1",note:"أم أبناء يحي بن سيد الأمين بن احمد بن البناني بن محمد فال بن ابن غازي بن آلچ (الفالي)"},
{id:"J21d1",name:"لمروه",g:"F",father:"J21",mother:"J21w1",dates:"1418هـ/1997م –"},
{id:"J21s1",name:"جمال",g:"M",father:"J21",mother:"J21w1",dates:"1422هـ/2001م –"},
{id:"J21s2",name:"سيد الأمين",g:"M",father:"J21",mother:"J21w1",dates:"1424هـ/2003م –"},
{id:"J21s3",name:"الحسن",g:"M",father:"J21",mother:"J21w1",dates:"1428هـ/2007م –"},
{id:"J21s4",name:"ببها",g:"M",father:"J21",mother:"J21w1",dates:"1430هـ/2009م –"},
{id:"J21s5",name:"حيدره",g:"M",father:"J21",mother:"J21w1",dates:"1430هـ/2009م –"},
{id:"J22w1",name:"رقيه",g:"F",father:"XA478",spouses:["J22"],ext:true},
{id:"J23",para:23,name:"محمذن",g:"M",father:"J22",mother:"J22w1",spouses:["J23w1","J23w2"]},
{id:"J36",para:36,name:"المختار",g:"M",father:"J22",mother:"J22w1",spouses:["J36w1"]},
{id:"J23w1",name:"اغليهه",g:"F",father:"XA603",spouses:["J23"],ext:true},
{id:"J23s1",name:"أحمذ",g:"M",father:"J23",mother:"J23w1",note:"لم يعقب"},
{id:"J23w2",name:"مريم",g:"F",father:"K82",mother:"K82w1",note:"بنت بناي بن عاون بن محمد الكريم — رابط بين الأسرتين",spouses:["J23","E30"],crossLink:true},
{id:"J24",para:24,name:"محمد",g:"M",father:"J23",mother:"J23w2",dates:"1333هـ/1915م –",spouses:["J24w1","R14d2"]},
{id:"J24w1",name:"خدجية",g:"F",father:"R14",spouses:["J24"]},
{id:"J25",para:25,name:"أحمياده",g:"M",father:"J24",mother:"J24w1",spouses:["J25w1"]},
{id:"J35",para:35,name:"حمادن",g:"M",father:"J24",mother:"J24w1",spouses:["F110w1"]},
{id:"J24s1",name:"محمد باب",g:"M",father:"J24",mother:"J24w1",note:"لم يعقب"},
{id:"J24d3",name:"عائشة",g:"F",father:"J24",mother:"J24w1",note:"أم النجاة من أبناء محمد سالم بن محنض باب بن اسحاق بن بدر الدين بن الفالي بن أحمد زروق؛ homonyme de J24d3 (autre fille de J24 portant le même prénom) — corrigé après signalement de l'utilisateur؛ بنت محمد بن محمذن بن أحمد البزي بن آجل (الفالي) — رابط بين الأسرتين",spouses:["K33","R26"]},
{id:"J25w1",name:"صفيّه",g:"F",father:"Z99",place:"الصدريات الخضر",spouses:["J25"],fullName:"صفيّه بنت محمذن بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"J26",para:26,name:"محمد فال",g:"M",father:"J25",mother:"J25w1",dates:"1339هـ/1921م – 1416هـ/1996م",place:"أبير حيبلل",spouses:["J26w1"]},
{id:"J31",para:31,name:"محمدن",g:"M",father:"J25",mother:"J25w1",place:"أبير حيبلل",spouses:["J31w1"]},
{id:"J33",para:33,name:"عبد الله",g:"M",father:"J25",mother:"J25w1",dates:"1349هـ/1931م –",spouses:["J33w1","J6d1"]},
{id:"J25d1",name:"مريم",g:"F",father:"J25",mother:"J25w1",note:"لم تعقب؛ بنت أحمياده بن محمد بن محمذن بن أحمد البزي بن آجل (الفالي) — رابط بين الأسرتين؛ رابط بين الأسرتين",fullName:"مريم بنت أحمياده بن محمد بن محمذن بن أحمد البزي بن آجل (الفالي)",spouses:["E38","F116"]},
{id:"J26w1",name:"امتي (فاطمة)",g:"F",father:"J18",mother:"J18w1",note:"بنت امفال (محمد فال) بن أحمد بن البناني بن محمد فال بن ابن غازي بن آلچ — زواج داخلي بالأسرة",dates:"1354هـ/1935م –",spouses:["J26"]},
{id:"J27",para:27,name:"أحمد",g:"M",father:"J26",mother:"J26w1",dates:"1372هـ/1953م –",spouses:["J27w1"]},
{id:"J28",para:28,name:"عبد الله",g:"M",father:"J26",mother:"J26w1",dates:"1376هـ/1957م –",spouses:["J28w1"]},
{id:"J29",para:29,name:"ولد اباه (محمد)",g:"M",father:"J26",mother:"J26w1",dates:"1378هـ/1959م –",spouses:["J29w1"]},
{id:"J30",para:30,name:"النح (محمد عبد الرحمن)",g:"M",father:"J26",mother:"J26w1",dates:"1381هـ/1962م –",spouses:["J30w1"]},
{id:"J26d1",name:"الـمنـَّاه (ام النبي)",g:"F",father:"J26",mother:"J26w1",dates:"1386هـ/1966م –",spouses:["Y90"]},
{id:"J26d3",name:"عشات",g:"F",father:"J26",mother:"J26w1",dates:"1399هـ/1979م –"},
{id:"J27w1",name:"ميّم",g:"F",father:"J39",mother:"V20d1",note:"بنت محمذن السالم بن محمذن بن مولود بن المختار بن أحمد البزي ولد آلچ — زواج داخلي بالأسرة؛ أم أبناء أحمد بن محمد فال بن أحمياده بن محمد بن محمذن بن أحمد البزي بن آلچ",dates:"1388هـ/1968م –",spouses:["J27"]},
{id:"J27s1",name:"محمد فال",g:"M",father:"J27",mother:"J27w1",dates:"1407هـ/1987م –"},
{id:"J27d1",name:"مريم",g:"F",father:"J27",mother:"J27w1",dates:"1409هـ/1989م –"},
{id:"J27s2",name:"محمدن",g:"M",father:"J27",mother:"J27w1"},
{id:"J27d2",name:"عائشة",g:"F",father:"J27",mother:"J27w1"},
{id:"J27d3",name:"تت (خديجة)",g:"F",father:"J27",mother:"J27w1"},
{id:"J27s3",name:"يوسف",g:"M",father:"J27",mother:"J27w1"},
{id:"J27d4",name:"امي",g:"F",father:"J27",mother:"J27w1"},
{id:"J28w1",name:"اميم",g:"F",father:"K44",mother:"J6d2",note:"بنت محمد محمود بن أحمد بن العتيق بن ابامين (الأمين) بن المختار بن أحمد انهكر بن محمد الكريم — رابط بين الأسرتين",dates:"1394هـ/1974م –",spouses:["J28"],crossLink:true},
{id:"J28d1",name:"تحيه",g:"F",father:"J28",mother:"J28w1",dates:"1421هـ/2001م –"},
{id:"J28d2",name:"عائشة",g:"F",father:"J28",mother:"J28w1",dates:"1424هـ/2003م –"},
{id:"J28d3",name:"الساره",g:"F",father:"J28",mother:"J28w1",dates:"1425هـ/2004م –"},
{id:"J28d4",name:"البتول",g:"F",father:"J28",mother:"J28w1",dates:"1427هـ/2006م –"},
{id:"J28d5",name:"بنينه",g:"F",father:"J28",mother:"J28w1",dates:"1431هـ/2010م –"},
{id:"J28d6",name:"صباح",g:"F",father:"J28",mother:"J28w1",dates:"1435هـ/2013م –"},
{id:"J28s1",name:"فالن",g:"M",father:"J28",mother:"J28w1",dates:"1436هـ/2015م –"},
{id:"J29w1",name:"مريم",g:"F",father:"I38",dates:"1389هـ/1969م –",spouses:["J29"],fullName:"مريم بنت السيد بن اميو (محمذن) بن سيد أحممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم",mother:"I38w2",note:"أم انباء محمد (ولد اباه) بن محمد فال بن احمياده بن محمد بن محمذن بن احمد البزي بن آلچ (الفالي)"},
{id:"J29s1",name:"امفال",g:"M",father:"J29",mother:"J29w1",dates:"1428هـ/2007م –"},
{id:"J29d1",name:"البتول",g:"F",father:"J29",mother:"J29w1",dates:"1431هـ/2010م –"},
{id:"J30w1",name:"شدوا (عائشة)",g:"F",father:"I20",dates:"1405هـ/1984م –",spouses:["J30"],crossLink:true,mother:"I20w1",note:"أم امن بنت النح (محمد عبد الرحمن) بن محمد فال بن احميّاده بن محمد بن محمذن بن احمد البزي بن آلچ (الفالي)"},
{id:"J30d1",name:"فلانة",g:"F",father:"J30",mother:"J30w1",dates:"1436هـ/2015م –"},
{id:"J31w1",name:"فاطمه",g:"F",father:"F33",mother:"Y109d4",dates:"1354هـ/1935م – 1427هـ/2006م",place:"أبير حيبلل",spouses:["J31"],crossLink:true},
{id:"J32",para:32,name:"ابو (محمد)",g:"M",father:"J31",mother:"J31w1",dates:"1381هـ/1962م –",spouses:["J32w1"]},
{id:"J31s1",name:"محمد المختار",g:"M",father:"J31",mother:"J31w1",dates:"1384هـ/1964م – 1403هـ/1983م",place:"أحسي السعادة",note:"لم يعقب"},
{id:"J32w1",name:"اخدجيه",g:"F",father:"XA606",spouses:["J32"],ext:true},
{id:"J32s1",name:"اسلم (محمد فال)",g:"M",father:"J32",mother:"J32w1",dates:"1418هـ/1997م –"},
{id:"J32d1",name:"أمامه",g:"F",father:"J32",mother:"J32w1",dates:"1421هـ/2001م –"},
{id:"J32s2",name:"صالح (محمدن)",g:"M",father:"J32",mother:"J32w1",dates:"1424هـ/2003م –"},
{id:"J32s3",name:"أحمدو",g:"M",father:"J32",mother:"J32w1",dates:"1428هـ/2007م –"},
{id:"J32d2",name:"فاطمة",g:"F",father:"J32",mother:"J32w1",dates:"1432هـ/2011م –"},
{id:"J32d3",name:"فلانة",g:"F",father:"J32",mother:"J32w1",dates:"1434هـ/2013م –"},
{id:"J33w1",name:"عائشة",g:"F",father:"J5",mother:"E57d4",note:"بنت محمد فال بن أحمد سالم بن أحمد بن محمد فال بن ابن غازي بن آلچ — زواج داخلي بالأسرة",dates:"1372هـ/1953م –",spouses:["J33"]},
{id:"J34",para:34,name:"سيد أحمد",g:"M",father:"J33",mother:"J33w1",dates:"1388هـ/1968م –",spouses:["J34w1","J34w2"]},
{id:"J33s1",name:"جـد (محمد فال)",g:"M",father:"J33",mother:"J33w1",dates:"1391هـ/1971م –"},
{id:"J33d2",name:"اللجنه",g:"F",father:"J33",mother:"J33w1",dates:"1398هـ/1978م –"},
{id:"J33d4",name:"حاجه",g:"F",father:"J33",mother:"J33w1",dates:"1406هـ/1986م –"},
{id:"J33d5",name:"ميمهنه",g:"F",father:"J33",mother:"J33w1",dates:"1411هـ/1991م –"},
{id:"J33s2",name:"محمدن",g:"M",father:"J33",mother:"J33w1",dates:"1415هـ/1995م –"},
{id:"J34w1",name:"فلانة",g:"F",father:null,spouses:["J34"]},
{id:"J34s1",name:"محمد",g:"M",father:"J34",mother:"J34w1"},
{id:"J34w2",name:"فلانة",g:"F",father:null,spouses:["J34"]},
{id:"J34d1",name:"فاطمة",g:"F",father:"J34",mother:"J34w2"},
{id:"J35s1",name:"محمد",g:"M",father:"J35",mother:"F110w1",note:"لم يعقب"},
{id:"J35d1",name:"فاطمة",g:"F",father:"J35",mother:"F110w1",place:"أحسي السعادة",note:"أم ينجح وتسلم ابني ابن بن محمدن بن بباه (سيد الفالي) بن محمذن بن باني"},
{id:"J36w1",name:"فاطمه فال",g:"F",father:"XA607",spouses:["J36"],ext:true},
{id:"J37",para:37,name:"مولود",g:"M",father:"J36",mother:"J36w1",spouses:["J37w1"]},
{id:"J36s1",name:"اليدالي",g:"M",father:"J36",mother:"J36w1",note:"لم يعقب"},
{id:"J36d2",name:"أم النبي",g:"F",father:"J36",mother:"J36w1",note:"لم تعقب"},
{id:"J36d3",name:"سوده",g:"F",father:"J36",mother:"J36w1",note:"لم تعقب"},
{id:"J37w1",name:"مريم",g:"F",father:"K53",note:"بنت الكوري ضال بن سيد أحمد بن حبلل بن آمين بن محمد الكريم — رابط بين الأسرتين",spouses:["J37"],crossLink:true,mother:"K53w1"},
{id:"J37s1",name:"الكوري",g:"M",father:"J37",mother:"J37w1",note:"لم يعقب"},
{id:"J38",para:38,name:"محمذن",g:"M",father:"J37",mother:"J37w1",dates:"1352هـ/1933م –",spouses:["Y76d2"]},
{id:"J38d1",name:"أم المؤمنين",g:"F",father:"J38",mother:"Y76d2",dates:"1349هـ/1930م –",place:"أبير حيبلل",note:"أم عبد الله ومريم ابني محمدن بن محمد بن اگليب"},
{id:"J39",para:39,name:"محمذن السالم",g:"M",father:"J38",mother:"Y76d2",dates:"1352هـ/1933م –",spouses:["V20d1"]},
{id:"J40",para:40,name:"أحمد",g:"M",father:"J39",mother:"V20d1",dates:"1385هـ/1965م –",spouses:["Y51d1"]},
{id:"J39d2",name:"آمنة",g:"F",father:"J39",mother:"V20d1",dates:"1391هـ/1971م –"},
{id:"J39d3",name:"لمروه",g:"F",father:"J39",mother:"V20d1",dates:"1396هـ/1976م –"},
{id:"J39d4",name:"صباح",g:"F",father:"J39",mother:"V20d1",dates:"1399هـ/1979م –",note:"أم أبناء عابدين بن سيد بن أحمد سالم بن محمذن بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف" ,spouses:["Z103"] ,crossLink:true},
{id:"J39d6",name:"عائشة",g:"F",father:"J39",mother:"V20d1",dates:"1406هـ/1986م –"},
{id:"J39s1",name:"محمذن",g:"M",father:"J39",mother:"V20d1",dates:"1409هـ/1989م –"},
{id:"J40s1",name:"عبد الله",g:"M",father:"J40",mother:"Y51d1",dates:"1432هـ/2011م –"},
{id:"J40d1",name:"الشفاء",g:"F",father:"J40",mother:"Y51d1",dates:"1434هـ/2013م –"},
{id:"E1",para:1,name:"الأمين عمي",g:"M",father:"T0-fali",mother:"Y1d6",note:"بن الفالي بن الكوري بن سيد الفالي",spouses:["E1w1","E1w2"]},
{id:"E1w1",name:"فلانة",g:"F",father:"XA900",spouses:["E1"],ext:true},
{id:"E2",para:2,name:"فوگ",g:"M",father:"E1",mother:"E1w1",spouses:["E2w1","R22d1"]},
{id:"E28",para:28,name:"محمذن",g:"M",father:"E1",mother:"E1w1",spouses:["L2d2"]},
{id:"E1w2",name:"فلانة",g:"F",father:"XA375",spouses:["E1"],ext:true},
{id:"E53",para:53,name:"المعزوز",g:"M",father:"E1",mother:"E1w2",spouses:["Z4w1"]},
{id:"E2w1",name:"فلانة",g:"F",father:"R22",mother:"R22w1",spouses:["E2"]},
{id:"E3",para:3,name:"أحمد زروق",g:"M",father:"E2",mother:"E2w1",spouses:["E3w1","D17d2"]},
{id:"E10",para:10,name:"النجيب",g:"M",father:"E2",mother:"E2w1",spouses:["E10w1"]},
{id:"E2d1",name:"غاديجه",g:"F",father:"E2",mother:"E2w1",note:"أم أبناء الفغ الماح -أدودنيقب-"},
{id:"E2d2",name:"منت لعبيد (فاطمة)",g:"F",father:"E2",mother:"E2w1",note:"أم ابني ابن غازي بن آجل (الفالي)" ,spouses:["J2"] ,crossLink:true},
{id:"E2d3",name:"مومنتي",g:"F",father:"E2",mother:"E2w1",note:"أم أبناء بزيد بن عبد القادر بن الصالح -إلى بوفلان-",spouses:["XA614"]},
{id:"E3w1",name:"خدجيان",g:"F",father:"D17",mother:"D17w1",spouses:["E3"]},
{id:"E4",para:4,name:"محمذن",g:"M",father:"E3",mother:"E3w1",spouses:["F18w2"]},
{id:"E3d1",name:"مريم",g:"F",father:"E3",mother:"E3w1",note:"أم اماتو وخدجيو من أبناء بزيد بن محمذن بن الفالي بن المبارك بن اما (الماقور)" ,spouses:["K13"] ,crossLink:true},
{id:"E3d3",name:"مريم",g:"F",father:"E3",mother:"E3w1",spouses:["F20"],crossLink:true,note:"homonyme de E3d1 (même prénom مريم, autre fille de E3) — corrigé après signalement de l'utilisateur"},
{id:"E3d2",name:"منمن",g:"F",father:"E3",mother:"E3w1",note:"أم أبناء الكوري بن محمد بن المبارك بن اما (الماقور)" ,spouses:["F133"] ,crossLink:true},
{id:"E5",para:5,name:"المختار خير",g:"M",father:"E4",mother:"F18w2",spouses:["E5w1","Y49w1"]},
{id:"E4d1",name:"فطيمن",g:"F",father:"E4",mother:"F18w2",note:"أم أحمد وعيشان من أبناء محمذن بن بزيد بن محمذن بن الفالي بن المبارك بن اما (الماقور)",place:"باجديارت",spouses:["K154","F80"]},
{id:"E4d2",name:"هاله",g:"F",father:"E4",mother:"F18w2",note:"أم ببكر وصفيّو من أبناء بكاك بن الجمد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",spouses:["Y31"]},
{id:"E5w1",name:"صفيّه",g:"F",father:"XA611",spouses:["E5"],ext:true},
{id:"E6",para:6,name:"أمّد (أحمذ)",g:"M",father:"E5",mother:"E5w1",spouses:["E6w1","E6w2"]},
{id:"E5d2",name:"خديجة",g:"F",father:"E5",mother:"E5w1",note:"أم أبناء محمد سالم بن اناّه (مختّي) بن محادي"},
{id:"E5d3",name:"عيشة",g:"F",father:"E5",mother:"E5w1",note:"لم تعقب"},
{id:"E5d4",name:"فاطمة",g:"F",father:"E5",mother:"E5w1",note:"أم أبناء محمد عبد الله بن محمدكم بن حبلل بن محمذن بن سعدن (المختار)"},
{id:"E5d5",name:"هاله",g:"F",father:"E5",mother:"E5w1",note:"أم ابامين من أبناء محمد بن باب بن الفاظل بن أحمد انهكر بن محمد الكريم",spouses:["K18"]},
{id:"E5d6",name:"مريم",g:"F",father:"E5",mother:"Y49w1",note:"لم تعقب"},
{id:"E6w1",name:"أميّم (مريم)",g:"F",father:"E44",mother:"K4d3",note:"بنت أحمدون بن السبتي بن سيد المختار بن محمذن بن الأمين عمي — زواج داخلي بالأسرة؛ أم أحمد سالم من أبناء أمّد بن المختار خير بن محمذن بن أحمد زروق بن فوگ بن الأمين عمي",spouses:["E6"],dates:"1392هـ/1972م –",place:"محجوبو"},
{id:"E7",para:7,name:"أحمد سالم",g:"M",father:"E6",mother:"E6w1",spouses:["L6d1"]},
{id:"E6w2",name:"صفيّه",g:"F",father:"F80",spouses:["E6"],crossLink:true,fullName:"صفيّه بنت محمذن بن بزيد بن محمذن بن الفالي بن المبارك بن اما (الماقور)",mother:"F80w3",note:"أم محمد وفاطمة من أبناء أمد بن المختار خي بن محمذن بن أحمد زروق بن فوك بن الأمين عمي — لم يعقبا"},
{id:"E6s1",name:"محمد",g:"M",father:"E6",mother:"E6w2",note:"لم يعقب"},
{id:"E6d1",name:"فاطمة",g:"F",father:"E6",mother:"E6w2",note:"لم تعقب"},
{id:"E8",para:8,name:"محمدن",g:"M",father:"E7",mother:"L6d1",spouses:["E8w1"]},
{id:"E9",para:9,name:"الخامس",g:"M",father:"E7",mother:"L6d1",spouses:["E9w1"]},
{id:"E7d1",name:"اميم",g:"F",father:"E7",mother:"L6d1" ,spouses:["M43"] ,dates:"1393هـ/1973م –" ,crossLink:true},
{id:"E7d2",name:"لمروه",g:"F",father:"E7",mother:"L6d1"},
{id:"E7s1",name:"محمد",g:"M",father:"E7",mother:"L6d1"},
{id:"E7s2",name:"محمد فال",g:"M",father:"E7",mother:"L6d1"},
{id:"E7s3",name:"عبد الله",g:"M",father:"E7",mother:"L6d1"},
{id:"E8w1",name:"خيّا",g:"F",father:"Z104",spouses:["E8"],fullName:"خيّا بنت محمد بن محمذن فال (ولد متايل) بن محمد بن المختار بن أحمد سهلو بن محمذن بن عبد الله بن اشفغ حيب الله بن اعمر بن ابوبك بن أحمذنلل"},
{id:"E8s1",name:"أحمد سالم",g:"M",father:"E8",mother:"E8w1"},
{id:"E8s2",name:"أحمد",g:"M",father:"E8",mother:"E8w1"},
{id:"E8d1",name:"ميّم (عيشه فال)",g:"F",father:"E8",mother:"E8w1"},
{id:"E9w1",name:"عائشة",g:"F",father:"XA1229",spouses:["E9"],ext:true},
{id:"E9d1",name:"فاطمة السالمه",g:"F",father:"E9",mother:"E9w1"},
{id:"E9d2",name:"خديجة",g:"F",father:"E9",mother:"E9w1"},
{id:"E9s1",name:"الشيخ",g:"M",father:"E9",mother:"E9w1"},
{id:"E9s2",name:"أحمد سالم",g:"M",father:"E9",mother:"E9w1"},
{id:"E9s3",name:"أحمد",g:"M",father:"E9",mother:"E9w1"},
{id:"E10w1",name:"أم المؤمنين",g:"F",father:"Y12",spouses:["E10"]},
{id:"E11",para:11,name:"ابن",g:"M",father:"E10",mother:"E10w1",spouses:["E11w1"]},
{id:"E23",para:23,name:"عبد الله",g:"M",father:"E10",mother:"E10w1",spouses:["E23w1"]},
{id:"E11w1",name:"محبوبه",g:"F",father:"F133",mother:"E3d2",spouses:["E11"],crossLink:true},
{id:"E12",para:12,name:"محدن",g:"M",father:"E11",mother:"E11w1",place:"النمجاط",spouses:["E12w1"]},
{id:"E11d1",name:"مريم",g:"F",father:"E11",mother:"E11w1",note:"أم نبغوه بن المختار السالم بن محمذن بن أحممد بن حبلل اسليطين" ,spouses:["H7"] ,crossLink:true},
{id:"E12w1",name:"عيشة",g:"F",father:"XA614",mother:"E2d3",spouses:["E12"],ext:true},
{id:"E13",para:13,name:"محمد سيد",g:"M",father:"E12",mother:"E12w1",place:"أحسي السعادة",spouses:["E13w1","E13w2","E13w3"]},
{id:"E12s1",name:"أحمد نافع",g:"M",father:"E12",mother:"E12w1",place:"النمجاط",note:"لم يعقب"},
{id:"E21",para:21,name:"محمد فاضل",g:"M",father:"E12",mother:"E12w1",place:"اغورس",spouses:["E21w1"]},
{id:"E12d1",name:"فاطمة",g:"F",father:"E12",mother:"E12w1",note:"لم تعقب"},
{id:"E12d2",name:"محبوبه",g:"F",father:"E12",mother:"E12w1",place:"اغورس",note:"أم أبناء سيد بن بال -إلى بوفلان-"},
{id:"E13w1",name:"اخدجيّب -أدوعيش-",g:"F",father:null,spouses:["E13"]},
{id:"E14",para:14,name:"محمد فاضل",g:"M",father:"E13",mother:"E13w1",spouses:["E14w1"]},
{id:"E13d1",name:"أم الفضل",g:"F",father:"E13",mother:"E13w1"},
{id:"E15",para:15,name:"محمد لغظف",g:"M",father:"E13",mother:"E13w1",spouses:["E15w1"]},
{id:"E13d2",name:"آيّه (عيشه)",g:"F",father:"E13",mother:"E13w1"},
{id:"E13w2",name:"عيشه",g:"F",father:"XA615",spouses:["E13"],ext:true},
{id:"E13d3",name:"مريم",g:"F",father:"E13",mother:"E13w2"},
{id:"E13d4",name:"فاطمة",g:"F",father:"E13",mother:"E13w2"},
{id:"E13s1",name:"الخليفه",g:"M",father:"E13",mother:"E13w2",place:"تيزنيت (المغرب)",note:"لم يعقب"},
{id:"E13w3",name:"أم الخير",g:"F",father:"D63",spouses:["E13"]},
{id:"E16",para:16,name:"أدّن (محدن)",g:"M",father:"E13",mother:"E13w3",spouses:["E16w1","E16w2"]},
{id:"E17",para:17,name:"ابوه (الشيخ سعد بوه)",g:"M",father:"E13",mother:"E13w3",spouses:["E17w1"]},
{id:"E18",para:18,name:"النعمه",g:"M",father:"E13",mother:"E13w3",spouses:["E18w1"]},
{id:"E19",para:19,name:"الشيخ ماء العينين",g:"M",father:"E13",mother:"E13w3",spouses:["E19w1"]},
{id:"E20",para:20,name:"أحمد",g:"M",father:"E13",mother:"E13w3",spouses:["E20w1","E20w2"]},
{id:"E13d5",name:"خديجة",g:"F",father:"E13",mother:"E13w3"},
{id:"E14w1",name:"عيشة",g:"F",father:"XA616",spouses:["E14"],ext:true},
{id:"E14s1",name:"الإمام",g:"M",father:"E14",mother:"E14w1"},
{id:"E14s2",name:"حامد",g:"M",father:"E14",mother:"E14w1"},
{id:"E14s3",name:"محمد سيد",g:"M",father:"E14",mother:"E14w1"},
{id:"E14s4",name:"فالن",g:"M",father:"E14",mother:"E14w1"},
{id:"E14d1",name:"توت",g:"F",father:"E14",mother:"E14w1"},
{id:"E14d2",name:"مريم",g:"F",father:"E14",mother:"E14w1"},
{id:"E14d3",name:"أم الخيري",g:"F",father:"E14",mother:"E14w1"},
{id:"E14d4",name:"فاطمة",g:"F",father:"E14",mother:"E14w1"},
{id:"E14d5",name:"محبوبه",g:"F",father:"E14",mother:"E14w1"},
{id:"E15w1",name:"آمنة",g:"F",father:"XA620",spouses:["E15"],ext:true},
{id:"E15s1",name:"محمد سيد",g:"M",father:"E15",mother:"E15w1"},
{id:"E15s2",name:"أبوه",g:"M",father:"E15",mother:"E15w1"},
{id:"E15d1",name:"اخديجتن",g:"F",father:"E15",mother:"E15w1"},
{id:"E15d2",name:"سلمى",g:"F",father:"E15",mother:"E15w1"},
{id:"E16w1",name:"أم كلثوم",g:"F",father:"XA1231",spouses:["E16"],ext:true},
{id:"E16s1",name:"محمد سيد",g:"M",father:"E16",mother:"E16w1"},
{id:"E16w2",name:"الخيت",g:"F",father:"XA620",spouses:["E16"],ext:true},
{id:"E16d1",name:"أم الخير",g:"F",father:"E16",mother:"E16w2"},
{id:"E16s2",name:"محمد عبد الله",g:"M",father:"E16",mother:"E16w2"},
{id:"E16d2",name:"فاطمة",g:"F",father:"E16",mother:"E16w2"},
{id:"E17w1",name:"زينب",g:"F",father:"XA621",spouses:["E17"],ext:true},
{id:"E17d1",name:"محبوبه",g:"F",father:"E17",mother:"E17w1"},
{id:"E17d2",name:"فاطمة الزهراء",g:"F",father:"E17",mother:"E17w1"},
{id:"E17s1",name:"محمد سيد",g:"M",father:"E17",mother:"E17w1"},
{id:"E17s2",name:"أحمد",g:"M",father:"E17",mother:"E17w1"},
{id:"E18w1",name:"مريم",g:"F",father:"K130",note:"بنت محمدن بن ديدي بن اتو (الكوري) بن محمذن بن سيد الفالي بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",spouses:["E18"],crossLink:true,mother:"K130w1",dates:"1400هـ/1980م –"},
{id:"E18s1",name:"محمد سيد",g:"M",father:"E18",mother:"E18w1"},
{id:"E19w1",name:"خدجية",g:"F",father:"D62s1",spouses:["E19"]},
{id:"E19d1",name:"أم الخيري",g:"F",father:"E19",mother:"E19w1"},
{id:"E19d2",name:"فاطمة",g:"F",father:"E19",mother:"E19w1"},
{id:"E20w1",name:"عيشة",g:"F",father:"K108",mother:"K108w1",note:"بنت الشيخ بن محود بن سيد أحمد لحبيب بن محمذن بن انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",spouses:["E20"],crossLink:true},
{id:"E20s1",name:"الصديق",g:"M",father:"E20",mother:"E20w1"},
{id:"E20w2",name:"عيشة",g:"F",father:"Z109",mother:"Z109w1",note:"بنت محمدن بن محم بن ممّن (محمذيني) بن سيد بن محمد بن الأمين بن محم بن أبو الحس بن المزضف — رابط بين الأسرتين",spouses:["E20"],crossLink:true},
{id:"E20s2",name:"محمد",g:"M",father:"E20",mother:"E20w2"},
{id:"E21w1",name:"أم المؤمنين",g:"F",father:"XA622",spouses:["E21"],ext:true},
{id:"E22",para:22,name:"محمد سيد",g:"M",father:"E21",mother:"E21w1",spouses:["E22w1"]},
{id:"E22w1",name:"خدجية",g:"F",father:"E13",note:"زواج داخلي بالأسرة",spouses:["E22"]},
{id:"E22d1",name:"أم المؤمنين",g:"F",father:"E22",mother:"E22w1"},
{id:"E22s1",name:"محمد فاضل",g:"M",father:"E22",mother:"E22w1"},
{id:"E22d2",name:"التاته",g:"F",father:"E22",mother:"E22w1"},
{id:"E23w1",name:"فاطمه فال",g:"F",father:"I26",mother:"I64d3",note:"بنت ببكر بن سيد الفالي — قد تكون نفس I12w1 (زوجة اتاه) — إلى تحقيق",spouses:["E23"],crossLink:true},
{id:"E24",para:24,name:"محمذن باب",g:"M",father:"E23",mother:"E23w1",spouses:["E24w1"]},
{id:"E23s1",name:"محمذن فال",g:"M",father:"E23",mother:"E23w1",note:"لم يعقب"},
{id:"E24w1",name:"فاطمة",g:"F",father:"I27",mother:"I5d1",note:"بنت سيد أحممد بن ببكر — أم أبناء محمذن باب بن عبد الله بن النجيب بن فوك بن الأمين عمي",spouses:["E24"],crossLink:true},
{id:"E24s1",name:"سيد",g:"M",father:"E24",mother:"E24w1",note:"لم يعقب"},
{id:"E25",para:25,name:"محمدن",g:"M",father:"E24",mother:"E24w1",dates:"1412هـ/1992م –",place:"أحسي السعادة",spouses:["E25w1"]},
{id:"E24d1",name:"أم الخير",g:"F",father:"E24",mother:"E24w1",note:"لم تعقب"},
{id:"E24d2",name:"مريم",g:"F",father:"E24",mother:"E24w1",note:"لم تعقب"},
{id:"E25w1",name:"فاطمة",g:"F",father:"H1",dates:"1438هـ/2016م –",place:"أحسي السعادة",spouses:["E25"],ext:true},
{id:"E26",para:26,name:"المختار",g:"M",father:"E25",mother:"E25w1",dates:"1378هـ/1959م –",spouses:["E26w1","E26w2"]},
{id:"E26w1",name:"محبوبه",g:"F",father:"E13",mother:"E13w3",note:"زواج داخلي بالأسرة",spouses:["E26"]},
{id:"E27",para:27,name:"عبد الله",g:"M",father:"E26",mother:"E26w1",spouses:["E27w1"]},
{id:"E26w2",name:"فاطمة",g:"F",father:"Z152",mother:"Z152w1",note:"بنت دمّين (سيد الأمين) بن آياه (بوبكر) بن أحمد بن الأمين بن حمم بن أبو الحس بن المزضف — رابط بين الأسرتين",dates:"1391هـ/1971م –",spouses:["E26"],crossLink:true},
{id:"E26d1",name:"مريم",g:"F",father:"E26",mother:"E26w2",dates:"1411هـ/1991م –"},
{id:"E26d2",name:"عيشة",g:"F",father:"E26",mother:"E26w2",dates:"1412هـ/1992م –"},
{id:"E26s1",name:"الحسين",g:"M",father:"E26",mother:"E26w2",dates:"1418هـ/1997م –"},
{id:"E26d3",name:"أم الخيري (امامه)",g:"F",father:"E26",mother:"E26w2",dates:"1433هـ/2012م –"},
{id:"E27w1",name:"منايه",g:"F",father:"E36",mother:"E36w1",note:"زواج داخلي بالأسرة",spouses:["E27"],dates:"1415هـ/1995م –"},
{id:"E27s1",name:"فالن",g:"M",father:"E27",mother:"E27w1"},
{id:"E29",para:29,name:"الإمام أحمد",g:"M",father:"E28",mother:"L2d2",place:"صالحين المصران",spouses:["E29w1","R52d1"]},
{id:"E42",para:42,name:"سيد المختار",g:"M",father:"E28",mother:"L2d2",spouses:["E42w1","R66d2"]},
{id:"E51",para:51,name:"الفالي",g:"M",father:"E28",mother:"L2d2",spouses:["E51w1"]},
{id:"E28s1",name:"المعزوز",g:"M",father:"E28",mother:"L2d2",note:"لم يعقب"},
{id:"E28d1",name:"فاطمة",g:"F",father:"E28",mother:"L2d2",note:"أم الأمين وسيد الفالي ابني إمام (إمام الحرمين) بن عبد الله بن اشفغ مينحنو"},
{id:"E29w1",name:"امباركه",g:"F",father:"E1s1s1",spouses:["E29"]},
{id:"E30",para:30,name:"زيد",g:"M",father:"E29",mother:"E29w1",spouses:["J23w2"]},
{id:"E31",para:31,name:"سيد الفالي",g:"M",father:"E29",mother:"E29w1",spouses:["E31w1"]},
{id:"E41",para:41,name:"الأمين",g:"M",father:"E29",mother:"E29w1",spouses:["E41w1"]},
{id:"E30s1",name:"محمد فال",g:"M",father:"E30",mother:"J23w2",note:"لم يعقب"},
{id:"E31w1",name:"مالليّه",g:"F",father:"E42",mother:"R66d2",note:"زواج داخلي بالأسرة؛ أم أبناء سيد الفالي بن الإمام أحمد بن محمذن بن الأمين عمي",spouses:["E31"]},
{id:"E32",para:32,name:"أحمد",g:"M",father:"E31",mother:"E31w1",dates:"1334هـ/1916م –",spouses:["E32w1","E32w2","L11d1"]},
{id:"E31s1",name:"اسلام",g:"M",father:"E31",mother:"E31w1",note:"لم يعقب"},
{id:"E31d1",name:"فاطمة",g:"F",father:"E31",mother:"E31w1",note:"لم تعقب"},
{id:"E31d2",name:"ناصرها الله",g:"F",father:"E31",mother:"E31w1",note:"لم تعقب"},
{id:"E32w1",name:"أم المؤمنين",g:"F",father:"L15",note:"بنت المختار بن محمذن بن الفظيل بن اللين (الأمين) بن ميلود — رابط بين الأسرتين",spouses:["E32"],crossLink:true},
{id:"E33",para:33,name:"أحمد سالم",g:"M",father:"E32",mother:"E32w1",dates:"1362هـ/1943م –",spouses:["E33w1"]},
{id:"E38",para:38,name:"ببكر",g:"M",father:"E32",mother:"E32w1",dates:"1362هـ/1943م –",spouses:["J25d1"]},
{id:"E39",para:39,name:"مدال",g:"M",father:"E32",mother:"E32w1",dates:"١٩١٨؟ – 1411هـ/1981م",place:"أبير حيبلل",note:"تاريخ الميلاد غير واضح في المصدر الأصلي (OCR ملتبس)",spouses:["E39w1","E39w2"]},
{id:"E32w2",name:"المكبوله",g:"F",father:"XA624",spouses:["E32"],ext:true},
{id:"E32s1",name:"سيد الفالي",g:"M",father:"E32",mother:"E32w2",spouses:["E32s1w1"]},
{id:"E32s1w1",name:"امنيانه",g:"F",father:"N1",spouses:["E32s1"],crossLink:true,fullName:"امنيانه بنت محمذن بن الخلف",ext:true},
{id:"E32s1d1",name:"مريم",g:"F",father:"E32s1",mother:"E32s1w1",note:"لم تعقب"},
{id:"E33w1",name:"خدجية",g:"F",father:"XA1238",spouses:["E33"],ext:true},
{id:"E34",para:34,name:"المختار",g:"M",father:"E33",mother:"E33w1",dates:"1337هـ/1919م – 1437هـ/2016م",place:"أبير حيبلل",spouses:["E34w1","E34w2","E34w3"]},
{id:"E34w1",name:"فاطمة السالمه",g:"F",father:"M11",mother:"M11w1",note:"بنت محمذن بن أحمد بن المختار بن محمذن بن الغالي بن باركلل بن بوالماح بن متيلي — رابط بين الأسرتين",dates:"1378هـ/1959م –",spouses:["E34"],crossLink:true},
{id:"E34d1",name:"اطفيلهه",g:"F",father:"E34",mother:"E34w1",dates:"1371هـ/1951م –",place:"صالحين المصران",note:"لم تعقب"},
{id:"E34w2",name:"أميّم",g:"F",father:"H8",mother:"H8w2",note:"بنت حمود بن المختار السالم بن محمذن بن أحممد بن حبلل اسليطين — رابط بين الأسرتين",dates:"1359هـ/1941م – 1396هـ/1976م",place:"تنيخلف",spouses:["E34"],crossLink:true},
{id:"E35",para:35,name:"محمدي",g:"M",father:"E34",mother:"E34w2",dates:"1378هـ/1959م –",spouses:["E35w1","E35w2"]},
{id:"E36",para:36,name:"داداه (الحسن)",g:"M",father:"E34",mother:"E34w2",dates:"1381هـ/1962م –",spouses:["E36w1"]},
{id:"E37",para:37,name:"الشيخ",g:"M",father:"E34",mother:"E34w2",dates:"1386هـ/1966م –",spouses:["E37w1"]},
{id:"E34d2",name:"آيه (العالية)",g:"F",father:"E34",mother:"E34w2",dates:"1391هـ/1971م –"},
{id:"E34d3",name:"الفايخه (آسية)",g:"F",father:"E34",mother:"E34w2",dates:"1393هـ/1973م –" ,spouses:["Z154"] ,crossLink:true},
{id:"E34w3",name:"ميّام",g:"F",father:"E31s2s1",note:"زواج داخلي بالأسرة",dates:"1372هـ/1953م –",spouses:["E34"]},
{id:"E34d4",name:"نتاشه",g:"F",father:"E34",mother:"E34w3",dates:"1415هـ/1985م –"},
{id:"E35w1",name:"مريم",g:"F",father:"I19",dates:"1391هـ/1971م –",spouses:["E35"],crossLink:true,fullName:"مريم بنت أحمد سالم بن أبوبا (ببكر) بن المختار بن سيد أحمد بن حبلل بن ابراهيم"},
{id:"E35d1",name:"تحيه",g:"F",father:"E35",mother:"E35w1",dates:"1411هـ/1991م –"},
{id:"E35w2",name:"ابابّه",g:"F",father:"J34",spouses:["E35"]},
{id:"E35s1",name:"لمشعشع (ببكر)",g:"M",father:"E35",mother:"E35w2",dates:"1413هـ/1993م –"},
{id:"E35s2",name:"سيد أحمد",g:"M",father:"E35",mother:"E35w2",dates:"1414هـ/1994م –"},
{id:"E35d2",name:"اميم",g:"F",father:"E35",mother:"E35w2",dates:"1416هـ/1996م –"},
{id:"E35d3",name:"نفيسه",g:"F",father:"E35",mother:"E35w2",dates:"1422هـ/2001م –"},
{id:"E35s3",name:"محمد",g:"M",father:"E35",mother:"E35w2",dates:"1425هـ/2004م –"},
{id:"E35d4",name:"النيده",g:"F",father:"E35",mother:"E35w2",dates:"1428هـ/2007م –"},
{id:"E36w1",name:"ادّانّه",g:"F",father:"XA625",spouses:["E36"],ext:true},
{id:"E36s1",name:"أحمد",g:"M",father:"E36",mother:"E36w1",dates:"1412هـ/1992م –"},
{id:"E36s2",name:"محمد",g:"M",father:"E36",mother:"E36w1",dates:"1421هـ/2001م –"},
{id:"E36d2",name:"أميّم",g:"F",father:"E36",mother:"E36w1",dates:"1428هـ/2007م –"},
{id:"E37w1",name:"بوبّه",g:"F",father:"H9",mother:"R57d1",note:"بنت عبد الرحمن بن حمود بن المختار السالم بن محمذن بن أحممد بن حبلل اسليطين — رابط بين الأسرتين",spouses:["E37"],crossLink:true,dates:"1401هـ/1981م –"},
{id:"E37s1",name:"محمد يحي",g:"M",father:"E37",mother:"E37w1",dates:"1435هـ/2014م –"},
{id:"E38d1",name:"فاطمة",g:"F",father:"E38",mother:"J25d1",note:"لم تعقب"},
{id:"E39w1",name:"فاطمة",g:"F",father:"D9",mother:"D9w1",dates:"1341هـ/1923م – 1431هـ/2010م",place:"أحسي السعادة",spouses:["E39"],fullName:"فاطمة بنت اليدالي بن أحمد بن أحميميد بن المختار بن القاضي بن أحموذيلل بن سيد (المختار) بن عبد الله"},
{id:"E39d1",name:"انجايه",g:"F",father:"E39",mother:"E39w1",dates:"1367هـ/1948م –"},
{id:"E39d2",name:"منت مختير",g:"F",father:"E39",note:"لم تعقب"},
{id:"E39w2",name:"ميمهنه",g:"F",father:"M55",mother:"M55w1",note:"بنت المختار السالم بن عبد العزيز بن المختار بن محمذن بن الأمين بن الفالي بن متيلي — رابط بين الأسرتين",dates:"1336هـ/1918م – 1416هـ/1986م",place:"أبير حيبلل",spouses:["E39"],crossLink:true},
{id:"E39d3",name:"عيشه",g:"F",father:"E39",mother:"E39w2",dates:"1369هـ/1951م –"},
{id:"E41w1",name:"امبّييكه",g:"F",father:"XA631",spouses:["E41"],ext:true},
{id:"E41d1",name:"كاكا",g:"F",father:"E41",mother:"E41w1",note:"لم تعقب"},
{id:"E42w1",name:"امبوجه",g:"F",father:"Y14",spouses:["E42"],mother:"Y14w1",note:"أم السبيت من أبناء سيد المختار بن محمذن بن الأمين عمي"},
{id:"E43",para:43,name:"السبتي",g:"M",father:"E42",mother:"E42w1",place:"تنيخلف",spouses:["E43w1"]},
{id:"E50",para:50,name:"أحمد",g:"M",father:"E42",mother:"R66d2",spouses:["E50w1"]},
{id:"E42d1",name:"خديجة",g:"F",father:"E42",mother:"R66d2",note:"أم محمذن وامنيانو من أبناء أحميد بن اندعمر بن محمذن بن أحمد شب"},
{id:"E42d2",name:"عيشه فال",g:"F",father:"E42",mother:"R66d2",note:"أم محمذن بن بابك بن حيب الله بن الفالي بن أحمد زروق، وأم أبناء محمذن بن المزضف بن الأمين بن اشفغ مينحنو؛ بنت سيد المختار بن محمذن بن الأمين عمي — رابط بين الأسرتين؛ رابط بين الأسرتين",spouses:["R37","G93"]},
{id:"E43w1",name:"منت النبي",g:"F",father:"H2",mother:"M7d1",note:"بنت أحممد بن حبلل اسليطين — رابط بين الأسرتين",spouses:["E43"],crossLink:true},
{id:"E44",para:44,name:"أحمدون",g:"M",father:"E43",mother:"E43w1",place:"أبير حيبلل",spouses:["K4d3"]},
{id:"E46",para:46,name:"بادّا (محمد فال)",g:"M",father:"E43",mother:"E43w1",dates:"1327هـ/1919م –",place:"أبير حيبلل",spouses:["E46w1"]},
{id:"E49",para:49,name:"المختار",g:"M",father:"E43",mother:"E43w1",spouses:["E49w1"]},
{id:"E43d1",name:"مريم",g:"F",father:"E43",mother:"E43w1",note:"أم أبناء أحمد المبارك بن بوبكر بن حمم بن أبو الحس بن المزضف",spouses:["Z43"]},
{id:"E44s1",name:"أحمد سالم",g:"M",father:"E44",mother:"K4d3",note:"لم يعقب"},
{id:"E44s2",name:"عبد الله",g:"M",father:"E44",mother:"K4d3",place:"المذرذره",note:"لم يعقب"},
{id:"E44s3",name:"محمد",g:"M",father:"E44",mother:"K4d3",dates:"1288هـ/1871م – 1347هـ/1929م",place:"أبير حيبلل",note:"لم يعقب"},
{id:"E44s4",name:"محمدن",g:"M",father:"E44",mother:"K4d3",dates:"1362هـ/1943م –",note:"لم يعقب"},
{id:"E45",para:45,name:"المختار",g:"M",father:"E44",mother:"K4d3",dates:"1358هـ/1939م –",spouses:["E45w1"]},
{id:"E44d1",name:"أم الخيري",g:"F",father:"E44",mother:"K4d3",note:"أم أميّم من أبناء المختار بن سيد بن محمذن بن احجاب بن محمد الكريم — لم تعقب" ,spouses:["K8"] ,crossLink:true},
{id:"E44d3",name:"صفيّه",g:"F",father:"E44",mother:"K4d3",note:"أم توت (فاطمة السالمه) من أبناء الكوري بن بزيد بن محمذن بن الفالي بن المبارك بن اما (الماقور)"},
{id:"E44d4",name:"لـم",g:"F",father:"E44",mother:"K4d3",place:"تنبيعلي",note:"أم اَّكاه من أبناء محمد بن اياي (أحمد) بن دياه (سيد الفالي) بن محمذن بن الفالي بن المبارك بن اما (الماقور)",spouses:["F64"]},
{id:"E45w1",name:"مريم لمباركو",g:"F",father:"F80",place:"أبير حيبلل",spouses:["E45"],crossLink:true,fullName:"مريم لمباركو بنت محمذن بن بزيد بن محمذن بن الفالي بن المبارك بن اما (الماقور)"},
{id:"E45s1",name:"أحمد",g:"M",father:"E45",mother:"E45w1",note:"لم يعقب"},
{id:"E45s2",name:"محمد",g:"M",father:"E45",mother:"E45w1",note:"لم يعقب"},
{id:"E45d1",name:"عيشة",g:"F",father:"E45",mother:"E45w1",dates:"1353هـ/1935م –",note:"أم أبناء السيد بن اسلم بن سيد الفالي بن محمذن بن عركاب (حمم) بن ابوبا (الأمين) بن ماهي",spouses:["P41"]},
{id:"E46w1",name:"عيشه",g:"F",father:"E50",mother:"E50w1",note:"زواج داخلي بالأسرة؛ أم أبناء بادّا (محمد فال) بن السبتي بن سيد المختار بن محمذن بن الأمين عمي",spouses:["E46"]},
{id:"E47",para:47,name:"أحمد",g:"M",father:"E46",mother:"E46w1",dates:"1312هـ/1895م – 1395هـ/1975م",place:"أبير حيبلل",spouses:["W2d2"]},
{id:"E46d1",name:"خديجة",g:"F",father:"E46",mother:"E46w1",place:"محجوبو",note:"أم محمد والسيد من أبناء اسلم بن سيد الفالي بن محمذن بن عركاب (حمم) بن ابوبا (الأمين) بن ماهي",spouses:["P34"]},
{id:"E46d2",name:"محجوبه",g:"F",father:"E46",mother:"E46w1",place:"محجوبو",note:"لم تعقب"},
{id:"E46d3",name:"مريم",g:"F",father:"E46",mother:"E46w1",note:"لم تعقب"},
{id:"E48",para:48,name:"محمدن",g:"M",father:"E47",mother:"W2d2",dates:"1367هـ/1948م –",spouses:["W8d3"]},
{id:"E47d1",name:"فاطمة",g:"F",father:"E47",mother:"W2d2",dates:"1373هـ/1954م –"},
{id:"E47s1",name:"أحمد",g:"M",father:"E47",mother:"W2d2",dates:"1376هـ/1957م –"},
{id:"E48s1",name:"أحمد (مسعود)",g:"M",father:"E48",mother:"W8d3",dates:"1411هـ/1991م –"},
{id:"E48s2",name:"السيد",g:"M",father:"E48",mother:"W8d3",dates:"1412هـ/1992م –"},
{id:"E48d1",name:"رحمه",g:"F",father:"E48",mother:"W8d3",dates:"1415هـ/1995م –"},
{id:"E48d2",name:"اميه",g:"F",father:"E48",mother:"W8d3",dates:"1417هـ/1997م –"},
{id:"E48s3",name:"محمد فال",g:"M",father:"E48",mother:"W8d3",dates:"1414هـ/1994م –"},
{id:"E48d3",name:"توت",g:"F",father:"E48",mother:"W8d3",dates:"1411هـ/1991م –"},
{id:"E48d4",name:"بلقيس",g:"F",father:"E48",mother:"W8d3",dates:"1419هـ/1998م –"},
{id:"E48d5",name:"اللو",g:"F",father:"E48",mother:"W8d3",dates:"1421هـ/2000م –"},
{id:"E49w1",name:"جامرمئذن",g:"F",father:"I5",mother:"I5w1",note:"بنت ميلود بن سيد أحمد بن حبلل بن ابراهيم — même personne que I5d2",spouses:["E49"],crossLink:true},
{id:"E49s1",name:"أحمد",g:"M",father:"E49",mother:"E49w1",note:"لم يعقب"},
{id:"E49s2",name:"محمد",g:"M",father:"E49",mother:"E49w1",note:"لم يعقب"},
{id:"E49d1",name:"افيتي",g:"F",father:"E49",mother:"E49w1",place:"أبير حيبلل",note:"أم أبناء أحمد يوره بن محمد بن عبد الله بن محمودن",spouses:["W2"]},
{id:"E49d2",name:"عيشة",g:"F",father:"E49",mother:"E49w1",place:"اكنايت نصره",note:"لم تعقب"},
{id:"E50w1",name:"خدجية",g:"F",father:"R42",mother:"R42w1",spouses:["E50"]},
{id:"E51w1",name:"فلانة -؟-",g:"F",father:null,spouses:["E51"]},
{id:"E52",para:52,name:"الفيجح",g:"M",father:"E51",mother:"E51w1",spouses:["E52w1"]},
{id:"E52w1",name:"فلانة",g:"F",father:"V1s1",spouses:["E52"],fullName:"فلانة بنت حبلل بن الأمين بن اشفغ حيبلل"},
{id:"E52s1",name:"المنتقى",g:"M",father:"E52",mother:"E52w1",note:"لم يعقب"},
{id:"E52d1",name:"أم الخيرات",g:"F",father:"E52",mother:"E52w1",note:"أم مريم من أبناء محمد بن محمذن فال بن عبدي بن أوطا",spouses:["XA1247"]},
{id:"E52d2",name:"فاطمة",g:"F",father:"E52",mother:"E52w1",note:"لم تعقب"},
{id:"E52d3",name:"مريم باب",g:"F",father:"E52",mother:"E52w1",note:"لم تعقب"},
{id:"E54",para:54,name:"الكوري",g:"M",father:"E53",mother:"Z4w1",spouses:["E54w1"]},
{id:"E55",para:55,name:"المختار",g:"M",father:"E53",mother:"Z4w1",spouses:["E55w1","E55w2"]},
{id:"E54w1",name:"حليمه",g:"F",father:"D61",spouses:["E54"],mother:"D61w1",note:"أم فاطمة بنت الكوري بن المعزوز بن الأمين عمي"},
{id:"E54d1",name:"فاطمة",g:"F",father:"E54",mother:"E54w1",note:"أم أبناء محمد فال بن ابن غازي بن آجل (الفالي)" ,spouses:["J3"] ,crossLink:true},
{id:"E55w1",name:"فلانة",g:"F",father:"XA632",spouses:["E55"],ext:true},
{id:"E56",para:56,name:"حبب",g:"M",father:"E55",mother:"E55w1",spouses:["E56w1"]},
{id:"E55d1",name:"مريم",g:"F",father:"E55",mother:"E55w1",note:"لم تعقب"},
{id:"E55w2",name:"مريم",g:"F",father:"J22",mother:"J22w1",note:"بنت أحمد البزي بن آجل (الفالي) — رابط بين الأسرتين؛ أم ميمون باخ من أبناء المختار بن المعزوز بن الأمين عمي",spouses:["E55"],crossLink:true},
{id:"E55d2",name:"ميمهنه باخ",g:"F",father:"E55",mother:"E55w2",note:"أم أبناء اسويدي بن محمود الله بن أبو الحس بن المزضف" ,spouses:["Z11"] ,crossLink:true},
{id:"E56w1",name:"مريم",g:"F",father:"XA638",spouses:["E56"],fullName:"مريم بنت أحمد بن ابيهم بن أبا الصالح بن أحمد بن اشفغ اوبك بن مهنض امغر",ext:true},
{id:"E57",para:57,name:"أحممد فال",g:"M",father:"E56",mother:"E56w1",dates:"1312هـ/1892م –",spouses:["E57w1"]},
{id:"E62",para:62,name:"المختار",g:"M",father:"E56",mother:"E56w1",spouses:["E62w1"]},
{id:"E57w1",name:"افيطيمه",g:"F",father:"K71",note:"بنت محمذن ميلود بن حبلل بن عاون بن محمد الكريم — رابط بين الأسرتين",place:"أبير حيبلل",spouses:["E57"],crossLink:true,mother:"K71w1"},
{id:"E58",para:58,name:"الجد",g:"M",father:"E57",mother:"E57w1",dates:"1292هـ/1875م – 1385هـ/1965م",place:"أبير حيبلل",spouses:["K142d1","R44d1"]},
{id:"E57d1",name:"ابّوهن (بنت وهب)",g:"F",father:"E57",mother:"E57w1",dates:"1318هـ/1888م – 1412هـ/1982م",place:"أبير حيبلل",note:"أم أبناء محمد بن بييين بن أحميد بن المزضف بن الأمين بن اشفغ مينحنو" ,spouses:["G89"] ,crossLink:true},
{id:"E57d3",name:"مريم",g:"F",father:"E57",mother:"E57w1",note:"أم فاطمة بن محنض باب بن عبد السلام بن المختار بن أحمد انهكر بن محمد الكريم" ,spouses:["K49"] ,crossLink:true},
{id:"E57d4",name:"امّه (ميمونه)",g:"F",father:"E57",mother:"E57w1",dates:"1386هـ/1966م –",place:"أبير حيبلل",note:"أم أبناء أحمد سالم بن أحمد بن محمد فال بن ابن غازي بن آجل (الفالي)" ,spouses:["J5"] ,crossLink:true},
{id:"E58d1",name:"ابّيّه (خديجة)",g:"F",father:"E58",mother:"K142d1",place:"أبير حيبلل"},
{id:"E59",para:59,name:"أحمد",g:"M",father:"E58",mother:"R44d1",dates:"1352هـ/1933م – 1429هـ/2008م",place:"أبير حيبلل",spouses:["R40d1"]},
{id:"E60",para:60,name:"ابّيه (الجد)",g:"M",father:"E59",mother:"R40d1",dates:"1389هـ/1969م –",spouses:["E60w1"]},
{id:"E61",para:61,name:"محمد",g:"M",father:"E59",mother:"R40d1",dates:"1391هـ/1971م –",spouses:["E61w1"]},
{id:"E60w1",name:"الل",g:"F",father:"K144",dates:"1977م –",spouses:["E60"]},
{id:"E60s1",name:"أحمد منير",g:"M",father:"E60",mother:"E60w1",dates:"1432هـ/2011م –"},
{id:"E60s2",name:"فالن",g:"M",father:"E60",mother:"E60w1",dates:"1434هـ/2013م –"},
{id:"E61w1",name:"انّيجه",g:"F",father:"Z86",mother:"Z86w1",note:"بنت محمدن بن محمد بن عمر بن ابن عبدم بن عبد الله بن الأمين بن حمم بن أبو الحس بن المزضف — رابط بين الأسرتين",dates:"1978م –",spouses:["E61"],crossLink:true},
{id:"E61s1",name:"أحمد",g:"M",father:"E61",mother:"E61w1",dates:"1429هـ/2008م –"},
{id:"E61d1",name:"آمنة",g:"F",father:"E61",mother:"E61w1",dates:"1431هـ/2010م –"},
{id:"E62w1",name:"الحمرياء",g:"F",father:"F16",mother:"K3d2",spouses:["E62"],crossLink:true},
{id:"E62s1",name:"محمد",g:"M",father:"E62",mother:"E62w1",dates:"1341هـ/1923م –",note:"لم يعقب"},
{id:"R1",para:1,name:"أحمد زروق",g:"M",father:"T0-fali",mother:"Y1d6",place:"أكدرنيت",note:"بن الفالي بن الكوري بن سيد الفالي",spouses:["R1w1"]},
{id:"R1w1",name:"فلانة",g:"F",father:"D46s2",spouses:["R1"]},
{id:"R2",para:2,name:"بابا حنيد (المختار)",g:"M",father:"R1",mother:"R1w1",spouses:["Z8d1"]},
{id:"R20",para:20,name:"ذو علم",g:"M",father:"R1",mother:"R1w1",spouses:["R20w1"]},
{id:"R22",para:22,name:"الفالي",g:"M",father:"R1",mother:"R1w1",spouses:["R22w1"]},
{id:"R53",para:53,name:"ون (محمذن)",g:"M",father:"R1",mother:"R1w1",spouses:["P47d1","R53w2"]},
{id:"R1d1",name:"افيظيمه",g:"F",father:"R1",mother:"R1w1",note:"أم أبناء معلوم بن ابراهيم؛ رابط بين الأسرتين محتمل",spouses:["I62"]},
{id:"R1d2",name:"غان",g:"F",father:"R1",mother:"R1w1",note:"أم أبناء شدار بن اشفغ الأمين",spouses:["Y148"]},
{id:"R1d3",name:"فلانة",g:"F",father:"R1",mother:"R1w1",note:"أم أبناء اللين (الأمين) بن ميلود بن الفالي",spouses:["L2"]},
{id:"R1d4",name:"امايه",g:"F",father:"R1",mother:"R1w1",note:"أم أبناء المختار بن عبد الله بن محنضنلل بن امرابط مكو"},
{id:"R1d5",name:"فلانة",g:"F",father:"R1",mother:"R1w1",note:"أم أبناء أحممد الأمين بن اشفغ المختار باب"},
{id:"R1d6",name:"مريم",g:"F",father:"R1",mother:"R1w1",note:"أم محمذن بويا والزيري والفضل من أبناء حامدت بن اشفغ عبد الله"},
{id:"R3",para:3,name:"باليل",g:"M",father:"R2",mother:"Z8d1",spouses:["R3w1"]},
{id:"R13",para:13,name:"ياحممذ",g:"M",father:"R2",mother:"Z8d1",spouses:["R13w1"]},
{id:"R2d1",name:"أم المؤمنين",g:"F",father:"R2",mother:"Z8d1",note:"أم أبناء الأمين بن خيلوم (خير الأنام) بن محمد بن المزضف" ,spouses:["Z5"] ,crossLink:true},
{id:"R2d2",name:"الكرده",g:"F",father:"R2",mother:"Z8d1",note:"لم تعقب"},
{id:"R3w1",name:"فلانة",g:"F",father:"R50",spouses:["R3"]},
{id:"R4",para:4,name:"محمذن",g:"M",father:"R3",mother:"R3w1",place:"أبير حيبلل",spouses:["R4w1"]},
{id:"R3d1",name:"ابنيه",g:"F",father:"R3",mother:"R3w1",note:"أم سيد وفاطيمو من أبناء أحمد بن سيد الفالي بن بنيوك (محمذن) بن المختار بن محمد الكريم",spouses:["K141"]},
{id:"R4w1",name:"الحميتيّه",g:"F",father:"R42",mother:"R42w1",note:"بنت الحفيد بن حيب الله بن الفالي بن أحمد زروق — زواج داخلي بالأسرة؛ أم أبناء محمذن بن باليل بن بابا حنيد بن أحمد زروق (= R4)" ,spouses:["R4"]},
{id:"R4s1",name:"محمد سالم",g:"M",father:"R4",mother:"R4w1",place:"اجدور البون",note:"لم يعقب"},
{id:"R4s2",name:"محمد فال",g:"M",father:"R4",mother:"R4w1",dates:"1319هـ/1901م –",place:"اجدور البون",note:"لم يعقب"},
{id:"R5",para:5,name:"الهلال",g:"M",father:"R4",mother:"R4w1",dates:"1332هـ/1914م –",place:"أبير حيبلل",spouses:["R18d1"]},
{id:"R5s1",name:"أحمد",g:"M",father:"R5",mother:"R18d1",dates:"1355هـ/1936م –",place:"أم اجناح",note:"لم يعقب"},
{id:"R5s2",name:"محمد فال",g:"M",father:"R5",mother:"R18d1",note:"لم يعقب"},
{id:"R6",para:6,name:"محمدن",g:"M",father:"R5",mother:"R18d1",dates:"1324هـ/1926م – 1396هـ/1976م",place:"تنيخلف",spouses:["R6w1","R6w2"]},
{id:"R6w1",name:"فاطمة",g:"F",father:"G13s1",spouses:["R6"]},
{id:"R7",para:7,name:"أحمد",g:"M",father:"R6",mother:"R6w1",dates:"1365هـ/1946م –",spouses:["R7w1"]},
{id:"R6w2",name:"آسية",g:"F",father:"F94",dates:"1935م – 1989م",place:"دليلحو",spouses:["R6"],crossLink:true,mother:"F94w1"},
{id:"R9",para:9,name:"ابن",g:"M",father:"R6",mother:"R6w2",dates:"1368هـ/1949م –",spouses:["R9w1"]},
{id:"R10",para:10,name:"السرغيني (عبد الله)",g:"M",father:"R6",mother:"R6w2",dates:"1375هـ/1956م –",spouses:["R10w1"]},
{id:"R11",para:11,name:"سيد محمود",g:"M",father:"R6",mother:"R6w2",dates:"1377هـ/1958م –",spouses:["R11w1"]},
{id:"R12",para:12,name:"ديد (الكوري)",g:"M",father:"R6",mother:"R6w2",dates:"1382هـ/1963م –",spouses:["R12w1"]},
{id:"R6d2",name:"بشره",g:"F",father:"R6",mother:"R6w2",dates:"1396هـ/1976م –"},
{id:"R7w1",name:"مام سي",g:"F",father:null,spouses:["R7"]},
{id:"R7s1",name:"الحسن",g:"M",father:"R7",mother:"R7w1",dates:"1393هـ/1973م – 1428هـ/2007م",place:"اكجوجت",note:"لم يعقب"},
{id:"R7d1",name:"فاطمة",g:"F",father:"R7",mother:"R7w1",dates:"1396هـ/1976م –"},
{id:"R7s2",name:"محمدن",g:"M",father:"R7",mother:"R7w1",dates:"1397هـ/1977م –"},
{id:"R8",para:8,name:"سيدنا",g:"M",father:"R7",mother:"R7w1",dates:"1421هـ/2001م –",spouses:["R8w1"]},
{id:"R7s3",name:"الحسين",g:"M",father:"R7",mother:"R7w1",dates:"1421هـ/2001م –"},
{id:"R8w1",name:"امباركه",g:"F",father:"Y51",mother:"Y51w1",dates:"1422هـ/1982م –",spouses:["R8"],fullName:"امباركه بنت محمد فال بن محمد بن سيد بن محيين بن الجمد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"R8s1",name:"محمد فال",g:"M",father:"R8",mother:"R8w1",dates:"1432هـ/2011م –"},
{id:"R9w1",name:"السالمه",g:"F",father:"I68",dates:"1387هـ/1967م –",spouses:["R9"],crossLink:true,mother:"I68w1",note:"أم أبناء ابن بن محمدن بن الهلال بن محمذن بن باليل بن باب احنيد بن احمد زروق"},
{id:"R9d1",name:"تحيه",g:"F",father:"R9",mother:"R9w1",dates:"1427هـ/1987م –"},
{id:"R9s1",name:"محمدن",g:"M",father:"R9",mother:"R9w1",dates:"1411هـ/1991م –"},
{id:"R9s2",name:"الأمين",g:"M",father:"R9",mother:"R9w1",dates:"1415هـ/1995م –"},
{id:"R9d2",name:"عائشة",g:"F",father:"R9",mother:"R9w1",dates:"1418هـ/1997م –"},
{id:"R9s3",name:"عبد الله",g:"M",father:"R9",mother:"R9w1",dates:"1422هـ/2001م –"},
{id:"R10w1",name:"عائشة",g:"F",father:"XA640",spouses:["R10"],ext:true},
{id:"R10d1",name:"فايزه",g:"F",father:"R10",mother:"R10w1",dates:"1424هـ/1984م –"},
{id:"R10d2",name:"اميه (مريم)",g:"F",father:"R10",mother:"R10w1",dates:"1428هـ/1988م –"},
{id:"R10s1",name:"أحمد",g:"M",father:"R10",mother:"R10w1",dates:"1411هـ/1991م –"},
{id:"R10s2",name:"محمد الأمين",g:"M",father:"R10",mother:"R10w1",dates:"1416هـ/1996م –"},
{id:"R10d3",name:"آسية",g:"F",father:"R10",mother:"R10w1",dates:"1423هـ/2002م –"},
{id:"R10s3",name:"جلال الدين",g:"M",father:"R10",mother:"R10w1",dates:"1427هـ/2006م –"},
{id:"R11w1",name:"آمه (مريم السالمه)",g:"F",father:"F95",mother:"F95w1",dates:"1393هـ/1973م –",spouses:["R11"],crossLink:true,fullName:"آمه بنت عبد الله (ولد الحاج) بن بشّا (أحمد سالم) بن الكوري (ديد) بن بزيد بن محمذن بن الفالي بن المبارك بن اما"},
{id:"R11d1",name:"آسية",g:"F",father:"R11",mother:"R11w1",dates:"1412هـ/1992م –"},
{id:"R11s1",name:"عابدين",g:"M",father:"R11",mother:"R11w1",dates:"1993م –"},
{id:"R11s2",name:"حيدر",g:"M",father:"R11",mother:"R11w1",dates:"1416هـ/1996م –"},
{id:"R11d2",name:"عائشة",g:"F",father:"R11",mother:"R11w1",dates:"1424هـ/2003م –"},
{id:"R11d3",name:"ابيّه (خديجة)",g:"F",father:"R11",mother:"R11w1",dates:"1432هـ/2011م –"},
{id:"R11s3",name:"ولد الحاج (عبد الله)",g:"M",father:"R11",mother:"R11w1",dates:"1432هـ/2011م –"},
{id:"R12w1",name:"مينه",g:"F",father:"XA641",dates:"1378هـ/1978م –",spouses:["R12"],ext:true},
{id:"R12s1",name:"أحمد سالم",g:"M",father:"R12",mother:"R12w1",dates:"1419هـ/1998م –"},
{id:"R12d1",name:"ابابه",g:"F",father:"R12",mother:"R12w1",dates:"1424هـ/2003م –"},
{id:"R12s2",name:"محمدن",g:"M",father:"R12",mother:"R12w1",dates:"1429هـ/2008م –"},
{id:"R12d2",name:"تمبغه",g:"F",father:"R12",mother:"R12w1",dates:"1434هـ/2013م –"},
{id:"R13w1",name:"خدجيانه",g:"F",father:"D17",mother:"D17w1",spouses:["R13"]},
{id:"R14",para:14,name:"أحمذ",g:"M",father:"R13",mother:"R13w1",dates:"1312هـ/1893م –",spouses:["M52w1","R14w2"]},
{id:"R17",para:17,name:"الأمين",g:"M",father:"R13",mother:"R13w1",spouses:["I70d2","R17w2"]},
{id:"R15",para:15,name:"مبارك",g:"M",father:"R14",mother:"M52w1",spouses:["R15w1"]},
{id:"R14w2",name:"مريم",g:"F",father:"F108",mother:"R66d1",spouses:["R14"],crossLink:true,fullName:"مريم بنت بيبات بن حمم بن المبارك بن اما (الماقور)"},
{id:"R16",para:16,name:"حمم (محمذن)",g:"M",father:"R14",mother:"R14w2",dates:"1328هـ/1912م –",spouses:["K154d1"]},
{id:"R14d1",name:"أم الخير",g:"F",father:"R14",mother:"R14w2",note:"لم تعقب"},
{id:"R14d2",name:"خديجة",g:"F",father:"R14",mother:"R14w2",note:"أم أبناء محمد بن محمذن بن أحمد البزي بن آجل (الفالي)",spouses:["J24"]},
{id:"R14d3",name:"السا (الصغرى)",g:"F",father:"R14",mother:"R14w2",note:"أم أبناء اَّمم (محمذن ميلود) بن محمد بن عبد الله بن محمودن" ,spouses:["W5"] ,crossLink:true},
{id:"R14d4",name:"الغاليه",g:"F",father:"R14",mother:"R14w2",note:"أم أحمد من أبناء البناني بن محمد فال بن ابن غازي بن آجل (الفالي)" ,spouses:["J15"] ,crossLink:true},
{id:"R15w1",name:"فاطيمه",g:"F",father:"K141",note:"بنت أحمد بن سيد الفالي بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",spouses:["R15"],crossLink:true,mother:"K141w1"},
{id:"R15s1",name:"محمد",g:"M",father:"R15",mother:"R15w1",note:"لم يعقب"},
{id:"R15d2",name:"مريم",g:"F",father:"R15",mother:"R15w1",note:"لم تعقب"},
{id:"R15d3",name:"نبغوها",g:"F",father:"R15",mother:"R15w1",note:"لم تعقب"},
{id:"R16s1",name:"أحمد حي",g:"M",father:"R16",mother:"K154d1",note:"لم يعقب"},
{id:"R16d2",name:"خديجة",g:"F",father:"R16",mother:"K154d1",note:"لم تعقب"},
{id:"R17s1",name:"أحمد سالم",g:"M",father:"R17",mother:"I70d2",note:"لم يعقب"},
{id:"R18",para:18,name:"محمد",g:"M",father:"R17",mother:"I70d2",dates:"1314هـ/1897م –",spouses:["R18w1"]},
{id:"R17w2",name:"فلانة",g:"F",father:"XA1243",spouses:["R17"],ext:true},
{id:"R19",para:19,name:"الد (محمد فال)",g:"M",father:"R17",mother:"R17w2",dates:"1333هـ/1915م –",spouses:["R19w1","R19w2"]},
{id:"R17d1",name:"أم الحسن",g:"F",father:"R17",mother:"R17w2"},
{id:"R18w1",name:"اصويفيّه",g:"F",father:"XA647",spouses:["R18"],ext:true},
{id:"R18d1",name:"تاوا",g:"F",father:"R18",mother:"R18w1",place:"أم اجناح",note:"زواج داخلي بالأسرة",spouses:["R5"]},
{id:"R18d2",name:"مريم",g:"F",father:"R18",mother:"R18w1" ,spouses:["W3"] ,crossLink:true},
{id:"R19w1",name:"أم سليم",g:"F",father:"K53",mother:"K53w1",note:"بنت الكوري ضال بن سيد أحمد بن حبلل بن آمين بن محمد الكريم — رابط بين الأسرتين",spouses:["R19"],crossLink:true},
{id:"R19s1",name:"أحمد",g:"M",father:"R19",mother:"R19w1",dates:"1361هـ/1942م –",note:"لم يعقب"},
{id:"R19d1",name:"مريم",g:"F",father:"R19",mother:"R19w1",note:"لم تعقب"},
{id:"R19w2",name:"فاطمة",g:"F",father:"XA653",spouses:["R19"],ext:true},
{id:"R19d2",name:"أم المؤمنين",g:"F",father:"R19",mother:"R19w2",dates:"1394هـ/1974م –",place:"البقيع",note:"لم تعقب"},
{id:"R20w1",name:"فلانة",g:"F",father:"XA332",spouses:["R20"],ext:true},
{id:"R21",para:21,name:"المصطفى",g:"M",father:"R20",mother:"R20w1",spouses:["R21w1"]},
{id:"R21w1",name:"فلانة",g:"F",father:null,spouses:["R21"]},
{id:"R21d1",name:"توكل",g:"F",father:"R21",mother:"R21w1",note:"أم المبارك وعائشة من أبناء بوركراك (محمد) بن الفالي بن محنض الكوري"},
{id:"R22w1",name:"فاظيمه",g:"F",father:"XA656",spouses:["R22"],ext:true},
{id:"R23",para:23,name:"بدر الدين",g:"M",father:"R22",mother:"R22w1",spouses:["R23w1"]},
{id:"R36",para:36,name:"حيب الله",g:"M",father:"R22",mother:"R22w1",spouses:["R36w1"]},
{id:"R50",para:50,name:"محين المبارك",g:"M",father:"R22",mother:"R22w1",spouses:["R23w1"]},
{id:"R52",para:52,name:"النجيب",g:"M",father:"R22",mother:"R22w1",spouses:["R52w1","R52w2"]},
{id:"R22d1",name:"فلانة",g:"F",father:"R22",mother:"R22w1",note:"أم أبناء فوك بن الأمين عمي",spouses:["E2"]},
{id:"R22d2",name:"فلانة",g:"F",father:"R22",mother:"R22w1",note:"لم تعقب"},
{id:"R23w1",name:"فاطمة",g:"F",father:"XA1163",place:"انتوفكت",spouses:["R23","R50"],note:"الجد المذكور في السلسلة غير مسجل في الشجرة",ext:true},
{id:"R24",para:24,name:"اسحاق",g:"M",father:"R23",mother:"R23w1",place:"انتوفكت",spouses:["R24w1"]},
{id:"R23d1",name:"فلانة",g:"F",father:"R23",mother:"R23w1",note:"أم أبناء بناي بن عاون بن محمد الكريم",spouses:["K82"]},
{id:"R23d2",name:"فلانة",g:"F",father:"R23",mother:"R23w1",note:"لم تعقب"},
{id:"R24w1",name:"مانه",g:"F",father:"XA657",spouses:["R24"],ext:true},
{id:"R25",para:25,name:"محنض باب",g:"M",father:"R24",mother:"R24w1",dates:"1327هـ/1892م –",place:"الصدريات الخضر",spouses:["R25w1","R25w2"]},
{id:"R25w1",name:"صفيه",g:"F",father:"H13",mother:"H13w1",note:"بنت البخاري بن حبلل اسليطين — رابط بين الأسرتين",spouses:["R25"],crossLink:true},
{id:"R25s1",name:"سيد أحمد",g:"M",father:"R25",mother:"R25w1",dates:"1348هـ/1932م –",place:"الصدريات الخضر",note:"لم يعقب"},
{id:"R26",para:26,name:"محمد سالم",g:"M",father:"R25",mother:"R25w1",spouses:["J24d3","R26w2","R26w3","R26w4"]},
{id:"R25d1",name:"أم المؤمنين",g:"F",father:"R25",mother:"R25w1",note:"لم تعقب"},
{id:"R25d2",name:"فاطمة",g:"F",father:"R25",mother:"R25w1",note:"أم ابني أحمد سالم بن محمذن بن آبود بن محمذن بن الأمين بن اشفغ مينحنو"},
{id:"R25w2",name:"فلانة",g:"F",father:"K153",mother:"K153w1",note:"بنت سيد بن محمد اغربظ بن محمد الكريم — رابط بين الأسرتين",spouses:["R25"],crossLink:true},
{id:"R25s2",name:"سيديا",g:"M",father:"R25",mother:"R25w2",note:"لم يعقب"},
{id:"R30",para:30,name:"ادوي (الكوري)",g:"M",father:"R25",mother:"R25w2",dates:"1355هـ/1936م –",spouses:["R30w1","R30w2"]},
{id:"R26d1",name:"النجاة",g:"F",father:"R26",mother:"J24d3",place:"اجنكام" ,spouses:["K138"] ,crossLink:true},
{id:"R26w2",name:"فاطمة",g:"F",father:"XA1244",spouses:["R26"],ext:true},
{id:"R27",para:27,name:"أحمد",g:"M",father:"R26",mother:"R26w2",dates:"1422هـ/1982م –",place:"الصدريات الخضر",spouses:["R27w1"]},
{id:"R26w3",name:"مريم",g:"F",father:"F42",mother:"F42w1",spouses:["R26"],crossLink:true,note:"أم السالمه بنت محمد سالم بن محنض باب بن اسحاق بن بدر الدين بن الفالي بن أحمد زروق — لم تعقب"},
{id:"R26d2",name:"السالمه",g:"F",father:"R26",mother:"R26w3",note:"لم تعقب"},
{id:"R26w4",name:"مريم",g:"F",father:"XA1245",spouses:["R26"],ext:true},
{id:"R26s1",name:"حامد",g:"M",father:"R26",mother:"R26w4",note:"لم يعقب"},
{id:"R26d3",name:"أم الخيري",g:"F",father:"R26",mother:"R26w4",note:"أم أبناء المختار بن أمد (أحمد) بن محمذن بن محمذن فال بن عبدي بن أوطا"},
{id:"R26d4",name:"فاطمتون",g:"F",father:"R26",mother:"R26w4",note:"لم تعقب"},
{id:"R26d5",name:"ميمهنه",g:"F",father:"R26",mother:"R26w4",note:"لم تعقب"},
{id:"R27w1",name:"فاطمة",g:"F",father:"XA663",place:"أحسي السعادة",spouses:["R27"],ext:true},
{id:"R28",para:28,name:"محمد سالم",g:"M",father:"R27",mother:"R27w1",dates:"1357هـ/1938م – 1429هـ/2008م",place:"أحسي السعادة",spouses:["R31d1"]},
{id:"R29",para:29,name:"حارود",g:"M",father:"R27",mother:"R27w1",dates:"1361هـ/1942م –",spouses:["R29w1"]},
{id:"R27s1",name:"محنض",g:"M",father:"R27",mother:"R27w1",dates:"1363هـ/1944م –"},
{id:"R27d1",name:"مريم",g:"F",father:"R27",mother:"R27w1",dates:"1365هـ/1946م –" ,spouses:["Z29"] ,crossLink:true},
{id:"R28s1",name:"أحمد",g:"M",father:"R28",mother:"R31d1"},
{id:"R28d1",name:"فلانة",g:"F",father:"R28",mother:"R31d1" ,spouses:["K136"] ,crossLink:true},
{id:"R29w1",name:"ميّم",g:"F",father:"K92",mother:"R71d1",note:"بنت سيد أحمد بن محمذن بن حمم بن انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",dates:"1384هـ/1964م –",spouses:["R29"],crossLink:true},
{id:"R29s1",name:"أحمد",g:"M",father:"R29",mother:"R29w1",dates:"1424هـ/1984م –"},
{id:"R29d1",name:"ربيعه (فاطمة الزهراء)",g:"F",father:"R29",mother:"R29w1",dates:"1425هـ/1985م –" ,spouses:["Z32"] ,crossLink:true},
{id:"R29d2",name:"صباح (عيشان)",g:"F",father:"R29",mother:"R29w1",dates:"1427هـ/1987م –"},
{id:"R29s2",name:"محمد ببكر",g:"M",father:"R29",mother:"R29w1",dates:"1428هـ/1988م –"},
{id:"R29d3",name:"فرحه",g:"F",father:"R29",mother:"R29w1",dates:"1414هـ/1994م –"},
{id:"R29s3",name:"سيد أحمد",g:"M",father:"R29",mother:"R29w1",dates:"1428هـ/2007م –"},
{id:"R30w1",name:"ابنت",g:"F",father:"XA667",spouses:["R30"],ext:true},
{id:"R30s1",name:"محمد سالم",g:"M",father:"R30",mother:"R30w1",note:"لم يعقب"},
{id:"R31",para:31,name:"محمد يحظيه",g:"M",father:"R30",mother:"R30w1",spouses:["R31w1"]},
{id:"R30d1",name:"منصوره",g:"F",father:"R30",mother:"R30w1",note:"أم ادوي من أبناء محمد سالم بن عبد العزيز بن المختار بن محمذن بن الأمين بن الفالي بن متيلي" ,spouses:["M54"] ,crossLink:true},
{id:"R30w2",name:"سلم بوها",g:"F",father:"XA1247",mother:"E52d1",spouses:["R30"],ext:true},
{id:"R34",para:34,name:"سيديا",g:"M",father:"R30",mother:"R30w2",spouses:["R34w1"]},
{id:"R30d2",name:"بنت وهب",g:"F",father:"R30",mother:"R30w2"},
{id:"R31w1",name:"فاطمة السالمه",g:"F",father:"M13",mother:"M13w1",note:"بنت اسحاق بن محمذن بن المختار بن محمذن بن الغالي بن باركلل بن بوالماح بن متيلي — رابط بين الأسرتين",dates:"1993م –",spouses:["R31"],crossLink:true},
{id:"R32",para:32,name:"اتاه (المختار)",g:"M",father:"R31",mother:"R31w1",dates:"1373هـ/1954م –",spouses:["R35d1"]},
{id:"R33",para:33,name:"الدوي (الكوري)",g:"M",father:"R31",mother:"R31w1",spouses:["R33w1"]},
{id:"R31d1",name:"مريم",g:"F",father:"R31",mother:"R31w1",fullName:"مريم بنت محمد حيظيو بن ادوي (الكوري) بن محنض باب بن اسحاق بن بدر الدين بن الفالي بن أحمد زروق",note:"زواج داخلي بالأسرة",spouses:["R28"]},
{id:"R32d1",name:"حنان",g:"F",father:"R32",mother:"R35d1",note:"1993م –"},
{id:"R33w1",name:"كاكني",g:"F",father:"XA672",spouses:["R33"],ext:true},
{id:"R33s1",name:"فالن",g:"M",father:"R33",mother:"R33w1"},
{id:"R33d1",name:"فلانة",g:"F",father:"R33",mother:"R33w1"},
{id:"R34w1",name:"فاطمة",g:"F",father:"XA674",spouses:["R34"],ext:true},
{id:"R34s1",name:"الفالي",g:"M",father:"R34",mother:"R34w1",dates:"1385هـ/1965م –",note:"لم يعقب"},
{id:"R35",para:35,name:"الكوري",g:"M",father:"R34",mother:"R34w1",spouses:["R35w1"]},
{id:"R35w1",name:"امن",g:"F",father:"K106",mother:"K106w1",note:"بنت محمدن بن سيد أحمد لحبيب بن محمذن بن انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",place:"انواذيب",spouses:["R35"],crossLink:true},
{id:"R35s1",name:"محمودن",g:"M",father:"R35",mother:"R35w1",dates:"1377هـ/1958م –"},
{id:"R35d1",name:"بنت وهب",g:"F",father:"R35",mother:"R35w1",dates:"1379هـ/1962م –" ,spouses:["R32"] ,note:"زواج داخلي بالأسرة" ,crossLink:true},
{id:"R36w1",name:"فلانة",g:"F",father:"P49",mother:"P2d3",note:"بنت كامل بن حبلل بن ماهي — رابط بين الأسرتين",spouses:["R36"],crossLink:true},
{id:"R37",para:37,name:"بابك",g:"M",father:"R36",mother:"R36w1",spouses:["E42d2"]},
{id:"R42",para:42,name:"الحفيد",g:"M",father:"R36",mother:"R36w1",spouses:["R42w1"]},
{id:"R45",para:45,name:"لحويج",g:"M",father:"R36",mother:"R36w1",spouses:["R45w1"]},
{id:"R49",para:49,name:"الأمين",g:"M",father:"R36",mother:"R36w1",spouses:["I70d1"]},
{id:"R38",para:38,name:"محمذن",g:"M",father:"R37",mother:"E42d2",spouses:["R38w1","R38w2"]},
{id:"R38w1",name:"أم المؤمنين",g:"F",father:"R54",mother:"R54w1",note:"زواج داخلي بالأسرة؛ أم عبد الله وميمونو وامبيريكو وتوت من أبناء محمذن بن بابك بن حيب الله بن الفالي بن أحمد زروق" ,spouses:["R38"]},
{id:"R39",para:39,name:"عبد الله",g:"M",father:"R38",mother:"R38w1",spouses:["R39w1","R39w2"]},
{id:"R38d1",name:"امبيريكه",g:"F",father:"R38",mother:"R38w1",note:"لم تعقب"},
{id:"R38d2",name:"توت",g:"F",father:"R38",mother:"R38w1",note:"لم تعقب"},
{id:"R38d3",name:"ميمهنه",g:"F",father:"R38",mother:"R38w1",note:"لم تعقب"},
{id:"R38w2",name:"فلانة",g:"F",father:null,spouses:["R38"]},
{id:"R38s1",name:"الكوري",g:"M",father:"R38",mother:"R38w2",note:"لم يعقب"},
{id:"R39w1",name:"مغنم",g:"F",father:"XA677",spouses:["R39"],ext:true},
{id:"R40",para:40,name:"سيد الفالي",g:"M",father:"R39",mother:"R39w1",spouses:["R40w1"]},
{id:"R39d1",name:"عيشه",g:"F",father:"R39",mother:"R39w1",dates:"1385هـ/1965م –",place:"التاكانت",note:"لم تعقب"},
{id:"R39w2",name:"ميمهنه",g:"F",father:"XA681",spouses:["R39","F45"],ext:true},
{id:"R41",para:41,name:"الصالح",g:"M",father:"R39",mother:"R39w2",spouses:["R41w1"]},
{id:"R40w1",name:"بلقيس",g:"F",father:"Y62",dates:"1332هـ/1912م – 1989م",spouses:["R40"],mother:"Y62w2",note:"أم فاطمة بنت سيد الفالي بن عبد الله بن محمذن بن بابك بن حيب الله بن الفالي بن أحمد زروق؛ أم فاطمة بنت محمد بن ابلال -ارحاحلو-"},
{id:"R40d1",name:"فاطمة",g:"F",father:"R40",mother:"R40w1",dates:"1357هـ/1938م –",place:"دليلحو" ,spouses:["E59"] ,crossLink:true},
{id:"R41w1",name:"فاطمة",g:"F",father:"I54",mother:"I54w1",dates:"1314هـ/1897م – 1425هـ/1985م",place:"أبير حيبلل",spouses:["R41"],crossLink:true},
{id:"R41s1",name:"فالن",g:"M",father:"R41",mother:"R41w1",note:"مات صغيرًا"},
{id:"R41s2",name:"فالن",g:"M",father:"R41",mother:"R41w1",note:"مات صغيرًا"},
{id:"R42w1",name:"فاطمه",g:"F",father:"P6",mother:"Z70d5",note:"بنت محمذن بن عركاب (حمم) بن ابوبا (الأمين) بن ماهي — رابط بين الأسرتين",spouses:["R42"],crossLink:true},
{id:"R43",para:43,name:"المختار",g:"M",father:"R42",mother:"R42w1",spouses:["M24d2"]},
{id:"R42d2",name:"خديجة",g:"F",father:"R42",mother:"R42w1",note:"أم عيشو من أبناء سيد أحمد بن محمذن بن الفظيل بن اللين (الأمين) بن ميلود",spouses:["L10"],crossLink:true},
{id:"R42d3",name:"فلانة",g:"F",father:"R42",mother:"R42w1",note:"أم عيشو فال بنت المختار بن حمم بن محمذن بن باب أحمد بن سيد (المختار) بن عبد الله"},
{id:"R44",para:44,name:"محمذن",g:"M",father:"R43",mother:"M24d2",dates:"1334هـ/1916م –",place:"أبير حيبلل",spouses:["R44w1"]},
{id:"R44w1",name:"أم الخيري",g:"F",father:"F17",mother:"F17w1",spouses:["R44"],crossLink:true},
{id:"R44d1",name:"مريم",g:"F",father:"R44",mother:"R44w1",place:"أبير حيبلل" ,spouses:["E58"] ,crossLink:true},
{id:"R45w1",name:"هند",g:"F",father:"F43",spouses:["R45"],crossLink:true},
{id:"R46",para:46,name:"عبد الملك",g:"M",father:"R45",mother:"R45w1",spouses:["R46w1"]},
{id:"R45s1",name:"محنض الكوري",g:"M",father:"R45",mother:"R45w1",note:"لم يعقب"},
{id:"R46w1",name:"فلانة",g:"F",father:null,spouses:["R46"]},
{id:"R47",para:47,name:"ابن",g:"M",father:"R46",mother:"R46w1",spouses:["R47w1"]},
{id:"R48",para:48,name:"محمد فال",g:"M",father:"R46",mother:"R46w1",spouses:["R48w1"]},
{id:"R46d1",name:"عائشة",g:"F",father:"R46",mother:"R46w1",note:"أم أبناء اكبار -امساسيد-"},
{id:"R47w1",name:"امنا",g:"F",father:"R15",mother:"R15w1",note:"بنت مبارك بن أحمذ بن ياحممذ بن بابا حنيد بن أحمد زروق — زواج داخلي بالأسرة" ,spouses:["R47"]},
{id:"R47d1",name:"فاطمه",g:"F",father:"R47",mother:"R47w1",dates:"1427هـ/1987م –",place:"محجوبو",note:"لم تعقب"},
{id:"R48w1",name:"أم المؤمنين",g:"F",father:"XA1250",spouses:["R48"],ext:true},
{id:"R48s1",name:"أحمد باب",g:"M",father:"R48",mother:"R48w1",note:"لم يعقب"},
{id:"R48s2",name:"عبد الله",g:"M",father:"R48",mother:"R48w1",note:"لم يعقب"},
{id:"R48d1",name:"مريم",g:"F",father:"R48",mother:"R48w1",note:"لم تعقب"},
{id:"R49d1",name:"أم الخيرات",g:"F",father:"R49",mother:"I70d1",note:"أم سيد وحامد من أبناء الحسن بن المختار سعيد بن بزيد بن المبارك بن اما (الماقور)" ,spouses:["F12"] ,dates:"1306هـ/1889م –" ,crossLink:true},
{id:"R51",para:51,name:"أحمد ميلود",g:"M",father:"R50",mother:"R23w1",spouses:["R51w1"]},
{id:"R50d1",name:"فلانة",g:"F",father:"R50",mother:"R23w1",note:"أم محمذن وابنيّو ابني باليل بن بابا حنيد (المختار) بن أحمد زروق"},
{id:"R51w1",name:"فلانة",g:"F",father:null,spouses:["R51"]},
{id:"R51s1",name:"محنض",g:"M",father:"R51",mother:"R51w1",note:"لم يعقب"},
{id:"R52w1",name:"فلانة -مدلش-",g:"F",father:null,spouses:["R52"]},
{id:"R52d1",name:"امباركه",g:"F",father:"R52",mother:"R52w1",note:"أم أبناء الإمام أحمد بن محمذن بن الأمين عمي",spouses:["E29"]},
{id:"R52w2",name:"فلانة",g:"F",father:null,spouses:["R52"]},
{id:"R52d2",name:"فلانة",g:"F",father:"R52",mother:"R52w2",note:"أم افرج الله بن المختار عالي -انكادس-"},
{id:"R54",para:54,name:"أحمد",g:"M",father:"R53",mother:"P47d1",spouses:["R54w1"]},
{id:"R53s1",name:"الأمين",g:"M",father:"R53",mother:"P47d1",note:"لم يعقب"},
{id:"R53s2",name:"المصطفى",g:"M",father:"R53",mother:"P47d1",note:"لم يعقب"},
{id:"R53d1",name:"عائشة",g:"F",father:"R53",mother:"P47d1",place:"تندكسم"},
{id:"R53w2",name:"فلانة",g:"F",father:"D46s2s3",spouses:["R53"]},
{id:"R66",para:66,name:"سعدن",g:"M",father:"R53",mother:"R53w2",spouses:["R66w1","R66w2"]},
{id:"R54w1",name:"أم كجو",g:"F",father:"XA682",spouses:["R54"],ext:true},
{id:"R55",para:55,name:"محمذن",g:"M",father:"R54",mother:"R54w1",spouses:["L4d2"]},
{id:"R56",para:56,name:"ابوبكرن",g:"M",father:"R55",mother:"L4d2",dates:"1341هـ/1923م –",spouses:["R56w1"]},
{id:"R61",para:61,name:"تياه",g:"M",father:"R55",mother:"L4d2",spouses:["G80d2b"]},
{id:"R63",para:63,name:"سيد أحمد",g:"M",father:"R55",mother:"L4d2",spouses:["R63w1"]},
{id:"R55d1",name:"امباركه",g:"F",father:"R55",mother:"L4d2" ,spouses:["L14"] ,crossLink:true},
{id:"R56w1",name:"اجنبابن (بنت وهب)",g:"F",father:"XA1169",dates:"1364هـ/1945م –",place:"أبير حيبلل",spouses:["R56"],fullName:"اجنبابن (بنت وهب) بنت محمذن بن الجد بن الزبير بن حامدت بن اشفغ عبد الله بن اعمر يزكئذن بن محنضنلل",ext:true},
{id:"R57",para:57,name:"أحمد",g:"M",father:"R56",mother:"R56w1",dates:"1319هـ/1921م – 1428هـ/1988م",place:"أبير حيبلل",spouses:["R57w1","R57w2"]},
{id:"R56d1",name:"عائشة",g:"F",father:"R56",mother:"R56w1",place:"أبير حيبلل" ,spouses:["K122"] ,crossLink:true},
{id:"R57w1",name:"أم الخيري",g:"F",father:"K89",mother:"K119d2",note:"بنت المختار بن ادّد (أحمد) بن انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",dates:"1374هـ/1955م –",place:"تنيخلف",spouses:["R57"],crossLink:true},
{id:"R58",para:58,name:"أحمد سالم",g:"M",father:"R57",mother:"R57w1",dates:"1357هـ/1938م –",spouses:["R58w1"]},
{id:"R57d1",name:"كمبه",g:"F",father:"R57",mother:"R57w1",dates:"1361هـ/1942م –" ,spouses:["H9"] ,crossLink:true},
{id:"R57d2",name:"فاطمة",g:"F",father:"R57",mother:"R57w1",dates:"1372هـ/1953م –" ,spouses:["K137"] ,crossLink:true},
{id:"R57w2",name:"الصغرى",g:"F",father:"XA692",dates:"1341هـ/1923م – 1427هـ/2006م",place:"أبير حيبلل",spouses:["R57"],ext:true},
{id:"R59",para:59,name:"ولد اباه (عبد الله)",g:"M",father:"R57",mother:"R57w2",dates:"1376هـ/1957م –",spouses:["R59w1"]},
{id:"R57d3",name:"آمه",g:"F",father:"R57",mother:"R57w2",dates:"1382هـ/1963م –"},
{id:"R60",para:60,name:"أحمد",g:"M",father:"R57",mother:"R57w2",dates:"1387هـ/1967م –",spouses:["R60w1"]},
{id:"R57d4",name:"الطشه (عائشة)",g:"F",father:"R57",mother:"R57w2",dates:"1393هـ/1973م –"},
{id:"R58w1",name:"مموه",g:"F",father:"Z108",dates:"1367هـ/1948م –",spouses:["R58"],fullName:"مموه بنت حمم بن مّن (محمذين) بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"R58d1",name:"شاديه (أم الخيري)",g:"F",father:"R58",mother:"R58w1",dates:"1411هـ/1991م –" ,spouses:["K148"] ,crossLink:true},
{id:"R59w1",name:"امن",g:"F",father:"Z81",mother:"Z81w1",dates:"1393هـ/1973م –",spouses:["R59"],fullName:"امن بنت عبد الله بن الأمين بن أحمد بن ابن عبدم بن عبد الله بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"R59d1",name:"بشيره",g:"F",father:"R59",mother:"R59w1",dates:"1422هـ/1999م –"},
{id:"R59d2",name:"عائشة",g:"F",father:"R59",mother:"R59w1",dates:"1425هـ/2004م –"},
{id:"R59d3",name:"مريم",g:"F",father:"R59",mother:"R59w1",dates:"1429هـ/2008م –"},
{id:"R59s1",name:"فالن",g:"M",father:"R59",mother:"R59w1"},
{id:"R62",para:62,name:"اباه",g:"M",father:"R61",mother:"G80d2b",dates:"1332هـ/1912م – 1394هـ/1974م",place:"أبير حيبلل",spouses:["R62w1"]},
{id:"R62w1",name:"آمنة",g:"F",father:"XA696",spouses:["R62"],ext:true},
{id:"R62d1",name:"فاطمتين",g:"F",father:"R62",mother:"R62w1",dates:"1366هـ/1947م – 1431هـ/2010م",place:"انواكشوط" ,spouses:["J10"] ,crossLink:true},
{id:"R60w1",name:"امباركه",g:"F",father:"Y63",dates:"1971م –",spouses:["R60"],crossLink:true,mother:"Y63w1",note:"أم أبناء أحمد بن أحمد بن أبوبكر بن محمذن بن أحمد بن ون (محمذن) بن أحمد زروق"},
{id:"R60d1",name:"اماته",g:"F",father:"R60",mother:"R60w1",dates:"1426هـ/2005م –"},
{id:"R60d2",name:"الصغرى",g:"F",father:"R60",mother:"R60w1",dates:"1428هـ/2007م –"},
{id:"R60d3",name:"ساره (أم لخوت)",g:"F",father:"R60",mother:"R60w1",dates:"1432هـ/2010م –"},
{id:"R60s1",name:"أحمد",g:"M",father:"R60",mother:"R60w1",dates:"1435هـ/2014م –"},
{id:"R63w1",name:"سادلا",g:"F",father:"R67",mother:"R67w1",note:"بنت محمذن بن سعدن بن ون (محمذن) بن أحمد زروق — زواج داخلي بالأسرة (corrigé : rattachée à R67, pas R66 directement)" ,spouses:["R63"]},
{id:"R64",para:64,name:"محمذن",g:"M",father:"R63",mother:"R63w1",place:"كيص (سنغال)",spouses:["R64w1"]},
{id:"R64w1",name:"مفيده",g:"F",father:"W1",mother:"W1w1",spouses:["R64"],crossLink:true,fullName:"مفيده بنت محمد بن يوسف -إلى بريهم-"},
{id:"R64d1",name:"سالما",g:"F",father:"R64",mother:"R64w1",dates:"1341هـ/1923م –",place:"أبير حيبلل"},
{id:"R65",para:65,name:"ابين (اباه)",g:"M",father:"R64",mother:"R64w1",dates:"1352هـ/1932م –",spouses:["R65w1"]},
{id:"R65w1",name:"النانّه (مغنم)",g:"F",father:"Z113",dates:"1365هـ/1946م –",spouses:["R65"],fullName:"النانّه (مغنم) بنت ديدي بن مّن (محمذين) بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"R65d1",name:"شدوكه (مريم)",g:"F",father:"R65",mother:"R65w1",dates:"1392هـ/1972م –"},
{id:"R65d2",name:"توت",g:"F",father:"R65",mother:"R65w1",dates:"1393هـ/1973م –"},
{id:"R65d3",name:"الفيضه",g:"F",father:"R65",mother:"R65w1",dates:"1396هـ/1976م –"},
{id:"R65d4",name:"رقيه",g:"F",father:"R65",mother:"R65w1",dates:"1399هـ/1979م –"},
{id:"R65s1",name:"محمدن",g:"M",father:"R65",mother:"R65w1",dates:"1421هـ/1981م –",spouses:["Z3d7"]},
{id:"R66w1",name:"اتاخوليت",g:"F",father:"V1",mother:"V1w1",spouses:["R66"],crossLink:true,fullName:"اتاخوليت بنت الأمين بن الطالب اجود"},
{id:"R67",para:67,name:"محمذن",g:"M",father:"R66",mother:"R66w1",spouses:["R67w1"]},
{id:"R66d1",name:"عائشة",g:"F",father:"R66",mother:"R66w1" ,spouses:["F108"] ,crossLink:true},
{id:"R66w2",name:"امباركه",g:"F",father:"P3",mother:"G4d1",note:"بنت عركاب (حمم) بن ابوبا (الأمين) بن ماهي — رابط بين الأسرتين",spouses:["R66"],crossLink:true},
{id:"R66d2",name:"فاطمة",g:"F",father:"R66",mother:"R66w2",note:"أم أحمد وعيشو فال وخديجة ومالليّو من أبناء سيد المختار بن محمذن بن الأمين عمي" ,spouses:["E42"] ,crossLink:true},
{id:"R67w1",name:"افيطيمه",g:"F",father:"I94",spouses:["R67"],mother:"I94w2",note:"أم أبناء محمذن بن سعدن بن ون (محمذن) بن احمد زروق"},
{id:"R68",para:68,name:"سندي",g:"M",father:"R67",mother:"R67w1",dates:"1323هـ/1925م –",place:"أبير حيبلل",spouses:["R68w1"]},
{id:"R69",para:69,name:"المختار",g:"M",father:"R67",mother:"R67w1",dates:"1322هـ/1922م –",spouses:["R69w1"]},
{id:"R67s1",name:"المصطفى",g:"M",father:"R67",mother:"R67w1",note:"لم يعقب"},
{id:"R70",para:70,name:"الأمين",g:"M",father:"R67",mother:"R67w1",dates:"1328هـ/1912م –",spouses:["R70w1"]},
{id:"R67d1",name:"خدجاني",g:"F",father:"R67",mother:"R67w1",note:"أم أم المؤمنين وأم الخيري من أبناء مام بن عبد الودود بن الأمين بن حمم بن أبو الحس بن المزضف",spouses:["Z96"],crossLink:true},
{id:"R67d2",name:"سالما",g:"F",father:"R67",mother:"R67w1",note:"أم محمذن بن سيد أحمد بن محمذن بن أحمد بن ون (محمذن) بن أحمد زروق"},
{id:"R67d3",name:"عيشين",g:"F",father:"R67",mother:"R67w1",note:"أم أبناء عبد السلام بن المختار بن أحمد انهكر بن محمد الكريم" ,spouses:["K48"] ,crossLink:true},
{id:"R67d4",name:"مريم",g:"F",father:"R67",mother:"R67w1",note:"أم محمذن بن الدان بن سيد الفالي بن حبلل بن ابراهيم" ,spouses:["M30"] ,dates:"1377هـ/1958م –" ,place:"تنيخلف" ,crossLink:true},
{id:"R68w1",name:"خدجية",g:"F",father:"I65",mother:"I65w1",spouses:["R68"]},
{id:"R68s1",name:"محمذن السالم",g:"M",father:"R68",mother:"R68w1",dates:"1335هـ/1917م – 1393هـ/1973م",place:"أبير حيبلل",note:"لم يعقب"},
{id:"R68d1",name:"عائشة",g:"F",father:"R68",mother:"R68w1",place:"أبير حيبلل",note:"لم تعقب" ,spouses:["K72"] ,dates:"1319هـ/1901م – 1975م" ,crossLink:true},
{id:"R69w1",name:"فطيمه",g:"F",father:"J2",mother:"E2d2",note:"بنت أحمد بن محمد فال بن ابن غازي بن آجل (الفالي) — رابط بين الأسرتين",place:"أبير حيبلل",spouses:["R69"],crossLink:true},
{id:"R69d1",name:"خديجة",g:"F",father:"R69",mother:"R69w1",dates:"1389هـ/1969م –",place:"تنيخلف"},
{id:"R69d2",name:"التات (عائشة)",g:"F",father:"R69",mother:"R69w1",dates:"1319هـ/1921م – 1395هـ/1975م",place:"أبير حيبلل"},
{id:"R70w1",name:"عيشان",g:"F",father:"F80",mother:"E4d1",place:"أبير حيبلل",spouses:["R70"],crossLink:true,fullName:"عيشان بنت محمذن بن بازيد بن محمذن بن الفالي بن المبارك بن اما (الماقور)"},
{id:"R71",para:71,name:"محمد ببكر",g:"M",father:"R70",mother:"R70w1",dates:"1324هـ/1926م – 1412هـ/1992م",place:"أبير حيبلل",spouses:["F89d2"]},
{id:"R70d1",name:"امباركه",g:"F",father:"R70",mother:"R70w1"},
{id:"R70d2",name:"امّمه (مريم)",g:"F",father:"R70",mother:"R70w1",dates:"1377هـ/1958م –",place:"أبير حيبلل"},
{id:"R70d3",name:"العالية",g:"F",father:"R70",mother:"R70w1",dates:"1414هـ/1994م –",place:"أبير حيبلل",note:"لم تعقب"},
{id:"R71s1",name:"باب",g:"M",father:"R71",mother:"F89d2",dates:"1363هـ/1944م –"},
{id:"R71d1",name:"خدجية",g:"F",father:"R71",mother:"F89d2",dates:"1365هـ/1946م – 1426هـ/2005م",place:"أحسي السعادة",spouses:["K92"]},
{id:"R72",para:72,name:"محمدن",g:"M",father:"R71",mother:"F89d2",dates:"1367هـ/1948م –",spouses:["R72w1","R72w2"]},
{id:"R71d2",name:"عيشه السالمه",g:"F",father:"R71",mother:"F89d2",dates:"1951م –" ,spouses:["F94"] ,crossLink:true},
{id:"R72w1",name:"مريم",g:"F",father:"F29",dates:"1371هـ/1952م –",spouses:["R72"],crossLink:true},
{id:"R72s1",name:"يحي",g:"M",father:"R72",mother:"R72w1",dates:"1422هـ/1982م –"},
{id:"R72s2",name:"أحمد",g:"M",father:"R72",mother:"R72w1",dates:"1425هـ/1985م –"},
{id:"R72d1",name:"فاطمة",g:"F",father:"R72",mother:"R72w1",dates:"1428هـ/1988م –" ,spouses:["Z115"] ,crossLink:true},
{id:"R72w2",name:"أم الخيري",g:"F",father:"Y69",mother:"Y69w1",dates:"1425هـ/1985م –",spouses:["R72"],crossLink:true,fullName:"أم الخيري بنت سيد أحمد بن محمذن (ولد الفظيل) بن أحمد سالم بن الحسن بن حيب الله بن حرمه بن المختار بن المعزوز"},
{id:"R72d2",name:"تومه",g:"F",father:"R72",mother:"R72w2"},
{id:"T0-hablal",name:"حبلل",g:"M",father:"T0",note:"بن سيد الفالي"},
{id:"T0-hablal-sabdallah",name:"سيد عبد الله",g:"M",father:"T0-hablal",note:"بن حبلل بن سيد الفالي"},
{id:"T0-hablal-hajmohamdhen",name:"الحاج محمذن",g:"M",father:"T0-hablal-sabdallah",note:"بن سيد عبد الله بن حبلل بن سيد الفالي"},
{id:"S1",para:1,name:"سيد محمد",g:"M",father:"T0-hablal-hajmohamdhen",note:"بن الحاج محمذن بن سيد عبدلل بن حبلل بن سيد الفالي",spouses:["S1w1","S1w2","S1w3"]},
{id:"S2",para:2,name:"الشيخ",g:"M",father:"S1",mother:"S1w1",dates:"…؟… – 1309هـ/1892م",place:"تينشيكل",spouses:["S2w1"]},
{id:"S3",para:3,name:"بَب (احمد سالم)",g:"M",father:"S2",mother:"S2w1",dates:"…؟… – 1349هـ/1931م",spouses:["S3w1"]},
{id:"S4",para:4,name:"ادِّيه (الشيخ)",g:"M",father:"S3",mother:"S3w1",spouses:["S14d1"]},
{id:"S5",para:5,name:"محمد",g:"M",father:"S3",mother:"S3w1",spouses:["S5w1"]},
{id:"S6",para:6,name:"محمد المختار",g:"M",father:"S2",mother:"S2w1",spouses:["S6w1"]},
{id:"S7",para:7,name:"المختار",g:"M",father:"S1",mother:"S1w1",place:"تينشيكل",spouses:["S7w1","S7w2","S7w3"]},
{id:"S8",para:8,name:"احمد",g:"M",father:"S7",mother:"S7w1",spouses:["S8w1","S8w2"]},
{id:"S9",para:9,name:"التـاه",g:"M",father:"S7",mother:"S7w2",spouses:["S9w1"]},
{id:"S10",para:10,name:"احمد",g:"M",father:"S9",mother:"S9w1",spouses:["S10w1"]},
{id:"S11",para:11,name:"التـاه (موسى افال)",g:"M",father:"S10",mother:"S10w1",spouses:["S11w1"]},
{id:"S12",para:12,name:"محمذن",g:"M",father:"S7",mother:"S7w3",spouses:["S12w1"]},
{id:"S13",para:13,name:"موهوب (محمد)",g:"M",father:"S7",mother:"S7w3",dates:"…؟… – 1339هـ/1921م",spouses:["S13w1"]},
{id:"S14",para:14,name:"الحسن",g:"M",father:"S1",mother:"S1w2",spouses:["S14w1"]},
{id:"S15",para:15,name:"الشيخ",g:"M",father:"S14",mother:"S14w1",spouses:["S15w1"]},
{id:"S16",para:16,name:"محمد الحسن",g:"M",father:"S15",mother:"S15w1",place:"البعلاتيو",spouses:["S16w1","S16w2"]},
{id:"S17",para:17,name:"الشيخ سعد بوه",g:"M",father:"S16",mother:"S16w1",spouses:["S17w1"]},
{id:"S18",para:18,name:"الشيخاني",g:"M",father:"S16",mother:"S16w1",spouses:["S24d1"]},
{id:"S19",para:19,name:"الشيخ سيد محمد",g:"M",father:"S16",mother:"S16w1",spouses:["S19w1"]},
{id:"S20",para:20,name:"حيدره (محمد المختار)",g:"M",father:"S15",mother:"S15w1",dates:"1337هـ/1919م – 1435هـ/2014م",place:"البعلاتيو",spouses:["S20w1"]},
{id:"S21",para:21,name:"سيد",g:"M",father:"S20",mother:"S20w1",spouses:["S21w1"]},
{id:"S22",para:22,name:"الحسن",g:"M",father:"S20",mother:"S20w1",spouses:["S22w1"]},
{id:"S23",para:23,name:"الشيخ احمد",g:"M",father:"S20",mother:"S20w1",spouses:["S23w1"]},
{id:"S24",para:24,name:"احمد",g:"M",father:"S15",mother:"S15w1",spouses:["S24w1"]},
{id:"S25",para:25,name:"الشيخ",g:"M",father:"S24",mother:"S24w1",spouses:["S25w1"]},
{id:"S26",para:26,name:"اسماعيل",g:"M",father:"S24",mother:"S24w1",spouses:["S26w1"]},
{id:"S27",para:27,name:"سيد محمد",g:"M",father:"S14",mother:"S14w1",spouses:["S27w1"]},
{id:"S28",para:28,name:"محمذن",g:"M",father:"S27",mother:"S27w1",spouses:["S28w1"]},
{id:"S29",para:29,name:"لمرابط اشفغ محمذن",g:"M",father:"S1",mother:"S1w3",place:"اغمشانت (تكانت)",spouses:["S29w1","S29w2","S29w3","S29w4","S29w5","S29w6"]},
{id:"S30",para:30,name:"سيد محمد",g:"M",father:"S29",mother:"S29w1",spouses:["S30w1","S2d2"]},
{id:"S31",para:31,name:"باب (محمذن)",g:"M",father:"S30",mother:"S30w1",place:"الغاركات (تكانت)",spouses:["S31w1"]},
{id:"S32",para:32,name:"محمد الأمين",g:"M",father:"S29",mother:"S29w1",spouses:["S32w1"]},
{id:"S33",para:33,name:"محمد الشيخ",g:"M",father:"S32",mother:"S32w1",spouses:["S33w1"]},
{id:"S34",para:34,name:"محمد محمود",g:"M",father:"S29",mother:"S29w1",spouses:["S34w1"]},
{id:"S35",para:35,name:"محمد المختار",g:"M",father:"S34",mother:"S34w1",place:"وراب (تكانت)",spouses:["S35w1"]},
{id:"S36",para:36,name:"الشامخ (محمد المختار)",g:"M",father:"S35",mother:"S35w1",place:"التشليت البيظو (تكانت)",spouses:["S36w1"]},
{id:"S37",para:37,name:"الشيخ احمد",g:"M",father:"S36",mother:"S36w1",spouses:["S37w1","S37w2"]},
{id:"S38",para:38,name:"سيد",g:"M",father:"S36",mother:"S36w1",spouses:["S38w1","S43d2"]},
{id:"S39",para:39,name:"محفوظ",g:"M",father:"S34",mother:"S34w1",place:"التشليت البيظو (تكانت)",spouses:["S39w1"]},
{id:"S40",para:40,name:"السالم",g:"M",father:"S39",mother:"S39w1",spouses:["S40w1","S74d3"]},
{id:"S41",para:41,name:"محمد",g:"M",father:"S29",mother:"S29w2",spouses:["S41w1","S41w2","S41w3","S41w4"]},
{id:"S42",para:42,name:"محمد محمود",g:"M",father:"S41",mother:"S41w1",place:"التشليت البيظو (تكانت)",spouses:["S42w1"]},
{id:"S43",para:43,name:"السالم",g:"M",father:"S42",mother:"S42w1",spouses:["S43w1"]},
{id:"S44",para:44,name:"الناجي",g:"M",father:"S42",mother:"S42w1",spouses:["S44w1","S36d1"]},
{id:"S45",para:45,name:"الشيخ",g:"M",father:"S42",mother:"S42w1",spouses:["S47d1"]},
{id:"S46",para:46,name:"محمد المصطفى",g:"M",father:"S29",mother:"S29w3",place:"فرع تكيلت (تكانت)",spouses:["S46w1","S46w2"]},
{id:"S47",para:47,name:"سيد عالي",g:"M",father:"S46",mother:"S46w1",place:"ميمونو (تكانت)",spouses:["S47w1","S47w2"]},
{id:"S48",para:48,name:"الب (محمد المصطفى)",g:"M",father:"S47",mother:"S47w1",spouses:["S48w1","S74d1"]},
{id:"S49",para:49,name:"القاسم",g:"M",father:"S47",mother:"S47w2",spouses:["S49w1"]},
{id:"S50",para:50,name:"ببود (محمد محمود)",g:"M",father:"S46",mother:"S46w1",spouses:["S50w1","S50w2"]},
{id:"S51",para:51,name:"محمد المصطفى",g:"M",father:"S50",mother:"S50w1",spouses:["S51w1"]},
{id:"S52",para:52,name:"زيدان",g:"M",father:"S50",mother:"S50w2",spouses:["S52w1"]},
{id:"S53",para:53,name:"محمد الأمين",g:"M",father:"S50",mother:"S50w2",spouses:["S53w1","S53w2"]},
{id:"S54",para:54,name:"سيد عالي",g:"M",father:"S50",mother:"S50w2",spouses:["S54w1"]},
{id:"S55",para:55,name:"السالك (محمد المختار)",g:"M",father:"S46",mother:"S46w2",spouses:["S55w1","S55w2"]},
{id:"S56",para:56,name:"محمد",g:"M",father:"S55",mother:"S55w1",spouses:["S56w1"]},
{id:"S57",para:57,name:"سيد محمد",g:"M",father:"S46",mother:"S46w2",spouses:["S57w1"]},
{id:"S58",para:58,name:"شغالي (محمد المصطفى)",g:"M",father:"S57",mother:"S57w1",spouses:["S58w1"]},
{id:"S59",para:59,name:"سيد عالي",g:"M",father:"S57",mother:"S57w1",spouses:["S59w1"]},
{id:"S60",para:60,name:"عبد الله",g:"M",father:"S29",mother:"S29w4",place:"اشيرم (تكانت)",spouses:["S60w1"]},
{id:"S61",para:61,name:"الفاروق (محمد المصطفى)",g:"M",father:"S60",mother:"S60w1",dates:"…؟… – 2008م",place:"بير السعاده",spouses:["S61w1","S61w2"]},
{id:"S62",para:62,name:"الشيخ",g:"M",father:"S61",mother:"S61w1",spouses:["S62w1","S62w2"]},
{id:"S63",para:63,name:"السالك",g:"M",father:"S61",mother:"S61w2",spouses:["S63w1","S63w2"]},
{id:"S64",para:64,name:"العالم",g:"M",father:"S61",mother:"S61w2",spouses:["S64w1","S64w2"]},
{id:"S65",para:65,name:"الشيخ احمد",g:"M",father:"S61",mother:"S61w2",spouses:["S65w1","S20d5"]},
{id:"S66",para:66,name:"محمد عبد الله",g:"M",father:"S61",mother:"S61w2",spouses:["S66w1","S66w2"]},
{id:"S67",para:67,name:"محمد محمود",g:"M",father:"S61",mother:"S61w2",spouses:["S67w1","S74d4"]},
{id:"S68",para:68,name:"محمد الأمين",g:"M",father:"S61",mother:"S61w2",spouses:["S68w1"]},
{id:"S69",para:69,name:"باب (محمذن)",g:"M",father:"S60",mother:"S60w1",spouses:["S69w1","S69w2"]},
{id:"S70",para:70,name:"قاري (محمد عبد القادر)",g:"M",father:"S69",mother:"S69w1",spouses:["S74d4","S70w2"]},
{id:"S71",para:71,name:"محمد المصطفى",g:"M",father:"S69",mother:"S69w2",spouses:["S71w1","S50d3"]},
{id:"S72",para:72,name:"عبد الله",g:"M",father:"S69",mother:"S69w2",spouses:["S72w1","S72w2"]},
{id:"S73",para:73,name:"الشيخ الصغير",g:"M",father:"S29",mother:"S29w5",spouses:["S73w1"]},
{id:"S74",para:74,name:"الشيخ سيد محمد",g:"M",father:"S73",mother:"S73w1",spouses:["S74w1","S74w2"]},
{id:"S75",para:75,name:"الشيخ",g:"M",father:"S74",mother:"S74w2",spouses:["S75w1","S75w2"]},
{id:"S76",para:76,name:"امود (محمد محمود)",g:"M",father:"S74",mother:"S74w2",spouses:["S76w1"]},
{id:"S77",para:77,name:"محمد المصطفى",g:"M",father:"S74",mother:"S74w2",spouses:["S77w1","S77w2"]},
{id:"S78",para:78,name:"المصطفى",g:"M",father:"S1",mother:"S1w2",spouses:["S78w1"]},
{id:"S79",para:79,name:"عبد الرحمن",g:"M",father:"S78",mother:"S78w1",spouses:["S79w1"]},
{id:"S80",para:80,name:"المصطفى",g:"M",father:"S79",mother:"S79w1",place:"اكليبات لمهاريز (العصابو)",spouses:["S80w1","S80w2"]},
{id:"S81",para:81,name:"الشامخ (سيد محمد)",g:"M",father:"S80",mother:"S80w1",spouses:["S81w1","S11d1"]},
{id:"S82",para:82,name:"محفوظ",g:"M",father:"S80",mother:"S80w2",spouses:["S82w1"]},
{id:"T0-hamnadh",name:"محنض",g:"M",father:null,note:"بن ديمان — والد سيد الفالي وعبد الله",tribe:"لهميتات"},
{id:"D1",para:1,name:"عبد الله",g:"M",father:"T0-hamnadh",place:"انكيكم",note:"بن محنض بن ديمان",spouses:["D1w1","D1w2","D1w3"]},
{id:"D2",para:2,name:"سيد (المختار)",g:"M",father:"D1",mother:"D1w1",spouses:["D2w1","D2w2","D2w3"]},
{id:"D3",para:3,name:"احموذيلل",g:"M",father:"D2",mother:"D2w3",spouses:["D3w1","D3w2"]},
{id:"D4",para:4,name:"القاظي",g:"M",father:"D3",mother:"D3w1",spouses:["D4w1"]},
{id:"D5",para:5,name:"المختار",g:"M",father:"D4",mother:"D4w1",spouses:["D5w1"]},
{id:"D6",para:6,name:"احميميد",g:"M",father:"D5",mother:"D5w1",spouses:["D6w1","D6w2","D6w3"]},
{id:"D7",para:7,name:"محمذن",g:"M",father:"D6",mother:"D6w1",spouses:["D7w1"]},
{id:"D8",para:8,name:"أحمد",g:"M",father:"D6",mother:"D6w2",dates:"…؟… – 1317هـ/1899م",place:"تنيخلف",spouses:["D8w1","D8w2"]},
{id:"D9",para:9,name:"اليدالي",g:"M",father:"D8",mother:"D8w1",dates:"…؟… – 1345هـ/1927م",spouses:["D9w1"]},
{id:"D10",para:10,name:"باب",g:"M",father:"D9",mother:"D9w1",dates:"1324هـ/1906م – 1397هـ/1977م",place:"تفنانيت",spouses:["D10w1","D80d1"]},
{id:"D11",para:11,name:"محمودن",g:"M",father:"D9",mother:"D9w1",dates:"…؟… – 1370هـ/1951م",place:"السدوميو",spouses:["D11w1","D81d2"]},
{id:"D13",para:13,name:"علي",g:"M",father:"D5",mother:"D5w1",spouses:["D13w1"]},
{id:"D14",para:14,name:"الحسين",g:"M",father:"D13",mother:"D13w1",spouses:["D14w1"]},
{id:"D15",para:15,name:"محمذن ميلود",g:"M",father:"D5",mother:"D5w1",spouses:["D15w1"]},
{id:"D16",para:16,name:"يالليل",g:"M",father:"D3",mother:"D3w1",spouses:["D16w1"]},
{id:"D17",para:17,name:"ابييب",g:"M",father:"D16",mother:"D16w1",spouses:["D17w1"]},
{id:"D18",para:18,name:"أحمذ",g:"M",father:"D17",mother:"D17w1",spouses:["D18w1","D18w2"]},
{id:"D19",para:19,name:"المختار",g:"M",father:"D18",mother:"D18w1",spouses:["D77d1"]},
{id:"D20",para:20,name:"ولد سيدن (محمذن)",g:"M",father:"D18",mother:"D18w1",spouses:["D20w1"]},
{id:"D21",para:21,name:"بباشا",g:"M",father:"D20",mother:"D20w1",dates:"…؟… – 1323هـ/1905م",spouses:["D21w1"]},
{id:"D22",para:22,name:"حامد",g:"M",father:"D20",mother:"D20w1",spouses:["G11w1"]},
{id:"D23",para:23,name:"محمد",g:"M",father:"D20",mother:"D20w1",dates:"…؟… – 1345هـ/1927م",spouses:["D23w1"]},
{id:"D24",para:24,name:"المختار",g:"M",father:"D20",mother:"D20w1",dates:"…؟… – 1323هـ/1905م",spouses:["D24w1"]},
{id:"D25",para:25,name:"محمذن",g:"M",father:"D17",mother:"D17w1",spouses:["D25w1","D25w2"]},
{id:"D26",para:26,name:"الأمين",g:"M",father:"D25",mother:"D25w1",spouses:["D26w1","D26w2"]},
{id:"D27",para:27,name:"أحمد سالم",g:"M",father:"D26",mother:"D26w2",spouses:["D27w1"]},
{id:"D28",para:28,name:"محمد مولود",g:"M",father:"D27",mother:"D27w1",spouses:["D28w1"]},
{id:"D32",para:32,name:"محمذن",g:"M",father:"D27",mother:"D27w1",spouses:["D32w1"]},
{id:"D33",para:33,name:"محمد",g:"M",father:"D25",mother:"D25w2",spouses:["D33w1"]},
{id:"D34",para:34,name:"عالم",g:"M",father:"D33",mother:"D33w1",spouses:["D34w1"]},
{id:"D35",para:35,name:"اشفغ",g:"M",father:"D34",mother:"D34w1",spouses:["D35w1"]},
{id:"D36",para:36,name:"فاي",g:"M",father:"D16",mother:"D16w1",spouses:["D36w1"]},
{id:"D37",para:37,name:"أحمد ميلود",g:"M",father:"D36",mother:"D36w1",spouses:["D37w1"]},
{id:"D38",para:38,name:"ينصر (المختار)",g:"M",father:"D3",mother:"D3w2",spouses:["D38w1"]},
{id:"D39",para:39,name:"عبد الله",g:"M",father:"D38",mother:"D38w1",spouses:["D39w1"]},
{id:"D40",para:40,name:"باب الدين",g:"M",father:"D39",mother:"D39w1",spouses:["D40w1"]},
{id:"D41",para:41,name:"محمد فال",g:"M",father:"D40",mother:"D40w1",spouses:["D41w1"]},
{id:"D42",para:42,name:"حمم (محنض)",g:"M",father:"D38",mother:"D38w1",spouses:["D15d1","D42w2"]},
{id:"D43",para:43,name:"محمذن",g:"M",father:"D42",mother:"D15d1",spouses:["D43w1"]},
{id:"D44",para:44,name:"حمم",g:"M",father:"D43",mother:"D43w1",spouses:["D44w1","D44w2"]},
{id:"D45",para:45,name:"ببكر",g:"M",father:"D44",mother:"D44w1",spouses:["D45w1"]},
{id:"D46",para:46,name:"باب أحمد",g:"M",father:"D2",mother:"D2w1",spouses:["D46w1"]},
{id:"D47",para:47,name:"محمذن",g:"M",father:"D46",mother:"D46w1",spouses:["D47w1"]},
{id:"D48",para:48,name:"حبيب الله",g:"M",father:"D47",mother:"D47w1",spouses:["D48w1","D48w2","D48w3"]},
{id:"D49",para:49,name:"أحمد",g:"M",father:"D48",mother:"D48w1",spouses:["D49w1"]},
{id:"D50",para:50,name:"محمذن",g:"M",father:"D49",mother:"D49w1",spouses:["D50w1"]},
{id:"D51",para:51,name:"أحمد سالم",g:"M",father:"D50",mother:"D50w1",spouses:["D51w1"]},
{id:"D52",para:52,name:"المختار السالم",g:"M",father:"D50",mother:"D50w1",spouses:["D52w1"]},
{id:"D53",para:53,name:"ولد ابّوه (أحمد)",g:"M",father:"D52",mother:"D52w1",place:"حاسي لمرابط (سنغال)",spouses:["D53w1"]},
{id:"D56",para:56,name:"مختير (المختار)",g:"M",father:"D49",mother:"D49w1",spouses:["D56w1x"]},
{id:"D56w1x",name:"فلانة",g:"F",father:"XA1259",spouses:["D56"],ext:true},
{id:"D57",para:57,name:"ببكر",g:"M",father:"D56",mother:"D56w1x",dates:"…؟… – 1330هـ/1912م",place:"برك",spouses:["D96d3","D7d1","D63d1"]},
{id:"D58",para:58,name:"آبّوه (أحمد)",g:"M",father:"D57",dates:"1322هـ/1904م – 1401هـ/1981م",place:"تنيخلف",spouses:["D58w1","D58w2"]},
{id:"D55",para:55,name:"محمود فال",g:"M",father:"D48",mother:"D48w3",spouses:["D56w1"]},
{id:"D61",para:61,name:"المختار باب",g:"M",father:"D47",mother:"D47w1",spouses:["D61w1","Y1d4"]},
{id:"D62",para:62,name:"العيدي",g:"M",father:"D61",mother:"D61w1",spouses:["D62w1"]},
{id:"D63",para:63,name:"أحمذ",g:"M",father:"D62",mother:"D62w1",dates:"…؟… – 1339هـ/1921م",spouses:["D63w1"]},
{id:"D64",para:64,name:"الصوفي",g:"M",father:"D63",mother:"D63w1",spouses:["D64w1"]},
{id:"D65",para:65,name:"مختير",g:"M",father:"D63",mother:"D63w1",spouses:["D34d1","Y128d3"]},
{id:"D66",para:66,name:"محمد سالم",g:"M",father:"D65",mother:"D34d1",dates:"…؟… – 1338هـ/1920م",spouses:["D66w1"]},
{id:"D67",para:67,name:"محمذن",g:"M",father:"D62",mother:"D62w1",dates:"…؟… – 1355هـ/1936م",spouses:["D67w1"]},
{id:"D68",para:68,name:"أحمد",g:"M",father:"D67",mother:"D67w1",place:"ابير اولاد عيس",spouses:["D68w1"]},
{id:"D69",para:69,name:"محمد",g:"M",father:"D68",mother:"D68w1",dates:"1319هـ/1901م – 1356هـ/1937م",place:"ابري حيبلل",spouses:["D69w1"]},
{id:"D70",para:70,name:"حمم",g:"M",father:"D68",mother:"D68w1",dates:"1322هـ/1904م – 1378هـ/1959م",place:"ابري حيبلل",spouses:["D70w1"]},
{id:"D74",para:74,name:"ختّار (المختار)",g:"M",father:"D68",mother:"D68w1",dates:"1335هـ/1917م – 1429هـ/2008م",place:"ابير حيبلل",spouses:["D74w1","D28d1"]},
{id:"D76",para:76,name:"حمم (محم)",g:"M",father:"D61",mother:"D61w1",spouses:["D76w1","I93d1"]},
{id:"D77",para:77,name:"الصالح",g:"M",father:"D76",mother:"D76w1",spouses:["D77w1"]},
{id:"D78",para:78,name:"التجاني",g:"M",father:"D77",mother:"D77w1",spouses:["D78w1"]},
{id:"D79",para:79,name:"حمم",g:"M",father:"D78",mother:"D78w1",dates:"…؟… – 1348هـ/1930م",spouses:["D79w1"]},
{id:"D80",para:80,name:"محمدن",g:"M",father:"D78",mother:"D78w1",dates:"…؟… – 1338هـ/1920م",spouses:["D80w1"]},
{id:"D81",para:81,name:"منين",g:"M",father:"D78",mother:"D78w1",dates:"…؟… – 1350هـ/1932م",spouses:["D81w1","D81w2","D65d1","D65d4"]},
{id:"D85",para:85,name:"المختار",g:"M",father:"D76",mother:"D76w1",spouses:["D85w1","D85w2"]},
{id:"D86",para:86,name:"محمذن",g:"M",father:"D2",mother:"D2w1",spouses:["D86w1","Z3d5"]},
{id:"D87",para:87,name:"ببكر",g:"M",father:"D86",mother:"D86w1",spouses:["D87w1"]},
{id:"D88",para:88,name:"حبلل",g:"M",father:"D87",mother:"D87w1",spouses:["D88w1"]},
{id:"D89",para:89,name:"بتاجه",g:"M",father:"D86",mother:"D86w1",spouses:["D89w1"]},
{id:"D90",para:90,name:"اغلجئذن",g:"M",father:"D89",mother:"D89w1",spouses:["D90w1"]},
{id:"D91",para:91,name:"محمد فال",g:"M",father:"D90",mother:"D90w1",spouses:["D91w1","D91w2"]},
{id:"D92",para:92,name:"محمذن",g:"M",father:"D91",mother:"D91w1",spouses:["D92w1"]},
{id:"D93",para:93,name:"أحمذ",g:"M",father:"D91",mother:"D91w2",spouses:["D93w1"]},
{id:"D94",para:94,name:"الناجي",g:"M",father:"D93",mother:"D93w1",spouses:["D94w1"]},
{id:"D95",para:95,name:"محنض",g:"M",father:"D90",mother:"D90w1",spouses:["D95w1","I79d1"]},
{id:"D96",para:96,name:"أحممد فال",g:"M",father:"D95",mother:"I79d1",spouses:["D96w1","D96w2","D8d3"]},
{id:"D97",para:97,name:"أحمذ",g:"M",father:"D96",mother:"D96w1",spouses:["D97w1","D93d2"]},
{id:"D98",para:98,name:"المختار السالم",g:"M",father:"D97",mother:"D97w1",dates:"1331هـ/1923م –",spouses:["D98w1","D9d2"]},
{id:"D99",para:99,name:"محمدن",g:"M",father:"D97",mother:"D97w1",dates:"1348هـ/1930م – 1434هـ/2013م",place:"اركيز",spouses:["D99w1"]},
{id:"D100",para:100,name:"محمد فال",g:"M",father:"D97",mother:"D97w1",dates:"1357هـ/1938م – 1428هـ/2007م",place:"ابير حيبلل",spouses:["D11d1"]},
{id:"V1",para:1,name:"باهنين (الأمين)",g:"M",father:null,place:"أبير أحمد",
    note: "بن الفالي بن حمم صار — أسرة حليفة",spouses:["V1w1"],tribe:"تاكنيت"},
{id:"V1w1",name:"مانه",g:"F",father:"XA1382",place:"بئر أحمد",spouses:["V1"]},
{id:"V2",para:2,name:"احموذيلل",g:"M",father:"V1",mother:"V1w1",spouses:["V2w1"]},
{id:"V3",para:3,name:"الجيد",g:"M",father:"V1",mother:"V1w1",spouses:["P47w1","V3w2"]},
{id:"V1s1",name:"حبلل",g:"M",father:"V1",mother:"V1w1",place:"تريس",note:"لم يعقب"},
{id:"V1s2",name:"العالم",g:"M",father:"V1",mother:"V1w1",note:"له عقب في أهل انضب"},
{id:"V4",para:4,name:"عبد الله",g:"M",father:"V1",mother:"V1w1",place:"تنيخلف",spouses:["V4w1"]},
{id:"V8",para:8,name:"محمد",g:"M",father:"V1",mother:"V1w1",spouses:["V8w1"]},
{id:"V10",para:10,name:"محمذن",g:"M",father:"V1",mother:"V1w1",place:"صالحين المصران",spouses:["L23d1"]},
{id:"V1d1",name:"عيشان",g:"F",father:"V1",mother:"V1w1",note:"أم محمذن والأمين وفاطمة وامباركو من أبناء خيلوم (خير الأنام) بن محمد بن المزضف",spouses:["Z3"]},
{id:"V1d2",name:"فاظمظمن (فاطمة)",g:"F",father:"V1",mother:"V1w1",note:"أم ابني الأمين بن الفالي بن متيلي"},
{id:"V2w1",name:"امنيها",g:"F",father:"XA701",spouses:["V2"],ext:true},
{id:"V2d2",name:"ييكن",g:"F",father:"V2",mother:"V2w1",note:"أم امبريك والديهم ومحمذن وفاطمو فال ومانو من أبناء ميلود بن محمذن بن باهنين",spouses:["V11"]},
{id:"V3d1",name:"فلانة",g:"F",father:"V3",mother:"P47w1",note:"لها عيال في أولاد بو الفالي"},
{id:"V3w2",name:"فلانة",g:"F",father:"XA1242",spouses:["V3"],fullName:"فلانة بنت ابيهم بن ابا الصالح بن أحمد بن اشفغ اوبك بن مهنض امغر",ext:true},
{id:"V3d2",name:"فلانة",g:"F",father:"V3",mother:"V3w2",note:"لم تعقب"},
{id:"V4w1",name:"خديج",g:"F",father:"L23",spouses:["V4"],mother:"L23w2"},
{id:"V5",para:5,name:"سيد الفالي",g:"M",father:"V4",mother:"V4w1",place:"تنيخلف",spouses:["V5w1"]},
{id:"V6",para:6,name:"محمذن",g:"M",father:"V4",mother:"V4w1",place:"الغشوات",spouses:["V6w1"]},
{id:"V4d1",name:"فاطمة",g:"F",father:"V4",mother:"V4w1",place:"تنيخلف"},
{id:"V4d2",name:"فلانة",g:"F",father:"V4",mother:"V4w1",note:"لم تعقب"},
{id:"V4d3",name:"مريم",g:"F",father:"V4",mother:"V4w1",place:"تنيخلف",note:"أم محمذن بن محمد بن ميلود بن أحمد بن حامدت بن اشفغ المختار"},
{id:"V5w1",name:"ابيه (عيشة)",g:"F",father:"V11",note:"بنت ميلود بن محمذن بن باهنين — زواج داخلي بالأسرة (corrigé : rattachée à V11, pas V10 directement)",dates:"1319هـ/1892م –",place:"أبير حيبلل" ,spouses:["V5"]},
{id:"V5s1",name:"محمد فال",g:"M",father:"V5",mother:"V5w1",note:"لم يعقب"},
{id:"V6w1",name:"ختاش",g:"F",father:"V2",mother:"V2w1",note:"زواج داخلي بالأسرة؛ أم امبريك (ببكر) بن محمذن بن عبد الله بن باهنين" ,spouses:["V6"]},
{id:"V7",para:7,name:"امبريك (ببكر)",g:"M",father:"V6",mother:"V6w1",spouses:["V7w1"]},
{id:"V7w1",name:"فلانة",g:"F",father:"XA702",spouses:["V7"],ext:true},
{id:"V7d1",name:"سالما",g:"F",father:"V7",mother:"V7w1",note:"لم تعقب"},
{id:"V8w1",name:"فلانة",g:"F",father:null,spouses:["V8"]},
{id:"V9",para:9,name:"العروه",g:"M",father:"V8",mother:"V8w1",spouses:["V9w1"]},
{id:"V9w1",name:"فلانة",g:"F",father:null,spouses:["V9"]},
{id:"V9d1",name:"فاطمة",g:"F",father:"V9",mother:"V9w1",place:"أبير حيبلل",note:"لم تعقب"},
{id:"V11",para:11,name:"ميلود",g:"M",father:"V10",mother:"L23d1",place:"أبير حيبلل",spouses:["V11w1","V11w3","V2d2"]},
{id:"V10s1",name:"منياره",g:"M",father:"V10",mother:"L23d1",place:"صالحي المصران",note:"لم تعقب"},
{id:"V10d1",name:"ادهيمه",g:"F",father:"V10",mother:"L23d1",place:"صالحي المصران",note:"لم تعقب"},
{id:"V10d3",name:"خديجة",g:"F",father:"V10",mother:"L23d1",note:"أم بنيت ادخيل بن المبارك بن محمد بن اشفغ مينحنو"},
{id:"V10d4",name:"صفيه",g:"F",father:"V10",mother:"L23d1",note:"أم فاطمة بنت بوزفره (اعمر) بن الشرغي"},
{id:"V10d5",name:"مان هاه",g:"F",father:"V10",mother:"L23d1",note:"أم أبناء علي بن سكم بن محمذن بن اعمر يزكئذن"},
{id:"V10d6",name:"مريم",g:"F",father:"V10",mother:"L23d1",note:"أم أبناء اعمر بن بكار بن الخليل بن أحمد بن التونسي (ابراهيم)"},
{id:"V11w1",name:"آمجه",g:"F",father:"R45s1s1s1",spouses:["V11"]},
{id:"V12",para:12,name:"محمد فال",g:"M",father:"V11",mother:"V11w1",place:"تنيضلو",spouses:["V12w1","V12w2"]},
{id:"V11w3",name:"يي نك جن",g:"F",father:"V2",mother:"V2w1",note:"زواج داخلي بالأسرة" ,spouses:["V11"]},
{id:"V11s1",name:"الديهم",g:"M",father:"V11",mother:"V11w3",note:"لم يعقب"},
{id:"V11s2",name:"امبيريك",g:"M",father:"V11",mother:"V11w3",note:"لم يعقب"},
{id:"V11s3",name:"محمذن",g:"M",father:"V11",mother:"V11w3",note:"لم يعقب"},
{id:"V11d2",name:"مانه",g:"F",father:"V11",mother:"V11w3",note:"لم تعقب"},
{id:"V12w1",name:"أم المؤمنين",g:"F",father:"XA704",spouses:["V12"],ext:true},
{id:"V12s1",name:"أحمد",g:"M",father:"V12",mother:"V12w1",note:"لم يعقب"},
{id:"V12s2",name:"سيديا",g:"M",father:"V12",mother:"V12w1",place:"سنغال",note:"لم يعقب"},
{id:"V13",para:13,name:"محمد",g:"M",father:"V12",mother:"V12w1",spouses:["V13w1"]},
{id:"V14",para:14,name:"المختار",g:"M",father:"V12",mother:"V12w1",dates:"1341هـ/1922م –",place:"باجليالي",spouses:["V14w1","V14w2"]},
{id:"V12w2",name:"فاطمة",g:"F",father:"XA705",spouses:["V12"],ext:true},
{id:"V24",para:24,name:"ميلود",g:"M",father:"V12",mother:"V12w2",dates:"1351هـ/1932م –",place:"أبير حيبلل",spouses:["V24w1","V24w2","D65d5"]},
{id:"V12d1",name:"عائشة",g:"F",father:"V12",mother:"V12w2",place:"انبيكة ارمو" ,spouses:["K18"] ,crossLink:true},
{id:"V13w1",name:"فلانة",g:"F",father:null,spouses:["V13"]},
{id:"V13d1",name:"فلانة",g:"F",father:"V13",mother:"V13w1",note:"أم أبناء فالن بن ارب -مدلش-"},
{id:"V14w1",name:"خدجاين",g:"F",father:"Z150",mother:"Y128d3",place:"تنيخلف",spouses:["V14"],fullName:"خدجاين بنت آياه (بوبكر) بن أحمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"V15",para:15,name:"اباه",g:"M",father:"V14",mother:"V14w1",dates:"1361هـ/1942م –",place:"أبير حيبلل",spouses:["V15w1","V15w2"]},
{id:"V14d1",name:"خيرا",g:"F",father:"V14",mother:"V14w1",place:"الرومدي (اندونجيك)",dates:"1361هـ/1943م –",note:"أم المختار بن عبد الله بن ابوبا (ببكر) بن اتاه (المختار) بن سيد احمد بن حبلل بن ابراهيم",spouses:["I14","Y72"]},
{id:"V14d2",name:"عائشة",g:"F",father:"V14",mother:"V14w1",dates:"1374هـ/1955م –",place:"باجليالي"},
{id:"V14d3",name:"فاطمة",g:"F",father:"V14",mother:"V14w1",dates:"1316هـ/1898م – 1411هـ/1981م",place:"اليمون"},
{id:"V14w2",name:"آمنة",g:"F",father:"XA707",place:"حبلل",spouses:["V14"],ext:true},
{id:"V18",para:18,name:"الأمين",g:"M",father:"V14",mother:"V14w2",dates:"1331هـ/1912م – 1392هـ/1972م",place:"حبلل",spouses:["V18w1","V18w2"]},
{id:"V20",para:20,name:"ميلود",g:"M",father:"V14",mother:"V14w2",dates:"1332هـ/1914م – 1387هـ/1967م",place:"حبلل",spouses:["V20w1"]},
{id:"V15w1",name:"عيشة",g:"F",father:"K124",mother:"K124w1",note:"بنت اتّو (الكوري) بن محمذن بن سيد الفالي بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",dates:"1323هـ/1915م – 1397هـ/1977م",place:"أبير حيبلل",spouses:["V15"],crossLink:true},
{id:"V16",para:16,name:"التو (الكوري)",g:"M",father:"V15",mother:"V15w1",dates:"1342هـ/1924م – 1436هـ/2015م",place:"أبير حيبلل",spouses:["V16w1"]},
{id:"V15w2",name:"ابنيه",g:"F",father:"D9",mother:"D9w1",dates:"1326هـ/1918م – 1412هـ/1992م",place:"أحسي السعادة",spouses:["V15"],fullName:"ابنيه بنت اليدالي بن أحمد بن احميميد بن المختار بن القاضي بن احموذيلل بن سيد (المختار) بن عبد الله"},
{id:"V16w1",name:"عائشة",g:"F",father:"V20",note:"زواج داخلي بالأسرة",dates:"1372هـ/1953م –" ,spouses:["V16"],mother:"V20w1"},
{id:"V16d1",name:"مريم",g:"F",father:"V16",mother:"V16w1",dates:"1388هـ/1968م –"},
{id:"V16s1",name:"أحمد",g:"M",father:"V16",mother:"V16w1",dates:"1393هـ/1973م –"},
{id:"V17",para:17,name:"فياه (محمد فال)",g:"M",father:"V16",mother:"V16w1",dates:"1396هـ/1976م –",spouses:["V17w1","Y90d2"]},
{id:"V16s2",name:"بدالي (أحمد)",g:"M",father:"V16",mother:"V16w1",dates:"1416هـ/1986م –"},
{id:"V17w1",name:"مريم",g:"F",father:"Y90",dates:"1418هـ/1988م –",spouses:["V17"]},
{id:"V17s1",name:"عبد الله",g:"M",father:"V17",mother:"V17w1",dates:"1435هـ/2014م –"},
{id:"V17s2",name:"حيدر",g:"M",father:"V17",mother:"V17w1"},
{id:"V18w1",name:"حنه",g:"F",father:"XA709",place:"انواكشوط",spouses:["V18"],ext:true},
{id:"V19",para:19,name:"محمد فال",g:"M",father:"V18",mother:"V18w1",dates:"1367هـ/1948م –",spouses:["V19w1"]},
{id:"V18w2",name:"كوكه",g:"F",father:"XA1266",place:"انواكشوط",spouses:["V18"],ext:true},
{id:"V18d1",name:"فاطماني",g:"F",father:"V18",mother:"V18w2",dates:"1389هـ/1969م –"},
{id:"V18s1",name:"المختار",g:"M",father:"V18",mother:"V18w2",dates:"1392هـ/1972م –"},
{id:"V18d2",name:"فلانة",g:"F",father:"V18",mother:"V18w2",place:"غانا"},
{id:"V18s2",name:"لحبيب",g:"M",father:"V18",mother:"V18w2"},
{id:"V19w1",name:"فاطمه",g:"F",father:"XA622",spouses:["V19"],ext:true},
{id:"V19s1",name:"لطفي",g:"M",father:"V19",mother:"V19w1",dates:"1411هـ/1991م –"},
{id:"V20w1",name:"تنت (خديجة)",g:"F",father:"I85",mother:"I85w1",dates:"1341هـ/1923م – 1429هـ/2008م",place:"أبير حيبلل",spouses:["V20"]},
{id:"V21",para:21,name:"المختار",g:"M",father:"V20",mother:"V20w1",dates:"1361هـ/1942م – 1419هـ/1997م",place:"حبلل",spouses:["V21w1","V21w2"]},
{id:"V22",para:22,name:"سيد",g:"M",father:"V20",mother:"V20w1",dates:"1365هـ/1946م –",spouses:["P25w2"]},
{id:"V20d1",name:"بوبه",g:"F",father:"V20",mother:"V20w1",dates:"1368هـ/1949م –" ,spouses:["J39"] ,crossLink:true},
{id:"V23",para:23,name:"محمد",g:"M",father:"V20",mother:"V20w1",dates:"1377هـ/1958م –",spouses:["V23w1","I77d5"]},
{id:"V21w1",name:"دكومه -أولاد الناصر-",g:"F",father:null,spouses:["V21"]},
{id:"V21d1",name:"خيرا",g:"F",father:"V21",mother:"V21w1",dates:"1411هـ/1981م –" ,spouses:["K131"] ,crossLink:true},
{id:"V21w2",name:"اغالنه",g:"F",father:"XA711",spouses:["V21"],ext:true},
{id:"V21s1",name:"الحاج",g:"M",father:"V21",mother:"V21w2",dates:"1416هـ/1986م –"},
{id:"V22s1",name:"المختار",g:"M",father:"V22",mother:"P25w2",dates:"1411هـ/1981م –"},
{id:"V22s2",name:"محمد",g:"M",father:"V22",mother:"P25w2",dates:"1414هـ/1984م –"},
{id:"V23w1",name:"السالمه",g:"F",father:"XA657",spouses:["V23"],ext:true},
{id:"V23d1",name:"توت",g:"F",father:"V23",mother:"V23w1",dates:"1414هـ/1994م –"},
{id:"V23s1",name:"سيد المختار",g:"M",father:"V23",mother:"I77d5",dates:"1423هـ/2002م –"},
{id:"V23d2",name:"عائشة",g:"F",father:"V23",mother:"I77d5",dates:"1426هـ/2005م –"},
{id:"V23s2",name:"ديدي",g:"M",father:"V23",mother:"I77d5",dates:"1428هـ/2007م –"},
{id:"V24w1",name:"فنطجيمه",g:"F",father:"D65",spouses:["V24"]},
{id:"V25",para:25,name:"المختار",g:"M",father:"V24",mother:"V24w1",dates:"1365هـ/1946م –",place:"حبلل",spouses:["V25w1"]},
{id:"V24w2",name:"أم الخيرات",g:"F",father:"I80",dates:"1387هـ/1967م –",place:"أبير حيبلل",spouses:["V24"],mother:"I80w2",note:"أم احمد ومحمد وفاطمو فال من أبناء ميلود بن محمد فال بن ميلود بن محمذن بن باهنين"},
{id:"V26",para:26,name:"أحمد",g:"M",father:"V24",mother:"V24w2",dates:"1367هـ/1948م –",place:"حبلل",spouses:["V26w1"]},
{id:"V24d1",name:"فاطمه فال",g:"F",father:"V24",mother:"V24w2",dates:"1332هـ/1914م – 1418هـ/1988م",place:"أبير حيبلل" ,spouses:["Z131"] ,crossLink:true},
{id:"V29",para:29,name:"محمد",g:"M",father:"V24",mother:"V24w2",dates:"1334هـ/1916م – 1414هـ/1994م",place:"أبير حيبلل",spouses:["V29w1"]},
{id:"V25w1",name:"آمنة",g:"F",father:"I96",dates:"1331هـ/1912م – 1428هـ/2007م",place:"أبير حيبلل",spouses:["V25"],mother:"I96w2",note:"أم بنيت المختار بن ميلود بن محمد فال بن ميلود بن محمذن بن باهنين"},
{id:"V25d1",name:"أم اعريف (عيشة)",g:"F",father:"V25",mother:"V25w1",dates:"1365هـ/1946م –" ,spouses:["J11"] ,crossLink:true},
{id:"V25d2",name:"ميمه (أم اشويمو)",g:"F",father:"V25",mother:"V25w1",dates:"1365هـ/1946م – 1429هـ/2008م",place:"أبير حيبلل" ,spouses:["K139"] ,crossLink:true},
{id:"V26w1",name:"عائشة",g:"F",father:"F124",mother:"W5d2",dates:"1426هـ/2005م –",place:"أبير حيبلل",spouses:["V26"],crossLink:true,fullName:"عائشة بنت أحمد بن الأمين بن بيبات بن حمم بن المبارك بن اما (الماقور)"},
{id:"V26d1",name:"اخويديجه (خديجة)",g:"F",father:"V26",mother:"V26w1",dates:"1354هـ/1936م – 1434هـ/2013م",place:"أبير حيبلل"},
{id:"V27",para:27,name:"عبد الله",g:"M",father:"V26",mother:"V26w1",dates:"1357هـ/1938م – 1431هـ/2011م",place:"أبير حيبلل",spouses:["V27w1"]},
{id:"V28",para:28,name:"دبيت",g:"M",father:"V26",mother:"V26w1",dates:"1365هـ/1946م – 1435هـ/2014م",place:"أبير حيبلل",spouses:["V28w1"]},
{id:"V27w1",name:"عائشة",g:"F",father:"I56",mother:"I56w2",note:"بنت الأمين بن منح (محنض) — أم أبناء عبد الله بن احمد بن ميلود بن محمد فال بن ميلود بن محمذن بن باهنين",dates:"1372هـ/1953م –",spouses:["V27"],crossLink:true},
{id:"V27s1",name:"زهير (محمدن)",g:"M",father:"V27",mother:"V27w1",dates:"1394هـ/1974م –"},
{id:"V27s2",name:"ولد اباه (محمد)",g:"M",father:"V27",mother:"V27w1",dates:"1396هـ/1976م –"},
{id:"V27s3",name:"احميديت (أحمد)",g:"M",father:"V27",mother:"V27w1",dates:"1411هـ/1981م –"},
{id:"V27d1",name:"خدي",g:"F",father:"V27",mother:"V27w1",dates:"1412هـ/1982م –" ,spouses:["J12"] ,crossLink:true},
{id:"V27d2",name:"ميم (أم الخيرات)",g:"F",father:"V27",mother:"V27w1",dates:"1405هـ/1985م –" ,spouses:["Z60"] ,crossLink:true},
{id:"V27d3",name:"فاطمة",g:"F",father:"V27",mother:"V27w1",dates:"1415هـ/1985م –"},
{id:"V27d4",name:"عيشه",g:"F",father:"V27",mother:"V27w1",dates:"1413هـ/1993م –"},
{id:"V28w1",name:"النعمه",g:"F",father:"I15",mother:"I15w1",note:"بنت أحمد سالم بن عبد الله — أم السالك وعائشة ابني دبيت",dates:"1381هـ/1962م – 1419هـ/1998م",place:"أبير حيبلل",spouses:["V28"],crossLink:true},
{id:"V28s1",name:"السالك (اباه)",g:"M",father:"V28",mother:"V28w1",dates:"1414هـ/1994م –"},
{id:"V28d1",name:"عائشة",g:"F",father:"V28",mother:"V28w1",dates:"1419هـ/1997م –"},
{id:"V29w1",name:"سلمه",g:"F",father:"I14",mother:"I14w3",note:"بنت عبد الله بن أبوبا — même personne que I14d1",dates:"1358هـ/1939م –",spouses:["V29"],crossLink:true},
{id:"V31",para:31,name:"الطلبه",g:"M",father:"V29",mother:"V29w1",dates:"1371هـ/1952م –",spouses:["V31w1"]},
{id:"V33",para:33,name:"عبد الله",g:"M",father:"V29",mother:"V29w1",dates:"1376هـ/1957م –",spouses:["V33w1","V33w2"]},
{id:"V34",para:34,name:"أحمد",g:"M",father:"V29",mother:"V29w1",dates:"1381هـ/1962م –",spouses:["V34w1"]},
{id:"V31w1",name:"اللو",g:"F",father:"XA323",spouses:["V31"],ext:true},
{id:"V31b",para:31,name:"أحمد",g:"M",father:"V31",mother:"V31w1",dates:"1396هـ/1976م –",spouses:["M38w2","V31bw2"]},
{id:"V31d1",name:"فرحه (مريم)",g:"F",father:"V31",mother:"V31w1",dates:"1411هـ/1981م –"},
{id:"V31s1",name:"محمد",g:"M",father:"V31",mother:"V31w1",dates:"1412هـ/1982م –"},
{id:"V32",para:32,name:"محمد الأمين",g:"M",father:"V31",mother:"V31w1",dates:"1414هـ/1984م –",spouses:["V32w1"]},
{id:"V31bs1",name:"سيد محمد",g:"M",father:"V31b",mother:"M38w2",dates:"1428هـ/2007م –"},
{id:"V31bw2",name:"البتول",g:"F",father:"Y91",dates:"1414هـ/1984م –",spouses:["V31b"]},
{id:"V31bd1",name:"فرحه",g:"F",father:"V31b",mother:"V31bw2",dates:"1431هـ/2010م –"},
{id:"V32w1",name:"السيده منت اب جيبّ جيو",g:"F",father:"XA1272",spouses:["V32"],fullName:"السيده منت اب جيبّ جيو بنت عبد الله بن الشيخ أحمد بن محمذن بن الفالي بن المامون بن محمذ بن اعمر يزكئذن بن محنضنلل بن اعمر اديقب",ext:true},
{id:"V32s1",name:"الطلبه",g:"M",father:"V32",mother:"V32w1",dates:"1429هـ/2008م –"},
{id:"V33w1",name:"آمنة",g:"F",father:"XA715",spouses:["V33"],ext:true},
{id:"V33s1",name:"محمد",g:"M",father:"V33",mother:"V33w1",dates:"1411هـ/1981م –"},
{id:"V33w2",name:"آمنة",g:"F",father:"V16",mother:"V16w1",note:"زواج داخلي بالأسرة",dates:"1398هـ/1978م –" ,spouses:["V33"],fullName:"آمنة بنت اتو (الكوري) بن اباه بن المختار بن محمد فال بن ميلود بن محمذن بن باهنين"},
{id:"V33s2",name:"المختار",g:"M",father:"V33",mother:"V33w2",dates:"1423هـ/2002م –"},
{id:"V33s3",name:"حمدن",g:"M",father:"V33",mother:"V33w2",dates:"1427هـ/2006م –"},
{id:"V33d1",name:"فاطمة",g:"F",father:"V33",mother:"V33w2",dates:"1427هـ/2006م –"},
{id:"V34w1",name:"خيرا",g:"F",father:"I18",dates:"1398هـ/1978م –",spouses:["V34"],fullName:"خيرا بنت المختار بن عبد الله بن أبوبا (ببكر) بن المختار بن سيد أحمد بن حبلل بن ابراهيم",mother:"I18w2",note:"أم أبناء احمد بن محمد بن ميلود بن محمد فال بن ميلود بن محمذن بن باهنين"},
{id:"V34s1",name:"الطلبه",g:"M",father:"V34",mother:"V34w1",dates:"1428هـ/2007م –"},
{id:"V34d1",name:"عيشه",g:"F",father:"V34",mother:"V34w1",dates:"1433هـ/2012م –"},
{id:"I1",para:1,name:"ابراهيم",g:"M",father:"T0-kawri",place:"أبير لحمار",spouses:["I1w1"]},
{id:"I1w1",name:"ام هاني",g:"F",father:"XA716",spouses:["I1"],ext:true},
{id:"I1d2",name:"حنه",g:"F",father:"I1",mother:"I1w1",note:"أم المختار سعيد وعائشة ويايّمام (مريم) وغادجيو وحنو وامباركو اعلينا من أبناء محمد اليدالي بن المختار بن حمم سعيد",spouses:["XA495"]},
{id:"I1d3",name:"شام",g:"F",father:"I1",mother:"I1w1",note:"أم غادجيو من أبناء محمد العاقل بن محنض بن الماح بن المختار اكدعثمان"},
{id:"I1d4",name:"غاديجه",g:"F",father:"I1",mother:"I1w1",note:"أم المبارك ومحنض واصديكو من أبناء باب الدين بن اشفغ الأمين",spouses:["Y124"]},
{id:"I2",para:2,name:"حبلل",g:"M",father:"I1",mother:"I1w1",place:"تنيخلف",spouses:["I2w1","I2w2"]},
{id:"I3",para:3,name:"سيد أحمد",g:"M",father:"I2",mother:"I2w2",spouses:["M3d1","I3w2","Z5d1","I3w4"]},
{id:"I2w1",name:"فاطمه",g:"F",father:"Y4",spouses:["I2"],crossLink:true,mother:"Y4w1",note:"أم بنات حبلل بن ابراهيم بن الكوري"},
{id:"I2s0",name:"محمد",g:"M",father:"I2",mother:"I2w1",note:"لم يعقب"},
{id:"I2d2",name:"توت",g:"F",father:"I2",mother:"I2w1",note:"أم اعمامي ومحمذن واحميدات وفاطمة وشقيقتهم من أبناء ألّما الشاعر بن المصطفى بن حمم سعيد"},
{id:"I2d4",name:"مريم زاد",g:"F",father:"I2",mother:"I2w1",note:"أم بنيت يا فاظل بن حندي بن عمي اعديج"},
{id:"I2d5",name:"ميمهنه",g:"F",father:"I2",mother:"I2w1",note:"أم الكوري والصغرى من أبناء قطرب بن محنض بن الغالوي بن الفالي بن باب أحمد",spouses:["XA31"]},
{id:"I2w2",name:"ميمهنه",g:"F",father:"XA718",spouses:["I2"],ext:true},
{id:"I4",para:4,name:"محمذن",g:"M",father:"I3",mother:"M3d1",spouses:["I4w1","I4w2"]},
{id:"I4w1",name:"امينه",g:"F",father:"I52",note:"بنت محمذن بن حبلل — زواج داخلي؛ أم العيشو من أبناء محمذن بن سيد احمد بن حبلل بن ابراهيم",spouses:["I4"],mother:"I52w1"},
{id:"I4w2",name:"فاطمة",g:"F",father:"XA719",spouses:["I4"],ext:true},
{id:"I4d1",name:"مريم",g:"F",father:"I4",mother:"I4w2",note:"أم والّيل (سيد الفالي) ومحمد وابّيد (بزيد) وببكر وفاطمتين وعائشة من أبناء بييين بن احميّد بن المزضف بن الأمين بن اشفغ مينحنو؛ أم محمذن من أبناء احممد بن ميلود بن سيد احمد بن حبلل بن ابراهيم — لم يعقب؛ زواج داخلي بالأسرة",spouses:["G85","G86","I6"]},
{id:"I3d1",name:"مريم",g:"F",father:"I3",mother:"M3d1",note:"لم تعقب"},
{id:"I3w2",name:"عائشة",g:"F",father:"F107",spouses:["I3"],crossLink:true,fullName:"عائشة بنت حمم بن المبارك بن اما (الماقور)",mother:"F107w1",note:"أم ميلود بن سيد أحمد بن حبلل بن ابراهيم"},
{id:"I3w4",name:"مريم",g:"F",father:"F30",spouses:["I3"]},
{id:"I3s0",name:"سيد الفالي",g:"M",father:"I3",mother:"I3w4",note:"لم يعقب"},
{id:"I3d3",name:"ميمهنه",g:"F",father:"I3",mother:"I3w4",note:"أم الكوري من أبناء أبَي بن محمذن بن احممد بن التقي بن أبَي (المختار)"},
{id:"I5",para:5,name:"ميلود",g:"M",father:"I3",mother:"I3w2",spouses:["I5w1"]},
{id:"I6",para:6,name:"احممد",g:"M",father:"I5",mother:"I5w1",spouses:["I6w1","I4d1"]},
{id:"I7",para:7,name:"أحمد",g:"M",father:"I6",mother:"I6w1",dates:"1305هـ/1888م – 1405هـ/1984م",place:"أبير حيبلل",spouses:["I7w1","I7w2"]},
{id:"I8",para:8,name:"عبد الرحمن",g:"M",father:"I7",mother:"I7w1",dates:"1354هـ/1936م –",spouses:["I8w1"]},
{id:"I11",para:11,name:"محمد",g:"M",father:"I5",mother:"I5w1",spouses:["I11w1"]},
{id:"I12",para:12,name:"أتّاه (المختار)",g:"M",father:"I3",mother:"Z5d1",spouses:["I12w1","K6d1"]},
{id:"I13",para:13,name:"أبّوبا (ببكر)",g:"M",father:"I12",mother:"I12w1",dates:"1281هـ/1865م – 1367هـ/1948م",place:"تنيخلف",spouses:["I13w1","I13w2","I13w3","I13w4"]},
{id:"I14",para:14,name:"عبد الله",g:"M",father:"I13",mother:"I13w1",dates:"1312هـ/1895م – 1370هـ/1951م",place:"اكدرنيت",spouses:["I14w1","V14d1","I14w3"]},
{id:"I15",para:15,name:"أحمد سالم",g:"M",father:"I14",mother:"I14w1",dates:"1341هـ/1923م – 1415هـ/1995م",place:"أبير حيبلل",spouses:["I15w1","I15w2"]},
{id:"I18",para:18,name:"المختار",g:"M",father:"I14",mother:"V14d1",dates:"1342هـ/1924م –",spouses:["I18w1","I18w2","I18w3","I18w4"],note:"المذكور بالفقرة 18 — رقم غير مؤكد"},
{id:"I18w1",name:"فلانة",g:"F",father:"XA503",spouses:["I18"],ext:true},
{id:"I18d1",name:"آمنة",g:"F",father:"I18",mother:"I18w1",note:"لم تعقب"},
{id:"I18w2",name:"الساره",g:"F",father:"I6s2",dates:"1374هـ/1955م –",spouses:["I18"]},
{id:"I18w3",name:"عائشة",g:"F",father:"XA730",spouses:["I18"],ext:true},
{id:"I18d3",name:"بهنانه (فاطمة)",g:"F",father:"I18",mother:"I18w3",dates:"1400هـ/1980م –"},
{id:"I18w4",name:"منت اباه",g:"F",father:"XA732",dates:"1365هـ/1946م –",spouses:["I18"],ext:true},
{id:"I18d4",name:"لحبوس",g:"F",father:"I18",mother:"I18w4",dates:"1401هـ/1981م –",note:"أم أبناء السيد بن من (محمذين) بن سيد بن محمد بن الأمين بن حمم بن ابو الحس بن المزضف",spouses:["Z123"]},
{id:"I18d5",name:"ابّيه",g:"F",father:"I18",mother:"I18w4",dates:"1401هـ/1981م –",note:"أم مالي بن محمد المختار بن السيد بن اميو (محمذن) بن سيد احممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم؛ زواج داخلي بالأسرة",fullName:"ابّيه بنت المختار بن عبد الله بن ابّوبا (ببكر) بن المختار بن سيد احمد بن حبلل بن ابراهيم",spouses:["I40"]},
{id:"I18s1",name:"احمد",g:"M",father:"I18",mother:"I18w4",note:"لم يعقب"},
{id:"I19",para:19,name:"أحمد سالم",g:"M",father:"I13",mother:"I13w4",dates:"1332هـ/1914م – 1425هـ/2004م",place:"أبير حيبلل",spouses:["Z84w1","I19w2"]},
{id:"I22",para:22,name:"الحسن",g:"M",father:"I13",mother:"I13w4",dates:"1332هـ/1914م – 1419هـ/1998م",place:"أبير حيبلل",spouses:["I22w1"]},
{id:"I23",para:23,name:"المختار",g:"M",father:"I13",mother:"I13w4",dates:"1335هـ/1917م – 1379هـ/1960م",place:"تنيخلف",spouses:["I90d1"]},
{id:"I25",para:25,name:"سيد الفالي",g:"M",father:"I2",mother:"I2w2",spouses:["I25w1"]},
{id:"I26",para:26,name:"ببكر",g:"M",father:"I25",mother:"I25w1",spouses:["I64d3"]},
{id:"I27",para:27,name:"سيد أحممد",g:"M",father:"I26",mother:"I64d3",spouses:["I5d1"]},
{id:"I28",para:28,name:"اميه (محمذن)",g:"M",father:"I27",mother:"I5d1",dates:"– 1354هـ/1936م",place:"أبير حيبلل",spouses:["I28w1"]},
{id:"I29",para:29,name:"كاكاه (ببكر)",g:"M",father:"I28",mother:"I28w1",dates:"1322هـ/1904م – 1414هـ/1994م",place:"أبير حيبلل",spouses:["I96d4","I29w2"]},
{id:"I30",para:30,name:"الكبير (محمد)",g:"M",father:"I28",mother:"I28w1",dates:"1330هـ/1912م – 1407هـ/1987م",place:"احسي السعاده",spouses:["I30w1"]},
{id:"I35",para:35,name:"أحمد",g:"M",father:"I28",mother:"I28w1",dates:"1335هـ/1917م – 1426هـ/2005م",place:"أبير حيبلل",spouses:["I35w1"]},
{id:"I38",para:38,name:"السيد",g:"M",father:"I28",mother:"I28w1",dates:"1342هـ/1924م – 1408هـ/1988م",place:"حبلل",spouses:["I38w1","I38w2","I7d1"]},
{id:"I41",para:41,name:"المختار",g:"M",father:"I28",mother:"I28w1",dates:"1354هـ/1936م –",spouses:["I44d1","I23d3"]},
{id:"I42",para:42,name:"المختار",g:"M",father:"I27",mother:"I5d1",dates:"– 1354هـ/1936م",place:"أبير حيبلل",spouses:["I42w1"]},
{id:"I43",para:43,name:"ببكر",g:"M",father:"I27",mother:"I5d1",dates:"1351هـ/1932م –",place:"قرب حاس لمرابط (سنغال)",spouses:["I43w1"]},
{id:"I44",para:44,name:"خيّي (محمدن)",g:"M",father:"I43",mother:"I43w1",dates:"1335هـ/1917م – 1409هـ/1989م",place:"احسي السعاده",spouses:["I44w1"]},
{id:"I45",para:45,name:"محمد فال",g:"M",father:"I43",mother:"I43w1",dates:"1341هـ/1923م – 1424هـ/2003م",place:"أبير حيبلل",spouses:["I45w1"]},
{id:"I47",para:47,name:"الماّن",g:"M",father:"I25",mother:"I25w1",spouses:["I47w1"]},
{id:"I48",para:48,name:"محمذن",g:"M",father:"I47",mother:"I47w1",dates:"1347هـ/1929م –",place:"أبير حيبلل",spouses:["I48w1","I48w2","I48w3"]},
{id:"I49",para:49,name:"محمذن",g:"M",father:"I25",mother:"I25w1",spouses:["I70d1","I49w2"]},
{id:"I50",para:50,name:"اسويد أحمد",g:"M",father:"I49",mother:"I70d1",spouses:["I50w1"]},
{id:"I51",para:51,name:"محمد فال",g:"M",father:"I49",mother:"I49w2",spouses:["I51w1"]},
{id:"I52",para:52,name:"محمذن",g:"M",father:"I2",mother:"I2w2",spouses:["I52w1"]},
{id:"I53",para:53,name:"أحمد",g:"M",father:"I52",mother:"I52w1",spouses:["I53w1"]},
{id:"I54",para:54,name:"سيد",g:"M",father:"I53",mother:"I53w1",dates:"1338هـ/1920م –",place:"حاس يلول",spouses:["I54w1"]},
{id:"I55",para:55,name:"منّح (محنض)",g:"M",father:"I53",mother:"I53w1",dates:"1341هـ/1923م –",spouses:["I55w1"]},
{id:"I56",para:56,name:"الأمين",g:"M",father:"I55",mother:"I55w1",dates:"1330هـ/1912م – 1415هـ/1995م",place:"أبير حيبلل",spouses:["I56w1","I56w2","I56w3"]},
{id:"I60",para:60,name:"سيد",g:"M",father:"I55",mother:"I55w1",dates:"1337هـ/1919م – 1426هـ/2005م",place:"أبير حيبلل",spouses:["I60w1"]},
{id:"I62",para:62,name:"معلوم",g:"M",father:"I1",mother:"I1w1",spouses:["R1d1"]},
{id:"I63",para:63,name:"الفالي",g:"M",father:"I62",mother:"R1d1",spouses:["I63w1"]},
{id:"I64",para:64,name:"محمذن",g:"M",father:"I63",mother:"I63w1",spouses:["I64w1","I70d2","I64w3"]},
{id:"I65",para:65,name:"ديدا (محمد فال)",g:"M",father:"I64",mother:"I64w1",spouses:["I65w1"]},
{id:"I66",para:66,name:"سيد",g:"M",father:"I64",mother:"I70d2",spouses:["F133d1","I100w1","I66w3"]},
{id:"I67",para:67,name:"محمد",g:"M",father:"I66",mother:"I66w3",dates:"…؟… – 1345هـ/1927م",place:"أبير حيبلل",spouses:["I67w1","I67w2"]},
{id:"I68",para:68,name:"أحمد",g:"M",father:"I67",mother:"I67w2",dates:"1343هـ/1925م – 1422هـ/2001م",place:"أبير حيبلل",spouses:["I68w1"]},
{id:"I69",para:69,name:"محنض",g:"M",father:"I62",mother:"R1d1",spouses:["I69w1","I69w2"]},
{id:"I70",para:70,name:"الفالي",g:"M",father:"I69",mother:"I69w1",spouses:["I70w1"]},
{id:"I71",para:71,name:"الليث",g:"M",father:"I69",mother:"I69w1",spouses:["I71w1"]},
{id:"I72",para:72,name:"عميّا",g:"M",father:"I1",mother:"I1w1",spouses:["I72w1","D38d1"]},
{id:"I73",para:73,name:"الفالي",g:"M",father:"I72",mother:"I72w1",spouses:["I73w1"]},
{id:"I74",para:74,name:"حباب",g:"M",father:"I73",mother:"I73w1",spouses:["I74w1"]},
{id:"I75",para:75,name:"أحمد",g:"M",father:"I74",mother:"I74w1",spouses:["I75w1"]},
{id:"I76",para:76,name:"البشير",g:"M",father:"I75",mother:"I75w1",spouses:["I76w1"]},
{id:"I77",para:77,name:"سيد",g:"M",father:"I76",mother:"I76w1",dates:"1339هـ/1921م – 1420هـ/1999م",place:"صالحين سعيد",spouses:["I77w1","I77w2"]},
{id:"I79",para:79,name:"شيبة",g:"M",father:"I73",mother:"I73w1",spouses:["I79w1"]},
{id:"I80",para:80,name:"محمد",g:"M",father:"I79",mother:"I79w1",dates:"…؟… – 1309هـ/1892م",spouses:["I80w1","I80w2"]},
{id:"I81",para:81,name:"ددايل (محمذن اليدالي)",g:"M",father:"I80",mother:"I80w1",dates:"…؟… – 1351هـ/1932م",place:"صالحين المصران",spouses:["I81w1","I81w2"]},
{id:"I82",para:82,name:"هايل (سيد الفالي)",g:"M",father:"I81",mother:"I81w2",dates:"1335هـ/1917م – 1425هـ/2004م",place:"احسي السعاده",spouses:["I82w1"]},
{id:"I85",para:85,name:"الكوري",g:"M",father:"I80",mother:"I80w2",dates:"…؟… – 1341هـ/1923م",spouses:["I85w1"]},
{id:"I85w1",name:"زوجة",g:"F",father:"K133",mother:"K133w1",note:"بنت مولود بن محمذن بن سيد الفالي بن بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",spouses:["I85"],crossLink:true},
{id:"I86",para:86,name:"اباه",g:"M",father:"I85",mother:"I85w1",dates:"1333هـ/1915م – 1428هـ/2007م",place:"أبير حيبلل",spouses:["I86w1"]},
{id:"I90",para:90,name:"الأمين",g:"M",father:"I80",mother:"I80w2",dates:"…؟… – 1358هـ/1939م",spouses:["I90w1"]},
{id:"I91",para:91,name:"ميلود",g:"M",father:"I79",mother:"I79w1",spouses:["I91w1"],note:"المذكور بالفقرة 92 (ميلود بن شيبة)"},
{id:"I92",para:92,name:"أحمد",g:"M",father:"I91",mother:"I91w1",spouses:["I92w1"]},
{id:"I93",para:93,name:"محمذن",g:"M",father:"I72",mother:"I72w1",spouses:["I93w1"]},
{id:"I94",para:94,name:"العود (أحمد)",g:"M",father:"I93",mother:"I93w1",spouses:["I64d3","I94w2"]},
{id:"I95",para:95,name:"محمذن حبيب",g:"M",father:"I94",mother:"I64d3",place:"تن محمد",spouses:["I5d1"]},
{id:"I96",para:96,name:"هايل (سيد الفالي)",g:"M",father:"I95",mother:"I5d1",dates:"…؟… – 1339هـ/1921م",place:"أبير حيبلل",spouses:["I96w1","I96w2","I81d1"]},
{id:"I97",para:97,name:"محمد",g:"M",father:"I96",mother:"I96w2",dates:"1320هـ/1902م – 1395هـ/1975م",place:"أبير حيبلل",spouses:["I97w1"]},
{id:"I100",para:100,name:"اسمو",g:"M",father:"I94",mother:"I94w2",spouses:["I100w1","I100w2"]},
{id:"I101",para:101,name:"لسياد",g:"M",father:"I100",mother:"I100w2",spouses:["I101w1"]},
{id:"F1",para:1,name:"اما (الماقور)",g:"M",father:"T0-fali",mother:"Y1d6" ,spouses:["F1w1"]},
{id:"F2",para:2,name:"العاذل",g:"M",father:"F1",mother:"F1w1" ,spouses:["I72d2"]},
{id:"F3",para:3,name:"لحويج",g:"M",father:"F2",mother:"I72d2",spouses:["F3w1"]},
{id:"F3w1",name:"زوجة",g:"F",father:"K152",mother:"K152w1",note:"بنت محمد اغربظ بن محمد الكريم — رابط بين الأسرتين",spouses:["F3"],crossLink:true},
{id:"F4",para:4,name:"محمذن",g:"M",father:"F3",mother:"F3w1" ,spouses:["F4w1"]},
{id:"F5",para:5,name:"حمم",g:"M",father:"F4",mother:"F4w1" ,spouses:["F5w1"]},
{id:"F6",para:6,name:"أحمد الداه",g:"M",father:"F5",mother:"F5w1" ,spouses:["F6w1"]},
{id:"F7",para:7,name:"أحمد",g:"M",father:"F6",mother:"F6w1",dates:"1345هـ/1927م – 1423هـ/2002م",place:"أبير حيبلل",spouses:["F7w1"]},
{id:"F7w1",name:"اكرامه",g:"F",father:"F125",note:"بنت الخليفه بن الأمين بن بيبات بن حمم بن المبارك بن اما (الماقور) — زواج داخلي بالأسرة؛ أم بنيت أحمد بن أحمد الداه بن حمم بن محمذن بن حلويج بن العاذل بن اما — انظر F7w1",dates:"1357هـ/1938م –",spouses:["F7"],mother:"Z15w1"},
{id:"F7d1",name:"عائشة",g:"F",father:"F7",mother:"F7w1",dates:"1384هـ/1965م –",note:"أم أبناء محمدن بن محمد بن اَّمم (محمذن) بن اگي (الكوري) بن ايبَّا (أحمذ) بن محمذن بن الأمين بن الفالي بن متيلي",spouses:["M35"]},
{id:"F8",para:8,name:"محمد علي",g:"M",father:"F5",mother:"F5w1" ,spouses:["F8w1"]},
{id:"F9",para:9,name:"المبارك",g:"M",father:"F1",mother:"F1w1" ,spouses:["F9w2"]},
{id:"F11",para:11,name:"المختار سعيد",g:"M",father:"F10",mother:"F10w1" ,spouses:["F11w1"]},
{id:"F12",para:12,name:"الحسن",g:"M",father:"F11",mother:"F11w1" ,spouses:["R49d1","F12w2"]},
{id:"F13",para:13,name:"سيد",g:"M",father:"F12" ,spouses:["F13w1"]},
{id:"F14",para:14,name:"حامت",g:"M",father:"F12" ,spouses:["F14w1"]},
{id:"F16",para:16,name:"الحسين",g:"M",father:"F11",mother:"F11w1" ,spouses:["K3d2"]},
{id:"F17",para:17,name:"محمذن",g:"M",father:"F16",mother:"K3d2" ,spouses:["F17w1"]},
{id:"F18",para:18,name:"الكوري",g:"M",father:"F11",mother:"F11w1" ,spouses:["F18w1","F18w2"]},
{id:"F19",para:19,name:"أحمدناه",g:"M",father:"F18",mother:"F18w1" ,spouses:["F19w1"]},
{id:"F20",para:20,name:"محمذن",g:"M",father:"F11",mother:"F11w1" ,spouses:["E3d3","K3d1"]},
{id:"F21",para:21,name:"ببكر",g:"M",father:"F20",mother:"E3d3" ,spouses:["F21w1"]},
{id:"F23",para:23,name:"محمد",g:"M",father:"F22",mother:"K154d1" ,spouses:["F23w1"]},
{id:"F24",para:24,name:"أحمد عمر",g:"M",father:"F23",mother:"F23w1" ,spouses:["F24w1"]},
{id:"F26",para:26,name:"ملاّت (محمذنات)",g:"M",father:"F23",mother:"F23w1" ,spouses:["F26w1"]},
{id:"F29",para:29,name:"عبد الله",g:"M",father:"F23",mother:"F23w1"},
{id:"F30",para:30,name:"الفالي",g:"M",father:"F9",mother:"F9w2" ,spouses:["F30w1","F30w2","F30w3"],place:"آشكركط"},
{id:"F31",para:31,name:"أحمد فال",g:"M",father:"F30",mother:"F30w1" ,spouses:["F31w1"]},
{id:"F32",para:32,name:"الكوري",g:"M",father:"F31",mother:"F31w1" ,spouses:["F32w1"]},
{id:"F33",para:33,name:"محمذن",g:"M",father:"F32",mother:"F32w1" ,spouses:["Y109d4"]},
{id:"F34",para:34,name:"عبد الله",g:"M",father:"F33",mother:"Y109d4" ,spouses:["F34w1"]},
{id:"F36",para:36,name:"محمذن",g:"M",father:"F31",mother:"F31w1",spouses:["K64d2","F36w2"]},
{id:"F42",para:42,name:"المختار",g:"M",father:"F31",mother:"F31w1" ,spouses:["F42w1"]},
{id:"F88",para:88,name:"محمد",g:"M",father:"F81",mother:"F81w1"},
{id:"F136",para:136,name:"الأمين",g:"M",father:"F1",mother:"F1w1" ,spouses:["F136w1"]},
{id:"F1w1",name:"آمچّه (آچمه)",g:"F",father:"I1",mother:"I1w1",note:"بنت ابراهيم بن الكوري — رابط بين الأسرتين",spouses:["F1"],crossLink:true},
{id:"F1d1",name:"امنيانه",g:"F",father:"F1",mother:"F1w1",note:"أم أواه (حمم سعيد) وميمونو الهلالية وصفيو وآمنة من أبناء محمد اليدالي بن المختار بن حمم سعيد",spouses:["XA495"]},
{id:"F2d1",name:"فاطمه فال",g:"F",father:"F2",mother:"I72d2",note:"أم أبناء الخلف"},
{id:"F4w1",name:"حدجه (خديجة)",g:"F",father:"P51",mother:"I25d1",note:"أم أبناء محمذن بن لحويج بن العاذل بن اما (الماقور) — رابط بين الأسرتين",spouses:["F4"]},
{id:"F5w1",name:"عشات",g:"F",father:"F18",mother:"F18w2",note:"بنت الكوري بن المختار سعيد بن بزيد بن المبارك بن اما — زواج داخلي بالأسرة",spouses:["F5"]},
{id:"F5d1",name:"امنّاه (أم النبي)",g:"F",father:"F5",mother:"F5w1",place:"أبير حيبلل"},
{id:"F5d2",name:"خيت",g:"F",father:"F5",mother:"F5w1"},
{id:"F5d3",name:"مريم",g:"F",father:"F5",mother:"F5w1",place:"أبير حيبلل"},
{id:"F6w1",name:"البتول",g:"F",father:"F93",mother:"F93w1",note:"زواج داخلي محتمل بالأسرة",dates:"1315هـ/1898م – 1346هـ/1928م",place:"الجراريو" ,spouses:["F6"]},
{id:"F6s1",name:"سيد محمد",g:"M",father:"F6",mother:"F6w1",dates:"1377هـ/1958م –",place:"كيص (سنغال)",note:"لم يعقب"},
{id:"F8w1",name:"فاطمتين",g:"F",father:"Z85",mother:"Z85w1",note:"بنت بييين بن أحميّد بن المزضف بن الأمين بن اشفغ مينحنو — رابط بين الأسرتين",spouses:["F8"],crossLink:true},
{id:"F8s1",name:"محمذن",g:"M",father:"F8",mother:"F8w1",note:"لم يعقب"},
{id:"F8d1",name:"مريم",g:"F",father:"F8",mother:"F8w1",place:"أبير حيبلل",note:"لم تعقب"},
{id:"F9w1",name:"أم الخيري",g:"F",father:"D43",mother:"D43w1",note:"زواج داخلي محتمل — رابط بأسرة عبد الله (شقيق سيد الفالي)",fullName:"أم الخيري بنت محمذن بن حمم (محنض) بن المختار (ينصر) بن احموذيلل بن سيد (المختار) بن عبد الله"},
{id:"F9d1",name:"خديجة",g:"F",father:"F9",mother:"F9w2",note:"لم تعقب"},
{id:"F9d2",name:"فلانة",g:"F",father:"F9",mother:"F9w2",note:"أم مريم من أبناء السمهودي بن حمم بن اما (الماقور)",spouses:["F135"]},
{id:"F9w2",name:"ميدومه (اَّمن)",g:"F",father:"Z3",mother:"Z3w1",note:"بنت خيلوم (خير الأنام) بن محمد بن المزضف — رابط بين الأسرتين",spouses:["F9"],crossLink:true},
{id:"F10",para:10,name:"بزيد",g:"M",father:"F9",mother:"F9w2" ,spouses:["F10w1"]},
{id:"F9d3",name:"عائشة",g:"F",father:"F9",mother:"F9w2"},
{id:"F10w1",name:"اخدجيه الباطيو -أولاد عايد-",g:"F",father:null,spouses:["F10"]},
{id:"F10d1",name:"عائشة",g:"F",father:"F10",mother:"F10w1",note:"أم أم الحسن بنت ذلويدي بن قاظينا -أدوعلي-"},
{id:"F11w1",name:"عايشا",g:"F",father:"K85",mother:"K85w1",note:"بنت بنيوك (محمذن) بن المختار بن محمد الكريم — رابط بين الأسرتين",spouses:["F11"],crossLink:true},
{id:"F12w2",name:"مريم باخنا",g:"F",father:"I64",spouses:["F12"],mother:"I70d2",note:"أم مغنم من أبناء الحسن بن المختار سعيد بن بزيد بن المبارك بن اما (الماقور)؛ أم محمد واحمد سالم ابني الأمين بن ياحممذ بن باباحنيد بن احمد زروق"},
{id:"F12d1",name:"مغنم",g:"F",father:"F12",mother:"F12w2",note:"أم عايشا بنت كييّه بن محمذن بن الفالي بن المبارك بن اما (الماقور)؛ زواج داخلي بالأسرة",fullName:"مغنم بنت الحسن بن المختار سعيد بن المبارك بن اما (الماقور)",spouses:["F103"]},
{id:"F13w1",name:"مريم",g:"F",father:"V5",mother:"V5w1",note:"بنت سيد الفالي بن عبد الله بن باهنين — رابط بالمصاهرة",spouses:["F13"],crossLink:true,place:"تنيخلف"},
{id:"F13w2",name:"صفيه",g:"F",father:"I100",note:"زواج داخلي محتمل",crossLink:true},
{id:"F14w1",name:"فاطمه فال",g:"F",father:"V5",mother:"V5w1",note:"بنت سيد الفالي بن عبد الله بن باهنين — رابط بالمصاهرة",spouses:["F14"],crossLink:true,place:"أبير حيبلل"},
{id:"F15",para:15,name:"محيين",g:"M",father:"F14",mother:"F14w1",dates:"1333هـ/1915م –",place:"أبير حيبلل",spouses:["F15w1"]},
{id:"F15w1",name:"البتول",g:"F",father:"S3",mother:"K41w1",spouses:["F15"],crossLink:true,fullName:"البتول بنت أحمد سالم بن الشيخ بن سيد محمد",note:"أم سيد احمد بن حميين بن حاتم بن الحسن بن المختار سعيد بن بزيد بن المبارك بن اما (الماقور) — لم يعقب"},
{id:"F16d1",name:"الحميراء",g:"F",father:"F16",mother:"K3d2",note:"لم يعقب لابنها"},
{id:"F17w1",name:"عائشة",g:"F",father:"F4",mother:"F4w1",note:"بنت محمذن بن لحويج بن العاذل بن اما — زواج داخلي بالأسرة؛ أم بنيت محمذن بن الحسين بن المختار سعيد بن بزيد بن المبارك بن اما (الماقور)",spouses:["F17"]},
{id:"F17d1",name:"الصغرى",g:"F",father:"F17",mother:"F17w1"},
{id:"F18w1",name:"مريم",g:"F",father:"D46s2s1s2s1s1s1",spouses:["F18"]},
{id:"F18w2",name:"مريم",g:"F",father:"F43",note:"زواج داخلي محتمل بالأسرة" ,spouses:["F18","E4"]},
{id:"F19w1",name:"ايله (بنت خويلد)",g:"F",father:"D43",mother:"D43w1",spouses:["F19"],fullName:"ايله (بنت خويلد) بنت محمذن بن محنض باب بن اعبيد بن أحمد بن المختار بوي بن يعقوب بن باركلل بن يقبنلل"},
{id:"F19d2",name:"عائشة",g:"F",father:"F19",mother:"F19w1"},
{id:"F20d1",name:"فاطمة",g:"F",father:"F20",mother:"K3d1"},
{id:"F22",para:22,name:"مكدر (المختار)",g:"M",father:"F20",mother:"E3d3",spouses:["K154d1"]},
{id:"F21w1",name:"عيشه",g:"F",father:"K12",mother:"K12w1",note:"بنت النحّن (محمذن) بن الفاظل بن أحمد انهكر بن محمد الكريم — رابط بين الأسرتين",spouses:["F21"],crossLink:true},
{id:"F21d1",name:"أم الخيرات",g:"F",father:"F21",mother:"F21w1",note:"لم تعقب"},
{id:"F22d1",name:"اَّمي",g:"F",father:"F22",mother:"K154d1"},
{id:"F23w1",name:"مومين",g:"F",father:"F80",mother:"F80w2",note:"زواج داخلي محتمل بالأسرة",place:"تندكبثينو" ,spouses:["F23"],fullName:"مومين بنت محمذن بن بازيد بن محمذن بن الفالي بن المبارك بن اما (الماقور)"},
{id:"F23s1",name:"محمدان",g:"M",father:"F23",mother:"F23w1",dates:"1344هـ/1926م –"},
{id:"F23d2",name:"امريامي (مريم)",g:"F",father:"F23",mother:"F23w1",dates:"1351هـ/1932م –"},
{id:"F24w1",name:"مريم",g:"F",father:"XA387",dates:"1348هـ/1930م – 1426هـ/2005م",place:"أبير حيبلل",spouses:["F24"],ext:true},
{id:"F26w1",name:"فاطمة",g:"F",father:"XA1278",spouses:["F26"],ext:true},
{id:"F27",para:27,name:"ابّد (محمدّ)",g:"M",father:"F26",mother:"F26w1",dates:"1377هـ/1958م –",spouses:["F27w1"]},
{id:"F26d1",name:"خديجة",g:"F",father:"F26",mother:"F26w1",dates:"1373هـ/1954م – 1423هـ/2002م",place:"أبير حيبلل",fullName:"خدجية بنت اَّلات (محمذنات) بن محمد بن مكدر (المختار) بن المختار سعيد بن بزيد بن المبارك",note:"زواج داخلي بالأسرة",spouses:["F99"]},
{id:"F26s1",name:"سيد",g:"M",father:"F26",mother:"F26w1",dates:"1384هـ/1965م – 1404هـ/1984م",note:"لم يعقب"},
{id:"F28",para:28,name:"أحمد عمر",g:"M",father:"F26",mother:"F26w1",dates:"1388هـ/1968م –",spouses:["F28w1"]},
{id:"F27w1",name:"آمنة",g:"F",father:"J6",note:"رابط بين الأسرتين",dates:"1386هـ/1966م –",spouses:["F27"],crossLink:true,fullName:"آمنة بنت محمد فال بن أحمد سالم بن أحمد بن محمد فال بن ابن غازي بن آجل (الفالي)",mother:"J6w1"},
{id:"F28w1",name:"انّانّه",g:"F",father:"F77",mother:"F77w1",note:"زواج داخلي محتمل بالأسرة",dates:"1395هـ/1975م –" ,spouses:["F28"]},
{id:"F30w1",name:"أم الكرام",g:"F",father:"XA734",spouses:["F30"],ext:true},
{id:"F30d1",name:"مريم الصغرى",g:"F",father:"F30",mother:"F30w1",note:"أم أبناء محنض بن محمذن بن متيلي بن أحمد بن الحسن دوبك"},
{id:"F30w2",name:"عيشه",g:"F",father:"XA657",spouses:["F30"],ext:true},
{id:"F30w3",name:"فلانة",g:"F",father:"XA739",spouses:["F30"],ext:true},
{id:"F30d2",name:"امنيانه",g:"F",father:"F30",mother:"F30w3",note:"أم أبناء محمذن بن الخلف"},
{id:"F31w1",name:"صفيه",g:"F",father:"XA1236",spouses:["F31"],fullName:"صفيه بنت عبد الله بن أحمد بن حبلل بن الكريم بن أحمد شلل (بوميجو) بن يقبنلل",ext:true},
{id:"F32w1",name:"صفيه",g:"F",father:"D67",spouses:["F32"],mother:"D67w1",note:"أم أبناء الكوري بن احمد فال بن الفالي بن المبارك بن اما (الماقور)"},
{id:"F32d2",name:"فاطمة السالمه",g:"F",father:"F32",mother:"F32w1",note:"قد تكون زواجًا داخليًا",spouses:["M45","F107"]},
{id:"F34w1",name:"النون",g:"F",father:"F105",mother:"F105w1",note:"بنت عبد الله بن محمد بن كييّه (الكوري) بن محمذن بن الفالي بن المبارك بن اما — زواج داخلي بالأسرة",dates:"1371هـ/1952م – 1424هـ/2003م",place:"بئر حبلل" ,spouses:["F34"]},
{id:"F37",para:37,name:"بدّاه (أحمدّ)",g:"M",father:"F36",mother:"K64d2",dates:"1394هـ/1974م –",place:"أبير حيبلل",spouses:["F37w1","M56d1"]},
{id:"F36w2",name:"فاطمة",g:"F",father:"I73",note:"رابط بين الأسرتين؛ أم محنض من أبناء محمذن بن احمد فال بن الفالي بن المبارك بن اما (الماقور)",crossLink:true,spouses:["F36"],mother:"I73w1"},
{id:"F36s1",name:"محنض",g:"M",father:"F36",mother:"F36w2",dates:"1332هـ/1914م –",note:"لم يعقب"},
{id:"F37w1",name:"عيشه",g:"F",father:"F93",mother:"F93w1",note:"زواج داخلي بالأسرة",dates:"1412هـ/1992م? – 1896",place:"أبير حيبلل" ,spouses:["F37"]},
{id:"F38",para:38,name:"محمد",g:"M",father:"F37",mother:"F37w1",dates:"1341هـ/1923م –",spouses:["F38w1"]},
{id:"F37d3",name:"الناه",g:"F",father:"F37",mother:"M56d1",dates:"1354هـ/1936م – 1379هـ/1960م",note:"لم تعقب"},
{id:"F38w1",name:"اَّمه",g:"F",father:"Z23",mother:"K105d1",note:"بنت المختار بن بكن (أبوبكر) بن اَّمّن (محمذن) بن بوبكر بن حمم بن أبو الحس — رابط بين الأسرتين (corrigé : rattachée à Z23, pas Z22 directement)؛ أم أبناء محمد بن بداه (أحمد) بن محمذن بن أحمد فال بن الفالي بن المبارك بن اما (الماقور)",dates:"1351هـ/1932م – 1428هـ/2007م",place:"تنيخلف",spouses:["F38"],crossLink:true},
{id:"F39",para:39,name:"دّب (أحمد)",g:"M",father:"F38",mother:"F38w1",dates:"1372هـ/1953م –",spouses:["F39w1"]},
{id:"F40",para:40,name:"النعمان (محمذن)",g:"M",father:"F38",mother:"F38w1",dates:"1378هـ/1959م –",spouses:["F40w1"]},
{id:"F41",para:41,name:"آدّن (المختار)",g:"M",father:"F38",mother:"F38w1",dates:"1384هـ/1965م –",spouses:["F41w1"]},
{id:"F39w1",name:"آمنة",g:"F",father:"J7",mother:"J7w1",note:"رابط بين الأسرتين",dates:"1384هـ/1964م –",spouses:["F39"],crossLink:true,fullName:"آمنة بنت محمدن بن أحمد سالم بن أحمد بن محمد فال بن ابن غازي بن آجل (الفالي)"},
{id:"F40w1",name:"دّدانه (مرجانه)",g:"F",father:"G75",dates:"1396هـ/1976م –",spouses:["F40"]},
{id:"F41w1",name:"عائشة",g:"F",father:"Y64",dates:"1406هـ/1986م –",spouses:["F41"],mother:"I29d3",note:"أم بنيت آدن (المختار) بن محمد بن بداه (أحمد) بن محمذن بن أحمد فال بن الفالي بن المبارك بن اما (الماقور)"},
{id:"F42w1",name:"عيشه فال",g:"F",father:"D85",spouses:["F42"],mother:"D85w2",note:"أم أبناء المختار بن احمد فال بن الفالي بن المبارك بن اما (الماقور)"},
{id:"F42d2",name:"صفيه",g:"F",father:"F42",mother:"F42w1",place:"محجوبو",note:"لم تعقب"},
{id:"F43w1",name:"بنت وهب",g:"F",father:"M23",mother:"F136d1",note:"رابط بين الأسرتين؛ أم دياه (سيد الفالي) بن محمذن بن الفالي بن المبارك",crossLink:true,spouses:["F43"]},
{id:"F44",para:44,name:"دياّه (سيد الفالي)",g:"M",father:"F43",mother:"F43w1",spouses:["F44w1","F44w2","Z149w1"]},
{id:"F43w2",name:"عيشه",g:"F",father:"XA746",spouses:["F43"],ext:true},
{id:"F79",para:79,name:"بازيد",g:"M",father:"F43",mother:"F43w2",dates:"1280هـ/1864م –",place:"تنيخلف",spouses:["F79w1","F79w2","F79w3","F79w4","K4d5"]},
{id:"F43w3",name:"فلانة",g:"F",father:"XA747",spouses:["F43"],ext:true},
{id:"F103",para:103,name:"كييّه (الكوري)",g:"M",father:"F43",mother:"F43w3" ,spouses:["F103w1","F12d1"]},
{id:"F44w1",name:"اَّمن",g:"F",father:"XA751",spouses:["F44"],ext:true},
{id:"F45",para:45,name:"المختار",g:"M",father:"F44",mother:"F44w1",dates:"1277هـ/1861م – 1347هـ/1929م",spouses:["F45w1","F45w2","R39w2"]},
{id:"F44w2",name:"عائشة",g:"F",father:"F31",mother:"F31w1",note:"زواج داخلي بالأسرة؛ أم محنض باب من أبناء دياّه (سيد الفالي) بن محمذن بن الفالي بن المبارك بن اما (الماقور)" ,spouses:["F44"]},
{id:"F48",para:48,name:"محنض باب",g:"M",father:"F44",mother:"F44w2",dates:"1361هـ/1942م –",spouses:["F48w1","M9d1"]},
{id:"F49",para:49,name:"ايّاي (أحمد)",g:"M",father:"F44",mother:"Z149w1",dates:"1328هـ/1910م –",place:"أبير حيبلل",spouses:["F49w1"]},
{id:"F45w1",name:"محجوبه",g:"F",father:"XA503",spouses:["F45"],ext:true},
{id:"F45d1",name:"فاطمتون",g:"F",father:"F45",mother:"F45w1"},
{id:"F45w2",name:"مريم",g:"F",father:"XA1285",spouses:["F45"],ext:true},
{id:"F46",para:46,name:"العتيق السالم",g:"M",father:"F45",mother:"F45w2",dates:"1384هـ/1964م –",place:"تنيخلف",spouses:["F46w1"]},
{id:"F45s1",name:"محمد",g:"M",father:"F45",mother:"F45w2",dates:"1339هـ/1921م –",note:"لم يعقب"},
{id:"F45d2",name:"مريم",g:"F",father:"F45",mother:"R39w2",place:"أبير حيبلل",note:"زواج داخلي بالأسرة",spouses:["F76","F82"]},
{id:"F46w1",name:"عايشا",g:"F",father:"XA1290",spouses:["F46"],ext:true},
{id:"F46s1",name:"المختار السالم",g:"M",father:"F46",mother:"F46w1",dates:"1335هـ/1915م – 1425هـ/2004م",place:"أبير حيبلل",note:"لم يعقب"},
{id:"F47",para:47,name:"محمذن",g:"M",father:"F46",mother:"F46w1",dates:"1344هـ/1926م – 1436هـ/2015م",place:"أبير حيبلل",spouses:["F47w1"]},
{id:"F46d2",name:"خديجة",g:"F",father:"F46",mother:"F46w1",dates:"1359هـ/1940م –"},
{id:"F47w1",name:"خدجية",g:"F",father:"D10",dates:"1368هـ/1949م – 1400هـ/1980م",place:"محجوبو",spouses:["F47"],fullName:"خدجية بنت باب بن اليدالي بن أحمد بن احميميد بن المختار بن القاضي بن احموذيلل بن سيد (المختار) بن عبد الله"},
{id:"F47d1",name:"حلبوس",g:"F",father:"F47",mother:"F47w1",dates:"1397هـ/1977م –",note:"زواج داخلي بالأسرة",spouses:["F25"]},
{id:"F48w1",name:"اخدجيه فال",g:"F",father:"M9",mother:"M9w1",note:"رابط بين الأسرتين",crossLink:true,spouses:["F48"],fullName:"اخدجيه فال بنت أحمد بن المختار بن محمذن بن الغالي وباركلل بن بوالماح بن متيلي (المختار)"},
{id:"F48d2",name:"امروم",g:"F",father:"F48",mother:"F48w1",note:"لم تعقب"},
{id:"F49w1",name:"امنيانه",g:"F",father:"F79",mother:"K4d5",note:"بنت بازيد بن محمذن بن الفالي بن المبارك بن اما (الماقور) — زواج داخلي بالأسرة",dates:"1361هـ/1942م –",place:"تنيخلف" ,spouses:["F49"]},
{id:"F50",para:50,name:"أحمد",g:"M",father:"F49",mother:"F49w1",dates:"1352هـ/1933م –",place:"اركيز",spouses:["P32d1"]},
{id:"F56",para:56,name:"عبد الله",g:"M",father:"F49",mother:"F49w1",place:"تنكجيج (سنغال)"},
{id:"F57",para:57,name:"المبارك",g:"M",father:"F49",mother:"F49w1",dates:"1373هـ/1954م –",place:"انواكور",spouses:["F57w1"]},
{id:"F64",para:64,name:"محمد",g:"M",father:"F49",mother:"F49w1",dates:"1294هـ/1877م – 1371هـ/1952م",place:"انفين",spouses:["F93d1","F64w2","E44d4"]},
{id:"F76",para:76,name:"الموقار",g:"M",father:"F49",mother:"F49w1",dates:"1365هـ/1946م –",place:"تنكجيج (سنغال)" ,spouses:["F45d2"]},
{id:"F51",para:51,name:"أحمد",g:"M",father:"F50",mother:"P32d1",dates:"1348هـ/1930م – 1435هـ/2014م",place:"أبير حيبلل",spouses:["F51w1"]},
{id:"F54",para:54,name:"اَّمين",g:"M",father:"F50",mother:"P32d1",dates:"1348هـ/1930م –",spouses:["P9d0"]},
{id:"F51w1",name:"زينب",g:"F",father:"F58",mother:"D80d1",note:"زواج داخلي محتمل بالأسرة",dates:"1372هـ/1953م –" ,spouses:["F51"]},
{id:"F52",para:52,name:"السالك",g:"M",father:"F51",mother:"F51w1",dates:"1392هـ/1972م –",spouses:["F52w1"]},
{id:"F53",para:53,name:"حدنن (محمدن)",g:"M",father:"F51",mother:"F51w1",dates:"1397هـ/1977م –",spouses:["F53w1"]},
{id:"F51d1",name:"ميّم (مريم)",g:"F",father:"F51",mother:"F51w1",dates:"1401هـ/1981م –"},
{id:"F52w1",name:"زينب",g:"F",father:"F78",spouses:["F52"],ext:true},
{id:"F53w1",name:"اميه",g:"F",father:"Z110",mother:"Z52w2",note:"بنت محمد بن محم بن ممّن (محمذيني) بن سيد بن محمد بن الأمين بن محم بن أبو الحس بن المزضف — رابط بين الأسرتين",spouses:["F53"],crossLink:true},
{id:"F55",para:55,name:"أحمد",g:"M",father:"F54",mother:"P9d0",dates:"1400هـ/1980م –",spouses:["F55w1"]},
{id:"F55w1",name:"مينه",g:"F",father:"Y90",dates:"1415هـ/1995م –",spouses:["F55"]},
{id:"F56w1",name:"السالمه",g:"F",father:"F102",mother:"F102w1",note:"بنت محمد فال بن بازيد بن محمذن بن الفالي بن المبارك بن اما (الماقور) — زواج داخلي بالأسرة (corrigé : rattachée à F102, pas F79 directement)",dates:"1321هـ/1903م – 1396هـ/1976م",place:"أبير حيبلل"},
{id:"F57w1",name:"الشالّه (الزهراء)",g:"F",father:"F80",note:"بنت محمذن بن بازيد بن محمذن بن الفالي بن المبارك بن اما (الماقور) — زواج داخلي بالأسرة (corrigé : rattachée à F80, pas F79 directement)",dates:"1315هـ/1898م – 1404هـ/1984م",place:"أبير حيبلل" ,spouses:["F57"]},
{id:"F58",para:58,name:"محمدن",g:"M",father:"F57",mother:"F57w1",dates:"1341هـ/1923م – 1384هـ/1964م",place:"تنيخلف",spouses:["D80d1"]},
{id:"F61",para:61,name:"محمد فال",g:"M",father:"F57",mother:"F57w1",dates:"1353هـ/1934م –",spouses:["I23d1"]},
{id:"F78",para:78,name:"التجاني",g:"M",father:null,note:"بن الصالح بن حمم بن المختار باب... — position exacte à confirmer en partie 2",tribe:"الشرفو"},
{id:"F59",para:59,name:"لمرابط",g:"M",father:"F58",mother:"D80d1",dates:"1376هـ/1957م –",spouses:["F59w1"]},
{id:"F60",para:60,name:"عبد الله",g:"M",father:"F58",mother:"D80d1",dates:"1381هـ/1962م –",spouses:["F60w1"]},
{id:"F59w1",name:"مريم",g:"F",father:"F26",mother:"F26w1",note:"زواج داخلي بالأسرة",dates:"1390هـ/1970م –" ,spouses:["F59"],fullName:"مريم بنت الّالت (محمذنات) بن محمد بن مكدر (المختار) بن محمذن بن المختار سعيد بن بزيد بن المبارك"},
{id:"F60w1",name:"امنيانه",g:"F",father:"Y78",spouses:["F60"]},
{id:"F62",para:62,name:"امبارك (محمد المصطفى)",g:"M",father:"F61",mother:"I23d1",dates:"1391هـ/1971م –",spouses:["F62w1"]},
{id:"F63",para:63,name:"يحي",g:"M",father:"F61",mother:"I23d1",dates:"1398هـ/1978م –",spouses:["F63w1"]},
{id:"F61d1",name:"افات",g:"F",father:"F61",mother:"I23d1",dates:"1401هـ/1981م –"},
{id:"F61s1",name:"عبد",g:"M",father:"F61",mother:"I23d1",dates:"1407هـ/1987م –"},
{id:"F62w1",name:"كريمه",g:"F",father:"J8",mother:"J8w1",note:"رابط بين الأسرتين محتمل",dates:"1406هـ/1986م –",crossLink:true,spouses:["F62"],fullName:"كريمه بنت أحمد بن محمدن بن أحمد سالم بن أحمد بن محمد فال بن ابن غازي بن آجل (الفالي)"},
{id:"F63w1",name:"هدى",g:"F",father:"Y90",dates:"1406هـ/1986م –",spouses:["F63"]},
{id:"F65",para:65,name:"سيد أحمد",g:"M",father:"F64",mother:"F93d1",dates:"1330هـ/1912م – 1424هـ/2003م",place:"دليلحو",spouses:["F65w1"]},
{id:"F64d1",name:"خديجة",g:"F",father:"F64",mother:"F93d1",place:"أبير حيبلل",note:"لم تعقب"},
{id:"F64w2",name:"لَـم",g:"F",father:"E44",dates:"1409هـ/1989م –",place:"تنبيعلي",spouses:["F64"] ,note:"⚠️ تاريخ الميلاد في المصدر الأصلي يتعارض مع وفاة الزوج — قد يكون خطأ OCR في الوثيقة الأصلية"},
{id:"F72",para:72,name:"اكاه (ببكر)",g:"M",father:"F64",mother:"F64w2",dates:"1354هـ/1935م –",spouses:["F72w1"]},
{id:"F65w1",name:"دود (فاطمة)",g:"F",father:"Z74",mother:"Z74w4",note:"بنت مام (محمد) بن أحمد بن ابن عبدم بن عبد الله بن الأمين بن حمم بن أبو الحس بن المزضف — رابط بين الأسرتين",dates:"1347هـ/1929م –",spouses:["F65"],crossLink:true},
{id:"F66",para:66,name:"محمد المصطفى",g:"M",father:"F65",mother:"F65w1",dates:"1364هـ/1945م –",spouses:["P12d2"]},
{id:"F68",para:68,name:"أحمد",g:"M",father:"F65",mother:"F65w1",dates:"1367هـ/1948م –",spouses:["P13d1"]},
{id:"F70",para:70,name:"الشيخ",g:"M",father:"F65",mother:"F65w1",dates:"1374هـ/1955م –",spouses:["F70w1"]},
{id:"F71",para:71,name:"اباه (محمد فال)",g:"M",father:"F65",mother:"F65w1",dates:"1384هـ/1965م –",spouses:["F71w1"]},
{id:"F66d1",name:"الغاليه",g:"F",father:"F66",mother:"P12d2",dates:"1397هـ/1977م –"},
{id:"F67",para:67,name:"المختار",g:"M",father:"F66",mother:"P12d2",dates:"1400هـ/1980م –",spouses:["F67w1"]},
{id:"F67w1",name:"اديده (أم الخيري)",g:"F",father:"Z155",mother:"Z155w1",note:"بنت عبد الله بن دمّين (سيد الأمين) بن آياه (بوبكر) بن أحمد بن الأمين بن حمم بن أبو الحس بن المزضف — رابط بين الأسرتين؛ أم سيد محمد بن المختار بن محمد المصطفى بن سيد أحمد بن محمد بن اياي (أحمد) بن دياه (سيد الفالي) بن محمذن",dates:"1404هـ/1984م –",spouses:["F67"],crossLink:true},
{id:"F69",para:69,name:"محمد",g:"M",father:"F68",mother:"P13d1",dates:"1400هـ/1980م –",spouses:["F69w1"]},
{id:"F68d3",name:"عائشة",g:"F",father:"F68",mother:"P13d1",dates:"1409هـ/1989م –"},
{id:"F68d4",name:"تمنّه",g:"F",father:"F68",mother:"P13d1",dates:"1412هـ/1992م –"},
{id:"F69w1",name:"باكه (امباركه)",g:"F",father:"Z17",mother:"Z17w1",note:"بنت النح (محمد عبد الرحمن) بن محمد سالم بن أحمد الأمين بن محمد فال بن اخميطرات بن محمود الله بن أبو الحس بن المزضف — رابط بين الأسرتين",dates:"1411هـ/1990م –",spouses:["F69"],crossLink:true},
{id:"F70w1",name:"حمّيينه (فاطمة)",g:"F",father:"J6",mother:"J6w1",note:"بنت محمد فال بن أحمد سالم بن أحمد بن محمد فال بن ابن غازي بن آجل (الفالي) — رابط بين الأسرتين",dates:"1384هـ/1964م –",spouses:["F70"],crossLink:true},
{id:"F70d1",name:"اميه (مريم)",g:"F",father:"F70",mother:"F70w1",dates:"1409هـ/1989م –"},
{id:"F70s1",name:"سعدون",g:"M",father:"F70",mother:"F70w1",dates:"1411هـ/1991م –"},
{id:"F70s2",name:"محمد فال",g:"M",father:"F70",mother:"F70w1",dates:"1413هـ/1993م –"},
{id:"F70d2",name:"الغاليه",g:"F",father:"F70",mother:"F70w1",dates:"1421هـ/2000م –"},
{id:"F70d3",name:"باكه (امباركه)",g:"F",father:"F70",mother:"F70w1",dates:"1423هـ/2002م –"},
{id:"F71w1",name:"فاطمة",g:"F",father:"Z29",mother:"R27d1",note:"بنت لمرابط بن محمدن بن محمد فال بن اَّمن (محمذن) بن بوبكر بن أبو الحس بن المزضف — رابط بين الأسرتين",dates:"1399هـ/1979م –",spouses:["F71"],crossLink:true},
{id:"F72w1",name:"مريم",g:"F",father:"Z101",mother:"Z101w1",note:"بنت اَّمّن (الأمين) بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف — رابط بين الأسرتين",dates:"1365هـ/1946م –",spouses:["F72"],crossLink:true},
{id:"F73",para:73,name:"محمدن",g:"M",father:"F72",mother:"F72w1",dates:"1388هـ/1968م –",spouses:["F73w1"]},
{id:"F74",para:74,name:"الطبيب (محمد)",g:"M",father:"F72",mother:"F72w1",dates:"1390هـ/1970م –",spouses:["K35d1"]},
{id:"F72d1",name:"اندي (أم الخيرات)",g:"F",father:"F72",mother:"F72w1",dates:"1393هـ/1973م –" ,spouses:["Z133"] ,crossLink:true},
{id:"F72d2",name:"ففّه",g:"F",father:"F72",mother:"F72w1",dates:"1395هـ/1975م –",spouses:["M48"]},
{id:"F75",para:75,name:"عبد الله",g:"M",father:"F72",mother:"F72w1",dates:"1399هـ/1979م –",spouses:["K117d3"]},
{id:"F72s1",name:"محمد فال",g:"M",father:"F72",mother:"F72w1",dates:"1410هـ/1990م –"},
{id:"F73w1",name:"فضيله",g:"F",father:"F68",mother:"P13d1",note:"زواج داخلي بالأسرة",dates:"1402هـ/1982م –" ,spouses:["F73"]},
{id:"F73d1",name:"مريم",g:"F",father:"F73",mother:"F73w1",dates:"1425هـ/2004م –"},
{id:"F73d2",name:"عيشه",g:"F",father:"F73",mother:"F73w1",dates:"1430هـ/2009م –"},
{id:"F77",para:77,name:"المختار",g:"M",father:"F76",mother:"F45d2",dates:"1364هـ/1945م – 1427هـ/2006م",place:"أبير حيبلل",spouses:["F77w1"]},
{id:"F77w1",name:"مومين",g:"F",father:"F116",note:"زواج داخلي بالأسرة",dates:"1371هـ/1952م –" ,spouses:["F77"],fullName:"مومين بنت محمدن بن ببكر بن اتّاه (المختار) بن بيبات بن حمم بن المبارك بن اما (الماقور)",mother:"F116w2"},
{id:"F78x",name:"عبد الله",g:"M",father:"F77",mother:"F77w1",dates:"1400هـ/1980م –"},
{id:"F79w1",name:"أم المؤمنين",g:"F",father:"XA754",spouses:["F79"],ext:true},
{id:"F79d1",name:"امباركه",g:"F",father:"F79",mother:"F79w1",note:"لم تعقب"},
{id:"F79w2",name:"مريم",g:"F",father:"K3",mother:"K3w1",note:"بنت محمذن بن احجاب بن محمد الكريم — رابط بين الأسرتين؛ أم محمذن من أبناء بازيد بن محمذن بن الفالي",spouses:["F79"],crossLink:true},
{id:"F80",para:80,name:"محيين (محمذن)",g:"M",father:"F79",mother:"F79w2",dates:"1239هـ/1823م – 1327هـ/1909م",place:"أبير حيبلل",spouses:["E4d1","F80w2","F80w3"]},
{id:"F79w3",name:"عيشه",g:"F",father:"Y58",spouses:["F79"]},
{id:"F90",para:90,name:"امبب (أحمّد)",g:"M",father:"F79",mother:"F79w3",dates:"1328هـ/1910م –",place:"أبير حيبلل",spouses:["F90w1"]},
{id:"F93",para:93,name:"الكوري (ديد)",g:"M",father:"F79",mother:"F79w3",dates:"1351هـ/1932م –",place:"أبير حيبلل",spouses:["F93w1","F93w3"]},
{id:"F79w4",name:"مريم",g:"F",father:"XA164",spouses:["F79"],ext:true},
{id:"F102",para:102,name:"محمد فال",g:"M",father:"F79",mother:"F79w4",dates:"1325هـ/1907م –",place:"حبلل",spouses:["F102w1"]},
{id:"F81",para:81,name:"أحمد",g:"M",father:"F80",mother:"E4d1",dates:"1347هـ/1929م –",place:"أبير حيبلل",spouses:["F81w1"]},
{id:"F80w2",name:"اخدجيه فال",g:"F",father:"XA761",spouses:["F80"],ext:true},
{id:"F89",para:89,name:"أحمد بزيد",g:"M",father:"F80",mother:"F80w2",dates:"1287هـ/1870م – 1358هـ/1939م",place:"تندوجو",spouses:["F89w1","F89w2"]},
{id:"F80w3",name:"فاطمه",g:"F",father:"F69",mother:"F69w1",spouses:["F80"],fullName:"فاطمه بنت محمد بن أحمد بن سيد أحمد بن سريه بن الكوري بن ساسي بن دمان",ext:true},
{id:"F80d2",name:"عيشه",g:"F",father:"F80",mother:"F80w3",note:"أم أبناء المختار ام بن الأمين بن صالحلي بن محمذن بن آبين (محنض بونا)"},
{id:"F81w1",name:"أم النبي",g:"F",father:"Y70s1s1",place:"أبير حيبلل",spouses:["F81"]},
{id:"F82",para:82,name:"محيين (محمذن)",g:"M",father:"F81",mother:"F81w1",dates:"1326هـ/1908م – 1406هـ/1986م",place:"أبير حيبلل",spouses:["F82w1","F45d2","F82w3"]},
{id:"F82w1",name:"تسلم",g:"F",father:"K12",mother:"K12w1",note:"بنت النحّن (محمد فال) بن الفاظل بن أحمد انهكر بن محمد الكريم — رابط بين الأسرتين",spouses:["F82"],crossLink:true},
{id:"F83",para:83,name:"المختار",g:"M",father:"F82",mother:"F82w1",dates:"1368هـ/1949م –",spouses:["F83w1","K144d1"]},
{id:"F82d1",name:"طيما",g:"F",father:"F82",mother:"F45d2",dates:"1370هـ/1951م –"},
{id:"F82w3",name:"مريم",g:"F",father:"F46",mother:"F46w1",note:"زواج داخلي بالأسرة",dates:"1347هـ/1929م – 1431هـ/2010م",place:"أبير حيبلل" ,spouses:["F82"]},
{id:"F85",para:85,name:"محمد المختار",g:"M",father:"F82",mother:"F82w3",dates:"1380هـ/1961م –",spouses:["F85w1"]},
{id:"F86",para:86,name:"أحمد",g:"M",father:"F82",mother:"F82w3",dates:"1384هـ/1964م –",spouses:["L18d4"]},
{id:"F87",para:87,name:"محمد ينجح",g:"M",father:"F82",mother:"F82w3",dates:"1392هـ/1972م –",spouses:["F87w1"]},
{id:"F83w1",name:"عائشة",g:"F",father:"F26",mother:"F26w1",note:"زواج داخلي بالأسرة",dates:"1379هـ/1960م –" ,spouses:["F83","F130"],fullName:"عائشة بنت اَّلات (محمذنات) بن محمد بن مكدر (المختار) بن المختار سعيد بن بزيد بن المبارك بن اما"},
{id:"F84",para:84,name:"أحمد",g:"M",father:"F83",mother:"F83w1",dates:"1397هـ/1977م –",spouses:["F84w1","Z76w1"]},
{id:"F84w1",name:"عائشة",g:"F",father:"XA1299",dates:"1398هـ/1978م –",spouses:["F84"],ext:true},
{id:"F85w1",name:"اطوميه (فاطمة)",g:"F",father:"I56",mother:"I56w2",note:"بنت الأمين بن منح (محنض) — أم بادي بنت محمد المختار بن حمين",dates:"1379هـ/1960م –",spouses:["F85"],crossLink:true},
{id:"F87w1",name:"اشريفه (مريم)",g:"F",father:"Y181",dates:"1404هـ/1984م –",spouses:["F87"],crossLink:true,mother:"Y181w1",note:"أم ابناء محمد ينجح بن حمني بن احمد بن محمذن بن بزيد بن محمذن بن الفالي بن المبارك بن اما (الماقور)"},
{id:"F89w1",name:"مريم",g:"F",father:"F49",mother:"F49w1",note:"زواج داخلي بالأسرة" ,spouses:["F89"]},
{id:"F89w2",name:"ميّم (مريم)",g:"F",father:"F90",mother:"F90w1",note:"زواج داخلي بالأسرة — ⚠️ تاريخ الميلاد في المصدر الأصلي يتعارض مع وفاة الزوج — قد يكون خطأ OCR في الوثيقة الأصلية",dates:"1377هـ/1958م –",place:"تنيخلف" ,spouses:["F89"]},
{id:"F89d2",name:"متّومه (فاطمة)",g:"F",father:"F89",mother:"F89w2",dates:"1328هـ/1910م – 1425هـ/2004م",place:"أبير حيبلل",fullName:"تومه بنت أحمد بزيد بن محمذن بن بازيد بن محمذن بن الفالي بن المبارك بن اما (الماقور)",spouses:["R71"]},
{id:"F90w1",name:"عيشه فال",g:"F",father:"XA165",spouses:["F90"]},
{id:"F91",para:91,name:"أحمد",g:"M",father:"F90",mother:"F90w1",place:"البعلاتيو",note:"تاريخ الميلاد غير مؤكد في المصدر — التاريخ المسجل سابقاً (1398هـ) كان خطأ واضحاً",spouses:["F91w1","F91w2"]},
{id:"F90d1",name:"الزهراء",g:"F",father:"F90",mother:"F90w1",dates:"1311هـ/1894م – 1404هـ/1984م",place:"أحسي السعادة"},
{id:"F90d3",name:"توت (خديجة)",g:"F",father:"F90",mother:"F90w1",dates:"1391هـ/1971م –",place:"أبير حيبلل"},
{id:"F91w1",name:"مغنم",g:"F",father:"I13",mother:"I13w1",note:"بنت أبّوبا (ببكر) بن المختار — même personne que I13d1",dates:"1315هـ/1898م – 1366هـ/1947م",place:"بوغابو",spouses:["F91"],crossLink:true},
{id:"F91d2",name:"اميميت (خدجية)",g:"F",father:"F91",mother:"F91w1",dates:"1343هـ/1925م –",note:"زواج داخلي محتمل بالأسرة"},
{id:"F91w2",name:"ميمهنه",g:"F",father:"XA763",place:"البعلاتيو",spouses:["F91"],ext:true},
{id:"F92",para:92,name:"حوا (محمد)",g:"M",father:"F91",mother:"F91w2",dates:"1365هـ/1946م –",spouses:["F92w1","F92w2","L18d2"]},
{id:"F92w1",name:"محجوبه",g:"F",father:"XA764",spouses:["F92"],ext:true},
{id:"F92w2",name:"أم الخيري",g:"F",father:"XA393",dates:"1384هـ/1964م –",spouses:["F92"],ext:true},
{id:"F93w1",name:"نبغوها",g:"F",father:"XA765",place:"أحسي ولد الخوماني (آوكريه)",spouses:["F93"],ext:true},
{id:"F93d1",name:"مريم",g:"F",father:"F93",mother:"F93w1",dates:"1306هـ/1889م – 1408هـ/1988م",place:"أبير حيبلل",note:"بنت الكوري بن بازيد بن محمذن بن الفالي بن المبارك بن اما (الماقور) — زواج داخلي بالأسرة (corrigé : rattachée à F93, pas F79 directement)",spouses:["K33","F64"]},
{id:"F93w2",name:"بشّا (أحمد سالم) بنت",g:"F",father:null,note:"الاسم غير مكتمل — تحقق لاحق",dates:"1308هـ/1891م – 1414هـ/1994م",place:"أبير حيبلل"},
{id:"F94",para:94,name:"بشّا (أحمد سالم)",g:"M",father:"F93",mother:"F93w1",spouses:["F94w1","R71d2"]},
{id:"F93s1",name:"عبد الله السالم",g:"M",father:"F93",mother:"F93w1",place:"اللوكو (سنغال)",note:"لم يعقب"},
{id:"F93w3",name:"صفيه",g:"F",father:"E44",place:"تنيخلف",spouses:["F93"]},
{id:"F93d4",name:"توت (فاطمة السالمه)",g:"F",father:"F93",mother:"F93w3",dates:"1337هـ/1919م –"},
{id:"F94w1",name:"شوت (عائشة)",g:"F",father:"D68",dates:"1386هـ/1912م – 1966م",place:"أبير حيبلل",spouses:["F94"],mother:"D68w1",note:"أم عبد الله (ولد الحاج) وآسية واحمد من أبناء احمد سالم بن الكوري بن بزيد بن محمذن بن الفالي بن المبارك بن اما (الماقور)"},
{id:"F95",para:95,name:"ولد الحاج (عبد الله)",g:"M",father:"F94",mother:"F94w1",dates:"1347هـ/1929م – 1423هـ/2002م",place:"أبير حيبلل",spouses:["F95w1"]},
{id:"F99",para:99,name:"أحمد",g:"M",father:"F94",mother:"R71d2",dates:"1357هـ/1938م – 1432هـ/2011م",place:"أبير حيبلل",spouses:["F26d1"]},
{id:"F94s1",name:"محمد فال",g:"M",father:"F94",mother:"R71d2",dates:"1388هـ/1968م –"},
{id:"F95w1",name:"امباركه السالكه",g:"F",father:"Z84",mother:"Z84w1",note:"رابط بين الأسرتين محتمل",dates:"1365هـ/1946م –",spouses:["F95"],fullName:"امباركه السالكه بنت محمد بن عمر بن ابن عبدم بن عبد الله بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"F96",para:96,name:"الشيخ أحمد",g:"M",father:"F95",mother:"F95w1",dates:"1387هـ/1967م –",spouses:["F96w1"]},
{id:"F97",para:97,name:"الحسن",g:"M",father:"F95",mother:"F95w1",dates:"1389هـ/1969م –",spouses:["F97w1"]},
{id:"F98",para:98,name:"محمد المختار",g:"M",father:"F95",mother:"F95w1",dates:"1396هـ/1976م –",spouses:["F98w1"]},
{id:"F95s1",name:"اشريف",g:"M",father:"F95",mother:"F95w1",dates:"1402هـ/1982م –"},
{id:"F95s2",name:"معاويه (محمد)",g:"M",father:"F95",mother:"F95w1",dates:"1404هـ/1984م –"},
{id:"F95s3",name:"محمد فال",g:"M",father:"F95",mother:"F95w1",dates:"1409هـ/1989م –"},
{id:"F96w1",name:"مريم",g:"F",father:"F68",mother:"P13d1",note:"زواج داخلي بالأسرة",dates:"1406هـ/1986م –" ,spouses:["F96"]},
{id:"F97w1",name:"أم كلثوم",g:"F",father:"XA767",spouses:["F97"],ext:true},
{id:"F98w1",name:"بديعه",g:"F",father:"Z109",mother:"Z109w1",note:"رابط بين الأسرتين محتمل",dates:"1405هـ/1985م –",spouses:["F98"],fullName:"بديعه بنت محمدن بن حمم بن مّن (محمذين) بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"F100",para:100,name:"الزكي (محمدن)",g:"M",father:"F99",mother:"F26d1",dates:"1400هـ/1980م –",spouses:["F100w1"]},
{id:"F99s1",name:"أحمد",g:"M",father:"F99",mother:"F26d1",dates:"1404هـ/1984م –"},
{id:"F99s2",name:"محمد فال",g:"M",father:"F99",mother:"F26d1",dates:"1407هـ/1987م –"},
{id:"F99d2",name:"عائشة",g:"F",father:"F99",mother:"F26d1",dates:"1411هـ/1991م –"},
{id:"F100w1",name:"فاطمة",g:"F",father:"F72",mother:"F72w1",note:"زواج داخلي بالأسرة",dates:"1405هـ/1985م –" ,spouses:["F100"]},
{id:"F102w1",name:"مريم الصغرى",g:"F",father:"F17",mother:"F17w1",note:"زواج داخلي بالأسرة" ,spouses:["F102"]},
{id:"F103w1",name:"فاطمة",g:"F",father:"Y83",spouses:["F103"]},
{id:"F104",para:104,name:"محمد",g:"M",father:"F103",mother:"F103w1",spouses:["F104w1"]},
{id:"F103d1",name:"امنيانه",g:"F",father:"F103",mother:"F103w1",note:"لم تعقب"},
{id:"F103d2",name:"عايشا",g:"F",father:"F103",mother:"F12d1"},
{id:"F104w1",name:"سلم بوها",g:"F",father:"F80",note:"بنت محمذن بن بازيد بن محمذن بن الفالي بن المبارك بن اما (الماقور) — زواج داخلي بالأسرة (corrigé : rattachée à F80, pas F79 directement)" ,spouses:["F104"]},
{id:"F105",para:105,name:"عبد الله",g:"M",father:"F104",mother:"F104w1",dates:"1332هـ/1914م – 1418هـ/1997م",place:"أحسي السعادة",spouses:["F105w1"]},
{id:"F105w1",name:"اخدجيه فال",g:"F",father:"Y85",dates:"1341هـ/1923م – 1420هـ/1999م",place:"أحسي السعادة",spouses:["F105"]},
{id:"F106",para:106,name:"أحمد",g:"M",father:"F105",mother:"F105w1",dates:"1378هـ/1959م –",spouses:["F106w1"]},
{id:"F106w1",name:"عائشة",g:"F",father:"XA768",spouses:["F106"],ext:true},
{id:"F107",para:107,name:"محم",g:"M",father:"F9",mother:"F9w2",note:"بن المبارك بن اما (الماقور)",spouses:["F107w1","F32d2"]},
{id:"F107w1",name:"مريم تنصر",g:"F",father:"XA769",spouses:["F107"],ext:true},
{id:"F108",para:108,name:"بيبات",g:"M",father:"F107",mother:"F107w1",dates:"1299هـ/1882م –",place:"تابدكوت",spouses:["R66d1"]},
{id:"F109",para:109,name:"اتّاه (المختار)",g:"M",father:"F108",mother:"R66d1",dates:"1315هـ/1898م –",spouses:["F109w1","F109w2"]},
{id:"F122",para:122,name:"سيد الفالي",g:"M",father:"F108",mother:"R66d1",spouses:["F122w1"]},
{id:"F123",para:123,name:"الأمين",g:"M",father:"F108",mother:"R66d1",dates:"1328هـ/1910م –",place:"تنيخلف",spouses:["F123w1","F123w2"]},
{id:"F109w1",name:"احبيبه",g:"F",father:"H3",note:"رابط بالمصاهرة محتمل",crossLink:true,spouses:["F109"],fullName:"احبيبه بنت محمذن بن أحمد بن حبلل اسليطين",mother:"H3w1"},
{id:"F110",para:110,name:"محمد",g:"M",father:"F109",mother:"F109w1",dates:"1347هـ/1929م –",place:"أبير حيبلل",spouses:["F110w1"]},
{id:"F109w2",name:"بت",g:"F",father:"F16",mother:"K3d2",note:"زواج داخلي بالأسرة" ,spouses:["F109"]},
{id:"F114",para:114,name:"أحمد عمر",g:"M",father:"F109",mother:"F109w2",dates:"1328هـ/1910م –",spouses:["F114w1"]},
{id:"F115",para:115,name:"ببكر",g:"M",father:"F109",mother:"F109w2",dates:"1340هـ/1922م –",spouses:["F115w1"]},
{id:"F110w1",name:"ميّم",g:"F",father:"Z150",mother:"Z150w1",note:"رابط بين الأسرتين محتمل",dates:"1307هـ/1890م – 1402هـ/1982م",place:"أبير حيبلل",spouses:["F110","J35"],fullName:"ميّم بنت آياه (بوبكر) بن أحمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"F111",para:111,name:"أحمد",g:"M",father:"F110",mother:"F110w1",dates:"1347هـ/1929م – 1433هـ/2012م",place:"أبير حيبلل",spouses:["F111w1","F111w2","D69d1"]},
{id:"F111w1",name:"خدجية",g:"F",father:"D69",mother:"D69w1",dates:"1354هـ/1935م – 1431هـ/2010م",place:"أبير حيبلل",spouses:["F111"],crossLink:true},
{id:"F112",para:112,name:"احبيب (محمدن)",g:"M",father:"F111",mother:"F111w1",dates:"1381هـ/1962م –",spouses:["F112w1"]},
{id:"F111w2",name:"أم النبي",g:"F",father:"F82",mother:"F82w1",note:"زواج داخلي بالأسرة",dates:"1365هـ/1946م –" ,spouses:["F111"],fullName:"أم النبي بنت محيين (محمذن) بن دداه (أحمّد) بن محمذن بن بازيد بن محمذن بن الفالي بن المبارك بن اما"},
{id:"F113",para:113,name:"البشير (أحمّد)",g:"M",father:"F111",mother:"F111w2",dates:"1384هـ/1965م –",spouses:["F113w1","F113w2","K20d2"]},
{id:"F111d1",name:"تكيبر (محجوبه)",g:"F",father:"F111",mother:"F111w2",dates:"1396هـ/1976م –"},
{id:"F112w1",name:"مريم",g:"F",father:"V16",note:"رابط بالمصاهرة محتمل",dates:"1388هـ/1968م –",spouses:["F112","Z124"]},
{id:"F113w1",name:"امايّه",g:"F",father:"F34",note:"زواج داخلي بالأسرة",dates:"1396هـ/1976م –" ,spouses:["F113"],mother:"F34w1"},
{id:"F113w2",name:"اشريفه",g:"F",father:"I15",mother:"I15w1",note:"بنت أحمد سالم بن عبد الله — أم فضيلو من بنات البشير (احمد) بن احمد بن محمد بن اتاه",dates:"1393هـ/1973م –",spouses:["F113"],crossLink:true},
{id:"F114w1",name:"الزغمه",g:"F",father:"F122",mother:"F122w1",note:"زواج داخلي بالأسرة" ,spouses:["F114"],fullName:"الزغمه بنت سيد الفالي بن بيبات بن حمم بن المبارك بن اما (الماقور)"},
{id:"F115w1",name:"توت (فاطمة)",g:"F",father:"J24",mother:"J24w1",note:"رابط بين الأسرتين؛ أم ابني ببكر بن اتاه (المختار) بن بيبات بن حمم بن المبارك بن اما (الماقور)",spouses:["F115"],crossLink:true,fullName:"توت (فاطمة) بنت محمد بن محمذن بن أحمد البزي بن آجل (الفالي)"},
{id:"F116",para:116,name:"محمدن",g:"M",father:"F115",mother:"F115w1",dates:"1328هـ/1910م – 1428هـ/2007م",place:"بئر حبلل",spouses:["J25d1","F116w2"]},
{id:"F120",para:120,name:"أحمد",g:"M",father:"F115",mother:"F115w1",dates:"1332هـ/1914م – 1403هـ/1983م",place:"بئر حبلل",spouses:["F120w1"]},
{id:"F116s1",name:"ولد عمير",g:"M",father:"F116",mother:"J25d1",dates:"1368هـ/1949م –"},
{id:"F116w2",name:"صفيه",g:"F",father:"F23",mother:"F23w1",note:"زواج داخلي بالأسرة",dates:"1347هـ/1929م – 1425هـ/2004م",place:"بئر حبلل" ,spouses:["F116"]},
{id:"F117",para:117,name:"أحمد",g:"M",father:"F116",mother:"F116w2",dates:"1371هـ/1952م –",spouses:["F117w1"]},
{id:"F118",para:118,name:"محمد المختار",g:"M",father:"F116",mother:"F116w2",dates:"1377هـ/1958م –",spouses:["F118w1"]},
{id:"F117w1",name:"آمنة",g:"F",father:"XA771",spouses:["F117"],ext:true},
{id:"F119",para:119,name:"الحر (ببكر)",g:"M",father:"F116",mother:"F116w2",dates:"1381هـ/1962م –",spouses:["D29d1"]},
{id:"F117d1",name:"مريم",g:"F",father:"F117",mother:"F117w1",dates:"1407هـ/1987م –"},
{id:"F118w1",name:"مريم دلات",g:"F",father:"F82",mother:"F82w3",note:"زواج داخلي بالأسرة",dates:"1388هـ/1968م –" ,spouses:["F118"],fullName:"مريم دلات بنت محيين (محمذن) بن دداه (أحمّد) بن محمذن بن بازيد بن محمذن بن الفالي بن المبارك بن اما"},
{id:"F120w1",name:"اكرامه",g:"F",father:"M61",note:"رابط بين الأسرتين",dates:"1357هـ/1938م – 1433هـ/2012م",spouses:["F120"],crossLink:true,mother:"M61w1",place:"أبير حيبلل"},
{id:"F121",para:121,name:"محمدن",g:"M",father:"F120",mother:"F120w1",dates:"1388هـ/1968م –",spouses:["K144d4"]},
{id:"F122w1",name:"افطيمه",g:"F",father:"D63",spouses:["F122"],mother:"D63w1",note:"أم أبناء سيد الفالي بن بيبات بن حمم بن المبارك بن اما (الماقور)"},
{id:"F123w1",name:"احبيبه",g:"F",father:"K1",mother:"K1w1",note:"بنت المختار بن حبلل بن آمين بن محمد الكريم — رابط بين الأسرتين محتمل",spouses:["F123"],crossLink:true},
{id:"F124",para:124,name:"أحمد",g:"M",father:"F123",mother:"F123w1",spouses:["W5d2"]},
{id:"F123w2",name:"مريم",g:"F",father:"F16",mother:"K3d2",note:"زواج داخلي بالأسرة" ,spouses:["F123"]},
{id:"F125",para:125,name:"الخليفه",g:"M",father:"F123",mother:"F123w2",dates:"1299هـ/1882م – 1380هـ/1961م",place:"زيرت الخليفه",spouses:["F125w1","Z15w1"]},
{id:"F123s1",name:"محمد",g:"M",father:"F123",mother:"F123w2",note:"لم يعقب"},
{id:"F123s2",name:"محمودن",g:"M",father:"F123",mother:"F123w2",note:"لم يعقب"},
{id:"F124s1",name:"محمد فال",g:"M",father:"F124",mother:"W5d2",note:"لم يعقب"},
{id:"F125w1",name:"اماته",g:"F",father:"J24",mother:"J24w1",note:"رابط بين الأسرتين؛ أم المانه وفاطمة وينصرها وعائشة من أبناء الخليفه بن الأمين بن بيبات بن حمم بن المبارك بن اما (الماقور)",spouses:["F125"],crossLink:true,fullName:"اماته بنت محمد بن محمذن بن أحمد البزي بن آجل (الفالي)"},
{id:"F126",para:126,name:"المانه",g:"M",father:"F125",mother:"F125w1",dates:"1333هـ/1915م –",place:"أحسي السعادة",spouses:["F126w1"]},
{id:"F126w1",name:"مريم",g:"F",father:"F37",mother:"M56d1",note:"زواج داخلي بالأسرة",dates:"1347هـ/1929م –" ,spouses:["F126"],place:"أبير حيبلل"},
{id:"F126d1",name:"اَّمن",g:"F",father:"F126",mother:"F126w1",dates:"1379هـ/1960م –"},
{id:"F127",para:127,name:"حبيب (محمد)",g:"M",father:"F126",mother:"F126w1",dates:"1381هـ/1962م –",spouses:["F127w1"]},
{id:"F126d2",name:"البتول",g:"F",father:"F126",mother:"F126w1",dates:"1384هـ/1964م –"},
{id:"F128",para:128,name:"الطاهر",g:"M",father:"F126",mother:"F126w1",dates:"1392هـ/1972م –",spouses:["F128w1"]},
{id:"F127w1",name:"امات",g:"F",father:"XA772",spouses:["F127"],ext:true},
{id:"F128w1",name:"دلروه",g:"F",father:"F118",mother:"F118w1",note:"زواج داخلي بالأسرة",dates:"1409هـ/1989م –" ,spouses:["F128"],fullName:"دلروه بنت محمد المختار بن محمدن بن ببكر بن اتّاه (المختار) بن بيبات بن حمم بن المبارك بن اما"},
{id:"F129",para:129,name:"عبد الله",g:"M",father:"F123",mother:"F123w2",spouses:["I96d3"]},
{id:"F130",para:130,name:"اخميتيري (المختار)",g:"M",father:"F129",mother:"I96d3",dates:"1357هـ/1938م – 1425هـ/2004م",place:"أبير حيبلل",spouses:["F83w1"]},
{id:"F130d1",name:"افرات (ايات)",g:"F",father:"F130",mother:"F83w1",dates:"1402هـ/1982م –",fullName:"افرات (ايات) بنت المختار بن عبد الله بن الأمين بن بيبات بن حمم بن المبارك بن اما (الماقور)",spouses:["I83"]},
{id:"F131",para:131,name:"امبارك",g:"M",father:"F130",mother:"F83w1",dates:"1406هـ/1986م –",spouses:["F131w1"]},
{id:"F130s1",name:"محمد فال",g:"M",father:"F130",mother:"F83w1",dates:"1407هـ/1987م –"},
{id:"F130s2",name:"عبد",g:"M",father:"F130",mother:"F83w1",dates:"1412هـ/1992م –"},
{id:"F130s3",name:"اشريف",g:"M",father:"F130",mother:"F83w1",dates:"1414هـ/1994م –"},
{id:"F130d2",name:"توت",g:"F",father:"F130",mother:"F83w1",dates:"1423هـ/2002م –"},
{id:"F130d3",name:"خدي",g:"F",father:"F130",mother:"F83w1",dates:"1425هـ/2004م –"},
{id:"F131w1",name:"نسيبه",g:"F",father:"M5s2s1",spouses:["F131"]},
{id:"F131d1",name:"عائشة",g:"F",father:"F131",mother:"F131w1"},
{id:"F132",para:132,name:"محمد",g:"M",father:"F9",mother:"F9w2",note:"بن المبارك بن اما (الماقور)",spouses:["F132w1","F132w2","F132w3"]},
{id:"F132w1",name:"آمنة",g:"F",father:"I63",spouses:["F132"],mother:"I63w1",note:"أم أبناء محمد بن المبارك بن اما (الماقور)"},
{id:"F133",para:133,name:"الكوري",g:"M",father:"F132",mother:"F132w1",spouses:["E3d2"]},
{id:"F132s1",name:"محمدن",g:"M",father:"F132",mother:"F132w1",note:"لم يعقب"},
{id:"F132w2",name:"عايشا",g:"F",father:"Y58",spouses:["F132"]},
{id:"F132d1",name:"آمنة",g:"F",father:"F132",mother:"F132w2"},
{id:"F132w3",name:"مريم",g:"F",father:null,spouses:["F132"],fullName:"مريم بنت المبارك بن اما (الماقور) — زواج داخلي بالأسرة",note:"نسبها إلى المبارك بن اما يجعلها أختًا لزوجها — يحتاج تحققًا"},
{id:"F132d2",name:"ميمهنه",g:"F",father:"F132",mother:"F132w3" ,spouses:["M52"] ,crossLink:true},
{id:"F133s1",name:"محمد فال",g:"M",father:"F133",mother:"E3d2",dates:"1344هـ/1926م –",note:"لم يعقب"},
{id:"F133d1",name:"خوله (أم الخيري)",g:"F",father:"F133",mother:"E3d2" ,spouses:["K87","I66"] ,crossLink:true},
{id:"F134",para:134,name:"محم",g:"M",father:"F1",mother:"F1w1",note:"بن اما (الماقور)",spouses:["Y118d5","K6d1","F134w3","F134w4","F134w5"]},
{id:"F135",para:135,name:"السمهودي",g:"M",father:"F134",mother:"Y118d5",spouses:["F135w1","F135w2","F9d2"]},
{id:"F134d1",name:"النيسه",g:"F",father:"F134",mother:"Y118d5"},
{id:"F134w3",name:"صفيه",g:"F",father:"P50",mother:"P50w1",note:"غير مذكورة في مصدر ماه ضمن أبناء محمذن بن كامل — نسبها غير مؤكد",spouses:["F134"],crossLink:true},
{id:"F134w4",name:"فاطمة",g:"F",father:"Y148s2",spouses:["F134"]},
{id:"F134w5",name:"ميمهنه",g:"F",father:"Y125",spouses:["F134"]},
{id:"F135w1",name:"صفيه",g:"F",father:"P16",mother:"P16w1",note:"بنت عركاب (حمم) بن ابوبا (الأمين) بن ماهي — رابط بين الأسرتين",spouses:["F135"],crossLink:true},
{id:"F135s1",name:"محمذن ميلود",g:"M",father:"F135",mother:"F135w1",note:"لم يعقب"},
{id:"F135d1",name:"اينه (صفيه)",g:"F",father:"F135",mother:"F135w1" ,spouses:["K86"] ,crossLink:true},
{id:"F135w2",name:"فلانة",g:"F",father:"F9",mother:"F9w2",note:"زواج داخلي بالأسرة",spouses:["F135"]},
{id:"F135d2",name:"مريم",g:"F",father:"F135",mother:"F135w2" ,spouses:["K55"] ,crossLink:true},
{id:"F136w1",name:"النبراس",g:"F",father:"M2",note:"رابط بين الأسرتين محتمل؛ أم أبناء الأمين بن اما (الماقور)",spouses:["F136"],crossLink:true,fullName:"النبراس بنت خليد (حبيب الله) بن متيلي (المختار)",mother:"M2w1"},
{id:"F137",para:137,name:"الأفلح",g:"M",father:"F136",mother:"F136w1",spouses:["M3d1"]},
{id:"F138",para:138,name:"العتيق",g:"M",father:"F136",mother:"F136w1",spouses:["M3d1"]},
{id:"F136s1",name:"المنار",g:"M",father:"F136",mother:"F136w1",note:"لم يعقب"},
{id:"F136d1",name:"السراج",g:"F",father:"F136",mother:"F136w1" ,spouses:["M23"] ,crossLink:true},
{id:"F137s1",name:"أحمد",g:"M",father:"F137",mother:"M3d1",note:"لم يعقب"},
{id:"F137d1",name:"ميمهنه",g:"F",father:"F137",mother:"M3d1" ,spouses:["K59"] ,crossLink:true},
{id:"F138d1",name:"فاطمة",g:"F",father:"F138",mother:"M3d1",note:"لم تعقب"},
{id:"G1",para:1,name:"مودي مالك",g:"M",father:null,place:"تنبلين",note:"بن عبد الله جنك — أسرة حليفة، من آل سيد الياس",spouses:["G1w1"]},
{id:"G1w1",name:"ميجه",g:"F",father:"XA774",spouses:["G1"],ext:true},
{id:"G2",para:2,name:"أحمد بوراص",g:"M",father:"G1",mother:"G1w1",place:"ذات الطبل",spouses:["G2w1"]},
{id:"G3",para:3,name:"اشفغ مينحنو",g:"M",father:"G1",mother:"G1w1",dates:"1551هـ؟ – 1151هـ؟ (تواريخ غير مؤكدة)",place:"تنفنجو",spouses:["G3w1"]},
{id:"G98",para:98,name:"بتف (المصطفى)",g:"M",father:"G1",mother:"G1w1",place:"اندبفر",spouses:["G98w1"]},
{id:"G99",para:99,name:"الأمين",g:"M",father:"G1",mother:"G1w1",place:"ذات الطبل",spouses:["G99w1","G99w2","Y4d3"]},
{id:"G1d1",name:"خديجة",g:"F",father:"G1",mother:"G1w1",note:"أم أبناء محنض بن صباره (المختار) بن باب أحمد",spouses:["D46s3s2"]},
{id:"G1d2",name:"مريم",g:"F",father:"G1",mother:"G1w1",note:"توأمة الأمين — أم أحمد جملد ومحمد العاقل وحنو وشقيقتهم من أبناء محنض بن الماح بن المختار اكد عثمان",spouses:["XA778"]},
{id:"G2w1",name:"فلانة",g:"F",father:"XA775",spouses:["G2"],ext:true},
{id:"G2d1",name:"ميي",g:"F",father:"G2",mother:"G2w1",note:"أم أبناء بليل بن محنض بن سيد أحمد بن سيد المختار بن أحمد الهكاري"},
{id:"G3w1",name:"امنيانه",g:"F",father:"Z1",mother:"Z1w1",note:"بنت المزضف بن سيد الفالي — رابط بين الأسرتين",spouses:["G3"],crossLink:true},
{id:"Z1d1",name:"سخنه",g:"F",father:"Z1",mother:"Z1w1",note:"أم أبناء محمذن بن حبّيّن بن أحمد اكد المختار"},
{id:"G4",para:4,name:"عبد الله",g:"M",father:"G3",mother:"G3w1",place:"أبير حيبلل",spouses:["G4w1","G4w2","G4w3","G4w4"]},
{id:"G36",para:36,name:"محمد",g:"M",father:"G3",mother:"G3w1",place:"انتوطفين",spouses:["G36w1"]},
{id:"G55",para:55,name:"المصطفى",g:"M",father:"G3",mother:"G3w1",spouses:["G55w1","G55w2","Y4d7"]},
{id:"G56",para:56,name:"الأمين",g:"M",father:"G3",mother:"G3w1",spouses:["G56w1","G56w2","Y11d1"]},
{id:"G3d1",name:"ايجه",g:"F",father:"G3",mother:"G3w1",note:"أم أبناء ابوبا (الأمين) بن ماهي",spouses:["P2"]},
{id:"G3d3",name:"عائشة",g:"F",father:"G3",mother:"G3w1"},
{id:"G4w1",name:"تفنفئذن",g:"F",father:"D46s3s2s1",spouses:["G4"]},
{id:"G4d1",name:"امنيانه",g:"F",father:"G4",mother:"G4w1",note:"أم أحمذ ومحمد فال ابني والد بن المصطفى بن خالنا بن الفالي بن المختار اكد عثمان" ,spouses:["P3"] ,crossLink:true},
{id:"G4w2",name:"غادجيه",g:"F",father:"XA779",place:"أبير حيبلل",spouses:["G4"],ext:true},
{id:"G5",para:5,name:"اد (محدن)",g:"M",father:"G4",mother:"G4w2",place:"أبير حيبلل",spouses:["G11d1","G5w2"]},
{id:"G4w3",name:"آجمه",g:"F",father:null,note:"أم خدجية بنت اويب بن أحمد جملد بن محنض بن الماح بن المختار اكد عثمان",spouses:["G4"]},
{id:"G4w4",name:"فاطمة",g:"F",father:"XA1301",spouses:["G4"],ext:true},
{id:"G9",para:9,name:"امام (امام الحرمين)",g:"M",father:"G4",mother:"G4w4",spouses:["G9w1","G9w2","G9w3","G9w4"]},
{id:"G5w2",name:"فاطمة",g:"F",father:"XA784",place:"تكرمن",spouses:["G5"],ext:true},
{id:"G6",para:6,name:"المريد (أحمد)",g:"M",father:"G5",mother:"G5w2",place:"تكرمن",spouses:["G6w1","G6w2","G58d1"]},
{id:"G6w1",name:"أم المؤمنين",g:"F",father:"R48s1",place:"المدروم",spouses:["G6"],fullName:"أم المؤمنين بنت أحمد بن محمد بن عبد الله بن المختار بن خالنا بن الفالي بن المختار اكد عثمان"},
{id:"G7",para:7,name:"المختار اسلام",g:"M",father:"G6",mother:"G6w1",dates:"1362هـ؟ – 1943م",place:"المدروم",spouses:["G7w1"]},
{id:"G6d1",name:"أم الحسن",g:"F",father:"G6",mother:"G6w1",note:"أم بنات سيد باب بن محمذن بن سيد بن الصافي بن المختار بن المصطفى بن بل بن المختار اكد عثمان"},
{id:"G6d2",name:"خوده",g:"F",father:"G6",mother:"G6w1",note:"أم محمد بن بابكر بن الأمين بن اليدالي آبر بن محمذن بن حوبك بن الفالي بن المختار اكد عثمان"},
{id:"G6w2",name:"فلانة",g:"F",father:null,spouses:["G6"]},
{id:"G6d3",name:"مريم",g:"F",father:"G6",mother:"G6w2",note:"لم تعقب"},
{id:"G6d4",name:"مريم تسعد",g:"F",father:"G6",mother:"G58d1",note:"لم تعقب"},
{id:"G7w1",name:"النومه (مريم)",g:"F",father:"XA792",place:"المدروم",spouses:["G7"],ext:true},
{id:"G7s1",name:"أحمد",g:"M",father:"G7",mother:"G7w1",note:"لم يعقب"},
{id:"G8",para:8,name:"أحمد محمود",g:"M",father:"G7",mother:"G7w1",dates:"1415هـ؟ – 1995م",place:"المدروم",spouses:["G8w1"]},
{id:"G7d1",name:"خديجة",g:"F",father:"G7",mother:"G7w1",note:"أم أبناء اسليمان بن محمد بن أحمد بن احممدي بن عبد الله بن المختار بن خالنا بن الفالي بن المختار اكد عثمان"},
{id:"G7d2",name:"عائشة",g:"F",father:"G7",mother:"G7w1",note:"أم أبناء أحمد بن بكا (المختار) بن محمذن بن ببكر بن آبر بن محمذن بن حوبك بن الفالي بن المختار اكد عثمان"},
{id:"G8w1",name:"خديجة",g:"F",father:"XA798",spouses:["G8"],fullName:"خديجة بنت الب بن محمد محمود بن محمد بن أحمد الجواد بن اشفغ المختار بن اعبيد الله بن المصطفى بن بل بن المختار اكد عثمان",ext:true},
{id:"G8s1",name:"المختار اسلام",g:"M",father:"G8",mother:"G8w1",note:"لم يعقب"},
{id:"G8s2",name:"محمد",g:"M",father:"G8",mother:"G8w1",note:"لم يعقب"},
{id:"G8d1",name:"فاطمة",g:"F",father:"G8",mother:"G8w1",note:"أم ابني محمد بن بيجال (محمد فال) بن المختار بن محمذن بن بابكر بن آبر بن محمذن بن حوبك بن الفالي بن المختار اكدعثمان"},
{id:"G8d2",name:"النومه (مريم)",g:"F",father:"G8",mother:"G8w1",note:"أم محمد بن عبد الله بن أحمد بن المختار بن محمذن بن بابكر بن آبر بن محمذن بن حوبك بن الفالي بن المختار اكد عثمان"},
{id:"G8d3",name:"لخليفه",g:"F",father:"G8",mother:"G8w1",note:"أم أبناء محمد بن أحمد بن المختار بن محمذن بن بابكر بن آبر بن محمذن بن حوبك بن الفالي بن المختار اكد عثمان"},
{id:"G9w1",name:"أم المؤمنين",g:"F",father:"K59",mother:"F137d1",note:"بنت أحمذ بن خير الورى بن سيد عبد الله بن محمد الكريم — رابط بين الأسرتين",spouses:["G9"],crossLink:true},
{id:"G9d1",name:"ايجه",g:"F",father:"G9",mother:"G9w1",note:"لم تعقب"},
{id:"G9w2",name:"سادلي",g:"F",father:"XA333",spouses:["G9"],ext:true},
{id:"G10",para:10,name:"أحمد",g:"M",father:"G9",mother:"G9w2",spouses:["G10w1"]},
{id:"G9w3",name:"فلانة",g:"F",father:"XA802",spouses:["G9"],ext:true},
{id:"G18",para:18,name:"حمزة",g:"M",father:"G9",mother:"G9w3",spouses:["G18w1"]},
{id:"G9w4",name:"فلانة",g:"F",father:"E28",mother:"L2d2",spouses:["G9"],crossLink:true},
{id:"G9s1",name:"سيد الفالي",g:"M",father:"G9",mother:"G9w4",note:"لم يعقب"},
{id:"G24",para:24,name:"الأمين",g:"M",father:"G9",mother:"G9w4",dates:"1334هـ؟ – 1916م",spouses:["G24w1","G53d2","G24w2","G24w3"]},
{id:"G10w1",name:"غيشان",g:"F",father:"K152",mother:"K152w1",spouses:["G10"],crossLink:true},
{id:"G11",para:11,name:"محمدين",g:"M",father:"G10",mother:"G10w1",spouses:["G11w1","G11w2"]},
{id:"G15",para:15,name:"المختار",g:"M",father:"G10",mother:"G10w1",spouses:["G15w1"]},
{id:"G17",para:17,name:"محمذن",g:"M",father:"G10",mother:"G10w1",spouses:["G17w1"]},
{id:"G10d1",name:"امباركه",g:"F",father:"G10",mother:"G10w1",note:"لم تعقب"},
{id:"G11w1",name:"فاطمة",g:"F",father:"R65s1s1s2",spouses:["G11","D22"]},
{id:"G12",para:12,name:"سيد",g:"M",father:"G11",mother:"G11w1",spouses:["G12w1"]},
{id:"G11w2",name:"خدج",g:"F",father:"R65s1s1s3",spouses:["G11"]},
{id:"G11s1",name:"المختار السالم",g:"M",father:"G11",mother:"G11w2",note:"لم يعقب"},
{id:"G11d1",name:"أم المؤمنين",g:"F",father:"G11",mother:"G11w2",note:"أم ابوبكر بن أحمد بن بابكر بن خال ابراهيم بن محنض بن الماح بن الحسن دوبك؛ زواج داخلي بالأسرة",spouses:["G5"]},
{id:"G11d2",name:"لبيكه",g:"F",father:"G11",mother:"G11w2",note:"لم تعقب"},
{id:"G12w1",name:"فلانة",g:"F",father:"W1",mother:"W1w1",spouses:["G12"],crossLink:true,fullName:"فلانة بنت محمد بن ايب -دكتمظو-"},
{id:"G13",para:13,name:"اسلم",g:"M",father:"G12",mother:"G12w1",dates:"1334هـ/1916م –",place:"اللبودية",spouses:["G13w1","G13w2","G13w3"]},
{id:"G12d1",name:"عيشان",g:"F",father:"G12",mother:"G12w1",note:"لم تعقب"},
{id:"G13w1",name:"اسلم ارجالو",g:"F",father:"XA804",spouses:["G13"],ext:true},
{id:"G13s1",name:"سيد سالم",g:"M",father:"G13",mother:"G13w1",dates:"1376هـ/1957م –"},
{id:"G13s2",name:"محمد",g:"M",father:"G13",mother:"G13w1",dates:"1381هـ/1962م –"},
{id:"G13w2",name:"رقية",g:"F",father:"XA1304",spouses:["G13"],ext:true},
{id:"G13d2",name:"النعمه",g:"F",father:"G13",mother:"G13w2",dates:"1388هـ/1968م –"},
{id:"G13d3",name:"النجاح",g:"F",father:"G13",mother:"G13w3",dates:"1392هـ/1972م –"},
{id:"G13w3",name:"لبيكه (فاطمة)",g:"F",father:null,dates:"1396هـ/1976م –",spouses:["G13"]},
{id:"G14",para:14,name:"مختار اسلام",g:"M",father:"G13",mother:"G13w3",dates:"1397هـ/1977م –",spouses:["G14w1"]},
{id:"G13d4",name:"منت",g:"F",father:"G13",mother:"G13w3",dates:"1398هـ/1978م –"},
{id:"G13s3",name:"باكا (أحمد سالم)",g:"M",father:"G13",mother:"G13w3",dates:"1455هـ؟"},
{id:"G14w1",name:"فلانة -تركز-",g:"F",father:null,spouses:["G14"]},
{id:"G14d1",name:"عيشان",g:"F",father:"G14",mother:"G14w1",dates:"1425هـ؟"},
{id:"G15w1",name:"أم الخير",g:"F",father:"G24",note:"زواج داخلي بالأسرة؛ أم ابني المختار بن أحمد بن امام (امام الحرمين) بن عبد الله بن اشفغ مينحنو" ,spouses:["G15"],mother:"G24w3"},
{id:"G16",para:16,name:"محمذن",g:"M",father:"G15",mother:"G15w1",spouses:["G16w1"]},
{id:"G15s1",name:"الأمين",g:"M",father:"G15",mother:"G15w1",note:"لم يعقب"},
{id:"G16w1",name:"امي",g:"F",father:"G24",note:"زواج داخلي بالأسرة" ,spouses:["G16"]},
{id:"G16s1",name:"المختار",g:"M",father:"G16",mother:"G16w1",note:"لم يعقب"},
{id:"G16d1",name:"امباركه",g:"F",father:"G16",mother:"G16w1",note:"أم أبناء اسلامو بن محمذن بن حيب الله بن عبدي بن احيدنا (محمذن) بن الأمين بن مودي مالك؛ زواج داخلي بالأسرة",spouses:["G105"]},
{id:"G16d2",name:"أم الخيري",g:"F",father:"G16",mother:"G16w1",note:"لم يعقب"},
{id:"G17w1",name:"فلانة",g:"F",father:null,spouses:["G17"]},
{id:"G17s1",name:"المختار السالم",g:"M",father:"G17",mother:"G17w1",note:"لم يعقب"},
{id:"G17s2",name:"سيد",g:"M",father:"G17",mother:"G17w1",note:"لم يعقب"},
{id:"G17d1",name:"خديجة",g:"F",father:"G17",mother:"G17w1",note:"أم أبناء سيد بن محمذن بن آبود بن محمذن بن الأمين بن اشفغ مينحنو بن مودي مالك",spouses:["G60"]},
{id:"G18w1",name:"عيشه",g:"F",father:"XA808",spouses:["G18"],ext:true},
{id:"G19",para:19,name:"أحمد",g:"M",father:"G18",mother:"G18w1",spouses:["G19w1","G19w2"]},
{id:"G18d1",name:"فلانة",g:"F",father:"G18",mother:"G18w1",note:"أم محمذن فال بن شداد بن الأمين بن احيدنا (محمذن) بن الأمين بن مودي مالك"},
{id:"G19w1",name:"فلانة",g:"F",father:"XA815",spouses:["G19"],ext:true},
{id:"G20",para:20,name:"امام",g:"M",father:"G19",mother:"G19w1",spouses:["G24d1","G35d1"]},
{id:"G19w2",name:"فلانة",g:"F",father:"XA1311",spouses:["G19"],ext:true},
{id:"G22",para:22,name:"سيد الياس",g:"M",father:"G19",mother:"G19w2",spouses:["G22w1","G22w2"]},
{id:"G19d1",name:"العيشه",g:"F",father:"G19",mother:"G19w2",note:"أم عيشتونو وخدجية بنتي محمد بن الجمد"},
{id:"G21",para:21,name:"سيد",g:"M",father:"G20",mother:"G24d1",spouses:["G21w1"]},
{id:"G20d1",name:"فاطمة",g:"F",father:"G20",mother:"G24d1",note:"لم تعقب"},
{id:"G20d2",name:"آمنة",g:"F",father:"G20",mother:"G24d1",note:"لم تعقب"},
{id:"G21w1",name:"خدجية",g:"F",father:"I55",mother:"I55w1",spouses:["G21"]},
{id:"G21d1",name:"فلانة",g:"F",father:"G21",mother:"G21w1",note:"لم تعقب"},
{id:"G22w1",name:"مت",g:"F",father:"XA1313",spouses:["G22"],fullName:"مت بنت أحمد بن محمدا بن عبد الله بن أحمد بن حبلل بن الكريم بن أحمد شلل بن يقبنلل",ext:true},
{id:"G23",para:23,name:"أحمد",g:"M",father:"G22",mother:"G22w1",spouses:["G23w1"]},
{id:"G22w2",name:"فلانة",g:"F",father:"G15s1s1s1",spouses:["G22"],fullName:"فلانة بنت الحبيب بن محمد بن الأمين بن المختار بن أحمد بن المختار عمي -متكلو-",ext:true},
{id:"G22d1",name:"فاطمة",g:"F",father:"G22",mother:"G22w2",note:"لها عقب"},
{id:"G23w1",name:"فاطمة",g:"F",father:"I96s2",spouses:["G23"]},
{id:"G23s1",name:"محمد",g:"M",father:"G23",mother:"G23w1",note:"لم يعقب"},
{id:"G23d1",name:"فلانة",g:"F",father:"G23",mother:"G23w1",note:"لم تعقب"},
{id:"G24w1",name:"امي",g:"F",father:"G118",mother:"G53d2",note:"زواج داخلي بالأسرة" ,spouses:["G24"]},
{id:"G25",para:25,name:"ببكر",g:"M",father:"G24",mother:"G24w1",spouses:["G25w1"]},
{id:"G24s1",name:"محمد",g:"M",father:"G24",mother:"G24w1",note:"لم يعقب"},
{id:"G24d1",name:"مريم",g:"F",father:"G24",mother:"G24w1",note:"لم تعقب" ,spouses:["G20"] ,crossLink:true},
{id:"G24w2",name:"فاطمة",g:"F",father:"D37",spouses:["G24"],mother:"D37w1",note:"أم بعض أبناء الأمين بن امام (امام الحرمين) بن عبد الله بن اشفغ مينحنو"},
{id:"G27",para:27,name:"أحمد",g:"M",father:"G24",mother:"G24w2",spouses:["G27w1","G27w2"]},
{id:"G24d2",name:"خديجه",g:"F",father:"G24",mother:"G24w2",note:"أم أبناء محمذن بن حيب الله بن عبدي بن احيدنا (محمذن) بن الأمين بن مودي مالك",spouses:["G104"]},
{id:"G24w3",name:"فاطمة",g:"F",father:"XA631",spouses:["G24"],ext:true},
{id:"G28",para:28,name:"عبد",g:"M",father:"G24",mother:"G24w3",dates:"1348هـ/1935م –",spouses:["G59d1"]},
{id:"G34",para:34,name:"المختار",g:"M",father:"G24",mother:"G24w3",spouses:["G34w1","G34w2"]},
{id:"G24d4",name:"ميمهنه",g:"F",father:"G24",mother:"G24w3",note:"أم علي ومريم ابني مختري (المختار) بن الأمين بن اعمامي بن الما الشاعر بن المصطفى بن حمم سعيد"},
{id:"G35",para:35,name:"سعيد",g:"M",father:"G24",mother:"G53d2",spouses:["G35w1"]},
{id:"G25w1",name:"فلانة",g:"F",father:"XA823",spouses:["G25"],ext:true},
{id:"G26",para:26,name:"الدباغ",g:"M",father:"G25",mother:"G25w1",spouses:["G26w1"]},
{id:"G26w1",name:"فلانة -إلى محمد",g:"F",father:"XA882",spouses:["G26"],ext:true},
{id:"G26d1",name:"أم الفضلي",g:"F",father:"G26",mother:"G26w1",note:"لم تعقب"},
{id:"G27w1",name:"امباركه",g:"F",father:"XA825",spouses:["G27"],ext:true},
{id:"G27s1",name:"محمد",g:"M",father:"G27",mother:"G27w1",note:"لم يعقب"},
{id:"G27w2",name:"خدجية",g:"F",father:"R45s1s1s2s1s1",spouses:["G27"]},
{id:"G27d1",name:"أم الخيري",g:"F",father:"G27",mother:"G27w2",note:"لم تعقب"},
{id:"G27d2",name:"فاطمة",g:"F",father:"G27",mother:"G27w2",note:"أم أحمد باب وسلمو ابني محمذن فال بن المختار بن محمذن فال بن عبييد بن أحمذ بن اشفغ المختار باب"},
{id:"G29",para:29,name:"شماد",g:"M",father:"G28",mother:"G59d1",dates:"1385هـ/1961م –",place:"تنيخلف",spouses:["G71w1","G29w2"]},
{id:"G28d1",name:"امي",g:"F",father:"G28",mother:"G59d1",note:"أم أبناء محمد بن المختار بن أحمد بن امام (امام الحرمين) بن عبد الله بن اشفغ مينحنو"},
{id:"G28d2",name:"عيشاه",g:"F",father:"G28",mother:"G59d1",place:"أحسي ابيليل",note:"أم البتول من أبناء محمودن بن الأمين بن محمد بن حيب الله بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",spouses:["Y77"]},
{id:"G30",para:30,name:"عب (عبد الله)",g:"M",father:"G29",mother:"G71w1",dates:"1348هـ/1935م – 1432هـ/2011م",place:"أبير حيبلل",note:"رقم الفقرة 30؛ قراءة OCR أعطت 35 لأن الصفر يُقرأ خمسة" ,spouses:["G31w1","I22d1","G30w1"]},
{id:"G29s1",name:"باب",g:"M",father:"G29",mother:"G71w1",dates:"1351هـ/1933م –"},
{id:"G29d1",name:"فاطمة",g:"F",father:"G29",mother:"G71w1",dates:"1359هـ/1938م –",note:"أم توت وأحمد من أبناء محمد فال بن ابيد (بزيد) بن بييين بن امحيد بن المزضف بن الأمين بن اشفغ مينحنو، وأم محمدن ويحي ابني محمد بن سيد بن محمذن بن آبود؛ زواج داخلي بالأسرة",spouses:["G61","G87"]},
{id:"G29w2",name:"مريم",g:"F",father:null,dates:"1369هـ/1955م – 1417هـ/1996م",note:"لم تعقب",spouses:["G29"]},
{id:"G29d2",name:"عائشة",g:"F",father:"G29",dates:"1373هـ/1954م –",note:"أم أبناء ببكر بن يونس بوكار سي"},
{id:"G31w1",name:"خدجيه",g:"F",father:"G50",note:"زواج داخلي بالأسرة",spouses:["G30","G31"],fullName:"خدجيه بنت محمد بن محمد سالم بن سيد الأمين بن مدهي (محمد) بن عبد الله جنك بن المبارك بن محمد بن اشفغ مينحنو"},
{id:"G31s1",name:"سيدنا",g:"M",father:"G31",mother:"G31w1",dates:"1426هـ؟"},
{id:"G31d1",name:"ساجده",g:"F",father:"G31",mother:"G31w1",dates:"1427هـ؟"},
{id:"G31s2",name:"محمد سالم",g:"M",father:"G31",mother:"G31w1",dates:"1429هـ؟"},
{id:"G32s1",name:"النح",g:"M",father:"G32",mother:"G32w1b",dates:"1455هـ؟"},
{id:"G33s1",name:"أحمد",g:"M",father:"G33",mother:"G33w1",dates:"1452هـ؟"},
{id:"G32s2",name:"محمدن",g:"M",father:"G32",mother:"G32w1b",dates:"1453هـ؟"},
{id:"G32s3",name:"محمد الأمين",g:"M",father:"G32",mother:"G32w1b",dates:"1454هـ؟"},
{id:"G32d1",name:"العمره",g:"F",father:"G32",mother:"G32w1b",dates:"1459هـ؟"},
{id:"G32s4",name:"محمد المختار",g:"M",father:"G32",mother:"G32w1b",dates:"1411هـ/1991م –"},
{id:"G30w1",name:"سلمه",g:"F",father:"D58",dates:"1365هـ/1946م –",spouses:["G30"]},
{id:"G31",para:31,name:"القاضي",g:"M",father:"G30",mother:"G30w1",dates:"1386هـ/1966م –",spouses:["G31w1"]},
{id:"G32",para:32,name:"النَّح",g:"M",father:"G30",mother:"I22d1",dates:"1405هـ/1985م –",spouses:["G32w1b"]},
{id:"G33",para:33,name:"أحمد",g:"M",father:"G30",mother:"I22d1",dates:"1402هـ/1982م –",spouses:["G33w1"]},
{id:"G29s2",name:"محمدن",g:"M",father:"G30",mother:"I22d1",dates:"1453هـ؟"},
{id:"G29s3",name:"محمد الأمين",g:"M",father:"G30",mother:"I22d1",dates:"1454هـ؟"},
{id:"G29d3",name:"العمره",g:"F",father:"G30",mother:"I22d1",dates:"1459هـ؟"},
{id:"G29s4",name:"محمد المختار",g:"M",father:"G30",mother:"I22d1",dates:"1411هـ/1991م –"},
{id:"G32w1b",name:"مريم",g:"F",father:"M27",mother:"M27w1",note:"لم أعثر بعد على اگي (الكوري) بن آمن (أحمد)/M9 كابن مسجّل — الحلقة الوسطى مفقودة من بياناتي",spouses:["G32"],fullName:"مريم بنت ديد بن ببكر بن اگي (الكوري) بن ايبا (أحمذ) بن محمذن بن الأمين بن الفالي بن متيلي (المختار)",dates:"1393هـ/1973م –"},
{id:"G32d2",name:"فرحه",g:"F",father:"G32",mother:"G32w1b",dates:"1434هـ؟"},
{id:"G33w1",name:"بوبه",g:"F",father:"J10",mother:"R62d1",note:"بنت احماده بن أحمد سالم بن أحمد بن محمد فال بن ابن غازي بن آلچ (الفالي) — رابط بين الأسرتين",spouses:["G33"],crossLink:true,dates:"1405هـ/1985م –"},
{id:"G33d1",name:"فاطمتين",g:"F",father:"G33",mother:"G33w1"},
{id:"G34w1",name:"عيشان",g:"F",father:"G19",mother:"G19w1",note:"زواج داخلي بالأسرة؛ أم بنيت المختار بن الأمين بن امام (امام الحرمين) بن عبد الله بن اشفغ مينحنو" ,spouses:["G34"]},
{id:"G34d1",name:"أم الخيرات",g:"F",father:"G34",mother:"G34w1",note:"أم حيي بن اربيو بن مولود بن عبد الله -مدلش-"},
{id:"G34w2",name:"توت",g:"F",father:null,note:"أم تانيت بنت محمد بن عفان -أولاد دمان- لم تعقب",spouses:["G34"]},
{id:"G35w1",name:"آمنة",g:"F",father:"Y3",spouses:["G35"],crossLink:true},
{id:"G35d1",name:"مريم",g:"F",father:"G35",mother:"G35w1",note:"أم أبناء امام بن أحمد بن حمزة بن امام (امام الحرمين) بن عبد الله بن اشفغ مينحنو — لم يعقبوا",spouses:["G20"]},
{id:"G36w1",name:"تنغوس (مريم)",g:"F",father:"Y11",spouses:["G36"],mother:"Y11w2",note:"أم يافاظل بن حنيدي بن عمي اعديج ولد سيد الفالي؛ أم أبناء محمد بن اشفغ مينحنو"},
{id:"G37",para:37,name:"أحمد ميلود",g:"M",father:"G36",mother:"G36w1",spouses:["G37w1"]},
{id:"G43",para:43,name:"المبارك",g:"M",father:"G36",mother:"G36w1",spouses:["G43w1","G43w2"]},
{id:"G52",para:52,name:"المختار",g:"M",father:"G36",mother:"G36w1",spouses:["G52w1"]},
{id:"G36d1",name:"أم هاني",g:"F",father:"G36",mother:"G36w1",note:"أم محمذن بن محمد بن اشفغ المختار باب (يحقق)"},
{id:"G36d1b",name:"امنيانه",g:"F",father:"G36",mother:"G36w1",note:"أم محمذن وسليمان وامباركو وجرفونو وصفيو من أبناء عركاب (حمم) بن ابوبا (الأمين) بن ماهي",spouses:["P3"]},
{id:"G36d2",name:"ايجه",g:"F",father:"G36",mother:"G36w1",note:"أم أبناء أحمد ميلود بن شدار بن اشفغ الأمين",spouses:["Y149"]},
{id:"G36d3",name:"أم الفضل",g:"F",father:"G36",mother:"G36w1",note:"أم أبناء أيدوم بن أحمذ بن اشفغ المختار باب"},
{id:"G36d4",name:"فلانة",g:"F",father:"G36",mother:"G36w1",note:"أم سيد وعيشو وشقيقتيهما من أبناء المبارك بن باب الدين بن اشفغ الأمين، وأم بنيت فوك بن حبلل بن ماهي"},
{id:"G37w1",name:"غادجيه",g:"F",father:"M19",mother:"M19w1",note:"رابط بين الأسرتين محتمل",spouses:["G37"],fullName:"غادجيه بنت اللبيد بن باركلل بن بوالماح بن متيلي"},
{id:"G38",para:38,name:"المامي",g:"M",father:"G37",mother:"G37w1",spouses:["G38w1"]},
{id:"G38w1",name:"خوده",g:"F",father:"G5",mother:"G11d1",note:"زواج داخلي بالأسرة؛ أم أبناء المامي بن أحمد ميلود بن محمد بن اشفغ مينحنو، وأم محمد بن ببكر بن الأمين بن اليدالي" ,spouses:["G38"]},
{id:"G39",para:39,name:"احمذ",g:"M",father:"G38",mother:"G38w1",spouses:["G39w1"]},
{id:"G38s1",name:"محمد",g:"M",father:"G38",mother:"G38w1",note:"لم يعقب"},
{id:"G41",para:41,name:"المختار",g:"M",father:"G38",mother:"G38w1",spouses:["G41w1"]},
{id:"G38d1",name:"فاطمة",g:"F",father:"G38",mother:"G38w1",note:"لم تعقب"},
{id:"G39w1",name:"مريم",g:"F",father:"XA827",spouses:["G39"],ext:true},
{id:"G40",para:40,name:"عبد الرحمن",g:"M",father:"G39",mother:"G39w1",spouses:["G94d1"]},
{id:"G39s1",name:"محمد",g:"M",father:"G39",mother:"G39w1",note:"لم يعقب"},
{id:"G39d1",name:"آمنة",g:"F",father:"G39",mother:"G39w1",note:"لم تعقب"},
{id:"G39d2",name:"السلطانه",g:"F",father:"G39",mother:"G39w1",note:"لم تعقب"},
{id:"G39d3",name:"خديجة",g:"F",father:"G39",mother:"G39w1",note:"أم أبناء احماده بن المختار بن المامي بن أحمد ميلود بن محمد بن اشفغ مينحنو",spouses:["G42"]},
{id:"G39d4",name:"عائشة",g:"F",father:"G39",mother:"G39w1",note:"لم تعقب"},
{id:"G40d1",name:"فلانة",g:"F",father:"G40",mother:"G94d1",note:"لم تعقب"},
{id:"G41w1",name:"فاله",g:"F",father:"Y138",spouses:["G41"],crossLink:true,mother:"Y138w1",note:"أم احماده وام المومنين ابني المختار بن المامي بن احمد ميلود بن محمد بن اشفغ مينحنو"},
{id:"G42",para:42,name:"احماده",g:"M",father:"G41",mother:"G41w1",spouses:["G42w1","G39d3"]},
{id:"G41d1",name:"أم المؤمنين",g:"F",father:"G41",mother:"G41w1",note:"أم أبناء المختار بن محمذن بن المزضف بن الأمين بن اشفغ مينحنو" ,spouses:["G94"] ,crossLink:true},
{id:"G42w1",name:"خدجية",g:"F",father:"G39",mother:"G39w1",spouses:["G42"]},
{id:"G42s1",name:"أحمد",g:"M",father:"G42",mother:"G42w1",note:"لم يعقب"},
{id:"G42s2",name:"سالم",g:"M",father:"G42",mother:"G42w1",note:"لم يعقب"},
{id:"G42d1",name:"البتول",g:"F",father:"G42",mother:"G42w1",note:"أم الداه بن الأمين بن محمذن بن آبود بن محمذن بن الأمين بن اشفغ مينحنو" ,spouses:["G68"] ,crossLink:true},
{id:"G42d2",name:"سلمه",g:"F",father:"G42",mother:"G42w1",note:"أم مريم فال بنت أحمد سالم بن محمذن بن آبود بن محمذن بن الأمين بن اشفغ مينحنو" ,spouses:["G65","G68"] ,crossLink:true},
{id:"G43w1",name:"احنينه",g:"F",father:"Z3",mother:"Z3w1",note:"رابط بين الأسرتين",spouses:["G43"],crossLink:true},
{id:"G44",para:44,name:"ادخيل",g:"M",father:"G43",mother:"G43w1",spouses:["G44w1"]},
{id:"G45",para:45,name:"عبد الله جنك",g:"M",father:"G43",mother:"G43w1",note:"رقم الفقرة مصحَّح؛ قراءة OCR تُبدل الصفر خمسةً" ,spouses:["G46w1"]},
{id:"G43d1",name:"مريم",g:"F",father:"G43",mother:"G43w1",note:"أم اخدجيات وميتمات بنتي محمذن فال بن حبلل بن خالنا بن الفالي بن المختار اكد عثمان"},
{id:"G43w2",name:"فلانة",g:"F",father:null,note:"أم أبناء محمذن بن المصطفى بن متيلي بن أحمذنلل",spouses:["G43"]},
{id:"G44w1",name:"خدجية",g:"F",father:"V10",mother:"L23d1",note:"بنت محمذن بن باهنين — رابط بين الأسرتين",spouses:["G44"],crossLink:true},
{id:"G44d1",name:"فاطمة",g:"F",father:"G44",mother:"G44w1",note:"أم أم المؤمنين بنت سيد أحمد بن أبو الحس بن هادي بن بوزروق بن بوشنكور (الماح) بن محنض بن يدن يعقوب"},
{id:"G44d2",name:"فلانة",g:"F",father:"G44",mother:"G44w1",note:"لها عقب في أهل سيد الأمين بن أعمر"},
{id:"G46w1",name:"فاطمة",g:"F",father:"K58",mother:"K58w1",note:"بنت خير الورى بن سيد عبد الله بن محمد الكريم — رابط بين الأسرتين، confirmé par la note de K58 (« أم أبناء عبد الله جنك »)",spouses:["G45"],crossLink:true},
{id:"G46s1",name:"بوشامه",g:"M",father:"G45",mother:"G46w1",note:"لم يعقب"},
{id:"G46",para:46,name:"مدهي (محمد)",g:"M",father:"G45",mother:"G46w1",spouses:["G46w2","G46w3"]},
{id:"G46d1",name:"خيرا",g:"F",father:"G45",mother:"G46w1",note:"أم أبناء افرج الله بن المختار عالي -انكادس-"},
{id:"G46w2",name:"صفيه",g:"F",father:"XA1315",spouses:["G46"],ext:true},
{id:"G47",para:47,name:"سليمان",g:"M",father:"G46",mother:"G46w2",spouses:["G47w1"]},
{id:"G48",para:48,name:"سيد الأمين",g:"M",father:"G46",mother:"G46w2",spouses:["G48w1","G48w2"]},
{id:"G51",para:51,name:"محمذن ميلود",g:"M",father:"G46",mother:"G46w2",spouses:["G79d1"]},
{id:"G46w3",name:"فلانة",g:"F",father:"XA882",spouses:["G46"],ext:true},
{id:"G46d3",name:"فاطمة",g:"F",father:"G46",mother:"G46w3",note:"أم أبناء المختار بن اداعو بن انف بن أحسن"},
{id:"G47w1",name:"امنا",g:"F",father:"XA1318",spouses:["G47"],ext:true},
{id:"G47d1",name:"حنه",g:"F",father:"G47",mother:"G47w1",note:"لم تعقب"},
{id:"G47d2",name:"مريم",g:"F",father:"G47",mother:"G47w1",note:"لم تعقب"},
{id:"G48w1",name:"فلانة",g:"F",father:"XA503",spouses:["G48"],ext:true},
{id:"G49",para:49,name:"مناه (محمد سالم)",g:"M",father:"G48",mother:"G48w1",dates:"1385هـ/1965م –",spouses:["G49w1"]},
{id:"G48w2",name:"امتهه",g:"F",father:"G109",note:"زواج داخلي بالأسرة",spouses:["G48"]},
{id:"G48s1",name:"اشفغ",g:"M",father:"G48",mother:"G48w2",note:"لم يعقب"},
{id:"G48s2",name:"ذو النورين",g:"M",father:"G48",mother:"G48w2",note:"لم يعقب"},
{id:"G48d1",name:"فاطمة",g:"F",father:"G48",mother:"G48w2",note:"أم أحمد ومحمذن ابني عبيدا"},
{id:"G49w1",name:"فلانة -أولاد ارميث-",g:"F",father:null,spouses:["G49"]},
{id:"G50",para:50,name:"محمد",g:"M",father:"G49",mother:"G49w1",note:"رقم الفقرة مصحَّح؛ قراءة OCR تُبدل الصفر خمسةً" ,spouses:["G60d1","G50w2","G61d1"]},
{id:"G49d1",name:"السالكه",g:"F",father:"G49",mother:"G49w1",note:"لم تعقب"},
{id:"G50d1",name:"أم الخيري",g:"F",father:"G50",mother:"G60d1"},
{id:"G50d2",name:"خديجه",g:"F",father:"G50",mother:"G60d1"},
{id:"G50w2",name:"مريم",g:"F",father:null,note:"أم أبناء السالك بن سيد أحمد بن محمذن بن حمم بن انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم",spouses:["G50"]},
{id:"G51d1",name:"ابنت",g:"F",father:"G51",mother:"G79d1",note:"لم تعقب"},
{id:"G51d2",name:"امنه",g:"F",father:"G51",mother:"G79d1",note:"لم تعقب"},
{id:"G52w1",name:"فلانة",g:"F",father:null,spouses:["G52"]},
{id:"G53",para:53,name:"شنكيطا",g:"M",father:"G52",mother:"G52w1",spouses:["G53w1","G53w2"]},
{id:"G53w1",name:"امته",g:"F",father:"Y196",spouses:["G53"]},
{id:"G54",para:54,name:"فالن",g:"M",father:"G53",mother:"G53w1",spouses:["G54w1"]},
{id:"G53d1",name:"سالما",g:"F",father:"G53",mother:"G53w1",note:"لم تعقب"},
{id:"G53w2",name:"فلانة",g:"F",father:"XA1319",spouses:["G53"]},
{id:"G53d2",name:"مريم",g:"F",father:"G53",mother:"G53w2",note:"أم بنات الفالي بن احيدنا (محمذن) بن الأمين بن مودي مالك، وأم سعيد بن الأمين بن امام (امام الحرمين) بن عبد الله بن اشفغ مينحنو؛ زواج داخلي بالأسرة",spouses:["G24","G118"]},
{id:"G54w1",name:"فلانة -إلى محم",g:"F",father:"XA882",spouses:["G54"],ext:true},
{id:"G54s1",name:"ببكر",g:"M",father:"G54",mother:"G54w1",note:"لم يعقب"},
{id:"G55w1",name:"فلانة",g:"F",father:null,spouses:["G55"]},
{id:"G55d1",name:"حنه",g:"F",father:"G55",mother:"G55w1",note:"أم حبلل واسهيلو ابني آمين بن محمد الكريم، وأم فلانة بنت حبلل بن ميلود؛ أم حبلل واسهيلو ابني آمين بن محمد الكريم",spouses:["K50","L26"]},
{id:"G55w2",name:"فلانة",g:"F",father:"Y4",spouses:["G55"]},
{id:"G55d2",name:"فلانة",g:"F",father:"G55",mother:"G55w2",note:"لم تعقب"},
{id:"G56w1",name:"فلانة",g:"F",father:"Y11",spouses:["G56"]},
{id:"G57",para:57,name:"محمذن",g:"M",father:"G56",mother:"G56w1",spouses:["G57w1"]},
{id:"G56w2",name:"فلانة",g:"F",father:"XA831",spouses:["G56"],ext:true},
{id:"G83",para:83,name:"المزضف",g:"M",father:"G56",mother:"G56w2",spouses:["K9d1"]},
{id:"G57w1",name:"فلانة",g:"F",father:"XA834",mother:"I72d3",spouses:["G57"],ext:true},
{id:"G58",para:58,name:"آبود",g:"M",father:"G57",mother:"G57w1",spouses:["G58w1"]},
{id:"G69",para:69,name:"اعديج",g:"M",father:"G57",mother:"G57w1",spouses:["G69w1"]},
{id:"G57d1",name:"فلانة",g:"F",father:"G57",mother:"G57w1"},
{id:"G58w1",name:"خيرا",g:"F",father:"XA838",spouses:["G58"],ext:true},
{id:"G59",para:59,name:"محمذن",g:"M",father:"G58",mother:"G58w1",spouses:["G59w1","G59w2","G84d1"]},
{id:"G58d1",name:"ديد",g:"F",father:"G58",mother:"G58w1",note:"أم أبناء عالم بن محمد بن محمذن بن ابييب بن يالليل بن احموذيلل بن سيد (المختار) بن عبد الله؛ أم مريم تسعد بنت المريد (أحمد) بن اد (محدن) بن عبد الله بن اشفغ مينحنو — لم تعقب" ,spouses:["G6"] ,crossLink:true},
{id:"G59w1",name:"امنيانه",g:"F",father:"XA839",spouses:["G59"],ext:true},
{id:"G60",para:60,name:"سيد",g:"M",father:"G59",mother:"G59w1",dates:"1375هـ/1951م –",place:"المذرذره",spouses:["G60w1","G17d1"]},
{id:"G59s1",name:"المختار السالم",g:"M",father:"G59",mother:"G59w1",note:"لم يعقب"},
{id:"G59w2",name:"جامرميئذن",g:"F",father:"G84",spouses:["G59"]},
{id:"G65",para:65,name:"أحمد سالم",g:"M",father:"G59",mother:"G59w2",note:"رقم الفقرة مصحَّح؛ قراءة OCR تُبدل الصفر خمسةً" ,spouses:["G42d2"]},
{id:"G67",para:67,name:"امحمد",g:"M",father:"G59",mother:"G59w2",spouses:["G94d2"]},
{id:"G68",para:68,name:"الأمين",g:"M",father:"G59",mother:"G59w2",spouses:["G42d1","G42d2"]},
{id:"G59d1",name:"افيطيمه",g:"F",father:"G59",mother:"G59w2",note:"أم أبناء سيد أحمد لحبيب بن محمد بن سيد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين، وأم أبناء امام (امام الحرمين) بن عبد الله بن اشفغ مينحنو" ,spouses:["G28"] ,crossLink:true},
{id:"G60w1",name:"خدجية",g:"F",father:"G11",note:"زواج داخلي بالأسرة" ,spouses:["G60"]},
{id:"G61",para:61,name:"محمد",g:"M",father:"G60",mother:"G60w1",dates:"1429-1915هـ؟",place:"المذرذره",spouses:["G61w1","G29d1"]},
{id:"G64",para:64,name:"اباه",g:"M",father:"G60",mother:"G60w1",dates:"1348هـ/1935م – 1435هـ/2009م",place:"المذرذره",spouses:["G90d1","G64w2","G90d2"]},
{id:"G60d1",name:"فاطمة",g:"F",father:"G60",mother:"G60w1",dates:"1355هـ/1932م – 1435هـ/2014م",place:"المذرذره",note:"أم ففو وديدي وعائشة من أبناء محمد فال بن محمودن بن الأمين بن محمد بن حيب الله بن حرمه والمختار بن المعزوز بن اشفغ الأمين" ,spouses:["G50"] ,crossLink:true},
{id:"G61w1",name:"آمنة",g:"F",father:"G69",mother:"G69w1",spouses:["G61"]},
{id:"G61d1",name:"اطيمه (فاطمة)",g:"F",father:"G61",mother:"G61w1",note:"أم بنات محمد بن مناه (محمد سالم) بن سيد الأمين بن مدهي (محمد) بن عبد الله جنك بن المبارك بن محمد بن اشفغ مينحنو",spouses:["G50"]},
{id:"G62",para:62,name:"محمدن",g:"M",father:"G61",mother:"G29d1",dates:"1384هـ/1964م –",spouses:["G62w1","G62w2","G64d2"]},
{id:"G63",para:63,name:"يحي",g:"M",father:"G61",mother:"G29d1",dates:"1389هـ/1969م –",spouses:["G63w1"]},
{id:"G62w1",name:"خدجاين",g:"F",father:"G64",mother:"G64w2",note:"زواج داخلي بالأسرة" ,spouses:["G62"]},
{id:"G62s1",name:"ديدي",g:"M",father:"G62",mother:"G62w1",dates:"1425هـ؟"},
{id:"G62s2",name:"محمد يحي",g:"M",father:"G62",mother:"G62w1"},
{id:"G62w2",name:"فضيله",g:"F",father:"G64",mother:"G64w2",note:"زواج داخلي بالأسرة؛ أم محمد من أبناء محمدن بن محمد بن سيد بن محمذن بن آبود بن محمذن بن الأمين بن اشفغ مينحنو" ,spouses:["G62"]},
{id:"G62s3",name:"محمد",g:"M",father:"G62",mother:"G62w2"},
{id:"G63w1",name:"بنت الصربو",g:"F",father:"G90",mother:"G86d2",note:"زواج داخلي بالأسرة؛ أم أبناء يحي بن محمد بن سيد بن آبّود بن محمذن بن الأمين بن اشفغ مينحنو",dates:"1399هـ/1979م –" ,spouses:["G63"],fullName:"بنت الصربو بنت بدديه (محمدن) بن محمد بن بييين بن امحيد بن المزضف بن الأمين بن اشفغ مينحنو"},
{id:"G63d1",name:"البضعه",g:"F",father:"G63",mother:"G63w1",dates:"1426هـ؟"},
{id:"G63s1",name:"محسن",g:"M",father:"G63",mother:"G63w1"},
{id:"G63s2",name:"محمدن",g:"M",father:"G63",mother:"G63w1"},
{id:"G64d1",name:"أم الخيرات",g:"F",father:"G64",mother:"G90d1"},
{id:"G64w2",name:"فاطمة",g:"F",father:"G13",note:"زواج داخلي بالأسرة" ,spouses:["G64"],mother:"G13w1",dates:"1384هـ/1964م –"},
{id:"G64d2",name:"خدجاني",g:"F",father:"G64",mother:"G64w2",note:"أم ديدي ومحمد يحي من أبناء محمدن بن محمد بن سيد بن محمذن بن آبود بن محمذن بن الأمين بن اشفغ مينحنو",spouses:["G62"]},
{id:"G64d3",name:"تسلم",g:"F",father:"G64",mother:"G64w2"},
{id:"G64d5",name:"اسلم ارجالو",g:"F",father:"G64",mother:"G64w2"},
{id:"G64s1",name:"محمد",g:"M",father:"G64",mother:"G64w2"},
{id:"G66d1",name:"مريم فال",g:"F",father:"G66",mother:"G66w1",note:"أم أحمد بن النجيب بن أحمد بن محمذن بن محدي بن المختار بن الطالب اجود"},
{id:"G67s1",name:"محمذن",g:"M",father:"G67",mother:"G94d2",note:"لم يعقب"},
{id:"G67d1",name:"شت (عائشة)",g:"F",father:"G67",mother:"G94d2",note:"لم يعقب"},
{id:"G68s1",name:"الداه (احماده)",g:"M",father:"G68",mother:"G42d1",note:"لم يعقب"},
{id:"G68d1",name:"مريم فال",g:"F",father:"G68",mother:"G42d2",note:"لم تعقب"},
{id:"G69w1",name:"مريم",g:"F",father:"G5",mother:"G5w2",note:"زواج داخلي بالأسرة؛ أم أبناء اعديج بن محمذن بن الأمين بن اشفغ مينحنو" ,spouses:["G69"]},
{id:"G70",para:70,name:"أحمد سهل",g:"M",father:"G69",mother:"G69w1",spouses:["G70w1"]},
{id:"G69s1",name:"المبارك",g:"M",father:"G69",mother:"G69w1",note:"لم يعقب"},
{id:"G71",para:71,name:"محمد فال",g:"M",father:"G69",mother:"G69w1",spouses:["G71w1"]},
{id:"G79",para:79,name:"محمذن",g:"M",father:"G69",mother:"G69w1",spouses:["G79w1"]},
{id:"G69s2",name:"المختار آش",g:"M",father:"G69",mother:"G69w1",note:"لم يعقب"},
{id:"G69d1",name:"فاطمة",g:"F",father:"G69",mother:"G69w1",note:"أم أبناء محمد بن الخطاط"},
{id:"G70w1",name:"من مريم",g:"F",father:"XA816",spouses:["G70"],ext:true},
{id:"G70s1",name:"فالن",g:"M",father:"G70",mother:"G70w1",note:"لم يعقب"},
{id:"G70d1",name:"فاطمة",g:"F",father:"G70",mother:"G70w1",note:"لم يعقب"},
{id:"G71w1",name:"أم الحسين",g:"F",father:"G103",note:"زواج داخلي بالأسرة؛ أم ابني محمد فال بن اعديج بن محمذن بن الأمين بن اشفغ مينحنو" ,spouses:["G71","G29"] ,place:"أبير حيبلل" ,crossLink:true,mother:"G103w1"},
{id:"G72",para:72,name:"أحمد",g:"M",father:"G71",mother:"G71w1",spouses:["G72w1","G72w2"]},
{id:"G73",para:73,name:"محمذن ميلود",g:"M",father:"G71",mother:"G71w1",dates:"1355هـ/1936م –",spouses:["G73w1"]},
{id:"G72w1",name:"عيشه",g:"F",father:"XA387",spouses:["G72"],ext:true},
{id:"G72d1",name:"فاطمة",g:"F",father:"G72",mother:"G72w1",note:"أم أم الفضلي وأم العالي وشقيقتهما من أبناء سيد بن محمذن بن الصديق بن محمد الأمين بن ابي (المختار)"},
{id:"G72w2",name:"فلانة",g:"F",father:"XA842",spouses:["G72"],ext:true},
{id:"G72d2",name:"أم الحسين",g:"F",father:"G72",mother:"G72w2",note:"لم تعقب"},
{id:"G73w1",name:"أم المؤمنين",g:"F",father:"G46",mother:"G46w2",note:"زواج داخلي بالأسرة؛ أم أبناء محمذن ميلود بن محمد فال بن اعديج بن محمذن بن الأمين بن اشفغ مينحنو" ,spouses:["G73"]},
{id:"G74",para:74,name:"محمدن",g:"M",father:"G73",mother:"G73w1",spouses:["G74w1"]},
{id:"G78",para:78,name:"ولد ادن (أحمد)",g:"M",father:"G73",mother:"G73w1",dates:"1355هـ/1936م –",spouses:["G105d1"]},
{id:"G73d1",name:"خدج",g:"F",father:"G73",mother:"G73w1",note:"أم الداه بن أحمد ميلود بن المختار بن محمذن بن المصطفى بن الأمين اشفغ مينحنو"},
{id:"G74w1",name:"ميمهنه",g:"F",father:"Y115",mother:"Y115w1",place:"تنيخلف",spouses:["G74"]},
{id:"G75",para:75,name:"الخليفه",g:"M",father:"G74",mother:"G74w1",dates:"1359هـ/1938م –",note:"رقم الفقرة مصحَّح؛ قراءة OCR تُبدل الصفر خمسةً" ,spouses:["G70w2","G70w3","G106d1"]},
{id:"G76",para:76,name:"عبد الله",g:"M",father:"G74",mother:"G74w1",dates:"1428هـ؟",place:"دليلحو",spouses:["G76w1"]},
{id:"G74s1",name:"محمد فال",g:"M",father:"G74",mother:"G74w1",note:"لم يعقب"},
{id:"G70w2",name:"آمنة",g:"F",father:"G104s1s1",dates:"1375هـ/1951م –",spouses:["G75"]},
{id:"G70d2",name:"خديجه",g:"F",father:"G75",mother:"G70w2",dates:"1389هـ/1969م –",note:"أم أبناء محمدن بن أحمد بن ابو (محمد) بن أمين بن محمد بن محمذن بن عركاب (حمم) بن ابوبا (الأمين) بن ماهي" ,spouses:["P29"] ,crossLink:true},
{id:"G70w3",name:"ددانه (مرجانه)",g:"F",father:null,dates:"1396هـ/1976م –",note:"أم أبناء النعمان (محمذن) بن محمد بن أحمد (بداه) بن محمذن بن أحمد فال بن الفالي بن المبارك بن اما (الماقور)",spouses:["G75"]},
{id:"G70d4",name:"اميه",g:"F",father:"G75",mother:"G70w3",dates:"1399هـ/1979م –",note:"أم أبناء محمد بن محمد فال بن بگي بن أحمد سالم بن الحسن بن حيب الله بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",spouses:["Y67"],crossLink:true},
{id:"G75s1",name:"سرور (محمد سالم)",g:"M",father:"G75",mother:"G70w3",dates:"1455هـ؟"},
{id:"G70s2",name:"ولد الحسن",g:"M",father:"G75",mother:"G70w3",dates:"1457هـ؟"},
{id:"G70d5",name:"هدى",g:"F",father:"G75",mother:"G70w3",dates:"1993م –"},
{id:"G76w1",name:"ددانه (مرجانه)",g:"F",father:"Z80",mother:"Z80w1",note:"بنت الأمين بن أحمد بن ابن عبدم بن عبد الله بن الأمين بن حمم بن أبو الحس بن المزضف — رابط بين الأسرتين",dates:"1364هـ/1945م – 1402هـ/1982م",place:"أبير حيبلل",spouses:["G76"],crossLink:true},
{id:"G76s1",name:"حباه (محمد الحبيب)",g:"M",father:"G76",mother:"G76w1",dates:"1427هـ؟",place:"أبير حيبلل",note:"لم يعقب"},
{id:"G77",para:77,name:"سيد محمود",g:"M",father:"G76",mother:"G76w1",dates:"1392هـ/1972م –",spouses:["G77w1"]},
{id:"G76s2",name:"أحمد",g:"M",father:"G76",mother:"G76w1",dates:"1451هـ؟"},
{id:"G77w1",name:"اناه",g:"F",father:"Z81",mother:"Z81w1",note:"بنت عبد الله بن الأمين بن أحمد بن ابن عبدم بن عبد الله بن الأمين بن حمم بن أبو الحس بن المزضف — رابط بين الأسرتين",dates:"1397هـ/1977م –",spouses:["G77"],crossLink:true},
{id:"G77s1",name:"جمال",g:"M",father:"G77",mother:"G77w1",dates:"1422هـ؟"},
{id:"G77d1",name:"عائشة",g:"F",father:"G77",mother:"G77w1"},
{id:"G78d1",name:"فاطمة",g:"F",father:"G78",mother:"G105d1",note:"لم تعقب"},
{id:"G79w1",name:"مريم",g:"F",father:"R65",mother:"R65w1",spouses:["G79"]},
{id:"G80",para:80,name:"محمد",g:"M",father:"G79",mother:"G79w1",spouses:["G80w1","G80w2"]},
{id:"G79d1",name:"فاطمه فال",g:"F",father:"G79",mother:"G79w1",note:"أم بنيت محمذن ميلود بن مدهي (محمد) بن عبد الله جنك بن المبارك بن محمد بن اشفغ مينحنو" ,spouses:["G51"] ,crossLink:true},
{id:"G80w1",name:"صفيه",g:"F",father:"XA1324",spouses:["G80"],ext:true},
{id:"G81",para:81,name:"امين",g:"M",father:"G80",mother:"G80w1",spouses:["G81w1"]},
{id:"G80d1",name:"عيشه",g:"F",father:"G80",mother:"G80w1",note:"أم مهت بن السالك بن أحمذ بن الحسن بن عمر بن محمذن بن الماح بن المختار بن محنض بن الحسن دوبك"},
{id:"G80w2",name:"اطفيله",g:"F",father:"XA1327",spouses:["G80"],ext:true},
{id:"G80d2",name:"فاطمة",g:"F",father:"G80",mother:"G80w2",note:"لم تعقب"},
{id:"G81w1",name:"بنت خويلد",g:"F",father:"K152s1s1s1s1",spouses:["G81"]},
{id:"G81d1",name:"مريم",g:"F",father:"G81",mother:"G81w1",dates:"1378هـ/1959م –",note:"أم بنات مهت بن السالك بن أحمذ بن الحسن بن عمر بن محمذن بن الماح بن المختار بن محنض بن الحسن دوبك",spouses:["XA859"]},
{id:"G82",para:82,name:"محمد فال",g:"M",father:"G81",mother:"G81w1",dates:"1381هـ/1962م –",spouses:["G82w1"]},
{id:"G82w1",name:"فلانة",g:"F",father:null,spouses:["G82"]},
{id:"G82s1",name:"امين",g:"M",father:"G82",mother:"G82w1"},
{id:"G82s2",name:"الشيخ",g:"M",father:"G82",mother:"G82w1"},
{id:"G82s3",name:"محمد",g:"M",father:"G82",mother:"G82w1"},
{id:"G82d1",name:"فائزة",g:"F",father:"G82",mother:"G82w1"},
{id:"G84",para:84,name:"احميد",g:"M",father:"G83",mother:"K9d1",spouses:["G84w1"]},
{id:"G93",para:93,name:"محمذن",g:"M",father:"G83",mother:"K9d1",spouses:["E42d2"]},
{id:"G84w1",name:"امي",g:"F",father:"I25",spouses:["G84"],crossLink:true,mother:"I25w1",note:"أم بييين وجامزمئذن ابني احميّد بن المزضف بن الأمين بن اشفغ مينحنو"},
{id:"G85",para:85,name:"بييين",g:"M",father:"G84",mother:"G84w1",note:"رقم الفقرة مصحَّح؛ قراءة OCR تُبدل الصفر خمسةً" ,spouses:["G86w0","I4d1"]},
{id:"G84d1",name:"جامريمئذن",g:"F",father:"G84",mother:"G84w1",note:"أم الأمين واحممد وأحمد سالم وأم المؤمنين وافيطيمو من أبناء محمذن بن آبود بن محمذن بن الأمين بن اشفغ مينحنو",spouses:["G59"]},
{id:"G86w0",name:"فاطمة",g:"F",father:"Y25",spouses:["G85"]},
{id:"G80s1",name:"سيد آب",g:"M",father:"G85",mother:"G86w0",note:"لم يعقب"},
{id:"G86",para:86,name:"ابيد (بزيد)",g:"M",father:"G85",mother:"I4d1",dates:"1362هـ/1943م –",spouses:["G116d2","I4d1"]},
{id:"G80s2",name:"ببكر",g:"M",father:"G85",mother:"I4d1",note:"لم يعقب"},
{id:"G89",para:89,name:"محمد",g:"M",father:"G85",mother:"I4d1",dates:"1355هـ/1936م –",spouses:["E57d1","G89w2"]},
{id:"G91",para:91,name:"واللي (سيد الفالي)",g:"M",father:"G85",mother:"I4d1",dates:"1323هـ/1955م؟ – 1377هـ/1958م",place:"أبير حيبلل",spouses:["G91w1"]},
{id:"G80d2b",name:"فاطمتين",g:"F",father:"G85",mother:"I4d1",note:"أم اباه بن تياه بن محمذن بن أحمد بن ون (محمذن) بن أحمد زروق؛ أم محمذن ومريم ابني محمد عالي بن حمم بن محمذن بن حلويج بن العاذل بن اما (الماقور) — لم يعقبا" ,spouses:["R61"] ,crossLink:true},
{id:"G80d3",name:"عائشة",g:"F",father:"G85",mother:"G86w0",note:"لم تعقب"},
{id:"G87",para:87,name:"محمد فال",g:"M",father:"G86",mother:"G116d2",dates:"1341هـ/1923م – 1424هـ/2003م",place:"دليلحو",spouses:["G29d1","G87w2"]},
{id:"G86d1",name:"ابنيه",g:"F",father:"G86",mother:"I4d1",note:"لم تعقب"},
{id:"G86d2",name:"فاطمة",g:"F",father:"G86",mother:"G116d2",note:"أم أبناء بدديه (محمدن) بن محمد بن بييين بن امحيد بن المزضف بن الأمين بن اشفغ مينحنو؛ زواج داخلي بالأسرة",spouses:["G90"],fullName:"فاطمة بنت ابيد (بزيد) بن بييين بن امحيد بن المزضف بن الأمين بن اشفغ مينحنو"},
{id:"G88",para:88,name:"أحمد",g:"M",father:"G87",mother:"G29d1",dates:"1378هـ/1959م –",spouses:["G88w1"]},
{id:"G87w2",name:"ت (فاطمه فال)",g:"F",father:"Y38",mother:"Y38w1",dates:"1365هـ/1946م؟ – 1435هـ/2014م",place:"دليلحو",spouses:["G87"]},
{id:"G87d2",name:"احيها",g:"F",father:"G87",mother:"G87w2",dates:"1385هـ/1965م –",note:"أم السيد أحمد وعائشة من أبناء محمد بن عبد الله بن محمد فال بن باب بن أحمد بيب بن عثمان بن سيد محمد بن عبد الرحمن"},
{id:"G87d3",name:"عائشة",g:"F",father:"G87",mother:"G87w2",dates:"1387هـ/1967م –"},
{id:"G87d4",name:"خديجة",g:"F",father:"G87",mother:"G87w2",dates:"1394هـ/1974م –"},
{id:"G88w1",name:"لبيكه",g:"F",father:"G13",mother:"G13w1",note:"زواج داخلي بالأسرة" ,spouses:["G88"],fullName:"لبيكه بنت اسلم بن سيد محمدين بن أحمد بن امام (امام الحرمين) بن عبد الله بن اشفغ مينحنو"},
{id:"G88s1",name:"عبد",g:"M",father:"G88",mother:"G88w1",dates:"1422هـ؟"},
{id:"G88s2",name:"يحي",g:"M",father:"G88",mother:"G88w1",dates:"1424هـ؟"},
{id:"G88d1",name:"صفيه",g:"F",father:"G88",mother:"G88w1",dates:"1426هـ؟"},
{id:"G90",para:90,name:"بدديه (محمدن)",g:"M",father:"G89",mother:"E57d1",dates:"1341هـ/1923م – 1428هـ/2007م",place:"أبير حيبلل",spouses:["G86d2"]},
{id:"G95Bd1",name:"ام النبي",g:"F",father:"G90",mother:"G86d2",dates:"1384هـ/1964م – 1454هـ/1984م",note:"لم تعقب"},
{id:"G90s1",name:"احمد",g:"M",father:"G90",mother:"G86d2",dates:"1389هـ/1969م –"},
{id:"G89d1",name:"امه",g:"F",father:"G89",mother:"E57d1",dates:"1345هـ/1927م – 1437هـ/2015م",place:"أبير حيبلل",note:"أم أبناء أمين بن العالم بن أحمد بن العالم بن سيد عالم",spouses:["XA847"]},
{id:"G89w2",name:"مريم",g:"F",father:null,dates:"1349هـ/1931م – 1436هـ/2015م",place:"أبير حيبلل",note:"أم أم الخيرات وتوت (خدجية) من بنات كاكاه (ببكر) بن اميو (محمذن) بن سيد أحممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم",spouses:["G89"]},
{id:"G91w1",name:"منصوره",g:"F",father:"G112",note:"زواج داخلي بالأسرة",dates:"1377هـ/1958م –",place:"أبير حيبلل" ,spouses:["G91"]},
{id:"G92",para:92,name:"محمد",g:"M",father:"G91",mother:"G91w1",dates:"1351هـ/1935م –",spouses:["G92w1","G92w2","G92w3","G92w4"]},
{id:"G91d2",name:"خديجة",g:"F",father:"G91",mother:"G91w1",dates:"1357هـ/1938م – 1391هـ/2012م",place:"أبير حيبلل",note:"أم أحمد من أبناء امفال (محمد فال) بن أحمد بن البناني بن محمد فال بن ابن غازي بن آلچ (الفالي)",spouses:["J18"]},
{id:"G92w1",name:"سلمه",g:"F",father:"I38",dates:"1372هـ/1953م –",spouses:["G92"],fullName:"سلمه بنت السيد بن اميو (محمذن) بن سيد أحممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم",mother:"I38w1",note:"أم سهام وعائشة ومريم من أبناء محمد بن والّيل (سيد الفالي) بن بييين بن احميّد بن المزضف بن الأمين بن اشفغ مينحنو"},
{id:"G92w2",name:"منت اباه",g:"F",father:"XA847",mother:"G89d1",dates:"1365هـ/1946م –",spouses:["G92"],ext:true},
{id:"G92d2",name:"منى",g:"F",father:"G92",mother:"G92w2",dates:"1458هـ؟",note:"أم أبناء أحمد بن الربا بن اميني (الأمين) بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"G92w3",name:"طيما",g:"F",father:"F82",dates:"1375هـ/1951م –",note:"رابط بين الأسرتين محتمل",spouses:["G92"]},
{id:"G92d3",name:"لبنيك (خديجة)",g:"F",father:"G92",mother:"G92w3",dates:"1412هـ/1992م –",note:"أم بنات ابو (لمرابط) بن محمد بن السيد بن اسلم بن سيد الفالي بن محمذن بن عركاب (حمم) بن ابوبا بن ماهي"},
{id:"G92w4",name:"النجاح",g:"F",father:"G11s3",note:"زواج داخلي بالأسرة",dates:"1332هـ؟" ,spouses:["G92"]},
{id:"G92s1",name:"سيد الفالي",g:"M",father:"G92",mother:"G92w4"},
{id:"G92s2",name:"يسلم",g:"M",father:"G92",mother:"G92w4"},
{id:"G92d4",name:"فاطمة",g:"F",father:"G92",mother:"G92w4"},
{id:"G94",para:94,name:"المختار",g:"M",father:"G93",mother:"E42d2",spouses:["G41d1"]},
{id:"G97",para:97,name:"محمد",g:"M",father:"G93",mother:"E42d2",spouses:["G97w1","G97w2"]},
{id:"G93d1",name:"سالما",g:"F",father:"G93",mother:"E42d2",note:"لم تعقب"},
{id:"G95",para:95,name:"أحمد ميلود",g:"M",father:"G94",mother:"G41d1",note:"رقم الفقرة مصحَّح؛ قراءة OCR تُبدل الصفر خمسةً" ,spouses:["G96w1"]},
{id:"G94s1",name:"عبد الله",g:"M",father:"G94",mother:"G41d1",note:"لم يعقب"},
{id:"G94d1",name:"فاطمة",g:"F",father:"G94",mother:"G41d1",note:"أم ميي بنت سيديا بن محمذن فال بن سيد بن المبارك بن باب الدين بن اشفغ الأمين، وأم فلانة بنت عبد الرحمن بن أحمذ بن المامي بن أحمد ميلود بن اشفغ مينحنو" ,spouses:["G40"] ,crossLink:true},
{id:"G94d2",name:"مريم",g:"F",father:"G94",mother:"G41d1",note:"لم تعقب" ,spouses:["G67"] ,crossLink:true},
{id:"G96w1",name:"خدج",g:"F",father:"G73",spouses:["G95"]},
{id:"G96",para:96,name:"الداه",g:"M",father:"G95",mother:"G96w1",spouses:["G96w2"]},
{id:"G90d1",name:"فاطمة",g:"F",father:"G95",mother:"G96w1",note:"أم الحسين وأم الحسن ابني أحمد بن امبريك بن أحمد بن ياوليد بن حبيبنا بن الفالي بن باب أحمد" ,spouses:["G64"] ,crossLink:true},
{id:"G90d2",name:"أم الخيرات",g:"F",father:"G95",mother:"G96w1",note:"أم أبناء اباه بن سيد بن محمذن بن آبود — يحقق",spouses:["G64"]},
{id:"G96w2",name:"فلانة -مالي-",g:"F",father:null,spouses:["G96"]},
{id:"G96s1",name:"محمد",g:"M",father:"G96",mother:"G96w2",note:"لم يعقب"},
{id:"G97w1",name:"امنيانه",g:"F",father:"L4",note:"نُسبت خطأً إلى L4 كزوجة (تصحيح): الفقرة 4 لا تذكرها. والدها غير محقق",spouses:["G97"],crossLink:true},
{id:"G97s1",name:"امد",g:"M",father:"G97",mother:"G97w1",note:"لم يعقب"},
{id:"G97s2",name:"المختار",g:"M",father:"G97",mother:"G97w1",note:"لم يعقب"},
{id:"G97w2",name:"مريم",g:"F",father:null,note:"أم محمذن وشت (عيشة) ابني احممد بن محمذن بن آبود بن محمذن بن الأمين بن اشفغ مينحنو",spouses:["G97"]},
{id:"G97d1",name:"أم النبي",g:"F",father:"G97",mother:"G97w1",note:"لم تعقب"},
{id:"G98w1",name:"فلانة",g:"F",father:"G36",mother:"G36w1",spouses:["G98"],fullName:"فلانة بنت محمد بن اشفغ ايتجمذن (أحمد) بن يعقوب بن يضهنض"},
{id:"G98d1",name:"مريمنا",g:"F",father:"G98",mother:"G98w1",note:"أم أبناء سيدنا بن محنض اشفغ بن الفالي بن باركلل بن يقبنلل"},
{id:"G99w1",name:"فلانة",g:"F",father:"Y4",spouses:["G99"]},
{id:"G100",para:100,name:"احيدنا (محمذن)",g:"M",father:"G99",mother:"G99w1",spouses:["G100w1"]},
{id:"G99w2",name:"فلانة",g:"F",father:"G36",mother:"G36w1",spouses:["G99"],fullName:"فلانة بنت محمد بن اشفغ المختار بن اشفغ ايتجمذن (أحمد) بن يعقوب بن اشفغ يضهنض بن مهنض امغر"},
{id:"G100w1",name:"فلانة",g:"F",father:null,spouses:["G100"]},
{id:"G101",para:101,name:"تنواجيه",g:"M",father:"G100",mother:"G100w1",spouses:["G101w1"]},
{id:"G102",para:102,name:"عبدي",g:"M",father:"G100",mother:"G100w1",spouses:["G102w1"]},
{id:"G118",para:118,name:"الفالي",g:"M",father:"G100",mother:"G100w1",spouses:["G53d2","G118w2"]},
{id:"G119",para:119,name:"المختار صمب",g:"M",father:"G100",mother:"G100w1",spouses:["Y125d1"]},
{id:"G120",para:120,name:"الأمين",g:"M",father:"G100",mother:"G100w1",spouses:["G120w1","G120w2"]},
{id:"G100d1",name:"متها",g:"F",father:"G100",mother:"G100w1",note:"أم أبناء الفالي بن المختار بن حمم سعيد",spouses:["XA493"]},
{id:"G101w1",name:"فلانة",g:"F",father:null,spouses:["G101"]},
{id:"G101d1",name:"فلانة",g:"F",father:"G101",mother:"G101w1",note:"أم بنات اسويدي بن الأمين بن خيلوم (خير الأنام) بن محمد بن المزضف — لم يعقبن",spouses:["Z6"]},
{id:"G102w1",name:"فاطمة لمرابطو",g:"F",father:"XA1334",spouses:["G102"],ext:true},
{id:"G103",para:103,name:"حيب الله",g:"M",father:"G102",mother:"G102w1",spouses:["G103w1"]},
{id:"G111",para:111,name:"المختار",g:"M",father:"G102",mother:"G102w1",spouses:["G111w1","G111w2"]},
{id:"G114",para:114,name:"الأمين",g:"M",father:"G102",mother:"G102w1" ,spouses:["G114w1","G114w2"]},
{id:"G110",para:110,name:"محمذن",g:"M",father:"G102",mother:"G102w1" ,spouses:["G110w1"]},
{id:"G103w1",name:"امباركه",g:"F",father:"XA849",spouses:["G103"],ext:true},
{id:"G103s1",name:"اجدادهم",g:"M",father:"G103",mother:"G103w1",note:"لم يعقب"},
{id:"G104",para:104,name:"محمذن",g:"M",father:"G103",mother:"G103w1",spouses:["G104w1","G24d2"]},
{id:"G109",para:109,name:"المختار",g:"M",father:"G103",mother:"G103w1",spouses:["G109w1","G109w2"]},
{id:"G103d2",name:"ميمهنه",g:"F",father:"G103",mother:"G103w1",note:"لم تعقب"},
{id:"G104w1",name:"خدجية",g:"F",father:"G24",note:"زواج داخلي بالأسرة" ,spouses:["G104"]},
{id:"G105",para:105,name:"اسلامه",g:"M",father:"G104",mother:"G104w1",spouses:["G16d1"]},
{id:"G108",para:108,name:"باب",g:"M",father:"G104",mother:"G104w1" ,spouses:["G112d1"]},
{id:"G106",para:106,name:"محمد سالم",g:"M",father:"G105",mother:"G16d1",dates:"1333هـ/1955م؟ – 1452هـ/1982م",spouses:["G106w1","G106w2"]},
{id:"G105d1",name:"تت",g:"F",father:"G105",mother:"G16d1",note:"أم أم الخيرات بنت محمد بشا بن سيد الأمين بن المختار بن سيد لغليظ بن متيلي بن أحمد بن الحسن دوبك؛ أم فاطمة بنت أحمد (ولد ادن) بن محمذن ميلود بن محمد فال بن اعديح بن محمذن بن الأمين بن اشفغ مينحنو — لم تعقب؛ زواج داخلي بالأسرة",spouses:["G78"]},
{id:"G105d2",name:"فاطمة",g:"F",father:"G105",mother:"G16d1",note:"لم تعقب"},
{id:"G106w1",name:"افّيه (صفيه)",g:"F",father:"G91",mother:"G91w1",note:"زواج داخلي بالأسرة؛ أم بد (محمذ) بن أحمد بن بد بن الربا بن بگي (أبوبكر) بن سيد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",dates:"1343هـ/1925م – 1427هـ/2006م",place:"أبير حيبلل" ,spouses:["G106","K34"],fullName:"افيه (صفيه) بنت واللي (سيد الفالي) بن بييين بن امحيد بن المزضف بن الأمين بن اشفغ مينحنو"},
{id:"G106d1",name:"آمنة",g:"F",father:"G106",mother:"G106w1",dates:"1375هـ/1951م –",note:"أم أبناء الخليفه بن محمدن بن محمذن ميلود بن محمد فال بن اعديج بن محمذن بن الأمين بن اشفغ مينحنو",spouses:["G75"]},
{id:"G106w2",name:"فاطمة",g:"F",father:null,dates:"1372هـ/1953م –",note:"أم محمد المختار من أبناء أحمد بن عبد الله بن محمد فال بن باب بن أحمد بيب بن عثمان بن سيد محمد بن عبد الرحمن",spouses:["G106"]},
{id:"G107",para:107,name:"عبد الله",g:"M",father:"G106",mother:"G106w1",dates:"1376هـ/1957م –",spouses:["G107w1","G107w2","G107w3","G107w4"]},
{id:"G107w1",name:"السالمه -كنتو-",g:"F",father:null,spouses:["G107"]},
{id:"G107d1",name:"صفيه",g:"F",father:"G107",mother:"G107w1"},
{id:"G107d2",name:"مريم",g:"F",father:"G107",mother:"G107w1"},
{id:"G107s1",name:"محمد سالم",g:"M",father:"G107",mother:"G107w1"},
{id:"G107w2",name:"امنيصريه",g:"F",father:"XA851",spouses:["G107"],ext:true},
{id:"G107d3",name:"عيشه",g:"F",father:"G107",mother:"G107w2"},
{id:"G107d4",name:"آمنة",g:"F",father:"G107",mother:"G107w2"},
{id:"G107s2",name:"علي الرضى",g:"M",father:"G107",mother:"G107w2"},
{id:"G107w3",name:"فلانة -ادكجملو-",g:"F",father:null,spouses:["G107"]},
{id:"G107d5",name:"منصوره",g:"F",father:"G107",mother:"G107w3"},
{id:"G107w4",name:"رقيه",g:"F",father:"XA859",mother:"G81d1",spouses:["G107"],ext:true},
{id:"G107s3",name:"اباه",g:"M",father:"G107",mother:"G107w4"},
{id:"G108w1",name:"مريم",g:"F",father:"G112",note:"زواج داخلي بالأسرة"},
{id:"G108s1",name:"محمد",g:"M",father:"G108",mother:"G112d1",note:"لم يعقب"},
{id:"G108d1",name:"أم الخيري",g:"F",father:"G108",mother:"G112d1",place:"أبير حيبلل",note:"أم أبناء شماد بن الأمين بن امام (امام الحرمين) بن عبد الله بن اشفغ مينحنو"},
{id:"G108s2",name:"فالن",g:"M",father:"G108",mother:"G112d1",note:"لم يعقب"},
{id:"G108d2",name:"فلانة",g:"F",father:"G108",mother:"G112d1",note:"لم تعقب"},
{id:"G109w1",name:"فلانة",g:"F",father:"XA860",spouses:["G109"],ext:true},
{id:"G109d1",name:"امتنا",g:"F",father:"G109",mother:"G109w1",note:"أم فاطمة بنت سيد الأمين بن مدهي (محمد) بن عبد الله جنك بن المبارك بن محمد بن اشفغ مينحنو"},
{id:"G109w2",name:"فاطمة",g:"F",father:"XA865",spouses:["G109"],ext:true},
{id:"G109d2",name:"أم الخيرات",g:"F",father:"G109",mother:"G109w2",note:"لم تعقب"},
{id:"G110w1",name:"فلانة",g:"F",father:null,spouses:["G110"]},
{id:"G110d1",name:"فاطمة",g:"F",father:"G110",mother:"G110w1",note:"أم خدجية بنت عبدك بن محمذن بن امحيد بن محمد الهدى بن محنض الكوري بن اوباك"},
{id:"G111w1",name:"أم المؤمنين",g:"F",father:"XA863",spouses:["G111"],ext:true},
{id:"G112",para:112,name:"احبيب",g:"M",father:"G111",mother:"G111w1",spouses:["G112w2","G112w1","G112w3"]},
{id:"G111w2",name:"خدجية -تندغو-",g:"F",father:null,spouses:["G111"]},
{id:"G111s1",name:"أحمد",g:"M",father:"G111",mother:"G111w2",note:"لم يعقب"},
{id:"G111s2",name:"ببكر",g:"M",father:"G111",mother:"G111w2",note:"لم يعقب"},
{id:"G113",para:113,name:"محمد",g:"M",father:"G111",mother:"G111w2",spouses:["G113w1"]},
{id:"G112w1",name:"صفيه",g:"F",father:"XA1289",spouses:["G112"],ext:true},
{id:"G112s1",name:"الجد",g:"M",father:"G112",mother:"G112w1",note:"لم يعقب"},
{id:"G112d1",name:"أم المؤمنين",g:"F",father:"G112",mother:"G112w1",note:"أم بعض أبناء باب بن محمذن بن حبيب الله بن عبدي بن احيدنا (محمذن) بن الأمين بن مودي مالك — لم يعقبوا؛ زواج داخلي بالأسرة",spouses:["G108"]},
{id:"G112w2",name:"مريم",g:"F",father:null,note:"أم محمد وأم الخيرات وأم المؤمنين من أبناء باب بن محمذن بن حبيب الله بن عبدي بن احيدنا (محمذن) بن الأمين بن مودي مالك",spouses:["G112"]},
{id:"G112w3",name:"منصوره",g:"F",father:null,dates:"1377هـ/1958م –",place:"أبير حيبلل",note:"أم أبناء واللي (سيد الفالي) بن بييين بن امحيد بن المزضف بن الأمين بن اشفغ مينحنو",spouses:["G112"]},
{id:"G113w1",name:"فلانة",g:"F",father:null,spouses:["G113"]},
{id:"G113s1",name:"ابش",g:"M",father:"G113",mother:"G113w1",note:"لم يعقب"},
{id:"G113s2",name:"المبارك",g:"M",father:"G113",mother:"G113w1",note:"لم يعقب"},
{id:"G113s3",name:"سيد الفالي",g:"M",father:"G113",mother:"G113w1",note:"لم يعقب"},
{id:"G113d1",name:"ميمهنه",g:"F",father:"G113",mother:"G113w1",note:"لم تعقب"},
{id:"G114w1",name:"أم الكيد",g:"F",father:"G118",mother:"G53d2",note:"زواج داخلي بالأسرة؛ أم اسويلم بن الأمين بن عبدي بن احيدنا (محمذن) بن الأمين بن مودي مالك" ,spouses:["G114"]},
{id:"G115",para:115,name:"اسويلم",g:"M",father:"G114",mother:"G114w1",spouses:["G115w1"]},
{id:"G114w2",name:"آمجه (مريم)",g:"F",father:"XA650",spouses:["G114"],ext:true},
{id:"G114d1",name:"فاطما",g:"F",father:"G114",mother:"G114w2",note:"أم اواه (محمد سعيد) ومحمذن وآمو وصفيو وأم المؤمنين من أبناء التاه (المختار) بن اواه (حمم سعيد) بن محمد اليدالي بن المختار بن حمم سعيد"},
{id:"G115w1",name:"خدجية",g:"F",father:"XA866",spouses:["G115"],ext:true},
{id:"G116",para:116,name:"احبيب",g:"M",father:"G115",mother:"G115w1",spouses:["G116w1"]},
{id:"G115s1",name:"أحمد سالم",g:"M",father:"G115",mother:"G115w1",note:"لم يعقب"},
{id:"G117",para:117,name:"محمد",g:"M",father:"G115",mother:"G115w1",spouses:["G117w1"]},
{id:"G116w1",name:"ميه",g:"F",father:"XA1338",spouses:["G116"],ext:true},
{id:"G116d1",name:"امنيحه",g:"F",father:"G116",mother:"G116w1",note:"لم تعقب"},
{id:"G116d2",name:"مريم تنصر",g:"F",father:"G116",mother:"G116w1",note:"أم فاطمة من أبناء ابيد (بزيد) بن بييين بن امحيد بن المزضف بن الأمين بن اشفغ مينحنو؛ زواج داخلي بالأسرة",spouses:["G86"]},
{id:"G117w1",name:"امي",g:"F",father:"V1",spouses:["G117"],ext:true},
{id:"G117s1",name:"أحمد سالم",g:"M",father:"G117",mother:"G117w1",note:"لم يعقب"},
{id:"G118w2",name:"امي",g:"F",father:null,note:"أم محمد وببكر ومريم من أبناء الأمين بن امام (امام الحرمين) بن عبد الله بن اشفغ مينحنو",spouses:["G118"]},
{id:"G118d2",name:"عيشه",g:"F",father:"G118",mother:"G118w2",note:"لم تعقب"},
{id:"G119d1",name:"يامني (مريم)",g:"F",father:"G119",mother:"Y125d1",note:"أم باكا (المختار) ومحمذن فال وبنت وهب ودلونكو ومانو من أبناء سيد بن اما بن الأمين بن أحمد شينان بن بوشنكور بن محنض يدن يعقوب"},
{id:"G120w1",name:"فلانة",g:"F",father:null,spouses:["G120"]},
{id:"G121",para:121,name:"شداد",g:"M",father:"G120",mother:"G120w1",spouses:["G121w1"]},
{id:"G120w2",name:"فلانة",g:"F",father:"G18",mother:"G18w1",note:"زواج داخلي بالأسرة",spouses:["G120"]},
{id:"G121w1",name:"فلانة",g:"F",father:null,spouses:["G121"]},
{id:"G122",para:122,name:"محمذن فال",g:"M",father:"G121",mother:"G121w1",spouses:["G122w1"]},
{id:"G122w1",name:"فلانة",g:"F",father:null,spouses:["G122"]},
{id:"G122s1",name:"اشفغ",g:"M",father:"G122",mother:"G122w1",note:"لم يعقب"},
{id:"Y24w1",name:"ام هاني",g:"F",father:"Y119",spouses:["Y24"],mother:"Y119w1",note:"أم جد أم بن بابكر بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"Y26",para:26,name:"محمد فال",g:"M",father:"Y25",mother:"Z70d3",dates:"1334هـ/1916م –",place:"اكدرنيت",spouses:["Y26w1","Y26w2"]},
{id:"Y25s1",name:"المختار باب",g:"M",father:"Y25",mother:"Z70d3",note:"لم يعقب"},
{id:"Y25w2",name:"بنت وهب (ام النبي)",g:"F",father:"XA871",spouses:["Y25"],ext:true},
{id:"Y29",para:29,name:"محمدن",g:"M",father:"Y25",mother:"Y25w2",spouses:["Y33d1"]},
{id:"Y25w3",name:"مريم",g:"F",father:"Y15",spouses:["Y25"],mother:"Y15w1",note:"أم فاطمة من أبناء جدام بن بابكر بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"Y25d1",name:"فاطمة",g:"F",father:"Y25",mother:"Y25w3",note:"أم سيد آب من أبناء بييين بن امحيّد بن المصطفى بن الأمين بن اشفغ مينحنو — لم يعقب"},
{id:"Y26w1",name:"اعويشه",g:"F",father:"Z69",mother:"Z69w1",note:"رابط بين الأسرتين محتمل",spouses:["Y26"],crossLink:true,fullName:"اعويشه بنت عبد الرحمن بن أحمد بن محمد الباقر بن حمم بن أبو الحس بن المزضف"},
{id:"Y26w2",name:"خدجية",g:"F",father:"XA876",spouses:["Y26"],ext:true},
{id:"Y27",para:27,name:"محمذن السالم",g:"M",father:"Y26",mother:"Y26w2",dates:"1355هـ/1936م –",spouses:["Y27w1"]},
{id:"Y26s1",name:"المختار السالم",g:"M",father:"Y26",mother:"Y26w2",note:"لم يعقب"},
{id:"Y26d2",name:"امباركه",g:"F",father:"Y26",mother:"Y26w2",dates:"1310هـ/1893م – 1401هـ/1981م",place:"أبير حيبلل",note:"أم أبناء محمد بن سيد بن محيين (محمد) بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"Y26d3",name:"ميّم (مريم)",g:"F",father:"Y26",mother:"Y26w2",dates:"1392هـ/1972م –",note:"لم تعقب"},
{id:"Y27w1",name:"السالكه",g:"F",father:"XA877",spouses:["Y27"],ext:true},
{id:"Y27d1",name:"مريم",g:"F",father:"Y27",mother:"Y27w1",dates:"1341هـ/1923م – 1433هـ/2012م",place:"دليلحو",note:"أم أبناء محمد اسلم بن أحمذ بن السماني بن محمذن بن أحمد ميلود بن محنض؛ أم النامي بن محمد الأمين بن محي الله -اديقب-؛ أم بنت الخير من أبناء محين بن الصالح بن محمد بن بكاك (ببكر) بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز"},
{id:"Y28",para:28,name:"ببكر السالم",g:"M",father:"Y26",spouses:["Y145d1"]},
{id:"Y28d1",name:"خديج",g:"F",father:"Y28",mother:"Y145d1",note:"لم تعقب"},
{id:"Y29d1",name:"فلانة",g:"F",father:"Y29",mother:"Y33d1",note:"لم تعقب"},
{id:"Y29d2",name:"فلانة",g:"F",father:"Y29",mother:"Y33d1",note:"لم تعقب"},
{id:"Y30w1",name:"امّي (صفيه)",g:"F",father:"Y119",spouses:["Y30"],mother:"Y119w1",note:"أم أبناء الجمد (أحمد) بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"Y30d1",name:"حلّس",g:"F",father:"Y30",mother:"Y30w1",note:"أم محمد والباره من أبناء بيبين (محمد الأمين) بن محمد بن حبلل بن الأمين بن اشفغ حبلل"},
{id:"Y32",para:32,name:"الكوري",g:"M",father:"Y31",mother:"K3d1",spouses:["Y48d1"]},
{id:"Y33",para:33,name:"أحمد لدهم",g:"M",father:"Y31",mother:"K3d1",spouses:["Y33w1"]},
{id:"Y34",para:34,name:"سيد",g:"M",father:"Y31",mother:"K3d1",place:"تينشيكل",spouses:["Y34w1"]},
{id:"Y35",para:35,name:"محمد",g:"M",father:"Y31",mother:"K3d1",dates:"1245هـ/1849م – 1310هـ/1893م",place:"امليزم لفرص",spouses:["Y35w1"]},
{id:"Y31s1",name:"المعزوز",g:"M",father:"Y31",mother:"K3d1",note:"لم يعقب"},
{id:"Y31d1",name:"أيّم (مريم)",g:"F",father:"Y31",note:"أم سيد وأماتو ابني محمذن بن محمد سهل بن علي بن محنض بن باب الدين بن اشفغ الأمين؛ أم محمد بن محمد بن زيدن بن يعقوب بن احمد ميلود بن شدَّار بن اشفغ الأمين — تزوجت محمذن (Y145) ثم محمد (Y158)",spouses:["Y145","Y158"]},
{id:"Y31w2",name:"هالله",g:"F",father:"E4",mother:"F18w2",note:"رابط بين الأسرتين محتمل",spouses:["Y31"],crossLink:true},
{id:"Y47",para:47,name:"ببكر",g:"M",father:"Y31",mother:"Y31w2",spouses:["Y47w1"]},
{id:"Y32s1",name:"محمذن فال",g:"M",father:"Y32",mother:"Y48d1",note:"لم يعقب"},
{id:"Y33w1",name:"العايشه",g:"F",father:"XA878",spouses:["Y33"],ext:true},
{id:"Y33s1",name:"أحمياده",g:"M",father:"Y33",mother:"Y33w1",note:"لم يعقب"},
{id:"Y33s2",name:"المختار",g:"M",father:"Y33",mother:"Y33w1",dates:"1335هـ/1917م –",note:"لم يعقب"},
{id:"Y33s3",name:"اليدالي",g:"M",father:"Y33",mother:"Y33w1",note:"لم يعقب"},
{id:"Y33s4",name:"خطري",g:"M",father:"Y33",mother:"Y33w1",note:"لم يعقب"},
{id:"Y33s5",name:"محمد",g:"M",father:"Y33",mother:"Y33w1",note:"لم يعقب"},
{id:"Y33d1",name:"امروم",g:"F",father:"Y33",mother:"Y33w1",note:"زواج داخلي بالأسرة",spouses:["Y29"]},
{id:"Y57w2",name:"عايشا",g:"F",father:"F132",note:"رابط بين الأسرتين محتمل",crossLink:true,spouses:["Y57"]},
{id:"Y57d1",name:"آمنة",g:"F",father:"Y57",mother:"Y57w2",note:"أم أبناء محمد سهل بن علي بن محنض بن باب الدين بن اشفغ الأمين؛ أم حبيب بن المختار بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز بن اشفغ الأمين؛ زواج داخلي بالأسرة؛ زواج داخلي بالأسرة؛ أم حبيب بن المختار بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",spouses:["Y54","Y144"]},
{id:"Y58",para:58,name:"سيد أحمد",g:"M",father:"Y57",mother:"Y12d1",spouses:["Y58w1","Y58w2","Y58w3","Y58w4"]},
{id:"Y57d2",name:"عيشه",g:"F",father:"Y57",mother:"Y57w1",note:"لم تعقب"},
{id:"Y58w1",name:"افيطيمه",g:"F",father:"K122",note:"رابط بين الأسرتين محتمل",spouses:["Y58"],crossLink:true,mother:"K122w2",place:"اودش"},
{id:"Y58d1",name:"مريم تلميت",g:"F",father:"Y58",mother:"Y58w1",note:"أم سيدنا بن المختار بن محمذن بن الكوري بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"Y58w2",name:"فاطمة",g:"F",father:"Y20",spouses:["Y58"],mother:"Y20w1",note:"أم احمد وامباركو والعاليو وعيشو من أبناء سيد احمد بن حيب الله بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"Y59",para:59,name:"أحمد",g:"M",father:"Y58",mother:"Y58w2",spouses:["Y59w1"]},
{id:"Y58d2",name:"العاليه",g:"F",father:"Y58",mother:"Y58w2",note:"أم امباركو وامنيانو وعيشو وفاطمة وبنت وهب من أبناء بگي (أبوبكر) بن سيد بن حرمه بن المختار بن المعزوز",spouses:["Y83"]},
{id:"Y58w3",name:"امباركه",g:"F",father:null,note:"أم بعض أبناء أواه (محمد سعيد) بن التاه (المختار) بن أواه (محمد سعيد) بن محمد اليدالي بن المختار بن حمم سعيد",spouses:["Y58"]},
{id:"Y58w4",name:"عيشه",g:"F",father:null,note:"أم امبب والكوري وسيد أحمد من أبناء بزيد بن محمذن بن الفالي بن المبارك بن اما (الماقور)",spouses:["Y58"]},
{id:"Y59w1",name:"افييت",g:"F",father:"Y136s1",spouses:["Y59"]},
{id:"Y60",para:60,name:"الحسن",g:"M",father:"Y57",mother:"Y57w1",place:"اعكيلت الوزغو",spouses:["Y60w1"]},
{id:"Y60w1",name:"ام المؤمنين",g:"F",father:"K86",note:"رابط بين الأسرتين محتمل",spouses:["Y60"],crossLink:true,mother:"F135d1"},
{id:"Y61",para:61,name:"أحمد سالم",g:"M",father:"Y60",mother:"Y60w1",dates:"1245هـ/1830م – 1325هـ/1906م",place:"الحجون",spouses:["Y61w1","Y61w2"]},
{id:"Y60s1",name:"المختار",g:"M",father:"Y60",mother:"Y60w1",note:"لم يعقب"},
{id:"Y60s2",name:"سند",g:"M",father:"Y60",mother:"Y60w1",dates:"1314هـ/1897م –",note:"لم يعقب"},
{id:"Y61w1",name:"ام الخيرات",g:"F",father:"XA206",spouses:["Y61"]},
{id:"Y61w2",name:"الد (خديجة)",g:"F",father:"Y93",mother:"M24d3",note:"بنت الربا (البرا) بن بگي بن سيد بن حرمه بن المختار بن المعزوز — زواج داخلي بالأسرة",dates:"1272هـ/1856م – 1349هـ/1930م",place:"تنيخلف",spouses:["Y61"],crossLink:true},
{id:"Y61s1",name:"محمد",g:"M",father:"Y61",mother:"Y61w2",place:"اكدرنيت",note:"لم يعقب"},
{id:"Y61s2",name:"المختار",g:"M",father:"Y61",mother:"Y61w2",place:"اكدرنيت",note:"لم يعقب"},
{id:"Y61d1",name:"ام المؤمنين",g:"F",father:"Y61",mother:"Y61w2",place:"اكدرنيت",note:"زواج داخلي بالأسرة؛ زواج داخلي بالأسرة؛ أم العاليو بنت محمد بن المختار بن محمد بن حيب الله بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",spouses:["Y74","Y88"]},
{id:"Y82",para:82,name:"سيد",g:"M",father:"Y23",mother:"Y23w1",place:"تينشيكل",spouses:["Y82w1","Y170d1"]},
{id:"Y82w1",name:"خدجية",g:"F",father:"Y170",mother:"Y170w1",dates:"1206هـ/1792م –",spouses:["Y82","Y192"],note:"زواج داخلي بالأسرة؛ أم أبناء سيد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"Y83",para:83,name:"بگي (أبوبكر)",g:"M",father:"Y82",mother:"Y82w1",dates:"1206هـ/1792م – 1297هـ/1880م",place:"اكدرنيت",spouses:["L15w1","Y83w1","Y83w5","Y58d2"]},
{id:"Y82s1",name:"زعدر (سيد المختار)",g:"M",father:"Y82",mother:"Y82w1",dates:"1215هـ/1801م – 1307هـ/1890م",place:"تنيخلف",note:"لم يعقب"},
{id:"Y82s2",name:"الكوري",g:"M",father:"Y82",mother:"Y82w1",note:"لم يعقب"},
{id:"Y106",para:106,name:"محمد",g:"M",father:"Y82",mother:"Y82w1",place:"اكدرنيت",spouses:["Y106w1","Y119d7","Y106w3","Y106w4"]},
{id:"Y82d1",name:"صفيه",g:"F",father:"Y82",mother:"Y82w1",place:"تنيخلف",note:"أم ابني محمد بن الأمين بن حمم بن أبو الحس بن المزضف؛ أم ميمونو من أبناء ابن الحسين بن عبدي بن باب الدين بن اشفغ الأمين؛ زواج داخلي بالأسرة؛ أم ابني محمد بن الأمين بن حمم بن ابو الحس بن المزضف",spouses:["Z98","Y127"]},
{id:"Y84",para:84,name:"سيد أحمد",g:"M",father:"Y83",mother:"L15w1",place:"امبمب",spouses:["Y84w1","Y84w2","Y84w3"]},
{id:"Y93",para:93,name:"البرا",g:"M",father:"Y83",mother:"Y83w1",dates:"1251هـ/1835م – 1336هـ/1918م",place:"اكدرنيت",spouses:["M24d3"]},
{id:"Y83d1",name:"مريم",g:"F",father:"Y83",mother:"Y83w1",place:"انتوفكت",note:"أم صفيو بنت محمذن بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Y83w5",name:"العاليه",g:"F",father:"Y58",note:"زواج داخلي بالأسرة",spouses:["Y83"]},
{id:"Y84w1",name:"عاشا",g:"F",father:"Y70",mother:"Z70d5",note:"زواج داخلي بالأسرة؛ أم أبناء سيد احمد بن بگي (ابوبكر) بن سيد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",spouses:["Y84"]},
{id:"Y85",para:85,name:"أحمد",g:"M",father:"Y84",mother:"Y84w1",dates:"1354هـ/1935م –",place:"اغزكريت",spouses:["Y85w1","Y85w2","Y85w3"]},
{id:"Y86",para:86,name:"الشيخ محمذن",g:"M",father:"Y84",mother:"Y84w1",dates:"1334هـ/1916م –",spouses:["Y86w1","Y188d1"]},
{id:"Y88",para:88,name:"محمد",g:"M",father:"Y84",mother:"Y84w1",dates:"1344هـ/1926م –",place:"اغزكريت",spouses:["Y61d1"]},
{id:"Y84s1",name:"الحسن",g:"M",father:"Y84",mother:"Y84w1",note:"مفقود في طريق الحج"},
{id:"Y84s2",name:"الحسين",g:"M",father:"Y84",mother:"Y84w1",note:"مفقود في طريق الحج"},
{id:"Y84d1",name:"ام الخيري",g:"F",father:"Y84",mother:"Y84w1",place:"محجوبو",note:"أم فاطمة بنت الحسن بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف — لم تعقب؛ أم مريم السالمه بنت محمودن بن الأمين بن محمد بن حيب الله بن حرمه بن المختار بن المعزوز — لم تعقب؛ زواج داخلي بالأسرة؛ أم فاطمة بنت الحسن بن سيد بن محمد بن الأمين بن حمم بن ابو الحس بن المزضف — لم تعقب",spouses:["Z139","Y77"]},
{id:"Y84w2",name:"امن",g:"F",father:null,place:"تنيخلف",note:"أم بنات محمذن بن ايبا (أحمذ) بن محمذن بن الأمين بن الفالي بن متيلي (المختار)",spouses:["Y84"]},
{id:"Y84w3",name:"النّون",g:"F",father:null,dates:"1274هـ/1858م – 1374هـ/1955م",place:"تنيخلف",note:"أم اميّم (مريم) بنت الكوري بن محيين (محمد) بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",spouses:["Y84"]},
{id:"Y85w1",name:"ميّمه (ام اشوميو)",g:"F",father:"I80",note:"رابط بين الأسرتين محتمل",spouses:["Y85"],crossLink:true},
{id:"Y85w2",name:"النت (آمنة)",g:"F",father:null,dates:"1323هـ/1905م – 1406هـ/1986م",place:"دليلحو",note:"أم أبناء بالهي بن الشيخ محمذن بن سيد أحمد بن بگي (أبوبكر) بن سيد بن حرمه بن المختار بن المعزوز — ماتوا صغاراً؛ أم السالك من أبناء عبد الله بن اباه (محمد فال) بن باب بن أحمد بيب بن عثمان بن سيد محمد بن عبد الرحمن",spouses:["Y85"]},
{id:"Y85w3",name:"مريم",g:"F",father:"Y113s2b",note:"زواج داخلي بالأسرة",spouses:["Y85"]},
{id:"Y85d2",name:"اخديجه فال",g:"F",father:"Y85",mother:"Y85w3",dates:"1341هـ/1923م – 1420هـ/1999م",place:"دليلحو",note:"أم النون وأحمد ابني عبد الله بن محمد بن كييو بن محمذن بن الفالي بن المبارك بن اما (الماقور)"},
{id:"Y111",para:111,name:"الكوري",g:"M",father:"Y23",mother:"Y23w1",place:"تينشيكل",spouses:["Y12d1"]},
{id:"Y112",para:112,name:"محمذن",g:"M",father:"Y111",mother:"Y12d1",dates:"1186هـ/1772م – 1226هـ/1811م",place:"اكدرنيت",spouses:["Y112w1","Y112w2"]},
{id:"Y112w1",name:"اماته (فاطمة)",g:"F",father:"Y192",note:"رابط بين الأسرتين محتمل؛ أم أبناء محنض باب بن اعبيد بن احمد بن المختار بوي بن يعقوب بن باركلل بن يقبنلل؛ أم اَّمتَّن بنت محمذن بن الكوري بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",spouses:["Y112"],crossLink:true,mother:"Y82w1"},
{id:"Y112d1",name:"امّتّن",g:"F",father:"Y112",mother:"Y112w1",note:"أم أبناء شدار بن ياحممذ بن شدار بن اشفغ الأمين"},
{id:"Y112w2",name:"تنغجس",g:"F",father:null,spouses:["Y112"]},
{id:"Y113",para:113,name:"المختار",g:"M",father:"Y112",mother:"Y112w2",dates:"1224هـ/1809م – 1302هـ/1885م",place:"اكدرنيت",spouses:["Y113w1","Y113w2","Y113w3","Y113w4","Y113w5"]},
{id:"Y113w1",name:"رقيه",g:"F",father:"XA879",spouses:["Y113"],ext:true},
{id:"Y114",para:114,name:"ببكر",g:"M",father:"Y113",mother:"Y113w1",spouses:["Y115w1"]},
{id:"Y113s1",name:"الكوري",g:"M",father:"Y113",mother:"Y113w1",note:"لم يعقب"},
{id:"Y113w2",name:"فاطمه",g:"F",father:"XA323",spouses:["Y113"],ext:true},
{id:"Y113d1",name:"مومنتي",g:"F",father:"Y113",mother:"Y113w2",note:"أم أبناء سيد بن محيين (محمد) بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز بن اشفغ الأمين؛ أم مريم بنت المختار خي بن محمذن بن أحمد زروق بن فوك بن الأمين عمي — لم تعقب"},
{id:"Y113w3",name:"مريم تلميت",g:"F",father:"Y58",note:"زواج داخلي بالأسرة",spouses:["Y113"]},
{id:"Y115",para:115,name:"سيدنا",g:"M",father:"Y113",mother:"Y113w3",spouses:["Y115w1"]},
{id:"Y113w4",name:"مريم",g:"F",father:"XA881",spouses:["Y113"],ext:true},
{id:"Y113d2",name:"فاطمه فال",g:"F",father:"Y113",mother:"Y113w4",note:"أم أبناء أحمد بن ابن الزيغم بن عش قرنا بن محمد بن اشفغ المختار باب"},
{id:"Y113w5",name:"مريم",g:"F",father:"XA882",spouses:["Y113"],ext:true},
{id:"Y113s2b",name:"محمذن",note:"المذكور بعد الزوجة الخامسة لـ Y113 — رقم الفقرة غير مؤكد (قد يختلف عن ترقيم Y116 الأصلي)",g:"M",father:"Y113",mother:"Y113w5",spouses:["Y113s2bw1","Y115w1"]},
{id:"Y114d1",name:"عائشة",g:"F",father:"Y114",mother:"Y115w1",note:"أم محمذن ومحجوبو ابني محمد بن سيد أحمد بن أحمد بن حرمه -انكادس-"},
{id:"Y115w1",name:"منت وهب (ام النبي)",g:"F",father:"XA871",note:"قد تكون نفس شخص Y114w1 (نفس الوصف بالضبط) — إلى تحقيق؛ أم عائشة بنت ببكر بن المختار بن محمذن بن الكوري بن حرمه؛ أم سيد احمد بن سيدنا بن المختار بن محمذن بن الكوري؛ أم محمدن بن جد أم بن بابكر بن حرمه",spouses:["Y115","Y114","Y113s2b"],ext:true},
{id:"Y113s2bw1",name:"فلانة",g:"F",father:"XA657",spouses:["Y113s2b"],ext:true},
{id:"Y62",para:62,name:"أحمد",g:"M",father:"Y61",mother:"Y61w1",place:"تنيخلف",spouses:["Y62w1","Y62w2"]},
{id:"Y62w1",name:"احبيبه",g:"F",father:"XA1345",spouses:["Y62"],ext:true},
{id:"Y62d1",name:"البتول",g:"F",father:"Y62",mother:"Y62w1",dates:"1326هـ/1908م – 1402هـ/1982م",place:"تنيخلف",note:"أم ام امن من أبناء ممّن (محمذيني) بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف",spouses:["Z107"]},
{id:"Y62w2",name:"باكهينيت",g:"F",father:null,spouses:["Y62"]},
{id:"Y63",para:63,name:"أحمد سالم",g:"M",father:"Y62",mother:"Y62w2",dates:"1337هـ/1919م –",place:"تنيخلف",spouses:["Y63w1"]},
{id:"Y63w1",name:"عيشه",g:"F",father:"Y146",dates:"1353هـ/1934م – 1396هـ/1976م",place:"أبير حيبلل",spouses:["Y63"],mother:"Y146w2",note:"أم أبناء احمد سالم بن احمد بن احمد سالم بن الحسن بن حيب الله بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"Y64",para:64,name:"سيد",g:"M",father:"Y63",mother:"Y63w1",dates:"1371هـ/1952م –",spouses:["I29d3","Y64w2","Y64w3"]},
{id:"Y63s1",name:"علي",g:"M",father:"Y63",mother:"Y63w1",dates:"1381هـ/1962م –"},
{id:"Y64w2",name:"آمم",g:"F",father:null,dates:"1408هـ/1988م –",spouses:["Y64"]},
{id:"Y64w3",name:"آمه",g:"F",father:"R57",note:"رابط بين الأسرتين محتمل",dates:"1382هـ/1963م –",spouses:["Y64"],crossLink:true},
{id:"Y64s1",name:"أحمد",g:"M",father:"Y64",mother:"Y64w3",dates:"1410هـ/1990م –"},
{id:"Y64s2",name:"محمد فال",g:"M",father:"Y64",mother:"Y64w3",dates:"1413هـ/1993م –"},
{id:"Y64d2",name:"آمنة",g:"F",father:"Y64",mother:"Y64w3",dates:"1419هـ/1998م –"},
{id:"Y64s3",name:"ممّن",g:"M",father:"Y64",mother:"Y64w3",dates:"1421هـ/2000م –"},
{id:"Y65",para:65,name:"بگي",g:"M",father:"Y61",mother:"Y61w2",dates:"1318هـ/1901م – 1362هـ/1943م",place:"اغزكريت",spouses:["Y65w1"]},
{id:"Y65w1",name:"عيشه",g:"F",father:"K120",note:"رابط بين الأسرتين محتمل",dates:"1328هـ/1910م – 1409هـ/1989م",place:"محجوبو",spouses:["Y65"],crossLink:true,mother:"M25d1"},
{id:"Y66",para:66,name:"محمد فال",g:"M",father:"Y65",mother:"Y65w1",dates:"1351هـ/1932م – 1418هـ/1997م",place:"دليلحو",spouses:["Y66w1","Y66w2"]},
{id:"Y65d1",name:"الدي (خديجة)",g:"F",father:"Y65",mother:"Y65w1",dates:"1355هـ/1936م –",note:"أم أبناء الهادي بن محمذن بن محمد بن بكاك (ببكر) بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز بن اشفغ الأمين؛ زواج داخلي بالأسرة",spouses:["Y39"]},
{id:"Y66w1",name:"ميّم (مريم)",g:"F",father:"Y160",spouses:["Y66"],mother:"Y160w1",dates:"1376هـ/1957م –",note:"أم ففو ومحمد وآمنة من أبناء محمد فال بن بگي بن احمد سالم بن الحسن بن حيب الله بن حرمه بن المختار"},
{id:"Y66d1",name:"ففه",g:"F",father:"Y66",mother:"Y66w1",dates:"1395هـ/1975م –"},
{id:"Y67",para:67,name:"محمد",g:"M",father:"Y66",mother:"Y66w1",dates:"1398هـ/1978م –",spouses:["G70d4"]},
{id:"Y66w2",name:"عائشة",g:"F",father:"Z123",note:"رابط بين الأسرتين محتمل",dates:"1373هـ/1954م –",spouses:["Y66"],crossLink:true,fullName:"عائشة بنت السيد بن ممّن (محمذيني) بن سيد بن محمد بن الأمين بن حمم بن أبو الحس بن المزضف"},
{id:"Y66s1",name:"محمد عبد الله",g:"M",father:"Y66",mother:"Y66w2",dates:"1409هـ/1989م –"},
{id:"Y66s2",name:"السيد",g:"M",father:"Y66",mother:"Y66w2",dates:"1412هـ/1992م –"},
{id:"Y67s1",name:"عبد الفتاح",g:"M",father:"Y67",mother:"G70d4",dates:"1434هـ/2013م –"},
{id:"Y67d1",name:"الجمبت",g:"F",father:"Y67",mother:"G70d4",dates:"1435هـ/2014م –"},
{id:"Y68",para:68,name:"ولد الفظيل (محمذن)",g:"M",father:"Y61",mother:"Y61w2",dates:"1315هـ/1898م – 1355هـ/1936م",place:"اشباريو",spouses:["Y68w1"]},
{id:"Y68w1",name:"الداده (ام الخيري)",g:"F",father:"XA207",spouses:["Y68"]},
{id:"Y69",para:69,name:"سيد أحمد",g:"M",father:"Y68",mother:"Y68w1",dates:"1344هـ/1926م –",spouses:["Y69w1"]},
{id:"Y69w1",name:"عيشه",g:"F",father:"D46s2s1s2s2s1s1s1",spouses:["Y69"]},
{id:"I5w1",name:"فاطمة",g:"F",father:"F108",spouses:["I5"],crossLink:true,fullName:"فاطمة بنت بيبات بن حمم بن المبارك بن اما (الماقور)",mother:"R66d1",note:"أم أبناء محمذن بن حبلل بن ابراهيم"},
{id:"I5d1",name:"ام الخيرات",g:"F",father:"I5",mother:"I5w1",note:"أم هايل (سيد الفالي) وعائشة ابني محمذن حبيب بن العود (احمد) بن محمذن بن عميّا بن ابراهيم؛ أم أبناء سيد احممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم؛ زواج داخلي بالأسرة؛ زواج داخلي بالأسرة؛ أم أبناء سيد احممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم",spouses:["I27","I95"]},
{id:"I6w1",name:"ام المؤمنين",g:"F",father:"I12",note:"زواج داخلي بالأسرة؛ أم أحمد بن احممد بن ميلود بن سيد احمد بن حبلل بن ابراهيم",spouses:["I6"],mother:"I12w1"},
{id:"I6s1",name:"محمذن",g:"M",father:"I6",mother:"I4d1",note:"لم يعقب"},
{id:"I7w1",name:"تاوا (فطمو فال)",g:"F",father:"I13",dates:"1322هـ/1904م – 1387هـ/1967م",place:"أبير حيبلل",note:"زواج داخلي بالأسرة",spouses:["I7"],fullName:"تاوا (فطمو فال) بنت ابّوبا (ببكر) بن المختار بن سيد احمد بن حبلل بن ابراهيم"},
{id:"I7d1",name:"انچايه",g:"F",father:"I7",mother:"I7w1",dates:"1349هـ/1931م – 1431هـ/2010م",place:"أبير حيبلل",note:"أم ايات وسلمو ومحمد ومحمد المختار من أبناء السيد بن اميو (محمذن) بن سيد احممد بن ببكر بن سيد الفالي بن حبلل",spouses:["I38"]},
{id:"I7w2",name:"ينصرها",g:"F",father:"F125",dates:"1345هـ/1927م – 1437هـ/2016م",place:"أبير حيبلل",spouses:["I7"],crossLink:true,fullName:"ينصرها بنت الخليفه بن الأمين بن بيبات بن حمم بن المبارك بن اما (الماقور)"},
{id:"I8w1",name:"فاطمة",g:"F",father:"XA884",spouses:["I8"],ext:true},
{id:"I8d1",name:"مغنم",g:"F",father:"I8",mother:"I8w1",dates:"1393هـ/1973م –",note:"أم أبناء محمد سالم بن آبّوه (احمد) بن ببكر بن مختير بن احمد بن حيب الله بن محمذن بن باب احمد بن سيد (المختار)",spouses:["D60"],crossLink:true},
{id:"I8d3",name:"انجايه",g:"F",father:"I8",mother:"I8w1",dates:"1405هـ/1984م –"},
{id:"I8s1",name:"محمد",g:"M",father:"I8",mother:"I8w1",dates:"1407هـ/1987م –",note:"لم يعقب"},
{id:"I8s2",name:"محمد عبد الله",g:"M",father:"I8",mother:"I8w1",dates:"1409هـ/1989م –",note:"لم يعقب"},
{id:"I9",para:9,name:"احمد",g:"M",father:"I8",mother:"I8w1",dates:"1397هـ/1977م –",spouses:["I9w1"]},
{id:"I10",para:10,name:"الطلبه",g:"M",father:"I8",mother:"I8w1",dates:"1401هـ/1981م –",spouses:["I10w1"]},
{id:"I9w1",name:"زينب",g:"F",father:"G42s2s1",spouses:["I9"]},
{id:"I9d1",name:"اماته",g:"F",father:"I9",mother:"I9w1",dates:"1430هـ/2009م –"},
{id:"I10w1",name:"هند",g:"F",father:"F111",dates:"1405هـ/1985م –",spouses:["I10"],crossLink:true,fullName:"هند بنت احمد بن محمد بن اتاه (المختار) بن بيبات بن حمم بن المبارك بن اما (الماقور)"},
{id:"I10s1",name:"زكريا",g:"M",father:"I10",mother:"I10w1",note:"لم يعقب"},
{id:"I11w1",name:"اماته",g:"F",father:"I12",note:"زواج داخلي بالأسرة؛ أم تاوا بنت محمد بن ميلود بن سيد احمد بن حبلل بن ابراهيم",spouses:["I11"],mother:"I12w1"},
{id:"I11d1",name:"تاوا",g:"F",father:"I11",mother:"I11w1",place:"حبلل",note:"أم اماتو من أبناء من (محمذين) بن سيد بن محمد بن الأمين بن حمم بن ابو الحس بن المزضف — لم تعقب",spouses:["Z107"]},
{id:"I12w1",name:"فاطمه فال",g:"F",father:"I26",mother:"I64d3",note:"بنت ببكر بن سيد الفالي — زواج داخلي؛ أم ابني عبد الله بن النجيب بن فوك بن الأمين عمي؛ أم ابّوبا وام المومنين واماتو من أبناء اتاه",spouses:["I12"],crossLink:true},
{id:"I12d3",name:"توت (فاطمة)",g:"F",father:"I12",mother:"K6d1",dates:"– 1402هـ/1982م",place:"تنيخلف",note:"أم محمد سالم بن محمد بن احمد بن المختار بن محمذن بن الغالي بن باركلل بن بوالماح بن متيلي"},
{id:"I13w1",name:"سلمه",g:"F",father:"F13",place:"حبلل",spouses:["I13"],crossLink:true,mother:"F13w1"},
{id:"I13w2",name:"امّمم (مريم)",g:"F",father:null,dates:"1318هـ/1901م – 1343هـ/1925م",place:"أبير حيبلل",spouses:["I13"]},
{id:"I13d2",name:"ام الخيري",g:"F",father:"I13",mother:"I13w2",note:"أم ام الخيري من أبناء مام (محمد) بن احمد بن ابن عبدم بن عبد الله بن الأمين بن حمم بن ابو الحس بن المزضف",spouses:["Z74"]},
{id:"I13w3",name:"تاوا (فاطمه فال)",g:"F",father:null,dates:"1322هـ/1904م – 1387هـ/1967م",place:"أبير حيبلل",note:"أم انچايو وعبد الرحمن من أبناء احمد بن احممد بن ميلود بن سيد احمد بن حبلل بن ابراهيم",spouses:["I13"]},
{id:"I13w4",name:"مريم السالمه",g:"F",father:"F109",spouses:["I13"],crossLink:true,fullName:"مريم السالمه بنت اتاه (المختار) بن بيبات بن حمم بن المبارك بن اما (الماقور)"},
{id:"I14w1",name:"مريم",g:"F",father:"Y85",dates:"1320هـ/1902م – 1356هـ/1937م",place:"تنبيعلي",spouses:["I14"],crossLink:true,mother:"Y85w1",note:"أم أحمد سالم من أبناء عبد الله بن ابوبا (ببكر) بن اتاه (المختار) بن سيد أحمد بن حبلل بن ابراهيم؛ أم اباه (محمد فال) من أبناء عبد الله بن اباه (محمد فال) بن باب بن أحمد بيب بن عثمان بن سيد محمد بن عبد الرحمن"},
{id:"I14w3",name:"مريم",g:"F",father:"XA1349",dates:"1396هـ/1976م –",place:"أبير حيبلل",spouses:["I14"],ext:true},
{id:"I15w1",name:"مريم",g:"F",father:"Z53",mother:"Z53w1",dates:"1355هـ/1936م – 1435هـ/2014م",place:"أبير حيبلل",spouses:["I15"],crossLink:true,fullName:"مريم بنت محمذن بن ادّد (احمد) بن الداهي (عبد الله) بن احمد بن محمد الباقر بن حمم بن ابو الحس"},
{id:"I15w2",name:"امامّن",g:"F",father:"Z107",mother:"I11d1",dates:"1356هـ/1937م –",spouses:["I15"],fullName:"امامّن بنت من (محمذين) بن سيد بن محمد بن الأمين بن حمم بن ابو الحس بن المزضف"},
{id:"I16",para:16,name:"اباه",g:"M",father:"I15",mother:"I15w2",dates:"1395هـ/1975م –",spouses:["I16w1"]},
{id:"I17",para:17,name:"عبد الله",g:"M",father:"I15",mother:"I15w2",dates:"1397هـ/1977م –",spouses:["I17w1"]},
{id:"I15s3",name:"احمد",g:"M",father:"I15",mother:"I15w2",dates:"1399هـ/1979م –",note:"لم يعقب"},
{id:"I15s4",name:"محمدن",g:"M",father:"I15",mother:"I15w2",dates:"1402هـ/1982م –",note:"لم يعقب"},
{id:"I16w1",name:"مريم",g:"F",father:"F111",dates:"1403هـ/1983م –",spouses:["I16"],crossLink:true,fullName:"مريم بنت احمد بن محمد بن اتاه (المختار) بن بيبات بن حمم بن المبارك بن اما (الماقور)"},
{id:"I16d1",name:"عائشة",g:"F",father:"I16",mother:"I16w1",dates:"1428هـ/2007م –",note:"لم تعقب"},
{id:"I17w1",name:"امهنه (ميمونه)",g:"F",father:"Y101",dates:"1403هـ/1983م –",spouses:["I17"]},
{id:"I17s1",name:"احمد سالم",g:"M",father:"I17",mother:"I17w1",dates:"1430هـ/2009م –",note:"لم يعقب"},
{id:"I17s2",name:"أمين",g:"M",father:"I17",mother:"I17w1",note:"لم يعقب"},
{id:"I20",para:20,name:"قار",g:"M",father:"I19",mother:"Z84w1",dates:"1367هـ/1948م –",spouses:["I20w1"]},
{id:"I19w2",name:"آيه",g:"F",father:"Z51",mother:"Z51w1",dates:"1363هـ/1944م –",spouses:["I19"],crossLink:true,fullName:"آيه بنت محمد بن ادّد (احمد) بن الداهي (عبد الله) بن احمد بن محمد الباقر بن حمم بن ابو الحس بن المزضف"},
{id:"I19d2",name:"الشايعه",g:"F",father:"I19",mother:"I19w2",dates:"1389هـ/1969م –"},
{id:"I21b",para:21,name:"محمدن",g:"M",father:"I19",mother:"I19w2",dates:"1395هـ/1975م –",spouses:["I21bw1"]},
{id:"I19s3",name:"محمد",g:"M",father:"I19",mother:"I19w2",dates:"1398هـ/1978م –",note:"لم يعقب"},
{id:"I20w1",name:"ابّيبّه",g:"F",father:"XA543",dates:"1375هـ/1956م –",spouses:["I20"],ext:true},
{id:"I20d2",name:"ففه",g:"F",father:"I20",mother:"I20w1",dates:"1400هـ/1980م –",note:"أم أبناء محمد الأمين بن محمد بن هايل (سيد الفالي) بن محمذن حبيب بن العود (احمد) بن محمذن بن عميا بن ابراهيم",spouses:["I98"]},
{id:"I20d4",name:"انت (آمنة)",g:"F",father:"I20",mother:"I20w1",dates:"1406هـ/1986م –"},
{id:"I20s1",name:"محمد عبد الله",g:"M",father:"I20",mother:"I20w1",dates:"1414هـ/1994م –",note:"لم يعقب"},
{id:"I21bw1",name:"اميّم (مريم)",g:"F",father:"Z137",dates:"1406هـ/1986م –",spouses:["I21b"],crossLink:true,fullName:"اميّم (مريم) بنت ديد بن امين (الأمين) بن سيد بن محمد بن الأمين بن حمم بن ابو الحس بن المزضف"},
{id:"I21bs1",name:"فلان",g:"M",father:"I21b",mother:"I21bw1",note:"لم يعقب"},
{id:"I21bd1",name:"فلانة",g:"F",father:"I21b",mother:"I21bw1",dates:"1438هـ/2017م –"},
{id:"I22w1",name:"آمنة",g:"F",father:"XA887",place:"محجوبو",spouses:["I22"],ext:true},
{id:"I22s1",name:"بنعمر",g:"M",father:"I22",mother:"I22w1",dates:"1371هـ/1952م –",note:"لم يعقب"},
{id:"I22d1",name:"ابّيه",g:"F",father:"I22",mother:"I22w1",dates:"1373هـ/1954م –",note:"أم بعض أبناء عبد بن الأمين بن إمام (امام الحرمين) بن عبد الله بن اشفغ مينحنو",fullName:"أبيه بنت الحسن بن ابوبا (ببكر) بن المختار بن سيد أحمد بن حبلل بن ابراهيم",spouses:["G30"]},
{id:"I22d2",name:"خدّه",g:"F",father:"I22",mother:"I22w1",dates:"1376هـ/1957م –",note:"أم أبناء محمد بن ببكر بن محمد سالم بن الناه (مختير) بن حمادي"},
{id:"I23s1",name:"محمذن",g:"M",father:"I23",mother:"I90d1",dates:"1365هـ/1946م –",note:"لم يعقب"},
{id:"I24",para:24,name:"محمد",g:"M",father:"I23",mother:"I90d1",dates:"1367هـ/1948م –",spouses:["I24w1"]},
{id:"I23d1",name:"اطفيلهها",g:"F",father:"I23",mother:"I90d1",dates:"1369هـ/1950م –",note:"أم أبناء محمد فال بن المبارك بن اياي (احمد) بن دياه (سيد الفالي) بن محمذن بن المبارك بن اما (الماقور)",spouses:["F61"],fullName:"اطفيلهه بنت المختار بن ابّوبا (ببكر) بن المختار بن سيد أحمد بن حبلل بن ابراهيم"},
{id:"I23d3",name:"عيشه",g:"F",father:"I23",mother:"I90d1",dates:"1374هـ/1955م –",note:"أم صغار أبناء المختار بن اميو (محمذن) بن سيد احممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم؛ زواج داخلي بالأسرة",fullName:"عيشه بنت المختار بن ابّوبا (ببكر) بن المختار بن سيد احمد بن حبلل بن ابراهيم",spouses:["I41"]},
{id:"I24w1",name:"ام الخيري",g:"F",father:"I8",dates:"1399هـ/1979م –",note:"زواج داخلي بالأسرة؛ أم بنات محمد بن المختار بن ابّوبا (ببكر) بن المختار بن سيد احمد بن حبلل بن ابراهيم",spouses:["I24"],mother:"I8w1"},
{id:"I24d1",name:"اوا (فاطمه فال)",g:"F",father:"I24",mother:"I24w1",dates:"1424هـ/2003م –"},
{id:"I24d2",name:"حاجه",g:"F",father:"I24",mother:"I24w1",dates:"1426هـ/2005م –"},
{id:"I24d3",name:"مريم",g:"F",father:"I24",mother:"I24w1",dates:"1431هـ/2010م –"},
{id:"I25w1",name:"فاطمة",g:"F",father:"XA1350",spouses:["I25"],ext:true},
{id:"I25d1",name:"ام المومنين",g:"F",father:"I25",mother:"I25w1",place:"أبير حيبلل",note:"أم ابني محمذن بن الفظيل بن اللين (الأمين) بن ميلود؛ أم بنات عبد الله بن محمذن بن كامل بن حبلل بن ماه",spouses:["P51","L9"]},
{id:"I25d3",name:"خديجة",g:"F",father:"I25",mother:"I25w1",note:"أم ام المومنين وافيطيمو من أبناء احمذ بن ابييب بن يالليل بن احمويلل بن سيد (المختار) بن عبد الله"},
{id:"I28w1",name:"السالمه",g:"F",father:"S3",spouses:["I28"],crossLink:true,mother:"S3w1",note:"أم أبناء اميو (محمذن) بن سيد احممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم"},
{id:"I29w2",name:"مريم",g:"F",father:"G89",dates:"1354هـ/1935م – 1436هـ/2015م",place:"أبير حيبلل",spouses:["I29"],crossLink:true},
{id:"I29d3",name:"توت",g:"F",father:"I29",mother:"I29w2",dates:"1386هـ/1966م –",note:"أم عائشة وامّمو (السالمه) من أبناء سيد بن احمد سالم بن الحسن بن حيب الله بن حرمه بن المختار؛ أم أبناء محمدي بن احمد بن اميو (محمذن) بن سيد احممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم؛ رابط بين الأسرتين محتمل؛ زواج داخلي بالأسرة",fullName:"توت بنت كاكاه (ببكر) بن اميو (محمذن) بن سيد أحممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم",spouses:["Y64","I37"]},
{id:"I30w1",name:"حاجه",g:"F",father:"Z82s1s1",place:"احسي السعاده",spouses:["I30"],fullName:"حاجه بنت محمدن بن اليدالي بن احمد بن الأمين بن احمد بن محمد العاقل",ext:true},
{id:"I30d1",name:"توته (السالمه)",g:"F",father:"I30",mother:"I30w1",dates:"1367هـ/1948م –",note:"أم أبناء محمدن بن محمد بن امبيريك بن ميلود بن محمذن بن حبيين بن احمد اكذا المختار"},
{id:"I31",para:31,name:"اكنين (المختار)",g:"M",father:"I30",mother:"I30w1",dates:"1368هـ/1949م –",spouses:["I31w1"]},
{id:"I33",para:33,name:"احمد",g:"M",father:"I30",mother:"I30w1",dates:"1372هـ/1953م –",spouses:["I68d2"]},
{id:"I34",para:34,name:"عبد الله",g:"M",father:"I30",mother:"I30w1",dates:"1376هـ/1957م –",spouses:["I34w1"]},
{id:"I31w1",name:"ماليت (فاطمة)",g:"F",father:"Z140",dates:"1381هـ/1962م –",spouses:["I31"],crossLink:true,fullName:"ماليت (فاطمة) بنت محمد عبد الله بن الحسن بن سيد بن محمد بن الأمين بن حمم بن ابو الحس بن المزضف"},
{id:"I32",para:32,name:"احمد",g:"M",father:"I31",mother:"I31w1",dates:"1402هـ/1982م –",spouses:["I32w1"]},
{id:"I31d2",name:"حاجه",g:"F",father:"I31",mother:"I31w1",dates:"1410هـ/1990م –"},
{id:"I31d3",name:"امن",g:"F",father:"I31",mother:"I31w1",dates:"1411هـ/1991م –"},
{id:"I31d4",name:"توته",g:"F",father:"I31",mother:"I31w1",dates:"1419هـ/1998م –"},
{id:"I32w1",name:"بدريه",g:"F",father:"Z124",dates:"1407هـ/1987م –",spouses:["I32"],fullName:"بدريه بنت من بن السيد بن من (محمذين) بن سيد بن محمد بن الأمين بن حمم بن ابو الحس بن المزضف"},
{id:"I32d1",name:"خديجة",g:"F",father:"I32",mother:"I32w1",dates:"1434هـ/2013م –"},
{id:"I32s1",name:"محمد عبد الله",g:"M",father:"I32",mother:"I32w1",dates:"1436هـ/2015م –",note:"لم يعقب"},
{id:"I33d1",name:"اميه",g:"F",father:"I33",mother:"I68d2",dates:"1410هـ/1990م –",note:"أم النصره بنت محمد امبارك بن محمدن بن ادّد (احمد) بن الداه (عبد الله) بن احمد بن محمد الباقر بن حمم بن ابواحلس بن المزضف"},
{id:"I33d2",name:"ورده",g:"F",father:"I33",mother:"I68d2",dates:"1413هـ/1993م –"},
{id:"I33d3",name:"خدي",g:"F",father:"I33",mother:"I68d2",dates:"1416هـ/1996م –"},
{id:"I33d4",name:"امّمه",g:"F",father:"I33",mother:"I68d2",dates:"1422هـ/2001م –"},
{id:"I33s1",name:"احمد باب",g:"M",father:"I33",mother:"I68d2",dates:"1424هـ/2003م –",note:"لم يعقب"},
{id:"I33d5",name:"حاجه",g:"F",father:"I33",mother:"I68d2",dates:"1427هـ/2006م –"},
{id:"I33d6",name:"السالمه",g:"F",father:"I33",mother:"I68d2",dates:"1435هـ/2014م –"},
{id:"I34w1",name:"فاطمة",g:"F",father:"L18",dates:"1391هـ/1971م –",spouses:["I34"],crossLink:true,mother:"L18w1",note:"أم أبناء عبد الله بن الكبير (محمد) بن اميو (محمذن) بن سيد أحممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم"},
{id:"I34d1",name:"عائشة",g:"F",father:"I34",mother:"I34w1",dates:"1408هـ/1988م –"},
{id:"I34d2",name:"توت",g:"F",father:"I34",mother:"I34w1",dates:"1410هـ/1990م –"},
{id:"I34s1",name:"الكبير",g:"M",father:"I34",mother:"I34w1",dates:"1412هـ/1992م –",note:"لم يعقب"},
{id:"I34d3",name:"فرحه",g:"F",father:"I34",mother:"I34w1",dates:"1416هـ/1996م –"},
{id:"I35w1",name:"اخويدجيه",g:"F",father:"V26",mother:"V26w1",dates:"1354هـ/1936م – 1434هـ/2013م",place:"أبير حيبلل",spouses:["I35"],crossLink:true},
{id:"I35d2",name:"ففه",g:"F",father:"I35",mother:"I35w1",dates:"1375هـ/1956م –"},
{id:"I36",para:36,name:"احمد",g:"M",father:"I35",mother:"I35w1",dates:"1378هـ/1959م –",spouses:["I36w1","P10w1","I36w3"]},
{id:"I37",para:37,name:"محمدي",g:"M",father:"I35",mother:"I35w1",dates:"1378هـ/1959م –",spouses:["I29d3"]},
{id:"I35d4",name:"اتبيره (ام الخيرات)",g:"F",father:"I35",mother:"I35w1",dates:"1388هـ/1968م –"},
{id:"I36w1",name:"توت",g:"F",father:"XA888",spouses:["I36"],ext:true},
{id:"I36s1",name:"باب (محمد فال)",g:"M",father:"I36",mother:"I36w1",dates:"1407هـ/1987م –",note:"لم يعقب"},
{id:"I36s2",name:"احمد حيدره",g:"M",father:"I36",mother:"P10w1",dates:"1421هـ/2000م –",note:"لم يعقب"},
{id:"I36w3",name:"آمه (مريم السالمه)",g:"F",father:"Z137",dates:"1392هـ/1972م –",spouses:["I36"],fullName:"آمه (مريم السالمه) بنت ديدي بن اميين (الأمين) بن سيد بن محمد بن الأمين بن حمم بن ابو الحس بن المزضف"},
{id:"I36s3",name:"الكبير",g:"M",father:"I36",mother:"I36w3",dates:"1427هـ/2006م –",note:"لم يعقب"},
{id:"I36d1",name:"صفيّه",g:"F",father:"I36",mother:"I36w3",dates:"1428هـ/2007م –"},
{id:"I36s4",name:"ادّي (عبد الله)",g:"M",father:"I36",mother:"I36w3",dates:"1432هـ/2011م –",note:"لم يعقب"},
{id:"I37s1",name:"لمرابط (ببكر)",g:"M",father:"I37",mother:"I29d3",dates:"1416هـ/1996م –",note:"لم يعقب"},
{id:"I37d1",name:"عيشه",g:"F",father:"I37",mother:"I29d3",dates:"1420هـ/1999م –"},
{id:"I37s2",name:"احمد",g:"M",father:"I37",mother:"I29d3",dates:"1424هـ/2003م –",note:"لم يعقب"},
{id:"I38w1",name:"اجنايه",g:"F",father:"I7",dates:"1349هـ/1931م – 1431هـ/2010م",place:"أبير حيبلل",note:"زواج داخلي بالأسرة",spouses:["I38"]},
{id:"I38d2",name:"ايات (ام الخيرات)",g:"F",father:"I38",mother:"I38w1",dates:"1958م –",note:"أم انجايو ومن من أبناء ديدي بن من (محمذين) بن سيد بن محمد بن الأمين بن حمم بن ابواحلس بن المزضف؛ أم أبناء احمد بن ددالي (محمد اليدالي) بن محمودن بن محمذن بن انداه (المختار) بن بنيوك",spouses:["K115"]},
{id:"I39",para:39,name:"محمد",g:"M",father:"I38",mother:"I38w1",dates:"1380هـ/1961م –",spouses:["I39w1","I39w2"]},
{id:"I40",para:40,name:"محمد المختار",g:"M",father:"I38",mother:"I38w1",dates:"1384هـ/1964م –",spouses:["I18d5"]},
{id:"I38w2",name:"البتول",g:"F",father:"XA889",spouses:["I38"],ext:true},
{id:"I39w1",name:"عيشه",g:"F",father:"Y78",dates:"– 1423هـ/2002م",place:"احسي السعاده",spouses:["I39"]},
{id:"I39d1",name:"سهام",g:"F",father:"I39",mother:"I39w1",dates:"1418هـ/1997م –"},
{id:"I39w2",name:"عائشة",g:"F",father:"F47",dates:"1400هـ/1980م –",spouses:["I39"],crossLink:true,mother:"F47w1"},
{id:"I39s1",name:"السيد",g:"M",father:"I39",mother:"I39w2",dates:"1429هـ/2008م –",note:"لم يعقب"},
{id:"I39s2",name:"لمرابط",g:"M",father:"I39",mother:"I39w2",note:"لم يعقب"},
{id:"I39d2",name:"انجايه",g:"F",father:"I39",mother:"I39w2"},
{id:"I39s3",name:"العتيق",g:"M",father:"I39",mother:"I39w2",note:"لم يعقب"},
{id:"I40s1",name:"مولاي",g:"M",father:"I40",mother:"I18d5",dates:"1426هـ/2005م –",note:"لم يعقب"},
{id:"I41s1",name:"احمد",g:"M",father:"I41",mother:"I44d1",dates:"1398هـ/1978م –",note:"لم يعقب"},
{id:"I41d3",name:"تحيا",g:"F",father:"I41",mother:"I23d3",dates:"1411هـ/1991م –"},
{id:"I41s2",name:"محمد فال",g:"M",father:"I41",mother:"I23d3",dates:"1421هـ/2000م –",note:"لم يعقب"},
{id:"I42w1",name:"آتّوها",g:"F",father:"D23",mother:"D23w1",place:"اهل سيدن",spouses:["I42"],crossLink:true,fullName:"آتّوها بنت محمد بن محمذن (ولد سيدن) بن احمذ بن ابييب بن يالليل بن احمويلل بن سيد (المختار) بن عبد الله"},
{id:"I43w1",name:"ابّيه (عائشة)",g:"F",father:"I54",dates:"1311هـ/1894م – 1405هـ/1984م",place:"أبير حيبلل",note:"زواج داخلي بالأسرة؛ أم أبناء ببكر بن سيد احممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم",spouses:["I43"],mother:"I54w1"},
{id:"I43s1",name:"سيد احمد",g:"M",father:"I43",mother:"I43w1",dates:"1337هـ/1919م – 1392هـ/1972م",place:"حبلل",note:"لم يعقب"},
{id:"I43s2",name:"عبد الله",g:"M",father:"I43",mother:"I43w1",note:"لم يعقب"},
{id:"I43d1",name:"ام الخيرات",g:"F",father:"I43",mother:"I43w1",note:"لم تعقب"},
{id:"I44w1",name:"ابنيّه",g:"F",father:"D9",dates:"1326هـ/1908م – 1411هـ/1991م",place:"احسي السعاده",spouses:["I44"],crossLink:true,fullName:"ابنيّه بنت اليدالي بن احمد بن احميميد بن المختار بن القاظي بن احمويلل بن سيد بن عبد الله",mother:"D9w1",note:"أم ميمونو من أبناء اباه بن المختار بن محمد فال بن ميلود بن محمذن ولد باهنين؛ أم بنيت خي (محمدن) بن ببكر بن سيد احممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم"},
{id:"I44d1",name:"مريم",g:"F",father:"I44",mother:"I44w1",dates:"1369هـ/1950م –",note:"أم السالمه واحمد ومنت اباه (ففو) من أبناء المختار بن اميو (محمذن) بن سيد احممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم؛ زواج داخلي بالأسرة",spouses:["I41"]},
{id:"I44d2",name:"فاطمة",g:"F",father:"I44",mother:"I44w1",dates:"1372هـ/1953م –",note:"أم ميمونو بنت اباه بن المختار بن محمد فال بن ميلود بن محمذن بن باهنين"},
{id:"I45w1",name:"امباركه العاليه",g:"F",father:"Y121s1s1",dates:"1351هـ/1932م – 1432هـ/2011م",place:"أبير حيبلل",spouses:["I45"]},
{id:"I46",para:46,name:"ايياه (احمد)",g:"M",father:"I45",mother:"I45w1",dates:"1389هـ/1969م –",spouses:["I46w1","Y99d3"]},
{id:"I45s1",name:"زين العابدين",g:"M",father:"I45",mother:"I45w1",dates:"1392هـ/1972م –",note:"لم يعقب"},
{id:"I46w1",name:"اللو",g:"F",father:"Y99",mother:"Y99w1",dates:"1402هـ/1982م –",spouses:["I46"],fullName:"اللو بنت احمد بن ببكر بن بدِ (محمدّ) بن الربا بن بگي (ابوبكر) بن سيد بن حرمه بن المختار"},
{id:"I46s1",name:"الداه (محمد فال)",g:"M",father:"I46",mother:"I46w1",dates:"1433هـ/2012م –",note:"لم يعقب"},
{id:"I47w1",name:"مريم",g:"F",father:"R67",mother:"R67w1",spouses:["I47"],crossLink:true},
{id:"I48w1",name:"نبغوها",g:"F",father:"XA223",spouses:["I48"]},
{id:"I48d1",name:"ام المعالي",g:"F",father:"I48",mother:"I48w1",place:"أبير حيبلل",note:"لم تعقب"},
{id:"I48d2",name:"فاطمة",g:"F",father:"I48",mother:"I48w1",place:"أبير حيبلل",note:"أم بعض أبناء محمد بن امم (محمذن ميلود) بن محمد بن عبد الله بن محمودن"},
{id:"I48w2",name:"نفيسه",g:"F",father:"I66",note:"زواج داخلي بالأسرة؛ أم احمد سالم بن محمذن بن المان بن سيد الفالي بن حبلل بن ابراهيم — لم يعقب",spouses:["I48"],mother:"F133d1"},
{id:"I48s1",name:"احمد سالم",g:"M",father:"I48",mother:"I48w2",note:"لم يعقب"},
{id:"I48w3",name:"عائشة",g:"F",father:"I95",note:"زواج داخلي بالأسرة",spouses:["I48"]},
{id:"I49w2",name:"احبيبه",g:"F",father:"K54",note:"رابط بين الأسرتين",spouses:["I49"],crossLink:true,mother:"K54w1"},
{id:"I50w1",name:"هاله (خدجية)",g:"F",father:"XA893",spouses:["I50"],ext:true},
{id:"I50d1",name:"اماها (مريم)",g:"F",father:"I50",mother:"I50w1",note:"أم أبناء محمد بن الربا بن بگي (ابوبكر) بن سيد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"I51w1",name:"مريم",g:"F",father:"XA503",spouses:["I51"],ext:true},
{id:"I51d1",name:"فاطمة",g:"F",father:"I51",mother:"I51w1",note:"أم محمذن يحي ومريم ابني محمد فال ولد الأمين بن محمد فال بن احمد سالم بن القرشي بن الأمين بن احمذن حييا النجمري"},
{id:"I52w1",name:"فاطمة",g:"F",father:"F107",spouses:["I52"],crossLink:true,fullName:"فاطمة بنت حمم بن المبارك بن اما (الماقور)"},
{id:"I52d1",name:"ابنيّه",g:"F",father:"I52",mother:"I52w1",note:"أم أبناء سيد احمد بن الكوري بن قطرب بن محنض بن الغالوي بن الفالي بن باب احمد"},
{id:"I52d2",name:"آچمه",g:"F",father:"I52",mother:"I52w1",note:"أم المختار ومحمذن (ولد سيدن) من أبناء احمذ بن ابييب بن يالليل بن احمويلل بن سيد (المختار) بن عبد الله"},
{id:"I52d4",name:"صفيّه",g:"F",father:"I52",mother:"I52w1",note:"أم احمذ وابّاب وفاطمة من أبناء محمد فال بن احمد بن محمد العاقل",spouses:["XA390"]},
{id:"I52d5",name:"كاكا",g:"F",father:"I52",mother:"I52w1",note:"أم محمذن واحمد من أبناء المختار بن محمذن بن الغالي بن باركلل بن بوالماح بن متيلي"},
{id:"I53w1",name:"خديج",g:"F",father:"F79",place:"أبير حيبلل",spouses:["I53"]},
{id:"I54w1",name:"منت لبات (مريم)",g:"F",father:"F14",place:"إفرجان",spouses:["I54"]},
{id:"I54s1",name:"احمد",g:"M",father:"I54",mother:"I54w1",note:"لم يعقب"},
{id:"I54d2",name:"توت (فاطمة)",g:"F",father:"I54",mother:"I54w1",dates:"1314هـ/1897م – 1405هـ/1985م",place:"أبير حيبلل",note:"أم ابني الصالح بن عبد الله بن محمذن بن بابك بن حيب الله بن الفال بن احمد زروق — ماتا صغيرين"},
{id:"I54d4",name:"خديج",g:"F",father:"I54",mother:"I54w1",dates:"1322هـ/1904م – 1410هـ/1990م",place:"دليلحو",note:"لم تعقب"},
{id:"I54d5",name:"اد",g:"F",father:"I54",mother:"I54w1",dates:"1326هـ/1908م – 1427هـ/2006م",place:"تنبيعلي",note:"لم تعقب"},
{id:"I54d6",name:"تسلم",g:"F",father:"I54",mother:"I54w1",note:"لم تعقب"},
{id:"I55w1",name:"مريم باب",g:"F",father:"I48",note:"زواج داخلي بالأسرة؛ أم انباء منّح (محنض) بن احمد بن محمذن بن حبلل بن ابراهيم",spouses:["I55"],mother:"I48w3"},
{id:"I55d1",name:"خديج",g:"F",father:"I55",mother:"I55w1",note:"أم فلانة بنت سيد بن إمام (امام الحرمين) بن عبد الله بن اشفغ مينحنو — لم تعقب"},
{id:"I56w1",name:"لبابه",g:"F",father:null,spouses:["I56"]},
{id:"I56d1",name:"السالمه",g:"F",father:"I56",mother:"I56w1",note:"لم تعقب"},
{id:"I56w2",name:"خيده (ام الخير)",g:"F",father:"XA231",place:"أبير حيبلل",spouses:["I56"]},
{id:"I56d2",name:"مريم",g:"F",father:"I56",mother:"I56w2",place:"الرومدي",note:"لم تعقب"},
{id:"I56w3",name:"كاكا",g:"F",father:"W8",dates:"1365هـ/1946م –",spouses:["I56"],crossLink:true,fullName:"كاكا بنت محمد بن امم (محمذن ميلود) بن محمد بن عبد الله بن محمودن",mother:"W8w2"},
{id:"I57",para:57,name:"عبد الله",g:"M",father:"I56",mother:"I56w3",dates:"1384هـ/1964م –",spouses:["I57w1"]},
{id:"I58",para:58,name:"احمد",g:"M",father:"I56",mother:"I56w3",dates:"1388هـ/1968م –",spouses:["I58w1"],note:"لم يعقب"},
{id:"I59",para:59,name:"الوالي",g:"M",father:"I56",mother:"I56w3",dates:"1397هـ/1977م –",spouses:["I59w1"]},
{id:"I56d5",name:"السالكه",g:"F",father:"I56",mother:"I56w3",dates:"1403هـ/1983م –"},
{id:"I56s4",name:"اشريف",g:"M",father:"I56",mother:"I56w3",dates:"1407هـ/1987م –",note:"لم يعقب"},
{id:"I57w1",name:"اكيّه (ميمونه)",g:"F",father:"J10",dates:"1390هـ/1970م –",spouses:["I57"],crossLink:true,mother:"R62d1"},
{id:"I57d1",name:"فاطمة",g:"F",father:"I57",mother:"I57w1",dates:"1418هـ/1997م –",note:"أم تحيو -لغالل-"},
{id:"I57d2",name:"عائشة",g:"F",father:"I57",mother:"I57w1",dates:"1425هـ/2004م –"},
{id:"I57s1",name:"الناني",g:"M",father:"I57",mother:"I57w1",dates:"1427هـ/2006م –",note:"لم يعقب"},
{id:"I57s2",name:"الأمين",g:"M",father:"I57",mother:"I57w1",dates:"1430هـ/2009م –",note:"لم يعقب"},
{id:"I58w1",name:"النومه",g:"F",father:"I31",note:"زواج داخلي بالأسرة؛ أم أبناء احمد بن الأمين بن منّح (محنض) بن احمد بن محمذن بن حبلل بن ابراهيم",dates:"1405هـ/1984م –",spouses:["I58"],fullName:"النومه بنت اكنين (المختار) بن الكبير (محمد) بن اميو (محمذن) بن سيد احممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم",mother:"I31w1"},
{id:"I58s1",name:"الأمين",g:"M",father:"I58",mother:"I58w1",dates:"1431هـ/2010م –",note:"لم يعقب"},
{id:"I58d1",name:"فرحه",g:"F",father:"I58",mother:"I58w1",dates:"1434هـ/2013م –"},
{id:"I58s2",name:"الكبير",g:"M",father:"I58",mother:"I58w1",dates:"1437هـ/2016م –",note:"لم يعقب"},
{id:"I59w1",name:"عيشه",g:"F",father:"Y66",dates:"1407هـ/1987م –",spouses:["I59"],crossLink:true,mother:"Y66w2",note:"أم ابوها بنت الوالي بن الأمين بن منّح (محنض) بن أحمد بن محمذن بن حبلل بن ابراهيم"},
{id:"I59s1",name:"ابوها",g:"M",father:"I59",mother:"I59w1",dates:"1432هـ/2011م –",note:"لم يعقب"},
{id:"I60w1",name:"امّمه (مريم)",g:"F",father:"I85",dates:"1339هـ/1921م –",note:"زواج داخلي بالأسرة؛ أم أبناء سيد بن منّح (محنض) واحمد بن محمذن بن حبلل بن ابراهيم",spouses:["I60"],mother:"I85w1"},
{id:"I60s1",name:"بنعمر",g:"M",father:"I60",mother:"I60w1",dates:"1368هـ/1949م –",note:"لم يعقب"},
{id:"I61",para:61,name:"احمد",g:"M",father:"I60",mother:"I60w1",dates:"1378هـ/1959م –",spouses:["I61w1","I61w2"]},
{id:"I60s2",name:"محمد الأمين",g:"M",father:"I60",mother:"I60w1",dates:"1384هـ/1964م – 1436هـ/2014م",place:"أبير حيبلل",note:"لم يعقب"},
{id:"I61w1",name:"تته",g:"F",father:"XA896",spouses:["I61"],ext:true},
{id:"I61s1",name:"محمد",g:"M",father:"I61",mother:"I61w1",dates:"1411هـ/1991م –",note:"لم يعقب"},
{id:"I61w2",name:"منت اباه (ففه)",g:"F",father:"I41",note:"زواج داخلي بالأسرة؛ أم سيد وتتو من أبناء احمد بن سيد بن منّح (محنض) بن احمد بن محمذن بن حبلل بن ابراهيم",dates:"1395هـ/1975م –",spouses:["I61"],fullName:"منت اباه (ففه) بنت المختار بن اميو (محمذن) بن سيد احممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم",mother:"I44d1"},
{id:"I61s2",name:"سيد",g:"M",father:"I61",mother:"I61w2",dates:"1426هـ/2005م –",note:"لم يعقب"},
{id:"I61d1",name:"تت",g:"F",father:"I61",mother:"I61w2",dates:"1428هـ/2007م –"},
{id:"I62d1",name:"جافلئذن",g:"F",father:"I62",mother:"R1d1",note:"أم أبناء اعديج بن احمد الورع بن الفالي بن باب احمد",spouses:["D46s2s2s1"]},
{id:"I63w1",name:"امباركه",g:"F",father:"I2",note:"زواج داخلي بالأسرة؛ أم أبناء الفالي بن معلوم بن ابراهيم",spouses:["I63"],mother:"I2w1"},
{id:"I63d2",name:"مريم",g:"F",father:"I63",mother:"I63w1",note:"أم أبناء جيج بن الزبير بن حامدت بن اشفغ عبد الله بن اعمر يزكئذن بن محنضلل بن اعمر اديقب"},
{id:"I64w1",name:"ام المومنين",g:"F",father:"Y13",note:"أم ابني النجيب بن فوك بن الأمين عمي",spouses:["I64"],crossLink:true},
{id:"I64w3",name:"فاطمة",g:"F",father:"D61s1s1s1",spouses:["I64"]},
{id:"I64d3",name:"آمنة",g:"F",father:"I64",mother:"I64w3",note:"أم سيد احممد وفاطمو فال ابني ببكر بن سيد الفالي بن حبلل بن ابراهيم؛ أم محمذن حبيب من أبناء العود (احمد) بن محمذن بن عميا بن ابراهيم؛ زواج داخلي بالأسرة؛ زواج داخلي بالأسرة؛ أم سيد احممد وفاطمو فال ابني ببكر بن سيد الفالي بن حبلل بن ابراهيم",spouses:["I26","I94"]},
{id:"I65w1",name:"افيطمات",g:"F",father:"I53",note:"زواج داخلي بالأسرة؛ أم أبناء ديدا (محمد فال) بن محمذن بن الفالي بن معلوم بن ابراهيم",spouses:["I65"],mother:"I53w1"},
{id:"I65s1",name:"محمد",g:"M",father:"I65",mother:"I65w1",dates:"1352هـ/1933م –",note:"لم يعقب"},
{id:"I65d1",name:"عائشة",g:"F",father:"I65",mother:"I65w1",note:"أم فاطمة بنت المختار بن سيد بن محمذن بن احجاب بن محمد الكريم — لم تعقب"},
{id:"I65d3",name:"امني",g:"F",father:"I65",mother:"I65w1",note:"أم ميم (مريم) من أبناء ببكر بن اكي (الكوري) بن ايبا (احمذ) بن محمذن بن الأمين بن الفالي بن متيلي",spouses:["M26"]},
{id:"I65d4",name:"خديجة",g:"F",father:"I65",mother:"I65w1",note:"أم محمذن السالم وعائشة ابني سندي بن محمذن بن سعدن بن ون (محمذن) بن احمد زروق — لم يعقبا؛ أم محمد بن دداه (احمد) بن حمين (محمذن) بن بازيد بن محمذن بن الفالي بن المبارك بن اما (الماقور)"},
{id:"I66s1",name:"محمد فال",g:"M",father:"I66",mother:"I100w1",note:"لم يعقب"},
{id:"I66w3",name:"فاطمة",g:"F",father:"N1",place:"أبير حيبلل",spouses:["I66"],crossLink:true,fullName:"فاطمة بنت محمذن بن الخلف",ext:true},
{id:"I67w1",name:"ام الحسين",g:"F",father:"I80",note:"زواج داخلي بالأسرة؛ أم ببكر واحمد من أبناء محمد بن سيد بن محمذن بن الفالي بن معلوم بن ابراهيم — لم يعقبا",spouses:["I67"],mother:"I80w2"},
{id:"I67s1",name:"ببكر",g:"M",father:"I67",mother:"I67w1",place:"أبير حيبلل",note:"لم يعقب"},
{id:"I67s2",name:"محمدن",g:"M",father:"I67",mother:"I67w1",place:"أبير حيبلل",note:"لم يعقب"},
{id:"I67w2",name:"لم",g:"F",father:"L7",dates:"– 1398هـ/1978م",place:"أبير حيبلل",spouses:["I67"],crossLink:true,mother:"L7w1",note:"أم فاطمة السالمه بنت محمد لمجد بن أحمد سالم"},
{id:"I68w1",name:"امّي",g:"F",father:"I60",note:"زواج داخلي بالأسرة؛ أم بنيت احمد بن محمد بن سيد بن محمذن بن الفالي بن معلوم بن ابراهيم",dates:"1365هـ/1946م – 1433هـ/2012م",place:"أبير حيبلل",spouses:["I68"],mother:"I60w1"},
{id:"I68d2",name:"لحبوس",g:"F",father:"I68",mother:"I68w1",dates:"1392هـ/1972م –",note:"أم أبناء احمد بن الكبير (محمد) بن اميو (محمذن) بن سيد احممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم؛ زواج داخلي بالأسرة",spouses:["I33"]},
{id:"I68s1",name:"ايمين",g:"M",father:"I68",mother:"I68w1",place:"محجوبو",note:"مات صغيرا"},
{id:"I69w1",name:"فلانة",g:"F",father:"Y148",spouses:["I69"],crossLink:true},
{id:"I69d1",name:"مريم",g:"F",father:"I69",mother:"I69w1",note:"أم سيد احمد وشقيقته من أبناء حبلل بن الأمين بن اشفغ حيبلل؛ أم محمذن وفاطمة وعاتيكو من أبناء احممد بن التقي بن أبَي (المختار)"},
{id:"I69w2",name:"سادما",g:"F",father:"XA333",spouses:["I69"],ext:true},
{id:"I69d2",name:"خديجة",g:"F",father:"I69",mother:"I69w2",note:"أم أبناء محمذن بن احمد بن محمد العاقل",spouses:["XA546"]},
{id:"I70w1",name:"عايشا",g:"F",father:"I93",note:"زواج داخلي بالأسرة؛ أم بنيت الفالي بن محنض بن معلوم بن ابراهيم",spouses:["I70"],mother:"I93w1"},
{id:"I70d1",name:"صفيّه",g:"F",father:"I70",mother:"I70w1",note:"أم ابني محمذن بن سيد الفالي بن حبلل بن ابراهيم؛ أم ام الخيرات بنت الأمين بن حيب الله بن الفالي بن احمد زروق؛ زواج داخلي بالأسرة",spouses:["R49","I49"]},
{id:"I70d2",name:"فاطمه فال",g:"F",father:"I70",mother:"I70w1",note:"أم ابني الأمين بن ياحممذ بن باباحنيد بن احمد زروق؛ أم سيد ومريم باخنا ابني محمذن بن الفالي بن معلوم بن ابراهيم؛ زواج داخلي بالأسرة",spouses:["R17","I64"]},
{id:"I71w1",name:"منمن",g:"F",father:"I63",note:"زواج داخلي بالأسرة؛ أم مريم بنت الليث بن محنض بن معلوم بن ابراهيم",spouses:["I71"],mother:"I63w1"},
{id:"I72w1",name:"عائشة",g:"F",father:"XA1352",spouses:["I72"]},
{id:"I72d1",name:"آچمه",g:"F",father:"I72",mother:"I72w1",note:"أم أبناء المختارنا بن سيديا بن محمذن بن باب احمد"},
{id:"I72d2",name:"حنه",g:"F",father:"I72",mother:"I72w1",note:"أم لحويج وفاطمو فال ابني العالي بن اما (الماقور)؛ بنت عميّا بن ابراهيم — رابط بين الأسرتين",spouses:["F2"]},
{id:"I72d3",name:"شام",g:"F",father:"I72",mother:"I72w1",note:"أم سيد من أبناء امند بن المختار بن محنض بن الحسن دوبك؛ أم فلانة بنت ابن يوسف بن المختار بن محنض بن الحس دوبك؛ أم بنات اعديج بن المصطفى بن حمم سعيد",spouses:["XA834"]},
{id:"I73w1",name:"عزه",g:"F",father:"XA882",spouses:["I73"],ext:true},
{id:"I73d1",name:"آچمه",g:"F",father:"I73",mother:"I73w1",note:"لم تعقب"},
{id:"I73d4",name:"ميتته",g:"F",father:"I73",mother:"I73w1",note:"أم الكوري ضال بن سيد احمد بن حبلل بن آمين بن محمد الكريم"},
{id:"I74w1",name:"فلانة",g:"F",father:null,note:"غير محددة في المصدر",spouses:["I74"]},
{id:"I75w1",name:"فلانة",g:"F",father:null,note:"غير محددة في المصدر",spouses:["I75"]},
{id:"I76w1",name:"فلانة -ادب اعمر-",g:"F",father:null,spouses:["I76"]},
{id:"I76s1",name:"الحسين",g:"M",father:"I76",mother:"I76w1",dates:"1339هـ/1921م – 1425هـ/2004م",note:"لم يعقب"},
{id:"I77w1",name:"ام المومنين",g:"F",father:"Z94",mother:"Z94w1",dates:"1357هـ/1938م – 1402هـ/1982م",place:"دليلحو",spouses:["I77"],fullName:"ام المومنين بنت محمد بن احمد امبيريك بن عبد الودود بن الأمين لد حمم بن ابو الحس",ext:true},
{id:"I77d1",name:"مريم السالمه",g:"F",father:"I77",mother:"I77w1",dates:"1381هـ/1962م – 1425هـ/2004م",place:"دليلحو",note:"أم آسية من أبناء محمد بن عبد الله بن محمد فال بن باب بن احمد"},
{id:"I77d2",name:"عائشة",g:"F",father:"I77",mother:"I77w1",dates:"1382هـ/1963م –",note:"أم خالد بن اشريف احمد -لغالل-؛ أم آمنة بنت صالحي -لغالل-؛ أم فايزه وعبد الله ابني اعمر بن فكناش -تيزكو-؛ أم بن جلون بن الموصطفى بن لحويشي -لمزازكو-"},
{id:"I77d3",name:"دده",g:"F",father:"I77",mother:"I77w1",dates:"1386هـ/1966م –",note:"أم اباه بن ديدي -اولاد احمد-"},
{id:"I77d5",name:"الشيخه",g:"F",father:"I77",mother:"I77w1",dates:"1390هـ/1970م –",note:"أم احمد وصدام من أبناء اكاه بن محمد بن امم (محمذن) بن اگّي (الكوري) بن ايبا (احمذ) بن محمذن بن الأمين بن الفالي بن متيلي؛ أم سيد المختار وعائشة وديد من أبناء محمد بن ميلود بن المختار بن محمد فال بن ميلود بن محمذن بن باهنين؛ أم سيد المختار وعائشة وديد أبناء محمد بن ميلود بن المختار بن محمد فال بن ميلود بن محمذن بن باهنين",spouses:["M32","V23"]},
{id:"I77d6",name:"صفيّه",g:"F",father:"I77",mother:"I77w1",dates:"1393هـ/1973م –",note:"أم نوره وام المومنين بنتي عبد الله -تندغو-"},
{id:"I77d7",name:"اللو",g:"F",father:"I77",mother:"I77w1",dates:"1396هـ/1976م –",note:"أم أبناء اطول عمرو بن محمد الأمين -اهل اشريف لكحل-"},
{id:"I77s1",name:"احمد",g:"M",father:"I77",mother:"I77w1",dates:"1398هـ/1978م –",place:"صالحين سعيد",note:"لم يعقب"},
{id:"I77d8",name:"عزه",g:"F",father:"I77",mother:"I77w1",dates:"1400هـ/1980م –",note:"أم أبناء محمد بن البشير بن مالي ادريس -الشرفاء-"},
{id:"I77w2",name:"فلانة -تندغو-",g:"F",father:null,spouses:["I77"]},
{id:"I78",para:78,name:"محمد عبد الرحمن",g:"M",father:"I77",mother:"I77w2",spouses:["I78w1"]},
{id:"I78w1",name:"سلّم بوها -كنتو-",g:"F",father:null,spouses:["I78"]},
{id:"I78s1",name:"احمد",g:"M",father:"I78",mother:"I78w1",note:"لم يعقب"},
{id:"I78s2",name:"الحسين",g:"M",father:"I78",mother:"I78w1",note:"لم يعقب"},
{id:"I78s3",name:"سيد",g:"M",father:"I78",mother:"I78w1",note:"لم يعقب"},
{id:"I78d1",name:"شيخه",g:"F",father:"I78",mother:"I78w1"},
{id:"I78d2",name:"فاطمه",g:"F",father:"I78",mother:"I78w1"},
{id:"I78d3",name:"فلانة",g:"F",father:"I78",mother:"I78w1"},
{id:"I79w1",name:"فاطمه فال",g:"F",father:"V11",spouses:["I79"],crossLink:true,mother:"V11w3",place:"أبير حيبلل"},
{id:"I79s1",name:"احمد",g:"M",father:"I79",mother:"I79w1",note:"لم يعقب"},
{id:"I79d1",name:"منمن",g:"F",father:"I79",mother:"I79w1",note:"أم امفال (فاطمو فال) من ابناء محمذن بن ابن الحسين بن عبدي بن باب الدين بن اشفغ الأمين؛ أم احممد فال من ابناء محنض بن اغلجئذن بن بتاجه بن محمذن بن سيد (المختار) بن عبد الله؛ أم امفال (فاطمو فال) بنت محمذن بن ابن الحسين بن عبدي بن باب الدين بن اشفغ الأمين؛ أم احممد فال بن محنض بن اغلجئذن بن بتاجه بن ماندي (محنض) بن محمذن بن سيد (المختار) بن عبد الله",spouses:["D95","Y128"]},
{id:"I80w1",name:"انضيك",g:"F",father:"XA1362",dates:"– 1351هـ/1932م",place:"صالحين المصران",spouses:["I80"],ext:true},
{id:"I80w2",name:"خدجية",g:"F",father:"XA1119",mother:"D6d1",spouses:["I80"],ext:true},
{id:"I80s1",name:"احمد سالم",g:"M",father:"I80",mother:"I80w2",note:"لم يعقب"},
{id:"I81w1",name:"سلمه",g:"F",father:"I96",note:"زواج داخلي بالأسرة؛ أم أبناء ددايل (محمذن اليدالي) بن محمد بن شيبة بن الفالي بن عميّا بن ابراهيم",spouses:["I81"],mother:"I96w1",dates:"…؟… – 1342هـ/1924م",place:"تنيخلف"},
{id:"I81d1",name:"امانّه (سلمه)",g:"F",father:"I81",mother:"I81w1",place:"أبير حيبلل",note:"أم محمد وابياه وايات وآمنة ومريم وتوت من أبناء هايل (سيد الفالي) بن محمذن حبيب بن العود (احمد) بن محمذن بن عميا بن ابراهيم",spouses:["I96"]},
{id:"I81d2",name:"ميمه (ام اشويمو)",g:"F",father:"I81",mother:"I81w1",place:"تنخلف",note:"أم مريم وانت (آمنة) من بنات احمد بن سيد احمد بن بگي (ابوبكر) بن سيد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"I81w2",name:"عيشه",g:"F",father:null,dates:"1330هـ/1912م – 1418هـ/1997م",place:"احسي السعاده",note:"أم أبناء الحسن بن اتو (الكوري) ومحمذن بن سيد الفالي بن بنيوك (محمذن) بن المختار بن محمد الكريم",spouses:["I81"]},
{id:"I81s1",name:"محمد فال",g:"M",father:"I81",mother:"I81w2",dates:"1333هـ/1915م –",note:"لم يعقب"},
{id:"I82w1",name:"ميمهنه",g:"F",father:"V15",dates:"1940م – 1401هـ/1981م",place:"أبير حيبلل",spouses:["I82"],crossLink:true,mother:"V15w2"},
{id:"I83",para:83,name:"محمودن",g:"M",father:"I82",mother:"I82w1",dates:"1376هـ/1957م –",spouses:["F130d1"]},
{id:"I84",para:84,name:"عيسى",g:"M",father:"I82",mother:"I82w1",dates:"1382هـ/1963م –",spouses:["I84w1"]},
{id:"I82d1",name:"انيّه",g:"F",father:"I82",mother:"I82w1",dates:"1386هـ/1966م –",note:"أم ابني سيد بن ميلود بن المختار بن محمد فال بن ميلود بن محمذن بن باهنين؛ أم ميمونو من أبناء محمد (ولد الطلب) بن هيدي (سيد) بن ابّو (محمد) بن امين بن محمد بن عركاب (حمم) بن ابوابا"},
{id:"I83d1",name:"ميمهنه",g:"F",father:"I83",mother:"F130d1",dates:"1424هـ/2003م –"},
{id:"I83d2",name:"مريم",g:"F",father:"I83",mother:"F130d1",dates:"1427هـ/2006م –"},
{id:"I83d3",name:"آمنة",g:"F",father:"I83",mother:"F130d1",dates:"1430هـ/2009م –"},
{id:"I83d4",name:"ابنيّه",g:"F",father:"I83",mother:"F130d1"},
{id:"I83d5",name:"عائشة",g:"F",father:"I83",mother:"F130d1"},
{id:"I84w1",name:"الزهراء",g:"F",father:"Y99",dates:"1398هـ/1978م –",spouses:["I84"]},
{id:"I84s1",name:"هايل",g:"M",father:"I84",mother:"I84w1",dates:"1428هـ/2007م –",note:"لم يعقب"},
{id:"I84d1",name:"ام المومنين",g:"F",father:"I84",mother:"I84w1",dates:"1430هـ/2009م –"},
{id:"I84s2",name:"احمد",g:"M",father:"I84",mother:"I84w1",dates:"1431هـ/2012م –",note:"لم يعقب"},
{id:"I86w1",name:"فاطمة",g:"F",father:"Y72",dates:"1357هـ/1938م – 1425هـ/2004م",place:"دليلحو",spouses:["I86"],crossLink:true,mother:"V14d1",note:"أم أبناء اباه بن الكوري بن محمد بن شيبة بن الفالي بن عمـيَّا بن ابراهيم"},
{id:"I87",para:87,name:"يحي",g:"M",father:"I86",mother:"I86w1",dates:"1373هـ/1954م –",spouses:["I87w1"]},
{id:"I86s1",name:"السيد",g:"M",father:"I86",mother:"I86w1",dates:"1378هـ/1959م –",note:"لم يعقب"},
{id:"I87w1",name:"توت",g:"F",father:"G87",dates:"1375هـ/1956م –",spouses:["I87"],crossLink:true,mother:"G29d1",note:"أم الوالد (شماد) بن يحي بن اباه بن الكوري بن محمد بن شيبة بن محمذن بن عميا بن ابراهيم"},
{id:"I87s1",name:"الوالد (شماد)",g:"M",father:"I87",mother:"I87w1",dates:"1418هـ/1997م –",note:"لم يعقب"},
{id:"I88",para:88,name:"احمد",g:"M",father:"I86",mother:"I86w1",dates:"1381هـ/1962م –",spouses:["I88w1"]},
{id:"I88w1",name:"يت",g:"F",father:"XA1248",dates:"1388هـ/1968م – 1429هـ/2008م",place:"تجكجو",spouses:["I88"],ext:true},
{id:"I88s1",name:"امربيه",g:"M",father:"I88",mother:"I88w1",dates:"1412هـ/1992م –",note:"لم يعقب"},
{id:"I88s2",name:"الحسين",g:"M",father:"I88",mother:"I88w1",dates:"1416هـ/1996م –",note:"لم يعقب"},
{id:"I89",para:89,name:"محمدن",g:"M",father:"I86",mother:"I86w1",dates:"1384هـ/1964م –",spouses:["I89w1"]},
{id:"I89w1",name:"تكيرب",g:"F",father:"F111",dates:"1396هـ/1976م –",spouses:["I89"],crossLink:true,fullName:"تكيرب بنت احمد بن محمد بن اتاه (المختار) بن بيبات بن حمم بن المبارك بن اما (الماقور)"},
{id:"I89d1",name:"خدي",g:"F",father:"I89",mother:"I89w1",dates:"1421هـ/2000م –"},
{id:"I89s1",name:"ايمن (احمد)",g:"M",father:"I89",mother:"I89w1",dates:"1426هـ/2005م –",note:"لم يعقب"},
{id:"I89d2",name:"فاطمة",g:"F",father:"I89",mother:"I89w1",dates:"1428هـ/2007م –"},
{id:"I89d3",name:"تسلم",g:"F",father:"I89",mother:"I89w1"},
{id:"I90w1",name:"خدجية",g:"F",father:"R69",mother:"R69w1",place:"تنيخلف",spouses:["I90"],crossLink:true},
{id:"I90s1",name:"محمد",g:"M",father:"I90",mother:"I90w1",note:"لم يعقب"},
{id:"I90s2",name:"محمد فال",g:"M",father:"I90",mother:"I90w1",dates:"…؟… – 1345هـ/1927م",note:"لم يعقب"},
{id:"I90d1",name:"مريم",g:"F",father:"I90",mother:"I90w1",dates:"1341هـ/1923م – 1430هـ/2009م",place:"تنيخلف",note:"أم أبناء المختار بن ابّوبا (ببكر) بن المختار بن سيد احمد بن حبلل بن ابراهيم؛ زواج داخلي بالأسرة",spouses:["I23"]},
{id:"I91w1",name:"السلطانه",g:"F",father:"K83",note:"رابط بين الأسرتين محتمل؛ أم أبناء المختار بن حميين بن الجمد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",spouses:["I91"],crossLink:true,mother:"K83w1"},
{id:"I92w1",name:"ايخيره",g:"F",father:"D64",mother:"D64w1",spouses:["I92"],crossLink:true},
{id:"I92s1",name:"محمد",g:"M",father:"I92",mother:"I92w1",dates:"…؟… – 1354هـ/1936م",note:"لم يعقب"},
{id:"I93w1",name:"صفيّه",g:"F",father:"Y124",spouses:["I93"],crossLink:true,mother:"Y124w1",note:"أم أبناء محمذن بن عمـيَّا بن ابراهيم"},
{id:"I93d1",name:"النمه",g:"F",father:"I93",mother:"I93w1",note:"أم أبناء حمم بن المختار باب بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله",spouses:["D76"]},
{id:"I94w2",name:"عيشه",g:"F",father:"XA1363",mother:"P48d2",spouses:["I94"],ext:true},
{id:"I95d1",name:"عائشة",g:"F",father:"I95",mother:"I5d1",note:"أم مريم باب بنت محمذن بن المان بن سيد الفالي بن حبلل بن ابراهيم"},
{id:"I96w1",name:"ام المومنين",g:"F",father:"Z96",spouses:["I96"],crossLink:true,fullName:"ام المومنين بنت مام بن عبد الودود بن الأمين بن حمم بن ابو الحس بن المزضف"},
{id:"I96s1",name:"محمذن",g:"M",father:"I96",mother:"I96w1",dates:"…؟… – 1347هـ/1929م",note:"لم يعقب"},
{id:"I96w2",name:"امانّه (سلمه)",g:"F",father:"I80",note:"زواج داخلي بالأسرة",spouses:["I96"]},
{id:"I96s2",name:"ابيّاه",g:"M",father:"I96",mother:"I96w2",dates:"…؟… – 1367هـ/1948م",note:"لم يعقب"},
{id:"I96d3",name:"ايات (ام الخيرات)",g:"F",father:"I96",mother:"I96w2",dates:"1323هـ/1905م – 1357هـ/1938م",place:"أبير حيبلل",note:"أم المختار بن عبد الله بن الأمين بن بيبات بن حمم بن المبارك بن اما (الماقور)؛ أم احمد سالم والسيد ابني محمدن بن آياه (بوبكر) بن احمد بن الأمين بن حمم بن ابو الحس بن المزضف — لم يعقبا",spouses:["Z156","F129"]},
{id:"I96d4",name:"مريم",g:"F",father:"I96",mother:"I96w2",dates:"1326هـ/1908م – 1405هـ/1985م",place:"أبير حيبلل",note:"أم عائشة من بنات كاكاه (ببكر) بن اميو بن سيد احممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم؛ زواج داخلي بالأسرة",spouses:["I29"]},
{id:"I97w1",name:"فاطمان",g:"F",father:"W6",dates:"1353هـ/1934م –",spouses:["I97"],crossLink:true,fullName:"فاطمان بنت احمد بن امم (محمذن ميلود) بن محمد بن عبد الله بن محمودن",mother:"W6w1"},
{id:"I97d1",name:"خديجة",g:"F",father:"I97",mother:"I97w1",dates:"1373هـ/1954م –"},
{id:"I98",para:98,name:"محمد الأمين",g:"M",father:"I97",mother:"I97w1",dates:"1384هـ/1964م –",spouses:["I98w1","I20d2"]},
{id:"I97d2",name:"امانّه",g:"F",father:"I97",mother:"I97w1",dates:"1390هـ/1970م –"},
{id:"I99",para:99,name:"احمد",g:"M",father:"I97",mother:"I97w1",dates:"1394هـ/1974م –",spouses:["I99w1"]},
{id:"I98w1",name:"ففه",g:"F",father:"XA1370",note:"زواج داخلي بالأسرة",dates:"1400هـ/1980م –",spouses:["I98"]},
{id:"I98s1",name:"محمد يحظيه",g:"M",father:"I98",mother:"I98w1",dates:"1434هـ/2013م –",note:"لم يعقب"},
{id:"I99w1",name:"فلانة",g:"F",father:null,note:"غير محددة في المصدر",spouses:["I99"]},
{id:"I99d1",name:"رحمه",g:"F",father:"I99",mother:"I99w1"},
{id:"I100w1",name:"عايشا",g:"F",father:"Z46",mother:"Z49w1",note:"أم محمد فال بن سيد بن محمذن بن الفالي بن معلوم بن ابراهيم — لم يعقب",spouses:["I100","I66"],crossLink:true,fullName:"عايشا بنت احمد بن محمد الباقر بن حمم بن ابو الحس بن المزضف"},
{id:"I100d1",name:"صفيّه",g:"F",father:"I100",mother:"I100w1",note:"أم تايمي بنت سيد بن الحسن بن المختار سعيد بن بزيد بن المبارك بن اما (الماقور) — لم تعقب"},
{id:"I100w2",name:"ام المومنين",g:"F",father:"K55",note:"رابط بين الأسرتين محتمل",spouses:["I100"],crossLink:true},
{id:"I100s1",name:"محمذن",g:"M",father:"I100",mother:"I100w2",dates:"…؟… – 1334هـ/1916م",note:"لم يعقب"},
{id:"I100d3",name:"عيشني",g:"F",father:"I100",mother:"I100w2",note:"لم تعقب"},
{id:"I101w1",name:"خيراته",g:"F",father:"Y53",spouses:["I101"]},
{id:"I101s1",name:"الحسين",g:"M",father:"I101",mother:"I101w1",note:"لم يعقب"},
{id:"I101s2",name:"الحسن",g:"M",father:"I101",mother:"I101w1",note:"لم يعقب"},
{id:"S1w1",name:"اخدجيه",g:"F",father:"XA899",spouses:["S1"],ext:true},
{id:"S1w2",name:"فاطمة السالمه",g:"F",father:"XA900",spouses:["S1"],ext:true},
{id:"S1w3",name:"امباركه",g:"F",father:"XA977",spouses:["S1"],ext:true},
{id:"S2w1",name:"مريم -اولاد امبارك-",g:"F",father:null,spouses:["S2"]},
{id:"S2d2",name:"اخديجه",g:"F",father:"S2",mother:"S2w1",note:"أم أبناء سيد محمد بن لمرابط اشفغ محمذن بن سيد محمد",spouses:["S30"]},
{id:"S3w1",name:"خوله",g:"F",father:"S7",note:"زواج داخلي بالأسرة؛ أم أبناء بب (احمد سالم) بن الشيخ بن سيد محمد",spouses:["S3"],mother:"S7w3"},
{id:"S3s1",name:"المختار",g:"M",father:"S3",mother:"S3w1",note:"لم يعقب"},
{id:"S3s2",name:"امبارك",g:"M",father:"S3",mother:"S3w1",note:"لم يعقب"},
{id:"S4d1",name:"اخديجه",g:"F",father:"S4",mother:"S14d1",dates:"…؟… – 1436هـ/2015م",place:"اركيز",note:"أم بعض أبناء المختار السالم بن احمد بن احممد فال بن محنض بن اغلجئذن بن بتاجه بن ماندي بن سيد (المختار) بن عبد الله"},
{id:"S4d2",name:"ام الخير",g:"F",father:"S4",mother:"S14d1",note:"أم احمد سالم بن الفوكان بن احميّد -اداهبم-؛ أم أبناء يحي (الحييد) بن احمد -ارماظني-"},
{id:"S4d3",name:"البتول",g:"F",father:"S4",mother:"S14d1",note:"أم أبناء غوثان بن اكنين -امساسيد-"},
{id:"S5w1",name:"آمنة",g:"F",father:"S12",note:"زواج داخلي بالأسرة؛ أم عائشة (منت بب) بنت محمد بن بب (احمد سالم) بن الشيخ بن سيد محمد",spouses:["S5"],mother:"S12w1"},
{id:"S5d1",name:"منت بَب (عيشة)",g:"F",father:"S5",mother:"S5w1",place:"أبير حيبلل",note:"لم تعقب"},
{id:"S6w1",name:"بوزه",g:"F",father:"D44",spouses:["S6"],crossLink:true,fullName:"بوزه بنت حمم بن محمذن بن محنض بن ينصر (المختار) بن احموذيلل بن سيد (المختار) بن عبد الله",mother:"D44w2",note:"أم عائشة بنت محمد المختار بن الشيخ بن سيد محمد"},
{id:"S7w1",name:"الناه",g:"F",father:"XA903",spouses:["S7"],ext:true},
{id:"S7w2",name:"ام الخيري",g:"F",father:"J23",note:"أم المختار بن الأمين بن اشفغات بن الصالح بن احمد بودولو -اهل بوفالن-",spouses:["S7"],crossLink:true},
{id:"S7s1",name:"احمد لمغني",g:"M",father:"S7",mother:"S7w2",note:"لم يعقب"},
{id:"S7w3",name:"مريم",g:"F",father:"J23",spouses:["S7"],crossLink:true,mother:"J23w1",note:"أم موهوب (محمد) وأواه وآمنة وخولو من أبناء المختار بن سيد محمد"},
{id:"S7d1",name:"آمنة",g:"F",father:"S7",mother:"S7w3",note:"أم بدّاه (احمدُّ) وفاطمة ابني محمذن بن احمد فال بن الفالي بن المبارك بن اما (الماقور)"},
{id:"S8w1",name:"سعاد",g:"F",father:"XA904",spouses:["S8"],ext:true},
{id:"S8s1",name:"النـاها",g:"M",father:"S8",mother:"S8w1",note:"لم تعقب"},
{id:"S8d1",name:"العاليه",g:"F",father:"S8",mother:"S8w1",note:"لم تعقب"},
{id:"S8w2",name:"فاطمة",g:"F",father:"XA902",spouses:["S8"],ext:true},
{id:"S8s2",name:"محمذن",g:"M",father:"S8",mother:"S8w2",note:"لم يعقب"},
{id:"S8d2",name:"ام المومنين",g:"F",father:"S8",mother:"S8w2",note:"أم فالن وفلانة ابني محمذن بن آك -؟-؛ أم فلانة بنت عبد الله بن محمد بن سيد محمد -؟-"},
{id:"S9w1",name:"تسلم",g:"F",father:"XA585",spouses:["S9"],ext:true},
{id:"S10w1",name:"امباركه",g:"F",father:"XA1371",spouses:["S10"],ext:true},
{id:"S11w1",name:"فاطمة",g:"F",father:"XA1374",spouses:["S11"],ext:true},
{id:"S11d1",name:"مريم تسلم",g:"F",father:"S11",mother:"S11w1",note:"أم بعض أبناء الشامخ (سيد محمد) بن المصطفى بن سيد محمد بن المصطفى بن سيد محمد؛ زواج داخلي بالأسرة",fullName:"مريم تسلم بنت اتّاه (موسى افال) بن احمد بن التّاه بن المختار بن سيد محمد",spouses:["S81"]},
{id:"S11d2",name:"آمنة",g:"F",father:"S11",mother:"S11w1"},
{id:"S11d3",name:"عائشة",g:"F",father:"S11",mother:"S11w1"},
{id:"S11d4",name:"خديجة",g:"F",father:"S11",mother:"S11w1"},
{id:"S12w1",name:"فلانة -؟-",g:"F",father:null,spouses:["S12"]},
{id:"S13w1",name:"فاطمة",g:"F",father:"S2",note:"زواج داخلي بالأسرة؛ أم بنات موهوب (محمدُّ) بن المختار بن سيد محمد",spouses:["S13"],mother:"S2w1"},
{id:"S13d2",name:"عائشة",g:"F",father:"S13",mother:"S13w1",note:"أم فاطمة بنت محمدن بن آياه بن احمد بن الأمين بن حمم بن ابو الحس بن المزضف — لم تعقب"},
{id:"S13d3",name:"مريم",g:"F",father:"S13",mother:"S13w1",note:"أم امتها (صفيّو) بنت اميني (الأمين) بن سيد بن محمد بن الأمين بن حمم بن ابو الحس بن المزضف"},
{id:"S14w1",name:"العاليه",g:"F",father:"XA907",spouses:["S14"],ext:true},
{id:"S14d1",name:"ام المومنين السالمه",g:"F",father:"S14",mother:"S14w1",note:"أم بنات ادّيو (الشيخ) بن بب (احمد سالم) بن الشيخ بن سيد محمد؛ زواج داخلي بالأسرة",spouses:["S4"]},
{id:"S15w1",name:"عائشة",g:"F",father:"S6",note:"زواج داخلي بالأسرة؛ أم أبناء الشيخ بن الحسن بن سيد محمد",spouses:["S15"],mother:"S6w1"},
{id:"S15d1",name:"العاليه",g:"F",father:"S15",mother:"S15w1",dates:"…؟… – 1411هـ/2011م",note:"أم أبناء محمد عبد الله بن البشير -اجغماجك-؛ أم أبناء محمدن بن محنض باب -اولاد اعمر آكداش-"},
{id:"S15d2",name:"فاطمة",g:"F",father:"S15",mother:"S15w1",note:"أم أبناء حبيب بن الجيد -اولاد ابيريي-"},
{id:"S15d3",name:"آمنة",g:"F",father:"S15",mother:"S15w1",place:"البعلاتيو",note:"أم اماه بنت علي بن احميدي -اولاد ابيريي-"},
{id:"S16w1",name:"ميته -اهل اشفغ موسى-",g:"F",father:null,spouses:["S16"]},
{id:"S16d1",name:"جدله",g:"F",father:"S16",mother:"S16w1"},
{id:"S16d2",name:"مريم",g:"F",father:"S16",mother:"S16w1"},
{id:"S16w2",name:"بركه -؟-",g:"F",father:null,spouses:["S16"]},
{id:"S16s1",name:"احمد (ديو)",g:"M",father:"S16",mother:"S16w2",note:"لم يعقب"},
{id:"S16s2",name:"البسطامي",g:"M",father:"S16",mother:"S16w2",note:"لم يعقب"},
{id:"S16s3",name:"محمد المامي",g:"M",father:"S16",mother:"S16w2",note:"لم يعقب"},
{id:"S16s4",name:"محمذن",g:"M",father:"S16",mother:"S16w2",note:"لم يعقب"},
{id:"S16d3",name:"عائشة",g:"F",father:"S16",mother:"S16w2"},
{id:"S17w1",name:"فطيمه -ادلغرب-",g:"F",father:null,spouses:["S17"]},
{id:"S17s1",name:"اكرم",g:"M",father:"S17",mother:"S17w1",note:"لم يعقب"},
{id:"S17s2",name:"محمد الحسن",g:"M",father:"S17",mother:"S17w1",note:"لم يعقب"},
{id:"S17d1",name:"ميه",g:"F",father:"S17",mother:"S17w1"},
{id:"S18s1",name:"موسى",g:"M",father:"S18",mother:"S24d1",note:"لم يعقب"},
{id:"S18s2",name:"عيسى",g:"M",father:"S18",mother:"S24d1",note:"لم يعقب"},
{id:"S18s3",name:"احمد",g:"M",father:"S18",mother:"S24d1",note:"لم يعقب"},
{id:"S18d1",name:"مريم",g:"F",father:"S18",mother:"S24d1"},
{id:"S18d2",name:"فاطمة",g:"F",father:"S18",mother:"S24d1"},
{id:"S18d3",name:"عائشة",g:"F",father:"S18",mother:"S24d1"},
{id:"S19w1",name:"مريم سكينه",g:"F",father:"XA908",spouses:["S19"],ext:true},
{id:"S19s1",name:"ابراهيم",g:"M",father:"S19",mother:"S19w1",note:"لم يعقب"},
{id:"S19s2",name:"محمد الحسن",g:"M",father:"S19",mother:"S19w1",note:"لم يعقب"},
{id:"S20w1",name:"فاطمه",g:"F",father:"XA910",place:"البعلاتيو",spouses:["S20"],ext:true},
{id:"S20d1",name:"مريم",g:"F",father:"S20",mother:"S20w1"},
{id:"S20d2",name:"العاليه",g:"F",father:"S20",mother:"S20w1"},
{id:"S20d3",name:"عائشة",g:"F",father:"S20",mother:"S20w1",note:"أم أبناء لمرابط بن محنض باب -ادابلحسن-"},
{id:"S20d5",name:"فطامه",g:"F",father:"S20",mother:"S20w1",note:"أم أبناء الشيخ احمد بن الفاروق (محمد المصطفى) بن عبد الله بن لمرابط اشفغ محمذن",spouses:["S65"]},
{id:"S21w1",name:"اماه",g:"F",father:"XA912",spouses:["S21"],ext:true},
{id:"S21s1",name:"السعد",g:"M",father:"S21",mother:"S21w1",note:"لم يعقب"},
{id:"S21d1",name:"آمنة",g:"F",father:"S21",mother:"S21w1"},
{id:"S21d2",name:"فاطمة",g:"F",father:"S21",mother:"S21w1"},
{id:"S21d3",name:"الشفاء",g:"F",father:"S21",mother:"S21w1"},
{id:"S21s2",name:"يعقوب",g:"M",father:"S21",mother:"S21w1",note:"لم يعقب"},
{id:"S21s3",name:"محمد المختار",g:"M",father:"S21",mother:"S21w1",note:"لم يعقب"},
{id:"S22w1",name:"فيفي",g:"F",father:"XA914",spouses:["S22"],ext:true},
{id:"S22s1",name:"احمد",g:"M",father:"S22",mother:"S22w1",note:"لم يعقب"},
{id:"S22d1",name:"فاطمة",g:"F",father:"S22",mother:"S22w1"},
{id:"S22d2",name:"مريم",g:"F",father:"S22",mother:"S22w1"},
{id:"S23w1",name:"جميله",g:"F",father:"S61",note:"زواج داخلي بالأسرة",spouses:["S23"]},
{id:"S23d1",name:"منى",g:"F",father:"S23",mother:"S23w1"},
{id:"S23s1",name:"عمر",g:"M",father:"S23",mother:"S23w1",note:"لم يعقب"},
{id:"S23d2",name:"زينب",g:"F",father:"S23",mother:"S23w1"},
{id:"S23d3",name:"فاطمة",g:"F",father:"S23",mother:"S23w1"},
{id:"S23d4",name:"الزهرة",g:"F",father:"S23",mother:"S23w1"},
{id:"S24w1",name:"فاطمة السالمه",g:"F",father:"XA882",place:"البعلاتيو",spouses:["S24"],ext:true},
{id:"S24d1",name:"امـنـه",g:"F",father:"S24",mother:"S24w1",note:"زواج داخلي بالأسرة",spouses:["S18"]},
{id:"S24d2",name:"ميمهنه",g:"F",father:"S24",mother:"S24w1"},
{id:"S24d3",name:"اماه",g:"F",father:"S24",mother:"S24w1"},
{id:"S25w1",name:"نفيسه",g:"F",father:"XA917",spouses:["S25"],ext:true},
{id:"S25d1",name:"فاطمة السالمه",g:"F",father:"S25",mother:"S25w1"},
{id:"S25d2",name:"مريم",g:"F",father:"S25",mother:"S25w1"},
{id:"S25s1",name:"محمد المختار",g:"M",father:"S25",mother:"S25w1",note:"لم يعقب"},
{id:"S26w1",name:"النجاح",g:"F",father:"V1",spouses:["S26"],ext:true},
{id:"S26d1",name:"فاطمة السالمه",g:"F",father:"S26",mother:"S26w1"},
{id:"S27w1",name:"فاطمة",g:"F",father:"XA865",spouses:["S27"],ext:true},
{id:"S27d1",name:"مريم العاليه",g:"F",father:"S27",mother:"S27w1",note:"لم تعقب"},
{id:"S28w1",name:"فاطمة",g:"F",father:"XA920",spouses:["S28"],ext:true},
{id:"S28s1",name:"الحسن",g:"M",father:"S28",mother:"S28w1",note:"لم يعقب"},
{id:"S28s2",name:"سيد محمد",g:"M",father:"S28",mother:"S28w1",note:"لم يعقب"},
{id:"S28d1",name:"مريم",g:"F",father:"S28",mother:"S28w1"},
{id:"S28d2",name:"العاليه",g:"F",father:"S28",mother:"S28w1"},
{id:"S29w1",name:"اخدجيه",g:"F",father:"XA882",spouses:["S29"],ext:true},
{id:"S29s1",name:"الشيخ",g:"M",father:"S29",mother:"S29w1",note:"لم يعقب"},
{id:"S29d1",name:"مريم",g:"F",father:"S29",mother:"S29w1",note:"لها عقب في اهل مالي الزين"},
{id:"S29d2",name:"فاطمة",g:"F",father:"S29",mother:"S29w1",note:"لها عقب في المدلش"},
{id:"S29w2",name:"آمنة",g:"F",father:"XA922",spouses:["S29"],ext:true},
{id:"S29d3",name:"ام الخير",g:"F",father:"S29",mother:"S29w2",note:"لم تعقب"},
{id:"S29d4",name:"خديجة",g:"F",father:"S29",mother:"S29w2",note:"أم مريم الزغمو بنت محمد الأمين بن عبد الرزاق -اولاد ابيريي-"},
{id:"S29d5",name:"ام كلثوم",g:"F",father:"S29",mother:"S29w2",note:"أم أبناء احمد زيدان -؟-"},
{id:"S29d6",name:"عائشة",g:"F",father:"S29",mother:"S29w2",note:"أم محمد المصطفى ومريم: من اهل محمد حرمه -اولاد ابيريي-"},
{id:"S29w3",name:"فاطمة",g:"F",father:"XA923",spouses:["S29"],ext:true},
{id:"S29w4",name:"عشات -جارية-",g:"F",father:null,spouses:["S29"]},
{id:"S29w5",name:"مريم",g:"F",father:"XA1377",spouses:["S29"],ext:true},
{id:"S29w6",name:"بابّه -ادوعيش-",g:"F",father:null,spouses:["S29"]},
{id:"S29d7",name:"وهبه",g:"F",father:"S29",mother:"S29w6",note:"لها عقب في اداهبم -اولاد ابيريي-"},
{id:"S30w1",name:"اخدجيه",g:"F",father:"S2",mother:"S2w1",note:"زواج داخلي بالأسرة",spouses:["S30"]},
{id:"S30d1",name:"عائشة",g:"F",father:"S30",mother:"S30w1",note:"أم محمد بن سيد بن ان -كنتو-؛ أم مكفولو بنت الركاد -كنتو-"},
{id:"S30d2",name:"مكفوله",g:"F",father:"S30",mother:"S30w1",note:"أم أبناء محمد بن الامام -اديبسات-"},
{id:"S30d3",name:"مريم",g:"F",father:"S30",mother:"S30w1",note:"أم فاطمة بنت الحاج الحمبلي -ادوعيش- — لم تعقب"},
{id:"S30d4",name:"آمنة",g:"F",father:"S30",mother:"S30w1",note:"لم تعقب"},
{id:"S31w1",name:"زينب",g:"F",father:"XA924",spouses:["S31"],ext:true},
{id:"S31s1",name:"صدفَه",g:"M",father:"S31",mother:"S31w1",note:"لم يعقب"},
{id:"S32w1",name:"منينَه",g:"F",father:"XA1377",spouses:["S32"],ext:true},
{id:"S32s1",name:"باب",g:"M",father:"S32",mother:"S32w1",note:"لم يعقب"},
{id:"S32d1",name:"اخديجه",g:"F",father:"S32",mother:"S32w1",note:"أم اخويره بنت الشيخ بن بكار بن اسويد احمد"},
{id:"S32d2",name:"عائشة",g:"F",father:"S32",mother:"S32w1",note:"أم أبناء محمد بن ابرهام بن حمم عاشور -ادوعلي-"},
{id:"S32d3",name:"فاطمة",g:"F",father:"S32",mother:"S32w1",note:"أم عثمان بن محمد -اهل احممد شني-"},
{id:"S33w1",name:"اميلمنين",g:"F",father:"XA1013",spouses:["S33"],ext:true},
{id:"S33s1",name:"باب (محمذن)",g:"M",father:"S33",mother:"S33w1",note:"لم يعقب"},
{id:"S34w1",name:"رمله",g:"F",father:"XA1378",spouses:["S34"]},
{id:"S34s1",name:"محمد الأمين (أمين)",g:"M",father:"S34",mother:"S34w1",place:"اكليتت تفجار (تكانت)",note:"لم يعقب"},
{id:"S35w1",name:"خيرا",g:"F",father:"XA926",spouses:["S35"],ext:true},
{id:"S36w1",name:"اكليثم",g:"F",father:"XA882",spouses:["S36"],ext:true},
{id:"S36s1",name:"محمد المصطفى",g:"M",father:"S36",mother:"S36w1",note:"لم يعقب"},
{id:"S36d1",name:"اميله",g:"F",father:"S36",mother:"S36w1",note:"أم أبناء الناجي بن محمد محمود بن محمد بن لمرابط اشفغ محمذن",spouses:["S44"]},
{id:"S36d2",name:"عائشة",g:"F",father:"S36",mother:"S36w1",note:"أم أبناء شكرود بن محمد"},
{id:"S36d3",name:"التبره",g:"F",father:"S36",mother:"S36w1"},
{id:"S36d4",name:"اشريف (سيد محمد)",g:"F",father:"S36",mother:"S36w1"},
{id:"S36d5",name:"لمات",g:"F",father:"S36",mother:"S36w1"},
{id:"S36d6",name:"لقلة",g:"F",father:"S36",mother:"S36w1"},
{id:"S37w1",name:"اشريفه",g:"F",father:"S48",note:"زواج داخلي بالأسرة؛ أم الشامخ وبنّات ابني الشيخ احمد بن الشامخ (محمد المختار) بن محمد المختار بن محمد محمود بن لمرابط اشفغ محمذن بن سيد محمد",spouses:["S37"],mother:"S48w1"},
{id:"S37s1",name:"شامخ",g:"M",father:"S37",mother:"S37w1",note:"لم يعقب"},
{id:"S37d1",name:"بنَّات",g:"F",father:"S37",mother:"S37w1"},
{id:"S37w2",name:"دليمه",g:"F",father:"S50",note:"زواج داخلي بالأسرة",spouses:["S37"]},
{id:"S37s2",name:"زيدان",g:"M",father:"S37",mother:"S37w2",note:"لم يعقب"},
{id:"S37s3",name:"لمرابط",g:"M",father:"S37",mother:"S37w2",note:"لم يعقب"},
{id:"S38w1",name:"اقليه",g:"F",father:"S43",note:"زواج داخلي بالأسرة",spouses:["S38"]},
{id:"S38d1",name:"ام الخير",g:"F",father:"S38",mother:"S38w1"},
{id:"S38s1",name:"شامخ",g:"M",father:"S38",mother:"S38w1",note:"لم يعقب"},
{id:"S39w1",name:"اميتوَ (فاطمة)",g:"F",father:"S60",mother:"S60w1",note:"زواج داخلي بالأسرة",spouses:["S39"]},
{id:"S39s1",name:"عبد الله",g:"M",father:"S39",mother:"S39w1",note:"لم يعقب"},
{id:"S40w1",name:"رقيه",g:"F",father:"S74",note:"زواج داخلي بالأسرة",spouses:["S40"]},
{id:"S40s1",name:"صالح",g:"M",father:"S40",mother:"S40w1",note:"لم يعقب"},
{id:"S40s2",name:"الشيخ",g:"M",father:"S40",mother:"S40w1",note:"لم يعقب"},
{id:"S40s3",name:"عبد الله",g:"M",father:"S40",mother:"S40w1",note:"لم يعقب"},
{id:"S40d1",name:"فاطمة",g:"F",father:"S40",mother:"S40w1"},
{id:"S40s4",name:"محمد محمود",g:"M",father:"S40",mother:"S40w1",note:"لم يعقب"},
{id:"S40s5",name:"اسامه",g:"M",father:"S40",mother:"S40w1",note:"لم يعقب"},
{id:"S40s6",name:"لمرابط",g:"M",father:"S40",mother:"S40w1",note:"لم يعقب"},
{id:"S41w1",name:"اخدجيه",g:"F",father:"XA929",spouses:["S41"],ext:true},
{id:"S41s1",name:"صدفَه",g:"M",father:"S41",mother:"S41w1",note:"لم يعقب"},
{id:"S41w2",name:"فلانة -اولاد اعلي انتونفو-",g:"F",father:null,spouses:["S41"]},
{id:"S41d1",name:"ام الخيري",g:"F",father:"S41",mother:"S41w2",note:"أم أبناء محمد فال بن ببانا -تنواجيه-"},
{id:"S41w3",name:"افيطيم -جارية-",g:"F",father:null,spouses:["S41"]},
{id:"S41d2",name:"اخديجه",g:"F",father:"S41",mother:"S41w3",note:"أم أبناء محمد بن محمذن -اداشغره-"},
{id:"S41w4",name:"مريم",g:"F",father:"S78",note:"زواج داخلي بالأسرة؛ أم فاطمة بنت محمد بن لمرابط اشفغ محمذن بن سيد محمد",spouses:["S41"],mother:"S78w1"},
{id:"S41d3",name:"فاطمة",g:"F",father:"S41",mother:"S41w4",note:"أم عزه بنت عبد الودود -اديقب-"},
{id:"S42w1",name:"زينب (لكحيلو)",g:"F",father:"XA931",spouses:["S42"],ext:true},
{id:"S42s1",name:"باب",g:"M",father:"S42",mother:"S42w1",note:"لم يعقب"},
{id:"S42d1",name:"افيت (فاطمة)",g:"F",father:"S42",mother:"S42w1",note:"أم بعض أبناء الشيخ سيد محمد بن الشيخ بن لمرابط اشفغ محمذن"},
{id:"S42d2",name:"خديجة",g:"F",father:"S42",mother:"S42w1",note:"أم اكاه وزينب ابني المجتبى بن امح -اديقب-؛ أم أبناء سيد بن محمد بن امح -اديقب-؛ أم آمنة بنت الناجي بن سيد احمد -اولاد اعلي-"},
{id:"S43w1",name:"فاطمة",g:"F",father:"XA933",spouses:["S43"],ext:true},
{id:"S43s1",name:"امود (محمد محمود)",g:"M",father:"S43",mother:"S43w1",note:"لم يعقب"},
{id:"S43d2",name:"اغليه",g:"F",father:"S43",mother:"S43w1",note:"أم محمد المصطفى بن محمد محمود بن الفاروق (محمد المصطفى) بن عبد الله بن لمرابط اشفغ محمذن؛ أم أبناء سيد بن الشامخ (محمد المختار) بن محمد المختار بن محمد محمود بن لمرابط اشفغ محمذن",spouses:["S38"]},
{id:"S43s2",name:"المصطفى",g:"M",father:"S43",mother:"S43w1",note:"لم يعقب"},
{id:"S43s3",name:"السالك",g:"M",father:"S43",mother:"S43w1",note:"لم يعقب"},
{id:"S43s4",name:"الناجي",g:"M",father:"S43",mother:"S43w1",note:"لم يعقب"},
{id:"S44w1",name:"اميله",g:"F",father:"S36",note:"زواج داخلي بالأسرة",spouses:["S44"]},
{id:"S44s1",name:"محمد (شقالي)",g:"M",father:"S44",mother:"S44w1",note:"لم يعقب"},
{id:"S44s2",name:"الشيخ احمد",g:"M",father:"S44",mother:"S44w1",note:"لم يعقب"},
{id:"S44d1",name:"منى",g:"F",father:"S44",mother:"S44w1"},
{id:"S44s3",name:"سعدن",g:"M",father:"S44",mother:"S44w1",note:"لم يعقب"},
{id:"S44s4",name:"سيد",g:"M",father:"S44",mother:"S44w1",note:"لم يعقب"},
{id:"S44s5",name:"باب",g:"M",father:"S44",mother:"S44w1",note:"لم يعقب"},
{id:"S44d2",name:"خديجة",g:"F",father:"S44",mother:"S44w1"},
{id:"S45s1",name:"امود (محمد محمود)",g:"M",father:"S45",mother:"S47d1",note:"لم يعقب"},
{id:"S45s2",name:"سيد عالي",g:"M",father:"S45",mother:"S47d1",note:"لم يعقب"},
{id:"S45s3",name:"سامي",g:"M",father:"S45",mother:"S47d1",note:"لم يعقب"},
{id:"S45d1",name:"ابتسام",g:"F",father:"S45",mother:"S47d1"},
{id:"S46w1",name:"خدجية",g:"F",father:"XA935",spouses:["S46"],ext:true},
{id:"S46w2",name:"فاطمة",g:"F",father:"XA935",spouses:["S46"],ext:true},
{id:"S46d1",name:"عائشة",g:"F",father:"S46",mother:"S46w2"},
{id:"S47w1",name:"فاطمة",g:"F",father:"XA936",spouses:["S47"],ext:true},
{id:"S48w1",name:"اغويه (ام كلثوم)",g:"F",father:"S74",note:"زواج داخلي بالأسرة",spouses:["S48"]},
{id:"S47d1",name:"مريم",g:"F",father:"S47",mother:"S47w1",note:"لم تعقب؛ زواج داخلي بالأسرة",spouses:["S45"]},
{id:"S47d2",name:"لميمه",g:"F",father:"S47",mother:"S47w1",note:"أم أبناء الطالب بن حدمين -اديقب-"},
{id:"S47d3",name:"ام الخيري",g:"F",father:"S47",mother:"S47w1",note:"لم تعقب"},
{id:"S47w2",name:"السالمه",g:"F",father:"S29s1",note:"زواج داخلي بالأسرة",spouses:["S47"]},
{id:"S47d4",name:"مريم العاليه",g:"F",father:"S47",mother:"S47w2",note:"أم أبناء الشيخ بن محمد محمود بن لمرابط اشفغ محمذن بن سيد محمد"},
{id:"S47d5",name:"لميمه (ام كلثوم)",g:"F",father:"S47",mother:"S47w2",note:"أم عائشة بنت عبد الله بن بون -الجكين-؛ أم ناصر بن محمد الأمين بن ناجم -المجلس-"},
{id:"S48d2",name:"فرحه",g:"F",father:"S48",mother:"S48w1"},
{id:"S48s1",name:"سيد عالي",g:"M",father:"S48",mother:"S48w1",note:"لم يعقب"},
{id:"S48s2",name:"الشيخ",g:"M",father:"S48",mother:"S48w1",note:"لم يعقب"},
{id:"S49w1",name:"عيده",g:"F",father:"XA323",spouses:["S49"],ext:true},
{id:"S49s1",name:"عبد الباسط",g:"M",father:"S49",mother:"S49w1",note:"لم يعقب"},
{id:"S49d1",name:"آمال",g:"F",father:"S49",mother:"S49w1"},
{id:"S49s2",name:"محمد المصطفى",g:"M",father:"S49",mother:"S49w1",note:"لم يعقب"},
{id:"S50w1",name:"امامه",g:"F",father:"XA1100",spouses:["S50"]},
{id:"S50d1",name:"فاطمة",g:"F",father:"S50",mother:"S50w1",note:"لها عقب في تجكانت"},
{id:"S50w2",name:"ازوينه",g:"F",father:"XA1100",spouses:["S50"]},
{id:"S50d2",name:"لميمه",g:"F",father:"S50",mother:"S50w2",note:"أم عبد الله بن الشيخ بن الفاروق بن عبد الله بن لمرابط اشفغ محمذن؛ أم خدجية بنت محمد عبد الله بن الفاروق بن عبد الله بن لمرابط اشفغ محمذن؛ أم بعض أبناء الشيخ احمد بن محمد المختار (الشامخ) بن محمد محمود بن لمرابط اشفغ محمذن"},
{id:"S50d3",name:"تغله",g:"F",father:"S50",mother:"S50w2",note:"أم أبناء محمد المصطفى بن باب (محمذن) بن عبد الله بن لمرابط اشفغ محمذن بن سيد محمد",spouses:["S71"]},
{id:"S51w1",name:"عائشة",g:"F",father:"S55",note:"زواج داخلي بالأسرة؛ أم أبناء محمد المصطفى بن ببود (محمد محمود) بن محمد المصطفى بن لمرابط اشفغ محمذن بن سيد محمد",spouses:["S51"],mother:"S55w1"},
{id:"S51s1",name:"لمرابط",g:"M",father:"S51",mother:"S51w1",note:"لم يعقب"},
{id:"S51d1",name:"منى",g:"F",father:"S51",mother:"S51w1"},
{id:"S51s2",name:"سيد عالي",g:"M",father:"S51",mother:"S51w1",note:"لم يعقب"},
{id:"S51s3",name:"حدمين",g:"M",father:"S51",mother:"S51w1",note:"لم يعقب"},
{id:"S51s4",name:"دحيد",g:"M",father:"S51",mother:"S51w1",note:"لم يعقب"},
{id:"S51d2",name:"زينب",g:"F",father:"S51",mother:"S51w1"},
{id:"S52w1",name:"السالمه",g:"F",father:"S55",note:"زواج داخلي بالأسرة؛ أم أبناء زيدان بن ببود (محمد محمود) بن محمد المصطفى بن لمرابط اشفغ محمذن بن سيد محمد",spouses:["S52"],mother:"S55w1"},
{id:"S52s1",name:"اسلم",g:"M",father:"S52",mother:"S52w1",note:"لم يعقب"},
{id:"S52d1",name:"خديجة",g:"F",father:"S52",mother:"S52w1"},
{id:"S52s2",name:"محمد محمود",g:"M",father:"S52",mother:"S52w1",note:"لم يعقب"},
{id:"S53w1",name:"الزهرة -؟-",g:"F",father:null,spouses:["S53"]},
{id:"S53s1",name:"سيد عالي",g:"M",father:"S53",mother:"S53w1",note:"لم يعقب"},
{id:"S53w2",name:"فرحه",g:"F",father:"XA243",note:"رابط بين الأسرتين محتمل",spouses:["S53"],crossLink:true},
{id:"S53s2",name:"ببود",g:"M",father:"S53",mother:"S53w2",note:"لم يعقب"},
{id:"S53d1",name:"اللو",g:"F",father:"S53",mother:"S53w2"},
{id:"S53s3",name:"فلان",g:"M",father:"S53",mother:"S53w2",note:"لم يعقب"},
{id:"S54w1",name:"حياة -؟-",g:"F",father:null,spouses:["S54"]},
{id:"S54s1",name:"محمد الأمين",g:"M",father:"S54",mother:"S54w1",note:"لم يعقب"},
{id:"S55w1",name:"امهها",g:"F",father:"XA939",spouses:["S55"],ext:true},
{id:"S55s1",name:"سيد محمد",g:"M",father:"S55",mother:"S55w1",note:"لم يعقب"},
{id:"S55s2",name:"الشيخ السالم",g:"M",father:"S55",mother:"S55w1",note:"لم يعقب"},
{id:"S55s3",name:"يحيان (محمد يحي)",g:"M",father:"S55",mother:"S55w1",note:"لم يعقب"},
{id:"S55d1",name:"ام الخيري",g:"F",father:"S55",mother:"S55w1"},
{id:"S55d2",name:"اديود (فاطمة)",g:"F",father:"S55",mother:"S55w1",note:"أم أبناء امود (محمد محمود) بن الشيخ سيد محمد بن الشيخ بن لمرابط اشفغ محمذن بن سيد محمد"},
{id:"S55w2",name:"فاطمة",g:"F",father:"XA940",spouses:["S55"],ext:true},
{id:"S55s4",name:"محمد المصطفى",g:"M",father:"S55",mother:"S55w2",place:"المجريو",note:"لم يعقب"},
{id:"S55d5",name:"سكت",g:"F",father:"S55",mother:"S55w2",note:"أم أبناء عبد الله بن الهدى -؟-"},
{id:"S56w1",name:"ميمهنه",g:"F",father:"XA941",spouses:["S56"],ext:true},
{id:"S56d1",name:"اشيه",g:"F",father:"S56",mother:"S56w1"},
{id:"S56d2",name:"فرحه",g:"F",father:"S56",mother:"S56w1"},
{id:"S57w1",name:"السلطانه",g:"F",father:"XA939",spouses:["S57"],ext:true},
{id:"S57s1",name:"الشيخ الناجي",g:"M",father:"S57",mother:"S57w1",note:"لم يعقب"},
{id:"S57s2",name:"ببود (محمد محمود)",g:"M",father:"S57",mother:"S57w1",note:"لم يعقب"},
{id:"S57s3",name:"يعقوب",g:"M",father:"S57",mother:"S57w1",note:"لم يعقب"},
{id:"S58w1",name:"خديج",g:"F",father:"S74",note:"زواج داخلي بالأسرة",spouses:["S58"]},
{id:"S58d1",name:"حياتي",g:"F",father:"S58",mother:"S58w1"},
{id:"S59w1",name:"فاطمة",g:"F",father:"XA943",spouses:["S59"],ext:true},
{id:"S59d1",name:"خديجة",g:"F",father:"S59",mother:"S59w1"},
{id:"S60w1",name:"يابّ",g:"F",father:"XA945",spouses:["S60"],ext:true},
{id:"S60s1",name:"الشيخ",g:"M",father:"S60",mother:"S60w1",place:"الغاركات",note:"لم يعقب"},
{id:"S60d1",name:"اميتها (فاطمة)",g:"F",father:"S60",mother:"S60w1",note:"أم السالم وعبد الله ابني محمفوظ بن محمد محمود بن لمرابط اشفغ محمذن بن سيد محمد؛ أم ام كلثوم وآسية بنتي الشيخ سيد محمد بن الشيخ بن لمرابط اشفغ محمذن بن سيد محمد"},
{id:"S61w1",name:"افيطيمه",g:"F",father:"XA503",spouses:["S61"],ext:true},
{id:"S61w2",name:"امروم (مريم)",g:"F",father:"S29s1",note:"زواج داخلي بالأسرة",spouses:["S61"]},
{id:"S61d1",name:"زينب",g:"F",father:"S61",mother:"S61w2"},
{id:"S62w1",name:"دليمه",g:"F",father:"S50",note:"زواج داخلي بالأسرة",spouses:["S62"],fullName:"دليمه بنت محمد محمود بن محمد المصطفى بن لمرابط اشفغ محمذن"},
{id:"S62s1",name:"عبد الله",g:"M",father:"S62",mother:"S62w1",note:"لم يعقب"},
{id:"S62w2",name:"افاتيس",g:"F",father:"XA948",spouses:["S62"],ext:true},
{id:"S62d1",name:"هدى (مريمن)",g:"F",father:"S62",mother:"S62w2"},
{id:"S62s2",name:"الياس",g:"M",father:"S62",mother:"S62w2",note:"لم يعقب"},
{id:"S62s3",name:"محمد",g:"M",father:"S62",mother:"S62w2",note:"لم يعقب"},
{id:"S62d2",name:"الزهرة",g:"F",father:"S62",mother:"S62w2"},
{id:"S63w1",name:"اماه",g:"F",father:"S20",note:"زواج داخلي بالأسرة؛ أم بعض أبناء السالك بن الفاروق بن عبد الله بن لمرابط اشفغ محمذن",spouses:["S63"],mother:"S20w1"},
{id:"S63s1",name:"مراد (محمد المصطفى)",g:"M",father:"S63",mother:"S63w1",note:"لم يعقب"},
{id:"S63d1",name:"الفتيه",g:"F",father:"S63",mother:"S63w1"},
{id:"S63s2",name:"الحسن",g:"M",father:"S63",mother:"S63w1",note:"لم يعقب"},
{id:"S63w2",name:"زينب",g:"F",father:"XA941",spouses:["S63"],ext:true},
{id:"S63d2",name:"حسنه",g:"F",father:"S63",mother:"S63w2"},
{id:"S64w1",name:"تحجلب",g:"F",father:"S43",note:"زواج داخلي بالأسرة؛ أم جميلو بنت العالم بن الفاروق (محمد المصطفى) بن عبد الله بن لمرابط اشفغ محمذن بن سيد محمد",spouses:["S64"],mother:"S43w1"},
{id:"S64d1",name:"جميله",g:"F",father:"S64",mother:"S64w1"},
{id:"S64w2",name:"عائشة",g:"F",father:"XA622",spouses:["S64"],ext:true},
{id:"S64d2",name:"زينب",g:"F",father:"S64",mother:"S64w2"},
{id:"S65w1",name:"فطام",g:"F",father:"S6",mother:"S6w1",note:"زواج داخلي بالأسرة",spouses:["S65"]},
{id:"S65d1",name:"اماتي",g:"F",father:"S65",mother:"S65w1"},
{id:"S65s1",name:"سيد",g:"M",father:"S65",mother:"S65w1",note:"لم يعقب"},
{id:"S65d2",name:"العاليه",g:"F",father:"S65",mother:"S65w1"},
{id:"S65d3",name:"عائشة",g:"F",father:"S65",mother:"S65w1"},
{id:"S65d4",name:"زينب",g:"F",father:"S65",mother:"S65w1"},
{id:"S66w1",name:"دليمه",g:"F",father:"S50",note:"زواج داخلي بالأسرة",spouses:["S66"],fullName:"دليمه بنت محمد محمود بن محمد المصطفى بن لمرابط اشفغ محمذن"},
{id:"S66d1",name:"خديجة",g:"F",father:"S66",mother:"S66w1"},
{id:"S66w2",name:"امروم",g:"F",father:"S74",note:"زواج داخلي بالأسرة؛ أم بعض أبناء محمد عبد الله بن الفاروق بن لمرابط اشفغ محمذن بن سيد محمد",spouses:["S66"],mother:"S74w2"},
{id:"S66d2",name:"فرحه",g:"F",father:"S66",mother:"S66w2"},
{id:"S66s1",name:"محمد المصطفى",g:"M",father:"S66",mother:"S66w2",note:"لم يعقب"},
{id:"S66d3",name:"افتيت",g:"F",father:"S66",mother:"S66w2"},
{id:"S67w1",name:"اغليه",g:"F",father:"S34s2",note:"زواج داخلي بالأسرة",spouses:["S67"]},
{id:"S67s1",name:"محمد المصطفى",g:"M",father:"S67",mother:"S67w1",note:"لم يعقب"},
{id:"S67d1",name:"مريم",g:"F",father:"S67",mother:"S74d4"},
{id:"S67d2",name:"اسماء",g:"F",father:"S67",mother:"S74d4"},
{id:"S67d3",name:"فاطمة",g:"F",father:"S67",mother:"S74d4"},
{id:"S68w1",name:"الزهرة",g:"F",father:"XA952",spouses:["S68"],ext:true},
{id:"S68d1",name:"عائشة",g:"F",father:"S68",mother:"S68w1"},
{id:"S68s1",name:"محمد المصطفى",g:"M",father:"S68",mother:"S68w1",note:"لم يعقب"},
{id:"S69w1",name:"خداجه",g:"F",father:"XA953",spouses:["S69"],ext:true},
{id:"S69s1",name:"محمد العاقب",g:"M",father:"S69",mother:"S69w1",note:"لم يعقب"},
{id:"S69w2",name:"اكليثم",g:"F",father:"J33s1",spouses:["S69"]},
{id:"S69d1",name:"بمبه",g:"F",father:"S69",mother:"S69w2",note:"أم أبناء الحسين بن جد -تجكانت-"},
{id:"S70d1",name:"خديحة (إيمان)",g:"F",father:"S70",mother:"S74d4"},
{id:"S70w2",name:"فاطمة",g:"F",father:"XA957",spouses:["S70"],ext:true},
{id:"S70d2",name:"الشفاء",g:"F",father:"S70",mother:"S70w2"},
{id:"S71w1",name:"تغله",g:"F",father:"S46s1s1",note:"زواج داخلي بالأسرة",spouses:["S71"]},
{id:"S71s1",name:"الإمام",g:"M",father:"S71",mother:"S71w1",note:"لم يعقب"},
{id:"S71d1",name:"فلانة",g:"F",father:"S71",mother:"S71w1"},
{id:"S71s2",name:"اسامة",g:"M",father:"S71",mother:"S71w1",note:"لم يعقب"},
{id:"S71d2",name:"فاطمة",g:"F",father:"S71",mother:"S71w1"},
{id:"S72w1",name:"اشريفه",g:"F",father:"XA960",spouses:["S72"],ext:true},
{id:"S72s1",name:"باب",g:"M",father:"S72",mother:"S72w1",note:"لم يعقب"},
{id:"S72d1",name:"فاطمة الغاليه",g:"F",father:"S72",mother:"S72w1"},
{id:"S72w2",name:"حنان",g:"F",father:"S45",note:"زواج داخلي بالأسرة؛ أم أبناء عبد الله بن باب (محمذن) بن عبد الله بن لمرابط اشفغ محمذن بن سيد محمد",spouses:["S72"],mother:"S47d1"},
{id:"S72s2",name:"عبد الحميد",g:"M",father:"S72",mother:"S72w2",note:"لم يعقب"},
{id:"S72s3",name:"محمد",g:"M",father:"S72",mother:"S72w2",note:"لم يعقب"},
{id:"S73w1",name:"فاطمة",g:"F",father:"XA1382",spouses:["S73"],ext:true},
{id:"S73d1",name:"امروم (مريم)",g:"F",father:"S73",mother:"S73w1",note:"أم بعض أبناء الفاروق (محمد المصطفى) بن عبد الله بن لمرابط اشفغ محمذن"},
{id:"S73d2",name:"السالمه",g:"F",father:"S73",mother:"S73w1",note:"أم القاسم ومريم ودليمو (ام كلثوم) أبناء سيد عالي بن محمد المصطفى بن لمرابط اشفغ محمذن"},
{id:"S73d3",name:"ام كلثوم",g:"F",father:"S73",mother:"S73w1",note:"أم محمد المصطفى بن الغالي بن احمد سالم بن اعمر -لكالكمو-"},
{id:"S73d4",name:"الديج (خديجة)",g:"F",father:"S73",mother:"S73w1",note:"أم محمد المصطفى بن الشيخ بن السجاد -ادوعلي-؛ أم عيشو من أبناء محمد فال بن محمودن بن الأمين بن محمد بن حيب الله بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",spouses:["Y78"]},
{id:"S73d5",name:"آمنة",g:"F",father:"S73",mother:"S73w1"},
{id:"S74w1",name:"اميتوَ (فاطمة)",g:"F",father:"XA1384",place:"ميمونو (تكانت)",spouses:["S74"]},
{id:"S74d1",name:"اغويليه (ام كلثوم)",g:"F",father:"S74",mother:"S74w1",note:"أم أبناء الب (محمد المصطفى) بن سيد عالي بن محمد المصطفى بن لمرابط اشفغ محمذن بن سيد محمد",spouses:["S48"]},
{id:"S74d2",name:"آسية (نبغوها)",g:"F",father:"S74",mother:"S74w1",note:"أم الشيخ بن سيد الأمين بن محمد اطفل -كنتو-"},
{id:"S74w2",name:"افييت (فاطمة)",g:"F",father:"S42",mother:"S42w1",note:"زواج داخلي بالأسرة",spouses:["S74"]},
{id:"S74s1",name:"باب (محمذن)",g:"M",father:"S74",mother:"S74w2",note:"لم يعقب"},
{id:"S74d3",name:"رقيه",g:"F",father:"S74",mother:"S74w2",note:"أم أبناء السالم بن محفوظ بن محمد محمود بن لمرابط اشفغ محمذن بن سيد محمد",spouses:["S40"]},
{id:"S74d4",name:"زينب",g:"F",father:"S74",mother:"S74w2",note:"أم خدجية بنت قاري بن باب (محمذن) بن عبد الله بن لمرابط اشفغ محمذن بن سيد محمد؛ زواج داخلي بالأسرة",spouses:["S67","S70"]},
{id:"S74d5",name:"اخويه (خديج)",g:"F",father:"S74",mother:"S74w2",note:"أم أبناء شغالي (محمد المصطفى) بن سيد محمد بن لمرابط اشفغ محمذن بن سيد محمد"},
{id:"S75w1",name:"فاطمة -؟-",g:"F",father:null,spouses:["S75"]},
{id:"S75d1",name:"افتيت",g:"F",father:"S75",mother:"S75w1"},
{id:"S75w2",name:"شيخاتي -؟-",g:"F",father:null,spouses:["S75"]},
{id:"S75d2",name:"رقيه",g:"F",father:"S75",mother:"S75w2"},
{id:"S75s1",name:"ابو (سيد محمد)",g:"M",father:"S75",mother:"S75w2",note:"لم يعقب"},
{id:"S75s2",name:"محمد المصطفى",g:"M",father:"S75",mother:"S75w2",note:"لم يعقب"},
{id:"S76w1",name:"ادويده (فاطمة)",g:"F",father:"S55",note:"زواج داخلي بالأسرة",spouses:["S76"]},
{id:"S76d1",name:"ازوينه",g:"F",father:"S76",mother:"S76w1"},
{id:"S76d2",name:"اميهيله",g:"F",father:"S76",mother:"S76w1"},
{id:"S76s1",name:"سيد عالي",g:"M",father:"S76",mother:"S76w1",note:"لم يعقب"},
{id:"S77w1",name:"اعزيزه",g:"F",father:"XA503",spouses:["S77"],ext:true},
{id:"S77s1",name:"الشيخ",g:"M",father:"S77",mother:"S77w1",note:"لم يعقب"},
{id:"S77w2",name:"عفاف",g:"F",father:"S45",note:"زواج داخلي بالأسرة؛ أم سعد الدين بن محمد المصطفى بن الشيخ سيد محمد بن الشيخ الصغير بن لمرابط اشفغ محمذن بن سيد محمد",spouses:["S77"],mother:"S47d1"},
{id:"S77s2",name:"سعد الدين",g:"M",father:"S77",mother:"S77w2",note:"لم يعقب"},
{id:"S78w1",name:"فلانة -ادوعلي-",g:"F",father:null,spouses:["S78"]},
{id:"S79w1",name:"عيش",g:"F",father:"XA963",spouses:["S79"],ext:true},
{id:"S80w1",name:"اكليثم",g:"F",father:"XA882",spouses:["S80"],ext:true},
{id:"S80d1",name:"تسلم",g:"F",father:"S80",mother:"S80w1",note:"أم أبناء آب احمد -تنواجيه-"},
{id:"S80w2",name:"فاطمه",g:"F",father:"XA965",spouses:["S80"],ext:true},
{id:"S80s1",name:"محمد محمود",g:"M",father:"S80",mother:"S80w2",note:"لم يعقب"},
{id:"S80d2",name:"زينب",g:"F",father:"S80",mother:"S80w2",note:"لم تعقب"},
{id:"S81w1",name:"فاطم فال",g:"F",father:"XA966",spouses:["S81"],ext:true},
{id:"S81d1",name:"مريم تسلم",g:"F",father:"S81",mother:"S81w1"},
{id:"S81d2",name:"اكليثم",g:"F",father:"S81",mother:"S11d1"},
{id:"S82w1",name:"خدجية",g:"F",father:"XA387",spouses:["S82"],ext:true},
{id:"S82d1",name:"ام الخير",g:"F",father:"S82",mother:"S82w1"},
{id:"S82d2",name:"وحشيه",g:"F",father:"S82",mother:"S82w1"},
{id:"S82d3",name:"اكليثم",g:"F",father:"S82",mother:"S82w1"},
{id:"S82s1",name:"محمد",g:"M",father:"S82",mother:"S82w1",note:"لم يعقب"},
{id:"S82d4",name:"آمنة",g:"F",father:"S82",mother:"S82w1"},
{id:"S82s2",name:"الطبيب",g:"M",father:"S82",mother:"S82w1",note:"لم يعقب"},
{id:"S82s3",name:"سيد محمد",g:"M",father:"S82",mother:"S82w1",note:"لم يعقب"},
{id:"S82s4",name:"الزاوي",g:"M",father:"S82",mother:"S82w1",note:"لم يعقب"},
{id:"D1w1",name:"آسية",g:"F",father:"XA969",spouses:["D1"],ext:true},
{id:"D1d1",name:"تنغجس (الطاهرة)",g:"F",father:"D1",mother:"D1w1",note:"أم أبناء احمد شلل بن محنض بن ابي موسى بن اوبك بن يندبك بن ابراهيم -ادغربهم-",spouses:["XA488"]},
{id:"D1w2",name:"تنغوس",g:"F",father:"XA972",spouses:["D1"],ext:true},
{id:"D1d2",name:"خديجة",g:"F",father:"D1",mother:"D1w2",note:"أم باي وفلانة ابني الكوري بن سيد الفالي"},
{id:"D1d3",name:"عائشة",g:"F",father:"D1",mother:"D1w2",note:"أم خدجية بنت محنض بن الفالي بن يدمهنض بن يعقوب الجامع بن احمد بن اوباك -جد اداشغره-"},
{id:"D1d4",name:"منت المصطفى (فاطمة)",g:"F",father:"D1",mother:"D1w2",note:"أم الفالي بن حمم صار"},
{id:"D1w3",name:"فلانة",g:"F",father:null,spouses:["D1"]},
{id:"D1d5",name:"مريم",g:"F",father:"D1",mother:"D1w3",note:"أم آلچ (الفالي) بن حمم بن سيد بوبكر بن سيد الفالي"},
{id:"D2w1",name:"تـريـش",g:"F",father:"XA1248",spouses:["D2"],ext:true},
{id:"D2d1",name:"مانه",g:"F",father:"D2",mother:"D2w1",place:"بير احممد",note:"أم أبناء باهنين بن الفالي بن حمم صار"},
{id:"D2w2",name:"اهريكم",g:"F",father:"T0-hamnadh",spouses:["D2"],crossLink:true,fullName:"اهريكم بنت محنض بن يدن يعقوب"},
{id:"D2s0",name:"الفالي",g:"M",father:"D2",mother:"D2w2",place:"بقل",note:"لم يعقب"},
{id:"D2s1",name:"بل",g:"M",father:"D2",mother:"D2w2",note:"لم يعقب"},
{id:"D2w3",name:"حنه",g:"F",father:"XA974",spouses:["D2"],ext:true},
{id:"D3w1",name:"حنه دام",g:"F",father:"Y1",note:"أم حيب الله بن سيد احمد بن المختار بن ابنام (احمد) بن هكار؛ أم يالليلي والقاظي ابني امحوذيلل بن سيد (المختار) بن عبد الله؛ أم أبناء المختار بن اشفغ اوبك بن اعمر اديقب",spouses:["D3"],crossLink:true,mother:"Y1w1"},
{id:"D3w2",name:"فلانة",g:"F",father:"E50s1",spouses:["D3"]},
{id:"D4w1",name:"حنه (النقيو)",g:"F",father:"G3",spouses:["D4"],crossLink:true,mother:"G3w1",note:"أم المختار وفاطمة ابني القاظي بن احموذيلل بن سيد (المختار) بن عبد الله"},
{id:"D5w1",name:"عمرانه",g:"F",father:"XA834",mother:"I72d3",spouses:["D5"],ext:true},
{id:"D6w1",name:"فاطمة",g:"F",father:"XA976",spouses:["D6"],ext:true},
{id:"D6w2",name:"فاطمة",g:"F",father:"XA979",spouses:["D6"],ext:true},
{id:"D6d1",name:"عمرانه",g:"F",father:"D6",mother:"D6w2",note:"أم أبناء محمد بن عبد الله بن محمودن",spouses:["XA1119"]},
{id:"D6w3",name:"فلانة",g:"F",father:"XA387",spouses:["D6"],ext:true},
{id:"D6s0",name:"زين",g:"M",father:"D6",mother:"D6w3",note:"لم يعقب"},
{id:"D6d2",name:"الماميه",g:"F",father:"D6",mother:"D6w3"},
{id:"D7w1",name:"مريم",g:"F",father:"T0-hamnadh",spouses:["D7"],ext:true},
{id:"D7d1",name:"اغالوه",g:"F",father:"D7",mother:"D7w1",note:"أم خدجية وام النبي من أبناء ببكر بن مختير بن احمد بن حيب الله بن محمذن بن باب احمد بن محمذن بن سيد (المختار)",spouses:["D57"]},
{id:"D7d2",name:"ام الخيرات",g:"F",father:"D7",mother:"D7w1",note:"أم أبناء الصوفي بن امحذ بن العيدي بن احمد باب بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله"},
{id:"D7d3",name:"فاطمة",g:"F",father:"D7",mother:"D7w1",note:"أم أبناء حبيب بن آب بن المبارك بن حبيب بن ابو الحس بن بل (عبد الله) بن المختار اكد عثمان"},
{id:"D8w1",name:"افيطيمن",g:"F",father:"XA551",note:"أم احمد سالم بن محمذن بن خيليد بن محمذن بن الماح بن المختار بن محنض بن الحسن دوبك",spouses:["D8"],ext:true},
{id:"D8s0",name:"ابن",g:"M",father:"D8",mother:"D8w1",note:"لم يعقب"},
{id:"D8d1",name:"عائشة",g:"F",father:"D8",mother:"D8w1",note:"أم احمد سالم بن محمد فال بن محمذن بن باليل -؟-"},
{id:"D8d2",name:"ذات الدين",g:"F",father:"D8",mother:"D8w1",note:"لم تعقب"},
{id:"D8d3",name:"سلمه",g:"F",father:"D8",mother:"D8w1",note:"أم امباركو وفاطمة من أبناء احممد فال بن محنض بن اغلجئذن بن بتاجه بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله",spouses:["D96"]},
{id:"D8w2",name:"زينب",g:"F",father:"XA387",spouses:["D8"],ext:true},
{id:"D8s1",name:"محمد",g:"M",father:"D8",mother:"D8w2",note:"لم يعقب"},
{id:"D9w1",name:"سكينه",g:"F",father:"R65s1s2s1",spouses:["D9"]},
{id:"D9s1",name:"محمذن",g:"M",father:"D9",mother:"D9w1",note:"لم يعقب"},
{id:"D9s2",name:"ولد حبيب الرحمن",g:"M",father:"D9",mother:"D9w1",note:"لم يعقب"},
{id:"D9d2",name:"فاطمة",g:"F",father:"D9",mother:"D9w1",dates:"1331هـ/1923م – 1431هـ/2010م",place:"احسي السعادة",note:"أم خدجية من أبناء المختار السالم بن امحذ بن احممد فال بن محنض بن اغلجئذن بن بتاجه بن محمذن بن باب احمد بن سيد (المختار)؛ أم انجايو ومنت مختير من بنات مدال بن احمد بن سيد الفالي بن الإمام احمد بن محمذن بن الأمين عمي؛ زواج داخلي بالأسرة",fullName:"فاطمة بنت اليدالي بن احمد بن احميميد بن المختار بن القاظي بن امحوذيلل بن سيد (المختار) بن عبد الله",spouses:["D98"]},
{id:"D9d3",name:"خديجة",g:"F",father:"D9",mother:"D9w1",note:"أم اليدالي من أبناء محمد بن امم (محمذن ميلود) بن محمد بن عبد الله بن محمودن — لم يعقب",spouses:["W8"]},
{id:"D9d4",name:"مينا (فطيمن)",g:"F",father:"D9",mother:"D9w1",dates:"…؟… – 1406هـ/1986م",note:"لم تعقب"},
{id:"D10w1",name:"امـتـه (صفيه)",g:"F",father:"Z131",dates:"1326هـ/1908م – 1406هـ/1986م",place:"ابير حيبلل",spouses:["D10"],crossLink:true,fullName:"امـتـه (صفيه) بنت اميني (الأمين) بن سيد بن محمد بن الأمين بن حمم بن ابو الحس بن المزضف"},
{id:"D10d1",name:"منت مكيو (عائشة)",g:"F",father:"D10",mother:"D10w1",dates:"1357هـ/1938م – 1435هـ/2014م",place:"دليلحو",note:"لم تعقب"},
{id:"D10d2",name:"خديجة",g:"F",father:"D10",mother:"D80d1",dates:"1368هـ/1949م – 1400هـ/1980م",place:"محجوبو",note:"أم بنيت محمذن بن العتيق السالم بن المختار بن دياه (سيد الفالي) بن محمذن بن الفالي بن المبارك بن اما (الماقور)"},
{id:"D11w1",name:"ابوه",g:"F",father:"D81",place:"ابري حيبلل",spouses:["D11"]},
{id:"D11s0",name:"ابن",g:"M",father:"D11",mother:"D11w1",note:"لم يعقب"},
{id:"D11s1",name:"احمد",g:"M",father:"D11",mother:"D11w1",note:"لم يعقب"},
{id:"D11d1",name:"امـنـها",g:"F",father:"D11",mother:"D11w1",dates:"1367هـ/1948م –",note:"أم احمد بن محمد فال بن ولد امحذ احممد فال بن اغلجئذن بن بتاجه بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله؛ زواج داخلي بالأسرة",fullName:"امـنْـها بنت محمودن بن اليدالي بن احمد بن احميميد بن المختار بن القاظي بن امحوذيلل بن سيد (المختار) بن عبد الله",spouses:["D100"]},
{id:"D12",para:12,name:"الأمين",g:"M",father:"D11",mother:"D11w1",dates:"1361هـ/1942م – 1429هـ/2008م",place:"ابير حيبلل",spouses:["D12w1"]},
{id:"D12w1",name:"العربيه",g:"F",father:"XA984",mother:"D97d1",dates:"1389هـ/1969م – 1435هـ/2014م",spouses:["D12"],ext:true},
{id:"D12d1",name:"ورده",g:"F",father:"D12",mother:"D12w1",note:"أم لعريبيو بنت محمذن بن حمم بن احمد بن محمذن بن العيدي المختار باب بن محمذن بن باب احمد بن سيد (المختار)؛ زواج داخلي بالأسرة",fullName:"ورده بنت الأمين بن محمودن بن اليدالي بن احمد بن احميميد بن المختار بن القاظي بن امحوذيلل",spouses:["D72"]},
{id:"D13w1",name:"فاطمة",g:"F",father:"XA1390",spouses:["D13"],ext:true},
{id:"D14w1",name:"آمنة",g:"F",father:"XA991",spouses:["D14"],ext:true},
{id:"D14s1",name:"احمد",g:"M",father:"D14",mother:"D14w1",note:"لم يعقب"},
{id:"D14s2",name:"حامد",g:"M",father:"D14",mother:"D14w1",note:"لم يعقب"},
{id:"D14s3",name:"محمد",g:"M",father:"D14",mother:"D14w1",note:"لم يعقب"},
{id:"D14d1",name:"خديجة",g:"F",father:"D14",mother:"D14w1",note:"لم تعقب"},
{id:"D15w1",name:"فاطمة",g:"F",father:"D25",note:"زواج داخلي بالأسرة",spouses:["D15"],fullName:"فاطمة بنت محمذن بن ابييب بن يالليل بن امحوذيلل بن سيد (المختار) بن عبد الله"},
{id:"D15d1",name:"الزهراء",g:"F",father:"D15",mother:"D15w1",note:"أم محمذن بن حمم (محنض) بن ينصر (المختار) بن امحوذيلل بن سيد (المختار) بن عبد الله؛ زواج داخلي بالأسرة",fullName:"الزهراء بنت محمذن ميلود بن المختار بن القاظي بن امحوذيلل بن سيد (المختار) بن عبد الله",spouses:["D42"]},
{id:"D16w1",name:"فلانة",g:"F",father:"XA1396",spouses:["D16"],ext:true},
{id:"D17w1",name:"فاطمة",g:"F",father:"Z3",spouses:["D17"],crossLink:true,mother:"Z3w2",note:"أم أبناء ابييب بن يالليل بن احموذيلل بن سيد (المختار) بن عبد الله"},
{id:"D17d1",name:"ام المومنين",g:"F",father:"D17",mother:"D17w1",note:"أم مريم وميمونو من أبناء عبيدي بن محمد العاقل"},
{id:"D17d2",name:"خديجان",g:"F",father:"D17",mother:"D17w1",note:"أم أبناء احمد زروق بن فوك بن الأمين عمي؛ أم ابني ياحممذ بن باباحنيد بن احمد زروق",spouses:["E3"]},
{id:"D18w1",name:"آجم",g:"F",father:"I52",mother:"I52w1",spouses:["D18"],crossLink:true},
{id:"D18w2",name:"خدجية",g:"F",father:"I25",mother:"I25w1",spouses:["D18"],crossLink:true},
{id:"D18d1",name:"افيطيمه",g:"F",father:"D18",mother:"D18w2",note:"أم أبناء احمد بن البدوي بن النافع بن محمذن بن شمس الدين بن يعقوبنلل بن محمذن بن اشفغ مكر",spouses:["XA690"]},
{id:"D19s1",name:"احمد",g:"M",father:"D19",mother:"D77d1",note:"لم يعقب"},
{id:"D19s2",name:"محمذن باب",g:"M",father:"D19",mother:"D77d1",note:"لم يعقب"},
{id:"D19d1",name:"اماته",g:"F",father:"D19",mother:"D77d1",note:"لم تعقب"},
{id:"D20w1",name:"امبريكه",g:"F",father:"W1",mother:"W1w1",spouses:["D20"],crossLink:true,fullName:"امبريكه بنت محمد بن ميلود -اهل باركلل-"},
{id:"D21w1",name:"امباركه",g:"F",father:"P33",mother:"P33w1",place:"بتمبصكيت",spouses:["D21"],crossLink:true},
{id:"D21d1",name:"مريم",g:"F",father:"D21",mother:"D21w1",dates:"1317هـ/1899م – 1401هـ/1981م",place:"ابري حيبلل",note:"أم محمد باب بن احمد بن الخراشي -اولاد بزيد-؛ أم محمد محمود بن احمد بن العتيق بن ابامين (الأمين) بن المختار بن احمد اهنكر بن محمد الكريم"},
{id:"D22d1",name:"عائشة",g:"F",father:"D22",mother:"G11w1",note:"لم تعقب"},
{id:"D22d2",name:"امبيريكه",g:"F",father:"D22",mother:"G11w1",note:"لم تعقب"},
{id:"D23w1",name:"السالمه",g:"F",father:"D64",spouses:["D23"]},
{id:"D23d1",name:"آتُّوه",g:"F",father:"D23",mother:"D23w1",place:"اهل سيدن",note:"أم السالمه بنت المختار بن سيد احممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم"},
{id:"D23d3",name:"عائشة",g:"F",father:"D23",mother:"D23w1",note:"لم تعقب"},
{id:"D24w1",name:"هاله (خدجية)",g:"F",father:"J4",note:"أم اماه (مريم) بنت سيد احمد بن محمذن بن سيد الفالي بن حبلل بن ابراهيم؛ أم اماها (مريم) بنت سيد أحمد بن محمذن بن سيد الفالي بن حبلل بن ابراهيم",spouses:["D24"],crossLink:true,mother:"J4w1"},
{id:"D24s1",name:"احمد",g:"M",father:"D24",mother:"D24w1",note:"لم يعقب"},
{id:"D25w1",name:"عيشان",g:"F",father:"XA994",spouses:["D25"],ext:true},
{id:"D25d1",name:"الزهراء",g:"F",father:"D25",mother:"D25w1",note:"أم أبناء محمذن بن حمم (محنض) بن ينصر (المختار) بن امحوذيلل بن سيد (المختار) بن عبد الله"},
{id:"D25d2",name:"فاطمة",g:"F",father:"D25",mother:"D25w1",note:"أم بنيت محمذن ميلود بن المختار بن القاظي بن امحوذيلل بن سيد (المختار) بن عبد الله"},
{id:"D25w2",name:"فلانة",g:"F",father:"XA995",spouses:["D25"],ext:true},
{id:"D26w1",name:"ام المومنين",g:"F",father:"D18",note:"زواج داخلي بالأسرة؛ أم ام راص من أبناء الأمين بن محمذن بن ابييب بن يالليل بن امحوذيلل بن سيد (المختار) بن عبد الله",spouses:["D26"],fullName:"ام المومنين بنت امحذ بن ابييب بن يالليل بن امحوذيلل بن سيد (المختار) بن عبد الله",mother:"D18w2"},
{id:"D26w2",name:"سلمه",g:"F",father:"D76",note:"زواج داخلي بالأسرة",spouses:["D26"]},
{id:"D27w1",name:"مريم",g:"F",father:"D14",note:"زواج داخلي بالأسرة؛ أم أبناء احمد سالم بن الأمين بن محمذن بن ابييب بن يالليل بن امحوذيلل بن سيد (المختار) بن عبد الله",spouses:["D27"],fullName:"مريم بنت الحسين بن علي بن المختار بن القاظي بن امحوذيلل بن سيد (المختار) بن عبد الله",mother:"D14w1"},
{id:"D27s1",name:"الحسين",g:"M",father:"D27",mother:"D27w1",note:"لم يعقب"},
{id:"D27d1",name:"عائشة",g:"F",father:"D27",mother:"D27w1",note:"لم تعقب"},
{id:"D27d2",name:"فاطمة",g:"F",father:"D27",mother:"D27w1",note:"أم أبناء محمذن فال بن سيد -؟-",spouses:["Y140"]},
{id:"D28w1",name:"فاطمة",g:"F",father:"D24",note:"زواج داخلي بالأسرة؛ أم المختار وخدجية ابني محمد مولود بن احمد سالم بن الأمين بن محمذن بن ابييب بن يالليل بن امحوذيلل بن سيد (المختار)",spouses:["D28"],fullName:"فاطمة بنت المختار بن محمذن (ولد سيدن) بن احمذ بن ابييب بن يالليل بن امحوذيلل بن سيد (المختار)",mother:"D24w1",place:"اهل سيدن"},
{id:"D29",para:29,name:"المختار",g:"M",father:"D28",mother:"D28w1",dates:"1348هـ/1930م – 1435هـ/2014م",place:"اهل سيدن",spouses:["D29w1"]},
{id:"D28d1",name:"خديجة",g:"F",father:"D28",mother:"D28w1",dates:"1353هـ/1935م – 1429هـ/2008م",place:"اهل سيدن",note:"أم أبناء ختار (المختار) بن احمد بن محمذن بن العيدي بن المختار باب بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله",spouses:["D74"]},
{id:"D29w1",name:"مريم",g:"F",father:"D11",dates:"1369هـ/1950م –",note:"زواج داخلي بالأسرة؛ أم أبناء المختار بن محمد مولود بن احمد سالم بن الأمين بن محمذن بن ابييب بن يالليل بن امحوذيلل بن سيد (المختار)",spouses:["D29"],fullName:"مريم بنت محمودن بن اليدالي بن احمد بن احميميد بن المختار بن القاظي بن امحوذيلل بن سيد (المختار) بن عبد الله",mother:"D11w1"},
{id:"D30",para:30,name:"محمودن",g:"M",father:"D29",mother:"D29w1",dates:"1396هـ/1976م –",spouses:["D30w1"]},
{id:"D29d1",name:"زينب",g:"F",father:"D29",mother:"D29w1",dates:"1398هـ/1978م –",note:"أم أبناء ببكر بن محمدن بن ببكر بن اتاه (المختار) بن بيبات بن حمم بن المبارك بن اما (الماقور)؛ رابط بين الأسرتين محتمل",spouses:["F119"]},
{id:"D31",para:31,name:"سيد",g:"M",father:"D29",mother:"D29w1",dates:"1404هـ/1984م –",spouses:["D31w1"]},
{id:"D29d2",name:"فرحه",g:"F",father:"D29",mother:"D29w1",dates:"1407هـ/1987م –"},
{id:"D30w1",name:"افضيل",g:"F",father:"Y1",spouses:["D30"]},
{id:"D30s1",name:"التيجاني",g:"M",father:"D30",mother:"D30w1",note:"لم يعقب"},
{id:"D30d1",name:"لمروه",g:"F",father:"D30",mother:"D30w1"},
{id:"D31w1",name:"مريم",g:"F",father:"XA997",spouses:["D31"],ext:true},
{id:"D31d1",name:"منت مكيو (عائشة)",g:"F",father:"D31",mother:"D31w1"},
{id:"D32w1",name:"سلمه",g:"F",father:"XA1003",spouses:["D32"],ext:true},
{id:"D32d1",name:"تاتا (فاطمة)",g:"F",father:"D32",mother:"D32w1",note:"لم تعقب"},
{id:"D32d2",name:"زينب",g:"F",father:"D32",mother:"D32w1",note:"لم تعقب"},
{id:"D33w1",name:"مريم",g:"F",father:"XA1242",note:"أم ابني حبب بن المختار بن المعزوز بن الأمين عمي",spouses:["D33"],fullName:"مريم بنت ابيهم بن ابا الصالح (يعقوب) بن احمد بن اشفغ اوبك بن مهنض امغر",ext:true},
{id:"D34w1",name:"ديد",g:"F",father:"G58",mother:"G58w1",spouses:["D34"],crossLink:true},
{id:"D34d1",name:"ام المومنين",g:"F",father:"D34",mother:"D34w1",note:"أم بعض أبناء مختير بن امحذ بن العيدي بن المختار باب بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله؛ زواج داخلي بالأسرة",fullName:"ام المومنين بنت عالم بن محمد بن محمذن بن ابييب بن يالليل بن امحوذيلل بن سيد (المختار) بن عبد الله",spouses:["D65"]},
{id:"D34d2",name:"اماته",g:"F",father:"D34",mother:"D34w1",note:"أم أبناء المختار بن الإمام -؟-"},
{id:"D34d3",name:"مريم",g:"F",father:"D34",mother:"D34w1",note:"لم تعقب"},
{id:"D35w1",name:"ميمهنه",g:"F",father:"XA1004",spouses:["D35"],ext:true},
{id:"D35d1",name:"فلانة",g:"F",father:"D35",mother:"D35w1",note:"لم تعقب"},
{id:"D36w1",name:"فلانة",g:"F",father:"D61",mother:"D61w1",spouses:["D36"]},
{id:"D37w1",name:"فلانة",g:"F",father:null,spouses:["D37"]},
{id:"D38w1",name:"فلانة",g:"F",father:"D46",mother:"D46w1",note:"زواج داخلي بالأسرة",spouses:["D38"]},
{id:"D38d1",name:"عائشة",g:"F",father:"D38",mother:"D38w1",note:"أم أبناء عمّيا بن ابراهيم",spouses:["I72"]},
{id:"D38d2",name:"فلانة",g:"F",father:"D38",mother:"D38w1",note:"لم تعقب"},
{id:"D39w1",name:"فلانة",g:"F",father:null,note:"أم مريم تسعد بنت المريد (احمد) بن محدن بن عبد الله بن اشفغ مينحنو",spouses:["D39"]},
{id:"D40w1",name:"ام المومنين",g:"F",father:"D42",note:"زواج داخلي بالأسرة؛ أم محمد فال والزعمو ابني باب الدين بن عبد الله بن ينصر (المختار) بن امحوذيلل بن سيد (المختار) بن عبد الله",spouses:["D40"],fullName:"ام المومنين بنت حمم (محنض) بن ينصر (المختار) بن امحوذيلل بن سيد (المختار) بن عبد الله",mother:"D42w2"},
{id:"D40d1",name:"الزغمه",g:"F",father:"D40",mother:"D40w1",note:"أم احمد بن بتار -اجيجب-"},
{id:"D41w1",name:"فاطمة",g:"F",father:"XA1006",spouses:["D41"],ext:true},
{id:"D42w2",name:"فلانة",g:"F",father:null,spouses:["D42"]},
{id:"D43w1",name:"الزهراء",g:"F",father:"D25",note:"زواج داخلي بالأسرة",spouses:["D43"],fullName:"الزهراء بنت محمذن بن ابييب بن يالليل بن امحوذيلل بن سيد (المختار) بن عبد الله"},
{id:"D43s1",name:"احمد شينان",g:"M",father:"D43",mother:"D43w1",note:"لم يعقب"},
{id:"D44w1",name:"ام الخير",g:"F",father:"J36",note:"أم احمد لمغني واتاه ابني المختار بن سيد محمد",spouses:["D44"],crossLink:true,mother:"J36w1"},
{id:"D44w2",name:"فاطمه فال",g:"F",father:"I100",note:"رابط بين الأسرتين؛ أم بوزه بنت حمم بن محمذن بن حمم (محنض) بن المختار (ينصر) بن احمويلل بن سيد (المختار) بن عبد الله",spouses:["D44"],crossLink:true,mother:"I100w2"},
{id:"D45w1",name:"عائشة",g:"F",father:"D96",note:"زواج داخلي بالأسرة؛ أم بنيت ببكر بن حمم بن محمذن بن حمم (محنض) بن ينصر (المختار) بن امحوذيلل بن سيد (المختار) بن عبد الله",spouses:["D45"],fullName:"عائشة بنت احممد فال بن محنض بن اغلجئذن بن بتاجه بن محمذن بن باب احمد بن سيد (المختار)",mother:"D96w1"},
{id:"D45d1",name:"الخيت",g:"F",father:"D45",mother:"D45w1",note:"لم تعقب"},
{id:"D45d2",name:"فاطمه فال",g:"F",father:"D45",mother:"D45w1",note:"لم تعقب"},
{id:"D46w1",name:"شام",g:"F",father:"T0-kawri",spouses:["D46"],crossLink:true},
{id:"D46d1",name:"تمته",g:"F",father:"D46",mother:"D46w1",note:"أم أبناء باركلل بن بوالماح بن متيلي",spouses:["M5"]},
{id:"D46d2",name:"فلانة",g:"F",father:"D46",mother:"D46w1",note:"أم أبناء محنض اودن بن محمذن بن احمد شلل بن محنض بن ابو موسى بن اوبك بن يندبك بن ابراهيم"},
{id:"D46d3",name:"فلانة",g:"F",father:"D46",mother:"D46w1",note:"أم أبناء ينصر (المختار) بن امحوذيلل بن سيد (المختار) بن عبد الله"},
{id:"D46d4",name:"فلانة",g:"F",father:"D46",mother:"D46w1",note:"أم محمد ومحمذن والسيد والمجتبى ومهند (محنض) أبناء ابو الحسن بن بل بن المختار اكد عثمان"},
{id:"D47w1",name:"فلانة",g:"F",father:"D46s3s3",mother:"Z3d4",note:"زواج داخلي بالأسرة",spouses:["D47"]},
{id:"D47d1",name:"فلانة",g:"F",father:"D47",mother:"D47w1",note:"أم ابني ياوليد بن حبيبنا بن الفالي بن باب احمد"},
{id:"D47d2",name:"فلانة",g:"F",father:"D47",mother:"D47w1",note:"أم احمد بن عبدي بن ايتاب بن احمد بن صباره (المختار) بن باب احمد"},
{id:"D47d3",name:"فلانة",g:"F",father:"D47",mother:"D47w1",note:"أم ام المومنين بنت شاطر"},
{id:"D48w1",name:"فلانة",g:"F",father:null,spouses:["D48"]},
{id:"D48w2",name:"فلانة",g:"F",father:"D47s1",note:"زواج داخلي بالأسرة",spouses:["D48"]},
{id:"D48s0",name:"محمد",g:"M",father:"D48",mother:"D48w2",note:"لم يعقب"},
{id:"D48w3",name:"فلانة",g:"F",father:"M6",spouses:["D48"]},
{id:"D49w1",name:"فلانة",g:"F",father:"D87",mother:"D87w1",note:"زواج داخلي بالأسرة",spouses:["D49"]},
{id:"D50w1",name:"عزه",g:"F",father:"XA1007",spouses:["D50"],ext:true},
{id:"D51w1",name:"مريم",g:"F",father:"D41",note:"زواج داخلي بالأسرة؛ أم فاطمة بنت احمد سالم بن محمذن بن احمد بن حبيب الله بن محمذن بن باب احمد بن سيد (المختار) — لم تعقب",spouses:["D51"],fullName:"مريم بنت محمد فال بن باب الدين بن عبد الله بن ينصر (المختار) بن امحوذيلل بن سيد (المختار) بن عبد الله",mother:"D41w1"},
{id:"D51d1",name:"فاطمة",g:"F",father:"D51",mother:"D51w1",note:"لم تعقب"},
{id:"D52w1",name:"مريم",g:"F",father:"XA1008",spouses:["D52"],ext:true},
{id:"D52d1",name:"فاطمة",g:"F",father:"D52",mother:"D52w1",note:"لم تعقب"},
{id:"D53w1",name:"فلانة -اولاد الناصر-",g:"F",father:null,spouses:["D53"]},
{id:"D54",para:54,name:"الحسن",g:"M",father:"D53",mother:"D53w1",spouses:["D54w1"]},
{id:"D53d1",name:"سلمها",g:"F",father:"D53",mother:"D53w1",note:"أم أبناء بكار بن اصنيب -اولاد الناصر-"},
{id:"D54w1",name:"فلانة",g:"F",father:null,spouses:["D54"]},
{id:"D56w1",name:"فلانة",g:"F",father:null,spouses:["D55"]},
{id:"D56d1",name:"فاطمة",g:"F",father:"D55",mother:"D56w1",note:"لم تعقب"},
{id:"D58w1",name:"ام المومنين",g:"F",father:"D66",dates:"1335هـ/1917م –",place:"ابري حيبلل",note:"زواج داخلي بالأسرة",spouses:["D58"]},
{id:"D59",para:59,name:"ببكر",g:"M",father:"D58",mother:"D58w1",dates:"1361هـ/1942م –",spouses:["D59w1"]},
{id:"D58w2",name:"مريم",g:"F",father:"D66",dates:"1330هـ/1912م – 1411هـ/1991م",place:"ابري حيبلل",note:"زواج داخلي بالأسرة",spouses:["D58"]},
{id:"D58d1",name:"سلمه",g:"F",father:"D58",mother:"D58w2",dates:"1365هـ/1946م –",note:"أم القاضي من أبناء عب (عبد الله) بن مشاد بن عبد بن امام (امام الحرمين) بن عبد الله بن اشفغ مينحنو؛ أم بعض أبناء محمدن بن الكريم بن محمذن بن ابامين (الأمين) بن المختار بن احمد اهنكر بن محمد الكريم"},
{id:"D60",para:60,name:"محمد سالم",g:"M",father:"D58",mother:"D58w2",dates:"1367هـ/1948م –",spouses:["I8d1"]},
{id:"D58d2",name:"توت",g:"F",father:"D58",mother:"D58w2",dates:"1372هـ/1953م –",note:"أم يسلم وولد الحسن ومريم ونفيسو من أبناء القاضي بن سيد الأمين بن محمد بن محمذن ميلود بن حبلل بن عاون",spouses:["K76"]},
{id:"D59w1",name:"توت",g:"F",father:"D54",note:"زواج داخلي بالأسرة؛ أم أبناء ببكر بن آبوه (احمد) بن ببكر بن مختير بن احمد بن ولد حيب الله بن محمذن بن باب احمد بن سيد (المختار)",spouses:["D59"],fullName:"توت بنت الحسن بن احمد (ولد ابّوه) بن المختار السالم بن محمذن بن احمد بن حيب الله بن محمذن بن باب احمد",mother:"D54w1"},
{id:"D59s1",name:"السالك (احمد)",g:"M",father:"D59",mother:"D59w1",dates:"1404هـ/1984م –",note:"لم يعقب"},
{id:"D59d1",name:"اغويه",g:"F",father:"D59",mother:"D59w1",dates:"1407هـ/1987م –"},
{id:"D59d2",name:"اميه",g:"F",father:"D59",mother:"D59w1",dates:"1408هـ/1988م –"},
{id:"D59s2",name:"صدام",g:"M",father:"D59",mother:"D59w1",dates:"1412هـ/1992م –",note:"لم يعقب"},
{id:"D59s3",name:"الحسن",g:"M",father:"D59",mother:"D59w1",dates:"1412هـ/1992م –",note:"لم يعقب"},
{id:"D59s4",name:"يحي",g:"M",father:"D59",mother:"D59w1",dates:"1419هـ/1998م –",note:"لم يعقب"},
{id:"D60s1",name:"احمد",g:"M",father:"D60",mother:"I8d1",dates:"1415هـ/1996م –",note:"لم يعقب"},
{id:"D60d1",name:"رجاء (مريم)",g:"F",father:"D60",mother:"I8d1",dates:"1419هـ/1998م –"},
{id:"D60d2",name:"امّه",g:"F",father:"D60",mother:"I8d1",dates:"1421هـ/2000م –"},
{id:"D60d3",name:"اتفاك",g:"F",father:"D60",mother:"I8d1",dates:"1428هـ/2007م –"},
{id:"D60s2",name:"عبد الرحمن",g:"M",father:"D60",mother:"I8d1",note:"لم يعقب"},
{id:"D61w1",name:"حنه",g:"F",father:"P2",spouses:["D61"],crossLink:true,mother:"P2w1",note:"أم أبناء الدختار با بن محمذن بن باب أحمد بن سيد (الدختار) بن عبدالله"},
{id:"D61d1",name:"النـيسه",g:"F",father:"D61",mother:"D61w1",note:"أم الطاهر بن اللين بن محمذن بن شدك (الأمين) بن يعقوب بن باركلل"},
{id:"D61d3",name:"فلانة",g:"F",father:"D61",mother:"D61w1",note:"أم احمد ميلود بن فاي بن يالليل بن امحوذيلل بن سيد (المختار) بن عبد الله"},
{id:"D62w1",name:"ام الحسن",g:"F",father:"XA1010",spouses:["D62"],ext:true},
{id:"D63w1",name:"مريم السالو",g:"F",father:"XA1012",spouses:["D63"],ext:true},
{id:"D63d1",name:"عيشه",g:"F",father:"D63",mother:"D63w1",note:"أم محمد من أبناء ببكر بن مختير بن احمد بن حيب الله بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله",spouses:["D57"]},
{id:"D63d2",name:"الزغمه",g:"F",father:"D63",mother:"D63w1",note:"أم ابنيو من أبناء محمذن بن خيليد بن محمذن بن الماح بن المختار بن محنض بن الحسن دوبك"},
{id:"D64w1",name:"ام الخيرات",g:"F",father:"D7",mother:"D7w1",note:"زواج داخلي بالأسرة",spouses:["D64"],fullName:"ام الخيرات بنت محمذن بن احميميد بن المختار بن القاظي بن امحوذيلل بن سيد (المختار) بن عبد الله"},
{id:"D64s1",name:"الحسن",g:"M",father:"D64",mother:"D64w1",dates:"…؟… – 1366هـ/1941م",note:"لم يعقب"},
{id:"D64s2",name:"المختار",g:"M",father:"D64",mother:"D64w1",note:"لم يعقب"},
{id:"D64d1",name:"اذخيره",g:"F",father:"D64",mother:"D64w1",note:"أم محمد بن احمد بن ميلود بن شيبة بن الفالي بن عمّيا بن ابراهيم — لم يعقب"},
{id:"D64d2",name:"ام النبي",g:"F",father:"D64",mother:"D64w1",note:"لم تعقب"},
{id:"D64d3",name:"السالمه",g:"F",father:"D64",mother:"D64w1",note:"أم بنات محمد بن محمذن (ولد سيدن) بن امحذ بن ابييب بن يالليل بن امحوذيلل بن سيد (المختار) بن عبد الله"},
{id:"D64d4",name:"خديجة",g:"F",father:"D64",mother:"D64w1",note:"لم تعقب"},
{id:"D65s1",name:"احمد",g:"M",father:"D65",mother:"D34d1",note:"لم يعقب"},
{id:"D65s2",name:"محمدن",g:"M",father:"D65",mother:"D34d1",place:"كيص (سنغال)",note:"لم يعقب"},
{id:"D65d1",name:"امباركه",g:"F",father:"D65",mother:"D34d1",note:"أم احمد وام المومنين من أبناء منين بن التجاني بن الصالح بن حمم بن المختار باب بن محمذن بن باب احمد بن سيد (المختار)",spouses:["D81"]},
{id:"D65d2",name:"العاليه",g:"F",father:"D65",mother:"D34d1",note:"لم تعقب"},
{id:"D65d3",name:"الخيت",g:"F",father:"D65",mother:"D34d1",note:"لم تعقب"},
{id:"D65d4",name:"ذات الخير",g:"F",father:"D65",mother:"D34d1",note:"أم ابوها من أبناء منين بن التجاني بن الصالح بن حمم بن المختار باب بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله",spouses:["D81"]},
{id:"D65d5",name:"فطيمه",g:"F",father:"D65",mother:"D34d1",note:"أم المختار من أبناء ميلود بن محمد فال بن ميلود بن محمذن بن باهنين",spouses:["V24"]},
{id:"D65d6",name:"ديد",g:"F",father:"D65",mother:"D34d1",note:"لم تعقب"},
{id:"D65d7",name:"ام المومنين",g:"F",father:"D65",mother:"Y128d3",note:"أم مريم بنت حامد بن الأمين بن محمد بن حيب الله بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"D66w1",name:"ايه (خدجية)",g:"F",father:"S13",place:"ابري حيبلل",spouses:["D66"],crossLink:true,mother:"S13w1",note:"أم بنيت محمد سالم بن مختير بن احمذ بن العيدي بن المختار باب بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله"},
{id:"D66d1",name:"مريم",g:"F",father:"D66",mother:"D66w1",dates:"1330هـ/1912م – 1411هـ/1991م",place:"ابري حيبلل",note:"أم سلمو ومحمد سالم وتوت من أبناء آبّوه (احمد) بن ببكر بن مختير بن احمد بن حيب الله بن محمذن بن باب احمد بن سيد (المختار)"},
{id:"D66d2",name:"ام المومنين",g:"F",father:"D66",mother:"D66w1",dates:"1335هـ/1917م –",place:"ابري حيبلل",note:"أم ببكر من أبناء آبوه (احمد) بن ببكر بن مختير بن احمد بن حيب الله بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله"},
{id:"D67w1",name:"مريم",g:"F",father:"D15",note:"زواج داخلي بالأسرة؛ أم أبناء محمذن بن العيدي بن المختار باب بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله",spouses:["D67"],fullName:"مريم بنت محمذن ميلود بن المختار بن القاظي بن امحوذيلل بن سيد (المختار) بن عبد الله",mother:"D15w1"},
{id:"D67s1",name:"المختار",g:"M",father:"D67",mother:"D67w1",note:"لم يعقب"},
{id:"D67d2",name:"ام المومنين",g:"F",father:"D67",mother:"D67w1",note:"لم تعقب"},
{id:"D68w1",name:"خديج",g:"F",father:"E57",place:"حبلل",spouses:["D68"],crossLink:true,mother:"E57w1",note:"أم أبناء أحمد بن محمذن بن العيدي بن المختار باب بن محمذن بن باب أحمد بن سيد (المختار) بن عبد الله"},
{id:"D69w1",name:"عائشة",g:"F",father:"R56",dates:"…؟… – 1404هـ/1984م",place:"ابري حيبلل",spouses:["D69"]},
{id:"D69d1",name:"خديجة",g:"F",father:"D69",mother:"D69w1",dates:"1353هـ/1935م – 1431هـ/2010م",place:"ابري حيبلل",note:"أم احبيب من أبناء احمد بن محمد بن اتاه (المختار) بن بيبات بن حمم بن المبارك بن اما (الماقور)",spouses:["F111"]},
{id:"D69d2",name:"آمنة",g:"F",father:"D69",mother:"D69w1",dates:"1356هـ/1937م – 1428هـ/2007م",place:"ابري حيبلل",note:"أم اميني بن اتاه بن سيد بن محمذن بن المانه بن الما بن المصطفى بن بل بن المختار اكد عثمان"},
{id:"D70w1",name:"ابـيه (خدجية)",g:"F",father:"E58",place:"ابري حيبلل",spouses:["D70"],fullName:"ابـيه (خدجية) بنت الجد بن احممد فال بن حبب بن المختار بن الفالي بن الأمين عمي"},
{id:"D70s1",name:"احمد سالم",g:"M",father:"D70",mother:"D70w1",dates:"1361هـ/1942م – 1436هـ/2015م",place:"ابري حيبلل",note:"لم يعقب"},
{id:"D70d1",name:"فاطمة",g:"F",father:"D70",mother:"D70w1",dates:"1365هـ/1946م –"},
{id:"D71",para:71,name:"محمذن",g:"M",father:"D70",mother:"D70w1",dates:"1367هـ/1948م –",spouses:["D71w1","D71w2"]},
{id:"D70s2",name:"اباه",g:"M",father:"D70",mother:"D70w1",dates:"1372هـ/1953م –",note:"لم يعقب"},
{id:"D71w1",name:"حله -ماسنو-",g:"F",father:null,spouses:["D71"]},
{id:"D71d1",name:"السالمه",g:"F",father:"D71",mother:"D71w1",dates:"1393هـ/1973م –"},
{id:"D71s1",name:"محم",g:"M",father:"D71",mother:"D71w1",dates:"1395هـ/1975م –",note:"لم يعقب"},
{id:"D71w2",name:"مريم",g:"F",father:"Y169",dates:"1367هـ/1948م –",note:"أم محمدن واحمد وعبد الله أبناء اوفا (محمد فال) بن محمد بن محمد بن زيدن بن يعقوب بن احمد ميلود بن شدار بن اشفغ الأمين؛ أم صغار أبناء اوفا (محمد فال) بن محمد بن محمد بن زيدن بن يعقوب بن احمد ميلود بن شدَّار؛ أم صغار أبناء محمذن بن محم بن احمد بن محمذن بن العيدي بن المختار باب بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله؛ زواج داخلي بالأسرة",spouses:["D71","Y160"],crossLink:true,mother:"Y169w1"},
{id:"D72",para:72,name:"النح (محمد عبد الرحمن)",g:"M",father:"D71",mother:"D71w2",dates:"1399هـ/1979م –",spouses:["D12d1"]},
{id:"D73",para:73,name:"پاپ (محمد المختار)",g:"M",father:"D71",mother:"D71w2",dates:"1402هـ/1982م –",spouses:["D73w1"]},
{id:"D71d2",name:"لبابه",g:"F",father:"D71",mother:"D71w2",dates:"1405هـ/1985م –"},
{id:"D71d3",name:"عائشة",g:"F",father:"D71",mother:"D71w2",dates:"1412هـ/1992م –"},
{id:"D72d1",name:"لعريبه",g:"F",father:"D72",mother:"D12d1"},
{id:"D73w1",name:"موله",g:"F",father:"D83",note:"زواج داخلي بالأسرة؛ أم فلان بن پاپ (محمد المختار) بن محمذن بن حمم بن احمد بن محمذن بن العيدي المختار باب بن محمذن بن باب احمد بن سيد",spouses:["D73"],mother:"D83w1"},
{id:"D73d1",name:"السالمه",g:"F",father:"D73",mother:"D73w1",dates:"1393هـ/1973م –"},
{id:"D74w1",name:"خدجية",g:"F",father:"D28",mother:"D28w1",dates:"1353هـ/1935م – 1429هـ/2008م",place:"اهل سيدن",spouses:["D74"]},
{id:"D74s1",name:"محمد فال",g:"M",father:"D74",mother:"D74w1",dates:"1378هـ/1959م –"},
{id:"D74s2",name:"محمد",g:"M",father:"D74",mother:"D74w1",dates:"1381هـ/1962م – 1393هـ/1973م",place:"اهل سيدن",note:"مات صغيرا"},
{id:"D75",para:75,name:"الجد",g:"M",father:"D74",mother:"D74w1",dates:"1388هـ/1968م –",spouses:["D75w1"]},
{id:"D75w1",name:"يغنيه",g:"F",father:"XA503",spouses:["D75"],ext:true},
{id:"D75d1",name:"مريم",g:"F",father:"D75",mother:"D75w1",dates:"1425هـ/2004م –"},
{id:"D75s1",name:"ختار",g:"M",father:"D75",mother:"D75w1",dates:"1426هـ/2005م –",note:"لم يعقب"},
{id:"D75s2",name:"احمد",g:"M",father:"D75",mother:"D75w1",dates:"1426هـ/2005م –",note:"لم يعقب"},
{id:"D76w1",name:"امنه",g:"F",father:"I93",mother:"I93w1",note:"رابط بين الأسرتين",spouses:["D76"],crossLink:true},
{id:"D77w1",name:"ام المومنين",g:"F",father:"D62",note:"زواج داخلي بالأسرة؛ أم التجاني ونبغوه ابني الصالح بن حمم بن المختار باب بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله",spouses:["D77"],mother:"D62w1"},
{id:"D77d1",name:"نبغوه",g:"F",father:"D77",mother:"D77w1",note:"أم أبناء المختار بن امحذ بن ابييب بن يالليل بن امحوذيلل بن سيد (المختار) بن عبد الله؛ زواج داخلي بالأسرة",spouses:["D19"]},
{id:"D78w1",name:"ام الحسن",g:"F",father:"XA1406",spouses:["D78"],ext:true},
{id:"D78s1",name:"احمد يحظيه",g:"M",father:"D78",mother:"D78w1",note:"لم يعقب"},
{id:"D78d1",name:"خدجاني",g:"F",father:"D78",mother:"D78w1",note:"لم تعقب"},
{id:"D79w1",name:"امباركه",g:"F",father:"D96",note:"زواج داخلي بالأسرة؛ أم فاطمة بنت حمم بن التجاني بن الصالح بن حمم بن المختار باب بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله",spouses:["D79"],mother:"D96w2"},
{id:"D79d1",name:"فاطمة",g:"F",father:"D79",mother:"D79w1",note:"لم تعقب"},
{id:"D80w1",name:"خدجية",g:"F",father:"D57",note:"زواج داخلي بالأسرة؛ أم فلانة بنت ببكر -ادابلحسن-",spouses:["D80"],fullName:"خدجية بنت ببكر بن مختير بن احمد بن حيب الله بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله"},
{id:"D80d1",name:"الخيت",g:"F",father:"D80",mother:"D80w1",place:"محجوبو",note:"أم خدجية من أبناء اليدالي بن احمد بن احميميد بن المختار بن القاظي بن امحوذيلل بن سيد (المختار)؛ أم أبناء محمدن بن المبارك بن اياي (احمد) بن دياه (سيد الفالي) بن محمذن بن الفالي بن المبارك بن اما (الماقور)؛ زواج داخلي محتمل بالأسرة؛ أم أبناء محمدن بن المبارك بن اياي (احمد) لد دياه (سيد الفالي) بن محمذن بن الفالي بن المبارك بن اما (الماقور)",spouses:["F58","D10"]},
{id:"D81w1",name:"امباركه",g:"F",father:"D65",note:"زواج داخلي بالأسرة",spouses:["D81"],fullName:"امباركه بنت مختير بن امحذ بن العيدي بن حمم بن المختار باب بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله"},
{id:"D82",para:82,name:"احمد",g:"M",father:"D81",mother:"D81w1",spouses:["D82w1"]},
{id:"D81d1",name:"ام المومنين",g:"F",father:"D81",mother:"D81w1",note:"لم تعقب"},
{id:"D81w2",name:"ذات الخير",g:"F",father:"D65",note:"زواج داخلي بالأسرة",spouses:["D81"]},
{id:"D81d2",name:"ابّوها",g:"F",father:"D81",mother:"D81w2",place:"ابري حيبلل",note:"أم أبناء محمودن بن اليدالي بن احمد بن احميميد بن المختار بن القاظي بن امحوذيلل بن سيد (المختار)؛ أم عائشة بنت السيد بن من (محمذين) بن سيد بن محمد بن الأمين بن حمم بن ابو الحس بن المزضف",spouses:["D11"]},
{id:"D82w1",name:"عيشة",g:"F",father:"D97",dates:"1926م – 1431هـ/2010م",place:"اركيز",note:"أم محمد فال بن امين -اداشفاغو- ومن وخدجية والحسن ومريم ومحمدن أبناء السيد بن من بن سيد بن محمد بن الأمين بن حمم بن ابواحلس بن المزضف",spouses:["D82"]},
{id:"D83",para:83,name:"احمّد",g:"M",father:"D82",mother:"D82w1",dates:"1372هـ/1953م –",spouses:["D83w1"]},
{id:"D83w1",name:"ساريه",g:"F",father:"XA1013",spouses:["D83"],ext:true},
{id:"D84",para:84,name:"بد",g:"M",father:"D83",mother:"D83w1",spouses:["D84w1"]},
{id:"D83d2",name:"بات",g:"F",father:"D83",mother:"D83w1",note:"أم محمدي بن يعقوب بن محمدي بن محمد بن امم (محمذن) بن اگي (الكوري) بن ايبا (احمذ) بن محمذن بن الأمين بن الفالي بن متيلي"},
{id:"D84w1",name:"منايه",g:"F",father:"D12",note:"زواج داخلي بالأسرة؛ أم الأمين بن بد بن احمد بن احمد بن منين بن التجاني بن الصالح بن حمم بن المختار باب بن محمذن بن باب احمد بن سيد (المختار)",spouses:["D84"],fullName:"منايه بنت الأمين بن محمودن بن اليدالي بن احمد بن احميميد بن المختار بن القاظي بن امحوذيلل بن سيد (المختار)",mother:"D12w1"},
{id:"D84s1",name:"الأمين",g:"M",father:"D84",mother:"D84w1",note:"لم يعقب"},
{id:"D85w1",name:"ابنيه",g:"F",father:"XA1407",note:"أم سيد وفطيم ابني احمد بن سيد الفالي بن بنيوك (محمذن) بن المختار بن محمد الكريم",spouses:["D85"],ext:true},
{id:"D85w2",name:"فلانة",g:"F",father:"R42",mother:"R42w1",spouses:["D85"],crossLink:true},
{id:"D86w1",name:"فلانة",g:"F",father:"Z3",spouses:["D86"],crossLink:true},
{id:"D86d1",name:"آبيه",g:"F",father:"D86",mother:"D86w1",note:"أم أبناء الأمين بن احمد بن صباره (المختار) بن باب احمد"},
{id:"D87w1",name:"فلانة",g:"F",father:null,spouses:["D87"]},
{id:"D87d1",name:"فلانة",g:"F",father:"D87",mother:"D87w1",note:"أم مالّل (محمد) بن حيب الله بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله"},
{id:"D87d2",name:"فلانة",g:"F",father:"D87",mother:"D87w1",note:"لم تعقب"},
{id:"D88w1",name:"فاطمة",g:"F",father:"D4",note:"زواج داخلي بالأسرة؛ أم مريم بنت حبلل بن ببكر بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله",spouses:["D88"],fullName:"فاطمة بنت القاظي بن امحوذيلل بن سيد (المختار) بن عبد الله",mother:"D4w1"},
{id:"D88d1",name:"مريم",g:"F",father:"D88",mother:"D88w1",note:"أم المختار بن علي بن محي الدين -لهميتات-"},
{id:"D89w1",name:"فلانة",g:"F",father:"M6",spouses:["D89"]},
{id:"D89s1",name:"محمد فال",g:"M",father:"D89",mother:"D89w1",note:"لم يعقب"},
{id:"D90w1",name:"اكحيله",g:"F",father:"N1",spouses:["D90"],crossLink:true,fullName:"اكحيله بنت محمذن بن عبد الله -لهميتات-",ext:true},
{id:"D90s1",name:"الأديب",g:"M",father:"D90",mother:"D90w1",note:"لم يعقب"},
{id:"D90d1",name:"فاطمه فال",g:"F",father:"D90",mother:"D90w1",note:"أم ابني محمد الأمين بن الخراشي -اولاد بزيد-"},
{id:"D91w1",name:"آمنة",g:"F",father:"XA1014",spouses:["D91"],ext:true},
{id:"D91d1",name:"فاطمة",g:"F",father:"D91",mother:"D91w1",note:"أم محمد بن بد بن محمد الأمين بن احمد بوراص -اولاد بو سيدي-"},
{id:"D91w2",name:"مريم",g:"F",father:"XA1015",spouses:["D91"],ext:true},
{id:"D92w1",name:"زليخه",g:"F",father:"XA1018",spouses:["D92"],ext:true},
{id:"D92s1",name:"امام",g:"M",father:"D92",mother:"D92w1",note:"لم يعقب"},
{id:"D92s2",name:"محمد",g:"M",father:"D92",mother:"D92w1",note:"لم يعقب"},
{id:"D92s3",name:"محمذن",g:"M",father:"D92",mother:"D92w1",note:"لم يعقب"},
{id:"D92d1",name:"آمنة",g:"F",father:"D92",mother:"D92w1",note:"لم تعقب"},
{id:"D92d2",name:"فاطمة",g:"F",father:"D92",mother:"D92w1",note:"لم تعقب"},
{id:"D93w1",name:"مريم",g:"F",father:"XA1021",spouses:["D93"],ext:true},
{id:"D93d1",name:"امينه",g:"F",father:"D93",mother:"D93w1",note:"أم أبناء محمد احمد بن محمودن -تندغو-"},
{id:"D93d2",name:"خديجة",g:"F",father:"D93",mother:"D93w1",note:"أم أبناء احمذ بن احممد فال بن محنض بن اغلجئذن بن بتاجه بن محمذن بن سيد (المختار) بن عبد الله",spouses:["D97"]},
{id:"D93d3",name:"فاله",g:"F",father:"D93",mother:"D93w1",note:"أم ابني محمد السالك بن السنوسي -؟-"},
{id:"D93d4",name:"فاطمة",g:"F",father:"D93",mother:"D93w1",note:"لم تعقب"},
{id:"D94w1",name:"ام الخيرات",g:"F",father:"XA1410",spouses:["D94"],ext:true},
{id:"D94s1",name:"يحي",g:"M",father:"D94",mother:"D94w1",note:"لم يعقب"},
{id:"D94d1",name:"مريم",g:"F",father:"D94",mother:"D94w1",note:"لم تعقب"},
{id:"D94d2",name:"اخديجات",g:"F",father:"D94",mother:"D94w1",note:"لم تعقب"},
{id:"D95w1",name:"امينه",g:"F",father:"D85",note:"زواج داخلي بالأسرة؛ أم ام الخير من أبناء محنض بن اغلجئذن بن بتاجه بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله",spouses:["D95"],mother:"D85w1"},
{id:"D95d1",name:"ام الخير",g:"F",father:"D95",mother:"D95w1",note:"لم تعقب"},
{id:"D96w1",name:"ام راص",g:"F",father:"D26",note:"زواج داخلي بالأسرة؛ أم محمد وامحذ وعائشة أبناء احممد فال بن محنض بن اغلجئذن بن بتاجه بن محمذن بن سيد (المختار) بن عبد الله",spouses:["D96"],fullName:"ام راص بنت الأمين بن محمذن بن ابييب بن يالليل بن امحوذيلل بن سيد (المختار) بن عبد الله",mother:"D26w1"},
{id:"D96w2",name:"سلمه",g:"F",father:"D8",note:"زواج داخلي بالأسرة",spouses:["D96"],fullName:"سلمه بنت احمد بن احميميد بن المختار بن القاظي بن امحوذيلل بن سيد (المختار) بن عبد الله"},
{id:"D96d3",name:"فاطمة",g:"F",father:"D96",mother:"D96w2",note:"أم آبوه (احمد) من أبناء ببكر بن مختير بن احمد بن حبيب الله بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله",spouses:["D57"]},
{id:"D97w1",name:"خدجية",g:"F",father:"D93",note:"زواج داخلي بالأسرة",spouses:["D97"],fullName:"خدجية بنت امحذ بن محمد فال بن اغلجئذن بن بتاجه بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله"},
{id:"D97d1",name:"فاطمة",g:"F",father:"D97",mother:"D97w1",dates:"1338هـ/1920م –",note:"أم أبناء سيد احمد بن امحيد -تجكانت-",spouses:["XA984"]},
{id:"D97d2",name:"عائشة",g:"F",father:"D97",mother:"D97w1",dates:"1334هـ/1926م – 1431هـ/2010م",place:"اركيز",note:"أم محمذن فال بن امين -اداشفاغو-؛ أم احمد بن احمد بن منين بن التجاني بن الصالح؛ أم من والحسن وخدجية ومريم ومحمدن من أبناء السيد بن من (محمذين) بن سيد بن محمد بن الأمين بن حمم بن ابو الحس",spouses:["Z123"]},
{id:"D98w1",name:"اخدجيه",g:"F",father:"S4",mother:"S14d1",dates:"…؟… – 1436هـ/2015م",place:"اركيز",note:"رابط بين الأسرتين (سيد محمد)",spouses:["D98"],crossLink:true,fullName:"اخدجيه بنت اديو (الشيخ) بن بب (احمد سالم) بن الشيخ بن سيد محمد"},
{id:"D98s1",name:"احمد",g:"M",father:"D98",mother:"D98w1",note:"لم يعقب"},
{id:"D98s2",name:"امين",g:"M",father:"D98",mother:"D98w1",note:"لم يعقب"},
{id:"D98s3",name:"احمد سالم",g:"M",father:"D98",mother:"D98w1",note:"لم يعقب"},
{id:"D98d1",name:"فاطمة السالمه",g:"F",father:"D98",mother:"D98w1"},
{id:"D98d2",name:"خديجة",g:"F",father:"D98",mother:"D9d2",note:"أم اميي وسكينة ابني حيظيو بن سيد احمد بن امحيد -تجكانت-"},
{id:"D99w1",name:"مريم",g:"F",father:"XA1022",spouses:["D99"],ext:true},
{id:"D99s1",name:"فلان",g:"M",father:"D99",mother:"D99w1",note:"لم يعقب"},
{id:"D99s2",name:"فلان",g:"M",father:"D99",mother:"D99w1",note:"لم يعقب"},
{id:"D99s3",name:"فلان",g:"M",father:"D99",mother:"D99w1",note:"لم يعقب"},
{id:"D99s4",name:"فلان",g:"M",father:"D99",mother:"D99w1",note:"لم يعقب"},
{id:"D100s1",name:"احمد",g:"M",father:"D100",mother:"D11d1",dates:"1399هـ/1979م –",note:"لم يعقب"},
{id:"Y1w1",name:"ملونه (مريم سخنه)",g:"F",father:"XA1023",place:"باجليالي",spouses:["Y1"],ext:true},
{id:"Y1d2",name:"تنغوس",g:"F",father:"Y1",mother:"Y1w1",note:"أم مريم بنت عاشور بن الفالي بن باب احمد؛ أم ابني حامدت بن اشفغ المختار بن اشفغ ايتشمذن بن يعقوب بن اشفغ يدهننض"},
{id:"Y1d4",name:"عاشا",g:"F",father:"Y1",mother:"Y1w1",note:"أم بنيت الإمام ناصر الدين (اوبك) بن اشفغ اهبنض بن ابوبكر بن يعقوب بن اشفغ اهبنض حيي؛ أم أبناء المختار بن محمذن بن باب احمد",spouses:["D61"]},
{id:"Y1d5",name:"فلانة",g:"F",father:"Y1",mother:"Y1w1",note:"أم احدى بنات محمذن بن باب احمد بن يقبنلل"},
{id:"Y1d6",name:"يامين",g:"F",father:"Y1",mother:"Y1w1",note:"أم الأمين عمي ومحمد الكريم وأمّا (الماقور) وجاكوكئذن من أبناء الفالي بن الكوري",spouses:["T0-fali"]},
{id:"Y1w2",name:"فاطمه",g:"F",father:"XA1025",spouses:["Y1"],ext:true},
{id:"Y1d7",name:"أمّايه (مريم لجدل)",g:"F",father:"Y1",mother:"Y1w2",dates:"1096هـ/1685م –",place:"اكالل فاي",note:"أم أبناء عبد الله بن احمد بن الفالي بن امرابط مكو"},
{id:"Y2w1",name:"اعشذا",g:"F",father:"T0-kawri",spouses:["Y2"],crossLink:true},
{id:"Y2d1",name:"فلانة",g:"F",father:"Y2",mother:"Y2w1",note:"أم بنات الأمين بن الفالي بن باب احمد"},
{id:"Y3w1",name:"مريم",g:"F",father:"XA581",spouses:["Y3"],ext:true},
{id:"Y3d1",name:"خدّج (امباركه)",g:"F",father:"Y3",mother:"Y3w1",note:"أم أبناء المصطفى بن خالونا بن الفالي بن المختار اكد عثمان؛ أم اعديج من أبناء احمد بن محمذن بن بل (عبد الله) بن المختار اكد عثمان — لم يعقب؛ أم ابني محنض بن بل (عبد الله) بن المختار اكد عثمان — لم يعقبا"},
{id:"Y3w2",name:"مومين",g:"F",father:null,spouses:["Y3"]},
{id:"Y3d2",name:"ازباره",g:"F",father:"Y3",mother:"Y3w2",note:"بنت زمنار بن احمد شينان بن بوشنكور (الماح) بن محنض بن يدن يعقوب"},
{id:"Y4w1",name:"جاكوكئذن",g:"F",father:"XA1416",spouses:["Y4"],ext:true},
{id:"Y4d2",name:"ميمهنه",g:"F",father:"Y4",mother:"Y4w1",note:"أم أبناء متيلي بن احمد بن الحسن دوبك",spouses:["XA1321"]},
{id:"Y4d3",name:"فلانة",g:"F",father:"Y4",mother:"Y4w1",note:"أم احميدنّا (محمذن) من أبناء الأمين بن مودي مالك",spouses:["G99"]},
{id:"Y4d4",name:"فلانة",g:"F",father:"Y4",mother:"Y4w1",note:"أم حنو بنت الهم بن الماح بن الحسن دوبك"},
{id:"Y4d5",name:"فلانة",g:"F",father:"Y4",mother:"Y4w1",note:"لم تعقب"},
{id:"Y4w2",name:"فلانة",g:"F",father:"XA1029",spouses:["Y4"],ext:true},
{id:"Y4d6",name:"فلانة",g:"F",father:"Y4",mother:"Y4w2",note:"أم أبناء اخيارهم بن احمد بن صباره (المختار) بن باب احمد"},
{id:"Y4d7",name:"فلانة",g:"F",father:"Y4",mother:"Y4w2",note:"أم فلانة من أبناء المصطفى بن اشفغ مينحنو — لم تعقب",spouses:["G55"]},
{id:"Y5w1",name:"ميمهنه الهالليو",g:"F",father:"XA495",spouses:["Y5"],ext:true},
{id:"Y6d1",name:"مانهنه",g:"F",father:"Y6",mother:"Y125d1",note:"أم أبناء محمد بن محمذن بن محنض بن اشفغ الماح بن المختار بن حيي بن يدن يعقوب"},
{id:"Y6s1",name:"محمد",g:"M",father:"Y6",mother:"Y125d1",note:"لم يعقب"},
{id:"Y7w1",name:"الجده",g:"F",father:"W1",mother:"W1w1",note:"أم يامين (مريم) بنت المختار صمب بن احميدنّا (محمذن) بن الأمين بن مودي مالك",spouses:["Y7"],crossLink:true,fullName:"الجده بنت محمد بن حبلل اسليطين"},
{id:"Y7d1",name:"الصغرى",g:"F",father:"Y7",mother:"Y7w1",note:"أم بنيت محمذن بن المختار بن آبَّـنِّـي (محنض بونا)"},
{id:"Y8w1",name:"يات",g:"F",father:"XA1035",note:"أم سيد الفالي والمختار — أم ابني الأمين بن صالحي بن محمذن بن آبـَّ ِّين",spouses:["Y8"],ext:true},
{id:"Y8w2",name:"فلانة",g:"F",father:null,spouses:["Y8"]},
{id:"Y8d1",name:"فلانة",g:"F",father:"Y8",mother:"Y8w2",note:"أم ابن عمر بن محمذن فال بن عبد الله بن شدَّار بن اشفغ الأمين"},
{id:"Y9w1",name:"امبريكه",g:"F",father:"Y150",note:"زواج داخلي بالأسرة؛ أم مولود بن سيد الفالي بن محمذن بن ايتاب بن حبلل بن اشفغ الأمين — لم يعقب",spouses:["Y9"],mother:"Y150w1"},
{id:"Y9s1",name:"مولود",g:"M",father:"Y9",mother:"Y9w1",note:"لم يعقب"},
{id:"Y10w1",name:"امهينه",g:"F",father:"V10",spouses:["Y10"],crossLink:true,mother:"L23d1",note:"أم فاطمة بنت مولود بن ايتاب بن حبلل بن اشفغ الأمين"},
{id:"Y10d1",name:"فاطمة",g:"F",father:"Y10",mother:"Y10w1",note:"لم تعقب"},
{id:"Y11w1",name:"النَّـمه",g:"F",father:"XA1347",spouses:["Y11"],ext:true},
{id:"Y11d1",name:"مريم",g:"F",father:"Y11",mother:"Y11w1",note:"أم محمذن من أبناء الأمين بن اشفغ مينحنو",spouses:["G56"]},
{id:"Y11w2",name:"حنه",g:"F",father:"XA816",spouses:["Y11"]},
{id:"Y12w1",name:"تنحابوس",g:"F",father:"Y118",note:"زواج داخلي بالأسرة؛ أم احمد وابن من أبناء اللديب بن المعزوز بن اشفغ الأمين",spouses:["Y12"],mother:"Y118w1"},
{id:"Y12s1",name:"ببكر",g:"M",father:"Y12",mother:"Y118d5",note:"لم يعقب"},
{id:"Y12w3",name:"مومنيت -اهل محنضنلل-",g:"F",father:null,spouses:["Y12"]},
{id:"Y12d1",name:"مريم",g:"F",father:"Y12",mother:"Y12w3",note:"أم محمذن بن الكوري بن حرمه بن المختار بن المعزوز بن اشفغ الأمين؛ أم سيد احمد من أبناء حيب الله بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",spouses:["Y57","Y111"]},
{id:"Y14w1",name:"الجده",g:"F",father:"Y149",note:"زواج داخلي بالأسرة؛ أم أبناء احمد بن اللديب بن المعزوز بن اشفغ الأمين",spouses:["Y14"],mother:"Y149w1"},
{id:"Y14d2",name:"غاديجه",g:"F",father:"Y14",mother:"Y14w1",note:"أم أبناء سيد بن المبارك بن باب الدين بن اشفغ الأمين",spouses:["Y138"]},
{id:"Y15w1",name:"طفيله",g:"F",father:"Y154",mother:"Y121w1",note:"زواج داخلي بالأسرة؛ أم احمد بن الأمين بن احمد بن محمد العاقل",spouses:["Y15"]},
{id:"Y16d2",name:"يمه",g:"F",father:"Y16",mother:"Y16w1",note:"لم تعقب"},
{id:"Y17w1",name:"امخته",g:"F",father:"K81",dates:"1322هـ/1904م – 1402هـ/1982م",place:"ابري حيبلل",spouses:["Y17"],crossLink:true},
{id:"Y17s1",name:"احمد",g:"M",father:"Y17",mother:"Y17w1",note:"لم يعقب"},
{id:"Y17d1",name:"مريم",g:"F",father:"Y17",mother:"Y17w1",note:"لم تعقب"},
{id:"Y18w1",name:"اميم (مريم)",g:"F",father:"Z80",mother:"Z80w1",dates:"1361هـ/1942م –",spouses:["Y18"],crossLink:true,fullName:"اميم (مريم) بنت الأمين بن احمد بن ابن عبدم بن عبد الله بن الأمين بن حمم بن ابو الحس بن المزضف"},
{id:"Y18s1",name:"ينجح",g:"M",father:"Y18",mother:"Y18w1",dates:"1381هـ/1962م – 1382هـ/1963م",note:"مات صغيرا"},
{id:"Y18d1",name:"العاليه",g:"F",father:"Y18",mother:"Y18w1",dates:"1384هـ/1964م –"},
{id:"Y19w1",name:"فلانة -اليابان-",g:"F",father:null,spouses:["Y19"]},
{id:"Y19d1",name:"مريم",g:"F",father:"Y19",mother:"Y19w1",dates:"1424هـ/2003م –"},
{id:"Y19w2",name:"تـيَّه (ففَّو)",g:"F",father:"P20",mother:"P9d1",dates:"1395هـ/1975م –",spouses:["Y19"],fullName:"تـيَّه (ففَّو) بنت محمد المختار بن هيدي (سيدي) بن ابو (محمد) بن أمّن (محمذن) بن محمد بن محمذن بن محم"},
{id:"Y19s1",name:"سيد محمد",g:"M",father:"Y19",mother:"Y19w2",dates:"1436هـ/2015م –",note:"لم يعقب"},
{id:"Y20w1",name:"امنيانه",g:"F",father:"XA339",spouses:["Y20"],ext:true},
{id:"Y20d1",name:"ام الخيري",g:"F",father:"Y20",mother:"Y20w1",note:"لم تعقب"},
{id:"Y20d2",name:"أمه (ميمونه)",g:"F",father:"Y20",mother:"Y20w1",note:"أم أبناء اكاه (ببكر) بن محمذن بن احجاب بن محمد الكريم",spouses:["K4"]},
{id:"Y21d2",name:"آمنة",g:"F",father:"Y21",mother:"Y121d3",note:"لم تعقب"},
{id:"Y22w1",name:"فاطمه",g:"F",father:"L1",note:"أم بنيت محمد بن اشفغ المختار بن اشفغ ايتشمذن (احمد) بن يعقوب بن يضهنض",spouses:["Y22"],crossLink:true},
{id:"Y31w3",name:"إمات",g:"F",father:"F79",spouses:["Y31"]},
{id:"Y34w1",name:"امباركه",g:"F",father:"Y83",place:"تينشيكل",note:"زواج داخلي بالأسرة؛ أم أبناء سيد بن بكاك (ببكر) بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",spouses:["Y34"],mother:"Y83w5"},
{id:"Y34s1",name:"ببكر",g:"M",father:"Y34",mother:"Y34w1",note:"لم يعقب"},
{id:"Y34d1",name:"مريم",g:"F",father:"Y34",mother:"Y34w1",note:"أم اللَّو (العاليو) وفاطمة من بنات ببكر بن احمد بن محمذن بن حبلل بن المزضف بن شدَّار بن اشفغ الأمين — لم تعقبا؛ أم هيتو (الخيت) بنت المختار بن محمد بن بكاك (ببكر) بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز؛ زواج داخلي بالأسرة؛ زواج داخلي بالأسرة؛ أم هيتو (الخيت) بنت المختار بن محمد بن بكاك بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز",spouses:["Y36","Y189"]},
{id:"Y35w1",name:"الخيت",g:"F",father:"D67",place:"ابري حيبلل",spouses:["Y35"],crossLink:true,mother:"D67w1",note:"أم أبناء محمد بن بكاك بن الجمد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"Y35s1",name:"احمد",g:"M",father:"Y35",mother:"Y35w1",dates:"1291هـ/1874م –",note:"لم يعقب"},
{id:"Y35s2",name:"عبد الله",g:"M",father:"Y35",mother:"Y35w1",dates:"1306هـ/1889م – 1338هـ/1920م",note:"لم يعقب"},
{id:"Y37s1",name:"المختار",g:"M",father:"Y37",mother:"Y47d2",note:"لم يعقب"},
{id:"Y38w1",name:"مـيَّم (مريم)",g:"F",father:"Y71",mother:"Y71w1",dates:"…؟… – 1375هـ/1956م",place:"ابري حيبلل",note:"زواج داخلي بالأسرة",spouses:["Y38"]},
{id:"Y40w1",name:"السالمه",g:"F",father:"I41",dates:"1388هـ/1968م –",note:"زواج داخلي بالأسرة؛ أم أبناء محمد المختار بن الهادي بن محمذن بن محمد بن بكاك بن الجمد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",spouses:["Y40"],crossLink:true,fullName:"السالمه بنت المختار بن اميو (محمذن) بن سيد احممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم",mother:"I44d1"},
{id:"Y40d1",name:"عيشه",g:"F",father:"Y40",mother:"Y40w1",dates:"1418هـ/1997م –"},
{id:"Y40s1",name:"بببح (الهادي)",g:"M",father:"Y40",mother:"Y40w1",dates:"1421هـ/2000م –",note:"لم يعقب"},
{id:"Y40s2",name:"محمدن",g:"M",father:"Y40",mother:"Y40w1",dates:"1425هـ/2004م –",note:"لم يعقب"},
{id:"Y40s3",name:"محمودن",g:"M",father:"Y40",mother:"Y40w1",dates:"1429هـ/2008م –",note:"لم يعقب"},
{id:"Y41w1",name:"فاطمة",g:"F",father:"XA1036",spouses:["Y41"],ext:true},
{id:"Y41s1",name:"محمد فال",g:"M",father:"Y41",mother:"Y41w1",dates:"1436هـ/2014م –",note:"لم يعقب"},
{id:"Y42w1",name:"آمنة",g:"F",father:"Y66",dates:"1400هـ/1980م –",note:"زواج داخلي بالأسرة؛ أم أبناء محمذن بن الهادي بن محمذن بن محمد بن بكاك (ببكر) بن الجمد (أحمد) بن حرمه بن المختار المعزوز",spouses:["Y42"],mother:"Y66w1"},
{id:"Y42s1",name:"سيدنا (محمد فال)",g:"M",father:"Y42",mother:"Y42w1",dates:"1426هـ/2005م –",note:"لم يعقب"},
{id:"Y42d1",name:"الخيت",g:"F",father:"Y42",mother:"Y42w1",dates:"1429هـ/2008م –"},
{id:"Y43d1",name:"بدريه (مريم)",g:"F",father:"Y43",mother:"Y104d3",dates:"1427هـ/2006م –"},
{id:"Y43s1",name:"محمد فال",g:"M",father:"Y43",mother:"Y104d3",dates:"1428هـ/2007م –",note:"لم يعقب"},
{id:"Y43s2",name:"الهادي",g:"M",father:"Y43",mother:"Y104d3",dates:"1432هـ/2011م –",note:"لم يعقب"},
{id:"Y43s3",name:"حيدر",g:"M",father:"Y43",mother:"Y104d3",note:"لم يعقب"},
{id:"Y44w1",name:"أم الخيري",g:"F",father:"G13",spouses:["Y44"],crossLink:true,mother:"G13w3"},
{id:"Y44s1",name:"احمد باب",g:"M",father:"Y44",mother:"Y44w1",dates:"1433هـ/2012م –",note:"لم يعقب"},
{id:"Y44s2",name:"سيدي",g:"M",father:"Y44",mother:"Y44w1",dates:"1435هـ/2014م –",note:"لم يعقب"},
{id:"Y45w1",name:"الدَّدوه (فاطمة)",g:"F",father:"M50",dates:"…؟… – 1391هـ/1971م",place:"ابري حيبلل",spouses:["Y45"],crossLink:true,fullName:"الدَّدوه (فاطمة) بنت محمذن بن ايْـبَّا (احمذ) بن محمذن بن الأمين بن الفالي بن متيلي",mother:"M50w1",note:"أم حمني بن الصالح بن محمد بن بكاك بن الجمد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"Y46d1",name:"منت الخير",g:"F",father:"Y46",mother:"Y46w1",dates:"1381هـ/1962م –"},
{id:"Y46d2",name:"الخيت",g:"F",father:"Y46",mother:"M40d1",dates:"1388هـ/1968م –"},
{id:"Y46w3",name:"خدحية السالمه",g:"F",father:"XA1039",dates:"1357هـ/1938م – 1401هـ/1981م",place:"ابري حيبلل",spouses:["Y46"],ext:true},
{id:"Y46d3",name:"أميم",g:"F",father:"Y46",mother:"Y46w3",dates:"1395هـ/1975م –"},
{id:"Y46s1",name:"محمد فال",g:"M",father:"Y46",mother:"Y46w3",dates:"1397هـ/1977م –",note:"لم يعقب"},
{id:"Y46d4",name:"فاطمة",g:"F",father:"Y46",mother:"Y46w3",dates:"1400هـ/1980م –"},
{id:"Y47w1",name:"مريم",g:"F",father:"Y59",note:"زواج داخلي بالأسرة؛ أم أبناء ببكر بن بكاك (ببكر) بن الجمد (أحمد) بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز — لم يعقبوا",spouses:["Y47"],mother:"Y59w1"},
{id:"Y47s1",name:"احمد",g:"M",father:"Y47",mother:"Y47w1",note:"لم يعقب"},
{id:"Y47d1",name:"العاليه",g:"F",father:"Y47",mother:"Y47w1",note:"لم تعقب"},
{id:"Y47d2",name:"امنيانه",g:"F",father:"Y47",mother:"Y47w1",note:"أم المختار بن اشريف بن المختار بن محمد بن بكاك (ببكر) بن الجمد (أحمد) بن حرمه بن المختار — لم يعقب؛ زواج داخلي بالأسرة",spouses:["Y37"]},
{id:"Y47d3",name:"توت",g:"F",father:"Y47",mother:"Y47w1",note:"لم تعقب"},
{id:"Y48w2",name:"ايْنه",g:"F",father:"XA1044",spouses:["Y48"],ext:true},
{id:"Y48d1",name:"ام المؤمنين",g:"F",father:"Y48",mother:"Y48w1",note:"أم محمذن فال بن الكوري بن بكاك (ببكر) بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز — لم يعقب؛ زواج داخلي بالأسرة",fullName:"ام المؤمنين بنت محيين (محمد) بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",spouses:["Y32"]},
{id:"Y48d3",name:"ديحات (خديجة)",g:"F",father:"Y48",mother:"Y48w2",note:"أم فاطمة بنت محمودن بن ابن عمر بن محمذن فال بن عبد الله بن شدَّار بن اشفغ الأمين — لم تعقب"},
{id:"Y48d4",name:"مريم",g:"F",father:"Y48",mother:"Y48w2",note:"لم تعقب"},
{id:"Y49w1",name:"مومنيت",g:"F",father:"Y113",note:"زواج داخلي بالأسرة؛ أم مريم بنت المختار خي بن محمذن بن احمد زروق بن فوك بن الأمين عمي — لم تعقب",spouses:["Y49","E5"]},
{id:"Y49s1",name:"المختار السالم",g:"M",father:"Y49",mother:"Y49w1",note:"لم يعقب"},
{id:"Y49s2",name:"اليدالي",g:"M",father:"Y49",mother:"Y49w1",place:"اكدرنيت",note:"لم يعقب"},
{id:"Y49d1",name:"الصغري",g:"F",father:"Y49",mother:"Y49w1",place:"ابري حيبلل",note:"لم تعقب"},
{id:"Y49d2",name:"صفيه",g:"F",father:"Y49",mother:"Y49w1",place:"محجوبو",note:"لم تعقب"},
{id:"Y49d3",name:"محجوبه",g:"F",father:"Y49",mother:"Y49w1",place:"ابري حيبلل",note:"لم تعقب"},
{id:"Y50w1",name:"امباركه",g:"F",father:"Y111s1s1",dates:"1310هـ/1893م – 1401هـ/1981م",place:"ابري حيبلل",note:"زواج داخلي بالأسرة",spouses:["Y50"]},
{id:"Y50d1",name:"مريم",g:"F",father:"Y50",mother:"Y50w1",dates:"1341هـ/1923م –",note:"أم أبناء المختار اسلام بن ابَّـد (محمد) بن سيد احمد بن بگي (ابوبكر) بن سيد بن حرمه بن المختار بن المعزوز؛ زواج داخلي بالأسرة",fullName:"مريم بنت محمد بن سيد بن حميين (محمد) بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",spouses:["Y89"]},
{id:"Y50s1",name:"سيد محمد",g:"M",father:"Y50",mother:"Y50w1",dates:"1345هـ/1927م – 1365هـ/1946م",note:"لم يعقب"},
{id:"Y50d2",name:"توت",g:"F",father:"Y50",mother:"Y50w1",note:"لم تعقب"},
{id:"Y50d3",name:"منت الخير",g:"F",father:"Y50",mother:"Y50w1",place:"ابري حيبلل",note:"أم احمدناه ودموه من أبناء الب بن احمدناه بن سيد بن احمد بن سيد الفالي بن بنيوك (محمذن) بن المختار بن محمد الكريم",spouses:["K144"]},
{id:"Y51w1",name:"توت",g:"F",father:"XA1053",spouses:["Y51"],ext:true},
{id:"Y51d1",name:"منتات",g:"F",father:"Y51",mother:"Y51w1",dates:"1396هـ/1976م –",note:"أم أبناء احمد بن محمذن السالم بن محمذن بن مولود بن المختار بن احمد البزي بن آلچ (الفالي)",spouses:["J40"],fullName:"منتات بنت محمد فال بن محمد بن سيد بن محيين بن الجمد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"Y51d2",name:"مامه",g:"F",father:"Y51",mother:"Y51w1",dates:"1398هـ/1978م –",note:"أم بعض أبناء عبد الله بن ببها (محمد فال) بن المختار بن محمد بن محمذن (ابا) بن عمي بن سكم بن محمذن بن اعمريزكئذن"},
{id:"Y51d3",name:"انَّـنه",g:"F",father:"Y51",mother:"Y51w1",dates:"1400هـ/1980م –",note:"أم عائشة بنت محمدن بن اوفا (محمد فال) بن محمد بن محمد بن زيدن بن يعقوب بن احمد ميلود بن شدَّار بن اشفغ الأمين"},
{id:"Y51d4",name:"امباركه",g:"F",father:"Y51",mother:"Y51w1",dates:"1402هـ/1982م –",note:"أم محمد فال بن سيدنا بن احمد بن محمدن بن الهلال بن محمذن بن باليل بن باب ارميد بن احمد زروق"},
{id:"Y52w1",name:"اَّميه",g:"F",father:"Y3",place:"اكدرنيت",note:"أم محمد الأمين بن محمذن بن محمد بن الأمين بن حمم بن ابو الحس بن المزضف",spouses:["Y52","Z99"]},
{id:"Y52d1",name:"العاليه",g:"F",father:"Y52",mother:"Y52w1",note:"لم تعقب"},
{id:"Y52w2",name:"النون",g:"F",father:"Y84",dates:"1274هـ/1858م – 1374هـ/1955م",place:"تنيخلف",note:"زواج داخلي بالأسرة",spouses:["Y52"],mother:"Y84w1"},
{id:"Y52d2",name:"اَّميَّم (مريم)",g:"F",father:"Y52",mother:"Y52w2",dates:"1298هـ/1881م – 1394هـ/1974م",place:"ابري حيبلل",note:"أم بنات محمد بن المختار الكوري بن محمذن بن انداه (المختار) بن بنيوك (محمذن) بن المختار بن محمد الكريم",spouses:["K121"]},
{id:"Y53s1",name:"الحسن",g:"M",father:"Y53",mother:"Y53w1",note:"لم يعقب"},
{id:"Y53s2",name:"الحسين",g:"M",father:"Y53",mother:"Y53w1",note:"لم يعقب"},
{id:"Y53s3",name:"حامد",g:"M",father:"Y53",mother:"Y53w1",note:"لم يعقب"},
{id:"Y53s4",name:"محمد فال",g:"M",father:"Y53",mother:"Y53w1",note:"لم يعقب"},
{id:"Y53d1",name:"خيراته",g:"F",father:"Y53",mother:"Y53w1",note:"أم الحسن والحسين ابني لسياد بن امسو بن العود (أحمد) بن محمذن بن عمـيَّا بن ابراهيم — لم يعقبا"},
{id:"Y54w2",name:"ميمهنه",g:"F",father:"XA1056",spouses:["Y54"],ext:true},
{id:"Y55w1",name:"ميمهنه",g:"F",father:"Y48",note:"زواج داخلي بالأسرة؛ أم ابني حبيب بن المختار بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز بن اشفغ الأمين — لم يعقبا",spouses:["Y55"],fullName:"ميمهنه بنت حميين (محمد) بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",mother:"Y48w1"},
{id:"Y55d1",name:"منت حي",g:"F",father:"Y55",mother:"Y55w1",note:"لم تعقب"},
{id:"Y56w1",name:"فلانة",g:"F",father:"G39",spouses:["Y56"]},
{id:"Y56s1",name:"المختار",g:"M",father:"Y56",mother:"Y56w1",note:"لم يعقب"},
{id:"Y70d2",name:"مريم",g:"F",father:"Y70",mother:"Z70d5",note:"أم أبناء ابن مسعود بن احمد محمود بن قطرب بن محنض بن الغالوي بن الفالي بن باب احمد"},
{id:"Y73w1",name:"ام النبي",g:"F",father:"XA206",spouses:["Y73"]},
{id:"Y74d1",name:"العاليه",g:"F",father:"Y74",mother:"Y61d1",note:"لم تعقب"},
{id:"Y76w1",name:"ام الخيري",g:"F",father:"XA279",spouses:["Y76"]},
{id:"Y76d1",name:"فاطمة",g:"F",father:"Y76",mother:"Y76w1",note:"أم مريم بنت احمد بن سيد احمد لحبيب بن محمد بن سيد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين — لم تعقب؛ زواج داخلي بالأسرة",spouses:["Y108"]},
{id:"Y76w2",name:"ام المومنين",g:"F",father:"D65",spouses:["Y76"]},
{id:"Y76d2",name:"مريم",g:"F",father:"Y76",mother:"Y76w2",note:"أم ام المومنين ومحمذن السالم ابني محمذن بن مولود بن المختار بن احمد البزي بن آلچ (الفالي)",spouses:["J38"]},
{id:"Y77d1",name:"مريم السالمه",g:"F",father:"Y77",mother:"Y84d1",place:"محجوبو",note:"لم تعقب"},
{id:"Y77w2",name:"عيشاها",g:"F",father:"G28",mother:"G59d1",dates:"…؟… – 1362هـ/1943م",place:"احسي ابيليل",spouses:["Y77"],crossLink:true},
{id:"Y77d2",name:"البتول",g:"F",father:"Y77",mother:"Y77w2",dates:"1336هـ/1918م – 1426هـ/2005م",place:"ابري حيبلل",note:"أم أبناء احمد بن محمودن بن ابًا بن محمذن بن ابن الحسين بن عبدي بن باب الدين بن اشفغ الأمين — ماتوا صغارا؛ أم اباه والقاضي والخليفه من أبناء سيد الأمين بن محمد بن محمذن وميلود بن حبلل بن عاون بن محمد الكريم؛ زواج داخلي بالأسرة",spouses:["K73","Y132"]},
{id:"Y77w3",name:"فاطمة",g:"F",father:"Y179",note:"زواج داخلي بالأسرة؛ أم محمد فال واميد والأمين وامنيانو من أبناء محمودن بن الأمين بن محمد بن حيب الله بن حرمه بن المختار بن المعزوز",spouses:["Y77"],mother:"Y179w1"},
{id:"Y77s1",name:"الأمين",g:"M",father:"Y77",mother:"Y77w3",place:"تنكجيج (سنغال)",note:"لم يعقب"},
{id:"Y77d3",name:"امنيانه",g:"F",father:"Y77",mother:"Y77w3",dates:"…؟… – 1392هـ/1972م",place:"المذرذره",note:"لم تعقب"},
{id:"Y78w1",name:"فاطمة",g:"F",father:"G60",place:"المذرذره",spouses:["Y78"],crossLink:true},
{id:"Y78d1",name:"ففه",g:"F",father:"Y78",mother:"Y78w1",dates:"1376هـ/1957م –",note:"أم أبناء بد (محمد) بن احمد بن بد (محمد) بن الربا بن بگي (ابوبكر) بن سيد بن حرمه بن المختار بن العزوز"},
{id:"Y78d2",name:"عائشة",g:"F",father:"Y78",mother:"Y78w1",dates:"1379هـ/1960م –"},
{id:"Y78w2",name:"آيه",g:"F",father:"E13",dates:"1377هـ/1958م –",note:"أم أبناء حامد بن محمد بن محمد بن زيدن بن يعقوب بن احمد ميلود بن شدَّار بن اشفغ الأمين؛ أم امنيانو بنت محمد فال بن محمودن بن الأمين بن محمد بن حيب الله بن حرمه بن المختار بن المعزوز",spouses:["Y78","Y165"]},
{id:"Y78d3",name:"امنيانه",g:"F",father:"Y78",mother:"Y78w2",dates:"1399هـ/1979م –",note:"أم مريم بنت عبد الله بن محمدن بن المبارك بن اياي (احمد) بن دياه (سيد الفالي) بن محمذن بن الفالي بن المبارك بن اما"},
{id:"Y78w3",name:"الدجيه",g:"F",father:"S29s1",note:"رابط بين الأسرتين (سيد محمد)",spouses:["Y78"],crossLink:true},
{id:"Y78d4",name:"عيشه",g:"F",father:"Y78",mother:"Y78w3",dates:"…؟… – 1423هـ/2002م",place:"احسي السعاده",note:"أم سهام من أبناء محمد بن السيد بن اميو بن سيد احممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم"},
{id:"Y78w4",name:"فلانة",g:"F",father:"XA938",spouses:["Y78"],ext:true},
{id:"Y78s1",name:"محمد",g:"M",father:"Y78",mother:"Y78w4",dates:"1403هـ/1983م –",note:"لم يعقب"},
{id:"Y78w5",name:"امات",g:"F",father:"K132s1",dates:"1378هـ/1959م – 1425هـ/2004م",place:"دليلحو",note:"زواج داخلي بالأسرة",spouses:["Y78"],fullName:"امات بنت احمد بن سيد بن محمذن بن محمد سهل وعلي بن محنض بن باب الدين بن اشفغ الأمين"},
{id:"Y78s2",name:"احمد",g:"M",father:"Y78",mother:"Y78w5",dates:"1406هـ/1986م –",note:"لم يعقب"},
{id:"Y79s1",name:"محمودن",g:"M",father:"Y79",mother:"Y80d1",dates:"1403هـ/1983م –",note:"لم يعقب"},
{id:"Y79s2",name:"ابده",g:"M",father:"Y79",mother:"Y80d1",dates:"1406هـ/1986م –",note:"لم يعقب"},
{id:"Y79d1",name:"مريم",g:"F",father:"Y79",mother:"Y80d1",dates:"1408هـ/1988م –",note:"أم أبناء الأمين بن بد بن احمد بن محمد بن الربا بن بگي (ابوبكر) بن سيد بن حرمه بن المختار بن المعزوز"},
{id:"Y79s3",name:"محمد الأمين",g:"M",father:"Y79",mother:"Y80d1",dates:"1410هـ/1990م –",note:"لم يعقب"},
{id:"Y79s4",name:"منين",g:"M",father:"Y79",mother:"Y80d1",dates:"1410هـ/1990م –",note:"لم يعقب"},
{id:"Y79s5",name:"شيخنا",g:"M",father:"Y79",mother:"Y80d1",dates:"1414هـ/1994م –",note:"لم يعقب"},
{id:"Y79d2",name:"خديجة",g:"F",father:"Y79",mother:"Y80d1",dates:"1415هـ/1995م –"},
{id:"Y79d3",name:"آمنة",g:"F",father:"Y79",mother:"Y80d1",dates:"1419هـ/1998م –"},
{id:"Y79s6",name:"محمد فال",g:"M",father:"Y79",mother:"Y80d1",dates:"1421هـ/2000م –",note:"لم يعقب"},
{id:"Y79d4",name:"عائشة",g:"F",father:"Y79",mother:"Y80d1",dates:"1424هـ/2003م –"},
{id:"Y79w2",name:"عيشه",g:"F",father:"XA806",spouses:["Y79"],ext:true},
{id:"Y79s7",name:"زين العابدين",g:"M",father:"Y79",mother:"Y79w2",note:"لم يعقب"},
{id:"Y80w1",name:"ام النبي",g:"F",father:"Y180",dates:"1359هـ/1940م –",note:"زواج داخلي بالأسرة؛ أم أبناء اَّميْد بن محمودن بن الأمين بن محمد بن حيب الله بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",spouses:["Y80"],mother:"Y180w1"},
{id:"Y80d1",name:"توت (فاطمة)",g:"F",father:"Y80",mother:"Y80w1",dates:"1384هـ/1964م –",note:"أم بعض أبناء ديد بن محمد فال بن محمودن بن الأمين بن محمد بن حيب الله بن حرمه بن المختار بن المعزوز؛ زواج داخلي بالأسرة",spouses:["Y79"]},
{id:"Y80s1",name:"اكاه",g:"M",father:"Y80",mother:"Y80w1",dates:"1386هـ/1967م – 1400هـ/1980م",place:"انواكشوط",note:"لم يعقب"},
{id:"Y80s2",name:"محمد",g:"M",father:"Y80",mother:"Y80w1",dates:"1389هـ/1969م –",note:"لم يعقب"},
{id:"Y81w1",name:"فلانة -ادوعلي-",g:"F",father:null,spouses:["Y81"]},
{id:"Y81d1",name:"آمنة",g:"F",father:"Y81",mother:"Y81w1",dates:"1420هـ/1999م –"},
{id:"Y81s1",name:"محمد",g:"M",father:"Y81",mother:"Y81w1",dates:"1422هـ/2001م –",note:"لم يعقب"},
{id:"Y81w2",name:"لمهابه",g:"F",father:"XA1060",spouses:["Y81"],ext:true},
{id:"Y81s2",name:"اميد",g:"M",father:"Y81",mother:"Y81w2",dates:"1429هـ/2008م –",note:"لم يعقب"},
{id:"Y86w1",name:"عيشه",g:"F",father:"Y75",mother:"Y75w1",note:"زواج داخلي بالأسرة",spouses:["Y86"]},
{id:"Y86s1",name:"احمد",g:"M",father:"Y86",mother:"Y86w1",note:"لم يعقب"},
{id:"Y86s2",name:"محمد عبد الرحمن",g:"M",father:"Y86",mother:"Y188d1",note:"لم يعقب"},
{id:"Y87w1",name:"النَّـت (آمنة)",g:"F",father:"Y85",dates:"1323هـ/1905م – 1406هـ/1986م",place:"دليلحو",note:"زواج داخلي بالأسرة؛ أم السالك من أبناء عبد الله بن اباه (محمد فال) بن باب بن احمد بيب بن عثمان بن سيد محمد بن عبد الرحمن",spouses:["Y87"]},
{id:"Y87s1",name:"فلان",g:"M",father:"Y87",mother:"Y87w1",note:"مات صغيرا"},
{id:"Y87s2",name:"فلان",g:"M",father:"Y87",mother:"Y87w1",note:"مات صغيرا"},
{id:"Y88d1",name:"مانه فال",g:"F",father:"Y88",mother:"Y61d1",note:"لم تعقب"},
{id:"Y89d1",name:"عيشه",g:"F",father:"Y89",mother:"Y50d1",dates:"1359هـ/1940م – 1435هـ/2014م",place:"تنيخلف",note:"أم محمدن من أبناء ببكر بن محمد سالم بن النَّاه (مختير) بن حمادي"},
{id:"Y89d2",name:"اماه (أم المومنين)",g:"F",father:"Y89",mother:"Y50d1",dates:"1365هـ/1946م –",note:"أم صغار أبناء احمد سالم بن عبد الله بن ابوبا (ببكر) بن اتاه (المختار) بن سيد احمد بن حبلل بن ابراهيم"},
{id:"Y89s1",name:"المعزوز",g:"M",father:"Y89",mother:"Y50d1",dates:"1372هـ/1953م – 1414هـ/1994م",place:"احسي السعاده",note:"لم يعقب"},
{id:"Y89d3",name:"الشـيَّه (النصفيو)",g:"F",father:"Y89",mother:"Y50d1",dates:"1375هـ/1956م –"},
{id:"Y89d4",name:"فاطمة",g:"F",father:"Y89",mother:"Y50d1",dates:"1377هـ/1958م – 1424هـ/2003م",place:"ابري حيبلل",note:"لم تعقب"},
{id:"Y90d1",name:"هدى",g:"F",father:"Y90",mother:"J26d1",dates:"1406هـ/1986م –",note:"أم فاطمة بنت يحي بن محمد فال بن المبارك بن اياي (احمد) بن ديَّاه (سيد الفالي) بن محمذن بن الفالي بن المبارك بن اما"},
{id:"Y90d2",name:"مريم",g:"F",father:"Y90",mother:"J26d1",dates:"1408هـ/1988م –",note:"أم ابناء فياه (محمد فال) بن التـَّو بن اباه بن المختار بن محمد فال بن ميلود بن محمذن بن باهنين",spouses:["V17"]},
{id:"Y90s1",name:"المختار",g:"M",father:"Y90",mother:"J26d1",dates:"1411هـ/1991م –",note:"لم يعقب"},
{id:"Y90d3",name:"مينه",g:"F",father:"Y90",mother:"J26d1",dates:"1415هـ/1995م –",note:"أم ابناء احمد بن اَّمني بن احمد بن اياي (احمد) بن ديَّاه (سيد الفالي) بن محمذن بن الفالي بن المبارك بن اما (الماقور)"},
{id:"Y90s2",name:"محمد فال",g:"M",father:"Y90",mother:"J26d1",dates:"1420هـ/1999م –",note:"لم يعقب"},
{id:"Y90s3",name:"احمد",g:"M",father:"Y90",mother:"J26d1",dates:"1423هـ/2002م –",note:"لم يعقب"},
{id:"Y91w1",name:"امه (ميمونه)",g:"F",father:"I15",dates:"1378هـ/1959م –",note:"أم فرحو من أبناء احمد بن الطلبه بن محمد بن ميلود بن محمد فال بن ميلود بن محمذن بن باهنين؛ أم أبناء بگي بن المختار اسلام بن محمد بن سيد احمد بن بگي (ابوبكر) بن سيد بن حرمه بن المختار بن المعزوز",spouses:["Y91"],crossLink:true,fullName:"امه (ميمونه) بنت احمد سالم بن عبد الله بن ابوبا (ببكر) بن المختار بن سيد احمد بن حبلل بن ابراهيم",mother:"I15w2"},
{id:"Y91d1",name:"ورده",g:"F",father:"Y91",mother:"Y91w1",dates:"1401هـ/1981م –"},
{id:"Y91d2",name:"البتول",g:"F",father:"Y91",mother:"Y91w1",dates:"1404هـ/1984م –"},
{id:"Y94w1",name:"اَّماها (مريم)",g:"F",father:"I50",spouses:["Y94"]},
{id:"Y94d1",name:"ام الخيري",g:"F",father:"Y94",mother:"Y94w1",note:"لم تعقب"},
{id:"Y94d2",name:"حاجه",g:"F",father:"Y94",mother:"Y94w1",note:"لم تعقب"},
{id:"Y95d1",name:"مـَّماه (عايشا)",g:"F",father:"Y95",mother:"Y146d1",dates:"1372هـ/1953م –",note:"أم أبناء اكاه بن ابَّده (محمد اليدالي) بن المختار فال بن سيد الفالي بن ابن المعالي بن محنض بن شدَّار بن اشفغ الأمين",spouses:["Y181"]},
{id:"Y96w1",name:"سيكْن بيها (سكينه)",g:"F",father:"I23",dates:"1371هـ/1952م – 1389هـ/1969م",place:"تنيخلف",spouses:["Y96"],crossLink:true,fullName:"سيكْن بيها (سكينه) بنت المختار بن ابوبا (ببكر) بن المختار بن سيد احمد بن حبلل بن ابراهيم",mother:"I90d1",note:"أم أحمد من أبناء من بن ببكر بن محمد بن الربا بن بگي (ابوبكر) بن سيد بن حرمه بن المختار بن المعزوز"},
{id:"Y96s1",name:"احمد",g:"M",father:"Y96",mother:"Y96w1",dates:"1389هـ/1969م –",note:"لم يعقب"},
{id:"Y96w2",name:"الخيت",g:"F",father:"Y38",dates:"1359هـ/1940م – 1428هـ/2007م",place:"دليلحو",note:"زواج داخلي بالأسرة — تزوجت منَّ (Y96) ثم هَد/احمد (Y147)؛ أم بنيت هد (احمد) بن سيد بن محمذن بن محمد سهل بن علي بن محنض بن باب الدين بن اشفغ الأمين؛ أم بعض أبناء أمّن بن ببكر بن بد (محمد) بن الربا بن بگي (ابوبكر) بن سيد بن حرمه بن المختار بن المعزوز",spouses:["Y96","Y147"],crossLink:true,mother:"Y38w1"},
{id:"Y96d1",name:"مريم",g:"F",father:"Y96",mother:"Y96w2",dates:"1398هـ/1978م –"},
{id:"Y96s2",name:"النَّح (محمد المختار)",g:"M",father:"Y96",mother:"Y96w2",dates:"1401هـ/1981م –",note:"لم يعقب"},
{id:"Y97w1",name:"العمره (السالمه)",g:"F",father:"Y181",dates:"1409هـ/1989م –",note:"زواج داخلي بالأسرة؛ أم ابناء بد (محمد) بن من بن ببكر بن الربا بن بگي (ابوبكر) بن سيد بن حرمه بن المختار بن المعزوز",spouses:["Y97"],mother:"Y181w1"},
{id:"Y97s1",name:"من",g:"M",father:"Y97",mother:"Y97w1",dates:"1432هـ/2011م –",note:"لم يعقب"},
{id:"Y97d1",name:"الخيت",g:"F",father:"Y97",mother:"Y97w1",dates:"1432هـ/2013م –"},
{id:"Y98w1",name:"اميه (ميمونه)",g:"F",father:"Y181",dates:"1407هـ/1987م –",note:"زواج داخلي بالأسرة؛ أم ابناء محمد الأمين بن من بن ببكر بن الربا بن بگي (ابوبكر) بن سيد بن حرمه بن المختار بن المعزوز",spouses:["Y98"],mother:"Y181w1"},
{id:"Y98s1",name:"فلانه",g:"M",father:"Y98",mother:"Y98w1",dates:"1432هـ/2013م –",note:"لم يعقب"},
{id:"Y98s2",name:"أمــن",g:"M",father:"Y98",mother:"Y98w1",dates:"1432هـ/2013م –",note:"لم يعقب"},
{id:"Y99w1",name:"ميم",g:"F",father:"XA503",dates:"1378هـ/1959م –",note:"أم أبناء محمد يحي -امساسيد-",spouses:["Y99"],ext:true},
{id:"Y99d1",name:"الزهراء",g:"F",father:"Y99",mother:"Y99w1",dates:"1398هـ/1978م –",note:"أم أبناء عيسى بن هايل بن ددالي (محمد اليدالي) بن محمد بن شيبة بن الفالي بن عمـيَّا بن ابراهيم"},
{id:"Y99d2",name:"ورده",g:"F",father:"Y99",mother:"Y99w1",dates:"1400هـ/1980م –",note:"أم أبناء محمد محمود بن ديد بن اميني (الأمين) بن سيد بن محمد بن الأمين بن حمم بن ابو الحس بن المزضف",spouses:["Z138"]},
{id:"Y99d3",name:"اللَّه",g:"F",father:"Y99",mother:"Y99w1",dates:"1402هـ/1982م –",note:"أم أبناء ايـيَّاه (احمد) بن محمد فال بن ببكر بن سيد احممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم",spouses:["I46"]},
{id:"Y99s1",name:"محمد",g:"M",father:"Y99",mother:"Y99w1",dates:"1404هـ/1984م –",note:"لم يعقب"},
{id:"Y100w1",name:"حاجه",g:"F",father:"XA1063",dates:"1384هـ/1964م –",spouses:["Y100"],ext:true},
{id:"Y100s1",name:"ببكر",g:"M",father:"Y100",mother:"Y100w1",dates:"1415هـ/1995م –",note:"لم يعقب"},
{id:"Y100s2",name:"احمد",g:"M",father:"Y100",mother:"Y100w1",dates:"1419هـ/1998م –",note:"لم يعقب"},
{id:"Y101w1",name:"السالمه",g:"F",father:"XA732",dates:"1386هـ/1966م –",spouses:["Y101"],ext:true},
{id:"Y101d1",name:"امهنه",g:"F",father:"Y101",mother:"Y101w1",dates:"1403هـ/1983م –",note:"أم احمد سالم بن عبد الله بن احمد سالم بن عبد الله بن ابوبا بن المختار بن سيد احمد بن حبلل بن ابراهيم"},
{id:"Y101s1",name:"اشريف",g:"M",father:"Y101",mother:"Y101w1",dates:"1405هـ/1985م –",note:"لم يعقب"},
{id:"Y102w1",name:"خدجية",g:"F",father:"F120",mother:"F120w1",dates:"1391هـ/1971م –",spouses:["Y102"],crossLink:true,fullName:"خدجية بنت احمد بن ببكر بن اتاه (المختار) بن بيبات بن حمم بن المبارك بن اما (الماقور)"},
{id:"Y102d1",name:"عائشة",g:"F",father:"Y102",mother:"Y102w1",dates:"1423هـ/2002م –"},
{id:"Y102s1",name:"محمدن",g:"M",father:"Y102",mother:"Y102w1",dates:"1429هـ/2008م –",note:"لم يعقب"},
{id:"Y103w1",name:"افَّـيه (صفيه)",g:"F",father:"G56s1s1s1s1",dates:"1925م – 1427هـ/2006م",place:"ابري حيبلل",spouses:["Y103"]},
{id:"Y104w1",name:"ففه",g:"F",father:"Y78",dates:"1376هـ/1957م –",note:"زواج داخلي بالأسرة",spouses:["Y104"]},
{id:"Y104d1",name:"توت",g:"F",father:"Y104",mother:"Y104w1",dates:"1396هـ/1976م –",note:"أم أبناء احمد بن سيد بن احمد سالم بن محمذن بن محمد بن الأمين بن حمم بن ابو الحس بن المزضف",spouses:["Z102"]},
{id:"Y104d2",name:"تت",g:"F",father:"Y104",mother:"Y104w1",dates:"1403هـ/1983م –",note:"أم أبناء محمدن بن محمد بن المختار السالم بن عبد العزيز بن المختار بن محمذن بن الأمين بن الفالي بن متيلي",spouses:["M60"]},
{id:"Y104d3",name:"فتحيَّه",g:"F",father:"Y104",mother:"Y104w1",dates:"1405هـ/1985م –",note:"أم أبناء محمدن بن الهادي بن محمذن بن محمد بن بكاك (ببكر) بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز؛ زواج داخلي بالأسرة",spouses:["Y43"],fullName:"فتحيَّه بنت بَد بن احمد بن بد (محمد) بن الربا بن بگي (ابوبكر) بن سيد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"Y104d4",name:"فرحه",g:"F",father:"Y104",mother:"Y104w1",dates:"1407هـ/1987م –",note:"أم أبناء محمد بن محمد المختار بن سيد بن ابو (محمد) بن امني بن محمد بن محمذن بن عركاب (حمم) بن اوبا (الأمين) ولد ماه"},
{id:"Y105w1",name:"مريم",g:"F",father:"Y79",dates:"1401هـ/1981م –",note:"زواج داخلي بالأسرة",spouses:["Y105"]},
{id:"Y105d1",name:"افيَّه (صفيه)",g:"F",father:"Y105",mother:"Y105w1",dates:"1433هـ/2012م –"},
{id:"Y105d2",name:"فلانه",g:"F",father:"Y105",mother:"Y105w1"},
{id:"Y106w1",name:"ام البنين",g:"F",father:"XA1067",place:"ابري حيبلل",spouses:["Y106"],ext:true},
{id:"Y106d1",name:"صفيه",g:"F",father:"Y106",mother:"Y119d7",note:"أم اخت البنين واخدجيو بنتي دداه (عبد الله) بن سيد بن سعيد بن المختار بن اشفغ حيبلل"},
{id:"Y106w3",name:"ما اتواسي العار (فاطمة)",g:"F",father:null,note:"أم ام المومنين بنت محمذن بن الأمين بن حمم بن ابو الحس بن المزضف",spouses:["Y106"]},
{id:"Y106w4",name:"مريم",g:"F",father:"Y20",note:"زواج داخلي بالأسرة؛ أم احمد سالم من أبناء محمد بن سيد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين — لم يعقب",spouses:["Y106"],mother:"Y20w1"},
{id:"Y106s1",name:"احمد سالم",g:"M",father:"Y106",mother:"Y106w4",note:"لم يعقب"},
{id:"Y107w1",name:"افيطيمه",g:"F",father:"G59",spouses:["Y107"],crossLink:true},
{id:"Y107s1",name:"محمد فال",g:"M",father:"Y107",mother:"Y107w1",note:"لم يعقب"},
{id:"Y107d1",name:"خدج",g:"F",father:"Y107",mother:"Y107w1",note:"لم تعقب"},
{id:"Y107d2",name:"مريم",g:"F",father:"Y107",mother:"Y107w1",note:"لم تعقب"},
{id:"Y108d1",name:"مريم",g:"F",father:"Y108",mother:"Y76d1",note:"لم تعقب"},
{id:"Y109w1",name:"صفيه",g:"F",father:"Y31",note:"زواج داخلي بالأسرة؛ أم امرام وام النبي وفاطمة من بنات سيد المختار بن محمد بن سيد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين — لم يعقبن",spouses:["Y109"],mother:"Y31w2"},
{id:"Y109d1",name:"امرام",g:"F",father:"Y109",mother:"Y109w1",note:"لم تعقب"},
{id:"Y109d2",name:"ام النبي",g:"F",father:"Y109",mother:"Y109w1",note:"لم تعقب"},
{id:"Y109d3",name:"فاطمة",g:"F",father:"Y109",mother:"Y109w1",note:"لم تعقب"},
{id:"Y109w2",name:"منومه",g:"F",father:"Y16",note:"زواج داخلي بالأسرة؛ أم أمامو من بنات سيد المختار بن محمد بن سيد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين",spouses:["Y109"],mother:"Y16w1"},
{id:"Y109d4",name:"أمامه",g:"F",father:"Y109",mother:"Y109w2",dates:"…؟… – 1411هـ/1991م",place:"ابري حيبلل",note:"أم عائشة بنت الكريم بن محمذن بن ابامين (الأمين) بن المختار بن احمد اهنكر بن محمد الكريم — لم تعقب؛ أم عبد الله وفاطمو ابني محمذن بن الكوري بن احمد فال بن الفالي بن المبارك بن اما (الماقور)؛ ⚠️ تاريخ الميلاد في المصدر الأصلي يتعارض مع وفاة الزوج — قد يكون خطأ OCR في الوثيقة الأصلية",spouses:["K33","F33"]},
{id:"Y110w1",name:"فاطمة",g:"F",father:"Y153",note:"زواج داخلي بالأسرة",spouses:["Y110"]},
{id:"Y110s1",name:"محمد",g:"M",father:"Y110",mother:"Y110w1",dates:"1315هـ/1898م – 1401هـ/1981م",place:"ابري حيبلل",note:"لم يعقب"},
{id:"Y110d1",name:"ينصرها",g:"F",father:"Y110",mother:"Y110w1",note:"أم فلان بن آمني بن ابن بن محمذن بن ابن الحسين بن عبدي بن باب الدين بن اشفغ الأمين — لم يعقب؛ زواج داخلي بالأسرة",spouses:["Y131","Y134"]},
{id:"Y117d1",name:"مريم",g:"F",father:"Y117",mother:"Y117w1",note:"أم اخدجيو فال بنت احمد بن سيد احمد بن بگي (ابوبكر) بن سيد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"Y118w1",name:"اعشذ فال",g:"F",father:"XA516",spouses:["Y118"],ext:true},
{id:"Y118d1",name:"آمه",g:"F",father:"Y118",mother:"Y118w1",note:"أم سيد المختار وعلي وحبيب والبخاري ومحمد النيسابوري من أبناء الفاللي (عبد الله) بن مسكو بن باركلل"},
{id:"Y118d3",name:"صفيه",g:"F",father:"Y118",mother:"Y118w1",note:"أم أبناء احمد خرشي بن الخراشي بن مسكو بن باركلل بن احمد بزيد",spouses:["XA402"]},
{id:"Y118d4",name:"خديجة",g:"F",father:"Y118",mother:"Y118w1",note:"أم احمد مسكو والحسن وفاطمة وميمونو من أبناء الفاللي (عبد الله) بن مسكو بن باركلل"},
{id:"Y118d5",name:"مريم",g:"F",father:"Y118",mother:"Y118w1",place:"تنيخلف",note:"أم عمر وببكر من أبناء اللديب بن المعزوز بن اشفغ الأمين؛ أم أبناء حمم بن اما (الماقور)؛ زواج داخلي بالأسرة؛ أم أبناء محم بن أمّا (الماقور)",spouses:["F134","Y12"]},
{id:"Y119w1",name:"آمنة",g:"F",father:"XA495",spouses:["Y119"],ext:true},
{id:"Y119s1",name:"باب",g:"M",father:"Y119",mother:"Y119w1",place:"تينشيكل",note:"لم يعقب"},
{id:"Y119d3",name:"لمبوكه",g:"F",father:"Y119",mother:"Y119w1",note:"لم تعقب"},
{id:"Y119d4",name:"مريم",g:"F",father:"Y119",mother:"Y119w1",note:"أم فاطمة من بنات حبيبنا بن التقي بن أبَـيْ (المختار)"},
{id:"Y119w2",name:"ميمهنه",g:"F",father:"XA1035",note:"أم زين ومبارك ابني أيدوم بن امحذ بن اشفغ المختار باب — لم يعقبا؛ أم خدجية من بنات حبيبنا بن التقي بن أبي (المختار)",spouses:["Y119"],ext:true},
{id:"Y119d6",name:"منت لعبيد",g:"F",father:"Y119",mother:"Y119w2",note:"أم أبناء ابن عمر بن ياحممذا بن زمتار بن احمد شينان بن بوشنكور (الماح) بن محنض بن يدن يعقوب"},
{id:"Y119w3",name:"فلانة",g:"F",father:"XA1068",spouses:["Y119"],ext:true},
{id:"Y119d7",name:"مريم الصغرى",g:"F",father:"Y119",mother:"Y119w3",note:"أم صفيو ومولود فال وما اتواسي العار (فاطمة) من انباء محمد بن سيد بن حرمه بن المختار بن المعزوز؛ أم باري من أبناء زين بن محمذن (جايل الظالم) بن بوبكر بن اشفغ الأمين؛ زواج داخلي بالأسرة",spouses:["Y106","Y121"]},
{id:"Y120w1",name:"عيشتونه",g:"F",father:"Y124",note:"زواج داخلي بالأسرة؛ أم أبناء محمذن (جايل الظالم) بن بوبكر بن اشفغ الأمين",spouses:["Y120"],mother:"Y124w1"},
{id:"Y121w1",name:"امنينه",g:"F",father:"XA339",note:"أم يَكْوه (محمد) وصفيو ابني محمذن بن احمد ميلود بن شدَّار بن اشفغ الأمين",spouses:["Y121","Y154"],ext:true},
{id:"Y121d1",name:"ام المومنين",g:"F",father:"Y121",mother:"Y121w1",note:"أم ابني سيد بن عبدي بن باب الدين بن اشفغ الأمين — لم يعقبا؛ أم مريم من أبناء امـِّين (محمذن) بن بوبكر بن حمم بن ابو الحس بن المزضف — لم تعقب؛ رابط بين الأسرتين محتمل؛ زواج داخلي بالأسرة؛ أم ابني سيد بن عبدي بن باب الدين بن اشفغ الأمين؛ أم مريم بنت أمّن (محمذن) بن بوبكر بن محم بن ابواحلس بن المزضف؛ زواج داخلي بالأسرة؛ أم احميمدا بن ايتاب بن عبدي بن باب الدين بن اشفغ الأمين؛ أم مريم بنت اَّمن بن بوبكر بن حمم بن ابو الحس بن المزضف",spouses:["Z21","Y6","Y135"]},
{id:"Y121w2",name:"فاطمة",g:"F",father:"XA1071",note:"أم محمد فال بن المعلوم بن ساعيد بن التقي بن أبي (المختار)",spouses:["Y121"],ext:true},
{id:"Y121d3",name:"ميمهنه",g:"F",father:"Y121",mother:"Y121w2",note:"أم بنيت محمذن بن عمر بن اللديب بن المعزوز بن اشفغ الأمين؛ أم مريم من أبناء محمذن بن محمد بن الأمين بن حمم بن ابو الحس بن المزضف؛ زواج داخلي بالأسرة",spouses:["Z99","Y21"]},
{id:"Y121w4",name:"مغنم",g:"F",father:"Y150",note:"زواج داخلي بالأسرة؛ أم مين وتكرور من أبناء زين بن محمذن (جايل الظالم) بن بوبكر بن اشفغ الأمين",spouses:["Y121"],mother:"Y150w1"},
{id:"Y121d4",name:"تكرور",g:"F",father:"Y121",mother:"Y121w4",note:"لم تعقب"},
{id:"Y121d5",name:"منِّي",g:"F",father:"Y121",mother:"Y121w4",note:"لم تعقب"},
{id:"Y122w1",name:"عيشه",g:"F",father:"Y144",note:"زواج داخلي بالأسرة؛ أم محمذن بن باري بن زين بن محمذن (جايل الظالم) بن بوبكر بن اشفغ الأمين",spouses:["Y122"],mother:"Y57d1"},
{id:"Y123w1",name:"ميمهنه",g:"F",father:"Y34",note:"زواج داخلي بالأسرة؛ أم امباركو العاليو بنت محمذن بن باري بن زين بن محمذن (جايل الظالم) بن بوبكر بن اشفغ الأمين",spouses:["Y123"],mother:"Y34w1"},
{id:"Y123d1",name:"امباركه العاليه",g:"F",father:"Y123",mother:"Y123w1",dates:"1351هـ/1932م – 1432هـ/2011م",place:"ابري حيبلل",note:"أم ابني محمد فال بن ببكر بن سيد احممد بن ببكر بن سيد الفالي بن حبلل بن ابراهيم"},
{id:"Y124w1",name:"حنه",g:"F",father:"G99",spouses:["Y124"],crossLink:true,mother:"G99w2",note:"أم عبدي وعيشتونو ومريم جلدل وفاطمة وصفيو من أبناء باب الدين بن اشفغ الأمين"},
{id:"Y124d4",name:"مريم لجدل",g:"F",father:"Y124",mother:"Y124w1",note:"أم أبناء الأمين بن المختار بن اشفغ موسى"},
{id:"Y124w2",name:"غادجيه",g:"F",father:"I1",mother:"I1w1",spouses:["Y124"],crossLink:true},
{id:"Y124d5",name:"اصديكه",g:"F",father:"Y124",mother:"Y124w2",note:"أم أبناء آب (محمذن) بن المختار بن اشفغ موسى",spouses:["XA576"]},
{id:"Y125w1",name:"انَّـيسه",g:"F",father:"F134",spouses:["Y125"],crossLink:true,fullName:"انَّـيسه بنت حمم بن اما (الماقور)"},
{id:"Y125d1",name:"فاطمة",g:"F",father:"Y125",mother:"Y125w1",note:"أم محمد ومانونو ابني سيد بن ايتاب بن حبلل بن اشفغ الأمين؛ زواج داخلي بالأسرة",spouses:["G119","Y6"]},
{id:"Y125w2",name:"ميمهنه",g:"F",father:"F134",note:"أم الأمين ومحنض أبناء محمذن بن متيلي بن احمد بن الحسن دوبك",spouses:["Y125"],crossLink:true,fullName:"ميمهنه بنت حمم بن اما (الماقور)"},
{id:"Y126w1",name:"آجْم",g:"F",father:"Y186",note:"زواج داخلي بالأسرة؛ أم فاطمة بنت ابريك بن عبدي بن باب الدين بن اشفغ الأمين",spouses:["Y126"],mother:"Y186w1"},
{id:"Y126d1",name:"فاطمة",g:"F",father:"Y126",mother:"Y126w1",note:"أم احمد ومحمذن وسيد وخدجية ومريم من أبناء امبريك بن محمد لدخن بن احمد ميلود بن شدَّار بن اشفغ الأمين؛ زواج داخلي بالأسرة",spouses:["Y152"]},
{id:"Y127w2",name:"لمليحه",g:"F",father:"XA1073",spouses:["Y127"],ext:true},
{id:"Y128w1",name:"ام المومنين",g:"F",father:"XA638",spouses:["Y128"],fullName:"ام المومنين بنت احمد بن ابيهم بن ابا الصالح (يعقوب) بن احمد بن اشفغ اوبك بن مهنض امغر",ext:true},
{id:"Y128s1",name:"عالي",g:"M",father:"Y128",mother:"Y128w1",note:"لم يعقب"},
{id:"Y128d1",name:"آبيَّه",g:"F",father:"Y128",mother:"Y128w1",note:"لم تعقب"},
{id:"Y128w2",name:"خيرا",g:"F",father:"Y121",note:"زواج داخلي بالأسرة؛ أم عائشة من أبناء محمذن بن ابن الحسين بن عبدي بن باب الدين بن اشفغ الأمين",spouses:["Y128"],mother:"Y121w1"},
{id:"Y128d2",name:"عائشة",g:"F",father:"Y128",mother:"Y128w2",note:"أم احمد بن محمذن بن الجمد (أحمد) بن محمد بن سيد الأمين بن اعمر يزكئذن بن محنضلل بن اعمر اديقب"},
{id:"Y128d3",name:"اَّمفال (فاطمه فال)",g:"F",father:"Y128",mother:"I79d1",note:"أم دمـِّين (سيد الأمين) ومحمدن وخدجاني ومـيَّـم أبناء آياه (بوبكر) بن احمد بن الأمين بن حمم بن ابو الحس بن المزضف؛ أم ام المومنين بنت مختير بن امحذ بن العيدي بن المختار باب بن محمذن بن باب احمد بن سيد (المختار) بن عبد الله",spouses:["Z150","D65"]},
{id:"Y129w1",name:"الجده",g:"F",father:"Y157",note:"زواج داخلي بالأسرة؛ أم أبناء ابًا بن محمذن بن ابن الحسين بن عبدي بن باب الدين بن اشفغ الأمين",spouses:["Y129"],mother:"Y157w1"},
{id:"Y129s1",name:"عالي",g:"M",father:"Y129",mother:"Y129w1",note:"لم يعقب"},
{id:"Y129s2",name:"محمذن",g:"M",father:"Y129",mother:"Y129w1",dates:"…؟… – 1379هـ/1960م",place:"المذرذره",note:"لم يعقب"},
{id:"Y130d2",name:"توت (فاطمة الزهراء)",g:"F",father:"Y130",mother:"Y188d1",dates:"…؟… – 1397هـ/1977م",place:"ابري حيبلل",note:"أم عايشا من بنات احمد بن سيد احمد بن بگي (ابوبكر) بن سيد بن حرمه بن المعزوز بن اشفغ الأمين"},
{id:"Y131w1",name:"عمرانه",g:"F",father:"XA1076",spouses:["Y131"],ext:true},
{id:"Y131d1",name:"خدود (خديجة)",g:"F",father:"Y131",mother:"Y131w1",dates:"1323هـ/1905م – 1422هـ/2001م",place:"دليلحو",note:"لم تعقب"},
{id:"Y131s1",name:"فلان",g:"M",father:"Y131",mother:"Y110d1",note:"لم يعقب"},
{id:"Y132s1",name:"فلان",g:"M",father:"Y132",mother:"Y77d2",note:"لم يعقب"},
{id:"Y132s2",name:"فلان",g:"M",father:"Y132",mother:"Y77d2",note:"لم يعقب"},
{id:"Y133w1",name:"اَّماته",g:"F",father:"Y21",note:"زواج داخلي بالأسرة؛ أم أبناء ابن بن محمذن بن ابن الحسين بن عبدي بن باب الدين بن اشفغ الأمين",spouses:["Y133"],mother:"Y121d3"},
{id:"Y133s1",name:"محمد محمود",g:"M",father:"Y133",mother:"Y133w1",dates:"1235هـ/1820م –",place:"تينشيكل",note:"لم يعقب"},
{id:"Y133d1",name:"ميمهنه",g:"F",father:"Y133",mother:"Y133w1",note:"لم تعقب"},
{id:"Y133d2",name:"أمّن",g:"F",father:"Y133",mother:"Y133w1",note:"أم حوملل واَّماتو ابني محمد بن حوملل -اديقب-؛ زواج داخلي بالأسرة؛ أم اشريف بن المختار بن محمد بن بكاك (ببكر) بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز — لم يعقب",spouses:["Y36"]},
{id:"Y134s1",name:"فلان",g:"M",father:"Y134",mother:"Y110d1",note:"لم يعقب"},
{id:"Y135s1",name:"باب",g:"M",father:"Y135",mother:"Y121d1",note:"لم يعقب"},
{id:"Y135s2",name:"محمد",g:"M",father:"Y135",mother:"Y121d1",note:"لم يعقب"},
{id:"Y136w1",name:"فاطمة",g:"F",father:"XA528",spouses:["Y136"],ext:true},
{id:"Y136w2",name:"فلانة",g:"F",father:"G36",mother:"G36w1",note:"أم بنيت فوك بن حبلل بن ماه",spouses:["Y136"],crossLink:true},
{id:"Y136d1",name:"عائشة",g:"F",father:"Y136",mother:"Y136w2",note:"أم أبناء الأمين بن المزضف بن اعديج بن بزيد -اولاد بزيد-"},
{id:"Y136d2",name:"فلانة",g:"F",father:"Y136",mother:"Y136w2",note:"أم محمذن بن ميين بن شدَّار بن اشفغ الأمين"},
{id:"Y136d3",name:"فلانة",g:"F",father:"Y136",mother:"Y136w2",note:"أم أبناء محمذن بن المعلوم بن محمد بن محمد الأمين بن محنض بن صباره (المختار) بن باب احمد"},
{id:"Y138w1",name:"غادجيه",g:"F",father:"Y14",mother:"Y14w1",note:"زواج داخلي بالأسرة",spouses:["Y138"]},
{id:"Y139w1",name:"آجْم",g:"F",father:"Y143",note:"زواج داخلي بالأسرة",spouses:["Y139"]},
{id:"Y139s1",name:"سيد احمد",g:"M",father:"Y139",mother:"Y139w1",note:"لم يعقب"},
{id:"Y139s2",name:"لولي",g:"M",father:"Y139",mother:"Y139w1",note:"لم يعقب"},
{id:"Y139d1",name:"افيتي",g:"F",father:"Y139",mother:"Y139w1",note:"أم مريم بنت احمد بن سيد احمد بن حيب الله بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"Y139d2",name:"آمنة",g:"F",father:"Y139",mother:"Y139w1",note:"لم تعقب"},
{id:"Y140w1",name:"فلانة -اولاد ابيريي-",g:"F",father:null,spouses:["Y140"]},
{id:"Y140d1",name:"مريم تغله",g:"F",father:"Y140",mother:"Y140w1",note:"لم تعقب"},
{id:"Y141w1",name:"فاطمة",g:"F",father:"G56s1s2s1",spouses:["Y141"]},
{id:"Y141d1",name:"يمي",g:"F",father:"Y141",mother:"Y141w1",note:"لم تعقب"},
{id:"Y142w1",name:"فلانه",g:"F",father:"XA375",spouses:["Y142"],ext:true},
{id:"Y143w1",name:"غادجيه",g:"F",father:"XA1080",spouses:["Y143"],ext:true},
{id:"Y143s1",name:"الدباج (ببكر)",g:"M",father:"Y143",mother:"Y143w1",note:"لم يعقب"},
{id:"Y143d1",name:"آجم",g:"F",father:"Y143",mother:"Y143w1",note:"أم أبناء احمد بن سيد بن المبارك بن باب الدين بن اشفغ الأمين",spouses:["Y139"]},
{id:"Y144d1",name:"امباركه",g:"F",father:"Y144",mother:"Y57d1",note:"أم بنيت محمذن بن امبريك بن محمد لدخن بن احمد ميلود بن شدَّار بن اشفغ الأمين؛ زواج داخلي بالأسرة",spouses:["Y153"]},
{id:"Y145d1",name:"امامة",g:"F",father:"Y145",mother:"Y31d1",place:"محجوبو",note:"أم مريم بنت محمذن بن سيد بن محمذن احجاب بن محمد الكريم؛ أم خديج بنت ببكر السالم بن محمد فال بن جد أم بن بابكر بن حرمه بن المختار بن المعزوز — لم تعقب",spouses:["K7","Y28"]},
{id:"Y146w1",name:"امروم",g:"F",father:"Y33",mother:"Y33w1",note:"زواج داخلي بالأسرة؛ أم بنيت محمدن بن جد أم بن بابكر بن حرمه بن المختار بن المعزوز — لم تعقبا",spouses:["Y146"]},
{id:"Y146d1",name:"السالمه",g:"F",father:"Y146",mother:"Y146w1",dates:"1335هـ/1917م – 1410هـ/1990م",place:"محجوبو",note:"أم احمد ومحمد وعبد الله وببا (البرا) ودماه من أبناء ببكر بن بد (محمد) بن الربا بن بگي (ابوبكر) بن سيد بن حرمه بن المختار بن المعزوز؛ زواج داخلي بالأسرة",spouses:["Y95"]},
{id:"Y146w2",name:"امباركه",g:"F",father:"Y133",note:"زواج داخلي بالأسرة؛ أم عيشو بنت سيد بن محمذن بن محمد سهل بن علي بن محنض بن باب الدين بن اشفغ الأمين؛ أم فاطمة بنت ببكر بن احمد بن محمذن بن حبلل بن المزضف بن شدَّار بن اشفغ الأمين — لم تعقب",spouses:["Y146"],mother:"Y133w1"},
{id:"Y147d1",name:"اَّمات",g:"F",father:"Y147",mother:"Y96w2",dates:"1378هـ/1959م – 1424هـ/2003م",place:"دليلحو",note:"أم احمد من أبناء محمد فال بن محمودن بن الأمين بن محمد بن حيب الله بن حرمه بن المختار بن المعزوز",spouses:["Y78"]},
{id:"Y147w2",name:"اَّمهنا",g:"F",father:"XA1004",dates:"1382هـ/1963م –",spouses:["Y147"],ext:true},
{id:"Y147d2",name:"فلانة",g:"F",father:"Y147",mother:"Y147w2",note:"أم محمدي من أبناء احمد بن عبد الله بن محمد فال بن باب بن احمد بيب بن عثمان بن سيد محمد بن عبد الرحمن"},
{id:"Y148w1",name:"غان",g:"F",father:"XA1124",spouses:["Y148"],ext:true},
{id:"Y148d1",name:"فلانه",g:"F",father:"Y148",mother:"Y148w1",note:"أم الفالي والليث ومريم أبناء محنض بن معلوم بن ابراهيم"},
{id:"Y148d2",name:"مريم",g:"F",father:"Y148",mother:"Y148w1",note:"أم أبناء البخاري بن مولود بن باركلل بن احمد بزيد"},
{id:"Y149w1",name:"ايذَه",g:"F",father:"G36",mother:"G36w1",spouses:["Y149"],crossLink:true},
{id:"Y149d2",name:"فاطمه",g:"F",father:"Y149",mother:"Y149w1",note:"أم احمد والأمين وببكر والبخاري وسيد واخدجيات من أبناء سعيد بن المختار بن اشفغ حيبلل",spouses:["XA531"]},
{id:"Y149d3",name:"مام دل",g:"F",father:"Y149",mother:"Y149w1",note:"أم ام المومنين بنت ابن بن اللديب بن المعزوز بن اشفغ الأمين"},
{id:"Y150w1",name:"الزغمه",g:"F",father:"XA531",mother:"Y149d2",note:"أم خيرات بنت سيد بن محم بن ابو الحس بن المزضف",spouses:["Y150"],ext:true},
{id:"Y150d3",name:"فلانه",g:"F",father:"Y150",mother:"Z5d1",note:"لم تعقب"},
{id:"Y151w1",name:"مريم",g:"F",father:"Y170",note:"زواج داخلي بالأسرة؛ أم أبناء محمد لدخن بن احمد ميلود بن شدَّار بن اشفغ الأمين",spouses:["Y151"],mother:"Y170w1"},
{id:"Y151s1",name:"سيد احمد",g:"M",father:"Y151",mother:"Y151w1",note:"لم يعقب"},
{id:"Y151s2",name:"عباد",g:"M",father:"Y151",mother:"Y151w1",note:"لم يعقب"},
{id:"Y151d1",name:"ام الخيري",g:"F",father:"Y151",mother:"Y151w1",note:"أم مريم من أبناء سيدي مولود فال بن محمذن فال بن الأمين بن المختار بن اشفغ موسى"},
{id:"Y152w1",name:"سادلا",g:"F",father:"Y196",mother:"Y196w1",note:"زواج داخلي بالأسرة",spouses:["Y152"],fullName:"سادلا بنت شدَّار بن ياحممذ بن شدَّار بن اشفغ الأمين"},
{id:"Y152s1",name:"احمد",g:"M",father:"Y152",mother:"Y126d1",note:"لم يعقب"},
{id:"Y152s2",name:"سيد",g:"M",father:"Y152",mother:"Y126d1",note:"لم يعقب"},
{id:"Y152d1",name:"خديجة",g:"F",father:"Y152",mother:"Y126d1",note:"أم أبناء محمذن بن امحيد بن اندعمر بن محمذن بن احمد شب"},
{id:"Y152d2",name:"مريم",g:"F",father:"Y152",mother:"Y126d1",note:"لم تعقب"},
{id:"Y153d1",name:"ام الخير",g:"F",father:"Y153",mother:"Y144d1",note:"لم تعقب"},
{id:"Y153d2",name:"فاطمة",g:"F",father:"Y153",mother:"Y144d1",note:"أم محمد وينصرها ابني مولود فال بن محمد بن سيد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"Y154d1",name:"صفيه",g:"F",father:"Y154",mother:"Y121w1",note:"أم أبناء سالم بن هندار -اچكوچي-"},
{id:"Y155w1",name:"ام المومنين",g:"F",father:"Y173",note:"زواج داخلي بالأسرة؛ أم عبد الله بن يَكْوه (محمد) بن محمذن بن احمد ميلود بن شدَّار بن اشفغ الأمين — لم يعقب",spouses:["Y155"],mother:"Y173w1"},
{id:"Y155s1",name:"عبد الله",g:"M",father:"Y155",mother:"Y155w1",note:"لم يعقب"},
{id:"Y157w1",name:"ميمهنه",g:"F",father:"Y127",note:"زواج داخلي بالأسرة؛ أم أبناء زيدن بن يعقوب بن احمد ميلود بن شدَّار بن اشفغ الأمين",spouses:["Y157"],mother:"Y82d1",place:"تنيخلف"},
{id:"Y157s1",name:"محمذن",g:"M",father:"Y157",mother:"Y157w1",note:"لم يعقب"},
{id:"Y157s2",name:"المختار",g:"M",father:"Y157",mother:"Y157w1",note:"لم يعقب"},
{id:"Y157d3",name:"اللو",g:"F",father:"Y157",mother:"Y157w1",note:"أم أبناء محمودن بن محنض باب بن اعبيد بن احمد بن المختار بوي بن يعقوب بن باركلل"},
{id:"Y159w1",name:"آيه (العاليه)",g:"F",father:"Y26",dates:"1307هـ/1890م – 1402هـ/1982م",place:"دليلحو",note:"زواج داخلي بالأسرة؛ أم أبناء محمد بن محمد بن زيدن بن يعقوب بن أحمد ميلود بن شدار بن اشفغ الأمين",spouses:["Y159"],mother:"Y26w1"},
{id:"Y159s1",name:"ببكر",g:"M",father:"Y159",mother:"Y159w1",note:"لم يعقب"},
{id:"Y159d1",name:"مريم السالمه",g:"F",father:"Y159",mother:"Y159w1",place:"تنيخلف",note:"أم عيشو بنت سيد احمد بن سيدنا بن محمذن بن المختار بن الكوري بن حرمه بن المختار بن المعزوز — لم تعقب"},
{id:"Y159d2",name:"ميمهنه",g:"F",father:"Y159",mother:"Y159w1",dates:"…؟… – 1392هـ/1972م",place:"تنيخلف",note:"أم من من أبناء ببكر بن بد (محمد) بن الربا بن بگي (ابوبكر) بن سيد بن حرمه بن المختار بن المعزوز؛ زواج داخلي بالأسرة",spouses:["Y95"]},
{id:"Y159d3",name:"عيشه",g:"F",father:"Y159",mother:"Y159w1",note:"لم تعقب"},
{id:"Y160w1",name:"الچمبت (فاطمه فال)",g:"F",father:"Y38",dates:"1365هـ/1933م – 1435هـ/2014م",place:"دليلحو",note:"زواج داخلي بالأسرة؛ أم النَّاه ومـيَّم (مريم) من أبناء اوفَّا (محمد فال) بن محمد بن محمد بن زيدن بن يعقوب بن احمد ميلود بن شدَّار؛ أم إحيها وعائشة وخدجية من أبناء محمد فال بن ابـيْد (بزيد) بن بييين بن احميّد بن المزضف بن اشفغ مينحنو",spouses:["Y160"],mother:"Y38w1"},
{id:"Y161w1",name:"عائشة",g:"F",father:"XA1082",spouses:["Y161"],ext:true},
{id:"Y161d1",name:"فاطمة",g:"F",father:"Y161",mother:"Y161w1",dates:"1413هـ/1993م –",note:"أم اوفَّا بن احمد بن حامد بن زيدن بن يعقوب بن احمد ميلود بن شدَّار بن اشفغ الأمين"},
{id:"Y161d2",name:"آيه (العاليه)",g:"F",father:"Y161",mother:"Y161w1",dates:"1415هـ/1995م –"},
{id:"Y161s1",name:"احمد",g:"M",father:"Y161",mother:"Y161w1",dates:"1418هـ/1997م –",note:"لم يعقب"},
{id:"Y161s2",name:"محمدن",g:"M",father:"Y161",mother:"Y161w1",dates:"1420هـ/1999م –",note:"لم يعقب"},
{id:"Y161d3",name:"امات",g:"F",father:"Y161",mother:"Y161w1",dates:"1422هـ/2001م –"},
{id:"Y161s3",name:"محمد سالم",g:"M",father:"Y161",mother:"Y161w1",dates:"1430هـ/2009م –",note:"لم يعقب"},
{id:"Y162w1",name:"النَّـنَّه",g:"F",father:"Y51",mother:"Y51w1",dates:"1400هـ/1980م –",note:"زواج داخلي بالأسرة",spouses:["Y162"],fullName:"النَّـنَّه بنت محمد فال بن محمد بن سيد بن حميين (محمد) بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز"},
{id:"Y162d1",name:"عائشة",g:"F",father:"Y162",mother:"Y162w1",dates:"1429هـ/2008م –"},
{id:"Y163w1",name:"زينب الزبيدي -اندنوسيا-",g:"F",father:null,spouses:["Y163"]},
{id:"Y163d1",name:"آيه (العاليه)",g:"F",father:"Y163",mother:"Y163w1",dates:"1429هـ/2008م –"},
{id:"Y164w1",name:"باكه (امباركه)",g:"F",father:"J33",dates:"1402هـ/1982م –",spouses:["Y164"],crossLink:true,mother:"J33w1"},
{id:"Y164d1",name:"رقية",g:"F",father:"Y164",mother:"Y164w1"},
{id:"Y164d2",name:"عيشة",g:"F",father:"Y164",mother:"Y164w1"},
{id:"Y165s1",name:"محمد فال",g:"M",father:"Y165",mother:"Y78w2",dates:"1407هـ/1987م –",note:"لم يعقب"},
{id:"Y165s2",name:"محمد سيد",g:"M",father:"Y165",mother:"Y78w2",dates:"1409هـ/1989م –",note:"لم يعقب"},
{id:"Y165s3",name:"محمد لغظف",g:"M",father:"Y165",mother:"Y78w2",dates:"1410هـ/1990م –",note:"لم يعقب"},
{id:"Y165s4",name:"انَّاه (محمد)",g:"M",father:"Y165",mother:"Y78w2",dates:"1412هـ/1992م –",note:"لم يعقب"},
{id:"Y165s5",name:"شدَّار",g:"M",father:"Y165",mother:"Y78w2",dates:"1415هـ/1995م –",note:"لم يعقب"},
{id:"Y166w1",name:"فاطمة",g:"F",father:"Y161",dates:"1413هـ/1993م –",note:"زواج داخلي بالأسرة",spouses:["Y166"]},
{id:"Y166s1",name:"اوفا (محمد فال)",g:"M",father:"Y166",mother:"Y166w1",dates:"1430هـ/2009م –",note:"لم يعقب"},
{id:"Y167w1",name:"سكينه",g:"F",father:"XA1087",spouses:["Y167"],ext:true},
{id:"Y167s1",name:"محمد سالم",g:"M",father:"Y167",mother:"Y167w1",note:"لم يعقب"},
{id:"Y167d1",name:"اَّماته",g:"F",father:"Y167",mother:"Y167w1",note:"أم مريم السالمه بنت محمذن بن ابنعمر بن محمذن فال بن عبد الله بن شدَّار بن اشفغ الأمين؛ زواج داخلي بالأسرة",spouses:["Y174"]},
{id:"Y167d2",name:"مريم",g:"F",father:"Y167",mother:"Y167w1",note:"أم بعض أبناء سيد عبد الله بن اكويري بن محمد العبد -ارحاحلو-"},
{id:"Y168w2",name:"العاليه",g:"F",father:"P33",mother:"P33w1",spouses:["Y168"]},
{id:"Y168s1",name:"سيد",g:"M",father:"Y168",mother:"Y168w2",note:"لم يعقب"},
{id:"Y169w1",name:"عائشة",g:"F",father:"Z18",dates:"1330هـ/1912م – 1412هـ/1992م",place:"ابري حيبلل",spouses:["Y169"],fullName:"عائشة بنت محمودن بن محمد فال بن اخميطرات بن محمود لله بن ابو الحس بن المزضف",mother:"Z18w2"},
{id:"Y170w1",name:"فاطمة",g:"F",father:"Y124",note:"زواج داخلي بالأسرة؛ أم أبناء سيد الفالي بن شدَّار بن اشفغ الأمين",place:"تينخلف",spouses:["Y170"],mother:"Y124w1"},
{id:"Y170s1",name:"الدرع",g:"M",father:"Y170",mother:"Y170w1",note:"لم يعقب"},
{id:"Y170d1",name:"خديجة",g:"F",father:"Y170",mother:"Y170w1",note:"أم أبناء سيد بن حرمه بن المختار بن المعزوز بن اشفغ الأمين؛ أم اماتو (فاطمة) بنت شدَّار بن المزضف بن شدَّار بن اشفغ الأمين",spouses:["Y82"]},
{id:"Y171w1",name:"فاطمة",g:"F",father:"F134",spouses:["Y171"],crossLink:true},
{id:"Y172w1",name:"فالنه",g:"F",father:"Y8",note:"زواج داخلي بالأسرة",spouses:["Y172"]},
{id:"Y173w1",name:"فالنه",g:"F",father:"G53",spouses:["Y173"],crossLink:true},
{id:"Y174d1",name:"مريم السالمه",g:"F",father:"Y174",mother:"Y167d1",note:"أم عبد الله بن احمد -كنتو-"},
{id:"Y175w1",name:"خدجية",g:"F",father:"Y48",note:"زواج داخلي بالأسرة",spouses:["Y175"],fullName:"خدجية بنت محيين (محمد) بن الجمد (أحمد) بن حرمه بن المختار بن المعزوز بن اشفغ الأمين"},
{id:"Y175d1",name:"فاطمة",g:"F",father:"Y175",mother:"Y175w1",place:"المذرذره",note:"لم تعقب"},
{id:"Y176w1x",name:"مريم",g:"F",father:"K84",note:"أم ام المومنين بنت قطرب بن محنض بن الغالوي بن الفالي بن باب احمد",spouses:["Y176"],crossLink:true,mother:"K84w1"},
{id:"Y177w1",name:"شربظ",g:"F",father:"Y119",note:"زواج داخلي بالأسرة؛ أم سيد الفالي بن ابن المعالي بن محنض بن شدَّار بن اشفغ الأمين",spouses:["Y177"],mother:"Y119w2"},
{id:"Y178w1",name:"فاطمة",g:"F",father:"XA1430",spouses:["Y178"],ext:true},
{id:"Y178d1",name:"السالمه",g:"F",father:"Y178",mother:"Y178w1",note:"لم تعقب"},
{id:"Y179w1",name:"مريم الصغيره",g:"F",father:"Y113",note:"زواج داخلي بالأسرة؛ أم أبناء المختار فال بن سيد الفالي بن ابن المعالي بن محنض بن شدار بن اشفغ الأمين",spouses:["Y179"],mother:"Y113w5"},
{id:"Y179s1",name:"ببكر",g:"M",father:"Y179",mother:"Y179w1",place:"المذرذره",note:"لم يعقب"},
{id:"Y179s2",name:"سيد الفالي",g:"M",father:"Y179",mother:"Y179w1",note:"لم يعقب"},
{id:"Y180w1",name:"خدجية",g:"F",father:"XA1090",spouses:["Y180"],ext:true},
{id:"Y180w2",name:"ميمهنه",g:"F",father:"Y130",mother:"Y188d1",place:"المذرذره",note:"زواج داخلي بالأسرة",spouses:["Y180"]},
{id:"Y181w1",name:"دماه (عايشا)",g:"F",father:"Y95",dates:"1372هـ/1953م –",note:"زواج داخلي بالأسرة",spouses:["Y181"]},
{id:"Y181s1",name:"محمد فال",g:"M",father:"Y181",mother:"Y181w1",dates:"1401هـ/1981م –",note:"لم يعقب"},
{id:"Y182w1",name:"صفيه",g:"F",father:"J33",dates:"1396هـ/1976م –",spouses:["Y182"],crossLink:true,fullName:"صفيه بنت عبد الله بن احمياده بن محمد بن محمذن بن احمد البزي بن آلج (الفالي)",mother:"J33w1"},
{id:"Y182d1",name:"فالنه",g:"F",father:"Y182",mother:"Y182w1",dates:"1433هـ/2012م –"},
{id:"Y182s1",name:"محمد فال",g:"M",father:"Y182",mother:"Y182w1",note:"لم يعقب"},
{id:"Y183w1",name:"سكينه",g:"F",father:"R65s1s1s1s2",spouses:["Y183"]},
{id:"Y183d1",name:"مريم",g:"F",father:"Y183",mother:"Y183w1",dates:"1401هـ/1981م –",note:"أم أبناء بونو بن المختار بن احمد بن المختار السالم بن سيد الفالي بن صالحي بن محمذن بن آبين (محنض بونا)"},
{id:"Y183w2",name:"زينب",g:"F",father:"I15",dates:"1388هـ/1968م –",spouses:["Y183"],crossLink:true,fullName:"زينب بنت احمد سالم بن عبد الله بن ابوبا (ببكر) بن المختار بن سيد احمد بن حبلل بن ابراهيم"},
{id:"Y183d2",name:"منى (فاطمة الزهراء)",g:"F",father:"Y183",mother:"Y183w2",dates:"1417هـ/1996م –"},
{id:"Y183s1",name:"محمد اليدالي",g:"M",father:"Y183",mother:"Y183w2",dates:"1420هـ/1999م –",note:"لم يعقب"},
{id:"Y183s2",name:"محمد فال",g:"M",father:"Y183",mother:"Y183w2",dates:"1423هـ/2002م –",note:"لم يعقب"},
{id:"Y184w1",name:"فاطمه فال",g:"F",father:"XA1091",spouses:["Y184"],ext:true},
{id:"Y184d1",name:"اَّمـي (فاطمة)",g:"F",father:"Y184",mother:"Y184w1",note:"أم أبناء محمد بن احمد سالم بن مالده -اهل آكمتار-"},
{id:"Y185w1",name:"ياميام (مريم)",g:"F",father:"XA495",note:"أم بعض أبناء حارود بن ميلود",spouses:["Y185"],ext:true},
{id:"Y185d1",name:"فالنه",g:"F",father:"Y185",mother:"Y185w1",note:"أم المصطفى بن محنض بن عبيد -؟-"},
{id:"Y186w1",name:"ياته",g:"F",father:"XA1035",note:"لها عيال في اداشفاغو",spouses:["Y186"],ext:true},
{id:"Y187w1",name:"مريم",g:"F",father:"Y138",note:"زواج داخلي بالأسرة؛ أم احمد بن محمذن بن حبلل بن المزضف بن شدَّار بن اشفغ الأمين",spouses:["Y187"],mother:"Y138w1"},
{id:"Y187w2",name:"فالنه",g:"F",father:"XA1092",spouses:["Y187"],ext:true},
{id:"Y187s1",name:"احماده",g:"M",father:"Y187",mother:"Y187w2",note:"لم يعقب"},
{id:"Y188w2",name:"فاطمة",g:"F",father:"Y54",note:"زواج داخلي بالأسرة؛ أم محمذن وببكر ومريم من أبناء احمد بن محمذن بن حبلل بن المزضف بن شدَّار بن اشفغ الأمين",spouses:["Y188"],mother:"Y54w2"},
{id:"Y188d1",name:"مريم",g:"F",father:"Y188",mother:"Y188w2",place:"المذرذره",note:"أم بنات ببكر بن ابيا بن ولد محمذن بن ابن الحسين بن عبدي بن باب الدين بن اشفغ الأمين؛ أم محمد عبد الرحمن بن الشيخ محمذن بن سيد احمد بن بگي (ابوبكر) بن سيد بن حرمه بن المختار — لم يعقب؛ زواج داخلي بالأسرة؛ أم بنات ببكر بن ابًا بن محمذن بن ابن الحسين بن عبدي بن باب الدين بن اشفغ الأمين؛ زواج داخلي بالأسرة",spouses:["Y86","Y130"]},
{id:"Y188d2",name:"فاطمه",g:"F",father:"Y188",mother:"Y188w1",place:"ابري حيبلل",note:"أم احمد باب واتَّيهي ومريم العاليو من أبناء سيد الفالي بن الأمين بن صالحي بن محمذن بن آبَّـين (محنض بونا)"},
{id:"Y189d1",name:"فاطمة",g:"F",father:"Y189",mother:"Y34d1",note:"لم تعقب"},
{id:"Y189d2",name:"اللو (العاليه)",g:"F",father:"Y189",mother:"Y34d1",dates:"…؟… – 1411هـ/1991م",place:"ابري حيبلل",note:"لم تعقب"},
{id:"Y190w1",name:"فالنه -اهل مولاي الزين-",g:"F",father:null,spouses:["Y190"]},
{id:"Y190d1",name:"مريم",g:"F",father:"Y190",mother:"Y190w1",note:"أم خدجية -سنغال-"},
{id:"Y191w1",name:"فالنه -سنغال-",g:"F",father:null,spouses:["Y191"]},
{id:"Y191s1",name:"محمذن",g:"M",father:"Y191",mother:"Y191w1",note:"لم يعقب"},
{id:"Y191s2",name:"مولاي",g:"M",father:"Y191",mother:"Y191w1",note:"لم يعقب"},
{id:"Y191s3",name:"المصطفى",g:"M",father:"Y191",mother:"Y191w1",note:"لم يعقب"},
{id:"Y191d1",name:"اندي",g:"F",father:"Y191",mother:"Y191w1"},
{id:"Y191d2",name:"مريم",g:"F",father:"Y191",mother:"Y191w1"},
{id:"Y191w2",name:"فالنه -سنغال-",g:"F",father:null,spouses:["Y191"]},
{id:"Y191s4",name:"فلان",g:"M",father:"Y191",mother:"Y191w2",note:"لم يعقب"},
{id:"Y191s5",name:"فلان",g:"M",father:"Y191",mother:"Y191w2",note:"لم يعقب"},
{id:"Y193w1",name:"فالنه",g:"F",father:"Y136",note:"زواج داخلي بالأسرة",spouses:["Y193"]},
{id:"Y193s1",name:"محمذن",g:"M",father:"Y193",mother:"Y193w1",note:"لم يعقب"},
{id:"Y194w1",name:"غادجيه",g:"F",father:"D46s2s2s1",mother:"I62d1",spouses:["Y194"]},
{id:"Y194d1",name:"فالنه",g:"F",father:"Y194",mother:"Y194w1",note:"أم ابني يعقوب بن احمد ميلود بن شدَّار بن اشفغ الأمين؛ زواج داخلي بالأسرة",fullName:"فالنه بنت ياحممذ بن شدَّار بن اشفغ الأمين",spouses:["Y156"]},
{id:"Y194w2",name:"صفيه",g:"F",father:"XA495",spouses:["Y194"],ext:true},
{id:"Y195w1",name:"امة الله",g:"F",father:"Y176",note:"زواج داخلي بالأسرة؛ أم محمذن بن عبد الله بن ياحممذ بن شدَّار بن اشفغ الأمين",spouses:["Y195"],mother:"Y176w1x"},
{id:"Y195s1",name:"محمذن",g:"M",father:"Y195",mother:"Y195w1",note:"لم يعقب"},
{id:"Y196w1",name:"امتنا",g:"F",father:"Y112",note:"زواج داخلي بالأسرة",spouses:["Y196"]},
{id:"Y196s1",name:"احمد",g:"M",father:"Y196",mother:"Y196w1",note:"لم يعقب"},
{id:"Y196d1",name:"سالما",g:"F",father:"Y196",mother:"Y196w1",note:"أم محمذن بن امبريك بن محمد لدخن بن احمد ميلود بن شدَّار بن اشفغ الأمين — لم يعقب"},
{id:"Y196d2",name:"امة",g:"F",father:"Y196",mother:"Y196w1",note:"أم سادلا وشقيقتيها بنات شنكيطا بن المختار بن محمد بن اشفغ مينحنو"},
{id:"Z3w2",name:"عيشان",g:"F",father:"XA434",spouses:["Z3"],ext:true},
{id:"Z3d4",name:"فلانة",g:"F",father:"Z3",mother:"Z3w1",note:"أم أبناء الأمين بن صباره (المختار) بن باب أحمد",spouses:["D46s3s3"]},
{id:"Z3d5",name:"فلانة",g:"F",father:"Z3",mother:"Z3w1",note:"أم أبناء محمذن بن سيد (المختار) بن عبد الله",spouses:["D86"]},
{id:"Z3d6",name:"مريم",g:"F",father:"Z3",mother:"Z3w1",note:"أم بوزه من أبناء عركاب (حمم) بن ابوبا (الأمين) بن ماه؛ أم ام الحسين وباباي ومنت اجدود وامنيو من أبناء حامدت بن اشفغ عبد الله بن اعمر يزكئذن بن محنضلل بن اعمر اديقب"},
{id:"Z3d7",name:"امباركه",g:"F",father:"Z3",mother:"Z3w2",note:"أم صالحي وعبد المعطي ومرحبا من أبناء محمذن بن آبين (محنض بونا)",spouses:["R65s1"]},
{id:"Z4d1",name:"آسيه",g:"F",father:"Z4",mother:"Z4w1",note:"أم سيدنا وخيرا ابني الأمينا بن الفالي بن الكريم بن أحمد شلل (بوميجو)"},
{id:"Z4d2",name:"فلانة",g:"F",father:"Z4",mother:"Z4w1",note:"أم أبناء أحمد الولي -؟-"},
{id:"Z4d3",name:"فلانة",g:"F",father:"Z4",mother:"Z4w1",note:"أم فلان بن الأمين بن صباره -؟-"},
{id:"Z5s1",name:"أحمد",g:"M",father:"Z5",mother:"R2d1",note:"لم يعقب"},
{id:"Z6d1",name:"فلانة",g:"F",father:"Z6",mother:"Z6w1",note:"لم تعقب"},
{id:"Z6d2",name:"فلانة",g:"F",father:"Z6",mother:"Z6w1",note:"لم تعقب"},
{id:"Z6d3",name:"فلانة",g:"F",father:"Z6",mother:"Z6w1",note:"لم تعقب"},
{id:"G83s1",name:"بييين *",g:"M",father:"G83",src:1},
{id:"D46s1",name:"حيب الله *",g:"M",father:"D46",src:1},
{id:"D46s1s1",name:"أحمد *",g:"M",father:"D46s1",src:1},
{id:"F43",para:43,name:"محمذن",g:"M",father:"F30",spouses:["F43w1","F43w2","F43w3"]},
{id:"F44s1",name:"أمين *",g:"M",father:"F44",src:1},
{id:"XA19",name:"السيد *",g:"M",father:"V7",src:1},
{id:"D46s2",name:"الفالي *",g:"M",father:"D46",src:1},
{id:"D46s2s1",name:"الغالوي *",g:"M",father:"D46s2",src:1},
{id:"XA31",name:"قطرب *",g:"M",father:"XA758",src:1,spouses:["I2d5"]},
{id:"XA32",name:"المختار *",g:"M",father:"XA31",mother:"I2d5",src:1},
{id:"Z70",para:70,name:"الأمين",g:"M",father:"Z19",place:"اعكيلت الوزغو",spouses:["Z70w1","Z70w2","Z70w3","Z70w4","Z70w5"],mother:"Z19w1"},
{id:"K90s1",name:"أحمد طابا *",g:"M",father:"K90",src:1},
{id:"K90s1s1",name:"الب *",g:"M",father:"K90s1",src:1},
{id:"D6s1",name:"عبد الله *",g:"M",father:"D6",src:1},
{id:"D46s2s1s1",name:"الناسك *",g:"M",father:"D46s2s1",src:1},
{id:"D46s2s1s1s1",name:"بيدح *",g:"M",father:"D46s2s1s1",src:1},
{id:"D46s2s1s1s1s1",name:"المختار *",g:"M",father:"D46s2s1s1s1",src:1},
{id:"Y30s1",name:"محيين *",g:"M",father:"Y30",src:1},
{id:"Y30s1s1",name:"الكوري *",g:"M",father:"Y30s1",src:1},
{id:"K140s5",name:"الخليفه *",g:"M",father:"K140",src:1},
{id:"G84s1",name:"سيد أحمد *",g:"M",father:"G84",src:1},
{id:"D46s3",name:"صباره (المختار) *",g:"M",father:"D46",src:1},
{id:"D46s3s1",name:"أحمد *",g:"M",father:"D46s3",src:1},
{id:"I27s1s1s1",name:"محد *",g:"M",father:"I30",src:1},
{id:"R65s1s1",name:"صالحي *",g:"M",father:"R65s1",mother:"Z3d7",src:1},
{id:"R65s1s1s1",name:"سيد الفالي *",g:"M",father:"R65s1s1",src:1},
{id:"R65s1s1s1s1",name:"المختار السالم *",g:"M",father:"R65s1s1s1",src:1},
{id:"R65s1s1s1s1s1",name:"أحمد *",g:"M",father:"R65s1s1s1s1",src:1},
{id:"Z44s1",name:"ممّن (محمذين) *",g:"M",father:"Z44",src:1},
{id:"M5s1",name:"المداح *",g:"M",father:"M5",src:1},
{id:"M5s1s1",name:"المختار *",g:"M",father:"M5s1",src:1},
{id:"M5s1s1s1",name:"محمد سعيد *",g:"M",father:"M5s1s1",src:1},
{id:"G83s2s1",name:"سيد الفالي *",g:"M",father:"G83s1",src:1},
{id:"Y30s1s2",name:"سيد *",g:"M",father:"Y30s1",src:1},
{id:"Y30s1s2s1",name:"محمد *",g:"M",father:"Y30s1s2",src:1},
{id:"D62s1",name:"المصطفى *",g:"M",father:"D62",src:1},
{id:"E1s1",name:"الفالي *",g:"M",father:"E1",src:1},
{id:"E1s1s1",name:"النجيب *",g:"M",father:"E1s1",src:1},
{id:"E31s2",name:"ولد أحمد *",g:"M",father:"E31",src:1},
{id:"E31s2s1",name:"مدال *",g:"M",father:"E31s2",src:1},
{id:"R45s1s1",name:"محمد الهدى *",g:"M",father:"R45s1",src:1},
{id:"R45s1s1s1",name:"ميلودنا *",g:"M",father:"R45s1s1",src:1},
{id:"I6s2",name:"الهلال *",g:"M",father:"I6",src:1},
{id:"D46s2s1s2",name:"الفكيكي *",g:"M",father:"D46s2s1",src:1},
{id:"D46s2s1s2s1",name:"اعديج *",g:"M",father:"D46s2s1s2",src:1},
{id:"D46s2s1s2s1s1",name:"أحمد فال *",g:"M",father:"D46s2s1s2s1",src:1},
{id:"D46s2s1s2s1s1s1",name:"أحمد محمود *",g:"M",father:"D46s2s1s2s1s1",src:1},
{id:"Y78",para:78,name:"محمد فال",g:"M",father:"Y77",dates:"1341هـ/1923م – 1425هـ/2004م",place:"احسي السعاده",spouses:["Y78w1","Y78w2","Y78w3","Y78w4","Y78w5","S73d4","Y147d1"]},
{id:"Y70s1",name:"مختّيري *",g:"M",father:"Y70",src:1},
{id:"Y70s1s1",name:"ببكر *",g:"M",father:"Y70s1",src:1},
{id:"F11s1",name:"مكدر (المختار) *",g:"M",father:"F11",src:1},
{id:"F11s1s1",name:"محمد *",g:"M",father:"F11s1",src:1},
{id:"F11s1s1s1",name:"اَّلات (محمذنات) *",g:"M",father:"F11s1s1",src:1},
{id:"XA164",name:"أحمد محمود *",g:"M",father:"XA31",mother:"I2d5",src:1},
{id:"XA165",name:"ابن مسعودن *",g:"M",father:"XA164",src:1},
{id:"F9s1",name:"المختار سعيد *",g:"M",father:"F9",src:1},
{id:"F9s1s1",name:"الحسن *",g:"M",father:"F9s1",src:1},
{id:"M5s2",name:"أحمد سالم *",g:"M",father:"M5",src:1},
{id:"M5s2s1",name:"عبد *",g:"M",father:"M5s2",src:1},
{id:"D46s3s2",name:"محنض *",g:"M",father:"D46s3",src:1,spouses:["G1d1"]},
{id:"D46s3s2s1",name:"احممد الأمين *",g:"M",father:"D46s3s2",mother:"G1d1",src:1},
{id:"R45s1s1s2",name:"امحيد *",g:"M",father:"R45s1s1",src:1},
{id:"R45s1s1s2s1",name:"محمذن *",g:"M",father:"R45s1s1s2",src:1},
{id:"R45s1s1s2s1s1",name:"عبدك *",g:"M",father:"R45s1s1s2s1",src:1},
{id:"G104s1",name:"اسالمو *",g:"M",father:"G104",src:1},
{id:"G104s1s1",name:"محمد سالم *",g:"M",father:"G104s1",src:1},
{id:"G11s3",name:"اسلم *",g:"M",father:"G11",src:1},
{id:"Y136s1",name:"أحمد *",g:"M",father:"Y136",src:1},
{id:"XA206",name:"أحمد *",g:"M",father:"XA32",src:1},
{id:"XA207",name:"محمذن باب *",g:"M",father:"XA165",src:1},
{id:"D46s2s1s2s2",name:"المامون *",g:"M",father:"D46s2s1s2",src:1,spouses:["L3d1"]},
{id:"D46s2s1s2s2s1",name:"المختار السالم *",g:"M",father:"D46s2s1s2s2",mother:"L3d1",src:1},
{id:"D46s2s1s2s2s1s1",name:"محمودن *",g:"M",father:"D46s2s1s2s2s1",src:1},
{id:"D46s2s1s2s2s1s1s1",name:"حبيب الرحمن *",g:"M",father:"D46s2s1s2s2s1s1",src:1},
{id:"G42s2s1",name:"المختار *",g:"M",father:"G42s2",src:1},
{id:"Y121s1",name:"محمذن *",g:"M",father:"Y121",src:1},
{id:"Y121s1s1",name:"باري *",g:"M",father:"Y121s1",src:1},
{id:"XA223",name:"المختار السالم *",g:"M",father:"H2",src:1},
{id:"M5s3",name:"مولود *",g:"M",father:"M5",src:1},
{id:"XA228",name:"حيب الله *",g:"M",father:"XA530",src:1},
{id:"XA229",name:"سيد احمد *",g:"M",father:"XA228",src:1},
{id:"XA230",name:"عبد الرحمن *",g:"M",father:"XA229",src:1},
{id:"XA231",name:"ببا *",g:"M",father:"XA230",src:1},
{id:"D61s1",name:"احمد باب *",g:"M",father:"D61",mother:"Y1d4",src:1},
{id:"D61s1s1",name:"عالي *",g:"M",father:"D61s1",src:1},
{id:"D61s1s1s1",name:"احمد باب *",g:"M",father:"D61s1s1",src:1},
{id:"XA242",name:"ولد محمد *",g:"M",father:"V24",src:1},
{id:"XA243",name:"الطلبه *",g:"M",father:"XA242",src:1},
{id:"S34s2",name:"السالم *",g:"M",father:"S34",src:1},
{id:"S46s1",name:"محمد المصطفى *",g:"M",father:"S46",src:1},
{id:"S46s1s1",name:"ببود (محمد محمود) *",g:"M",father:"S46s1",src:1},
{id:"E50s1",name:"سيد المختار *",g:"M",father:"E50",src:1},
{id:"D47s1",name:"ببكر *",g:"M",father:"D47",src:1},
{id:"E1s1s2",name:"المختار *",g:"M",father:"E1s1",src:1},
{id:"E1s1s2s1",name:"حبب *",g:"M",father:"E1s1s2",src:1},
{id:"D76s1",name:"العيدي *",g:"M",father:"D76",src:1},
{id:"D76s1s1",name:"امحذ *",g:"M",father:"D76s1",src:1},
{id:"D47s2",name:"بتاجه *",g:"M",father:"D47",src:1},
{id:"P6s1",name:"أمّن (محمذن) *",g:"M",father:"P6",src:1},
{id:"P6s1s1",name:"ابو (محمد) *",g:"M",father:"P6s1",src:1},
{id:"P6s1s1s1",name:"هيدي (سيدي) *",g:"M",father:"P6s1s1",src:1},
{id:"Y111s1",name:"جد ام *",g:"M",father:"Y111",src:1},
{id:"Y111s1s1",name:"محمد فال *",g:"M",father:"Y111s1",src:1},
{id:"XA277",name:"الكوري *",g:"M",father:"XA31",mother:"I2d5",src:1},
{id:"XA278",name:"عباس *",g:"M",father:"XA277",src:1},
{id:"XA279",name:"سيد احمد *",g:"M",father:"XA278",src:1},
{id:"Y142s1",name:"محمد سهل وعلي *",g:"M",father:"Y142",src:1},
{id:"Y142s1s1",name:"محمذن *",g:"M",father:"Y142s1",src:1},
{id:"Y142s1s1s1",name:"سيد *",g:"M",father:"Y142s1s1",src:1},
{id:"Y80",para:80,name:"اميد",g:"M",father:"Y77",dates:"1349هـ/1931م – 1416هـ/1996م",place:"احسي السعاده",spouses:["Y80w1"]},
{id:"G56s1",name:"المصطفى *",g:"M",father:"G56",src:1},
{id:"G56s1s1",name:"احميد *",g:"M",father:"G56s1",src:1},
{id:"G56s1s1s1",name:"بييين *",g:"M",father:"G56s1s1",src:1},
{id:"G56s1s1s1s1",name:"وال ِّيل (سيد الفالي) *",g:"M",father:"G56s1s1s1",src:1},
{id:"Y196",para:196,name:"شدَّار",g:"M",father:"Y194",spouses:["Y196w1"]},
{id:"Y148s1",name:"يعقوب *",g:"M",father:"Y148",src:1},
{id:"Y148s1s1",name:"سيد الفالي *",g:"M",father:"Y148s1",src:1},
{id:"R65s1s1s1s2",name:"الولي *",g:"M",father:"R65s1s1s1",src:1},
{id:"D46s2s2",name:"احمد الورع *",g:"M",father:"D46s2",src:1},
{id:"D46s2s2s1",name:"اعديج *",g:"M",father:"D46s2s2",src:1,spouses:["I62d1"]},
{id:"XA310",name:"الهبنضام *",g:"M",father:null,ext:true,src:1},
{id:"XA311",name:"ابيال *",g:"M",father:"XA310",ext:true,src:1},
{id:"XA312",name:"عامر *",g:"M",father:"XA311",ext:true,src:1},
{id:"XA313",name:"يعقوب *",g:"M",father:"XA312",ext:true,src:1},
{id:"XA314",name:"أحمد بزيد *",g:"M",father:"XA313",ext:true,src:1},
{id:"XA316",name:"عبد المجيد *",g:"M",father:"XA503",ext:true,src:1},
{id:"XA318",name:"أحمد *",g:"M",father:"XA865",ext:true,src:1},
{id:"XA319",name:"بكار *",g:"M",father:null,ext:true,src:1},
{id:"XA320",name:"حمم *",g:"M",father:"XA319",ext:true,src:1},
{id:"XA322",name:"امبا *",g:"M",father:"XA323",ext:true,src:1},
{id:"XA323",name:"أحمد *",g:"M",father:null,ext:true,tribe:"أولاد اخطيه",src:1},
{id:"XA324",name:"خونا (تندغه) *",g:"M",father:null,ext:true,src:1},
{id:"XA325",name:"بوسالف (أولاد أحمد) *",g:"M",father:null,ext:true,src:1},
{id:"XA327",name:"امحاده *",g:"M",father:"XA323",ext:true,src:1},
{id:"XA332",name:"أحمد *",g:"M",father:"XA900",ext:true,src:1},
{id:"XA333",name:"ايدوم *",g:"M",father:"XA332",ext:true,src:1},
{id:"XA334",name:"الفاظل *",g:"M",father:"XA333",ext:true,src:1},
{id:"XA335",name:"بوضويلك *",g:"M",father:null,ext:true,tribe:"ارحاحلو",src:1},
{id:"XA336",name:"هنون *",g:"M",father:null,ext:true,tribe:"إلى اسويد أحمد",src:1},
{id:"XA337",name:"لمعدل *",g:"M",father:null,ext:true,src:1},
{id:"XA339",name:"أحمد *",g:"M",father:"XA503",ext:true,src:1},
{id:"XA340",name:"الأمين *",g:"M",father:"XA339",ext:true,src:1},
{id:"Z82s1",name:"اليدالي *",g:"M",father:"Z82",ext:true,src:1},
{id:"Z82s1s1",name:"محمدن *",g:"M",father:"Z82s1",ext:true,src:1},
{id:"XA344",name:"جلور *",g:"M",father:null,ext:true,src:1},
{id:"XA345",name:"علي *",g:"M",father:"XA344",ext:true,src:1},
{id:"XA346",name:"ببا *",g:"M",father:null,ext:true,src:1},
{id:"XA347",name:"ابني *",g:"M",father:"XA346",ext:true,src:1},
{id:"XA348",name:"اباه *",g:"M",father:null,ext:true,src:1},
{id:"XA349",name:"الراجل *",g:"M",father:"XA348",ext:true,src:1},
{id:"XA350",name:"يحيا *",g:"M",father:null,ext:true,tribe:"أولاد بوميجو",src:1},
{id:"XA351",name:"سيد المختار *",g:"M",father:"XA350",ext:true,src:1},
{id:"XA354",name:"عبدلل *",g:"M",father:"XA882",ext:true,src:1},
{id:"XA355",name:"باين *",g:"M",father:"XA354",ext:true,src:1},
{id:"XA356",name:"محمذن *",g:"M",father:"XA355",ext:true,src:1},
{id:"XA357",name:"باب *",g:"M",father:"XA356",ext:true,src:1},
{id:"XA358",name:"محمدن *",g:"M",father:"XA357",ext:true,src:1},
{id:"XA359",name:"سيد *",g:"M",father:"XA358",ext:true,src:1},
{id:"XA360",name:"باين *",g:"M",father:null,ext:true,src:1},
{id:"XA361",name:"محمذن *",g:"M",father:"XA360",ext:true,src:1},
{id:"XA365",name:"الدامي *",g:"M",father:null,ext:true,tribe:"إلى آكمتار",src:1},
{id:"XA366",name:"عمي اعدجيو *",g:"M",father:null,ext:true,src:1},
{id:"XA367",name:"حندي *",g:"M",father:"XA366",ext:true,src:1},
{id:"XA368",name:"يافاظل *",g:"M",father:"XA367",ext:true,src:1},
{id:"XA370",name:"الماح *",g:"M",father:"XA1248",ext:true,src:1},
{id:"XA371",name:"محمذن *",g:"M",father:"XA370",ext:true,src:1},
{id:"XA372",name:"خليد *",g:"M",father:"XA371",ext:true,src:1},
{id:"XA373",name:"ابياج *",g:"M",father:null,ext:true,src:1},
{id:"XA375",name:"حبيب *",g:"M",father:null,ext:true,tribe:"ادكبهين",src:1},
{id:"XA376",name:"المصطفى *",g:"M",father:"XA375",ext:true,src:1},
{id:"XA378",name:"أحممد الأمين *",g:"M",father:"XA900",ext:true,src:1},
{id:"XA379",name:"اطفيل *",g:"M",father:null,ext:true,src:1},
{id:"XA380",name:"الماما *",g:"M",father:null,ext:true,src:1},
{id:"XA381",name:"الأمين *",g:"M",father:"XA380",ext:true,src:1},
{id:"XA382",name:"محمذن *",g:"M",father:"XA381",ext:true,src:1},
{id:"XA383",name:"ايب *",g:"M",father:"XA382",ext:true,src:1},
{id:"XA384",name:"اكي (الكوري) *",g:"M",father:"XA383",ext:true,src:1},
{id:"XA385",name:"المختار *",g:"M",father:"XA384",ext:true,src:1},
{id:"XA387",name:"عبد *",g:"M",father:null,ext:true,tribe:"ادوعلي",src:1},
{id:"XA388",name:"الخلف *",g:"M",father:null,ext:true,src:1},
{id:"XA389",name:"فالن *",g:"M",father:"XA388",ext:true,src:1},
{id:"XA390",name:"محمد فال *",g:"M",father:"XA339",ext:true,src:1,spouses:["I52d4"]},
{id:"XA391",name:"محدن *",g:"M",father:"XA390",mother:"I52d4",ext:true,src:1},
{id:"XA392",name:"أحمد *",g:"M",father:"XA391",ext:true,src:1},
{id:"XA393",name:"أحمد *",g:"M",father:"XA392",ext:true,src:1},
{id:"XA394",name:"بتاح *",g:"M",father:null,ext:true,tribe:"إلى الحاج",src:1},
{id:"XA395",name:"لفظل *",g:"M",father:"XA394",ext:true,src:1},
{id:"XA396",name:"لوليد *",g:"M",father:null,ext:true,tribe:"أطالبني",src:1},
{id:"XA397",name:"اواه *",g:"M",father:"XA396",ext:true,src:1},
{id:"XA399",name:"باركلل *",g:"M",father:"XA323",ext:true,src:1},
{id:"XA400",name:"مسكو *",g:"M",father:"XA399",ext:true,src:1},
{id:"XA401",name:"الخراشي *",g:"M",father:"XA400",ext:true,src:1},
{id:"XA402",name:"أحمد خرشي *",g:"M",father:"XA401",ext:true,src:1,spouses:["Y118d3"]},
{id:"XA403",name:"العتيق *",g:"M",father:"XA402",mother:"Y118d3",ext:true,src:1},
{id:"XA404",name:"أحمد باب *",g:"M",father:"XA403",ext:true,src:1},
{id:"XA406",name:"المختار *",g:"M",father:"XA657",ext:true,src:1},
{id:"XA407",name:"الطلبه *",g:"M",father:null,ext:true,tribe:"اديقب",src:1},
{id:"XA408",name:"عبد الرحمن *",g:"M",father:"XA407",ext:true,src:1},
{id:"XA409",name:"مسّ *",g:"M",father:null,ext:true,src:1},
{id:"XA410",name:"بريوك *",g:"M",father:null,ext:true,src:1},
{id:"XA411",name:"فوديا الأكبر *",g:"M",father:null,ext:true,tribe:"تندغو",src:1},
{id:"XA412",name:"اعمر اكدبيج *",g:"M",father:"XA411",ext:true,src:1},
{id:"XA413",name:"يقبنلل *",g:"M",father:null,ext:true,src:1},
{id:"XA414",name:"باركلل *",g:"M",father:"XA413",ext:true,src:1},
{id:"XA416",name:"اشفغ اوبك *",g:"M",father:"XA900",ext:true,src:1},
{id:"XA417",name:"يعقوب *",g:"M",father:null,ext:true,src:1},
{id:"XA418",name:"المختار العم *",g:"M",father:"XA417",ext:true,src:1},
{id:"XA419",name:"يعقوب *",g:"M",father:"XA418",ext:true,src:1},
{id:"XA421",name:"يدهننض *",g:"M",father:null,ext:true,src:1},
{id:"XA422",name:"يعقوب *",g:"M",father:"XA421",ext:true,src:1},
{id:"XA423",name:"اشفغ ايتشمذن (أحمد) *",g:"M",father:"XA422",ext:true,src:1},
{id:"XA424",name:"اشفغ المختار *",g:"M",father:"XA423",ext:true,src:1},
{id:"XA425",name:"الطالب اجود *",g:"M",father:null,ext:true,src:1},
{id:"XA426",name:"الفالي *",g:"M",father:"XA414",ext:true,src:1},
{id:"XA427",name:"محنض اشفغ *",g:"M",father:"XA426",ext:true,src:1},
{id:"XA428",name:"أحمد سالم *",g:"M",father:"XA427",ext:true,src:1},
{id:"XA430",name:"سكان *",g:"M",father:null,ext:true,src:1},
{id:"XA432",name:"شّ آمن *",g:"M",father:null,ext:true,src:1},
{id:"XA433",name:"انبط شيّف *",g:"M",father:null,ext:true,tribe:"أولاد رزك",src:1},
{id:"XA434",name:"باني *",g:"M",father:null,ext:true,src:1},
{id:"XA435",name:"ختريوه *",g:"M",father:null,ext:true,src:1},
{id:"XA436",name:"الديّ *",g:"M",father:null,ext:true,src:1},
{id:"XA438",name:"المبارك *",g:"M",father:"XA380",ext:true,src:1},
{id:"XA439",name:"الفالي *",g:"M",father:"XA438",ext:true,src:1},
{id:"XA444",name:"اسنيكلي *",g:"M",father:null,ext:true,src:1},
{id:"XA446",name:"سحنون *",g:"M",father:null,ext:true,tribe:"اهل سيد محمود",src:1},
{id:"XA447",name:"حلبوس *",g:"M",father:null,ext:true,tribe:"جتكانت",src:1},
{id:"XA448",name:"اتاه (المختار) *",g:"M",father:"XA339",ext:true,src:1},
{id:"XA449",name:"سيد *",g:"M",father:"XA448",ext:true,src:1},
{id:"XA450",name:"محدن *",g:"M",father:"XA449",ext:true,src:1},
{id:"XA451",name:"آشاه *",g:"M",father:null,ext:true,tribe:"جتكانت",src:1},
{id:"XA452",name:"الشيخ *",g:"M",father:"XA451",ext:true,src:1},
{id:"XA453",name:"اكب *",g:"M",father:null,ext:true,tribe:"ادابلحسن",src:1},
{id:"XA454",name:"يسلم *",g:"M",father:"XA453",ext:true,src:1},
{id:"XA457",name:"حمت *",g:"M",father:null,ext:true,tribe:"ادودنيقب",src:1},
{id:"XA458",name:"المختار *",g:"M",father:"XA457",ext:true,src:1},
{id:"XA459",name:"محمد فال *",g:"M",father:"XA458",ext:true,src:1},
{id:"XA460",name:"محمودن *",g:"M",father:"XA459",ext:true,src:1},
{id:"XA461",name:"محمد الشيخ *",g:"M",father:"XA460",ext:true,src:1},
{id:"XA462",name:"ايب *",g:"M",father:null,ext:true,tribe:"ادودنيقب",src:1},
{id:"XA463",name:"أحمد سالم *",g:"M",father:"XA462",ext:true,src:1},
{id:"XA464",name:"يلول *",g:"M",father:null,ext:true,src:1},
{id:"XA465",name:"بوب *",g:"M",father:null,ext:true,src:1,tribe:"ادغبسرين"},
{id:"XA467",name:"أحممد *",g:"M",father:"XA354",ext:true,src:1},
{id:"XA468",name:"البيتوره (زين العابدين) *",g:"M",father:"XA467",ext:true,src:1},
{id:"XA472",name:"بباه (المصطفى) *",g:"M",father:"XA900",ext:true,src:1},
{id:"XA473",name:"سعيد *",g:"M",father:"XA472",ext:true,src:1},
{id:"XA474",name:"محمد اليدالي *",g:"M",father:"XA473",ext:true,src:1},
{id:"XA475",name:"المختار اكدعثمان *",g:"M",father:null,ext:true,src:1},
{id:"XA477",name:"المصطفى *",g:"M",father:"XA786",ext:true,src:1,spouses:["M1d4"]},
{id:"XA478",name:"المختار *",g:"M",father:"XA477",ext:true,src:1},
{id:"XA479",name:"الحريري *",g:"M",father:"XA478",ext:true,src:1},
{id:"XA480",name:"والد *",g:"M",father:"XA479",ext:true,src:1},
{id:"XA481",name:"أحمذ *",g:"M",father:"XA480",ext:true,src:1},
{id:"XA482",name:"الزبير *",g:"M",father:null,ext:true,tribe:"اتواجني",src:1},
{id:"XA483",name:"السالك *",g:"M",father:null,ext:true,tribe:"ادوعلي",src:1},
{id:"XA484",name:"امرابط مكو *",g:"M",father:null,ext:true,src:1},
{id:"XA485",name:"محنضنلل *",g:"M",father:"XA484",ext:true,src:1},
{id:"XA486",name:"ابي موسى *",g:"M",father:null,ext:true,src:1},
{id:"XA487",name:"محنض *",g:"M",father:"XA486",ext:true,src:1},
{id:"XA488",name:"أحمد شلل *",g:"M",father:"XA487",ext:true,src:1,spouses:["D1d1"]},
{id:"XA489",name:"معدر (المختار) *",g:"M",father:"XA488",mother:"D1d1",ext:true,src:1},
{id:"XA491",name:"حمم سعيد *",g:"M",father:null,ext:true,src:1},
{id:"XA492",name:"المختار *",g:"M",father:"XA491",ext:true,src:1},
{id:"XA493",name:"الفالي *",g:"M",father:"XA492",ext:true,src:1,spouses:["G100d1"]},
{id:"XA494",name:"اكرديش *",g:"M",father:null,ext:true,tribe:"اديقب",src:1},
{id:"XA495",name:"محمد اليدالي *",g:"M",father:"XA492",ext:true,src:1,spouses:["I1d2","F1d1"]},
{id:"XA496",name:"المختار سعيد *",g:"M",father:"XA495",ext:true,src:1,spouses:["L2d3"]},
{id:"XA497",name:"محمذن فال *",g:"M",father:"XA496",mother:"L2d3",ext:true,src:1},
{id:"XA498",name:"ابابك *",g:"M",father:null,ext:true,src:1},
{id:"XA500",name:"محدي *",g:"M",father:null,ext:true,tribe:"تياب إلى عتام",src:1},
{id:"XA501",name:"سيد *",g:"M",father:"XA500",ext:true,src:1},
{id:"XA502",name:"أحمد *",g:"M",father:"XA501",ext:true,src:1},
{id:"XA503",name:"محمد *",g:"M",father:null,ext:true,tribe:"أولاد بسبع",src:1},
{id:"XA504",name:"الفالي *",g:"M",father:null,ext:true,tribe:"أولاد ابيريي",src:1},
{id:"XA505",name:"أحمد *",g:"M",father:"XA504",ext:true,src:1},
{id:"XA506",name:"عبد الفتاح *",g:"M",father:"XA505",ext:true,src:1},
{id:"XA507",name:"محمد محمود *",g:"M",father:"XA506",ext:true,src:1},
{id:"XA510",name:"المختار *",g:"M",father:"XA375",ext:true,src:1},
{id:"XA511",name:"أحمد بويا *",g:"M",father:"XA510",ext:true,src:1},
{id:"XA512",name:"السعد *",g:"M",father:"XA511",ext:true,src:1},
{id:"XA513",name:"محمد *",g:"M",father:"XA512",ext:true,src:1},
{id:"XA514",name:"المختار السالم *",g:"M",father:"XA513",ext:true,src:1},
{id:"XA516",name:"المختار *",g:"M",father:"XA900",ext:true,src:1},
{id:"XA517",name:"محمد سعيد *",g:"M",father:"XA516",ext:true,src:1},
{id:"XA518",name:"انلل *",g:"M",father:null,ext:true,src:1},
{id:"XA521",name:"اكمجي *",g:"M",father:null,ext:true,tribe:"إلى بوفلان",src:1},
{id:"XA522",name:"محنض *",g:"M",father:"XA521",ext:true,src:1},
{id:"XA523",name:"أحمد *",g:"M",father:"XA522",ext:true,src:1},
{id:"XA524",name:"صمبوت *",g:"M",father:null,ext:true,src:1},
{id:"XA525",name:"حنكوش *",g:"M",father:null,ext:true,src:1},
{id:"XA526",name:"الطالب *",g:"M",father:"XA525",ext:true,src:1},
{id:"XA527",name:"برار *",g:"M",father:"XA526",ext:true,src:1},
{id:"XA528",name:"الفاليل (عبد الله) *",g:"M",father:"XA400",ext:true,src:1},
{id:"XA529",name:"مولود *",g:"M",father:"XA399",ext:true,src:1},
{id:"XA530",name:"افلواط *",g:"M",father:"XA529",ext:true,src:1},
{id:"XA531",name:"سعيد *",g:"M",father:"XA516",ext:true,src:1,spouses:["Y149d2"]},
{id:"XA532",name:"ببكر *",g:"M",father:"XA531",mother:"Y149d2",ext:true,src:1},
{id:"XA533",name:"باباه (محمد امبارك) *",g:"M",father:"XA532",ext:true,src:1},
{id:"XA535",name:"محمذن *",g:"M",father:"XA882",ext:true,src:1},
{id:"XA536",name:"المامون *",g:"M",father:"XA535",ext:true,src:1},
{id:"XA537",name:"الفالي *",g:"M",father:"XA536",ext:true,src:1},
{id:"XA538",name:"حمّذ *",g:"M",father:"XA537",ext:true,src:1},
{id:"XA539",name:"الشيخ أحمد *",g:"M",father:"XA538",ext:true,src:1},
{id:"XA540",name:"محمد سيديا *",g:"M",father:"XA539",ext:true,src:1},
{id:"XA541",name:"محمد صالح *",g:"M",father:"XA540",ext:true,src:1},
{id:"XA543",name:"الشيخ *",g:"M",father:"XA323",ext:true,src:1},
{id:"XA546",name:"محمذن *",g:"M",father:"XA339",ext:true,src:1,spouses:["I69d2"]},
{id:"XA547",name:"اتاه (المختار ام) *",g:"M",father:"XA546",mother:"I69d2",ext:true,src:1},
{id:"XA548",name:"الفايق *",g:"M",father:null,ext:true,tribe:"تندغو",src:1},
{id:"XA549",name:"محنض الكوري *",g:"M",father:"XA370",ext:true,src:1},
{id:"XA550",name:"خال ابراهيم *",g:"M",father:"XA549",ext:true,src:1},
{id:"XA551",name:"سيديا *",g:"M",father:"XA550",ext:true,src:1},
{id:"XA552",name:"انَّياه (محمذن) *",g:"M",father:"XA551",ext:true,src:1},
{id:"XA553",name:"بييين *",g:"M",father:"XA552",ext:true,src:1},
{id:"XA554",name:"المامون *",g:"M",father:"XA553",ext:true,src:1},
{id:"XA555",name:"محمد سالم *",g:"M",father:"XA554",ext:true,src:1},
{id:"XA556",name:"الليمو *",g:"M",father:null,ext:true,tribe:"اتوابير",src:1},
{id:"XA557",name:"سيد *",g:"M",father:"XA531",mother:"Y149d2",ext:true,src:1},
{id:"XA558",name:"ابياه (المختار) *",g:"M",father:"XA557",ext:true,src:1},
{id:"XA559",name:"محمد *",g:"M",father:"XA558",ext:true,src:1},
{id:"XA560",name:"محمد سعيد *",g:"M",father:"XA559",ext:true,src:1},
{id:"XA562",name:"الشيخ المخفوظ *",g:"M",father:null,ext:true,tribe:"لشياخ",src:1},
{id:"XA564",name:"الفالي *",g:"M",father:"T0-hamnadh",ext:true,src:1},
{id:"XA565",name:"حيبلل *",g:"M",father:"XA564",ext:true,src:1},
{id:"XA566",name:"الجيد *",g:"M",father:"XA565",ext:true,src:1},
{id:"XA567",name:"الامام *",g:"M",father:"XA566",ext:true,src:1},
{id:"XA568",name:"محمذن الكوري *",g:"M",father:"XA567",ext:true,src:1},
{id:"XA569",name:"سيد المختار *",g:"M",father:"XA568",ext:true,src:1},
{id:"XA570",name:"محمذن الكوري *",g:"M",father:"XA569",ext:true,src:1},
{id:"XA571",name:"اغريب *",g:"M",father:null,ext:true,tribe:"ادوحلاج",src:1},
{id:"XA572",name:"حمّ *",g:"M",father:"XA571",ext:true,src:1},
{id:"XA576",name:"آب (محمذن) *",g:"M",father:"XA516",ext:true,src:1,spouses:["Y124d5"]},
{id:"XA577",name:"محمد الأمين *",g:"M",father:"XA576",mother:"Y124d5",ext:true,src:1},
{id:"XA578",name:"العتيق (ولد الطلبه) *",g:"M",father:"XA577",ext:true,src:1},
{id:"XA579",name:"لالب (محمد عبد الله) *",g:"M",father:"XA578",ext:true,src:1},
{id:"XA580",name:"منير *",g:"M",father:null,ext:true,src:1},
{id:"XA581",name:"اجناي التقي *",g:"M",father:"XA580",ext:true,src:1},
{id:"XA583",name:"محمذن *",g:"M",father:"XA323",ext:true,src:1},
{id:"XA584",name:"اندعمر *",g:"M",father:"XA583",ext:true,src:1},
{id:"XA585",name:"الطريش *",g:"M",father:null,ext:true,tribe:"أولاد البوعليو",src:1},
{id:"XA586",name:"اجنبنان *",g:"M",father:null,ext:true,src:1},
{id:"XA589",name:"ولد أحمد *",g:"M",father:"XA503",ext:true,src:1},
{id:"XA590",name:"محمذن *",g:"M",father:"XA589",ext:true,src:1},
{id:"XA591",name:"اتاه (المختار ام) *",g:"M",father:"XA590",ext:true,src:1},
{id:"XA592",name:"المختار *",g:"M",father:"XA390",mother:"I52d4",ext:true,src:1},
{id:"XA593",name:"سيديا *",g:"M",father:"XA592",ext:true,src:1},
{id:"XA594",name:"سيد *",g:"M",father:"XA591",ext:true,src:1},
{id:"XA595",name:"بب *",g:"M",father:"XA594",ext:true,src:1},
{id:"XA596",name:"أبي بكر *",g:"M",father:null,ext:true,tribe:"أولاد عايد",src:1},
{id:"XA597",name:"سيد الأمين *",g:"M",father:"XA414",ext:true,src:1},
{id:"XA598",name:"ابن غازي *",g:"M",father:"XA597",ext:true,src:1},
{id:"XA603",name:"بركين *",g:"M",father:null,ext:true,tribe:"لرباكنو",src:1},
{id:"XA605",name:"المختار *",g:"M",father:"XA323",ext:true,src:1},
{id:"XA606",name:"اسلم *",g:"M",father:"XA605",ext:true,src:1},
{id:"XA607",name:"بوراص *",g:"M",father:null,ext:true,tribe:"إلى اكدحلس",src:1},
{id:"XA611",name:"علي *",g:"M",father:"XA503",ext:true,src:1},
{id:"XA612",name:"الصالح *",g:"M",father:null,ext:true,tribe:"إلى بوفلان",src:1},
{id:"XA613",name:"ابّاده (عبد القادر) *",g:"M",father:"XA612",ext:true,src:1},
{id:"XA614",name:"بزيد *",g:"M",father:"XA613",ext:true,src:1,spouses:["E2d3"]},
{id:"XA615",name:"أباحازم *",g:"M",father:null,ext:true,tribe:"تجكانت",src:1},
{id:"XA616",name:"انتغري *",g:"M",father:null,ext:true,tribe:"إلى بوفلان",src:1},
{id:"XA617",name:"اكا *",g:"M",father:null,ext:true,tribe:"إلى بوفلان",src:1},
{id:"XA620",name:"سعد بوه *",g:"M",father:"XA617",ext:true,src:1},
{id:"XA621",name:"أميو *",g:"M",father:null,ext:true,tribe:"إلى بوفلان",src:1},
{id:"XA622",name:"سيد *",g:"M",father:null,ext:true,tribe:"أدكبهين",src:1},
{id:"XA624",name:"الفكيكي *",g:"M",father:null,ext:true,tribe:"؟",src:1},
{id:"XA625",name:"كرام *",g:"M",father:null,ext:true,tribe:"تكنو",src:1},
{id:"XA626",name:"يدن يعقوب *",g:"M",father:null,ext:true,src:1},
{id:"XA627",name:"محنض *",g:"M",father:"XA626",ext:true,src:1},
{id:"XA628",name:"بوشنكور (الماح) *",g:"M",father:"XA627",ext:true,src:1},
{id:"XA629",name:"أحمد شينان *",g:"M",father:"XA628",ext:true,src:1,spouses:["M1d3"]},
{id:"XA630",name:"بلعمش *",g:"M",father:"XA629",mother:"M1d3",ext:true,src:1},
{id:"XA631",name:"شايط *",g:"M",father:"XA630",ext:true,src:1},
{id:"XA632",name:"أحمذ حييا *",g:"M",father:null,ext:true,tribe:"اجنامره",src:1},
{id:"XA633",name:"مهنض امغر *",g:"M",father:null,ext:true,src:1},
{id:"XA634",name:"اشفغ اوبك *",g:"M",father:"XA633",ext:true,src:1},
{id:"XA635",name:"أحمد *",g:"M",father:"XA634",ext:true,src:1},
{id:"XA636",name:"أبا الصالح *",g:"M",father:"XA635",ext:true,src:1},
{id:"XA638",name:"أحمد *",g:"M",father:"XA1242",ext:true,src:1},
{id:"XA639",name:"اشروقو *",g:"M",father:null,ext:true,tribe:"أولاد بوحليو",src:1},
{id:"XA640",name:"علي *",g:"M",father:"XA639",ext:true,src:1},
{id:"XA641",name:"الجيلي *",g:"M",father:null,ext:true,tribe:"لغلال",src:1},
{id:"XA643",name:"الفالي اشفغ اوبك *",g:"M",father:"XA882",ext:true,src:1},
{id:"XA644",name:"محمدن *",g:"M",father:"XA643",ext:true,src:1},
{id:"XA645",name:"الأمين *",g:"M",father:"XA644",ext:true,src:1},
{id:"XA646",name:"يعمئن سيذن (محمذن) *",g:"M",father:"XA645",ext:true,src:1},
{id:"XA647",name:"امبارك زين *",g:"M",father:"XA646",ext:true,src:1},
{id:"XA649",name:"حبلل *",g:"M",father:"XA491",ext:true,src:1},
{id:"XA650",name:"المختار *",g:"M",father:"XA649",ext:true,src:1},
{id:"XA651",name:"ياحممذن *",g:"M",father:"XA650",ext:true,src:1},
{id:"XA652",name:"آمكيتري *",g:"M",father:"XA651",ext:true,src:1},
{id:"XA653",name:"اسنيد *",g:"M",father:"XA652",ext:true,src:1},
{id:"XA656",name:"النور *",g:"M",father:null,ext:true,tribe:"أدوحلاج",src:1},
{id:"XA657",name:"علي *",g:"M",father:null,ext:true,tribe:"امجان",src:1},
{id:"XA659",name:"عبدي *",g:"M",father:"XA970",ext:true,src:1},
{id:"XA660",name:"محمد فال *",g:"M",father:"XA659",ext:true,src:1},
{id:"XA661",name:"محمذن *",g:"M",father:"XA660",ext:true,src:1},
{id:"XA662",name:"حامي (محمد) *",g:"M",father:"XA661",ext:true,src:1},
{id:"XA663",name:"شام (المختار السالم) *",g:"M",father:"XA662",ext:true,src:1},
{id:"XA664",name:"الفالي *",g:"M",father:"XA496",mother:"L2d3",ext:true,src:1},
{id:"XA665",name:"محمدكم *",g:"M",father:"XA664",ext:true,src:1},
{id:"XA666",name:"محمد فال *",g:"M",father:"XA665",ext:true,src:1},
{id:"XA667",name:"المختار *",g:"M",father:"XA666",ext:true,src:1},
{id:"XA671",name:"دد (أحمد) *",g:"M",father:"XA661",ext:true,src:1},
{id:"XA672",name:"محمدن *",g:"M",father:"XA671",ext:true,src:1},
{id:"XA674",name:"باباه *",g:"M",father:"XA388",ext:true,src:1},
{id:"XA676",name:"اشفغ مصر *",g:"M",father:"XA586",ext:true,src:1},
{id:"XA677",name:"محمذن باب *",g:"M",father:"XA676",ext:true,src:1},
{id:"XA678",name:"أحمذا *",g:"M",father:null,ext:true,tribe:"انكادس",src:1},
{id:"XA679",name:"المختار *",g:"M",father:"XA678",ext:true,src:1},
{id:"XA680",name:"أحميدات *",g:"M",father:"XA679",ext:true,src:1},
{id:"XA681",name:"الصالح *",g:"M",father:"XA680",ext:true,src:1},
{id:"XA682",name:"ذلويدي *",g:"M",father:null,ext:true,src:1},
{id:"XA684",name:"محمذن *",g:"M",father:"XA900",ext:true,src:1},
{id:"XA685",name:"يعقوبنلل *",g:"M",father:"XA684",ext:true,src:1},
{id:"XA686",name:"شمس الدين *",g:"M",father:"XA685",ext:true,src:1},
{id:"XA687",name:"محمذن *",g:"M",father:"XA686",ext:true,src:1},
{id:"XA688",name:"النافع *",g:"M",father:"XA687",ext:true,src:1},
{id:"XA689",name:"البدوي *",g:"M",father:"XA688",ext:true,src:1},
{id:"XA690",name:"أحمد *",g:"M",father:"XA689",ext:true,src:1,spouses:["D18d1"]},
{id:"XA691",name:"سيد أحمد *",g:"M",father:"XA690",mother:"D18d1",ext:true,src:1},
{id:"XA692",name:"أحمد *",g:"M",father:"XA691",ext:true,src:1},
{id:"XA693",name:"يدام *",g:"M",father:null,ext:true,tribe:"أدودام",src:1},
{id:"XA694",name:"اندعمر *",g:"M",father:"XA693",ext:true,src:1},
{id:"XA695",name:"المختار *",g:"M",father:"XA694",ext:true,src:1},
{id:"XA696",name:"أحمد دولو *",g:"M",father:"XA695",ext:true,src:1},
{id:"XA700",name:"اشفغ عبد الله *",g:"M",father:"XA775",ext:true,src:1},
{id:"XA701",name:"حامدت *",g:"M",father:"XA700",ext:true,src:1},
{id:"XA702",name:"جان جيو *",g:"M",father:null,ext:true,src:1},
{id:"XA703",name:"ارب *",g:"M",father:null,ext:true,tribe:"مدلش",src:1},
{id:"XA704",name:"المختار *",g:"M",father:"XA703",ext:true,src:1},
{id:"XA705",name:"الماح *",g:"M",father:null,ext:true,tribe:"مدلش",src:1},
{id:"XA706",name:"مهر بيدك *",g:"M",father:null,ext:true,src:1},
{id:"XA707",name:"ورزك *",g:"M",father:"XA706",ext:true,src:1},
{id:"XA708",name:"اندر *",g:"M",father:null,ext:true,src:1,tribe:"آروجيات"},
{id:"XA709",name:"بلال *",g:"M",father:"XA708",ext:true,src:1},
{id:"XA711",name:"بزيح *",g:"M",father:null,ext:true,tribe:"أولاد بسبع",src:1},
{id:"XA714",name:"اعويلي *",g:"M",father:null,ext:true,tribe:"ملزازكو",src:1},
{id:"XA715",name:"أحمد *",g:"M",father:"XA714",ext:true,src:1},
{id:"XA716",name:"المصطفى *",g:"M",father:"XA419",ext:true,src:1},
{id:"XA718",name:"محمد امبارك -اولاد ابيري (اهل احمد *",g:"M",father:"XA504",ext:true,src:1},
{id:"XA719",name:"المداح *",g:"M",father:"XA399",ext:true,src:1},
{id:"XA720",name:"احمذنلل *",g:"M",father:null,ext:true,src:1},
{id:"XA721",name:"يعقوب *",g:"M",father:"XA720",ext:true,src:1},
{id:"XA722",name:"محمد *",g:"M",father:"XA721",ext:true,src:1},
{id:"XA723",name:"ابوبك *",g:"M",father:"XA722",ext:true,src:1},
{id:"XA724",name:"اعمر *",g:"M",father:"XA723",ext:true,src:1},
{id:"XA725",name:"المختار *",g:"M",father:"XA724",ext:true,src:1},
{id:"XA726",name:"محمذن حبيب الله *",g:"M",father:"XA725",ext:true,src:1},
{id:"XA727",name:"ولي الله *",g:"M",father:"XA726",ext:true,src:1},
{id:"XA728",name:"أبَي (محمذن) لّلا (احمد) *",g:"M",father:"XA727",ext:true,src:1},
{id:"XA729",name:"احمد *",g:"M",father:"XA728",ext:true,src:1},
{id:"XA730",name:"محمدن *",g:"M",father:"XA729",ext:true,src:1},
{id:"XA731",name:"العالم *",g:"M",father:null,ext:true,src:1},
{id:"XA732",name:"امين *",g:"M",father:"XA731",ext:true,src:1},
{id:"XA734",name:"فاجلنا *",g:"M",father:null,ext:true,tribe:"انكادس",src:1},
{id:"XA737",name:"محنض *",g:"M",father:"XA1248",ext:true,src:1},
{id:"XA738",name:"حبت *",g:"M",father:"XA737",ext:true,src:1},
{id:"XA739",name:"سيد *",g:"M",father:"XA738",ext:true,src:1},
{id:"XA740",name:"دمان *",g:"M",father:null,ext:true,src:1},
{id:"XA741",name:"أحمد *",g:"M",father:"XA740",ext:true,src:1},
{id:"XA742",name:"هدي *",g:"M",father:"XA741",ext:true,src:1},
{id:"XA743",name:"اعلي شنظوره *",g:"M",father:"XA742",ext:true,src:1},
{id:"XA744",name:"المختار *",g:"M",father:"XA743",ext:true,src:1},
{id:"XA745",name:"اعمر *",g:"M",father:"XA744",ext:true,src:1},
{id:"XA746",name:"اعلي *",g:"M",father:"XA745",ext:true,src:1},
{id:"XA747",name:"اتكريير *",g:"M",father:null,ext:true,tribe:"أولاد البوعليو",src:1},
{id:"XA750",name:"سعيد *",g:"M",father:"XA1070",ext:true,src:1},
{id:"XA751",name:"المعلوم *",g:"M",father:"XA750",ext:true,src:1},
{id:"XA754",name:"اجناك *",g:"M",father:null,ext:true,tribe:"أولاد اركيك",src:1},
{id:"XA755",name:"أولاد باب أحمد *",g:"M",father:null,ext:true,src:1},
{id:"XA756",name:"الفالي *",g:"M",father:"XA755",ext:true,src:1},
{id:"XA757",name:"الغالوي *",g:"M",father:"XA756",ext:true,src:1},
{id:"XA758",name:"محنض *",g:"M",father:"XA757",ext:true,src:1},
{id:"XA761",name:"اسليمان *",g:"M",father:"XA428",ext:true,src:1},
{id:"XA762",name:"الشيخ أحمد *",g:"M",father:"XA761",ext:true,src:1},
{id:"XA763",name:"ابومدين *",g:"M",father:"XA762",ext:true,src:1},
{id:"XA764",name:"حرمة الله *",g:"M",father:null,ext:true,tribe:"أولاد ابيري",src:1},
{id:"XA765",name:"عبد الله نلماح (الداه) *",g:"M",father:"XA390",mother:"I52d4",ext:true,src:1},
{id:"XA766",name:"اتويف *",g:"M",father:null,ext:true,tribe:"أولاد دمان",src:1},
{id:"XA767",name:"أحمد ناه *",g:"M",father:"XA766",ext:true,src:1},
{id:"XA768",name:"الخليفه *",g:"M",father:null,ext:true,tribe:"انكرده",src:1},
{id:"XA769",name:"اغلنصر *",g:"M",father:"XA598",ext:true,src:1},
{id:"XA770",name:"المني *",g:"M",father:null,ext:true,src:1},
{id:"XA771",name:"أحمد *",g:"M",father:"XA770",ext:true,src:1},
{id:"XA772",name:"سناد *",g:"M",father:null,ext:true,tribe:"اديقب",src:1},
{id:"XA774",name:"أحمد شلل *",g:"M",father:"XA413",ext:true,src:1},
{id:"XA775",name:"أعمر يزكئذن *",g:"M",father:"XA1046",ext:true,src:1},
{id:"XA777",name:"الماح *",g:"M",father:"XA475",ext:true,src:1},
{id:"XA778",name:"محنض *",g:"M",father:"XA777",ext:true,src:1,spouses:["G1d2"]},
{id:"XA779",name:"محمد العاقل *",g:"M",father:"XA778",mother:"G1d2",ext:true,src:1},
{id:"XA781",name:"الفالي *",g:"M",father:"XA475",ext:true,src:1},
{id:"XA782",name:"حوبك *",g:"M",father:"XA781",ext:true,src:1},
{id:"XA783",name:"الأمين *",g:"M",father:"XA782",ext:true,src:1,spouses:["M5d1"]},
{id:"XA784",name:"حندي (أحمد) *",g:"M",father:"XA783",mother:"M5d1",ext:true,src:1},
{id:"XA786",name:"بل *",g:"M",father:"XA475",ext:true,src:1},
{id:"XA788",name:"عبيد الله *",g:"M",father:"XA477",ext:true,src:1},
{id:"XA789",name:"اشفغ المختار *",g:"M",father:"XA788",ext:true,src:1},
{id:"XA790",name:"أحمد الجواد *",g:"M",father:"XA789",ext:true,src:1},
{id:"XA791",name:"محمد *",g:"M",father:"XA790",ext:true,src:1},
{id:"XA792",name:"محمد محمود *",g:"M",father:"XA791",ext:true,src:1},
{id:"XA798",name:"الب *",g:"M",father:"XA792",ext:true,src:1},
{id:"XA802",name:"كينيا *",g:"M",father:null,ext:true,tribe:"إلى آكمتار",src:1},
{id:"XA803",name:"افا *",g:"M",father:null,ext:true,src:1},
{id:"XA804",name:"سيد *",g:"M",father:"XA803",ext:true,src:1},
{id:"XA806",name:"أعمر *",g:"M",father:"XA657",ext:true,src:1},
{id:"XA807",name:"المختار *",g:"M",father:"XA806",ext:true,src:1},
{id:"XA808",name:"أعمر (ولد كمبو) *",g:"M",father:"XA807",ext:true,src:1},
{id:"XA809",name:"تروز *",g:"M",father:null,ext:true,src:1},
{id:"XA810",name:"اعلي *",g:"M",father:"XA809",ext:true,src:1},
{id:"XA811",name:"محمد الصغير *",g:"M",father:"XA810",ext:true,src:1},
{id:"XA812",name:"ابوبك *",g:"M",father:"XA811",ext:true,src:1},
{id:"XA813",name:"أحمد *",g:"M",father:"XA812",ext:true,src:1},
{id:"XA814",name:"البون *",g:"M",father:"XA813",ext:true,src:1},
{id:"XA815",name:"بب *",g:"M",father:"XA814",ext:true,src:1},
{id:"XA816",name:"المختار عمي *",g:"M",father:null,ext:true,tribe:"متكلو",src:1},
{id:"XA817",name:"أحمد *",g:"M",father:"XA816",ext:true,src:1},
{id:"XA818",name:"المختار *",g:"M",father:"XA817",ext:true,src:1},
{id:"G15s1s1",name:"محمد *",g:"M",father:"G15s1",ext:true,src:1},
{id:"G15s1s1s1",name:"الحبيب *",g:"M",father:"G15s1s1",ext:true,src:1},
{id:"XA823",name:"الشافع -إلى محم *",g:"M",father:"XA882",ext:true,src:1},
{id:"XA825",name:"ابيليل *",g:"M",father:null,ext:true,src:1},
{id:"XA826",name:"اليدالي *",g:"M",father:"XA428",ext:true,src:1},
{id:"XA827",name:"المصطفى *",g:"M",father:"XA826",ext:true,src:1},
{id:"XA831",name:"ميجود *",g:"M",father:null,ext:true,tribe:"اديبسات",src:1},
{id:"XA833",name:"المصطفى *",g:"M",father:"XA491",ext:true,src:1},
{id:"XA834",name:"اعديج *",g:"M",father:"XA833",ext:true,src:1,spouses:["I72d3"]},
{id:"XA836",name:"سيذن (سيد) *",g:"M",father:"XA1267",ext:true,src:1},
{id:"XA837",name:"علي *",g:"M",father:"XA836",ext:true,src:1},
{id:"XA838",name:"أحمد سالم *",g:"M",father:"XA837",ext:true,src:1},
{id:"XA839",name:"امحيد *",g:"M",father:"XA584",ext:true,src:1},
{id:"XA841",name:"اداعو *",g:"M",father:null,ext:true,src:1},
{id:"XA842",name:"ايب بكر *",g:"M",father:"XA841",ext:true,src:1},
{id:"XA844",name:"العالم *",g:"M",father:"XA622",ext:true,src:1},
{id:"XA845",name:"أحمد *",g:"M",father:"XA844",ext:true,src:1},
{id:"XA846",name:"العالم *",g:"M",father:"XA845",ext:true,src:1},
{id:"XA847",name:"أمين *",g:"M",father:"XA846",ext:true,src:1,spouses:["G89d1"]},
{id:"XA848",name:"يعمئذن سيذن *",g:"M",father:null,ext:true,src:1},
{id:"XA849",name:"امام *",g:"M",father:"XA848",ext:true,src:1},
{id:"XA850",name:"اجاه *",g:"M",father:null,ext:true,src:1},
{id:"XA851",name:"باب *",g:"M",father:"XA850",ext:true,src:1},
{id:"XA852",name:"المختار *",g:"M",father:"XA737",ext:true,src:1},
{id:"XA853",name:"الماح *",g:"M",father:"XA852",ext:true,src:1},
{id:"XA854",name:"محمذن *",g:"M",father:"XA853",ext:true,src:1},
{id:"XA855",name:"عمر *",g:"M",father:"XA854",ext:true,src:1},
{id:"XA856",name:"الحسن *",g:"M",father:"XA855",ext:true,src:1},
{id:"XA857",name:"أحمذ *",g:"M",father:"XA856",ext:true,src:1},
{id:"XA858",name:"السالك *",g:"M",father:"XA857",ext:true,src:1},
{id:"XA859",name:"مهت *",g:"M",father:"XA858",ext:true,src:1,spouses:["G81d1"]},
{id:"XA860",name:"ناصر *",g:"M",father:null,ext:true,src:1},
{id:"XA862",name:"الفالي *",g:"M",father:"XA629",mother:"M1d3",ext:true,src:1},
{id:"XA863",name:"محمدكل *",g:"M",father:"XA862",ext:true,src:1},
{id:"XA865",name:"محمذن *",g:"M",father:null,ext:true,src:1,tribe:"لهواكري"},
{id:"XA866",name:"حيب الله *",g:"M",father:"XA865",ext:true,src:1},
{id:"XA868",name:"خاجيل *",g:"M",father:"XA484",ext:true,src:1},
{id:"XA869",name:"أحمد *",g:"M",father:"XA868",ext:true,src:1},
{id:"XA870",name:"عبد *",g:"M",father:"XA869",ext:true,src:1},
{id:"XA871",name:"سيد محمود *",g:"M",father:"XA870",ext:true,src:1},
{id:"XA873",name:"يعقوب *",g:"M",father:"XA503",ext:true,src:1},
{id:"XA874",name:"عبيده *",g:"M",father:"XA873",ext:true,src:1},
{id:"XA875",name:"محمد الأمين *",g:"M",father:"XA874",ext:true,src:1},
{id:"XA876",name:"الحاج *",g:"M",father:"XA875",ext:true,src:1},
{id:"XA877",name:"المشكور *",g:"M",father:null,ext:true,tribe:"اديقب",src:1},
{id:"XA878",name:"أحمياده *",g:"M",father:null,ext:true,tribe:"امساليل",src:1},
{id:"XA879",name:"اجبيل *",g:"M",father:null,ext:true,tribe:"لكتيبات",src:1},
{id:"XA881",name:"زين *",g:"M",father:"XA493",mother:"G100d1",ext:true,src:1},
{id:"XA882",name:"عمر *",g:"M",father:null,ext:true,tribe:"أولاد رزك",src:1},
{id:"XA884",name:"حمدي *",g:"M",father:null,ext:true,src:1},
{id:"XA886",name:"اناه (مختير) *",g:"M",father:"XA884",ext:true,src:1},
{id:"XA887",name:"محمد سالم *",g:"M",father:"XA886",ext:true,src:1},
{id:"XA888",name:"افوفنا *",g:"M",father:null,ext:true,src:1},
{id:"XA889",name:"اسالمو *",g:"M",father:null,ext:true,tribe:"اديرك",src:1},
{id:"XA891",name:"ابنغازي *",g:"M",father:"XA504",ext:true,src:1},
{id:"XA892",name:"محمد فال *",g:"M",father:"XA891",ext:true,src:1},
{id:"XA893",name:"احمد *",g:"M",father:"XA892",ext:true,src:1},
{id:"XA896",name:"احمد *",g:"M",father:"XA657",ext:true,src:1},
{id:"XA899",name:"صالح *",g:"M",father:null,ext:true,tribe:"تندغو",src:1},
{id:"XA900",name:"اشفغ *",g:"M",father:null,ext:true,tribe:"اولاد اخطريه",src:1},
{id:"XA902",name:"اكذمحنض *",g:"M",father:null,ext:true,tribe:"اداشغره",src:1},
{id:"XA903",name:"احمد *",g:"M",father:"XA902",ext:true,src:1},
{id:"XA904",name:"امحذي *",g:"M",father:null,ext:true,tribe:"اداشغره",src:1},
{id:"XA907",name:"لحريطيين *",g:"M",father:null,ext:true,src:1},
{id:"XA908",name:"البشير *",g:"M",father:null,ext:true,tribe:"؟",src:1},
{id:"XA909",name:"البيظ *",g:"M",father:null,ext:true,src:1},
{id:"XA910",name:"محمد سالم *",g:"M",father:"XA909",ext:true,src:1},
{id:"XA911",name:"احميدي *",g:"M",father:null,ext:true,tribe:"اولاد ابيريي",src:1},
{id:"XA912",name:"علي *",g:"M",father:"XA911",ext:true,src:1},
{id:"XA914",name:"ادوم *",g:"M",father:"XA503",ext:true,src:1},
{id:"XA916",name:"احيد *",g:"M",father:null,ext:true,tribe:"اولاد ابيريي",src:1},
{id:"XA917",name:"محمد يحي *",g:"M",father:"XA916",ext:true,src:1},
{id:"XA919",name:"اميجن *",g:"M",father:null,ext:true,src:1},
{id:"XA920",name:"باب *",g:"M",father:"XA919",ext:true,src:1},
{id:"XA922",name:"باها *",g:"M",father:null,ext:true,tribe:"ادوعيش",src:1},
{id:"XA923",name:"الحضرامي *",g:"M",father:null,ext:true,tribe:"ادوعيش",src:1},
{id:"XA924",name:"البصيري *",g:"M",father:null,ext:true,tribe:"تجكانت",src:1},
{id:"XA926",name:"الطالب سيد احمد *",g:"M",father:null,ext:true,tribe:"اديبسات",src:1},
{id:"XA928",name:"مهد *",g:"M",father:null,ext:true,tribe:"ادوعيش",src:1},
{id:"XA929",name:"اعلي *",g:"M",father:"XA928",ext:true,src:1},
{id:"XA930",name:"اماد *",g:"M",father:null,ext:true,tribe:"لكواطيط",src:1},
{id:"XA931",name:"محمد محمود *",g:"M",father:"XA930",ext:true,src:1},
{id:"XA933",name:"الشيخ السالم *",g:"M",father:"XA938",ext:true,src:1},
{id:"XA934",name:"ديدي *",g:"M",father:null,ext:true,tribe:"اهل مالي الزين",src:1},
{id:"XA935",name:"القاسم *",g:"M",father:"XA934",ext:true,src:1},
{id:"XA936",name:"حيب الله *",g:"M",father:null,ext:true,tribe:"اهل محمد حرمه",src:1},
{id:"XA938",name:"فحف *",g:"M",father:null,ext:true,tribe:"مسومو",src:1},
{id:"XA939",name:"الشيخ الناجي *",g:"M",father:"XA938",ext:true,src:1},
{id:"XA940",name:"بتار *",g:"M",father:null,ext:true,tribe:"اولاد ابيريي",src:1},
{id:"XA941",name:"الخراشي *",g:"M",father:null,ext:true,tribe:"؟",src:1},
{id:"XA943",name:"محمد المختار *",g:"M",father:"XA934",ext:true,src:1},
{id:"XA944",name:"الدلال *",g:"M",father:null,ext:true,tribe:"اولاد الديم",src:1},
{id:"XA945",name:"محمد احمد *",g:"M",father:"XA944",ext:true,src:1},
{id:"XA947",name:"بيدي *",g:"M",father:null,ext:true,src:1},
{id:"XA948",name:"الشيخ *",g:"M",father:"XA947",ext:true,src:1},
{id:"XA951",name:"دمون *",g:"M",father:null,ext:true,tribe:"ادوعلي",src:1},
{id:"XA952",name:"كابر *",g:"M",father:"XA951",ext:true,src:1},
{id:"XA953",name:"ميابا *",g:"M",father:null,ext:true,tribe:"تجكانت",src:1},
{id:"XA954",name:"الحاج ابراهيم *",g:"M",father:null,ext:true,tribe:"ادوعلي",src:1},
{id:"XA955",name:"سيد عبد الله *",g:"M",father:"XA954",ext:true,src:1},
{id:"XA956",name:"ديدي *",g:"M",father:"XA955",ext:true,src:1},
{id:"XA957",name:"محمد الأمين *",g:"M",father:"XA956",ext:true,src:1},
{id:"XA959",name:"محفوظ *",g:"M",father:"XA882",ext:true,src:1},
{id:"XA960",name:"محمد الأمين السالم *",g:"M",father:"XA959",ext:true,src:1},
{id:"XA963",name:"أمين *",g:"M",father:"XA323",ext:true,src:1},
{id:"XA965",name:"ادّد *",g:"M",father:null,ext:true,tribe:"ادوعلي",src:1},
{id:"XA966",name:"التار *",g:"M",father:null,ext:true,tribe:"اهل بومالك",src:1},
{id:"XA969",name:"اهبنض *",g:"M",father:"XA373",ext:true,src:1},
{id:"XA970",name:"سيد المختار *",g:"M",father:null,ext:true,tribe:"لهواكري",src:1},
{id:"XA971",name:"سيد احمد *",g:"M",father:"XA970",ext:true,src:1},
{id:"XA972",name:"اشفغ المختار *",g:"M",father:"XA971",ext:true,src:1},
{id:"XA974",name:"ابياجوك *",g:"M",father:"XA969",ext:true,src:1},
{id:"XA976",name:"ابي بكر *",g:"M",father:"XA916",ext:true,src:1},
{id:"XA977",name:"اخيار *",g:"M",father:null,ext:true,tribe:"اندجيو كرار",src:1},
{id:"XA978",name:"منين *",g:"M",father:"XA977",ext:true,src:1},
{id:"XA979",name:"احمد *",g:"M",father:"XA978",ext:true,src:1},
{id:"XA984",name:"سيد احمد *",g:"M",father:"XA916",ext:true,src:1,spouses:["D97d1"]},
{id:"XA987",name:"اشفغ حييا *",g:"M",father:"XA774",ext:true,src:1},
{id:"XA988",name:"الأمين *",g:"M",father:"XA987",ext:true,src:1},
{id:"XA989",name:"آبر *",g:"M",father:"XA988",ext:true,src:1},
{id:"XA990",name:"العادل *",g:"M",father:"XA989",ext:true,src:1},
{id:"XA991",name:"احمد *",g:"M",father:"XA990",ext:true,src:1},
{id:"XA992",name:"سيد الأمين *",g:"M",father:"XA775",ext:true,src:1},
{id:"XA993",name:"محمد *",g:"M",father:"XA992",ext:true,src:1},
{id:"XA994",name:"الحص *",g:"M",father:"XA993",ext:true,src:1},
{id:"XA995",name:"احممد *",g:"M",father:"XA1070",ext:true,src:1},
{id:"XA997",name:"حيظيو *",g:"M",father:"XA916",ext:true,src:1},
{id:"XA998",name:"يعقوب *",g:"M",father:"XA414",ext:true,src:1},
{id:"XA999",name:"شدك *",g:"M",father:"XA998",ext:true,src:1},
{id:"XA1000",name:"محمذن *",g:"M",father:"XA999",ext:true,src:1},
{id:"XA1001",name:"محنضني *",g:"M",father:"XA1000",ext:true,src:1},
{id:"XA1002",name:"محمد *",g:"M",father:"XA1001",ext:true,src:1},
{id:"XA1003",name:"زياد *",g:"M",father:"XA1002",ext:true,src:1},
{id:"XA1004",name:"ابن *",g:"M",father:null,ext:true,tribe:"؟",src:1},
{id:"XA1005",name:"محمد *",g:"M",father:"XA676",ext:true,src:1},
{id:"XA1006",name:"خوي *",g:"M",father:"XA1005",ext:true,src:1},
{id:"XA1007",name:"محمني اغربظ *",g:"M",father:null,ext:true,tribe:"تندغو",src:1},
{id:"XA1008",name:"باد *",g:"M",father:null,ext:true,src:1},
{id:"XA1009",name:"قاظينا *",g:"M",father:null,ext:true,tribe:"ادوعلي",src:1},
{id:"XA1010",name:"لهويدي *",g:"M",father:"XA1009",ext:true,src:1},
{id:"XA1011",name:"الهيب *",g:"M",father:null,ext:true,tribe:"اولاد دمان",src:1},
{id:"XA1012",name:"المختار *",g:"M",father:"XA1011",ext:true,src:1},
{id:"XA1013",name:"محو *",g:"M",father:null,ext:true,tribe:"تندغو",src:1},
{id:"XA1014",name:"اشقران *",g:"M",father:null,ext:true,tribe:"اهل احمد شبو",src:1},
{id:"XA1015",name:"المقدم *",g:"M",father:null,ext:true,tribe:"تاشدبيت",src:1},
{id:"XA1017",name:"محمد الأمين *",g:"M",father:"XA323",ext:true,src:1},
{id:"XA1018",name:"بده *",g:"M",father:"XA1017",ext:true,src:1},
{id:"XA1020",name:"علي *",g:"M",father:"XA453",ext:true,src:1},
{id:"XA1021",name:"الحسن *",g:"M",father:"XA1020",ext:true,src:1},
{id:"XA1022",name:"جمال *",g:"M",father:null,ext:true,tribe:"اشكانن",src:1},
{id:"XA1023",name:"احمد اكذ المختار *",g:"M",father:null,ext:true,src:1},
{id:"XA1024",name:"احمد من دمان *",g:"M",father:null,ext:true,src:1},
{id:"XA1025",name:"اعلي *",g:"M",father:"XA1024",ext:true,src:1},
{id:"XA1029",name:"احمد *",g:"M",father:"XA1248",ext:true,src:1},
{id:"XA1034",name:"الأمين *",g:"M",father:"XA491",ext:true,src:1},
{id:"XA1035",name:"محمني اغربظ *",g:"M",father:"XA1034",ext:true,src:1},
{id:"XA1036",name:"احود *",g:"M",father:null,ext:true,tribe:"مشظوف",src:1},
{id:"XA1037",name:"ابن عفان *",g:"M",father:"XA339",ext:true,src:1},
{id:"XA1038",name:"الأمين *",g:"M",father:"XA1037",ext:true,src:1},
{id:"XA1039",name:"محمد فال *",g:"M",father:"XA1038",ext:true,src:1},
{id:"XA1044",name:"احمد عالم *",g:"M",father:"XA651",ext:true,src:1},
{id:"XA1046",name:"محنضلل *",g:"M",father:"XA882",ext:true,src:1},
{id:"XA1048",name:"سكم *",g:"M",father:"XA775",ext:true,src:1},
{id:"XA1049",name:"عمي *",g:"M",father:"XA1048",ext:true,src:1},
{id:"XA1050",name:"ابا (محمذن) *",g:"M",father:"XA1049",ext:true,src:1},
{id:"XA1051",name:"محمد *",g:"M",father:"XA1050",ext:true,src:1},
{id:"XA1052",name:"المختار *",g:"M",father:"XA1051",ext:true,src:1},
{id:"XA1053",name:"ابَّـا (محمد سالم) *",g:"M",father:"XA1052",ext:true,src:1},
{id:"XA1054",name:"زمتار *",g:"M",father:"XA629",mother:"M1d3",ext:true,src:1},
{id:"XA1055",name:"محمذا *",g:"M",father:"XA1054",ext:true,src:1},
{id:"XA1056",name:"آتاه (المختار) *",g:"M",father:"XA1055",ext:true,src:1},
{id:"XA1060",name:"محين *",g:"M",father:null,ext:true,tribe:"ادوداي",src:1},
{id:"XA1063",name:"سيدينا *",g:"M",father:"XA882",ext:true,src:1},
{id:"XA1066",name:"لكويري *",g:"M",father:null,ext:true,tribe:"ارحاحلو",src:1},
{id:"XA1067",name:"محمد العبد *",g:"M",father:"XA1066",ext:true,src:1},
{id:"XA1068",name:"الرباني *",g:"M",father:null,ext:true,tribe:"؟",src:1},
{id:"XA1070",name:"اتقي *",g:"M",father:"XA462",ext:true,src:1},
{id:"XA1071",name:"احبيبنا *",g:"M",father:"XA1070",ext:true,src:1},
{id:"XA1072",name:"احممد *",g:"M",father:null,ext:true,tribe:"اولاد عايد",src:1},
{id:"XA1073",name:"اعمر *",g:"M",father:"XA1072",ext:true,src:1},
{id:"XA1074",name:"الجمد (أحمد) *",g:"M",father:"XA993",ext:true,src:1},
{id:"XA1075",name:"محمذن *",g:"M",father:"XA1074",ext:true,src:1},
{id:"XA1076",name:"احمد *",g:"M",father:"XA1075",ext:true,src:1},
{id:"XA1079",name:"احمد مجلد *",g:"M",father:"XA778",mother:"G1d2",ext:true,src:1},
{id:"XA1080",name:"اويب *",g:"M",father:"XA1079",ext:true,src:1},
{id:"XA1082",name:"محمد سالم *",g:"M",father:"XA465",ext:true,tribe:"ادغبسرين",src:1},
{id:"XA1084",name:"محم سعيد *",g:"M",father:"XA900",ext:true,src:1},
{id:"XA1085",name:"ياحممدي *",g:"M",father:"XA1084",ext:true,src:1},
{id:"XA1086",name:"احمد بازيد *",g:"M",father:"XA1085",ext:true,src:1},
{id:"XA1087",name:"عبد المومن *",g:"M",father:"XA1086",ext:true,src:1},
{id:"XA1088",name:"اواه (محمد سعيد) *",g:"M",father:"XA495",ext:true,src:1},
{id:"XA1089",name:"اتاه (المختار) *",g:"M",father:"XA1088",ext:true,src:1},
{id:"XA1090",name:"اواه (محمد سعيد) *",g:"M",father:"XA1089",ext:true,src:1},
{id:"XA1091",name:"احمد دينو *",g:"M",father:null,ext:true,tribe:"ارحاحلو",src:1},
{id:"XA1092",name:"سيد موسى *",g:"M",father:null,ext:true,tribe:"اولاد الميم",src:1},
{id:"XA1096",name:"أسلم *",g:"M",father:null,ext:true,src:1},
{id:"XA1100",name:"سيد أحمد *",g:"M",father:null,ext:true,src:1,tribe:"كنتو"},
{id:"XA1102",name:"الشيخ *",g:"M",father:"XA1100",ext:true,src:1},
{id:"XA1105",name:"محمد *",g:"M",father:"XA1106",src:1},
{id:"XA1106",name:"سيد الفالي *",g:"M",father:null,src:1},
{id:"XA1107",name:"عمي اعديج *",g:"M",father:"XA1106",src:1},
{id:"XA1108",name:"حندي *",g:"M",father:"XA1107",src:1},
{id:"XA1109",name:"يافاظل *",g:"M",father:"XA1108",src:1},
{id:"XA1111",name:"ياوليد *",g:"M",father:"XA1396",src:1},
{id:"XA1112",name:"أحمد *",g:"M",father:"XA1111",src:1},
{id:"XA1113",name:"محمذن *",g:"M",father:"XA1112",src:1},
{id:"XA1114",name:"ابراهيم *",g:"M",father:null,tribe:"أولاد آكشار",src:1},
{id:"XA1115",name:"انضالي *",g:"M",father:null,ext:true,tribe:"متكلو",src:1},
{id:"XA1116",name:"اشفغ الأمين *",g:"M",father:"XA1115",ext:true,src:1},
{id:"XA1117",name:"محمودن *",g:"M",father:null,ext:true,src:1},
{id:"XA1118",name:"عبد الله *",g:"M",father:"XA1117",ext:true,src:1},
{id:"XA1119",name:"حمم *",g:"M",father:"XA1118",ext:true,src:1,spouses:["D6d1"]},
{id:"XA1120",name:"محمد (محمذن ميلود) *",g:"M",father:"XA1119",ext:true,src:1},
{id:"XA1122",name:"اَّيا (أحمذ) *",g:"M",father:"XA383",src:1},
{id:"XA1123",name:"أَّمم (محمذن) *",g:"M",father:"XA1122",src:1},
{id:"XA1124",name:"أحمد زروق *",g:"M",father:null,src:1},
{id:"XA1125",name:"بابارميد *",g:"M",father:"XA1124",src:1},
{id:"XA1126",name:"باللبل *",g:"M",father:"XA1125",src:1},
{id:"XA1129",name:"اشفغ اوبك *",g:"M",father:"XA882",ext:true,src:1},
{id:"XA1130",name:"المختار *",g:"M",father:"XA1129",ext:true,src:1},
{id:"XA1131",name:"ياحموم *",g:"M",father:"XA1130",ext:true,src:1},
{id:"XA1132",name:"الأمين *",g:"M",father:"XA1131",ext:true,src:1},
{id:"XA1135",name:"بويان *",g:"M",father:"XA416",src:1,ext:true},
{id:"XA1136",name:"حومات *",g:"M",father:"XA1135",src:1,ext:true},
{id:"XA1137",name:"جاج *",g:"M",father:"XA1136",src:1,ext:true},
{id:"XA1138",name:"ميلود *",g:"M",father:"XA1137",src:1,ext:true},
{id:"XA1139",name:"محمذن كن *",g:"M",father:"XA1138",src:1,ext:true},
{id:"XA1140",name:"أحمد *",g:"M",father:"XA1139",src:1,ext:true},
{id:"XA1141",name:"سيد سالم *",g:"M",father:"XA1140",src:1,ext:true},
{id:"XA1142",name:"الشيخ *",g:"M",father:"XA1141",src:1,ext:true},
{id:"XA1144",name:"سيد الفالي *",g:"M",father:"XA486",ext:true,src:1},
{id:"XA1145",name:"الكوري *",g:"M",father:"XA1144",ext:true,src:1},
{id:"XA1146",name:"ديد (محمد) *",g:"M",father:"XA1145",ext:true,src:1},
{id:"XA1147",name:"شيخ البيظان (محمّد) *",g:"M",father:"XA32",src:1},
{id:"XA1148",name:"سيد أحمد *",g:"M",father:"XA1147",src:1},
{id:"XA1149",name:"المختار *",g:"M",father:"XA1148",src:1},
{id:"XA1150",name:"عبد الله *",g:"M",father:"XA1149",src:1},
{id:"Y94s1",name:"بِّد (محمّد) *",g:"M",father:"Y94",src:1},
{id:"XA1153",name:"ماهِ *",g:"M",father:"XA468",src:1,ext:true},
{id:"XA1154",name:"أحمد بنب *",g:"M",father:"XA1153",src:1,ext:true},
{id:"XA1156",name:"أحمد سالم *",g:"M",father:"XA434",src:1},
{id:"XA1157",name:"عبد الله *",g:"M",father:"XA1156",src:1},
{id:"XA1159",name:"ميلود *",g:"M",father:"XA833",src:1,ext:true},
{id:"XA1160",name:"عبد الله جنك *",g:"M",father:"XA1159",src:1,ext:true},
{id:"XA1161",name:"أحمد *",g:"M",father:"XA1160",src:1,ext:true},
{id:"XA1163",name:"محمد *",g:"M",father:"XA900",ext:true,src:1},
{id:"XA1165",name:"اشفغ عبد الله *",g:"M",father:"XA882",ext:true,src:1},
{id:"XA1166",name:"حامدت *",g:"M",father:"XA1165",ext:true,src:1},
{id:"XA1167",name:"الزبير *",g:"M",father:"XA1166",ext:true,src:1},
{id:"XA1168",name:"الجد *",g:"M",father:"XA1167",ext:true,src:1},
{id:"XA1169",name:"محمذن *",g:"M",father:"XA1168",ext:true,src:1},
{id:"XA1171",name:"أبو الحس *",g:"M",father:"XA786",src:1},
{id:"XA1172",name:"مهند (محنض) *",g:"M",father:"XA1171",src:1},
{id:"XA1173",name:"النيسابوري *",g:"M",father:"XA1172",src:1},
{id:"XA1174",name:"محمذن فال *",g:"M",father:"XA1173",src:1},
{id:"XA1175",name:"آبر *",g:"M",father:"XA1174",src:1},
{id:"XA1176",name:"بلى *",g:"M",father:"XA1175",src:1},
{id:"XA1177",name:"محمذن السالم *",g:"M",father:"XA1176",src:1},
{id:"XA1178",name:"ختّار *",g:"M",father:"XA1144",src:1,ext:true},
{id:"XA1183",name:"باب أحمد *",g:"M",father:"XA413",ext:true,src:1},
{id:"XA1185",name:"الأمين *",g:"M",father:"XA900",ext:true,src:1},
{id:"K44s6s1",name:"محمد *",g:"M",father:"K44s5",src:1},
{id:"XA1188",name:"عبد الله *",g:"M",father:"XA399",src:1,ext:true},
{id:"XA1189",name:"محمود *",g:"M",father:"XA1188",src:1,ext:true},
{id:"XA1190",name:"ابن عمر *",g:"M",father:"XA1189",src:1,ext:true},
{id:"XA1191",name:"يدنمّس *",g:"M",father:null,ext:true,src:1},
{id:"XA1192",name:"محنض ابوبك *",g:"M",father:"XA1191",ext:true,src:1},
{id:"XA1193",name:"ابنهنضام *",g:"M",father:"XA1192",ext:true,src:1},
{id:"XA1194",name:"ابّيّل (حيب الله) *",g:"M",father:"XA1193",ext:true,src:1},
{id:"XA1195",name:"محنض *",g:"M",father:"XA1194",ext:true,src:1},
{id:"XA1196",name:"السيد *",g:"M",father:null,ext:true,src:1},
{id:"XA1197",name:"ابراهيم *",g:"M",father:"XA1196",ext:true,src:1},
{id:"XA1198",name:"المختار *",g:"M",father:"XA1197",ext:true,src:1},
{id:"XA1199",name:"أحمد *",g:"M",father:"XA1198",ext:true,src:1},
{id:"XA1204",name:"المختار باب *",g:"M",father:"XA1382",src:1},
{id:"XA1205",name:"حمم *",g:"M",father:"XA1204",src:1},
{id:"XA1210",name:"الماح *",g:"M",father:"XA626",src:1,ext:true},
{id:"XA1211",name:"محنض *",g:"M",father:"XA1210",src:1,ext:true},
{id:"XA1212",name:"أحمد شينان *",g:"M",father:"XA1211",src:1,ext:true},
{id:"XA1213",name:"الأمين *",g:"M",father:"XA1212",src:1,ext:true},
{id:"XA1214",name:"اما *",g:"M",father:"XA1213",src:1,ext:true},
{id:"XA1215",name:"سيد *",g:"M",father:"XA1214",src:1,ext:true},
{id:"XA1216",name:"المختار *",g:"M",father:"XA1215",src:1,ext:true},
{id:"XA1217",name:"محمذن *",g:"M",father:"XA1216",src:1,ext:true},
{id:"XA1218",name:"أحمد سالم *",g:"M",father:"XA1217",src:1,ext:true},
{id:"XA1219",name:"اموّد *",g:"M",father:null,ext:true,src:1},
{id:"G83s2s1s1",name:"محمد *",g:"M",father:"G83s2s1",src:1},
{id:"XA1221",name:"شيخ التلاميذ *",g:"M",father:null,ext:true,src:1},
{id:"XA1222",name:"اشفغ الأمين *",g:"M",father:"XA1221",ext:true,src:1},
{id:"XA1223",name:"علي حبلل *",g:"M",father:"XA1222",ext:true,src:1},
{id:"XA1224",name:"الماح *",g:"M",father:"XA1223",ext:true,src:1},
{id:"XA1225",name:"محمذن *",g:"M",father:"XA1224",ext:true,src:1},
{id:"XA1226",name:"ألف *",g:"M",father:"XA1225",ext:true,src:1},
{id:"XA1227",name:"مينني *",g:"M",father:"XA1226",ext:true,src:1},
{id:"XA1228",name:"محمدا *",g:"M",father:"XA1227",ext:true,src:1},
{id:"XA1229",name:"الشيخ *",g:"M",father:"XA1228",ext:true,src:1},
{id:"XA1230",name:"بنان *",g:"M",father:null,ext:true,tribe:"أولاد بسبع",src:1},
{id:"XA1231",name:"عبد الله *",g:"M",father:"XA1230",ext:true,src:1},
{id:"XA1232",name:"أحمد شلل (بوميجو) *",g:"M",father:null,ext:true,src:1},
{id:"XA1233",name:"الكريم *",g:"M",father:"XA1232",ext:true,src:1},
{id:"XA1234",name:"حبلل *",g:"M",father:"XA1233",ext:true,src:1},
{id:"XA1235",name:"أحمد *",g:"M",father:"XA1234",ext:true,src:1},
{id:"XA1236",name:"عبد الله *",g:"M",father:"XA1235",ext:true,src:1},
{id:"XA1237",name:"المجتبى *",g:"M",father:"XA1236",ext:true,src:1},
{id:"XA1238",name:"أحمد *",g:"M",father:"XA1237",ext:true,src:1},
{id:"XA1242",name:"ابيهم *",g:"M",father:"XA636",src:1,ext:true},
{id:"XA1243",name:"الأمين *",g:"M",father:"XA1242",src:1,ext:true},
{id:"XA1244",name:"أحمد فال *",g:"M",father:"XA1178",src:1,ext:true},
{id:"XA1245",name:"محمد *",g:"M",father:"XA660",src:1,ext:true},
{id:"XA1246",name:"محمذن فال *",g:"M",father:"XA659",src:1,ext:true},
{id:"XA1247",name:"محمد *",g:"M",father:"XA1246",src:1,ext:true,spouses:["E52d1"]},
{id:"XA1248",name:"الحسن *",g:"M",father:null,ext:true,src:1,tribe:"ادوعلي"},
{id:"XA1249",name:"ختّار *",g:"M",father:"XA1248",ext:true,src:1},
{id:"XA1250",name:"الأمين *",g:"M",father:"XA1249",ext:true,src:1},
{id:"D46s2s3",name:"محمذن *",g:"M",father:"D46s2",src:1},
{id:"XA1258",name:"ابانا *",g:"M",father:"XA375",ext:true,src:1},
{id:"XA1259",name:"ميلود *",g:"M",father:"XA1258",ext:true,src:1},
{id:"XA1263",name:"شيفو *",g:"M",father:null,ext:true,src:1},
{id:"XA1264",name:"آمبوها *",g:"M",father:"XA1263",ext:true,src:1},
{id:"XA1265",name:"معطى مولانا *",g:"M",father:"XA1264",ext:true,src:1},
{id:"XA1266",name:"محمد *",g:"M",father:"XA1265",ext:true,src:1},
{id:"XA1267",name:"محمذ *",g:"M",father:"XA775",src:1,ext:true},
{id:"XA1268",name:"المامون *",g:"M",father:"XA1267",src:1,ext:true},
{id:"XA1269",name:"الفالي *",g:"M",father:"XA1268",src:1,ext:true},
{id:"XA1270",name:"محمذن *",g:"M",father:"XA1269",src:1,ext:true},
{id:"XA1271",name:"الشيخ أحمد *",g:"M",father:"XA1270",src:1,ext:true},
{id:"XA1272",name:"عبد الله *",g:"M",father:"XA1271",src:1,ext:true},
{id:"XA1274",name:"حبلل *",g:"M",father:"XA427",src:1,ext:true},
{id:"XA1275",name:"اَّمد (محمذن) *",g:"M",father:"XA1274",src:1,ext:true},
{id:"XA1276",name:"أحمد *",g:"M",father:"XA1275",src:1,ext:true},
{id:"XA1277",name:"عبد الله *",g:"M",father:"XA1276",src:1,ext:true},
{id:"XA1278",name:"أحمد *",g:"M",father:"XA1277",src:1,ext:true},
{id:"XA1279",name:"الكريم *",g:"M",father:"XA774",src:1,ext:true},
{id:"XA1283",name:"الأمين *",g:"M",father:"XA629",mother:"M1d3",src:1,ext:true},
{id:"XA1284",name:"سيد الفالي *",g:"M",father:"XA1283",src:1,ext:true},
{id:"XA1285",name:"الناهي (محمذن) *",g:"M",father:"XA1284",src:1,ext:true},
{id:"XA1286",name:"بوزروق *",g:"M",father:"XA628",src:1,ext:true},
{id:"XA1287",name:"هادي *",g:"M",father:"XA1286",src:1,ext:true},
{id:"XA1288",name:"سلمان *",g:"M",father:"XA1287",src:1,ext:true},
{id:"XA1289",name:"اموه (محمذن) *",g:"M",father:"XA1288",src:1,ext:true},
{id:"XA1290",name:"الأمين *",g:"M",father:"XA1289",src:1,ext:true},
{id:"XA1293",name:"ساسي *",g:"M",father:"XA740",src:1,ext:true},
{id:"XA1294",name:"الكوري *",g:"M",father:"XA1293",src:1,ext:true},
{id:"XA1295",name:"سريه *",g:"M",father:"XA1294",src:1,ext:true},
{id:"XA1296",name:"سيد أحمد *",g:"M",father:"XA1295",src:1,ext:true},
{id:"XA1297",name:"أحمد *",g:"M",father:"XA1296",src:1,ext:true},
{id:"XA1299",name:"محمد *",g:"M",father:"XA541",src:1,ext:true},
{id:"Y148s2",name:"محمذن *",g:"M",father:"Y148",src:1},
{id:"XA1301",name:"باب الدين *",g:"M",father:null,ext:true,src:1},
{id:"R65s1s1s2",name:"الأمين *",g:"M",father:"R65s1s1",src:1},
{id:"R65s1s1s3",name:"محمذن *",g:"M",father:"R65s1s1",src:1},
{id:"XA1304",name:"عبد الله *",g:"M",father:"XA803",src:1,ext:true},
{id:"XA1306",name:"بنيوك *",g:"M",father:"XA503",ext:true,src:1},
{id:"XA1307",name:"كروم *",g:"M",father:"XA1306",ext:true,src:1},
{id:"XA1308",name:"ابراهيم *",g:"M",father:"XA1307",ext:true,src:1},
{id:"XA1309",name:"عاليوه *",g:"M",father:"XA1308",ext:true,src:1},
{id:"XA1310",name:"عثمان *",g:"M",father:"XA1309",ext:true,src:1},
{id:"XA1311",name:"الرباني *",g:"M",father:"XA1310",ext:true,src:1},
{id:"XA1312",name:"محمدا *",g:"M",father:"XA1236",src:1,ext:true},
{id:"XA1313",name:"أحمد *",g:"M",father:"XA1312",src:1,ext:true},
{id:"XA1315",name:"عبد الله *",g:"M",father:"XA500",ext:true,src:1},
{id:"XA1317",name:"بال -إلى محم *",g:"M",father:"XA882",ext:true,src:1},
{id:"XA1318",name:"محمذن *",g:"M",father:"XA1317",ext:true,src:1},
{id:"XA1319",name:"امام *",g:"M",father:null,src:1},
{id:"XA1321",name:"متيلي *",g:"M",father:"XA1029",src:1,ext:true,spouses:["Y4d2"]},
{id:"XA1322",name:"محنض *",g:"M",father:"XA1321",mother:"Y4d2",src:1,ext:true},
{id:"XA1323",name:"محمذن *",g:"M",father:"XA1322",src:1,ext:true},
{id:"XA1324",name:"الكوري *",g:"M",father:"XA1323",src:1,ext:true},
{id:"XA1325",name:"ميلود *",g:"M",father:"XA786",src:1,ext:true},
{id:"XA1326",name:"المبارك *",g:"M",father:"XA1325",src:1,ext:true},
{id:"XA1327",name:"محمذن *",g:"M",father:"XA1326",src:1,ext:true},
{id:"K152s1",name:"المداح *",g:"M",father:"K152",src:1},
{id:"K152s1s1",name:"محمد اسغير *",g:"M",father:"K152s1",src:1},
{id:"K152s1s1s1",name:"سيد أحمد *",g:"M",father:"K152s1s1",src:1},
{id:"K152s1s1s1s1",name:"محمذن *",g:"M",father:"K152s1s1s1",src:1},
{id:"XA1332",name:"محنض *",g:"M",father:"XA1286",src:1,ext:true},
{id:"XA1333",name:"عبد الله *",g:"M",father:"XA1332",src:1,ext:true},
{id:"XA1334",name:"محمذن *",g:"M",father:"XA1333",src:1,ext:true},
{id:"XA1336",name:"بو الفالي *",g:"M",father:null,ext:true,src:1},
{id:"XA1337",name:"سيد *",g:"M",father:"XA1336",ext:true,src:1},
{id:"XA1338",name:"محمذن *",g:"M",father:"XA1337",ext:true,src:1},
{id:"XA1340",name:"بنعمر *",g:"M",father:null,ext:true,src:1},
{id:"XA1341",name:"اشفغ اعمر *",g:"M",father:"XA1340",ext:true,src:1},
{id:"XA1342",name:"محمد *",g:"M",father:"XA1341",ext:true,src:1},
{id:"XA1343",name:"عبد الله *",g:"M",father:"XA1342",ext:true,src:1},
{id:"XA1344",name:"محمذن *",g:"M",father:"XA1343",ext:true,src:1},
{id:"XA1345",name:"أحمد *",g:"M",father:"XA1344",ext:true,src:1},
{id:"XA1346",name:"حبيين *",g:"M",father:"XA1023",src:1,ext:true},
{id:"XA1347",name:"محمذن *",g:"M",father:"XA1346",src:1,ext:true},
{id:"XA1348",name:"ميلود *",g:"M",father:"XA1347",src:1,ext:true},
{id:"XA1349",name:"اندى (عبد الله) *",g:"M",father:"XA1348",src:1,ext:true},
{id:"XA1350",name:"محمذن *",g:"M",father:"XA1321",mother:"Y4d2",src:1,ext:true},
{id:"XA1351",name:"احمويلل *",g:"M",father:"XA1382",src:1},
{id:"XA1352",name:"ينصر (المختار) *",g:"M",father:"XA1351",src:1},
{id:"XA1353",name:"ابو الحس *",g:"M",father:null,ext:true,src:1},
{id:"XA1354",name:"الأمين لد حمم *",g:"M",father:"XA1353",ext:true,src:1},
{id:"XA1355",name:"عبد الودود *",g:"M",father:"XA1354",ext:true,src:1},
{id:"XA1356",name:"احمد امبيريك *",g:"M",father:"XA1355",ext:true,src:1},
{id:"XA1359",name:"حبييب *",g:"M",father:"XA1171",src:1,ext:true},
{id:"XA1360",name:"المبارك *",g:"M",father:"XA1359",src:1,ext:true},
{id:"XA1361",name:"آب *",g:"M",father:"XA1360",src:1,ext:true},
{id:"XA1362",name:"عمر *",g:"M",father:"XA1361",src:1,ext:true},
{id:"XA1363",name:"الأمين *",g:"M",father:"XA370",src:1,ext:true,spouses:["P48d2"]},
{id:"XA1365",name:"حبل *",g:"M",father:"XA1114",src:1},
{id:"XA1366",name:"سيد احمد *",g:"M",father:"XA1365",src:1},
{id:"XA1367",name:"المختار *",g:"M",father:"XA1366",src:1},
{id:"XA1368",name:"ابوبا (ببكر) *",g:"M",father:"XA1367",src:1},
{id:"XA1369",name:"احمد سالم *",g:"M",father:"XA1368",src:1},
{id:"XA1370",name:"قاير *",g:"M",father:"XA1369",src:1},
{id:"XA1371",name:"الكوري *",g:"M",father:null,ext:true,src:1},
{id:"XA1372",name:"احويج *",g:"M",father:null,ext:true,src:1},
{id:"XA1373",name:"عالي *",g:"M",father:"XA1372",ext:true,src:1},
{id:"XA1374",name:"محمذن *",g:"M",father:"XA1373",ext:true,src:1},
{id:"XA1377",name:"عبد الله *",g:"M",father:"XA1072",ext:true,src:1},
{id:"XA1378",name:"ميلود *",g:"M",father:null,tribe:"اداهبم اولاد ابيريي",src:1},
{id:"XA1382",name:"سيد محمد *",g:"M",father:"XA387",ext:true,src:1},
{id:"XA1383",name:"لمرابط اشفغ عبد الله *",g:"M",father:null,src:1},
{id:"XA1384",name:"عبد الله *",g:"M",father:"XA1383",src:1},
{id:"R65s1s2",name:"الأمين *",g:"M",father:"R65s1",mother:"Z3d7",src:1},
{id:"R65s1s2s1",name:"محمذن *",g:"M",father:"R65s1s2",src:1},
{id:"XA1387",name:"اشفغ حييا *",g:"M",father:"XA774",src:1,ext:true},
{id:"XA1388",name:"محمد *",g:"M",father:"XA1387",src:1,ext:true},
{id:"XA1389",name:"المختار *",g:"M",father:"XA1388",src:1,ext:true},
{id:"XA1390",name:"محمذن *",g:"M",father:"XA1389",src:1,ext:true},
{id:"XA1392",name:"يالليل *",g:"M",father:"XA1351",src:1},
{id:"XA1393",name:"ابييب *",g:"M",father:"XA1392",src:1},
{id:"XA1395",name:"الفالي *",g:"M",father:"XA1183",src:1,ext:true},
{id:"XA1396",name:"حبيبنا *",g:"M",father:"XA1395",src:1,ext:true},
{id:"D46s3s3",name:"الأمين *",g:"M",father:"D46s3",src:1,spouses:["Z3d4"]},
{id:"XA1398",name:"القاظي *",g:"M",father:"XA1351",src:1},
{id:"XA1399",name:"المختار *",g:"M",father:"XA1398",src:1},
{id:"XA1404",name:"باباحنيد *",g:"M",father:"XA1124",ext:true,src:1},
{id:"XA1405",name:"ياحممذ *",g:"M",father:"XA1404",ext:true,src:1},
{id:"XA1406",name:"الأمين *",g:"M",father:"XA1405",ext:true,src:1},
{id:"XA1407",name:"باليل *",g:"M",father:"XA1404",src:1,ext:true},
{id:"XA1408",name:"حبيب الرحمن *",g:"M",father:"XA924",src:1,ext:true},
{id:"XA1409",name:"المصطفى *",g:"M",father:"XA1408",src:1,ext:true},
{id:"XA1410",name:"عبد الله *",g:"M",father:"XA1409",src:1,ext:true},
{id:"XA1412",name:"اشفغ يدن هنض *",g:"M",father:"XA633",src:1,ext:true},
{id:"XA1413",name:"يعقوب *",g:"M",father:"XA1412",src:1,ext:true},
{id:"XA1414",name:"اشفغ ايتجمذن (احمد) *",g:"M",father:"XA1413",src:1,ext:true},
{id:"XA1415",name:"اشفغ المختار *",g:"M",father:"XA1414",src:1,ext:true},
{id:"XA1416",name:"محمد *",g:"M",father:"XA1415",src:1,ext:true},
{id:"G56s1s2",name:"محمذن *",g:"M",father:"G56s1",src:1},
{id:"G56s1s2s1",name:"المختار *",g:"M",father:"G56s1s2",src:1},
{id:"XA1423",name:"ماه *",g:"M",father:null,src:1},
{id:"XA1424",name:"ابوبا *",g:"M",father:"XA1423",src:1},
{id:"XA1425",name:"عركاب (حمم) *",g:"M",father:"XA1424",src:1},
{id:"XA1426",name:"محمذن *",g:"M",father:"XA1425",src:1},
{id:"XA1430",name:"محمذن *",g:"M",father:"XA1089",src:1,ext:true},
{id:"XA1432",name:"أوطا *",g:"M",father:null,ext:true,src:1},
{id:"G66",para:66,name:"الأمين",g:"M",father:"G65",mother:"G42d2",spouses:["G66w1"]},
{id:"G66w1",name:"سلمه",g:"F",father:null,note:"بنت احماده بن المختار بن المامي بن أحمد ميلود بن محمد بن اشفغ مينحنو",spouses:["G66"]},
{id:"F25",para:25,name:"محمد عبد الله",g:"M",father:"F24",mother:"F24w1",dates:"1372هـ/1953م – 1433هـ/2012م",place:"أبير حيبلل",spouses:["F47d1"]},
{id:"F25s1",name:"الشيخ أحمد",g:"M",father:"F25",mother:"F47d1",dates:"1419هـ/1998م –"},
{id:"F25s2",name:"البشير",g:"M",father:"F25",mother:"F47d1",dates:"1421هـ/2000م –"},
{id:"F25s3",name:"ادّاه",g:"M",father:"F25",mother:"F47d1",dates:"1425هـ/2004م –"},
{id:"F25d1",name:"مريم",g:"F",father:"F25",mother:"F47d1",dates:"1428هـ/2007م –"},
{id:"F25d2",name:"خديجة",g:"F",father:"F25",mother:"F47d1",dates:"1431هـ/2010م –"},
{id:"F35",para:35,name:"سيد محمود",g:"M",father:"F34",mother:"F34w1",dates:"1391هـ/1971م –",spouses:["F35w1"]},
{id:"F35w1",name:"ميَّم (مريم)",g:"F",father:null,dates:"1401هـ/1981م –",note:"بنت أحمد بن أحمد بن ايَّاي (أحمد) بن ديّاه (سيد الفالي) بن محمذن بن الفالي بن المبارك بن اما (الماقور)",spouses:["F35"]},
{id:"F35d1",name:"تحيو",g:"F",father:"F35",mother:"F35w1",dates:"1427هـ/2006م –"},
{id:"F35d2",name:"العمره",g:"F",father:"F35",mother:"F35w1",dates:"1429هـ/2008م –"},
{id:"F101",para:101,name:"الزكي (محمدن)",g:"M",father:"F99",mother:"F26d1",dates:"1400هـ/1980م –",spouses:["F101w1"]},
{id:"F101w1",name:"فاطمة",g:"F",father:null,dates:"1405هـ/1985م –",note:"بنت اكاه (ببكر) بن محمد بن ايَّاي (أحمد) بن ديّاه (سيد الفالي) بن محمذن بن الفالي بن المبارك بن اما (الماقور)",spouses:["F101"]},
{id:"F101s1",name:"أحمد",g:"M",father:"F101",mother:"F101w1",dates:"1434هـ/2013م –"},
{id:"E40",para:40,name:"سيد الفالي",g:"M",father:"E32",spouses:["E40w1"]},
{id:"E40w1",name:"امنيانه",g:"F",father:null,note:"بنت محمذن بن الخلف",spouses:["E40"]},
{id:"E40d1",name:"مريم",g:"F",father:"E40",mother:"E40w1",note:"لم تعقب"},
{id:"M49",para:49,name:"محمد",g:"M",father:"M25",mother:"M67d1",dates:"1310هـ/1897م – 1355هـ/1936م",place:"اتاكاللت",spouses:["M49w1"]},
{id:"Y117",para:117,name:"محمذن",g:"M",father:"Y113",spouses:["Y117w1"]},
{id:"Y117w1",name:"منت وهب (ام النبي)",g:"F",father:null,note:"بنت سيد محمود بن عبد بن أحمد بن خاجيل بن امرابط مكو؛ أم عائشة بنت ببكر بن المختار بن محمذن بن الكوري، وأم سيد أحمد بن سيدنا بن المختار بن محمذن بن الكوري، وأم محمدن بن جد أم بن بابكر بن حرمه",spouses:["Y117"]},
{id:"Z11d1",name:"الصغرى",g:"F",father:"Z11",mother:"E55d2",note:"لم تعقب"},
{id:"Z12d1",name:"اخت امها",g:"F",father:"Z12",mother:"Z12w1",note:"أم أحمد الربا ومحمد سالم ومحمد والمختار من أبناء بكن بن اَّمِّـن (محمذن) بن بوبكر بن محم بن ابو الحس بن المزضف",spouses:["Z22"]},
{id:"Z13s1",name:"أحمد",g:"M",father:"Z13",mother:"Z13w1",note:"لم يعقب"},
{id:"Z15s1",name:"الزهره",g:"M",father:"Z15",mother:"Z15w1",note:"لم تعقب"},
{id:"Z16d1",name:"صفيّه",g:"F",father:"Z16",mother:"K73d1",dates:"1367هـ/1948م –",note:"أم أبناء بنَّب بن سيد بن اتاه (المختار ام) بن محمذن بن أحمد بن محمد العاقل"},
{id:"Z16s1",name:"أحمد",g:"M",father:"Z16",mother:"K73d1",dates:"1372هـ/1953م – 1402هـ/1982م",place:"أبير حيبلل",note:"لم يعقب"},
{id:"Z16w2",name:"أم الخيري",g:"F",father:null,dates:"1375هـ/1955م –",note:"بنت الأمين بن أحمد بن ابن عبدم بن عبد الله بن الأمين بن محم بن ابو الحس بن المزضف",spouses:["Z16"]},
{id:"Z17s1",name:"محمد فال",g:"M",father:"Z17",mother:"Z17w1",dates:"1407هـ/1987م –"},
{id:"Z17s2",name:"الدَّاه (محمد عبد الله)",g:"M",father:"Z17",mother:"Z17w1",dates:"1412هـ/1992م –"},
{id:"Z17d3",name:"يسر",g:"F",father:"Z17",mother:"Z17w1",dates:"1415هـ/1995م –"},
{id:"Z17d4",name:"ساره",g:"F",father:"Z17",mother:"Z17w1",dates:"1418هـ/1997م –"},
{id:"Z17s3",name:"أحمد",g:"M",father:"Z17",mother:"Z17w1",dates:"1425هـ/2003م –"},
{id:"Z18w2",name:"بت",g:"F",father:null,note:"بنت ابراهيم بن المختار بن محمذن بن الغالي بن باركلل بن بو الماح بن متيلي (المختار)",spouses:["Z18"]},
{id:"Z18s1",name:"محمدن",g:"M",father:"Z18",mother:"Z18w1",note:"لم يعقب"},
{id:"Z21w6",name:"رقيه",g:"F",father:null,tribe:"ادوعلي",ext:true,spouses:["Z21"]},
{id:"Z21w7",name:"مريم",g:"F",father:null,note:"بنت المختار بن اسحاق — اهل باركلل",spouses:["Z21"]},
{id:"Z21d2",name:"فاطمة",g:"F",father:"Z21",mother:"Z21w6",place:"اكماط",note:"أم أبناء الدَّاه (عبد الله) بن أحمد بن محمد الباقر بن محم بن ابو الحس بن المزضف",spouses:["Z49"]},
{id:"Z22s2",name:"أحمد البرا",g:"M",father:"Z22",mother:"Z12d1",place:"تنيخلف",note:"لم يعقب"},
{id:"Z22s3",name:"محمد",g:"M",father:"Z22",mother:"Z12d1",note:"لم يعقب"},
{id:"Z22s4",name:"محمد سالم",g:"M",father:"Z22",mother:"Z12d1",note:"لم يعقب"},
{id:"Z22s5",name:"عبد الله",g:"M",father:"Z22",mother:"Z26w1",note:"لم يعقب"},
{id:"Z25d2",name:"زينب",g:"F",father:"Z25",mother:"Z25w1",dates:"1412هـ/1992م – 1413هـ/1993م",place:"المذرذره"},
{id:"Z25d3",name:"عيشه",g:"F",father:"Z25",mother:"Z25w1",dates:"1413هـ/1994م –"},
{id:"Z25s4",name:"أحمد حيدره",g:"M",father:"Z25",mother:"Z25w1",dates:"1419هـ/1998م –"},
{id:"Z26d1",name:"فلانة",g:"F",father:"Z26",mother:"Z26w1",note:"لم تعقب"},
{id:"Z26d2",name:"فلانة",g:"F",father:"Z26",mother:"Z26w1",note:"لم تعقب"},
{id:"Z29d1",name:"ميِّي",g:"F",father:"Z29",mother:"R27d1",dates:"1395هـ/1975م –",note:"أم أبناء اباه بن سيد أحمد بن محمد بن اياي (أحمد) بن ديّاه (سيد الفالي) بن محمذن بن الفالي بن المبارك بن اما (الماقور)"},
{id:"Z29w2",name:"خديجة",g:"F",father:null,note:"بنت العتيق السالم بن المختار بن ديّاه (سيد الفالي) بن محمذن بن الفالي بن المبارك بن اما (الماقور)",spouses:["Z29"]},
{id:"Z29s5",name:"مام (محمد)",g:"M",father:"Z29",mother:"Z29w2",dates:"1396هـ/1976م –"},
{id:"Z29d2",name:"فاطمة",g:"F",father:"Z29",mother:"Z29w2",dates:"1399هـ/1979م –"},
{id:"Z29s6",name:"أحمد",g:"M",father:"Z29",mother:"Z29w2",dates:"1401هـ/1981م –"},
{id:"Z30s1",name:"محمد",g:"M",father:"Z30",mother:"Z30w1",dates:"1425هـ/2004م –"},
{id:"Z30d1",name:"اتَّـات",g:"F",father:"Z30",mother:"Z30w1",dates:"1428هـ/2007م –"},
{id:"Z30s2",name:"محمد فال",g:"M",father:"Z30",mother:"Z30w1",dates:"1430هـ/2009م –"},
{id:"Z31s1",name:"عزيز",g:"M",father:"Z31",mother:"Z31w1",dates:"1425هـ/2004م –"},
{id:"Z31d1",name:"آمال",g:"F",father:"Z31",mother:"Z31w1",dates:"1427هـ/2006م –"},
{id:"Z32w2",name:"ربيعو (فاطمة الزهراء)",g:"F",father:null,note:"بنت حارود بن أحمد بن محمد سالم بن محنض باب بن اسحاق بن بدر الدين بن الفالي بن أحمد زروق",dates:"1405هـ/1985م –",spouses:["Z32"]},
{id:"Z32s1",name:"فلان",g:"M",father:"Z32",mother:"Z32w2",note:"لم يعقب"},
{id:"Z32s2",name:"فلان",g:"M",father:"Z32",mother:"Z32w2",note:"لم يعقب"},
{id:"Z34s2",name:"فلان",g:"M",father:"Z34",mother:"Z34w1",note:"يعقب"},
{id:"Z34s3",name:"فلان",g:"M",father:"Z34",mother:"Z34w1",note:"يعقب"},
{id:"Z35d1",name:"ميمونه",g:"F",father:"Z35",mother:"Z35w1",note:"لم تعقب"},
{id:"Z37d1",name:"أم كلثوم",g:"F",father:"Z37",mother:"Z37w1",note:"أم أحمد سالم بن محمد محمود بن احظانا -ادوكدشلل-"},
{id:"Z37w2",name:"فلانة -اديقب-",g:"F",father:null,spouses:["Z37"]},
{id:"Z37d2",name:"آمنة",g:"F",father:"Z37",mother:"Z37w1",note:"أم فلان من أهل الطالب عثمان -لكالكمو-"},
{id:"Z37d3",name:"الصغرى",g:"F",father:"Z37",mother:"Z37w1",note:"لم تعقب"},
{id:"Z37d4",name:"محجوبه",g:"F",father:"Z37",mother:"Z37w1",note:"أم محمد الكوري بن محمد بن محمد المختار بن مهد"},
{id:"Z37d5",name:"خديجة",g:"F",father:"Z37",mother:"Z37w1",note:"أم السالكو وخادم الله وامتيت بنات حيب الله بن سيد أحمد المغيث بن المختار بن المصطفى بن حبيب الله نا المختار"},
{id:"Z37d6",name:"النَّانَّه",g:"F",father:"Z37",mother:"Z37w2",note:"لم تعقب"},
{id:"Z38d1",name:"أم كلثوم",g:"F",father:"Z38",mother:"Z38w1",note:"أم أبناء محمد الأمين بن أحمد محمود بن بياله بن المختار بن المصطفى بن حبيب الله نا المختار"},
{id:"Z37s1",name:"محمد",g:"M",father:"Z37",mother:"Z37w1",note:"لم يعقب"},
{id:"Z38s1",name:"محمد",g:"M",father:"Z38",mother:"Z38w1",note:"لم يعقب"},
{id:"Z38d2",name:"تسلم",g:"F",father:"Z38",mother:"Z38w1",note:"أم بعض أبناء محمد المختار بن بياله بن المختار بن المصطفى بن حبيب الله نا المختار"},
{id:"Z38d3",name:"مريم",g:"F",father:"Z38",mother:"Z38w1",note:"أم بعض أبناء محمد المختار بن بياله بن المختار بن المصطفى بن حبيب الله نا المختار"},
{id:"Z39s1",name:"أحمد سالم",g:"M",father:"Z39",mother:"Z39w1"},
{id:"Z39s2",name:"علي",g:"M",father:"Z39",mother:"Z39w1"},
{id:"Z39s3",name:"محمد",g:"M",father:"Z39",mother:"Z39w1"},
{id:"Z39s4",name:"ناصر الدين",g:"M",father:"Z39",mother:"Z39w1"},
{id:"Z39d1",name:"أم كلثوم",g:"F",father:"Z39",mother:"Z39w1"},
{id:"Z39d2",name:"خديجة",g:"F",father:"Z39",mother:"Z39w1"},
{id:"Z40d1",name:"أم المؤمنين",g:"F",father:"Z40",mother:"Z40w1",dates:"1355هـ/1936م – 1437هـ/2016م",place:"أحسي السعادة",note:"أم أبناء محمذن بن الطالب عثمان -لكالكمو-"},
{id:"Z40d2",name:"فاطمة",g:"F",father:"Z40",mother:"Z40w1"},
{id:"Z41d1",name:"آمنة",g:"F",father:"Z41",mother:"Z41w1"},
{id:"Z42s1",name:"المختار",g:"M",father:"Z42",mother:"Z42w1"},
{id:"Z42s2",name:"محمدن",g:"M",father:"Z42",mother:"Z42w1"},
{id:"Z43d1",name:"أم المؤمنين",g:"F",father:"Z43",mother:"E43d1",note:"لم تعقب"},
{id:"Z46s1",name:"محمد",g:"M",father:"Z46",mother:"Z70d2",note:"لم يعقب"},
{id:"Z49d1",name:"ميمونو",g:"F",father:"Z49",mother:"Z21d2",place:"تنيخلف",note:"لم تعقب"},
{id:"Z50d1",name:"عائشة",g:"F",father:"Z50",mother:"Z50w2",dates:"1357هـ/1938م –",note:"أم غير صفيو من أبناء ببها بن ابَّيا بن اَّما بن محمد بن محمذن بن عركاب (محم) بن ابوبا (الأمين) بن ماه"},
{id:"Z52s1",name:"سيد عمار",g:"M",father:"Z52",mother:"Z52w1",dates:"1412هـ/1992م –"},
{id:"Z52s2",name:"أحمد سالم",g:"M",father:"Z52",mother:"Z52w1",dates:"1415هـ/1995م –"},
{id:"Z52d1",name:"آسية",g:"F",father:"Z52",mother:"Z52w1",dates:"1421هـ/2000م –"},
{id:"Z52s3",name:"محمد المختار",g:"M",father:"Z52",mother:"Z52w2",dates:"1427هـ/2006م –"},
{id:"Z54d1",name:"مريم",g:"F",father:"Z54",mother:"Z54w1",dates:"1398هـ/1978م –",note:"أم أبناء امن بن أحمد بن امن -اداهبم-"},
{id:"Z54s1",name:"الأمين",g:"M",father:"Z54",mother:"Z54w1",dates:"1401هـ/1981م –"},
{id:"Z54d2",name:"أم الخيري",g:"F",father:"Z54",mother:"Z54w1",dates:"1405هـ/1985م –"},
{id:"Z54s2",name:"أحمد سالم",g:"M",father:"Z54",mother:"Z54w1",dates:"1408هـ/1988م –"},
{id:"Z54d3",name:"آمنة",g:"F",father:"Z54",mother:"Z54w1",dates:"1413هـ/1993م –"},
{id:"Z55s1",name:"فلان",g:"M",father:"Z55",mother:"Z55w1"},
{id:"Z56d1",name:"فايزه",g:"F",father:"Z56",mother:"Z56w1",dates:"1406هـ/1986م –"},
{id:"Z56s1",name:"القطب",g:"M",father:"Z56",mother:"Z56w1",dates:"1407هـ/1987م –"},
{id:"Z56s2",name:"محمدن",g:"M",father:"Z56",mother:"Z56w1",dates:"1410هـ/1990م –"},
{id:"Z56d2",name:"توت",g:"F",father:"Z56",mother:"Z56w1",dates:"1413هـ/1994م –"},
{id:"Z57w2",name:"مريم",g:"F",father:null,dates:"1400هـ/1980م –",note:"بنت رمظان",spouses:["Z57"],ext:true},
{id:"Z57s1",name:"محمد",g:"M",father:"Z57",mother:"Z57w1",dates:"1402هـ/1982م –"},
{id:"Z57s2",name:"أحمد",g:"M",father:"Z57",mother:"Z57w1",dates:"1404هـ/1984م –"},
{id:"Z57d1",name:"عصا موسى",g:"F",father:"Z57",mother:"Z57w2",dates:"1422هـ/2001م –"},
{id:"Z57d2",name:"ابَّابَّو",g:"F",father:"Z57",mother:"Z57w2",dates:"1429هـ/2008م –"},
{id:"Z59s1",name:"أحمد",g:"M",father:"Z59",mother:"K74w1",dates:"1406هـ/1986م –"},
{id:"Z59s2",name:"ابَّـدَّ (محمد اليدالي)",g:"M",father:"Z59",mother:"K74w1",dates:"1411هـ/1991م –"},
{id:"Z59s3",name:"اباه",g:"M",father:"Z59",mother:"K74w1",dates:"1413هـ/1993م –"},
{id:"Z59d1",name:"احبيبو",g:"F",father:"Z59",mother:"K74w1",dates:"1420هـ/1999م –"},
{id:"Z59d2",name:"توت",g:"F",father:"Z59",mother:"K74w1",dates:"1422هـ/2001م –"},
{id:"Z60d1",name:"باره",g:"F",father:"Z60",mother:"V27d2",dates:"1435هـ/2014م –"},
{id:"Z61d1",name:"النصره",g:"F",father:"Z61",mother:"Z61w1",dates:"1438هـ/2016م –"},
{id:"Z63w2",name:"مام كمبو -سنغال-",g:"F",father:null,spouses:["Z63"],ext:true},
{id:"Z63w3",name:"زينب",g:"F",father:null,note:"بنت دحود (محمد محمود) بن أحمد سالم بن احمدناه بن الأمين بن محمد بن الحاج بن جيجات بن الحاج أحمد -اچكوچي-",spouses:["Z63"],ext:true},
{id:"Z64s1",name:"محمد الأمين",g:"M",father:"Z64",mother:"Z64w1",dates:"1408هـ/1988م –"},
{id:"Z64s2",name:"المختار اسلامو",g:"M",father:"Z64",mother:"Z64w1",dates:"1409هـ/1989م –"},
{id:"Z64d1",name:"خيرا",g:"F",father:"Z64",mother:"Z64w1",dates:"1421هـ/2000م –"},
{id:"Z65w2",name:"آمنة",g:"F",father:null,note:"بنت بياد بن احمي بن محمد الهدى بن محنض الكوري",spouses:["Z65"],ext:true},
{id:"Z65s1",name:"محمد الأمين",g:"M",father:"Z65",mother:"Z65w1",dates:"1415هـ/1995م –"},
{id:"Z65s2",name:"الطالب",g:"M",father:"Z65",mother:"Z65w1",dates:"1419هـ/1998م –"},
{id:"Z65s3",name:"أحمد",g:"M",father:"Z65",mother:"Z65w1",dates:"1421هـ/2000م –"},
{id:"Z65s4",name:"ادّد",g:"M",father:"Z65",mother:"Z65w2",dates:"1426هـ/2005م –"},
{id:"Z65d1",name:"نزيهو",g:"F",father:"Z65",mother:"Z65w2",dates:"1430هـ/2009م –"},
{id:"Z66w3",name:"مريم سومارنو -اندنوسيا-",g:"F",father:null,spouses:["Z66"],ext:true},
{id:"Z66s1",name:"أحمد",g:"M",father:"Z66",mother:"Z66w1",dates:"1412هـ/1992م –"},
{id:"Z66s2",name:"الياس",g:"M",father:"Z66",mother:"Z66w3",dates:"1415هـ/1995م –"},
{id:"Z66d1",name:"مانو",g:"F",father:"Z66",mother:"Z66w3",dates:"1420هـ/1999م –"},
{id:"Z66d2",name:"عايشا",g:"F",father:"Z66",mother:"Z66w2",dates:"1426هـ/2005م –"},
{id:"Z66s3",name:"اباه (جنك)",g:"M",father:"Z66",mother:"Z66w2",dates:"1428هـ/2007م –"},
{id:"Z66d3",name:"فلانو",g:"F",father:"Z66",mother:"Z66w2",dates:"1431هـ/2010م –"},
{id:"Z66s4",name:"فلان",g:"M",father:"Z66",mother:"Z66w2"},
{id:"Z67s1",name:"محمد",g:"M",father:"Z67",mother:"Z67w1",dates:"1426هـ/2005م –"},
{id:"Z68s1",name:"جمال",g:"M",father:"Z68",mother:"Z68w1",dates:"1426هـ/2005م –"},
{id:"Z68s2",name:"رسول",g:"M",father:"Z68",mother:"Z68w1",dates:"1429هـ/2008م –"},
{id:"Z69d1",name:"أم الخيرات",g:"F",father:"Z69",mother:"Z69w1",note:"لم تعقب"},
{id:"Z69d2",name:"اماتو",g:"F",father:"Z69",mother:"Z69w1",note:"لم تعقب"},
{id:"Z69d3",name:"خديجة",g:"F",father:"Z69",mother:"Z69w1",note:"لم تعقب"},
{id:"Z69d4",name:"مريم",g:"F",father:"Z69",mother:"Z69w1",note:"لم تعقب"},
{id:"Z72w2",name:"فاطمة",g:"F",father:null,note:"بنت احميدَّ بن الفالي بن الغالوي بن أحمد الورع بن الفالي بن باب أحمد",place:"تنيخلف",spouses:["Z72"],ext:true},
{id:"Z73w3",name:"أم المؤمنين",g:"F",father:"Z148",spouses:["Z73"]},
{id:"Z73d1",name:"مسعوده",g:"F",father:"Z73",mother:"Z73w3",dates:"1301هـ/1884م –",place:"المذرذره",note:"لم تعقب"},
{id:"Z73s1",name:"أحمد سالم",g:"M",father:"Z73",mother:"Z93d1",dates:"1315هـ/1899م –",note:"مفقود"},
{id:"Z74w4",name:"الغاليو",g:"F",father:null,note:"بنت محمد بن سيد أحمد بن اشريقي -اولاد غيلان- ؛ أم أبناء ابراهيم بن البنيو -اولاد غيلان-",spouses:["Z74"],ext:true},
{id:"Z74s1",name:"أحمد",g:"M",father:"Z74",mother:"Z74w4",dates:"1349هـ/1931م – 1358هـ/1939م",place:"بوتلميت",note:"مات صغيرا"},
{id:"Z74d1",name:"اَمِّن",g:"F",father:"Z74",mother:"Z74w2",dates:"1354هـ/1935م – 1437هـ/2016م",place:"دليلحو",note:"أم أبناء محمد المختار بن محمد فال بن باب بن أحمد بيب بن عثمان بن سيد محمد بن عبد الرحمن"},
{id:"Z74d2",name:"عائشة",g:"F",father:"Z74",mother:"Z74w2",dates:"1361هـ/1942م –",note:"أم أبناء أحمد بن ابَّيا بن اَمَّا (محمذن) بن محمد بن محمذن بن عركاب (محم) بن ابوبا (الأمين) بن ماه"},
{id:"Z75w3",name:"اَميـن",g:"F",father:null,dates:"1378هـ/1959م –",note:"بنت هيدي (سيد) بن ابو (محمد) بن (محمذن) بن اَما بن محمد بن محمذن بن عركاب (محم) بن ابوبا (الأمين) بن ماه",spouses:["Z75"],ext:true},
{id:"Z75d1",name:"اميو",g:"F",father:"Z75",mother:"Z75w2",dates:"1401هـ/1981م –",note:"أم أبناء الأمين بن محمدن بن محمد بن امبيريك بن ميلود بن محمذن بن حبيني بن أحمد اكذا المختار"},
{id:"Z75d2",name:"أم الخيري",g:"F",father:"Z75",mother:"Z75w3",dates:"1411هـ/1991م –"},
{id:"Z75w4",name:"ليلة",g:"F",father:null,note:"بنت يكرب (محمد سالم) بن محمد بن تتاه (المختار) بن ببكر بن سعيد بن اشفغ حيبلل",spouses:["Z75"],ext:true},
{id:"Z75d3",name:"ميمونو",g:"F",father:"Z75",mother:"Z75w4",dates:"1415هـ/1995م –"},
{id:"Z75d4",name:"الغاليو",g:"F",father:"Z75",mother:"Z75w4",dates:"1419هـ/1998م –"},
{id:"Z75d5",name:"عائشة",g:"F",father:"Z75",mother:"Z75w4",dates:"1422هـ/2001م –"},
{id:"Z76w2",name:"عائشة",g:"F",father:null,dates:"1409هـ/1989م –",note:"بنت أحمد بن سيد أحمد بن محمد بن اياي (أحمد) بن دياه (سيد الفالي) بن محمذن بن الفالي بن المبارك بن اما (الماقور)",spouses:["Z76"],ext:true},
{id:"Z76s1",name:"ابن",g:"M",father:"Z76",mother:"Z76w1",dates:"1425هـ/2004م –"},
{id:"Z76d1",name:"نفيسو",g:"F",father:"Z76",mother:"Z76w2",dates:"1430هـ/2009م –"},
{id:"Z76d2",name:"مولاي الحسن",g:"F",father:"Z76",mother:"Z76w2",dates:"1433هـ/2012م –"},
{id:"Z77s1",name:"ابن",g:"M",father:"Z77",mother:"Z77w1",dates:"1431هـ/2010م –"},
{id:"Z77s2",name:"أحمد",g:"M",father:"Z77",mother:"Z77w1",dates:"1432هـ/2011م –"},
{id:"Z77d1",name:"سكينو",g:"F",father:"Z77",mother:"Z77w1",dates:"1435هـ/2014م –"},
{id:"Z77s3",name:"فلان",g:"M",father:"Z77",mother:"Z77w1",dates:"1437هـ/2016م –"},
{id:"Z78d1",name:"اميَّم (مريم)",g:"F",father:"Z78",mother:"Z78w1",dates:"1394هـ/1974م –",note:"أم أبناء محمدن بن أحمد بن ابَّيا بن اَما بن محمد بن محمذن بن عركاب (محم) بن ابوبا (الأمين) بن ماه"},
{id:"Z78d2",name:"حاجو",g:"F",father:"Z78",mother:"Z78w1",dates:"1402هـ/1982م –",note:"أم صغار أبناء عارف بن محمدن بن الكريم بن محمذن بن ابَّيام بن المختار بن أحمد انهكر بن محمد الكريم"},
{id:"Z78s1",name:"خالد",g:"M",father:"Z78",mother:"Z78w2",dates:"1406هـ/1986م –"},
{id:"Z78w3",name:"السنيو",g:"F",father:null,note:"بنت الشيخ بويا بن سيد هيبا بن محمد بن محمد المختار بن اعبيدي بن الطالب اخيار بن محمد بن اجيو المختار",spouses:["Z78"],ext:true},
{id:"Z78d3",name:"عيشو",g:"F",father:"Z78",mother:"Z78w3",dates:"1415هـ/1995م –"},
{id:"Z78d4",name:"اَمونو",g:"F",father:"Z78",mother:"Z78w3",dates:"1420هـ/1999م –"},
{id:"Z79d1",name:"يسلم",g:"F",father:"Z79",mother:"Z79w1",dates:"1433هـ/2012م –"},
{id:"Z79d2",name:"ابن",g:"F",father:"Z79",mother:"Z79w1",dates:"1434هـ/2013م –"},
{id:"Z79d3",name:"النَّـنَّ (محمد صالح)",g:"F",father:"Z79",mother:"Z79w1",dates:"1437هـ/2016م –"},
{id:"Z80d1",name:"أم الخيري",g:"F",father:"Z80",mother:"Z80w1",dates:"1375هـ/1955م –",note:"أم عائشة من أبناء محمد سالم بن أحمد الأمين بن محمد فال بن اخميطرات بن محمود لله بن ابو الحس بن المزضف"},
{id:"Z81d1",name:"نفيسو",g:"F",father:"Z81",mother:"Z81w1",dates:"1399هـ/1979م –",note:"أم أبناء حمِّيده بن المختار بن أحمد ولد المختار السالم بن سيد الفالي بن صالحي بن محمذن بن آبين (محنض بونا)"},
{id:"Z82d1",name:"بوبَّـو (آمنة)",g:"F",father:"Z82",mother:"Z82w1",dates:"1407هـ/1987م –"},
{id:"Z82s2",name:"محمد عبد الله",g:"M",father:"Z82",mother:"Z82w1",dates:"1409هـ/1989م –"},
{id:"Z82d2",name:"الشيخو (منت خويلد)",g:"F",father:"Z82",mother:"Z82w1",dates:"1412هـ/1992م –"},
{id:"Z82s3",name:"السيد",g:"M",father:"Z82",mother:"Z82w1",dates:"1413هـ/1994م –"},
{id:"Z84s1",name:"محمدن",g:"M",father:"Z84",mother:"Z84w1",place:"محجوبو",note:"مات صغيرا"},
{id:"Z85d1",name:"مريم السالمو",g:"F",father:"Z85",mother:"Z85w1",dates:"1398هـ/1978م –"},
{id:"Z85s1",name:"ايمين (الأمين)",g:"M",father:"Z85",mother:"Z85w1",dates:"1401هـ/1981م –"},
{id:"Z85s2",name:"محمد",g:"M",father:"Z85",mother:"Z85w1",dates:"1403هـ/1983م –"},
{id:"Z85s3",name:"عبد الله",g:"M",father:"Z85",mother:"Z85w1",dates:"1405هـ/1985م –"},
];

// nettoyage : retirer les entrées "techniques" sans intérêt de navigation
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
const CORRECTIONS = {
  merges: [
    // ادمو (مريم) بنت الأمين بن محمذن بن سعدن بن ون (محمذن) بن أحمد زروق : doublon entre
    // متيلي (M30w1) et أحمد زروق (R70d2, fille de R70, elle-même fils de R67). Signalé par l'utilisateur,
    // puis corrigé une seconde fois car la première cible (R67d4) était une homonyme différente.
    ["M30w1", "R70d2", "ادمو (مريم) = امّمو (مريم), fille de R70 (الأمين بن محمذن بن سعدن بن ون بن أحمد زروق), PAS de R67 directement (R67d4 est une homonyme différente, déjà mère d'une autre lignée). Corrigé après signalement de l'utilisateur."],
    // Fatimetou (mère de Mohamed Mbareck/Z61, épouse de Medal/Z58 ET de Mohameden/M47)
    // avait été créée deux fois : une fois correctement comme fille de P26 (Ahmed b.
    // Abou Mohamed, ماهي) via M47, une fois par erreur comme fille de P8 via Z58.
    // On garde M47w2 (déjà reliée à Ahmed fils d'Ebou = P26) et on y fusionne Z58w2.
    ["Z58w2", "M47w2", "Fatimetou : doublon — fille d'Ahmed b. Abou (P26), pas de P8. Signalé par l'utilisateur."],
    // توت : doublon entre أهل المزضف (Z146w1, mal rattachée à P26) et أهل ماهي (P13d3,
    // fille d'Ahmed b. Abba = P13). La fusion corrige au passage la mauvaise filiation.
    ["Z146w1", "P13d3", "Doublon signalé manuellement (توت بنت أحمد بن ابّا... = توت, fille de P13 pas P26)"],
    // تنم (ميمونو) = تم (ميمونو), fille de محمذن باب (P27), même personne des deux côtés.
    ["Z147w1", "P27d1", "Doublon signalé manuellement (تنم (ميمونو) = تم (ميمونو))"],
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

function applyCorrections(rawPeople, userCorrections) {
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

function PedigreeNode({ id, depth, maxDepth, onSelect, highlightPath }) {
  const p = byId[id];
  const isHighlighted = highlightPath && highlightPath.has(id);
  if (!p) {
    return <div className="pedigree-node pedigree-empty">؟</div>;
  }
  const hasParents = depth < maxDepth && (p.father || p.mother);
  return (
    <div className="pedigree-branch">
      <button
        className={`pedigree-node ${p.g === "F" ? "pedigree-f" : "pedigree-m"} ${isHighlighted ? "pedigree-hl" : ""}`}
        onClick={() => onSelect(id)}
        title={p.name}
      >
        <span className="pedigree-node-name">{p.name}{isUnnamed(p.name) && " (X)"}</span>
        {p.dates && <span className="pedigree-node-dates">{p.dates}</span>}
      </button>
      {hasParents && (
        <div className="pedigree-parents">
          {p.father ? (
            <PedigreeNode id={p.father} depth={depth + 1} maxDepth={maxDepth} onSelect={onSelect} highlightPath={highlightPath} />
          ) : (
            <div className="pedigree-branch"><div className="pedigree-node pedigree-empty">؟ أب</div></div>
          )}
          {p.mother ? (
            <PedigreeNode id={p.mother} depth={depth + 1} maxDepth={maxDepth} onSelect={onSelect} highlightPath={highlightPath} />
          ) : (
            <div className="pedigree-branch"><div className="pedigree-node pedigree-empty">؟ أم</div></div>
          )}
        </div>
      )}
    </div>
  );
}

function AncestorPedigree({ id, onSelect, highlightPath, title }) {
  const [maxDepth, setMaxDepth] = useState(4);
  if (!id || !byId[id]) return null;
  const highlightSet = highlightPath instanceof Set ? highlightPath : highlightPath ? new Set(highlightPath) : null;
  return (
    <div className="pedigree-wrap">
      <div className="pedigree-header">
        <span>{title || "الشجرة النسبية — Arbre généalogique (père + mère à chaque génération, ancêtres en haut)"}</span>
        <div className="pedigree-depth-control">
          <button onClick={() => setMaxDepth((d) => Math.max(1, d - 1))}>−</button>
          <span>{maxDepth} générations</span>
          <button onClick={() => setMaxDepth((d) => Math.min(9, d + 1))}>+</button>
        </div>
      </div>
      <div className="pedigree-scroll">
        <PedigreeNode id={id} depth={0} maxDepth={maxDepth} onSelect={onSelect} highlightPath={highlightSet} />
      </div>
    </div>
  );
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

function TreeNode({ id, onSelect, selectedId, depth, filter, expandedOverride, hideExt, debug }) {
  const p = byId[id];
  const [open, setOpen] = useState(depth < 2);
  if (!p) return null;
  if (hideExt && p.ext) return null;
  const children = PEOPLE.filter((c) => c.father === id && !(hideExt && c.ext));
  const matchesFilter = (node) => !filter || node.name.includes(filter);
  const subtreeMatches = (node) => {
    if (matchesFilter(node)) return true;
    return PEOPLE.filter((c) => c.father === node.id).some((c) => subtreeMatches(c));
  };
  if (filter && !subtreeMatches(p)) return null;
  const isOpen = filter ? true : open;
  const fam = familyOf(id);

  return (
    <div className="tree-node" style={{ "--depth": depth }}>
      <div className={`tree-row ${selectedId === id ? "tree-row-sel" : ""}`}>
        {children.length > 0 ? (
          <button className="twisty" onClick={() => setOpen((o) => !o)} aria-label={isOpen ? "Réduire" : "Développer"}>
            {isOpen ? "−" : "+"}
          </button>
        ) : (
          <span className="twisty twisty-empty" />
        )}
        <button className={`tree-label ${p.g === "F" ? "is-fem" : ""}`} onClick={() => onSelect(id)}>
          <span className="tree-gen" title="الجيل — génération depuis سيد الفالي">ج{generationNumber(id)}</span>
          <span className="tree-name">{p.name}</span>
          {isUnnamed(p.name) && <span className="badge-unknown" title="اسمها غير مسجّل في المصدر الأصلي — Identité non enregistrée dans le document source">X</span>}
          {p.ext && <span className="badge-ext badge-ext-sm" title="قبيلة خارجية — Lignée extérieure à la tribu">خارجية</span>}
          {debug && <span className="dbg-id">{p.id}</span>}
          {fam && fam.key !== "tribe" && <span className={`tree-fam tree-fam-${fam.key}`}>{familyShortLabel(fam.key)}</span>}
          {p.para && <span className="tree-para">ف.{p.para}</span>}
          {p.dates && <span className="tree-dates">{p.dates}</span>}
        </button>
      </div>
      {isOpen && children.length > 0 && (
        <div className="tree-children">
          {children
            .sort((a, b) => (a.para || 999) - (b.para || 999))
            .map((c) => (
              <TreeNode key={c.id} id={c.id} onSelect={onSelect} selectedId={selectedId} depth={depth + 1} filter={filter} hideExt={hideExt} debug={debug} />
            ))}
        </div>
      )}
    </div>
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
  const [filter, setFilter] = useState("");
  const [hideExt, setHideExt] = useState(true);
  const [debug, setDebug] = useState(false);
  const [tab, setTab] = useState("tree"); // 'tree' | 'finder' | 'corrections'
  const [userCorrections, setUserCorrections] = useState({ merges: [], setField: [] });
  const [datasetVersion, setDatasetVersion] = useState(0);
  const [correctionsLoaded, setCorrectionsLoaded] = useState(false);

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

  const roots = ["T0-hamnadh", "N1", "H1", "W1", "V1", "G1"];
  // Z1 (المزضف) est déjà rattaché à T0 comme descendant de sang — pas besoin de racine séparée.

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
            <input
              className="filter-input"
              placeholder="تصفية الشجرة المعروضة — Filtrer l'arbre affiché…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <label className="ext-toggle">
              <input type="checkbox" checked={hideExt} onChange={(e) => setHideExt(e.target.checked)} />
              <span>إخفاء القبائل الخارجية — Masquer les lignées extérieures</span>
              <span className="ext-count">{RAW.filter((x) => x.ext).length}</span>
            </label>
            <label className="ext-toggle">
              <input type="checkbox" checked={debug} onChange={(e) => setDebug(e.target.checked)} />
              <span>وضع التصحيح: إظهار المعرّفات — Mode debug : identifiants techniques</span>
            </label>
            <div className="sidebar-scroll">
              {roots.map((r) => (
                <TreeNode key={r} id={r} onSelect={setSelectedId} selectedId={selectedId} depth={0} filter={filter} hideExt={hideExt} debug={debug} />
              ))}
            </div>
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
          <section className="content">
            <PersonDetail id={selectedId} onSelect={setSelectedId} onMerge={addMerge} onSetField={addSetField} debug={debug} />
            <AncestorPedigree id={selectedId} onSelect={setSelectedId} />
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
