/* ─── AISinja app.js ─────────────────────── */

const API = {
  quotesanime: 'https://api.danzy.web.id/api/random/quotesanime',
  ytmp3:       'https://api.danzy.web.id/api/download/ytmp3',
  ytmp4:       'https://api.danzy.web.id/api/download/ytmp4',
  facebook:    'https://api.danzy.web.id/api/download/facebook',
  instagram:   'https://api.danzy.web.id/api/download/instagram',
  tiktok:      'https://api.danzy.web.id/api/download/tiktok',
  spotify:     'https://api.danzy.web.id/api/download/spotify',
  removebg:    'https://api.danzy.web.id/api/maker/removebg',
  upscale:     'https://api.danzy.web.id/api/tools/upscale',
  timpa:       'https://api.danzy.web.id/api/maker/timpa',
  haramgen:    'https://api.danzy.web.id/api/ai/nsfwgen',
  haramedit:   'https://api.danzy.web.id/api/ai/editimg',
  harameditv2: 'https://api.danzy.web.id/api/maker/deepnude',
};

const GIRL_APIS = [
  'https://app.siputzx.my.id/api/r/cecan/japan',
  'https://app.siputzx.my.id/api/r/cecan/indonesia',
  'https://app.siputzx.my.id/api/r/cecan/vietnam',
  'https://app.siputzx.my.id/api/r/cecan/china',
  'https://app.siputzx.my.id/api/r/cecan/korea',
];

const LOADING_MSGS = [
  'Sabar proses dulu, Sambil nunggu liat cewek cantik ye kan 😏',
  'Diproses dulu bang, jangan kemana-mana dulu ye 🙏',
  'Tunggu sebentar, sistemnya lagi kerja keras nih 💪',
  'Proses lagi jalan, nikmatin dulu pemandangannya 👀',
  'Sabar sabar, yang bagus butuh waktu 😌',
  'Loading... tapi view-nya gratis kan? 😁',
];

/* ─── PAGE NAVIGATION ─────────────────────── */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + name);
  if (target) target.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openMusic() {
  window.open('https://kawihfy.vercel.app', '_blank');
}

function toggleMobileMenu() {
  const m = document.getElementById('mobile-menu');
  m.classList.toggle('hidden');
}

/* ─── TAB SWITCHER ─────────────────────── */
function switchTab(prefix, name, btn) {
  // Hide all panels
  document.querySelectorAll(`[id^="${prefix}-"]`).forEach(p => {
    p.classList.remove('active-panel');
  });
  // Deactivate all tab buttons in same parent
  btn.closest('.tool-tabs').querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('active');
  });
  // Activate selected
  const panel = document.getElementById(`${prefix}-${name}`);
  if (panel) panel.classList.add('active-panel');
  btn.classList.add('active');
}

/* ─── LOADING SCREEN ─────────────────────── */
let loadingTimer = null;

function showLoading(callback) {
  const screen = document.getElementById('loading-screen');
  const progress = document.getElementById('loading-progress');
  const timerEl = document.getElementById('loading-timer');
  const msgEl = document.getElementById('loading-msg');
  const girlImg = document.getElementById('loading-girl');

  // Pick random message
  msgEl.textContent = LOADING_MSGS[Math.floor(Math.random() * LOADING_MSGS.length)];

  // Pick random girl API
  const apiUrl = GIRL_APIS[Math.floor(Math.random() * GIRL_APIS.length)];
  girlImg.src = apiUrl;
  girlImg.onerror = () => {
    girlImg.src = 'https://picsum.photos/seed/' + Math.floor(Math.random()*999) + '/400/533';
  };

  screen.classList.remove('hidden');
  progress.style.width = '0%';

  const duration = 5000;
  const start = Date.now();

  clearInterval(loadingTimer);
  loadingTimer = setInterval(() => {
    const elapsed = Date.now() - start;
    const pct = Math.min((elapsed / duration) * 100, 100);
    const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000));
    progress.style.width = pct + '%';
    timerEl.textContent = remaining + 's';
    if (elapsed >= duration) {
      clearInterval(loadingTimer);
      screen.classList.add('hidden');
      if (typeof callback === 'function') callback();
    }
  }, 100);
}

