/* ================= CONFIG =================
   Apikey TIDAK ada di sini. Frontend hanya memanggil /api/generate,
   dan apikey dibaca server dari Environment Variable (IQC_API_KEY). */
const API_ENDPOINT = '/api/generate';

/* ================= DOM ================= */
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnIcon = document.getElementById('btnIcon');
const previewPanel = document.getElementById('previewPanel');
const placeholder = document.getElementById('placeholder');
const loadingSpinner = document.getElementById('loadingSpinner');

submitBtn.addEventListener('click', generateIQC);

/* ================= GENERATE LOGIC ================= */
async function generateIQC() {
  const payload = {
    text: document.getElementById('text').value.trim(),
    time: document.getElementById('time').value.trim(),
    bubbleTime: document.getElementById('bubbleTime').value.trim(),
    network: document.getElementById('network').value,
    signal: document.getElementById('signal').value,
    battery: document.getElementById('battery').value,
    charging: document.getElementById('charging').value,
    reactions: document.getElementById('reactions').value.trim()
  };

  if (!payload.text) return alert('Teks tidak boleh kosong!');

  // UI Loading State
  submitBtn.disabled = true;
  btnText.textContent = 'Memproses...';
  btnIcon.style.display = 'none';
  placeholder.style.display = 'none';
  loadingSpinner.style.display = 'block';

  // Hapus gambar lama jika ada
  const oldImg = previewPanel.querySelector('img');
  if (oldImg) oldImg.remove();

  let imageUrl = null;

  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      imageUrl = extractImageUrl(data);
    }
  } catch (e) {
    console.error('Request gagal:', e);
  }

  // Tampilkan Hasil
  loadingSpinner.style.display = 'none';
  submitBtn.disabled = false;
  btnText.textContent = 'Generate Image';
  btnIcon.style.display = 'block';

  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'IQC Result';
    previewPanel.appendChild(img);
  } else {
    placeholder.style.display = 'block';
    alert('Gagal generate gambar. Server API mungkin sedang sibuk.');
  }
}

/* ================= HELPER: EXTRACT IMAGE URL ================= */
function extractImageUrl(data) {
  if (!data) return null;
  if (typeof data === 'string') return data;

  if (data.result && typeof data.result === 'string') return data.result;
  if (data.url && typeof data.url === 'string') return data.url;
  if (data.image && typeof data.image === 'string') return data.image;
  if (data.data && data.data.url) return data.data.url;
  if (data.data && data.data.image) return data.data.image;

  if (data.base64) {
    return data.base64.startsWith('data:image') ? data.base64 : `data:image/png;base64,${data.base64}`;
  }

  const strData = JSON.stringify(data);
  const urlMatch = strData.match(/https?:\/\/[^\s"']+/);
  if (urlMatch) return urlMatch[0];

  return null;
}
