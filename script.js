const API_BASE = "https://api.danzy.web.id/api";
const CECAN_APIS = [
    "https://app.siputzx.my.id/api/r/cecan/japan",
    "https://app.siputzx.my.id/api/r/cecan/indonesia",
    "https://app.siputzx.my.id/api/r/cecan/vietnam",
    "https://app.siputzx.my.id/api/r/cecan/china",
    "https://app.siputzx.my.id/api/r/cecan/korea"
];

// 1. Quotes Anime (5 Menit Sekali)
async function fetchQuote() {
    try {
        const resp = await fetch(`${API_BASE}/random/quotesanime`);
        const data = await resp.json();
        document.getElementById('quote-text').innerText = `"${data.result.quote}"`;
        document.getElementById('quote-char').innerText = `- ${data.result.character} (${data.result.anime})`;
    } catch (err) { console.error("Gagal ambil quote"); }
}

setInterval(fetchQuote, 300000); // 300.000 ms = 5 menit
fetchQuote();

// 2. Sistem Loading Layanan
function startLoading(callback) {
    const screen = document.getElementById('loading-screen');
    const img = document.getElementById('loading-cecan');
    const randomCecan = CECAN_APIS[Math.floor(Math.random() * CECAN_APIS.length)];
    
    img.src = randomCecan;
    screen.classList.replace('hidden', 'flex');

    setTimeout(() => {
        screen.classList.replace('flex', 'hidden');
        callback();
    }, 5000);
}

// 3. Navigasi Menu
function showSection(type) {
    startLoading(() => {
        document.getElementById('main-menu').classList.add('hidden');
        document.getElementById('content-area').classList.remove('hidden');
        renderMenu(type);
    });
}

function renderMenu(type) {
    const container = document.getElementById('dynamic-content');
    let html = "";

    if (type === 'download') {
        html = `
            <h2 class="text-2xl mb-4">Download Menu</h2>
            <input id="url-input" type="text" placeholder="Masukkan URL..." class="w-full p-2 text-black rounded mb-2">
            <div class="grid grid-cols-2 gap-2">
                <button onclick="executeAction('ytmp3')" class="bg-gray-700 p-2">YT MP3</button>
                <button onclick="executeAction('tiktok')" class="bg-gray-700 p-2">TikTok</button>
                <button onclick="executeAction('instagram')" class="bg-gray-700 p-2">Instagram</button>
            </div>`;
    } else if (type === 'vip') {
        const pin = prompt("Masukkan Sandi VIP Tuan:");
        // Catatan: Tuan harus mengurus integrasi Spreadsheet via Backend/Google Script untuk A1
        if (pin === "SandiDariA1") { 
            html = `<h2 class="text-2xl text-yellow-500">VIP Area</h2>
                    <p>Haram Gen, Edit, dsb tersedia di sini.</p>`;
        } else {
            alert("Sandi Salah, Tuan!");
            backToMain(); return;
        }
    }
    container.innerHTML = html;
}

function backToMain() {
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('content-area').classList.add('hidden');
}

async function executeAction(service) {
    const url = document.getElementById('url-input').value;
    if(!url) return alert("URL Kosong, Tuan!");
    
    startLoading(async () => {
        // Logika fetch API sesuai service
        window.open(`${API_BASE}/download/${service}?url=${url}`, '_blank');
    });
}

