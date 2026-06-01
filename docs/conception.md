# Conception — AutoEstim
## Modélisation UML et Merise

**Auteur :** Camara Ibrahim — N° candidat 2545812845
**Date :** Avril 2026

---

## 1. Diagramme de cas d'utilisation

```
┌─────────────────────────────────────────────────────────────────┐
│                        Système AutoEstim                        │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                                                         │   │
│   │   ◯ Charger les marques depuis la BDD                   │   │
│   │   ◯ Charger les modèles d'une marque                    │   │
│   │   ◯ Configurer les critères du véhicule                 │   │
│   │       ↳ choisir carburant / boîte                       │   │
│   │       ↳ saisir année / kilométrage                      │   │
│   │       ↳ [optionnel] couleur / options / historique      │   │
│   │   ◯ Lancer l'estimation de prix                         │   │
│   │       ↳ include : Calculer la dépréciation              │   │
│   │       ↳ include : Afficher le détail du calcul          │   │
│   │       ↳ include : Tracer la courbe de dépréciation      │   │
│   │       ↳ include : Sauvegarder l'estimation en BDD       │   │
│   │   ◯ Consulter les résultats (fourchette de prix)        │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│             ▲                                                    │
│             │                                                    │
│         👤 Visiteur                                              │
└─────────────────────────────────────────────────────────────────┘
```

### Description des cas d'utilisation principaux

| Cas d'utilisation | Acteur | Pré-condition | Post-condition |
|-------------------|--------|---------------|----------------|
| Charger les marques | Visiteur / Système | Page chargée | Liste des marques affichée |
| Charger les modèles | Visiteur | Marque sélectionnée | Liste des modèles + chips carburant |
| Configurer les critères | Visiteur | Modèle sélectionné | Tous les champs remplis |
| Lancer l'estimation | Visiteur | Marque + modèle + carburant + boîte + année + km | Résultats affichés + estimation sauvegardée |
| Consulter les résultats | Visiteur | Estimation calculée | Fourchette prix + breakdown + graphique |

---

## 2. Diagramme de séquence — Estimation complète

```
Visiteur        Frontend (JS)      API /marques    API /modeles    API /estimations    BDD Neon
   │                │                   │               │                │                │
   │  Charge page   │                   │               │                │                │
   │───────────────►│                   │               │                │                │
   │                │  GET /api/marques │               │                │                │
   │                │──────────────────►│               │                │                │
   │                │                   │  SELECT FROM  │                │                │
   │                │                   │  marques      │                │                │
   │                │                   │──────────────────────────────────────────────►  │
   │                │                   │               │                │   Résultat     │
   │                │                   │◄──────────────────────────────────────────────  │
   │                │◄──────────────────│               │                │                │
   │  Marques       │                   │               │                │                │
   │◄───────────────│                   │               │                │                │
   │                │                   │               │                │                │
   │  Sélectionne   │                   │               │                │                │
   │  Renault (id=1)│                   │               │                │                │
   │───────────────►│                   │               │                │                │
   │                │  GET /api/modeles?marque_id=1     │                │                │
   │                │────────────────────────────────►  │                │                │
   │                │                   │  SELECT FROM  │                │                │
   │                │                   │  modeles      │                │                │
   │                │                   │  WHERE        │                │                │
   │                │                   │  id_marque=1  │                │                │
   │                │                   │──────────────────────────────────────────────►  │
   │                │                   │               │    Résultat    │                │
   │                │                   │◄──────────────────────────────────────────────  │
   │                │◄────────────────────────────────  │                │                │
   │  Modèles       │                   │               │                │                │
   │◄───────────────│                   │               │                │                │
   │                │                   │               │                │                │
   │  Saisit les    │                   │               │                │                │
   │  critères et   │                   │               │                │                │
   │  clique Estimer│                   │               │                │                │
   │───────────────►│                   │               │                │                │
   │                │  Calcul local     │               │                │                │
   │                │  (algorithme JS)  │               │                │                │
   │                │──────────┐        │               │                │                │
   │                │◄─────────┘        │               │                │                │
   │                │                   │               │    POST /api/estimations         │
   │                │──────────────────────────────────────────────────►│                │
   │                │                   │               │                │ INSERT INTO    │
   │                │                   │               │                │ estimations    │
   │                │                   │               │                │───────────────►│
   │                │                   │               │                │◄───────────────│
   │                │◄──────────────────────────────────────────────────│                │
   │  Résultats     │                   │               │                │                │
   │◄───────────────│                   │               │                │                │
```

---

## 3. Diagramme de classes

```
┌──────────────────┐           ┌────────────────────────────────────┐
│     Marque       │  1     N  │              Modele                │
├──────────────────┤──────────►├────────────────────────────────────┤
│ + id : int       │           │ + id : int                         │
│ + nom : string   │           │ + nom : string                     │
│ + pays : string  │           │ + categorie : string               │
├──────────────────┤           │ + prixNeuf : int                   │
│ + getModeles()   │           │ + depreciationAnn : decimal(4,2)   │
└──────────────────┘           │ + kmMoyenAnnuel : int              │
                               │ + carburants : string (csv)        │
                               │ + anneeDebut : int                 │
                               ├────────────────────────────────────┤
                               │ + estimer(annee,km,opts):Estimation│
                               └──────────────┬─────────────────────┘
                                              │ 1
                                          N   ▼
                               ┌────────────────────────────────────┐
                               │           Estimation               │
                               ├────────────────────────────────────┤
                               │ + id : int                         │
                               │ + anneeVehicule : int              │
                               │ + kilometrage : int                │
                               │ + prixBas : int                    │
                               │ + prixMoyen : int                  │
                               │ + prixHaut : int                   │
                               │ + etatEstime : string              │
                               │ + createdAt : timestamp            │
                               └────────────────────────────────────┘
```

