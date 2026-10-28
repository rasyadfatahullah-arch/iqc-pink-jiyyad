// Vercel Serverless Function: /api/generate
// Apikey dibaca dari Environment Variable, tidak pernah dikirim ke browser.

const UPSTREAM = 'https://api.jerexd.my.id/api/maker/iqc-pink';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apikey = process.env.IQC_API_KEY;
  if (!apikey) {
    return res.status(500).json({ error: 'IQC_API_KEY belum diatur di Environment Variables' });
  }

  const b = req.body || {};
  const payload = {
    text: String(b.text || '').slice(0, 500),
    time: String(b.time || ''),
    bubbleTime: String(b.bubbleTime || ''),
    network: String(b.network || ''),
    signal: String(b.signal || ''),
    battery: String(b.battery || ''),
    charging: String(b.charging || ''),
    reactions: String(b.reactions || '')
  };

  if (!payload.text.trim()) {
    return res.status(400).json({ error: 'Teks tidak boleh kosong' });
  }

  try {
    const upstream = await fetch(`${UPSTREAM}?apikey=${apikey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const type = upstream.headers.get('content-type') || '';

    if (!upstream.ok) {
      return res.status(502).json({ error: 'API upstream error', status: upstream.status });
    }

    // Jika API langsung mengembalikan gambar
    if (type.startsWith('image/')) {
      const buf = Buffer.from(await upstream.arrayBuffer());
      return res.status(200).json({ base64: `data:${type};base64,${buf.toString('base64')}` });
    }

    // Jika JSON
    const data = await upstream.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Gagal menghubungi API', detail: e.message });
  }
}
