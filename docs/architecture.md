# Architecture technique — AutoEstim

**Auteur :** Camara Ibrahim — N° candidat 2545812845
**Date :** Avril 2026

---

## 1. Vue d'ensemble

AutoEstim est une application web **3-tiers** déployée intégralement dans le cloud :

```
┌─────────────────────────────────────────────────────────┐
│                     COUCHE PRÉSENTATION                  │
│                                                          │
│   Navigateur web (Chrome / Firefox / Safari / Edge)      │
│   HTML5 + CSS3 + JavaScript ES6                          │
│   Chart.js (CDN) — Google Fonts (CDN)                    │
│                                                          │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS — fetch() API calls
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     COUCHE LOGIQUE                       │
│                                                          │
│   Vercel Serverless Functions (Node.js 18)               │
│   ├── GET  /api/marques                                  │
│   ├── GET  /api/modeles?marque_id=X                      │
│   └── GET / POST /api/estimations                        │
│                                                          │
│   @neondatabase/serverless — connexion HTTP/WebSocket    │
│                                                          │
└──────────────────────────┬──────────────────────────────┘
                           │ SQL over HTTPS
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     COUCHE DONNÉES                       │
│                                                          │
│   PostgreSQL 16 — Neon Serverless (AWS us-east-1)        │
│   Base : neondb / neon-red-village                       │
│   3 tables : marques, modeles, estimations               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Composants et rôles

### 2.1 Frontend (index.html)

| Composant | Rôle |
|-----------|------|
| Formulaire de sélection | Sélection progressive : marque → modèle → carburant → boîte → année → km |
| Section filtres avancés | Couleur, options équipements, historique véhicule |
| Algorithme de calcul (JS) | Calcul local du prix (dépréciation + modificateurs) |
| Section résultats | Affichage fourchette, badge état, breakdown facteurs |
| Chart.js | Tracé courbe de dépréciation sur 15 ans |
| Mode fallback | Données locales FALLBACK si API indisponible |

### 2.2 API Vercel (Serverless Functions)

| Endpoint | Méthode | Description | Paramètres |
|----------|---------|-------------|------------|
| `/api/marques` | GET | Liste de toutes les marques triées | — |
| `/api/modeles` | GET | Modèles d'une marque avec carburants | `?marque_id=X` |
| `/api/estimations` | GET | 50 dernières estimations | — |
| `/api/estimations` | POST | Sauvegarder une estimation | Body JSON |

**Exemple de réponse `/api/marques` :**
```json
[
  { "id": 1, "nom": "Renault", "pays": "France" },
  { "id": 2, "nom": "Peugeot", "pays": "France" },
  ...
]
```

**Exemple de réponse `/api/modeles?marque_id=1` :**
```json
[
  {
    "id": 1,
    "nom": "Clio",
    "categorie": "Citadine",
    "prix_neuf": 18500,
    "depreciation_ann": "0.13",
    "km_moyen_annuel": 15000,
    "carburants": "Essence,Hybride,GPL"
  },
  ...
]
```

**Body POST `/api/estimations` :**
```json
{
  "id_modele": 1,
  "annee_vehicule": 2020,
  "kilometrage": 45000,
  "prix_bas": 8200,
  "prix_moyen": 9300,
  "prix_haut": 10400,
  "etat_estime": "Bon"
}
```

### 2.3 Base de données PostgreSQL (Neon)

| Table | Lignes actuelles | Rôle |
|-------|-----------------|------|
| `marques` | 10 | Référentiel des marques automobiles |
| `modeles` | 36 | Caractéristiques des modèles (prix, dépréciation, carburants) |
| `estimations` | 12+ | Historique de toutes les estimations effectuées |

---

## 3. Flux de données complet

### Chargement initial

```
1. Navigateur → GET https://autoestim.vercel.app
2. Vercel CDN → Sert index.html (statique)
3. index.html → fetch('/api/marques')
4. /api/marques → SELECT id, nom, pays FROM marques ORDER BY nom
5. Neon → Retourne les 10 marques
6. Frontend → Peuple le <select> avec les marques
```

### Estimation complète

```
1. Utilisateur sélectionne Renault
2. fetch('/api/modeles?marque_id=1')
3. Neon → Retourne 11 modèles Renault avec carburants
4. Frontend affiche chips carburant dynamiques
5. Utilisateur remplit tous les critères
6. Clic "Estimer" → calcul local instantané (JS)
7. fetch POST '/api/estimations' → sauvegarde en BDD
8. Affichage résultats : fourchette + breakdown + graphique
```

---

## 4. Sécurité et robustesse

| Mesure | Implémentation |
|--------|---------------|
| Requêtes paramétrées | `sql\`WHERE id = ${value}\`` — protection injection SQL |
| Validation des entrées | Côté API : vérification types, valeurs nulles, CHECK contrainte BDD |
| CORS | Headers `Access-Control-Allow-Origin: *` sur les API routes |
| Mode dégradé | FALLBACK local si l'API échoue — le site reste fonctionnel |
| HTTPS | Obligatoire sur Vercel (certificat automatique) |
| SSL | Connexion Neon via `sslmode=require` |

---

## 5. Déploiement et environnement

### Variables d'environnement (Vercel)

| Variable | Source | Usage |
|----------|--------|-------|
| `DATABASE_URL` | Neon (Vercel Marketplace) | Connexion PostgreSQL pooler |
| `DATABASE_URL_UNPOOLED` | Neon | Connexion directe (scripts) |
| `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` | Neon | Accès CLI PostgreSQL |

### Pipeline de déploiement

```
Code local → npx vercel --prod → Vercel CI/CD → URL production
              ≈ 15 secondes     Build + Deploy  autoestim.vercel.app
```

---

## 6. Performances et scalabilité

| Métrique | Valeur mesurée |
|----------|---------------|
| Temps de réponse API `/api/marques` | ~150 ms (cold start) / ~50 ms (warm) |
| Temps de calcul estimation (JS) | < 5 ms |
| Taille `index.html` | ~120 Ko |
| Taille bundle API | ~15 Ko |
| Disponibilité Vercel | 99.99 % SLA |
| Scalabilité | Serverless : 0 à N instances selon trafic |