function hideLoading() {
  clearInterval(loadingTimer);
  document.getElementById('loading-screen').classList.add('hidden');
}

/* ─── RESULT MODAL ─────────────────────── */
function showModal(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('result-modal').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('result-modal').classList.add('hidden');
}
// Close on backdrop click
document.getElementById('result-modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

/* ─── DOWNLOAD HANDLER ─────────────────────── */
function runDownload(type) {
  const urlInput = document.getElementById(type + '-url');
  const url = urlInput ? urlInput.value.trim() : '';
  if (!url) {
    alert('Masukkan URL terlebih dahulu!');
    return;
  }
  showLoading(async () => {
    try {
      const res = await fetch(`${API[type]}?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      renderDownloadResult(type, data);
    } catch (e) {
      showModal(`<h3>❌ Error</h3><p class="result-err">Gagal menghubungi server. Periksa koneksi atau URL kamu.<br><small>${e.message}</small></p>`);
    }
  });
}

function renderDownloadResult(type, data) {
  // Try to handle common API response shapes
  let html = `<h3>✅ ${type.toUpperCase()} — Hasil Download</h3>`;

  if (!data || data.status === false || data.error) {
    html += `<p class="result-err">⚠ ${data?.message || data?.error || 'Tidak ada hasil.'}</p>`;
    showModal(html); return;
  }

  // YT MP3
  if (type === 'ytmp3') {
    const link = data?.data?.download || data?.result?.link || data?.link || data?.url || data?.download;
    const title = data?.data?.title || data?.result?.title || data?.title || 'Audio';
    html += `<p><b>${title}</b></p>`;
    if (link) html += `<a href="${link}" target="_blank" download>⬇ Download MP3</a>`;
    else html += `<p class="result-err">Link tidak ditemukan dalam respons API.</p>`;
  }
  // YT MP4
  else if (type === 'ytmp4') {
    const link = data?.data?.download || data?.result?.link || data?.link || data?.url || data?.download;
    const title = data?.data?.title || data?.result?.title || data?.title || 'Video';
    html += `<p><b>${title}</b></p>`;
    if (link) html += `<a href="${link}" target="_blank" download>⬇ Download MP4</a>`;
    else html += `<p class="result-err">Link tidak ditemukan dalam respons API.</p>`;
  }
  // Instagram
  else if (type === 'instagram') {
    const items = data?.data?.medias || data?.result || data?.media || [];
    if (Array.isArray(items) && items.length > 0) {
      items.forEach((item, i) => {
        const link = item?.url || item?.link || item?.download;
        const isVid = item?.type === 'video' || (link && link.includes('.mp4'));
        if (link) html += `<a href="${link}" target="_blank" download>${isVid ? '🎬' : '🖼'} Media ${i+1}</a>`;
      });
    } else {
      const link = data?.data?.url || data?.url || data?.link;
      if (link) html += `<a href="${link}" target="_blank" download>⬇ Download</a>`;
      else html += `<p class="result-err">Tidak ada media ditemukan.</p>`;
    }
  }
  // Generic fallback
  else {
    const link = data?.data?.download || data?.result?.url || data?.url || data?.link || data?.download;
    const title = data?.data?.title || data?.title || type.toUpperCase();
    html += `<p><b>${title}</b></p>`;
    if (link) html += `<a href="${link}" target="_blank" download>⬇ Download</a>`;
    else {
      // Show raw response for debugging
      html += `<p class="result-err">Respons API tidak terbaca otomatis. Respons mentah:</p>`;
      html += `<pre style="font-size:0.65rem;overflow:auto;max-height:200px;background:rgba(0,0,0,0.3);padding:10px;border-radius:8px;margin-top:8px;">${JSON.stringify(data, null, 2)}</pre>`;
    }
  }

  showModal(html);
}

/* ─── EDITING HANDLER ─────────────────────── */
function runEdit(type) {
  if (type === 'removebg') {
    const url = document.getElementById('removebg-url').value.trim();
    const file = document.getElementById('removebg-file').files[0];
    if (!url && !file) { alert('Masukkan URL atau upload gambar!'); return; }
    showLoading(async () => {
      try {
        let res;
        if (file) {
          const form = new FormData();
          form.append('image', file);
          res = await fetch(API.removebg, { method: 'POST', body: form });
        } else {
          res = await fetch(`${API.removebg}?url=${encodeURIComponent(url)}`);
        }
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('image')) {
          const blob = await res.blob();
          const objUrl = URL.createObjectURL(blob);
          showModal(`<h3>✅ Background Dihapus!</h3><img src="${objUrl}" class="result-img" /><a href="${objUrl}" download="no-bg.png">⬇ Download Hasil</a>`);
        } else {
          const data = await res.json();
          const imgUrl = data?.result?.url || data?.data?.url || data?.url || data?.image;
          if (imgUrl) showModal(`<h3>✅ Background Dihapus!</h3><img src="${imgUrl}" class="result-img" /><a href="${imgUrl}" target="_blank" download>⬇ Download Hasil</a>`);
          else showModal(`<h3>❌ Error</h3><p class="result-err">${JSON.stringify(data)}</p>`);
        }
      } catch (e) {
        showModal(`<h3>❌ Error</h3><p class="result-err">${e.message}</p>`);
      }
    });
  }

  else if (type === 'upscale') {
    const url = document.getElementById('upscale-url').value.trim();
    const file = document.getElementById('upscale-file').files[0];
    if (!url && !file) { alert('Masukkan URL atau upload gambar!'); return; }
    showLoading(async () => {
      try {
        let res;
        if (file) {
          const form = new FormData();
          form.append('image', file);
          res = await fetch(API.upscale, { method: 'POST', body: form });
        } else {
          res = await fetch(`${API.upscale}?url=${encodeURIComponent(url)}`);
        }
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('image')) {
          const blob = await res.blob();
          const objUrl = URL.createObjectURL(blob);
          showModal(`<h3>✅ Gambar Diupscale!</h3><img src="${objUrl}" class="result-img" /><a href="${objUrl}" download="upscaled.png">⬇ Download Hasil</a>`);
        } else {
          const data = await res.json();
          const imgUrl = data?.result?.url || data?.data?.url || data?.url || data?.image;
          if (imgUrl) showModal(`<h3>✅ Gambar Diupscale!</h3><img src="${imgUrl}" class="result-img" /><a href="${imgUrl}" target="_blank" download>⬇ Download Hasil</a>`);
          else showModal(`<h3>❌ Error</h3><p class="result-err">${JSON.stringify(data)}</p>`);
        }
      } catch(e) {
        showModal(`<h3>❌ Error</h3><p class="result-err">${e.message}</p>`);
      }
    });
  }

  else if (type === 'timpa') {
    const url = document.getElementById('timpa-url').value.trim();
    const file = document.getElementById('timpa-file').files[0];
    const text = document.getElementById('timpa-text').value.trim();
    if ((!url && !file) || !text) { alert('Masukkan gambar dan teks!'); return; }
    showLoading(async () => {
      try {
        let res;
        if (file) {
          const form = new FormData();
          form.append('image', file);
          form.append('text', text);
          res = await fetch(API.timpa, { method: 'POST', body: form });
        } else {
          res = await fetch(`${API.timpa}?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
        }
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('image')) {
          const blob = await res.blob();
          const objUrl = URL.createObjectURL(blob);
          showModal(`<h3>✅ Teks Ditambahkan!</h3><img src="${objUrl}" class="result-img" /><a href="${objUrl}" download="timpa.png">⬇ Download Hasil</a>`);
        } else {
          const data = await res.json();
          const imgUrl = data?.result?.url || data?.data?.url || data?.url || data?.image;
          if (imgUrl) showModal(`<h3>✅ Teks Ditambahkan!</h3><img src="${imgUrl}" class="result-img" /><a href="${imgUrl}" target="_blank" download>⬇ Download Hasil</a>`);
          else showModal(`<h3>❌ Error</h3><p class="result-err">${JSON.stringify(data)}</p>`);
        }
      } catch(e) {
        showModal(`<h3>❌ Error</h3><p class="result-err">${e.message}</p>`);
      }
    });
  }
}

