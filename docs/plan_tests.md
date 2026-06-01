# Plan de tests — AutoEstim
## Estimateur de prix de revente automobile

**Auteur :** Camara Ibrahim — N° candidat 2545812845
**Date :** Avril 2026 — Version 2.0
**URL testée :** https://autoestim.vercel.app

---

## 1. Objectif des tests

Vérifier que l'application AutoEstim v2.0 répond aux critères d'acceptation du cahier des charges :
- Exactitude des calculs de prix avec modificateurs
- Fonctionnement de l'API REST (3 endpoints)
- Intégrité des données en base PostgreSQL
- Robustesse face aux erreurs de saisie
- Compatibilité navigateurs et responsive

---

## 2. Environnement de test

| Élément | Détail |
|---------|--------|
| Navigateurs | Chrome 124, Firefox 126, Safari 17 |
| Résolutions | 375px (mobile), 768px (tablette), 1440px (desktop) |
| OS | macOS 14.5, iOS 17 |
| Version testée | AutoEstim v2.0 — https://autoestim.vercel.app |
| Base de données | Neon PostgreSQL — neondb (neon-red-village) |
| Outils | Navigateur DevTools, DBeaver |

---

## 3. Tests fonctionnels — Interface

### 3.1 Sélection et navigation progressive

| ID  | Scénario | Résultat attendu | Résultat obtenu | Statut |
|-----|---------|-----------------|-----------------|--------|
| T01 | Sélectionner "Renault" | Section motorisation s'affiche, chips carburant peuplés | Conforme | ✅ |
| T02 | Sélectionner "Clio" | Chips : Essence, Hybride, GPL | Conforme | ✅ |
| T03 | Sélectionner "Tesla Model Y" | Chips : Électrique uniquement | Conforme | ✅ |
| T04 | Sélectionner carburant + boîte | Section année/km apparaît | Conforme | ✅ |
| T05 | Laisser carburant vide et cliquer Estimer | Alerte "Veuillez sélectionner un carburant" | Conforme | ✅ |
| T06 | Laisser boîte vide | Alerte "Veuillez sélectionner la boîte" | Conforme | ✅ |
| T07 | Kilométrage négatif | Alerte "kilométrage invalide" | Conforme | ✅ |
| T08 | Pas d'année sélectionnée | Alerte affichée | Conforme | ✅ |
| T09 | Ouvrir "Critères avancés" | Section couleur/options/historique visible | Conforme | ✅ |
| T10 | Sélectionner une couleur | Swatch actif, compteur "1 actif" dans badge | Conforme | ✅ |

### 3.2 Calcul du prix — cas nominaux

| ID  | Scénario | Résultat attendu | Résultat obtenu | Statut |
|-----|---------|-----------------|-----------------|--------|
| T11 | Renault Clio, Essence, Auto, 2021, 30 000 km | Prix moyen ~10 000–12 000 € | 11 200 € | ✅ |
| T12 | BMW Série 3, Diesel, Auto, 2018, 90 000 km | Prix moyen ~15 000–20 000 € | 17 400 € | ✅ |
| T13 | Toyota Yaris, Hybride, Manuelle, 2022, 15 000 km | Prix moyen ~17 000–20 000 € | 18 300 € | ✅ |
| T14 | Dacia Sandero, GPL, Manuelle, 2015, 150 000 km | Prix plancher (40% du neuf min) | Conforme | ✅ |
| T15 | Tesla Model Y, Électrique, Auto, 2022, 40 000 km | Dépréciation +18%, prix inférieur au marché classique | Conforme | ✅ |
| T16 | Porsche 911, Essence, Manuelle, 2015, 60 000 km | Faible dépréciation (10%/an) | Conforme | ✅ |

### 3.3 Modificateurs — impact sur le prix

| ID  | Scénario | Résultat attendu | Résultat obtenu | Statut |
|-----|---------|-----------------|-----------------|--------|
| T17 | Diesel vs Essence (même véhicule) | Diesel: −6% | Conforme (-6%) | ✅ |
| T18 | Boîte Auto vs Manuelle | Auto: +5% | Conforme (+5%) | ✅ |
| T19 | Couleur Noir vs Couleur Violet | Noir: +2%, Violet: −11% | Conforme | ✅ |
| T20 | Cuir + GPS + Toit activés | +800 + 400 + 700 = +1 900 € dans breakdown | Conforme | ✅ |
| T21 | Première main + Carnet + Garantie | × 1.06 × 1.03 × 1.04 = +13.5% approx | Conforme | ✅ |
| T22 | Accident grave sélectionné | −20% sur le prix final | Conforme | ✅ |
| T23 | Breakdown affiché correctement | Chaque ligne montre un facteur avec son impact € | Conforme | ✅ |

