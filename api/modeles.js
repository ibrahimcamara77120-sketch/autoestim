const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).end();

  const { marque_id } = req.query;
  if (!marque_id || isNaN(Number(marque_id))) {
    return res.status(400).json({ error: 'marque_id invalide' });
  }

  try {
    const sql     = neon(process.env.DATABASE_URL);
    const modeles = await sql`
      SELECT id, nom, categorie, prix_neuf, depreciation_ann, km_moyen_annuel, carburants
      FROM modeles
      WHERE id_marque = ${Number(marque_id)}
      ORDER BY nom
    `;
    res.status(200).json(modeles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur base de données' });
  }
};
