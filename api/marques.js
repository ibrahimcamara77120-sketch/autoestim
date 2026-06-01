const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const sql    = neon(process.env.DATABASE_URL);
    const marques = await sql`SELECT id, nom, pays FROM marques ORDER BY nom`;
    res.status(200).json(marques);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur base de données' });
  }
};
