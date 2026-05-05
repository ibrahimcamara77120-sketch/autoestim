# Plan de tests — AutoEstim
## Estimateur de prix de revente automobile

**Auteur :** Camara Ibrahim
**Date :** 20/03/2026
**Version testée :** 1.0

---

## 1. Objectif des tests

Vérifier que l'application AutoEstim répond aux critères d'acceptation définis dans le cahier des charges : exactitude des calculs, accessibilité de l'interface, robustesse face aux erreurs de saisie et compatibilité navigateurs.

---

## 2. Environnement de test

| Élément | Détail |
|---|---|
| Navigateurs | Chrome 122, Firefox 124, Safari 17 |
| Résolutions | 375px (mobile), 768px (tablette), 1440px (desktop) |
| OS | macOS 14, iOS 17 |
| Fichier testé | index.html v1.0 |

---

## 3. Cas de tests fonctionnels

### 3.1 Sélection des données

| ID | Scénario | Résultat attendu | Résultat obtenu | Statut |
|---|---|---|---|---|
| T01 | Sélectionner "Renault" | La liste modèles se peuple (Clio, Mégane, Kadjar...) | Conforme | ✅ |
| T02 | Sélectionner un modèle | Les champs Année et Km se déverrouillent | Conforme | ✅ |
| T03 | Laisser la marque vide et cliquer Estimer | Message d'alerte affiché | Conforme | ✅ |
| T04 | Saisir un kilométrage négatif | Message d'alerte "kilométrage invalide" | Conforme | ✅ |
| T05 | Ne pas choisir d'année | Message d'alerte affiché | Conforme | ✅ |

### 3.2 Calcul du prix

| ID | Scénario | Résultat attendu | Résultat obtenu | Statut |
|---|---|---|---|---|
| T06 | Renault Clio, 2020, 50 000 km | Prix moyen ~8 000–10 000 € | 9 200 € | ✅ |
| T07 | BMW Série 3, 2015, 120 000 km | Prix moyen ~12 000–16 000 € | 13 800 € | ✅ |
| T08 | Toyota Yaris, 2022, 10 000 km (très faible km) | Prix haut > prix moyen standard | Conforme | ✅ |
| T09 | Dacia Sandero, 2005, 250 000 km (très élevé) | Prix bas plancher à 5% du neuf | Conforme | ✅ |
| T10 | Véhicule neuf (2024, 0 km) | Prix proche du prix neuf | Conforme | ✅ |

### 3.3 Affichage et interface

| ID | Scénario | Résultat attendu | Résultat obtenu | Statut |
|---|---|---|---|---|
| T11 | Animation compteur prix | Les chiffres s'animent de 0 vers la valeur cible | Conforme | ✅ |
| T12 | Badge état "Excellent" | Badge vert affiché pour véhicule récent / faible km | Conforme | ✅ |
| T13 | Badge état "Fatigué" | Badge rouge pour véhicule ancien / fort km | Conforme | ✅ |
| T14 | Graphique Chart.js affiché | Courbe visible, point année mis en évidence | Conforme | ✅ |
| T15 | Info-bulle graphique au survol | Prix affiché au survol de chaque point | Conforme | ✅ |

### 3.4 Compatibilité et responsive

| ID | Scénario | Résultat attendu | Résultat obtenu | Statut |
|---|---|---|---|---|
| T16 | Affichage 375px (mobile) | Grille en colonne unique, lisible | Conforme | ✅ |
| T17 | Chrome 122 | Fonctionnement complet | Conforme | ✅ |
| T18 | Firefox 124 | Fonctionnement complet | Conforme | ✅ |
| T19 | Safari 17 | Fonctionnement complet | Conforme | ✅ |

---

## 4. Tests de non-régression

Après chaque modification du fichier `index.html`, les cas T01 à T10 sont rejoués manuellement pour vérifier qu'aucune régression n'est introduite.

---

## 5. Bilan des tests

| Catégorie | Tests prévus | Tests réussis | Taux |
|---|---|---|---|
| Sélection données | 5 | 5 | 100 % |
| Calcul du prix | 5 | 5 | 100 % |
| Affichage / interface | 5 | 5 | 100 % |
| Compatibilité | 4 | 4 | 100 % |
| **Total** | **19** | **19** | **100 %** |

---

## 6. Anomalies détectées et corrections

| ID | Anomalie | Correction apportée |
|---|---|---|
| BUG-01 | Le coef kilométrique pouvait descendre sous 0 pour des km très élevés | Ajout d'un plancher à 40% (coefKm = Math.max(0.4, ...)) |
| BUG-02 | Le graphique n'était pas détruit avant d'être recréé | Appel à chartInstance.destroy() avant nouveau tracé |
