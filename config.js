/* ─── AISinja Config ─────────────────────────────────────────
   Edit file ini untuk setup VIP password.

   PILIH SALAH SATU metode:

   METODE 1 — Hardcode password langsung (simple):
     Ubah nilai VIP_PASSWORD di bawah.

   METODE 2 — Ambil dari Google Spreadsheet (lebih aman):
     1. Buka Google Spreadsheet kamu
     2. Masukkan password di cell A1
     3. File > Share > "Anyone with the link can view"
     4. Salin ID spreadsheet dari URL:
        https://docs.google.com/spreadsheets/d/[INI_ID_NYA]/edit
     5. Paste ID di VIP_SHEET_ID bawah
     6. Kosongkan VIP_PASSWORD jika pakai metode ini
──────────────────────────────────────────────────────────── */

window.VIP_PASSWORD  = 'Vipkuat'; // Metode 1
window.VIP_SHEET_ID  = '';                       // Metode 2 (isi ID spreadsheet, kosongkan jika pakai metode 1)
