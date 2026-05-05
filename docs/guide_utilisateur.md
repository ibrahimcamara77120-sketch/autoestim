# Guide utilisateur — AutoEstim
## Estimateur de prix de revente automobile

**Version :** 1.0 — Mars 2026
**Auteur :** Camara Ibrahim

---

## Présentation

AutoEstim est un outil web gratuit qui vous permet d'estimer rapidement le prix de revente de votre véhicule d'occasion sur le marché français. Il fonctionne directement dans votre navigateur, sans installation ni connexion à un service externe.

---

## Accès à l'application

**En local :** Ouvrez le fichier `index.html` avec votre navigateur (double-clic ou glisser-déposer dans le navigateur).

**En ligne :** [https://autoestim.vercel.app](https://autoestim.vercel.app) *(déploiement à venir)*

Navigateurs compatibles : **Chrome, Firefox, Safari, Edge** — Mobile et Desktop.

---

## Utilisation pas à pas

### Étape 1 — Choisir la marque

Cliquez sur le menu déroulant **"01 — Marque"** et sélectionnez la marque de votre véhicule parmi les 10 marques disponibles.

> Marques disponibles : Renault, Peugeot, Citroën, Volkswagen, BMW, Mercedes, Toyota, Ford, Dacia, Audi

### Étape 2 — Choisir le modèle

Une fois la marque sélectionnée, le menu **"02 — Modèle"** se déverrouille automatiquement. Sélectionnez votre modèle.

### Étape 3 — Saisir l'année

Sélectionnez l'**année de mise en circulation** de votre véhicule (de 2000 à 2024).

### Étape 4 — Saisir le kilométrage

Entrez le **kilométrage actuel** de votre véhicule (en kilomètres, sans espace ni point).

> Exemple : pour 85 000 km, tapez `85000`

### Étape 5 — Lancer l'estimation

Cliquez sur le bouton **"Estimer le prix de revente"**. Les résultats s'affichent automatiquement.

---

## Comprendre les résultats

### Les 3 fourchettes de prix

| Carte | Couleur | Signification |
|---|---|---|
| **Prix haut** | Vert | Véhicule en excellent état, kilométrage faible |
| **Prix moyen** | Blanc | Estimation marché standard |
| **Prix bas** | Orange | État moyen, kilométrage élevé |

> La fourchette correspond à ±12 % autour du prix moyen calculé.

### L'état général estimé

Le badge d'état est calculé selon l'âge et le kilométrage :

| État | Signification |
|---|---|
| 🟢 **Excellent** | Véhicule récent, peu kilométré |
| 🔵 **Bon** | Bon entretien, kilométrage raisonnable |
| 🟡 **Correct** | Usage normal, quelques années d'ancienneté |
| 🔴 **Fatigué** | Véhicule ancien et/ou très kilométré |

### Le graphique de dépréciation

Le graphique montre l'évolution de la valeur estimée du véhicule sur **15 ans** depuis son année de mise en circulation. Le point blanc mis en évidence correspond à l'**année actuelle** du véhicule.

---

## Limites de l'outil

- Les estimations sont calculées par algorithme et données à titre **indicatif uniquement**
- Elles ne tiennent pas compte de : l'état mécanique réel, les options/équipements, les accidents, l'entretien suivi
- Les prix réels varient selon la région, la saisonnalité et l'offre du marché
- Pour une estimation précise, consultez un professionnel ou comparez sur des sites spécialisés (La Centrale, Leboncoin, Argus)

---

## Foire aux questions

**Q : Mon modèle n'est pas disponible, que faire ?**
R : La base de données couvre les 35 modèles les plus vendus en France. Si votre modèle est absent, choisissez le modèle le plus proche de la même gamme.

**Q : Le site fonctionne-t-il sans internet ?**
R : Oui, sauf pour le chargement des polices Google Fonts et du graphique Chart.js (CDN). Les calculs eux-mêmes fonctionnent hors ligne.

**Q : Les prix sont-ils mis à jour ?**
R : Les données de référence (prix neuf, taux de dépréciation) sont celles du marché français 2024. Elles peuvent être mises à jour dans le fichier `index.html`.
