# Advanced Features & Integrations

## 1. The "Omni-Pill" (AI Smart Command Bar)
AI sebagai asisten tak terlihat yang mengubah bahasa manusia menjadi perintah sistem secara instan, menggabungkan estetika Spotlight Search Apple dan tab pencarian Spotify.

### UI/UX Design
*   **Tampilan Visual:** Sebuah *input box* berbentuk kapsul penuh (`{rounded.pill}`) yang melayang (*floating*) di bagian bawah layar, tepat di atas menu navigasi utama. Latar belakang kapsul menggunakan warna abu-abu transparan `{colors.surface-chip-translucent}` dengan efek *backdrop-blur* (frosted glass).
*   **Prompt Placeholder:** Di dalam *box* terdapat tulisan abu-abu redup (`{colors.ink-muted-48}`): *"Ketik apa yang perlu diingat..."* dan sebuah ikon "*Sparkle*" kecil khas AI di sudut kanan.
*   **Interaksi "Silent Magic":** Saat mengetik *"Ingetin minum paracetamol 15 menit lagi"* lalu menekan *Enter*, kapsul tidak membalas dengan teks. Sebagai gantinya:
    1. Kapsul menyusut sedikit (`scale: 0.95`).
    2. Muncul animasi *loading* bundar yang halus selama 1 detik.
    3. *Box* menghilang dan digantikan oleh *Ghost Tile* kecil di layar berbunyi: **"Paracetamol dijadwalkan pukul 22:16"** dengan ikon centang biru (`{colors.primary}`).

### Arsitektur Teknis
*   **NLP Processing (Gemini 1.5 Flash):** Menggunakan versi "Flash" untuk respons di bawah 1 detik. Teks dikirim dengan *System Prompt* ketat yang memaksa Gemini membalas dalam format JSON terstruktur (berisi `nama_tugas`, `waktu_eksekusi` berformat ISO 8601, dan `kategori`).
*   **The Action Engine:** *Backend* Next.js mengambil JSON tersebut dan menyimpannya ke **Google Cloud SQL**. Bersamaan dengan itu, sistem membuat antrean di **Google Cloud Tasks** untuk menembakkan notifikasi via **Firebase (FCM)**.
*   **Client Update:** **Zustand** memperbarui UI secara *real-time* tanpa *refresh*, langsung memunculkan *timer* mundur.

### Skenario Ekstrem
Gemini mampu memecah kalimat kompleks tanpa *syntax* kaku dalam waktu kurang dari 2 detik:
*   *"ingetin aku minum antibiotik jam 8 malem dan besok pagi jam 8 selama 5 hari"*
*   *"ingetin cabut charger laptop 30 menit lagi"*
*   *"aku harus puasa darah mulai jam 10 malem ini sampai jam 6 pagi besok"*

---

## 2. Spotify-UX Meets Apple-UI Structure

Menggabungkan struktur tata letak (UX) Spotify yang adiktif dengan estetika visual (UI) Apple yang bersih dan elegan.

*   **The "Now Playing" Task Bar:** Saat memulai tugas fokus, sebuah *bar* (`{component.floating-sticky-bar}`) bermaterial *frosted-glass* menempel di atas menu navigasi bawah. Berisi nama tugas, indikator waktu berjalan, dan tombol *Pause* melingkar (`{component.button-icon-circular}`).
*   **The "Good Morning" 2x3 Grid:** Sapaan *hero* dengan `{typography.display-lg}` diikuti 6 kotak rutinitas pagi. Menggunakan latar `{colors.canvas-parchment}` dengan tipografi minimalis dan ikon sudut. Klik kotak untuk menandai selesai.
*   **"Routines" as Playlists:** Rutinitas (misal: "Night Wind-down") memiliki halamannya sendiri. Terdapat kotak *full-bleed* `{colors.surface-tile-1}` di atas dengan judul dan satu tombol *Play* raksasa biru bulat sempurna (`{rounded.full}`) untuk menjalankan seluruh tugas secara berurutan.
*   **Horizontal Carousels:** Daftar tugas tidak memanjang ke bawah, melainkan dikelompokkan dalam korsel horizontal menggunakan `{component.store-utility-card}` (radius 18px, border *hairline*, tanpa *shadow*).
*   **Satisfying Swipe Actions:** Usap tugas ke kanan untuk "Selesai" (mengungkap latar *Action Blue*), usap ke kiri untuk "Snooze" (mengungkap latar abu-abu *parchment*). Dilengkapi dengan *haptic feedback* yang halus.

---

## 3. Quiet Gamification & Retention

Elemen retensi yang dibangun berdasarkan kedamaian visual, bukan *clutter* animasi konfeti.

*   **The "Morning Briefing" & "Evening Unwind":** 
    *   *Pagi:* Layar putih murni (`{colors.canvas}`), teks pudar masuk perlahan menyapa pengguna dan merangkum jadwal hari itu.
    *   *Malam:* Layar berubah hitam pekat (`{colors.surface-black}`) dengan pesan penutupan psikologiques: *"Semua tugas selesai. Waktunya istirahat."*
*   **"Focus State" Unlocks:** Pengguna yang konsisten 100% selama 14 hari tidak mendapatkan lencana kekanak-kanakan, melainkan nilai estetika seperti tema eksklusif "Midnight Pearl" sebagai simbol status digital yang elegan.
*   **Seamless Widgets:** *Widget* berlayar utama yang 100% transparan (*backdrop-blur*). Hanya menampilkan pil biru `{component.button-primary}`. Pengguna dapat menandai tugas selesai langsung dari *Home Screen* dengan animasi klik halus (`scale: 0.95`).

---

## 4. Google Ecosystem Integrations

Menghubungkan layanan Google untuk meminimalkan friksi pengguna saat mendaftarkan pengingat.

*   **Google Assistant "Seamless Audio Capture":** Mendukung *App Actions*. Pengguna bisa mengucapkan *"Hey Google, set reminder for antibiotic at 8 PM in Repeat"*. Tugas masuk ke aplikasi dengan animasi memudar dan *haptic click* konfirmasi.
*   **Google Calendar "Ghost Timelines":** Menyatukan jadwal rapat ke dalam aplikasi dalam bentuk *Ghost Tiles* (latar `{colors.surface-pearl}`, teks pudar `{colors.ink-muted-48}`). Berfungsi sebagai penunjuk waktu statis yang tidak bisa dicentang.
