-- =====================================================
-- AutoEstim — Script d'initialisation de la base
-- Base : PostgreSQL | Base de données : autoestim
-- =====================================================

-- Suppression des tables si elles existent déjà
DROP TABLE IF EXISTS modeles;
DROP TABLE IF EXISTS marques;

-- =====================================================
-- TABLE : marques
-- =====================================================
CREATE TABLE marques (
    id   SERIAL PRIMARY KEY,
    nom  VARCHAR(50) NOT NULL UNIQUE
);

-- =====================================================
-- TABLE : modeles
-- =====================================================
CREATE TABLE modeles (
    id                  SERIAL PRIMARY KEY,
    id_marque           INTEGER NOT NULL REFERENCES marques(id) ON DELETE CASCADE,
    nom                 VARCHAR(50) NOT NULL,
    prix_neuf           INTEGER NOT NULL,
    depreciation_ann    DECIMAL(4,2) NOT NULL,
    km_moyen_annuel     INTEGER NOT NULL
);

-- =====================================================
-- INSERTION : marques
-- =====================================================
INSERT INTO marques (nom) VALUES
    ('Renault'),
    ('Peugeot'),
    ('Citroen'),
    ('Volkswagen'),
    ('BMW'),
    ('Mercedes'),
    ('Toyota'),
    ('Ford'),
    ('Dacia'),
    ('Audi');

-- =====================================================
-- INSERTION : modeles
-- =====================================================

-- Renault (id=1)
INSERT INTO modeles (id_marque, nom, prix_neuf, depreciation_ann, km_moyen_annuel) VALUES
    (1, 'Clio',    18500, 0.13, 15000),
    (1, 'Megane',  23000, 0.12, 15000),
    (1, 'Kadjar',  28000, 0.14, 16000),
    (1, 'Captur',  22500, 0.13, 15000),
    (1, 'Zoe',     32000, 0.16, 12000);

-- Peugeot (id=2)
INSERT INTO modeles (id_marque, nom, prix_neuf, depreciation_ann, km_moyen_annuel) VALUES
    (2, '208',   20000, 0.13, 15000),
    (2, '308',   26000, 0.12, 15000),
    (2, '3008',  34000, 0.13, 16000),
    (2, '5008',  38000, 0.12, 16000);

-- Citroen (id=3)
INSERT INTO modeles (id_marque, nom, prix_neuf, depreciation_ann, km_moyen_annuel) VALUES
    (3, 'C3',          17000, 0.13, 14000),
    (3, 'C5 Aircross', 32000, 0.13, 16000),
    (3, 'C4',          25000, 0.13, 15000);

-- Volkswagen (id=4)
INSERT INTO modeles (id_marque, nom, prix_neuf, depreciation_ann, km_moyen_annuel) VALUES
    (4, 'Polo',   22000, 0.11, 14000),
    (4, 'Golf',   30000, 0.10, 15000),
    (4, 'Tiguan', 38000, 0.11, 16000),
    (4, 'T-Roc',  32000, 0.11, 15000);

-- BMW (id=5)
INSERT INTO modeles (id_marque, nom, prix_neuf, depreciation_ann, km_moyen_annuel) VALUES
    (5, 'Serie 1', 35000, 0.14, 15000),
    (5, 'Serie 3', 48000, 0.13, 15000),
    (5, 'Serie 5', 62000, 0.13, 16000);

-- Mercedes (id=6)
INSERT INTO modeles (id_marque, nom, prix_neuf, depreciation_ann, km_moyen_annuel) VALUES
    (6, 'Classe A', 38000, 0.13, 15000),
    (6, 'Classe C', 52000, 0.12, 15000),
    (6, 'GLA',      44000, 0.13, 15000);

-- Toyota (id=7)
INSERT INTO modeles (id_marque, nom, prix_neuf, depreciation_ann, km_moyen_annuel) VALUES
    (7, 'Yaris',       20000, 0.10, 13000),
    (7, 'Corolla',     27000, 0.10, 15000),
    (7, 'RAV4',        38000, 0.11, 16000),
    (7, 'Yaris Cross', 25000, 0.10, 14000);

-- Ford (id=8)
INSERT INTO modeles (id_marque, nom, prix_neuf, depreciation_ann, km_moyen_annuel) VALUES
    (8, 'Fiesta', 19000, 0.13, 14000),
    (8, 'Focus',  26000, 0.12, 15000),
    (8, 'Puma',   27000, 0.12, 15000);

-- Dacia (id=9)
INSERT INTO modeles (id_marque, nom, prix_neuf, depreciation_ann, km_moyen_annuel) VALUES
    (9, 'Sandero', 13000, 0.11, 15000),
    (9, 'Duster',  18000, 0.11, 16000),
    (9, 'Logan',   11500, 0.12, 14000);

-- Audi (id=10)
INSERT INTO modeles (id_marque, nom, prix_neuf, depreciation_ann, km_moyen_annuel) VALUES
    (10, 'A1', 28000, 0.13, 14000),
    (10, 'A3', 37000, 0.12, 15000),
    (10, 'A4', 48000, 0.12, 15000),
    (10, 'Q3', 42000, 0.12, 15000);

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT m.nom AS marque, mo.nom AS modele, mo.prix_neuf, mo.depreciation_ann, mo.km_moyen_annuel
FROM modeles mo
JOIN marques m ON mo.id_marque = m.id
ORDER BY m.nom, mo.nom;
