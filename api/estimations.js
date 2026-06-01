const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'POST') {
    const { id_modele, annee_vehicule, kilometrage, prix_bas, prix_moyen, prix_haut, etat_estime } = req.body || {};

    const etatsValides = ['Excellent', 'Bon', 'Correct', 'Fatigué'];
    if (!id_modele || !annee_vehicule || kilometrage == null || !prix_moyen || !etatsValides.includes(etat_estime)) {
      return res.status(400).json({ error: 'Données manquantes ou invalides' });
    }

    try {
      const sql = neon(process.env.DATABASE_URL);
      await sql`
        INSERT INTO estimations (id_modele, annee_vehicule, kilometrage, prix_bas, prix_moyen, prix_haut, etat_estime)
        VALUES (${id_modele}, ${annee_vehicule}, ${kilometrage}, ${prix_bas}, ${prix_moyen}, ${prix_haut}, ${etat_estime})
      `;
      res.status(201).json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur base de données' });
    }

  } else if (req.method === 'GET') {
    try {
      const sql  = neon(process.env.DATABASE_URL);
      const rows = await sql`
        SELECT e.id, ma.nom AS marque, mo.nom AS modele,
               e.annee_vehicule, e.kilometrage,
               e.prix_bas, e.prix_moyen, e.prix_haut, e.etat_estime,
               e.created_at
        FROM estimations e
        JOIN modeles mo ON e.id_modele = mo.id
        JOIN marques ma ON mo.id_marque = ma.id
        ORDER BY e.created_at DESC
        LIMIT 50
      `;
      res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur base de données' });
    }

  } else {
    res.status(405).end();
  }
};
