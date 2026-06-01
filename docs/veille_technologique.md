# Veille technologique — AutoEstim
## Choix des outils et technologies

**Auteur :** Camara Ibrahim — N° candidat 2545812845
**Date :** Avril 2026
**Projet :** AutoEstim v2.0 — Architecture full-stack cloud

---

## 1. Objectif de la veille

Identifier les technologies les mieux adaptées à la réalisation d'un estimateur de prix automobile **full-stack** (frontend + API REST + base de données + déploiement cloud), en tenant compte des contraintes du BTS SIO (maîtrise des technologies, coût nul, déploiement stable).

---

## 2. Frontend — Technologies retenues

### HTML5 / CSS3 / JavaScript ES6
- Standard du web, sans dépendance ni bundler
- CSS Grid + Flexbox pour le responsive sans framework
- ES6 : `async/await`, `fetch()`, modules, arrow functions

**Alternatives étudiées :**

| Alternative | Pourquoi écarté |
|------------|----------------|
| React.js | Nécessite bundler (Vite/webpack), complexité inutile |
| Vue.js | Idem, surcharge pour un projet léger |
| Bootstrap | CSS générique, contraire au dark mode custom souhaité |

**Décision :** Vanilla HTML/CSS/JS — simplicité, maîtrise totale, performance maximale.

### Chart.js v4.4 (CDN)
- Bibliothèque open-source, légère (~60 Ko gzippé)
- Graphiques `line`, `bar`, `pie` — tout ce dont le projet a besoin
- Documentation claire, nombreux exemples

**Alternatives étudiées :**

| Alternative | Pourquoi écarté |
|------------|----------------|
| D3.js | Puissant mais courbe d'apprentissage très élevée |
| ApexCharts | Plus lourd, moins documenté |
| Highcharts | Payant pour usage commercial |

---

## 3. Backend — API REST

### Vercel Serverless Functions (Node.js 18)
- Fonctions cloud déclenchées à la demande (0 serveur à gérer)
- Facturation à l'usage (gratuit jusqu'à 100 000 req/mois)
- Déploiement automatique à chaque push (ou CLI `npx vercel`)
- Même plateforme que le frontend → URL unifiée

**Alternatives étudiées :**

| Alternative | Pourquoi écarté |
|------------|----------------|
| Express.js (VPS) | Serveur à maintenir, coût mensuel, plus complexe |
| Netlify Functions | Fonctionnement similaire mais moins intégré avec Neon |
| AWS Lambda | Trop complexe pour un projet léger |
| Firebase Functions | Dépend de l'écosystème Google, moins standard |

**Décision :** Vercel Serverless — déjà utilisé pour le portfolio, déploiement en < 30 secondes.

---

## 4. Base de données

### PostgreSQL via Neon (cloud serverless)
- PostgreSQL standard : langage SQL connu, relationnel, solide
- Neon : PostgreSQL serverless sur AWS — gratuit jusqu'à 500 Mo
- Connexion HTTP via `@neondatabase/serverless` (pas de TCP/IP requis)
- Intégration native avec Vercel Marketplace → variables d'env auto-configurées

**Alternatives étudiées :**

| Alternative | Pourquoi écarté |
|------------|----------------|
| PHP + MySQL (hébergement mutualisé) | Architecture classique mais hébergement payant ; MySQL non accessible depuis Vercel sans tunnel ; déploiement manuel à chaque modification |
| PHP + MySQL (WAMP/XAMPP local) | Fonctionne en local uniquement, impossible à partager en ligne avec une URL stable |
| SQLite | Fichier local — pas de cloud, incompatible avec le modèle serverless (chaque Function est éphémère) |
| Firebase Firestore | NoSQL — pas de modèle relationnel, pas de SQL standard, dépend de l'écosystème Google |
| Supabase | PostgreSQL aussi, mais moins intégré nativement à Vercel |
| MongoDB Atlas | NoSQL — inadapté aux relations entre tables (marques → modeles → estimations) |

