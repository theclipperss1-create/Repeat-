# The Productivity ID & Aesthetic Receipt

## 1. Konsep & Interaksi Utama (The Wallet Experience)
Mengambil inspirasi dari antarmuka **Apple Wallet** saat membuka kartu kredit digital, dipadukan dengan kemudahan *swipe* Spotify.

* **Trigger:** Pengguna men-tap ikon profil di sudut layar.
* **Animasi Masuk (Framer Motion):**
    * Layar utama di belakang akan menyusut sangat sedikit (`scale: 0.98`) dan meredup.
    * Sebuah modal berbentuk kartu vertikal besar (rasio 9:16) meluncur mulus dari bawah layar (`y: "100%" -> y: 0`), berhenti di tengah dengan sisa ruang di tepi agar *background* utama yang terkena efek *frosted-glass* (`backdrop-filter: blur(20px)`) tetap terlihat.
* **Animasi Keluar:** Cukup *swipe* kartu ke bawah untuk menutupnya. Gesekan ini terasa natural dan minim hambatan.

## 2. Anatomi Kartu "Productivity ID" (UI Design)
Kartu ini tidak berisi formulir pengaturan, melainkan murni sebuah lencana kehormatan digital.

* **Surface:** Latar belakang kartu menggunakan `{colors.surface-tile-1}` (Near-Black #272729) dengan *border radius* melengkung elegan `{rounded.xl}` (sekitar 24px) tanpa bayangan luar (*flat*).

### A. Bagian Identitas (Photo & Name)
* **Profile Picture:**
    * Tepat di tengah bagian atas kartu terdapat foto profil pengguna.
    * Berbentuk bulat sempurna (`{rounded.full}`) berdiameter 96px.
    * Memiliki border *hairline* 1px tipis berwarna Pure White.
    * **Interaksi:** Jika pengguna belum menambahkan foto, area ini akan menampilkan ikon profil standar. Mengetuk area ini akan memicu *native image picker* perangkat untuk mengunggah foto.
* **Hero Typography (Name & Persona Title):**
    * Di bawah foto profil, namamu tertulis rata tengah dalam font super besar `{typography.hero-display}` (56px) berwarna `{colors.body-on-dark}` (Pure White).
    * Di bawah nama, terdapat **Persona Title** harian (misal: "Rhythm Master" atau "Flow Seeker") dalam font `{typography.lead}` (28px) berwarna `{colors.primary}` (Action Blue). Gelar ini berubah berdasarkan pencapaian tertinggi pengguna.

### B. Bagian Motivasi (Daily Typography Word)
* **Konsep:** Sebaris kalimat motivasi terkurasi yang diperbarui secara otomatis setiap hari (setiap jam 00:00 waktu lokal).
* **Desain & Tipografi:**
    * Menggunakan `{typography.lead-airy}` (24px / Weight 300 yang tipis dan elegan). Rata tengah.
    * Teks menggunakan warna abu-abu redup `{colors.body-muted}` (#cccccc).
    * Ditempatkan di bagian bawah identitas nama, dipisahkan oleh *whitespace* yang luas agar kutipan ini memiliki dampak visual yang kuat saat dibaca.

### C. Bagian Pencapaian (Badges & Stats)
* **Productivity Personas / Badges (Levels):**
    * Di bawah kutipan motivasi, terdapat barisan horizontal berisi hingga 3 lencana pencapaian paling berkesan milik pengguna.
    * **Desain Lencana:** Bukan ikon emas yang ramai, melainkan simbol geometris minimalis (garis melingkar atau persegi) yang dibuat menggunakan material *frosted glass* dan aksen `{colors.primary}`. Tidak ada bayangan.
    * **Contoh Persona:** Initiate (Baru bergabung), Ritualist (Streak 7 hari), Deep Worker (Fokus mode penuh), Time Artisan (Konsistensi 30 hari).
* **The Stats (Tanpa Grafik):**
    * Di bawah lencana, tipografi angka yang kuat disusun secara horizontal:
    * **Focus Rate:** Angka "92%" dalam font 40px, label "Konsistensi Minggu Ini".
    * **Streak:** Angka "14", label "Hari Berturut-turut".

### D. Bagian Aksi
* **Call-to-Action (Tombol):** Di bagian paling bawah kartu, terdapat satu tombol kapsul lebar (`{component.button-primary}`) bertuliskan **"Export Aesthetic Receipt"** dengan ikon *share* kecil.

## 3. Eksekusi "Aesthetic Receipt" (Viral Engine)
Ini adalah fitur yang membuat pengguna ingin memamerkan produktivitas mereka ke Instagram Story, TikTok, or X (Twitter).

* **Cara Kerja Sistem:** Saat pengguna menekan tombol "Export", aplikasi merender ulang (*generate*) sebuah gambar baru beresolusi tinggi di latar belakang.
* **Desain Setruk (The Receipt Vibe):**
    * **Latar Belakang:** Menggunakan tekstur `{colors.canvas-parchment}` (warna kertas *off-white* Apple) agar benar-benar terlihat seperti setruk fisik premium.
    * **Profil:** Menyertakan foto profil pengguna (jika ada) dan nama pengguna.
    * **Tipografi:** Daftar tugas di-render menggunakan *font monospace* (seperti *SF Mono* atau *Courier*) agar meniru ketikan mesin kasir/mesin tik.
    * **Scopes:** Menyertakan gelar *Persona Title* saat ini (misal: "Alex - Flow Seeker"). QR Code dekoratif di bawah mengarah ke tautan aplikasi.

## 4. Keuntungan Psikologis
Fitur ini menggantikan fungsi *leaderboard* yang beracun dengan perayaan pencapaian personal yang estetis. Dengan menyertakan foto profil, lencana berkelas, dan kata-kata motivasi harian, pengguna mendapatkan rasa pencapaian yang terus diperbarui setiap hari, membuat mereka ingin terus membuka aplikasi.

## 5. Curated Quotes List (Koleksi Kata Semangat Harian)
Backend akan memilih satu secara acak setiap hari dari JSON terstruktur untuk ditampilkan pada layar Productivity ID:

* Fokus menuntut keberanian untuk menolak.
* Lakukan lebih sedikit, lakukan lebih baik.
* Mulai di mana pun kamu berada sekarang.
* Hari ini adalah kanvas kosong.
* Satu tugas pada satu waktu.
* Ketenangan adalah fondasi produktivitas.
* Konsistensi mengalahkan intensitas.
* Sederhanakan ruangmu, jernihkan pikiranmu.
* Jangan hanya sibuk, jadilah produktif.
* Kualitas selalu mengalahkan kuantitas.
* Kendalikan harimu, atau harimu yang mengendalikanmu.
* Selesai jauh lebih baik daripada sempurna.
* Waktu adalah aset yang tidak bisa diulang.
* Ambil jeda, bukan berhenti.
* Ruang kosong memberi ruang untuk berpikir.
* Fokus pada apa yang ada di depanmu.
* Disiplin adalah jembatan menuju pencapaian.
* Ucapkan tidak pada hal yang tidak esensial.
* Perhatian penuh pada detik ini.
* Setiap langkah kecil adalah kemajuan.
