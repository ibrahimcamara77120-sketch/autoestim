# Guide utilisateur — AutoEstim
## Estimateur de prix de revente automobile

**Version :** 2.0 — Avril 2026
**Auteur :** Camara Ibrahim
**URL :** https://autoestim.vercel.app

---

## Présentation

AutoEstim est un outil web gratuit qui permet d'estimer le prix de revente d'un véhicule d'occasion sur le marché français. Il couvre **28 marques** et **200+ modèles**, et intègre des critères avancés (carburant, boîte, couleur, options, historique) pour une estimation précise.

---

## Accès à l'application

**En ligne :** [https://autoestim.vercel.app](https://autoestim.vercel.app)

Navigateurs compatibles : **Chrome, Firefox, Safari, Edge** — Mobile et Desktop.

---

## Utilisation pas à pas

### Étape 1 — Choisir la marque

Sélectionnez la marque dans le menu **"01 — Marque"** parmi 28 marques disponibles (Renault, Peugeot, BMW, Mercedes, Toyota, Tesla, Porsche…).

### Étape 2 — Choisir le modèle

Le menu **"02 — Modèle"** se déverrouille. Sélectionnez votre modèle parmi les 200+ disponibles.

### Étape 3 — Sélectionner le carburant

Des boutons (chips) apparaissent avec les carburants disponibles pour ce modèle :
- ⛽ Essence, 🔩 Diesel, ♻️ Hybride, 🔌 PHEV, 🔋 Électrique, 🌿 GPL

Cliquez sur le carburant de votre véhicule. **Ce choix impacte le prix estimé.**

### Étape 4 — Sélectionner la boîte de vitesses

Choisissez entre ⚙️ Manuelle, 🤖 Automatique, ou 🏁 Séquentielle.

### Étape 5 — Saisir l'année et le kilométrage

- **Année :** année de mise en circulation (de 1995 à 2026)
- **Kilométrage :** kilométrage actuel du compteur (ex : `75000`)

### Étape 6 — Critères avancés (optionnel)

Cliquez sur **"⚙️ Critères avancés"** pour affiner l'estimation :

**Couleur extérieure :**
Cliquez sur la couleur de votre véhicule. Certaines couleurs sont plus demandées et valorisent le véhicule (noir, blanc) ; d'autres le dévalorisent (jaune, violet).

**Options et équipements :**
Cochez les options présentes sur votre véhicule. Chaque option ajoute une valeur estimée :
- GPS / Navigation : +400 €
- Sellerie cuir : +800 €
- Toit panoramique : +700 €
- Caméra 360° : +300 €
- Sièges chauffants : +350 €
- Et 7 autres options...

**Historique du véhicule :**
- **1ère main** : si vous êtes le seul propriétaire → +6%
- **Carnet d'entretien complet** : → +3%
- **Garantie constructeur restante** : → +4%
- **Véhicule accidenté** : léger −8%, grave −20%

### Étape 7 — Lancer l'estimation

Cliquez sur le bouton **"⚡ Estimer le prix de revente"**.

---

## Comprendre les résultats

### L'état général estimé

| État | Signification | Critère |
|------|-------------|---------|
| 🟢 **Excellent** | Véhicule récent, peu kilométré | Score < 3 |
| 🔵 **Bon** | Bon entretien, usage raisonnable | Score 3–7 |
| 🟡 **Correct** | Usage normal, quelques années | Score 7–12 |
| 🔴 **Fatigué** | Véhicule ancien et/ou très kilométré | Score > 12 |

*Score = âge × 1.2 + kilométrage / 20 000*

### Les 3 fourchettes de prix

| Carte | Couleur | Signification |
|-------|---------|---------------|
| **Prix haut** | Vert | Véhicule en très bon état, faible km |
| **Prix moyen** | Blanc | Estimation marché standard |
| **Prix bas** | Orange | État moyen, kilométrage élevé |

La fourchette correspond à **±12 %** autour du prix moyen calculé.

### Le détail du calcul (breakdown)

Le tableau "Détail du calcul" montre **l'impact de chaque facteur** sur le prix final :
- Prix neuf de référence
- Impact de la dépréciation selon l'âge
- Ajustement kilométrique
- Modificateur carburant
- Modificateur boîte
- Impact couleur
- Valeur des options
- Bonus/malus historique

### La courbe de dépréciation

Le graphique montre l'évolution de la valeur sur **15 ans**. Le **point blanc** correspond à l'année actuelle du véhicule.

---

## Foire aux questions

**Q : Mon modèle n'est pas dans la liste ?**
R : La base couvre 200+ modèles. Si le vôtre est absent, il sera ajouté dans une prochaine mise à jour.

**Q : Le site fonctionne-t-il sans internet ?**
R : Le site nécessite internet pour charger les données depuis la base. En cas d'indisponibilité, un mode hors-ligne (données locales) prend le relais automatiquement.

**Q : Les estimations sont-elles sauvegardées ?**
R : Oui, chaque estimation est enregistrée anonymement dans la base de données.

**Q : Les prix sont-ils mis à jour ?**
R : Les données de référence sont celles du marché français 2025–2026. La base est maintenue manuellement.
