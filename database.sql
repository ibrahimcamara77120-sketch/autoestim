-- =====================================================
-- AutoEstim — Script d'initialisation
-- Base : PostgreSQL | Base de données : autoestim
-- Tables : marques, modeles, estimations
-- =====================================================

DROP TABLE IF EXISTS estimations CASCADE;
DROP TABLE IF EXISTS modeles CASCADE;
DROP TABLE IF EXISTS marques CASCADE;

-- =====================================================
-- TABLE 1 : marques
-- =====================================================
CREATE TABLE marques (
    id          SERIAL PRIMARY KEY,
    nom         VARCHAR(50)  NOT NULL UNIQUE,
    pays        VARCHAR(50),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 2 : modeles
-- =====================================================
CREATE TABLE modeles (
    id               SERIAL PRIMARY KEY,
    id_marque        INTEGER      NOT NULL REFERENCES marques(id) ON DELETE CASCADE,
    nom              VARCHAR(50)  NOT NULL,
    categorie        VARCHAR(30),
    prix_neuf        INTEGER      NOT NULL,
    depreciation_ann DECIMAL(4,2) NOT NULL,
    km_moyen_annuel  INTEGER      NOT NULL,
    carburants       VARCHAR(100) DEFAULT 'Essence,Diesel',
    annee_debut      INTEGER,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 3 : estimations
-- Chaque estimation lancée sur le site est sauvegardée
-- =====================================================
CREATE TABLE estimations (
    id             SERIAL PRIMARY KEY,
    id_modele      INTEGER     NOT NULL REFERENCES modeles(id),
    annee_vehicule INTEGER     NOT NULL,
    kilometrage    INTEGER     NOT NULL,
    prix_bas       INTEGER     NOT NULL,
    prix_moyen     INTEGER     NOT NULL,
    prix_haut      INTEGER     NOT NULL,
    etat_estime    VARCHAR(20) NOT NULL CHECK (etat_estime IN ('Excellent','Bon','Correct','Fatigué')),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- DONNÉES : marques (10)
-- =====================================================
INSERT INTO marques (nom, pays) VALUES
    ('Renault',    'France'),
    ('Peugeot',    'France'),
    ('Citroen',    'France'),
    ('Volkswagen', 'Allemagne'),
    ('BMW',        'Allemagne'),
    ('Mercedes',   'Allemagne'),
    ('Toyota',     'Japon'),
    ('Ford',       'États-Unis'),
    ('Dacia',      'Roumanie'),
    ('Audi',       'Allemagne');

-- =====================================================
-- DONNÉES : modeles (36)
-- =====================================================
INSERT INTO modeles (id_marque, nom, categorie, prix_neuf, depreciation_ann, km_moyen_annuel, carburants, annee_debut) VALUES
    (1,'Clio',    'Citadine',18500,0.13,15000,'Essence,Hybride,GPL',   2019),
    (1,'Megane',  'Berline', 23000,0.12,15000,'Essence,Diesel',        2016),
    (1,'Kadjar',  'SUV',     28000,0.14,16000,'Essence,Diesel',        2015),
    (1,'Captur',  'SUV',     22500,0.13,15000,'Essence,Diesel,Hybride,PHEV',2019),
    (1,'Zoe',     'Citadine',32000,0.16,12000,'Électrique',            2019),
    (2,'208',     'Citadine',20000,0.13,15000,'Essence,Diesel,Électrique',2019),
    (2,'308',     'Berline', 26000,0.12,15000,'Essence,Diesel,Hybride,PHEV',2021),
    (2,'3008',    'SUV',     34000,0.13,16000,'Essence,Diesel,Hybride,PHEV',2021),
    (2,'5008',    'SUV',     38000,0.12,16000,'Essence,Diesel,Hybride',2020),
    (3,'C3',      'Citadine',17000,0.13,14000,'Essence,Diesel',        2020),
    (3,'C5 Aircross','SUV',  32000,0.13,16000,'Essence,Diesel,Hybride,PHEV',2018),
    (3,'C4',      'Berline', 25000,0.13,15000,'Essence,Diesel,Électrique',2020),
    (4,'Polo',    'Citadine',22000,0.11,14000,'Essence',               2017),
    (4,'Golf',    'Berline', 30000,0.10,15000,'Essence,Diesel,Hybride',2019),
    (4,'Tiguan',  'SUV',     38000,0.11,16000,'Essence,Diesel,Hybride,PHEV',2020),
    (4,'T-Roc',   'SUV',     32000,0.11,15000,'Essence,Diesel,Hybride',2017),
    (5,'Serie 1', 'Citadine',35000,0.14,15000,'Essence,Diesel',        2019),
    (5,'Serie 3', 'Berline', 48000,0.13,15000,'Essence,Diesel,Hybride,PHEV',2018),
    (5,'Serie 5', 'Berline', 62000,0.13,16000,'Essence,Diesel,Hybride,PHEV',2021),
    (6,'Classe A','Citadine',38000,0.13,15000,'Essence,Diesel',        2018),
    (6,'Classe C','Berline', 52000,0.12,15000,'Essence,Diesel,Hybride,PHEV',2021),
    (6,'GLA',     'SUV',     44000,0.13,15000,'Essence,Diesel',        2020),
    (7,'Yaris',   'Citadine',20000,0.10,13000,'Hybride',               2020),
    (7,'Corolla', 'Berline', 27000,0.10,15000,'Hybride',               2018),
    (7,'RAV4',    'SUV',     38000,0.11,16000,'Hybride,PHEV',          2018),
    (7,'Yaris Cross','SUV',  25000,0.10,14000,'Hybride',               2021),
    (8,'Fiesta',  'Citadine',19000,0.13,14000,'Essence,Diesel',        2017),
    (8,'Focus',   'Berline', 26000,0.12,15000,'Essence,Diesel',        2018),
    (8,'Puma',    'SUV',     27000,0.12,15000,'Essence,Hybride',       2019),
    (9,'Sandero', 'Citadine',13000,0.11,15000,'Essence,GPL',           2020),
    (9,'Duster',  'SUV',     18000,0.11,16000,'Essence,Diesel,GPL',    2018),
    (9,'Logan',   'Berline', 11500,0.12,14000,'Essence,GPL',           2020),
    (10,'A1',     'Citadine',28000,0.13,14000,'Essence',               2018),
    (10,'A3',     'Berline', 37000,0.12,15000,'Essence,Diesel,Hybride,PHEV',2020),
    (10,'A4',     'Berline', 48000,0.12,15000,'Essence,Diesel',        2020),
    (10,'Q3',     'SUV',     42000,0.12,15000,'Essence,Diesel',        2019);

-- =====================================================
-- VÉRIFICATION
-- =====================================================
SELECT 'marques'    AS table_name, COUNT(*) AS nb_lignes FROM marques
UNION ALL
SELECT 'modeles',    COUNT(*) FROM modeles
UNION ALL
SELECT 'estimations',COUNT(*) FROM estimations
ORDER BY table_name;