**Pourquoi pas PHP + MySQL ?** Le choix de Node.js + PostgreSQL repose sur 3 raisons concrètes :
1. **Déploiement** : Vercel ne supporte pas PHP en natif ; utiliser PHP aurait nécessité un hébergement séparé (OVH, Infomaniak) avec configuration manuelle.
2. **Cohérence** : Vercel Serverless + Neon forment un écosystème cloud unifié — les variables d'environnement sont configurées automatiquement, le HTTPS est inclus.
3. **Compétences** : PostgreSQL est le même langage SQL qu'avec MySQL, les requêtes sont identiques. Node.js est aujourd'hui le standard du développement web côté serveur.

**Décision :** Neon + Vercel = stack cloud cohérente, tout gratuit, tout intégré, URL publique HTTPS stable sans configuration manuelle.

### SDK choisi : @neondatabase/serverless
L'ancienne librairie `@vercel/postgres` a été dépréciée courant 2025.
Migration vers `@neondatabase/serverless` : connexion HTTP pure, compatible avec les Serverless Functions sans WebSocket.

---

## 5. Algorithme de dépréciation — recherches

### Sources consultées

| Source | Apport |
|--------|--------|
| Argus de l'automobile | Méthode de calcul par tranche d'âge et kilométrage |
| AutoScout24 Market Report 2024 | Taux de dépréciation par catégorie (EV, diesel, SUV) |
| CCFA — Comité des Constructeurs Français | Données sectorielles de revente |
| LaCentrale.fr — Côtes 2024–2025 | Calibrage des prix de référence par modèle |
| Études Deloitte — Marché VO 2024 | Impact du carburant sur la valeur résiduelle |

### Modèle retenu

```
Prix = PrixNeuf × (1 − TauxDépréciation)^âge
     × CoefKilométrique
     × Modificateur(carburant)
     × Modificateur(boîte)
     × Modificateur(couleur)
     + ΣOptions
     × Modificateur(historique)
```

**Justification des taux par carburant (2025–2026) :**
- Diesel : −6% vs essence (restrictions ZFE, images négative, demande en baisse)
- Hybride : +6% (prime verte, demande soutenue)
- Électrique : −12% (dépréciation forte : recharge, autonomie, incertitudes technologiques)
- GPL : −15% (niche, peu de repreneurs)

---

## 6. Déploiement — solutions comparées

| Solution | Avantages | Inconvénients | Verdict |
|----------|-----------|--------------|---------|
| Vercel | CLI simple, HTTPS auto, Serverless inclus, Neon intégré | — | ✅ **Retenu** |
| GitHub Pages | Gratuit, simple | Statique seulement, pas d'API | ✗ |
| Netlify | Drag & drop | Moins intégré avec Neon | ✗ |
| Railway | Backend + DB | Payant au-delà de la période gratuite | ✗ |
| Render | Similaire à Railway | Mise en veille après inactivité | ✗ |

---

## 7. Compétences développées

| Compétence | Niveau avant | Niveau après |
|-----------|-------------|-------------|
| Architecture 3-tiers (Frontend/API/DB) | Débutant | Intermédiaire |
| Node.js Serverless Functions | Débutant | Intermédiaire |
| PostgreSQL (SQL, schéma, relations) | Intermédiaire | Avancé |
| API REST (GET/POST, JSON, status codes) | Débutant | Intermédiaire |
| Déploiement cloud (Vercel + Neon) | Débutant | Intermédiaire |
| Chart.js | Débutant | Intermédiaire |
| Algorithme dépréciation (JS) | Intermédiaire | Avancé |
| CSS Variables, Dark mode, Responsive | Intermédiaire | Avancé |

---

## 8. Sources de veille

- MDN Web Docs — [developer.mozilla.org](https://developer.mozilla.org)
- Documentation Neon — [neon.tech/docs](https://neon.tech/docs)
- Documentation Vercel Serverless — [vercel.com/docs/functions](https://vercel.com/docs/functions)
- Documentation Chart.js — [chartjs.org/docs](https://www.chartjs.org/docs)
- LaCentrale.fr — côtes véhicules 2024–2025
- AutoScout24 Market Report — dépréciation par segment
