-- =====================================================
-- AutoEstim — Schéma de base de données potentiel
-- Ce fichier représente les tables qui auraient pu
-- exister si le projet avait utilisé une vraie base
-- de données relationnelle (PostgreSQL).
-- =====================================================

-- =====================================================
-- TABLE : marques
-- Stocke les marques automobiles disponibles
-- =====================================================
CREATE TABLE marques (
    id          SERIAL PRIMARY KEY,
    nom         VARCHAR(50)  NOT NULL UNIQUE,
    pays        VARCHAR(50),                        -- pays d'origine (France, Allemagne...)
    logo_url    VARCHAR(255),                       -- lien vers le logo de la marque
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE : modeles
-- Stocke les modèles liés à une marque
-- avec leurs caractéristiques de dépréciation
-- =====================================================
CREATE TABLE modeles (
    id                  SERIAL PRIMARY KEY,
    id_marque           INTEGER      NOT NULL REFERENCES marques(id) ON DELETE CASCADE,
    nom                 VARCHAR(50)  NOT NULL,
    categorie           VARCHAR(30),                -- berline, SUV, citadine, break...
    prix_neuf           INTEGER      NOT NULL,      -- prix catalogue neuf en euros
    depreciation_ann    DECIMAL(4,2) NOT NULL,      -- taux annuel ex: 0.13 = 13%
    km_moyen_annuel     INTEGER      NOT NULL,      -- kilométrage moyen de référence
    annee_debut         INTEGER,                    -- première année de commercialisation
    annee_fin           INTEGER,                    -- dernière année (NULL si encore produit)
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE : utilisateurs
-- Stocke les comptes utilisateurs (si authentification)
-- =====================================================
CREATE TABLE utilisateurs (
    id          SERIAL PRIMARY KEY,
    email       VARCHAR(100) NOT NULL UNIQUE,
    nom         VARCHAR(50),
    prenom      VARCHAR(50),
    mot_de_passe VARCHAR(255) NOT NULL,             -- hashé (bcrypt)
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE : estimations
-- Historique de toutes les estimations effectuées
-- (anonymes ou liées à un compte utilisateur)
-- =====================================================
CREATE TABLE estimations (
    id              SERIAL PRIMARY KEY,
    id_modele       INTEGER     NOT NULL REFERENCES modeles(id),
    id_utilisateur  INTEGER     REFERENCES utilisateurs(id),  -- NULL si non connecté
    annee_vehicule  INTEGER     NOT NULL,           -- année de mise en circulation
    kilometrage     INTEGER     NOT NULL,           -- km saisis par l'utilisateur
    prix_bas        INTEGER     NOT NULL,           -- fourchette basse calculée
    prix_moyen      INTEGER     NOT NULL,           -- prix moyen calculé
    prix_haut       INTEGER     NOT NULL,           -- fourchette haute calculée
    etat_estime     VARCHAR(20) NOT NULL,           -- Excellent / Bon / Correct / Fatigué
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE : favoris
-- Permet à un utilisateur de sauvegarder
-- ses estimations préférées
-- =====================================================
CREATE TABLE favoris (
    id              SERIAL PRIMARY KEY,
    id_utilisateur  INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    id_estimation   INTEGER NOT NULL REFERENCES estimations(id) ON DELETE CASCADE,
    note            TEXT,                           -- commentaire libre de l'utilisateur
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_utilisateur, id_estimation)          -- pas de doublon favori
);

-- =====================================================
-- TABLE : historique_prix_marche
-- Référentiel de prix réels observés sur le marché
-- (alimenté manuellement ou via scraping autorisé)
-- permet de calibrer l'algorithme de dépréciation
-- =====================================================
CREATE TABLE historique_prix_marche (
    id              SERIAL PRIMARY KEY,
    id_modele       INTEGER     NOT NULL REFERENCES modeles(id),
    annee_vehicule  INTEGER     NOT NULL,
    kilometrage     INTEGER     NOT NULL,
    prix_constate   INTEGER     NOT NULL,           -- prix réel observé sur le marché
    source          VARCHAR(100),                   -- ex : "La Centrale", "Leboncoin"
    date_releve     DATE        NOT NULL
);

-- =====================================================
-- RELATIONS (résumé)
-- =====================================================
--
--  marques ──< modeles ──< estimations >── utilisateurs
--                               │
--                            favoris
--
--  modeles ──< historique_prix_marche
--
-- =====================================================

-- =====================================================
-- EXEMPLES DE REQUETES UTILES
-- =====================================================

-- 1. Récupérer tous les modèles d'une marque
SELECT mo.nom, mo.prix_neuf, mo.depreciation_ann, mo.km_moyen_annuel
FROM modeles mo
JOIN marques ma ON mo.id_marque = ma.id
WHERE ma.nom = 'Renault'
ORDER BY mo.nom;

-- 2. Historique des estimations d'un utilisateur
SELECT ma.nom AS marque, mo.nom AS modele,
       e.annee_vehicule, e.kilometrage,
       e.prix_bas, e.prix_moyen, e.prix_haut, e.etat_estime,
       e.created_at
FROM estimations e
JOIN modeles mo ON e.id_modele = mo.id
JOIN marques ma ON mo.id_marque = ma.id
WHERE e.id_utilisateur = 1
ORDER BY e.created_at DESC;

-- 3. Les modèles les plus estimés (statistiques)
SELECT ma.nom AS marque, mo.nom AS modele, COUNT(*) AS nb_estimations
FROM estimations e
JOIN modeles mo ON e.id_modele = mo.id
JOIN marques ma ON mo.id_marque = ma.id
GROUP BY ma.nom, mo.nom
ORDER BY nb_estimations DESC
LIMIT 10;

-- 4. Prix moyen constaté vs prix calculé par l'algorithme
SELECT mo.nom AS modele,
       AVG(h.prix_constate) AS prix_marche_moyen,
       AVG(e.prix_moyen)    AS prix_algorithme_moyen
FROM historique_prix_marche h
JOIN modeles mo ON h.id_modele = mo.id
JOIN estimations e ON e.id_modele = mo.id
GROUP BY mo.nom
ORDER BY mo.nom;