/* ─── CONVERT HANDLER (client-side) ─────────────────────── */
function runConvert(type) {
  if (type === 'pngtojpeg') {
    const file = document.getElementById('pngtojpeg-file').files[0];
    if (!file) { alert('Upload file PNG terlebih dahulu!'); return; }
    showLoading(() => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = e => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width; canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            showModal(`<h3>✅ Konversi PNG → JPEG</h3><img src="${url}" class="result-img" /><a href="${url}" download="converted.jpg">⬇ Download JPEG</a>`);
          }, 'image/jpeg', 0.92);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  else if (type === 'jpegtopng') {
    const file = document.getElementById('jpegtopng-file').files[0];
    if (!file) { alert('Upload file JPEG terlebih dahulu!'); return; }
    showLoading(() => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = e => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width; canvas.height = img.height;
          canvas.getContext('2d').drawImage(img, 0, 0);
          canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            showModal(`<h3>✅ Konversi JPEG → PNG</h3><img src="${url}" class="result-img" /><a href="${url}" download="converted.png">⬇ Download PNG</a>`);
          }, 'image/png');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  else if (type === 'pdftoimg') {
    const file = document.getElementById('pdftoimg-file').files[0];
    if (!file) { alert('Upload file PDF terlebih dahulu!'); return; }
    showLoading(() => {
      // PDF.js CDN
      if (!window.pdfjsLib) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          convertPdfToImg(file);
        };
        document.head.appendChild(script);
      } else {
        convertPdfToImg(file);
      }
    });
  }

  else if (type === 'imgtopdf') {
    const files = document.getElementById('imgtopdf-file').files;
    if (!files.length) { alert('Upload gambar terlebih dahulu!'); return; }
    showLoading(() => {
      // jsPDF CDN
      if (!window.jspdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => convertImgToPdf(files);
        document.head.appendChild(script);
      } else {
        convertImgToPdf(files);
      }
    });
  }
}

