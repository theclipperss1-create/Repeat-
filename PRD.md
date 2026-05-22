# Product Requirements Document (PRD)

## 1. Overview
**Nama Aplikasi:** Repeat
**Platform:** Web Application (Mobile-First, Responsive Desktop)
**Tujuan:** Aplikasi pengingat serbaguna (obat, jadwal makan, tugas akademik/profesional) yang dirancang dengan estetika "Apple-tight" yang mengutamakan fokus, ketenangan, dan ketiadaan *visual clutter*.

## 2. Core Features
1. **Smart Dashboard (Today's View):**
   - Menampilkan pengingat hari ini dalam bentuk *Card Grid* minimalis.
   - Kategorisasi ikonik: Obat (Pill icon), Makan (Fork/Knife icon), Tugas (Checkmark icon).
2. **Quick Add (Configurator-style):**
   - Input tugas baru yang menyerupai antarmuka "Apple Store Buy Page".
   - Menggunakan *configurator-option-chip* untuk memilih kategori.
3. **Immersive Focus Mode:**
   - Saat tugas sedang dikerjakan, layar beralih ke mode *full-bleed dark tile* untuk mengurangi distraksi.
4. **Push Notifications:**
   - Pengingat presisi tinggi berbasis waktu.

## 3. User Flow
- **Landing/Home:** Tampilan *Pure White* (`#ffffff`) dengan *Global Nav* di atas. Menampilkan *hero headline* sapaan dengan tipografi besar dan rapat.
- **Add Reminder:** Mengklik tombol *Action Blue* (`#0066cc`) berbentuk *pill*. Muncul modal atau halaman transisi dengan gaya *frosted-glass*.
- **Completion:** Menekan tombol selesai akan memicu *micro-interaction* (scale 0.95) tanpa animasi berlebihan yang mengganggu.