## 4. MCD — Modèle Conceptuel de Données (Merise)

```
 MARQUE                    MODELE
──────────────────    ─────────────────────────────────
 id (PK)              id (PK)
 nom                  nom
 pays                 categorie
                      prix_neuf
        1,N           depreciation_ann
         ├─── CONTIENT ──────────┤ 1,1
                      km_moyen_annuel
                      carburants
                      annee_debut

         │0,N
         └─── GÉNÈRE ──────────────────────────────────
                                                       │
                              ESTIMATION               │
                         ─────────────────────────     │
                              id (PK)              ◄───┘
                              annee_vehicule
                              kilometrage
                              prix_bas
                              prix_moyen
                              prix_haut
                              etat_estime
                              created_at
```

## 5. MLD — Modèle Logique de Données

```
MARQUES     (id, nom, pays, created_at)

MODELES     (id, #id_marque → MARQUES.id, nom, categorie,
             prix_neuf, depreciation_ann, km_moyen_annuel,
             carburants, annee_debut, created_at)

ESTIMATIONS (id, #id_modele → MODELES.id,
             annee_vehicule, kilometrage,
             prix_bas, prix_moyen, prix_haut, etat_estime, created_at)
```

**Clés primaires :** `id` (SERIAL)
**Clés étrangères :** attributs préfixés `#`

## 6. MPD — Modèle Physique de Données (extrait SQL)

```sql
CREATE TABLE marques (
    id   SERIAL PRIMARY KEY,
    nom  VARCHAR(50) NOT NULL UNIQUE,
    pays VARCHAR(50)
);

CREATE TABLE modeles (
    id               SERIAL PRIMARY KEY,
    id_marque        INTEGER NOT NULL REFERENCES marques(id) ON DELETE CASCADE,
    nom              VARCHAR(50)  NOT NULL,
    categorie        VARCHAR(30),
    prix_neuf        INTEGER      NOT NULL,
    depreciation_ann DECIMAL(4,2) NOT NULL,
    km_moyen_annuel  INTEGER      NOT NULL,
    carburants       VARCHAR(100) DEFAULT 'Essence,Diesel'
);

CREATE TABLE estimations (
    id             SERIAL PRIMARY KEY,
    id_modele      INTEGER NOT NULL REFERENCES modeles(id),
    id_utilisateur INTEGER REFERENCES utilisateurs(id),  -- nullable
    annee_vehicule INTEGER     NOT NULL,
    kilometrage    INTEGER     NOT NULL,
    prix_bas       INTEGER     NOT NULL,
    prix_moyen     INTEGER     NOT NULL,
    prix_haut      INTEGER     NOT NULL,
    etat_estime    VARCHAR(20) NOT NULL 
                   CHECK (etat_estime IN ('Excellent','Bon','Correct','Fatigué')),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 7. Algorithme de calcul du prix

### Description de l'algorithme

L'algorithme applique une **dépréciation exponentielle** ajustée par plusieurs facteurs :

```
Étape 1 — Dépréciation temporelle (base)
  prixBase = prixNeuf × (1 − tauxDépréciation) ^ âge

Étape 2 — Ajustement kilométrique
  kmAttendu = kmMoyenAnnuel × âge
  écart = (kmRéel − kmAttendu) / 10 000
  coefKm = 1 − 0.008 × écart  (si kilométrage > attendu)
           1 − 0.005 × écart  (si kilométrage < attendu)
  coefKm borné à [0.40 ; 1.30]

Étape 3 — Modificateurs optionnels (multipliés)
  × CARB_MOD[carburant]   (Diesel: 0.94, Hybride: 1.06, Électrique: 0.88...)
  × BOITE_MOD[boîte]      (Auto: +5%, Séquentielle: +3%)
  × COULEUR_MOD[couleur]  (Noir: +2%, Violet: −11%...)

Étape 4 — Options et historique (additifs puis multiplicatifs)
  + Σ options sélectionnées (GPS: +400€, Cuir: +800€...)
  × Historique (1ère main: +6%, carnet: +3%, garantie: +4%)
  × Accident (léger: −8%, grave: −20%)

Étape 5 — Fourchette ±12%
  prixHaut = prixMoyen × 1.12
  prixBas  = prixMoyen × 0.88
```

### Taux de dépréciation par catégorie

| Catégorie | Taux annuel | Exemple |
|-----------|-------------|---------|
| Citadines budget | 13–16 % | Dacia Sandero, Fiat 500 |
| Berlines/SUV premium | 11–13 % | VW Golf, BMW Série 3 |
| Véhicules électriques | 15–18 % | Tesla Model 3, Renault Zoé |
| Sportives | 9–12 % | Suzuki Jimny, Porsche 911 |
| Hybrides | 10–11 % | Toyota Yaris, Honda Civic |