async function convertPdfToImg(file) {
  try {
    const arrayBuf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuf }).promise;
    let html = `<h3>✅ PDF → Gambar (${pdf.numPages} halaman)</h3>`;
    const links = [];
    for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
      const page = await pdf.getPage(i);
      const vp = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      canvas.width = vp.width; canvas.height = vp.height;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
      const dataUrl = canvas.toDataURL('image/png');
      links.push({ dataUrl, idx: i });
    }
    links.forEach(({ dataUrl, idx }) => {
      html += `<div style="margin-bottom:12px;"><img src="${dataUrl}" class="result-img" /><a href="${dataUrl}" download="page-${idx}.png">⬇ Download Halaman ${idx}</a></div>`;
    });
    if (pdf.numPages > 10) html += `<p style="color:var(--text-muted);font-size:0.7rem;margin-top:8px;">*Hanya menampilkan 10 halaman pertama</p>`;
    showModal(html);
  } catch (e) {
    showModal(`<h3>❌ Error</h3><p class="result-err">${e.message}</p>`);
  }
}

async function convertImgToPdf(files) {
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let firstPage = true;
    for (const file of files) {
      const dataUrl = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = e => res(e.target.result);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const img = new Image();
      await new Promise(res => { img.onload = res; img.src = dataUrl; });
      const pw = doc.internal.pageSize.getWidth();
      const ph = doc.internal.pageSize.getHeight();
      const ratio = Math.min(pw / img.width, ph / img.height);
      const w = img.width * ratio;
      const h = img.height * ratio;
      const x = (pw - w) / 2; const y = (ph - h) / 2;
      if (!firstPage) doc.addPage();
      doc.addImage(dataUrl, 'JPEG', x, y, w, h);
      firstPage = false;
    }
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    showModal(`<h3>✅ Gambar → PDF</h3><p style="margin-bottom:12px;color:var(--text-muted);font-size:0.75rem;">${files.length} gambar berhasil digabung</p><a href="${url}" download="result.pdf">⬇ Download PDF</a>`);
  } catch(e) {
    showModal(`<h3>❌ Error</h3><p class="result-err">${e.message}</p>`);
  }
}

