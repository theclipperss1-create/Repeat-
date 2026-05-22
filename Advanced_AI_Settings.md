# Advanced Settings & AI Integrations

## 1. Advanced Settings

Bagian ini dirancang menggunakan komponen navigasi standar gaya iOS. Desain latar belakang menggunakan `{colors.surface-black}` dengan teks `{colors.canvas-parchment}` agar fitur-fitur kompleks (power-user) terasa rapi dan terisolasi dari antarmuka utama.

### A. Omni-Pill (AI Behavior)
Mengontrol kedalaman otomatisasi AI Gemini di dalam aplikasi.
* **Auto-Categorization:** Toggle switch. Mengizinkan AI menebak dan secara otomatis memasang ikon kategori (Obat, Makan, Tugas) berdasarkan analisis teks atau suara tanpa input manual.
* **Predictive Suggestions:** Toggle switch. Mengaktifkan chip saran di layar utama berdasarkan riwayat rutinitas pengguna (misal: menebak jadwal minum kopi sore).

### B. Ecosystem Toggles
* **Google Calendar Ghost Timelines:** Toggle untuk menampilkan jadwal kalender harian di sela-sela daftar tugas aplikasi.
* **Biometric Triggers:** Toggle untuk mengizinkan aplikasi merespons data aktivitas dari Google Fit (misal: menyarankan minum setelah olahraga).

---

## 2. Gemini Smart Insights (AI Recommendations)

Fitur rekomendasi proaktif yang dioperasikan oleh Gemini. Berfungsi menganalisis pola penyelesaian tugas pengguna di latar belakang dan memberikan saran optimasi rutinitas. 

### A. Skenario Analisis Dasar
* **Produktivitas:** "Kamu sering menunda tugas membaca jurnal di malam hari. Pindahkan ke jam 08:00 pagi bersama jadwal ngopi?"
* **Kesehatan:** "Kamu rutin minum suplemen zat besi. Mengingatkan minum jus jeruk setelahnya akan membantu penyerapan. Tambahkan ke rutinitas?"
* **Fokus:** "Fokusmu sering terganggu di jam 14:00. Tambahkan jadwal 'Jalan Kaki 10 Menit' sebelum jam tersebut?"

### B. Eksekusi UI/UX (Insight Card)
Rekomendasi tidak menggunakan pop-up interuptif atau antarmuka obrolan (chat). Wawasan disajikan sebagai blok editorial yang tenang.
* **Penempatan:** Muncul di bagian bawah halaman "Today's View", tepat di atas area footer, terpisah secara visual dari daftar tugas harian.
* **Bentuk Visual:** Menggunakan `{component.product-tile-parchment}` dengan padding internal ekstra luas (`{spacing.section}`).
* **Tipografi:** * Judul (Label): `{typography.caption-strong}` berwarna `{colors.primary}` (Action Blue) bertuliskan: "Insight for you".
    * Teks Wawasan: Menggunakan `{typography.lead}` (28px / Weight 400) agar terasa seperti kutipan majalah berkelas.
* **Interaksi:** Memiliki satu tombol kapsul utama `{component.button-primary}` bertuliskan "Add to Routine". Saat diklik (dengan animasi `scale: 0.95`), kartu memudar (fade out), dan rutinitas baru langsung tersimpan di database secara mulus.
