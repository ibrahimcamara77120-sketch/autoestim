# Veille technologique — AutoEstim
## Choix des outils et technologies

**Auteur :** Camara Ibrahim
**Date :** Mars 2026
**Projet :** AutoEstim — Estimateur de prix de revente automobile

---

## 1. Objectif de la veille

Dans le cadre du projet AutoEstim, j'ai mené une veille technologique pour identifier les outils les mieux adaptés à la réalisation d'un estimateur de prix automobile côté client (sans serveur), en tenant compte des contraintes du contexte BTS (pas d'API payante, déploiement simple, code maîtrisable).

---

## 2. Problématique initiale : récupérer les données de prix

### Option A — API externe (ex : DataCar, Argus API)
- **Avantages :** données réelles, mises à jour automatiquement
- **Inconvénients :** payantes (à partir de 50€/mois), nécessitent un serveur backend pour cacher la clé API, instables en production scolaire
- **Décision : écarté** — trop contraignant pour un projet BTS

### Option B — Web scraping (Leboncoin, La Centrale)
- **Avantages :** données réelles du marché
- **Inconvénients :** illégal sans autorisation (CGU des sites), résultats instables, nécessite un serveur
- **Décision : écarté** — cadre juridique non respecté

### Option C — Base JSON embarquée + algorithme de dépréciation ✅
- **Avantages :** 100 % maîtrisé, fonctionne hors ligne, aucun coût, justifiable à l'oral, données cohérentes avec le marché réel
- **Inconvénients :** mise à jour manuelle des données
- **Décision : retenu** — meilleur compromis pour ce contexte

---

## 3. Choix des technologies front-end

### HTML5 / CSS3 / JavaScript ES6
- Standard du web, aucune dépendance supplémentaire
- Permettent de livrer un fichier unique `index.html`
- CSS Grid et Flexbox pour le responsive sans framework

**Alternatives étudiées :**
- React.js → trop lourd pour un fichier unique, nécessite un bundler
- Vue.js → idem, complexité inutile pour ce périmètre
- Bootstrap → ajouterait du CSS non maîtrisé, contraire au dark mode custom

### Chart.js (v4.4) via CDN
- **Pourquoi Chart.js ?** Bibliothèque open-source, légère (60 Ko), très bien documentée, idéale pour des graphiques en ligne simples
- **Alternatives étudiées :**
  - D3.js → puissant mais courbe d'apprentissage trop élevée
  - ApexCharts → plus lourd, moins documenté
  - Highcharts → payant en usage commercial
- **Décision : Chart.js retenu** pour sa simplicité et sa documentation claire

### Google Fonts (Rajdhani + Inter)
- Rajdhani : police condensée et technique, idéale pour les titres automobile
- Inter : excellente lisibilité à petite taille pour le texte courant
- Chargées via CDN, sans impact sur la taille du fichier source

---

## 4. Algorithme de dépréciation — recherches effectuées

J'ai étudié les modèles de dépréciation utilisés par les professionnels de l'automobile :

| Source | Modèle |
|---|---|
| Argus de l'automobile | Dépréciation par tranche d'âge et km, tables de référence |
| AutoScout24 | Modèle linéaire ajusté par la cote marché |
| Études CCFA (Comité des Constructeurs Français d'Automobiles) | Taux de dépréciation par catégorie de véhicule |

**Modèle retenu :** dépréciation exponentielle `Prix = PrixNeuf × (1 − taux)^âge` avec ajustement kilométrique, cohérent avec les pratiques observées dans les études sectorielles.

---

## 5. Déploiement — solutions étudiées

| Solution | Avantages | Inconvénients |
|---|---|---|
| GitHub Pages | Gratuit, simple, intégration Git | Nécessite un dépôt public |
| Vercel | Très simple, déploiement automatique, HTTPS | Compte requis |
| Netlify | Drag & drop du fichier HTML | Compte requis |
| Hébergement local | Aucun compte nécessaire | Pas accessible en ligne |

**Décision : Vercel retenu** — déjà utilisé pour le portfolio `ib-camara.vercel.app`, déploiement en moins de 2 minutes par glisser-déposer du fichier.

---

## 6. Compétences développées

| Technologie | Niveau avant | Niveau après |
|---|---|---|
| Chart.js | Débutant | Intermédiaire |
| CSS Variables & Dark mode | Débutant | Intermédiaire |
| Algorithmique JS (dépréciation) | Intermédiaire | Avancé |
| Responsive CSS Grid/Flexbox | Intermédiaire | Avancé |
| Manipulation DOM JavaScript | Intermédiaire | Avancé |

---

## 7. Sources de veille consultées

- MDN Web Docs — [developer.mozilla.org](https://developer.mozilla.org)
- Documentation officielle Chart.js — [chartjs.org/docs](https://www.chartjs.org/docs)
- CSS-Tricks — articles sur les CSS variables et dark mode
- Journal du Net / CCFA — données de dépréciation automobile marché français
- Stack Overflow — résolution de problèmes techniques
