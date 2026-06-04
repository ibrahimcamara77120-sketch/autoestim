# Cahier des charges — AutoEstim
## Estimateur de prix de revente automobile

**Auteur :** Camara Ibrahim — N° candidat 2545812845
**École :** Digital School of Paris – IEF2I
**Date :** Avril 2026 — Version 2.0
**Contexte :** Projet léger BTS SIO option SLAM — Épreuve E6

---

## 1. Contexte et problématique

### 1.1 Contexte

Les particuliers souhaitant vendre leur véhicule d'occasion ne disposent pas toujours d'un outil simple, rapide et gratuit pour estimer sa valeur marchande. Les solutions professionnelles existantes (Argus, La Centrale, AutoScout24) sont soit payantes, soit trop complexes, soit dépendantes d'une connexion aux systèmes tiers.

**Contexte de réalisation :** Projet léger développé de manière autonome dans le cadre de l'épreuve E6 du BTS SIO SLAM, visant à démontrer des compétences en développement web full-stack (frontend, API REST, base de données relationnelle, déploiement cloud).

### 1.2 Problématique

> Comment concevoir une application web accessible, précise et autonome permettant à un particulier d'estimer le prix de revente de son véhicule sur le marché français, tout en s'appuyant sur une architecture moderne avec base de données et API ?

---

## 2. Objectifs du projet

### 2.1 Objectifs fonctionnels

- Permettre l'estimation du prix de revente d'un véhicule selon : marque, modèle, carburant, boîte, année, kilométrage, couleur, options, historique
- Couvrir 28 marques et 200+ modèles du marché français
- Afficher une fourchette de prix bas / moyen / haut avec détail du calcul
- Présenter une courbe de dépréciation sur 15 ans (Chart.js)
- Sauvegarder automatiquement chaque estimation en base de données

### 2.2 Objectifs techniques

- Architecture 3-tiers : Frontend (HTML/JS) → API REST (Vercel Serverless) → Base de données PostgreSQL (Neon)
- Déploiement sur Vercel avec URL publique stable
- Base de données relationnelle PostgreSQL avec 3 tables
- API RESTful documentée (3 endpoints)

---

## 3. Périmètre fonctionnel

### 3.1 Fonctionnalités couvertes

| ID  | Fonctionnalité | Priorité | Statut |
|-----|---------------|----------|--------|
| F01 | Sélection marque / modèle depuis la BDD | Haute | ✅ Réalisé |
| F02 | Sélection carburant (chips dynamiques par modèle) | Haute | ✅ Réalisé |
| F03 | Sélection boîte de vitesses | Haute | ✅ Réalisé |
| F04 | Saisie année (1995–2026) et kilométrage | Haute | ✅ Réalisé |
| F05 | Calcul de fourchette de prix (algorithme dépréciation) | Haute | ✅ Réalisé |
| F06 | Détail du calcul (breakdown par facteur) | Haute | ✅ Réalisé |
| F07 | Badge état général (Excellent / Bon / Correct / Fatigué) | Haute | ✅ Réalisé |
| F08 | Graphique de dépréciation sur 15 ans (Chart.js) | Haute | ✅ Réalisé |
| F09 | Filtres avancés : couleur (12 couleurs), options (12), historique | Moyenne | ✅ Réalisé |
| F10 | Sauvegarde automatique de l'estimation en BDD | Moyenne | ✅ Réalisé |
| F11 | Interface responsive (mobile + desktop) | Haute | ✅ Réalisé |
| F12 | Mode dégradé (fallback local si API indisponible) | Basse | ✅ Réalisé |

### 3.2 Hors périmètre

- Authentification utilisateur (comptes, connexion) — prévu mais non implémenté
- Comparaison entre plusieurs véhicules
- Export PDF des résultats
- Notifications email

---

## 4. Cas d'utilisation (résumé)

| Acteur | Actions |
|--------|---------|
| Visiteur anonyme | Sélectionner un véhicule, configurer les critères, lancer l'estimation, consulter les résultats |
| Système API | Lire les marques/modèles en BDD, sauvegarder les estimations |
| Administrateur BDD | Maintenir le référentiel (marques, modèles, prix marché) |

---

## 5. Contraintes techniques

| Contrainte | Détail |
|-----------|--------|
| Frontend | HTML5 / CSS3 / JavaScript ES6 — aucun framework |
| Backend | Node.js — Vercel Serverless Functions |
| Base de données | PostgreSQL via Neon (cloud serverless) |
| Déploiement | Vercel — URL publique HTTPS |
| Bibliothèques | Chart.js v4.4 (CDN), @neondatabase/serverless |
| Compatibilité | Chrome, Firefox, Safari, Edge — Mobile ≥ 320px |
| Performance | Estimation calculée en < 100ms |

---

## 6. Architecture retenue

```
[ Navigateur / Frontend ]
        ↓ fetch()
[ API Vercel (Node.js Serverless) ]
   /api/marques  — GET
   /api/modeles  — GET ?marque_id=X
   /api/estimations — GET / POST
        ↓ SQL
[ Base de données PostgreSQL — Neon Cloud ]
   3 tables : marques, modeles, estimations
```

---

## 7. Planning réel

| Phase | Tâche | Durée réelle |
|-------|-------|-------------|
| Analyse | Définition besoin, choix technologiques | 2h |
| Conception | MCD/MLD, diagrammes UML, architecture | 3h |
| Développement frontend | HTML/CSS/JS, algorithme, Chart.js | 8h |
| Développement backend | API serverless, connexion Neon | 4h |
| Base de données | Schéma, peuplement (28 marques, 200+ modèles) | 3h |
| Tests | Tests fonctionnels, API, BDD | 2h |
| Documentation | CDC, guide, veille, diagrammes, bilan | 3h |
| Déploiement | Vercel + Neon + configuration | 1h |
| **Total** | | **~26h** |

---

## 8. Livrables réalisés

| Livrable | Description | Statut |
|----------|-------------|--------|
| `index.html` | Application web complète (frontend) | ✅ |
| `api/marques.js` | Endpoint GET /api/marques | ✅ |
| `api/modeles.js` | Endpoint GET /api/modeles | ✅ |
| `api/estimations.js` | Endpoint GET/POST /api/estimations | ✅ |
| `database.sql` | Script SQL complet (3 tables + données) | ✅ |
| `docs/conception.md` | Diagrammes UML + MCD/MLD | ✅ |
| `docs/architecture.md` | Architecture technique | ✅ |
| `docs/guide_utilisateur.md` | Guide d'utilisation complet | ✅ |
| `docs/plan_tests.md` | Plan de tests + résultats | ✅ |
| `docs/veille_technologique.md` | Veille technologique | ✅ |
| `docs/bilan.md` | Bilan du projet | ✅ |
| URL production | https://autoestim.vercel.app | ✅ |

---

## 9. Critères d'acceptation

- [x] 28 marques et 200+ modèles sélectionnables depuis la BDD
- [x] Les filtres (carburant, boîte, couleur, options, historique) impactent le prix calculé
- [x] Le détail du calcul affiche chaque facteur avec son impact en euros
- [x] La fourchette est cohérente avec les prix du marché réel
- [x] Le graphique Chart.js s'affiche avec le point de l'année sélectionnée mis en évidence
- [x] Chaque estimation est sauvegardée en base PostgreSQL
- [x] L'interface est lisible sur mobile (320px minimum)
- [x] Le site est accessible en ligne via HTTPS
- [x] Mode dégradé fonctionnel si l'API est indisponible
