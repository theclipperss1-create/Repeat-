# Architecture & Tech Stack (GCP)

## 1. Overview
Dokumen ini menguraikan arsitektur teknis dan infrastruktur untuk aplikasi **Repeat**. Sistem dibangun menggunakan arsitektur *Fullstack Serverless* dengan Next.js, mengutamakan kecepatan interaksi antarmuka (UI) dan keandalan tingkat tinggi untuk presisi waktu pengingat (notifikasi).

---

## 2. Frontend Layer (The "Apple-Tight" UI)

| Teknologi | Peran | Alasan Penggunaan |
|---|---|---|
| **Next.js (App Router)** | Framework Utama | Mendukung *Server-Side Rendering* (SSR) untuk inisialisasi cepat dan *routing* instan. Mudah diubah menjadi Progressive Web App (PWA). |
| **Tailwind CSS** | Styling | Akan dikonfigurasi secara ketat untuk meniru estetika Apple (palet warna khusus, *negative tracking* tipografi, grid 8px). |
| **Framer Motion** | Micro-interactions | Mengatur interaksi *state* presisi seperti `transform: scale(0.95)` pada tombol kapsul tanpa membuat animasi terasa lambat. |
| **Zustand** | State Management | Sangat ringan dan reaktif. Menjaga UI tetap terasa instan (*snappy*) saat pengguna menambahkan atau menyelesaikan tugas. |

---

## 3. Backend & Data Layer (Logic)

| Teknologi | Peran | Alasan Penggunaan |
|---|---|---|
| **Next.js API / Actions** | Server Logic | Menggabungkan *frontend* dan *backend* dalam satu repositori untuk iterasi yang lebih cepat. |
| **PostgreSQL** | Relational Database | Basis data yang paling solid untuk menangani relasi entitas (User, Reminder, Category, TimeLog). |
| **Drizzle ORM** | Data Access | Sangat ringan, cepat, dan *Type-Safe*. Berfungsi menjembatani aplikasi Next.js dengan database PostgreSQL. |

---

## 4. Google Cloud Infrastructure (Deployment)

Aplikasi ini menggunakan pendekatan *Serverless* di Google Cloud untuk memastikan skalabilitas otomatis dan efisiensi biaya.

*   **Google Cloud Run:**
    *   Menjalankan *container* Next.js.
    *   Sepenuhnya *serverless*, otomatis melakukan *auto-scaling* jika ada lonjakan pengguna, dan *scale-to-zero* saat tidak ada aktivitas.
*   **Google Cloud SQL (PostgreSQL):**
    *   Menyimpan *database* utama secara aman dengan pencadangan (*backup*) otomatis dan pemeliharaan terkelola (*managed service*).
*   **Google Cloud Tasks:**
    *   Infrastruktur krusial untuk **akurasi pengingat**.
    *   Setiap kali pengguna membuat jadwal di Repeat, Cloud Tasks menyimpan *event* tersebut dan akan mengeksekusi (memanggil API) secara presisi pada jam/menit yang telah ditentukan.
*   **Firebase Cloud Messaging (FCM):**
    *   Infrastruktur pengiriman *Push Notification*.
    *   Menangani pengiriman notifikasi secara *real-time* ke perangkat (HP/Desktop) via *Service Worker*.
*   **Google Cloud Storage (GCS):**
    *   Penyimpanan objek untuk aset statis (gambar profil, *icon* khusus, atau *thumbnail*).

---

## 5. Core Workflow: The Reminder Loop

Untuk memastikan antarmuka tetap tenang tetapi notifikasi tidak pernah meleset, sistem menggunakan alur kerja asinkron berikut:

1. **User Input:** Pengguna membuat jadwal pengingat baru di UI **Repeat** (misal: "Hari ini, 14:00"). UI langsung diperbarui secara optimis oleh Zustand (instan).
2. **Data Storage:** Di latar belakang, *Server Action* Next.js menyimpan data tersebut ke **Cloud SQL** via Drizzle.
3. **Task Queuing:** Server menjadwalkan *trigger* ke **Google Cloud Tasks** untuk dieksekusi tepat pada pukul 14:00.
4. **Execution:** Pada 14:00:00, Cloud Tasks menembak *endpoint* API (Webhook) di Cloud Run.
5. **Notification Delivery:** Webhook memvalidasi tugas dan memerintahkan **Firebase (FCM)** untuk mengirim *push notification* ke perangkat pengguna.
6. **Completion:** Pengguna menekan notifikasi, diarahkan ke mode fokus (layar *dark tile*), dan menyelesaikan tugas. Database diperbarui.
