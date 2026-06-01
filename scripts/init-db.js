const { neon } = require('@neondatabase/serverless');

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) { console.error('DATABASE_URL manquant'); process.exit(1); }

  const sql = neon(dbUrl);

  console.log('Suppression des tables existantes...');
  await sql`DROP TABLE IF EXISTS favoris CASCADE`;
  await sql`DROP TABLE IF EXISTS historique_prix_marche CASCADE`;
  await sql`DROP TABLE IF EXISTS estimations CASCADE`;
  await sql`DROP TABLE IF EXISTS utilisateurs CASCADE`;
  await sql`DROP TABLE IF EXISTS modeles CASCADE`;
  await sql`DROP TABLE IF EXISTS marques CASCADE`;

  console.log('Création des tables...');

  await sql`CREATE TABLE marques (
    id         SERIAL PRIMARY KEY,
    nom        VARCHAR(50)  NOT NULL UNIQUE,
    pays       VARCHAR(50),
    logo_url   VARCHAR(255),
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
    annee_debut      INTEGER,
    annee_fin        INTEGER,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  await sql`CREATE TABLE utilisateurs (
    id           SERIAL PRIMARY KEY,
    email        VARCHAR(100) NOT NULL UNIQUE,
    nom          VARCHAR(50),
    prenom       VARCHAR(50),
    mot_de_passe VARCHAR(255) NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  await sql`CREATE TABLE estimations (
    id             SERIAL PRIMARY KEY,
    id_modele      INTEGER     NOT NULL REFERENCES modeles(id),
    id_utilisateur INTEGER     REFERENCES utilisateurs(id),
    annee_vehicule INTEGER     NOT NULL,
    kilometrage    INTEGER     NOT NULL,
    prix_bas       INTEGER     NOT NULL,
    prix_moyen     INTEGER     NOT NULL,
    prix_haut      INTEGER     NOT NULL,
    etat_estime    VARCHAR(20) NOT NULL CHECK (etat_estime IN ('Excellent','Bon','Correct','Fatigué')),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  await sql`CREATE TABLE favoris (
    id             SERIAL PRIMARY KEY,
    id_utilisateur INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    id_estimation  INTEGER NOT NULL REFERENCES estimations(id) ON DELETE CASCADE,
    note           TEXT,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_utilisateur, id_estimation)
  )`;

  await sql`CREATE TABLE historique_prix_marche (
    id             SERIAL PRIMARY KEY,
    id_modele      INTEGER  NOT NULL REFERENCES modeles(id),
    annee_vehicule INTEGER  NOT NULL,
    kilometrage    INTEGER  NOT NULL,
    prix_constate  INTEGER  NOT NULL,
    source         VARCHAR(100),
    date_releve    DATE     NOT NULL
  )`;

  console.log('Insertion des marques...');
  await sql`INSERT INTO marques (nom, pays) VALUES
    ('Renault','France'),('Peugeot','France'),('Citroen','France'),
    ('Volkswagen','Allemagne'),('BMW','Allemagne'),('Mercedes','Allemagne'),
    ('Toyota','Japon'),('Ford','États-Unis'),('Dacia','Roumanie'),('Audi','Allemagne')`;

  console.log('Insertion des modèles...');
  // Renault id=1
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,annee_debut) VALUES
    (1,'Clio','Citadine',18500,0.13,15000,2019),
    (1,'Megane','Berline',23000,0.12,15000,2016),
    (1,'Kadjar','SUV',28000,0.14,16000,2015),
    (1,'Captur','SUV',22500,0.13,15000,2019),
    (1,'Zoe','Électrique',32000,0.16,12000,2019)`;
  // Peugeot id=2
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,annee_debut) VALUES
    (2,'208','Citadine',20000,0.13,15000,2019),
    (2,'308','Berline',26000,0.12,15000,2021),
    (2,'3008','SUV',34000,0.13,16000,2021),
    (2,'5008','SUV',38000,0.12,16000,2020)`;
  // Citroen id=3
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,annee_debut) VALUES
    (3,'C3','Citadine',17000,0.13,14000,2020),
    (3,'C5 Aircross','SUV',32000,0.13,16000,2018),
    (3,'C4','Berline',25000,0.13,15000,2020)`;
  // Volkswagen id=4
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,annee_debut) VALUES
    (4,'Polo','Citadine',22000,0.11,14000,2017),
    (4,'Golf','Berline',30000,0.10,15000,2019),
    (4,'Tiguan','SUV',38000,0.11,16000,2020),
    (4,'T-Roc','SUV',32000,0.11,15000,2017)`;
  // BMW id=5
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,annee_debut) VALUES
    (5,'Serie 1','Citadine',35000,0.14,15000,2019),
    (5,'Serie 3','Berline',48000,0.13,15000,2018),
    (5,'Serie 5','Berline',62000,0.13,16000,2021)`;
  // Mercedes id=6
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,annee_debut) VALUES
    (6,'Classe A','Citadine',38000,0.13,15000,2018),
    (6,'Classe C','Berline',52000,0.12,15000,2021),
    (6,'GLA','SUV',44000,0.13,15000,2020)`;
  // Toyota id=7
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,annee_debut) VALUES
    (7,'Yaris','Citadine',20000,0.10,13000,2020),
    (7,'Corolla','Berline',27000,0.10,15000,2018),
    (7,'RAV4','SUV',38000,0.11,16000,2018),
    (7,'Yaris Cross','SUV',25000,0.10,14000,2021)`;
  // Ford id=8
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,annee_debut) VALUES
    (8,'Fiesta','Citadine',19000,0.13,14000,2017),
    (8,'Focus','Berline',26000,0.12,15000,2018),
    (8,'Puma','SUV',27000,0.12,15000,2019)`;
  // Dacia id=9
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,annee_debut) VALUES
    (9,'Sandero','Citadine',13000,0.11,15000,2020),
    (9,'Duster','SUV',18000,0.11,16000,2018),
    (9,'Logan','Berline',11500,0.12,14000,2020)`;
  // Audi id=10
  await sql`INSERT INTO modeles (id_marque,nom,categorie,prix_neuf,depreciation_ann,km_moyen_annuel,annee_debut) VALUES
    (10,'A1','Citadine',28000,0.13,14000,2018),
    (10,'A3','Berline',37000,0.12,15000,2020),
    (10,'A4','Berline',48000,0.12,15000,2020),
    (10,'Q3','SUV',42000,0.12,15000,2019)`;

  console.log('Insertion des utilisateurs...');
  await sql`INSERT INTO utilisateurs (email,nom,prenom,mot_de_passe) VALUES
    ('alice.dupont@gmail.com','Dupont','Alice','$2b$10$hashedALICEplaceholder'),
    ('bob.martin@gmail.com','Martin','Bob','$2b$10$hashedBOBplaceholder'),
    ('camille.durand@gmail.com','Durand','Camille','$2b$10$hashedCAMILLEplaceholder'),
    ('david.leroy@gmail.com','Leroy','David','$2b$10$hashedDAVIDplaceholder'),
    ('emma.petit@gmail.com','Petit','Emma','$2b$10$hashedEMMAplaceholder')`;

  console.log('Insertion des estimations...');
  await sql`INSERT INTO estimations (id_modele,id_utilisateur,annee_vehicule,kilometrage,prix_bas,prix_moyen,prix_haut,etat_estime) VALUES
    (1,1,2020,45000,8200,9100,10000,'Bon'),
    (2,1,2019,62000,10500,11800,13000,'Correct'),
    (6,2,2021,28000,12800,14200,15500,'Excellent'),
    (14,2,2020,55000,14000,15600,17000,'Bon'),
    (17,3,2019,70000,19000,21500,24000,'Correct'),
    (25,3,2021,22000,15500,17200,18800,'Excellent'),
    (31,4,2020,48000,7800,8700,9600,'Bon'),
    (34,4,2021,30000,24000,26500,29000,'Excellent'),
    (10,5,2018,88000,6200,7100,7900,'Fatigué'),
    (27,5,2020,40000,11500,12800,14000,'Bon'),
    (1,NULL,2019,78000,6100,7000,7800,'Fatigué'),
    (6,NULL,2022,15000,14500,16100,17600,'Excellent')`;

  console.log('Insertion des favoris...');
  await sql`INSERT INTO favoris (id_utilisateur,id_estimation,note) VALUES
    (1,1,'À revoir pour achat potentiel'),
    (1,2,NULL),(2,3,'Bonne affaire possible'),
    (3,5,'Trop chère pour mon budget'),
    (4,8,'Parfaite, je vais contacter le vendeur'),
    (5,9,NULL)`;

  console.log("Insertion de l'historique des prix...");
  await sql`INSERT INTO historique_prix_marche (id_modele,annee_vehicule,kilometrage,prix_constate,source,date_releve) VALUES
    (1,2020,40000,9500,'La Centrale','2025-01-10'),
    (1,2020,55000,8700,'Leboncoin','2025-02-14'),
    (1,2019,75000,7200,'Argus','2025-03-01'),
    (2,2019,60000,12000,'La Centrale','2025-01-20'),
    (6,2021,25000,14800,'Leboncoin','2025-02-28'),
    (6,2022,12000,16900,'AutoScout24','2025-03-15'),
    (14,2020,50000,16200,'La Centrale','2025-01-05'),
    (14,2019,72000,13500,'Argus','2025-02-10'),
    (17,2019,65000,22000,'AutoScout24','2025-01-18'),
    (25,2021,20000,17500,'Leboncoin','2025-03-20'),
    (31,2020,45000,9000,'La Centrale','2025-02-05'),
    (34,2021,28000,27500,'AutoScout24','2025-03-10'),
    (10,2018,90000,6800,'Leboncoin','2025-01-25'),
    (27,2020,38000,13200,'Argus','2025-02-20'),
    (32,2019,80000,7100,'La Centrale','2025-03-05')`;

  // Vérification finale
  const counts = await sql`
    SELECT 'marques' AS t, COUNT(*) AS n FROM marques
    UNION ALL SELECT 'modeles', COUNT(*) FROM modeles
    UNION ALL SELECT 'utilisateurs', COUNT(*) FROM utilisateurs
    UNION ALL SELECT 'estimations', COUNT(*) FROM estimations
    UNION ALL SELECT 'favoris', COUNT(*) FROM favoris
    UNION ALL SELECT 'historique_prix_marche', COUNT(*) FROM historique_prix_marche
    ORDER BY t
  `;

  console.log('\n=== BASE DE DONNÉES INITIALISÉE ===');
  counts.forEach(r => console.log(`  ${r.t.padEnd(25)}: ${r.n} lignes`));
  console.log('====================================');
}

main().catch(e => { console.error(e.message); process.exit(1); });
