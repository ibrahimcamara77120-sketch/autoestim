const { neon } = require('@neondatabase/serverless');

async function main() {
  const sql = neon(process.env.DATABASE_URL);

  console.log('Suppression des tables...');
  await sql`DROP TABLE IF EXISTS estimations CASCADE`;
  await sql`DROP TABLE IF EXISTS modeles CASCADE`;
  await sql`DROP TABLE IF EXISTS marques CASCADE`;

  console.log('Création des tables...');
  await sql`CREATE TABLE marques (
    id         SERIAL PRIMARY KEY,
    nom        VARCHAR(50)  NOT NULL UNIQUE,
    pays       VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;
  await sql`CREATE TABLE modeles (
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
  )`;
  await sql`CREATE TABLE estimations (
    id             SERIAL PRIMARY KEY,
    id_modele      INTEGER     NOT NULL REFERENCES modeles(id),
    annee_vehicule INTEGER     NOT NULL,
    kilometrage    INTEGER     NOT NULL,
    prix_bas       INTEGER     NOT NULL,
    prix_moyen     INTEGER     NOT NULL,
    prix_haut      INTEGER     NOT NULL,
    etat_estime    VARCHAR(20) NOT NULL CHECK (etat_estime IN ('Excellent','Bon','Correct','Fatigué')),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  // ── MARQUES (28) ──────────────────────────────────────────────────────────
  console.log('Insertion des 28 marques...');
  await sql`INSERT INTO marques (nom, pays) VALUES
    ('Alfa Romeo', 'Italie'),
    ('Audi',       'Allemagne'),
    ('BMW',        'Allemagne'),
    ('Citroën',    'France'),
    ('Dacia',      'Roumanie'),
    ('Fiat',       'Italie'),
    ('Ford',       'États-Unis'),
    ('Honda',      'Japon'),
    ('Hyundai',    'Corée du Sud'),
    ('Jeep',       'États-Unis'),
    ('Kia',        'Corée du Sud'),
    ('Land Rover', 'Royaume-Uni'),
    ('Mazda',      'Japon'),
    ('Mercedes',   'Allemagne'),
    ('Mini',       'Royaume-Uni'),
    ('Mitsubishi', 'Japon'),
    ('Nissan',     'Japon'),
    ('Opel',       'Allemagne'),
    ('Peugeot',    'France'),
    ('Porsche',    'Allemagne'),
    ('Renault',    'France'),
    ('Seat',       'Espagne'),
    ('Skoda',      'Rép. tchèque'),
    ('Suzuki',     'Japon'),
    ('Tesla',      'États-Unis'),
    ('Toyota',     'Japon'),
    ('Volkswagen', 'Allemagne'),
    ('Volvo',      'Suède')`;

  // Récupérer les IDs par nom
  const rows = await sql`SELECT id, nom FROM marques ORDER BY nom`;
  const M = {};
  rows.forEach(r => { M[r.nom] = r.id; });

  // ── MODÈLES (200+) ────────────────────────────────────────────────────────
  console.log('Insertion des modèles...');

  // Alfa Romeo
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Alfa Romeo']},'Giulia',   'Berline',44900,0.15,15000,'Essence,Diesel',2016),
    (${M['Alfa Romeo']},'Giulietta','Berline',28000,0.15,14000,'Essence,Diesel',2014),
    (${M['Alfa Romeo']},'Stelvio',  'SUV',    52000,0.14,16000,'Essence,Diesel',2017),
    (${M['Alfa Romeo']},'Tonale',   'SUV',    42000,0.13,15000,'Essence,Hybride,PHEV',2022)`;

  // Audi
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Audi']},'A1',        'Citadine',28000,0.13,14000,'Essence',2018),
    (${M['Audi']},'A3',        'Berline', 37000,0.12,15000,'Essence,Diesel,Hybride,PHEV',2020),
    (${M['Audi']},'A4',        'Berline', 48000,0.12,15000,'Essence,Diesel',2019),
    (${M['Audi']},'A4 Avant',  'Break',   51000,0.11,15000,'Essence,Diesel',2019),
    (${M['Audi']},'A5',        'Coupé',   52000,0.12,15000,'Essence,Diesel',2019),
    (${M['Audi']},'A6',        'Berline', 62000,0.11,16000,'Essence,Diesel,Hybride,PHEV',2018),
    (${M['Audi']},'A6 Avant',  'Break',   65000,0.11,16000,'Diesel,Hybride',2018),
    (${M['Audi']},'Q2',        'SUV',     32000,0.13,14000,'Essence,Diesel',2016),
    (${M['Audi']},'Q3',        'SUV',     42000,0.12,15000,'Essence,Diesel',2019),
    (${M['Audi']},'Q4 e-tron', 'SUV',     55000,0.17,14000,'Électrique',2021),
    (${M['Audi']},'Q5',        'SUV',     58000,0.11,16000,'Essence,Diesel,Hybride,PHEV',2017),
    (${M['Audi']},'Q7',        'SUV',     82000,0.12,17000,'Diesel,Hybride',2015),
    (${M['Audi']},'TT',        'Coupé',   55000,0.14,13000,'Essence',2015),
    (${M['Audi']},'e-tron GT', 'Berline',110000,0.18,14000,'Électrique',2021)`;

  // BMW
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['BMW']},'Serie 1',        'Citadine',35000,0.14,15000,'Essence,Diesel',2019),
    (${M['BMW']},'Serie 2',        'Coupé',   40000,0.13,14000,'Essence,Diesel',2021),
    (${M['BMW']},'Serie 2 Gran Coupé','Berline',38000,0.13,14000,'Essence,Diesel',2019),
    (${M['BMW']},'Serie 3',        'Berline', 48000,0.13,15000,'Essence,Diesel,Hybride,PHEV',2018),
    (${M['BMW']},'Serie 3 Touring','Break',   52000,0.12,16000,'Essence,Diesel,Hybride',2019),
    (${M['BMW']},'Serie 4',        'Coupé',   58000,0.13,15000,'Essence,Diesel',2020),
    (${M['BMW']},'Serie 5',        'Berline', 62000,0.13,16000,'Essence,Diesel,Hybride,PHEV',2021),
    (${M['BMW']},'X1',             'SUV',     45000,0.13,15000,'Essence,Diesel,PHEV',2022),
    (${M['BMW']},'X2',             'SUV',     42000,0.13,14000,'Essence,Diesel',2017),
    (${M['BMW']},'X3',             'SUV',     58000,0.12,16000,'Essence,Diesel,Hybride,PHEV',2017),
    (${M['BMW']},'X5',             'SUV',     88000,0.13,17000,'Diesel,Hybride,PHEV',2018),
    (${M['BMW']},'iX3',            'SUV',     70000,0.18,14000,'Électrique',2020),
    (${M['BMW']},'Z4',             'Cabriolet',65000,0.14,13000,'Essence',2018)`;

  // Citroën
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Citroën']},'C1',          'Citadine',12500,0.14,12000,'Essence',2014),
    (${M['Citroën']},'C3',          'Citadine',17000,0.13,14000,'Essence,Diesel',2020),
    (${M['Citroën']},'C3 Aircross', 'SUV',     22000,0.13,15000,'Essence,Diesel',2017),
    (${M['Citroën']},'C4',          'Berline', 25000,0.13,15000,'Essence,Diesel,Électrique',2020),
    (${M['Citroën']},'C5 Aircross', 'SUV',     32000,0.13,16000,'Essence,Diesel,Hybride,PHEV',2018),
    (${M['Citroën']},'C5 X',        'Berline', 38000,0.12,16000,'Hybride,PHEV',2021),
    (${M['Citroën']},'Berlingo',    'Monospace',27000,0.13,17000,'Essence,Diesel',2018),
    (${M['Citroën']},'ë-C4',        'Berline', 38000,0.16,13000,'Électrique',2021)`;

  // Dacia
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Dacia']},'Sandero','Citadine',13000,0.11,15000,'Essence,GPL',2020),
    (${M['Dacia']},'Duster', 'SUV',     18000,0.11,16000,'Essence,Diesel,GPL',2018),
    (${M['Dacia']},'Logan',  'Berline', 11500,0.12,14000,'Essence,GPL',2020),
    (${M['Dacia']},'Spring', 'Citadine',22000,0.15,10000,'Électrique',2021),
    (${M['Dacia']},'Jogger', 'Monospace',20000,0.11,15000,'Essence,GPL',2022)`;

  // Fiat
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Fiat']},'500',     'Citadine',16000,0.14,12000,'Essence',2015),
    (${M['Fiat']},'500e',    'Citadine',34000,0.17,11000,'Électrique',2020),
    (${M['Fiat']},'500X',    'SUV',     25000,0.14,14000,'Essence,Diesel',2014),
    (${M['Fiat']},'Panda',   'Citadine',13000,0.13,13000,'Essence,GPL',2011),
    (${M['Fiat']},'Tipo',    'Berline', 20000,0.13,15000,'Essence,Diesel',2015),
    (${M['Fiat']},'Tipo SW', 'Break',   22000,0.12,15000,'Essence,Diesel',2016)`;

  // Ford
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Ford']},'Fiesta',        'Citadine',19000,0.13,14000,'Essence,Diesel',2017),
    (${M['Ford']},'Focus',         'Berline', 26000,0.12,15000,'Essence,Diesel',2018),
    (${M['Ford']},'Puma',          'SUV',     27000,0.12,15000,'Essence,Hybride',2019),
    (${M['Ford']},'Kuga',          'SUV',     35000,0.12,16000,'Essence,Diesel,Hybride,PHEV',2019),
    (${M['Ford']},'Mustang Mach-E','SUV',     55000,0.17,14000,'Électrique',2020),
    (${M['Ford']},'Explorer',      'SUV',     58000,0.14,17000,'PHEV',2019)`;

  // Honda
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Honda']},'Jazz',  'Citadine',24000,0.11,13000,'Hybride',2020),
    (${M['Honda']},'Civic', 'Berline', 32000,0.11,15000,'Essence,Hybride',2021),
    (${M['Honda']},'HR-V',  'SUV',     28000,0.12,14000,'Hybride',2021),
    (${M['Honda']},'CR-V',  'SUV',     40000,0.11,16000,'Essence,Hybride',2018),
    (${M['Honda']},'ZR-V',  'SUV',     38000,0.11,15000,'Hybride',2023),
    (${M['Honda']},'e',     'Citadine',36000,0.18,11000,'Électrique',2020)`;

  // Hyundai
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Hyundai']},'i10',          'Citadine',14000,0.13,12000,'Essence',2019),
    (${M['Hyundai']},'i20',          'Citadine',19000,0.12,13000,'Essence',2020),
    (${M['Hyundai']},'i30',          'Berline', 25000,0.12,14000,'Essence,Diesel',2017),
    (${M['Hyundai']},'Tucson',       'SUV',     35000,0.11,15000,'Essence,Diesel,Hybride,PHEV',2020),
    (${M['Hyundai']},'Kona',         'SUV',     26000,0.12,14000,'Essence,Hybride',2017),
    (${M['Hyundai']},'Kona Electric','SUV',     40000,0.16,12000,'Électrique',2018),
    (${M['Hyundai']},'Santa Fe',     'SUV',     48000,0.12,17000,'Diesel,Hybride,PHEV',2018),
    (${M['Hyundai']},'IONIQ 5',      'SUV',     48000,0.16,13000,'Électrique',2021),
    (${M['Hyundai']},'IONIQ 6',      'Berline', 52000,0.16,13000,'Électrique',2022)`;

  // Jeep
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Jeep']},'Renegade', 'SUV',26000,0.13,14000,'Essence,Diesel,PHEV',2014),
    (${M['Jeep']},'Compass',  'SUV',32000,0.13,15000,'Essence,Diesel,PHEV',2017),
    (${M['Jeep']},'Avenger',  'SUV',29000,0.13,14000,'Essence,Électrique',2022),
    (${M['Jeep']},'Cherokee', 'SUV',42000,0.13,16000,'Diesel',2018)`;

  // Kia
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Kia']},'Picanto',  'Citadine',14000,0.13,11000,'Essence',2017),
    (${M['Kia']},'Rio',      'Citadine',18000,0.12,13000,'Essence',2017),
    (${M['Kia']},'Ceed',     'Berline', 26000,0.12,14000,'Essence,Diesel',2018),
    (${M['Kia']},'Sportage', 'SUV',     34000,0.11,15000,'Essence,Diesel,Hybride,PHEV',2021),
    (${M['Kia']},'Sorento',  'SUV',     48000,0.11,17000,'Diesel,Hybride,PHEV',2020),
    (${M['Kia']},'Niro',     'SUV',     32000,0.12,14000,'Hybride,PHEV,Électrique',2022),
    (${M['Kia']},'EV6',      'SUV',     52000,0.16,13000,'Électrique',2021),
    (${M['Kia']},'EV9',      'SUV',     78000,0.16,14000,'Électrique',2023)`;

  // Land Rover
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Land Rover']},'Discovery Sport',    'SUV',52000,0.14,16000,'Diesel,PHEV',2019),
    (${M['Land Rover']},'Range Rover Evoque', 'SUV',55000,0.14,15000,'Diesel,PHEV',2019),
    (${M['Land Rover']},'Range Rover Sport',  'SUV',95000,0.14,17000,'Diesel,Hybride,PHEV',2022),
    (${M['Land Rover']},'Defender',           'SUV',75000,0.14,17000,'Diesel,Hybride,PHEV',2019)`;

  // Mazda
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Mazda']},'2',    'Citadine',17000,0.12,13000,'Essence',2014),
    (${M['Mazda']},'3',    'Berline', 26000,0.11,14000,'Essence,Hybride',2019),
    (${M['Mazda']},'6',    'Berline', 35000,0.11,15000,'Essence,Diesel',2012),
    (${M['Mazda']},'CX-30','SUV',     28000,0.11,14000,'Essence,Hybride',2019),
    (${M['Mazda']},'CX-5', 'SUV',     35000,0.10,15000,'Essence,Diesel',2017),
    (${M['Mazda']},'CX-60','SUV',     44000,0.11,15000,'Essence,Diesel,PHEV',2022),
    (${M['Mazda']},'MX-5', 'Cabriolet',33000,0.11,12000,'Essence',2015)`;

  // Mercedes
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Mercedes']},'Classe A',    'Citadine',38000,0.13,15000,'Essence,Diesel',2018),
    (${M['Mercedes']},'Classe B',    'Monospace',35000,0.12,14000,'Essence,Diesel',2018),
    (${M['Mercedes']},'Classe C',    'Berline', 52000,0.12,15000,'Essence,Diesel,Hybride,PHEV',2021),
    (${M['Mercedes']},'Classe C Break','Break', 55000,0.11,15000,'Essence,Diesel,Hybride',2021),
    (${M['Mercedes']},'Classe E',    'Berline', 68000,0.12,16000,'Diesel,Hybride,PHEV',2016),
    (${M['Mercedes']},'GLA',         'SUV',     44000,0.13,15000,'Essence,Diesel',2019),
    (${M['Mercedes']},'GLB',         'SUV',     48000,0.12,15000,'Essence,Diesel',2019),
    (${M['Mercedes']},'GLC',         'SUV',     62000,0.12,16000,'Diesel,Hybride,PHEV',2022),
    (${M['Mercedes']},'GLE',         'SUV',     88000,0.13,17000,'Diesel,Hybride,PHEV',2019),
    (${M['Mercedes']},'EQA',         'SUV',     52000,0.17,13000,'Électrique',2021),
    (${M['Mercedes']},'EQB',         'SUV',     58000,0.17,14000,'Électrique',2021),
    (${M['Mercedes']},'EQC',         'SUV',     78000,0.18,14000,'Électrique',2019)`;

  // Mini
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Mini']},'Cooper',         'Citadine',28000,0.14,13000,'Essence,Diesel',2014),
    (${M['Mini']},'Cooper Electric','Citadine',38000,0.17,11000,'Électrique',2019),
    (${M['Mini']},'Clubman',        'Break',   38000,0.13,13000,'Essence,Diesel',2015),
    (${M['Mini']},'Countryman',     'SUV',     38000,0.13,14000,'Essence,Diesel,PHEV',2016),
    (${M['Mini']},'Cabrio',         'Cabriolet',35000,0.14,12000,'Essence',2015)`;

  // Mitsubishi
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Mitsubishi']},'ASX',          'SUV',24000,0.12,14000,'Essence',2010),
    (${M['Mitsubishi']},'Eclipse Cross','SUV',32000,0.12,15000,'Essence,PHEV',2017),
    (${M['Mitsubishi']},'Outlander',    'SUV',38000,0.12,16000,'Diesel,PHEV',2012)`;

  // Nissan
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Nissan']},'Micra',    'Citadine',16000,0.13,12000,'Essence',2017),
    (${M['Nissan']},'Juke',     'SUV',     24000,0.12,14000,'Essence,Hybride',2019),
    (${M['Nissan']},'Qashqai',  'SUV',     32000,0.11,15000,'Essence,Hybride',2021),
    (${M['Nissan']},'X-Trail',  'SUV',     42000,0.11,16000,'Essence,Hybride',2022),
    (${M['Nissan']},'Leaf',     'Citadine',34000,0.18,12000,'Électrique',2017),
    (${M['Nissan']},'Ariya',    'SUV',     55000,0.17,14000,'Électrique',2021),
    (${M['Nissan']},'Townstar', 'Monospace',26000,0.12,16000,'Essence,Électrique',2022)`;

  // Opel
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Opel']},'Corsa',               'Citadine',18000,0.12,13000,'Essence,Diesel,Électrique',2019),
    (${M['Opel']},'Mokka',               'SUV',     25000,0.12,14000,'Essence,Diesel,Électrique',2020),
    (${M['Opel']},'Astra',               'Berline', 26000,0.12,14000,'Essence,Diesel,Hybride,PHEV',2021),
    (${M['Opel']},'Astra Sports Tourer', 'Break',   28000,0.11,15000,'Essence,Diesel,Hybride,PHEV',2022),
    (${M['Opel']},'Crossland',           'SUV',     22000,0.12,14000,'Essence,Diesel',2017),
    (${M['Opel']},'Grandland',           'SUV',     35000,0.11,15000,'Essence,Diesel,Hybride,PHEV',2017),
    (${M['Opel']},'Zafira Life',         'Monospace',38000,0.11,17000,'Diesel',2019)`;

  // Peugeot
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Peugeot']},'108',    'Citadine',13000,0.14,11000,'Essence',2014),
    (${M['Peugeot']},'208',    'Citadine',20000,0.13,15000,'Essence,Diesel,Électrique',2019),
    (${M['Peugeot']},'2008',   'SUV',     25000,0.12,14000,'Essence,Diesel,Électrique',2019),
    (${M['Peugeot']},'308',    'Berline', 26000,0.12,15000,'Essence,Diesel,Hybride,PHEV',2021),
    (${M['Peugeot']},'3008',   'SUV',     34000,0.13,16000,'Essence,Diesel,Hybride,PHEV',2021),
    (${M['Peugeot']},'408',    'Berline', 40000,0.12,15000,'Hybride,PHEV',2022),
    (${M['Peugeot']},'5008',   'SUV',     38000,0.12,16000,'Essence,Diesel,Hybride',2020),
    (${M['Peugeot']},'508',    'Berline', 45000,0.11,16000,'Essence,Diesel,Hybride,PHEV',2018),
    (${M['Peugeot']},'Rifter', 'Monospace',28000,0.12,16000,'Essence,Diesel',2018)`;

  // Porsche
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Porsche']},'911',        'Coupé',    130000,0.10,13000,'Essence',2019),
    (${M['Porsche']},'718 Cayman', 'Coupé',     68000,0.12,12000,'Essence',2016),
    (${M['Porsche']},'718 Boxster','Cabriolet',  68000,0.12,12000,'Essence',2016),
    (${M['Porsche']},'Macan',      'SUV',        75000,0.13,16000,'Essence,Diesel,Électrique',2014),
    (${M['Porsche']},'Cayenne',    'SUV',        95000,0.12,17000,'Essence,Hybride,PHEV',2017),
    (${M['Porsche']},'Panamera',   'Berline',   110000,0.13,16000,'Essence,Hybride,PHEV',2016),
    (${M['Porsche']},'Taycan',     'Berline',   110000,0.17,14000,'Électrique',2019)`;

  // Renault
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Renault']},'Twingo',       'Citadine',15000,0.14,12000,'Essence',2014),
    (${M['Renault']},'Clio',         'Citadine',18500,0.13,15000,'Essence,Hybride,GPL',2019),
    (${M['Renault']},'Captur',       'SUV',     22500,0.13,15000,'Essence,Diesel,Hybride,PHEV',2019),
    (${M['Renault']},'Megane',       'Berline', 23000,0.12,15000,'Essence,Diesel',2016),
    (${M['Renault']},'Megane E-Tech','Berline', 40000,0.15,14000,'Hybride,PHEV',2020),
    (${M['Renault']},'Kadjar',       'SUV',     28000,0.14,16000,'Essence,Diesel',2015),
    (${M['Renault']},'Koleos',       'SUV',     36000,0.12,16000,'Diesel',2017),
    (${M['Renault']},'Arkana',       'SUV',     29900,0.13,15000,'Essence,Hybride',2021),
    (${M['Renault']},'Austral',      'SUV',     35000,0.12,15000,'Hybride,PHEV',2022),
    (${M['Renault']},'Scenic',       'Monospace',32000,0.13,15000,'Hybride,Électrique',2023),
    (${M['Renault']},'Zoe',          'Citadine',32000,0.16,12000,'Électrique',2019)`;

  // Seat
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Seat']},'Mii',              'Citadine',12000,0.13,11000,'Essence',2011),
    (${M['Seat']},'Ibiza',            'Citadine',20000,0.12,13000,'Essence,Diesel',2017),
    (${M['Seat']},'Arona',            'SUV',     22000,0.12,14000,'Essence,Diesel',2017),
    (${M['Seat']},'Leon',             'Berline', 25000,0.11,14000,'Essence,Diesel,Hybride,PHEV',2020),
    (${M['Seat']},'Leon Sportstourer','Break',   27000,0.11,15000,'Essence,Diesel,Hybride',2020),
    (${M['Seat']},'Ateca',            'SUV',     30000,0.11,15000,'Essence,Diesel',2016),
    (${M['Seat']},'Tarraco',          'SUV',     35000,0.11,16000,'Essence,Diesel,PHEV',2018)`;

  // Skoda
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Skoda']},'Fabia',         'Citadine',18000,0.12,13000,'Essence',2021),
    (${M['Skoda']},'Scala',         'Berline', 24000,0.11,14000,'Essence',2018),
    (${M['Skoda']},'Kamiq',         'SUV',     24000,0.12,14000,'Essence,Diesel',2019),
    (${M['Skoda']},'Octavia',       'Berline', 30000,0.10,15000,'Essence,Diesel,Hybride',2020),
    (${M['Skoda']},'Octavia Combi', 'Break',   32000,0.10,16000,'Essence,Diesel,Hybride',2020),
    (${M['Skoda']},'Karoq',         'SUV',     30000,0.11,15000,'Essence,Diesel',2017),
    (${M['Skoda']},'Kodiaq',        'SUV',     40000,0.11,16000,'Essence,Diesel',2016),
    (${M['Skoda']},'Superb',        'Berline', 42000,0.10,16000,'Essence,Diesel',2015),
    (${M['Skoda']},'Enyaq',         'SUV',     50000,0.16,14000,'Électrique',2020)`;

  // Suzuki
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Suzuki']},'Ignis', 'Citadine',17000,0.12,12000,'Essence,Hybride',2016),
    (${M['Suzuki']},'Swift', 'Citadine',18000,0.12,12000,'Essence,Hybride',2017),
    (${M['Suzuki']},'Jimny', 'SUV',     22000,0.09,14000,'Essence',2018),
    (${M['Suzuki']},'Vitara','SUV',     26000,0.11,14000,'Hybride',2015),
    (${M['Suzuki']},'S-Cross','SUV',    25000,0.11,14000,'Hybride',2021)`;

  // Tesla
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Tesla']},'Model 3','Berline',52000,0.18,15000,'Électrique',2017),
    (${M['Tesla']},'Model Y','SUV',    58000,0.18,15000,'Électrique',2020),
    (${M['Tesla']},'Model S','Berline',110000,0.17,15000,'Électrique',2012),
    (${M['Tesla']},'Model X','SUV',    115000,0.18,15000,'Électrique',2015)`;

  // Toyota
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Toyota']},'Aygo X',       'Citadine',17000,0.12,11000,'Essence',2021),
    (${M['Toyota']},'Yaris',        'Citadine',20000,0.10,13000,'Hybride',2020),
    (${M['Toyota']},'Yaris Cross',  'SUV',     25000,0.10,14000,'Hybride',2021),
    (${M['Toyota']},'C-HR',         'SUV',     28000,0.11,14000,'Hybride,PHEV',2016),
    (${M['Toyota']},'Corolla',      'Berline', 27000,0.10,15000,'Hybride',2018),
    (${M['Toyota']},'Corolla Touring','Break', 30000,0.10,15000,'Hybride',2018),
    (${M['Toyota']},'RAV4',         'SUV',     38000,0.11,16000,'Hybride,PHEV',2018),
    (${M['Toyota']},'GR86',         'Coupé',   35000,0.12,13000,'Essence',2021),
    (${M['Toyota']},'Land Cruiser', 'SUV',     75000,0.10,18000,'Diesel',2021),
    (${M['Toyota']},'bZ4X',         'SUV',     52000,0.17,14000,'Électrique',2022)`;

  // Volkswagen
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Volkswagen']},'Up',     'Citadine',13000,0.13,11000,'Essence',2011),
    (${M['Volkswagen']},'Polo',   'Citadine',22000,0.11,14000,'Essence',2017),
    (${M['Volkswagen']},'Golf',   'Berline', 30000,0.10,15000,'Essence,Diesel,Hybride',2019),
    (${M['Volkswagen']},'Golf SW','Break',   33000,0.10,16000,'Essence,Diesel,Hybride',2020),
    (${M['Volkswagen']},'T-Cross','SUV',     26000,0.11,14000,'Essence',2018),
    (${M['Volkswagen']},'T-Roc',  'SUV',     32000,0.11,15000,'Essence,Diesel,Hybride',2017),
    (${M['Volkswagen']},'Tiguan', 'SUV',     38000,0.11,16000,'Essence,Diesel,Hybride,PHEV',2020),
    (${M['Volkswagen']},'Touareg','SUV',     72000,0.11,17000,'Diesel,Hybride,PHEV',2018),
    (${M['Volkswagen']},'Passat', 'Berline', 42000,0.10,17000,'Diesel,Hybride',2019),
    (${M['Volkswagen']},'Arteon', 'Berline', 55000,0.11,16000,'Essence,Diesel,Hybride',2017),
    (${M['Volkswagen']},'ID.3',   'Citadine',40000,0.17,14000,'Électrique',2019),
    (${M['Volkswagen']},'ID.4',   'SUV',     48000,0.17,14000,'Électrique',2020),
    (${M['Volkswagen']},'ID.5',   'SUV',     52000,0.17,14000,'Électrique',2021),
    (${M['Volkswagen']},'ID.7',   'Berline', 62000,0.17,15000,'Électrique',2023)`;

  // Volvo
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,carburants,annee_debut) VALUES
    (${M['Volvo']},'XC40','SUV',  42000,0.12,14000,'Essence,Diesel,Hybride,PHEV,Électrique',2017),
    (${M['Volvo']},'XC60','SUV',  58000,0.11,15000,'Diesel,Hybride,PHEV',2017),
    (${M['Volvo']},'XC90','SUV',  75000,0.11,17000,'Diesel,Hybride,PHEV',2014),
    (${M['Volvo']},'V60', 'Break',45000,0.11,15000,'Diesel,Hybride,PHEV',2018),
    (${M['Volvo']},'C40', 'SUV',  52000,0.16,14000,'Électrique',2021),
    (${M['Volvo']},'EX30','SUV',  42000,0.17,13000,'Électrique',2023)`;

  // ── Vérification finale ────────────────────────────────────────────────────
  const counts = await sql`
    SELECT 'marques'     AS t, COUNT(*) AS n FROM marques
    UNION ALL SELECT 'modeles',    COUNT(*) FROM modeles
    UNION ALL SELECT 'estimations',COUNT(*) FROM estimations
    ORDER BY t`;

  console.log('\n=== BASE INITIALISÉE ===');
  counts.forEach(r => console.log(`  ${r.t.padEnd(12)}: ${r.n} lignes`));
}

main().catch(e => { console.error(e.message); process.exit(1); });