### 3.4 Affichage et animations

| ID  | Scénario | Résultat attendu | Résultat obtenu | Statut |
|-----|---------|-----------------|-----------------|--------|
| T24 | Animation compteur prix | Chiffres animent de 0 → valeur cible (900ms) | Conforme | ✅ |
| T25 | Badge état "Excellent" | Badge vert (vehicle récent/faible km) | Conforme | ✅ |
| T26 | Badge état "Fatigué" | Badge rouge (ancien + fort km) | Conforme | ✅ |
| T27 | Graphique Chart.js | Courbe visible, point blanc sur année sélectionnée | Conforme | ✅ |
| T28 | Tooltip graphique au survol | Prix formaté en € affiché | Conforme | ✅ |
| T29 | Récapitulatif véhicule | Affiche marque, modèle, carburant, boîte, année, km, options | Conforme | ✅ |

---

## 4. Tests API REST

| ID  | Endpoint | Méthode | Test | Résultat attendu | Statut |
|-----|----------|---------|------|-----------------|--------|
| A01 | /api/marques | GET | Requête normale | JSON tableau 10 marques triées | ✅ |
| A02 | /api/modeles | GET | ?marque_id=1 | JSON modèles Renault avec champ carburants | ✅ |
| A03 | /api/modeles | GET | ?marque_id=999 | Tableau vide [] | ✅ |
| A04 | /api/modeles | GET | sans marque_id | HTTP 400 + message erreur | ✅ |
| A05 | /api/estimations | POST | Données valides | HTTP 201 + {success: true} | ✅ |
| A06 | /api/estimations | POST | Données incomplètes | HTTP 400 + message erreur | ✅ |
| A07 | /api/estimations | POST | etat_estime invalide | HTTP 400 validation échouée | ✅ |
| A08 | /api/estimations | GET | Liste estimations | JSON 50 dernières estimations | ✅ |
| A09 | /api/marques | DELETE | Méthode non autorisée | HTTP 405 | ✅ |

---

## 5. Tests base de données

| ID  | Test | Vérification | Résultat | Statut |
|-----|------|-------------|---------|--------|
| D01 | Intégrité référentielle | Supprimer une marque → ses modèles supprimés (CASCADE) | Cascade OK | ✅ |
| D02 | Contrainte CHECK état | INSERT estimation avec etat_estime='Invalid' → rejet | Rejet BDD | ✅ |
| D03 | Contrainte UNIQUE favoris | Doublon favori même user/estimation → rejet | Rejet BDD | ✅ |
| D04 | Estimation anonyme | INSERT estimation sans id_utilisateur (NULL) → accepté | Accepté | ✅ |
| D05 | Comptage données | SELECT COUNT sur chaque table | 10/36/5/12/6/15 lignes | ✅ |

---

## 6. Tests de compatibilité et responsive

| ID  | Scénario | Résultat attendu | Statut |
|-----|---------|-----------------|--------|
| C01 | Chrome 124 | Fonctionnement complet | ✅ |
| C02 | Firefox 126 | Fonctionnement complet | ✅ |
| C03 | Safari 17 | Fonctionnement complet | ✅ |
| C04 | Mobile 375px | Grille colonne unique, chips et couleurs lisibles | ✅ |
| C05 | Tablette 768px | Mise en page adaptée | ✅ |
| C06 | Mode dégradé (API off) | FALLBACK local — les 28 marques restent disponibles | ✅ |

---

## 7. Bilan des tests

| Catégorie | Tests prévus | Tests réussis | Taux |
|-----------|-------------|--------------|------|
| Interface / navigation | 10 | 10 | 100 % |
| Calcul et modificateurs | 13 | 13 | 100 % |
| Affichage / animations | 6 | 6 | 100 % |
| API REST | 9 | 9 | 100 % |
| Base de données | 5 | 5 | 100 % |
| Compatibilité | 6 | 6 | 100 % |
| **Total** | **49** | **49** | **100 %** |

---

## 8. Anomalies détectées et corrections

| ID | Anomalie | Correction apportée |
|----|---------|---------------------|
| BUG-01 | Coefficient kilométrique < 0 pour km très élevé | `coefKm = Math.max(0.40, ...)` — plancher 40% |
| BUG-02 | Graphique non détruit avant recréation | `chartInstance.destroy()` avant `new Chart()` |
| BUG-03 | `@vercel/postgres` déprécié | Migration vers `@neondatabase/serverless` |
| BUG-04 | `channel_binding=require` incompatible Node.js local | Utilisation de `DATABASE_URL_UNPOOLED` pour `init-db.js` |
| BUG-05 | Marques FALLBACK absentes du select en mode API | Ajout des marques FALLBACK non présentes en DB avec indicateur `★` |
