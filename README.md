# IQC Pink Generator - by JIYYAD TOOLS

## Struktur
```
iqc-pink/
├── index.html       # struktur halaman
├── style.css        # tampilan
├── script.js        # logika frontend (memanggil /api/generate)
├── api/
│   └── generate.js  # serverless function, apikey dibaca dari env
├── .env.example
└── .gitignore
```

## Deploy ke Vercel
1. Upload folder ini ke GitHub (file `.env` jangan ikut, sudah ada di `.gitignore`).
2. Di Vercel: **Add New > Project**, pilih repo, lalu Deploy.
3. Buka **Settings > Environment Variables**, tambah:
   - Name: `IQC_API_KEY`
   - Value: apikey kamu
   - Centang Production, Preview, Development
4. **Redeploy** (Deployments > titik tiga > Redeploy) supaya env terbaca.

## Tes lokal (opsional)
```
npm i -g vercel
cp .env.example .env.local   # isi apikey
vercel dev
```
