# Cahier des charges — AutoEstim
## Estimateur de prix de revente automobile

**Auteur :** Camara Ibrahim
**Date :** 01/03/2026
**Contexte :** Projet personnel BTS SIO option SLAM — Épreuve E6

---

## 1. Contexte et problématique

Les particuliers souhaitant vendre leur véhicule d'occasion manquent souvent d'un outil simple et fiable pour estimer sa valeur marchande. Les solutions existantes dépendent d'API externes payantes, instables ou trop complexes à mettre en œuvre dans un contexte scolaire.

**Problème :** Comment estimer rapidement et de manière réaliste le prix de revente d'un véhicule d'occasion sur le marché français ?

---

## 2. Objectifs

- Concevoir un outil web d'estimation du prix de revente automobile
- Fonctionner sans API externe ni serveur (100 % local)
- Couvrir les marques et modèles les plus vendus sur le marché français
- Afficher une fourchette de prix réaliste (bas / moyen / haut)
- Présenter une courbe de dépréciation sur 15 ans
- Être accessible sur mobile et desktop

---

## 3. Périmètre fonctionnel

| Fonctionnalité | Priorité |
|---|---|
| Sélection marque / modèle / année / km | Haute |
| Calcul de la fourchette de prix | Haute |
| Affichage de l'état du véhicule | Haute |
| Graphique de dépréciation (Chart.js) | Haute |
| Interface responsive dark mode | Moyenne |
| Animation des prix (compteur) | Basse |

---

## 4. Contraintes techniques

- Un seul fichier `index.html` (HTML + CSS + JS embarqués)
- Pas de serveur backend, pas d'API externe
- Bibliothèques autorisées via CDN : Chart.js, Google Fonts
- Compatible : Chrome, Firefox, Safari — mobile et desktop
- Code commenté en français

---

## 5. Planning prévisionnel

| Phase | Tâche | Durée estimée |
|---|---|---|
| Analyse | Définition du besoin, choix technologiques | 2h |
| Conception | Modélisation des données JSON, algorithme | 3h |
| Développement | HTML/CSS/JS, Chart.js, animations | 6h |
| Tests | Tests fonctionnels, validation navigateurs | 2h |
| Documentation | Guide utilisateur, annexe BTS, veille | 2h |
| **Total** | | **~15h** |

---

## 6. Livrables

- `index.html` — application web complète
- `docs/guide_utilisateur.md` — guide d'utilisation
- `docs/plan_tests.md` — plan de tests et résultats
- `docs/veille_technologique.md` — veille sur les outils utilisés
- Annexe E6 complétée (PDF)

---

## 7. Critères d'acceptation

- [ ] Les 10 marques et 35+ modèles sont sélectionnables
- [ ] Le calcul de prix s'affiche en moins d'1 seconde
- [ ] La fourchette est cohérente avec les prix du marché réel
- [ ] Le graphique Chart.js s'affiche correctement
- [ ] L'application fonctionne sans connexion internet (hors CDN)
- [ ] L'interface est lisible sur mobile (320px minimum)
