// Proxies contribution-form writes to Airtable, keeping the PAT server-side.
// Requires env vars AT_TOKEN and AT_BASE to be set in the Vercel project.
const ALLOWED_TABLES = new Set(['Reports', 'Submissions']);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { table, fields } = req.body ?? {};
  if (!ALLOWED_TABLES.has(table) || typeof fields !== 'object' || fields === null) {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }

  const r = await fetch(`https://api.airtable.com/v0/${process.env.AT_BASE}/${encodeURIComponent(table)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.AT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  if (!r.ok) {
    res.status(r.status).json({ error: 'Airtable request failed' });
    return;
  }

  res.status(200).json({ ok: true });
};