/* ─── VIP HANDLER ─────────────────────── */
let vipUnlocked = false;

async function checkVIP() {
  const pw = document.getElementById('vip-password').value.trim();
  if (!pw) { alert('Masukkan password VIP!'); return; }

  // Fetch password from Google Sheets (public CSV)
  // User harus set SPREADSHEET_ID di config.js atau hardcode
  const sheetId = window.VIP_SHEET_ID || '';
  if (!sheetId) {
    // Fallback: check hardcoded (user set via config)
    if (window.VIP_PASSWORD && pw === window.VIP_PASSWORD) {
      unlockVIP();
    } else {
      alert('Password salah! (Tip: set VIP_PASSWORD di config.js atau VIP_SHEET_ID untuk Google Sheets)');
    }
    return;
  }
  try {
    const res = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&range=A1`);
    const csv = await res.text();
    const storedPw = csv.replace(/["\n\r]/g, '').trim();
    if (pw === storedPw) unlockVIP();
    else alert('Password salah!');
  } catch(e) {
    alert('Gagal verifikasi. Cek VIP_SHEET_ID di config.js');
  }
}

function unlockVIP() {
  vipUnlocked = true;
  document.getElementById('vip-lock').style.display = 'none';
  document.getElementById('vip-content').classList.remove('hidden');
}

function runVIP(type) {
  if (!vipUnlocked) { alert('Akses ditolak!'); return; }
  if (type === 'haramgen') {
    const prompt = document.getElementById('haramgen-prompt').value.trim();
    if (!prompt) { alert('Masukkan prompt!'); return; }
    showLoading(async () => {
      try {
        const res = await fetch(`${API.haramgen}?prompt=${encodeURIComponent(prompt)}`);
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('image')) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          showModal(`<h3>✅ Generate Selesai</h3><img src="${url}" class="result-img" /><a href="${url}" download="gen.png">⬇ Download</a>`);
        } else {
          const data = await res.json();
          const imgUrl = data?.url || data?.result?.url || data?.data?.url || data?.image;
          if (imgUrl) showModal(`<h3>✅ Generate Selesai</h3><img src="${imgUrl}" class="result-img" /><a href="${imgUrl}" target="_blank" download>⬇ Download</a>`);
          else showModal(`<h3>❌ Error</h3><p class="result-err">${JSON.stringify(data)}</p>`);
        }
      } catch(e) {
        showModal(`<h3>❌ Error</h3><p class="result-err">${e.message}</p>`);
      }
    });
  }

  else if (type === 'haramedit') {
    const url = document.getElementById('haramedit-url').value.trim();
    if (!url) { alert('Masukkan URL gambar!'); return; }
    showLoading(async () => {
      try {
        const res = await fetch(`${API.haramedit}?url=${encodeURIComponent(url)}`);
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('image')) {
          const blob = await res.blob();
          const objUrl = URL.createObjectURL(blob);
          showModal(`<h3>✅ Edit Selesai</h3><img src="${objUrl}" class="result-img" /><a href="${objUrl}" download="edited.png">⬇ Download</a>`);
        } else {
          const data = await res.json();
          const imgUrl = data?.url || data?.result?.url || data?.data?.url;
          if (imgUrl) showModal(`<h3>✅ Edit Selesai</h3><img src="${imgUrl}" class="result-img" /><a href="${imgUrl}" target="_blank" download>⬇ Download</a>`);
          else showModal(`<h3>❌ Error</h3><p class="result-err">${JSON.stringify(data)}</p>`);
        }
      } catch(e) {
        showModal(`<h3>❌ Error</h3><p class="result-err">${e.message}</p>`);
      }
    });
  }

  else if (type === 'harameditv2') {
    const url = document.getElementById('harameditv2-url').value.trim();
    if (!url) { alert('Masukkan URL gambar!'); return; }
    showLoading(async () => {
      try {
        const res = await fetch(`${API.harameditv2}?url=${encodeURIComponent(url)}`);
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('image')) {
          const blob = await res.blob();
          const objUrl = URL.createObjectURL(blob);
          showModal(`<h3>✅ Edit v2 Selesai</h3><img src="${objUrl}" class="result-img" /><a href="${objUrl}" download="editedv2.png">⬇ Download</a>`);
        } else {
          const data = await res.json();
          const imgUrl = data?.url || data?.result?.url || data?.data?.url;
          if (imgUrl) showModal(`<h3>✅ Edit v2 Selesai</h3><img src="${imgUrl}" class="result-img" /><a href="${imgUrl}" target="_blank" download>⬇ Download</a>`);
          else showModal(`<h3>❌ Error</h3><p class="result-err">${JSON.stringify(data)}</p>`);
        }
      } catch(e) {
        showModal(`<h3>❌ Error</h3><p class="result-err">${e.message}</p>`);
      }
    });
  }
}

/* ─── ANIME QUOTE ─────────────────────── */
let quoteInterval = null;
const QUOTE_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
let quoteNextAt = Date.now() + QUOTE_INTERVAL_MS;

async function fetchQuote() {
  const textEl = document.getElementById('quote-text');
  const charEl = document.getElementById('quote-char');
  const imgEl  = document.getElementById('quote-img');
  textEl.textContent = 'Memuat quote…';
  charEl.textContent = '—';
  try {
    const res = await fetch(API.quotesanime);
    const data = await res.json();
    // Common response shapes
    const quote  = data?.quote  || data?.text    || data?.data?.quote || data?.result?.quote || '...';
    const char   = data?.character || data?.name || data?.data?.character || data?.result?.character || 'Unknown';
    const anime  = data?.anime  || data?.title   || data?.data?.anime  || '';
    const img    = data?.image  || data?.img     || data?.data?.image  || data?.result?.image || '';
    textEl.textContent = `"${quote}"`;
    charEl.textContent = `— ${char}${anime ? ' · ' + anime : ''}`;
    if (img) { imgEl.src = img; imgEl.style.display = 'block'; }
    else imgEl.style.display = 'none';
  } catch(e) {
    textEl.textContent = '"Quotes gagal dimuat, tapi semangat terus!"';
    charEl.textContent = '— AISinja';
    imgEl.style.display = 'none';
  }
  quoteNextAt = Date.now() + QUOTE_INTERVAL_MS;
}

function startQuoteCountdown() {
  const cdEl = document.getElementById('quote-countdown');
  setInterval(() => {
    const remaining = Math.max(0, quoteNextAt - Date.now());
    const m = Math.floor(remaining / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    cdEl.textContent = `${m}:${s.toString().padStart(2,'0')}`;
    if (remaining === 0) fetchQuote();
  }, 1000);
}

/* ─── INIT ─────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  fetchQuote();
  startQuoteCountdown();
  setInterval(fetchQuote, QUOTE_INTERVAL_MS);
});
