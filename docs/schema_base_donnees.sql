-- =====================================================
-- AutoEstim — Schéma de base de données
-- Tables implémentées et déployées sur Neon PostgreSQL
-- =====================================================

-- =====================================================
-- TABLE : marques
-- Référentiel des marques automobiles
-- =====================================================
CREATE TABLE marques (
    id          SERIAL PRIMARY KEY,
    nom         VARCHAR(50)  NOT NULL UNIQUE,
    pays        VARCHAR(50),                        -- pays d'origine (France, Allemagne...)
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE : modeles
-- Modèles liés à une marque avec paramètres de calcul
-- =====================================================
CREATE TABLE modeles (
    id                  SERIAL PRIMARY KEY,
    id_marque           INTEGER      NOT NULL REFERENCES marques(id) ON DELETE CASCADE,
    nom                 VARCHAR(50)  NOT NULL,
    categorie           VARCHAR(30),                -- berline, SUV, citadine, break...
    prix_neuf           INTEGER      NOT NULL,      -- prix catalogue neuf en euros
    depreciation_ann    DECIMAL(4,2) NOT NULL,      -- taux annuel ex: 0.13 = 13%
    km_moyen_annuel     INTEGER      NOT NULL,      -- kilométrage moyen de référence
    carburants          VARCHAR(100) DEFAULT 'Essence,Diesel',
    annee_debut         INTEGER,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE : estimations
-- Historique de toutes les estimations effectuées
-- =====================================================
CREATE TABLE estimations (
    id              SERIAL PRIMARY KEY,
    id_modele       INTEGER     NOT NULL REFERENCES modeles(id),
    annee_vehicule  INTEGER     NOT NULL,           -- année de mise en circulation
    kilometrage     INTEGER     NOT NULL,           -- km saisis par l'utilisateur
    prix_bas        INTEGER     NOT NULL,           -- fourchette basse calculée
    prix_moyen      INTEGER     NOT NULL,           -- prix moyen calculé
    prix_haut       INTEGER     NOT NULL,           -- fourchette haute calculée
    etat_estime     VARCHAR(20) NOT NULL
                    CHECK (etat_estime IN ('Excellent','Bon','Correct','Fatigué')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- RELATIONS
-- =====================================================
--
--  marques (1) ──────< modeles (N) ──────< estimations
--
-- =====================================================

-- =====================================================
-- REQUÊTES DE RÉFÉRENCE
-- =====================================================

-- 1. Récupérer tous les modèles d'une marque
SELECT mo.nom, mo.prix_neuf, mo.depreciation_ann, mo.km_moyen_annuel, mo.carburants
FROM modeles mo
JOIN marques ma ON mo.id_marque = ma.id
WHERE ma.nom = 'Renault'
ORDER BY mo.nom;

-- 2. Les 10 modèles les plus estimés
SELECT ma.nom AS marque, mo.nom AS modele, COUNT(*) AS nb_estimations
FROM estimations e
JOIN modeles mo ON e.id_modele = mo.id
JOIN marques ma ON mo.id_marque = ma.id
GROUP BY ma.nom, mo.nom
ORDER BY nb_estimations DESC
LIMIT 10;

-- 3. Vérification intégrité (estimations sans modèle valide — doit retourner 0)
SELECT COUNT(*) FROM estimations e
LEFT JOIN modeles mo ON e.id_modele = mo.id
WHERE mo.id IS NULL;


-- =====================================================
-- ÉVOLUTIONS PRÉVUES (non implémentées dans la v2)
-- Documentées ici à titre de conception étendue
-- =====================================================

-- -- TABLE : utilisateurs (système d'authentification)
-- CREATE TABLE utilisateurs (
--     id          SERIAL PRIMARY KEY,
--     email       VARCHAR(100) NOT NULL UNIQUE,
--     nom         VARCHAR(50),
--     prenom      VARCHAR(50),
--     mot_de_passe VARCHAR(255) NOT NULL,
--     created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- TABLE : favoris (sauvegarde personnelle d'estimations)
-- CREATE TABLE favoris (
--     id              SERIAL PRIMARY KEY,
--     id_utilisateur  INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
--     id_estimation   INTEGER NOT NULL REFERENCES estimations(id) ON DELETE CASCADE,
--     note            TEXT,
--     created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     UNIQUE (id_utilisateur, id_estimation)
-- );

-- -- TABLE : historique_prix_marche (calibrage de l'algorithme)
-- CREATE TABLE historique_prix_marche (
--     id              SERIAL PRIMARY KEY,
--     id_modele       INTEGER  NOT NULL REFERENCES modeles(id),
--     annee_vehicule  INTEGER  NOT NULL,
--     kilometrage     INTEGER  NOT NULL,
--     prix_constate   INTEGER  NOT NULL,
--     source          VARCHAR(100),
--     date_releve     DATE     NOT NULL
-- );
