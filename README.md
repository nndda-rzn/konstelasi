<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=200&section=header&text=Konstelasi&fontSize=80&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Visual%20Node-Based%20Diary&descSize=20&descAlignY=58" alt="Konstelasi Banner" />

<p>
  <i>Tulis pikiran Anda sebagai bintang-bintang, dan hubungkan mereka menjadi konstelasi ide.</i>
</p>

<p>
  <a href="https://github.com/annda-ky/konstelasi/stargazers"><img src="https://img.shields.io/github/stars/annda-ky/konstelasi?style=for-the-badge&logo=starship&color=FF8FA3&logoColor=white&labelColor=302D41" alt="Stars"/></a>
  <a href="https://github.com/annda-ky/konstelasi/network/members"><img src="https://img.shields.io/github/forks/annda-ky/konstelasi?style=for-the-badge&logo=git&color=B5EAD7&logoColor=white&labelColor=302D41" alt="Forks"/></a>
  <a href="https://github.com/annda-ky/konstelasi/issues"><img src="https://img.shields.io/github/issues/annda-ky/konstelasi?style=for-the-badge&logo=gitbook&color=FFB4A2&logoColor=white&labelColor=302D41" alt="Issues"/></a>
  <a href="https://github.com/annda-ky/konstelasi/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-C7CEEA?style=for-the-badge&logo=opensourceinitiative&logoColor=white&labelColor=302D41" alt="License"/></a>
</p>

<p>
  <img src="https://img.shields.io/badge/Status-Active_Development-FF8FA3?style=flat-square&labelColor=302D41" />
  <img src="https://img.shields.io/badge/Version-2.0.0-B5EAD7?style=flat-square&labelColor=302D41" />
  <img src="https://img.shields.io/badge/Made_with-♥-FF8FA3?style=flat-square&labelColor=302D41" />
</p>

</div>

---

## Tech Stack

<div align="center">

### Frontend
<p>
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Flow-FF6B35?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Apollo_Client-311C87?style=for-the-badge&logo=apollographql&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/TipTap-2D2D2D?style=for-the-badge&logo=tipTap&logoColor=white" />
</p>

### Backend
<p>
  <img src="https://img.shields.io/badge/NestJS_11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white" />
  <img src="https://img.shields.io/badge/Apollo_Server-311C87?style=for-the-badge&logo=apollographql&logoColor=white" />
  <img src="https://img.shields.io/badge/MikroORM-5C5C5C?style=for-the-badge&logo=mikrootp&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL_15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
</p>

</div>

---

## Tentang Proyek

**Konstelasi** adalah aplikasi diary digital yang menampilkan catatan-catatan Anda sebagai **node visual** di atas kanvas tanpa batas (*infinite canvas*). Setiap catatan adalah bintang, dan setiap koneksi antar-catatan adalah garis konstelasi yang bisa diberi label semantik.

### Fitur Inti

| Fitur | Deskripsi |
|:------|:----------|
| **Infinite Canvas** | Kanvas tanpa batas dengan drag & drop untuk menyusun catatan |
| **Edge Semantik** | Hubungkan catatan dengan garis berlabel custom |
| **Pewarnaan Node** | 8 tema warna glassmorphism untuk kategorisasi |
| **Rich Text Editor** | Editor berbasis TipTap dengan dukungan gambar |
| **Global Search** | Pencarian real-time dengan visual spotlight |
| **Canvas Export** | Ekspor seluruh kanvas ke PNG kualitas tinggi |
| **Keyboard Shortcuts** | Ctrl+F search, Delete untuk hapus |
| **Authentication** | Register/Login via Supabase Auth |
| **Multi-View** | Canvas View, Thread View, Timeline View, List View |
| **Tag System** | Many-to-many tagging dengan color coding |
| **Mood System** | 6 tipe mood untuk kategorisasi emosional |
| **Stats Panel** | Analytics dashboard dengan distribusi mood & tag |

### Fitur Terbaru — v2.0.0

| Fitur | Deskripsi |
|:------|:----------|
| **Archive Feature** | Soft delete catatan & canvas dengan kemampuan restore |
| **Writing Streak** | Track streak menulis harian dengan flame indicator |
| **Markdown Support** | Code blocks dengan syntax highlighting, task lists, links |
| **Nested Canvases** | Hierarki canvas dengan tree view & sub-canvas |
| **Mood Badge** | Badge mood dengan text & warna di pojok bubble |
| **Real-time Updates** | Perubahan mood langsung ter-render tanpa refresh |

---

## Arsitektur

```
konstelasi/
├── backend/                    # NestJS + GraphQL + MikroORM
│   ├── src/
│   │   ├── auth/              # JWT authentication
│   │   ├── canvas/            # Canvas + nested canvas logic
│   │   ├── notes/             # Notes CRUD + archive
│   │   ├── streak/            # Writing streak tracking
│   │   ├── tag/               # Tagging system
│   │   ├── entities/          # MikroORM entities
│   │   └── migrations/        # SQL migrations
│   └── package.json
│
├── frontend/                   # Next.js 16 + React Flow + Apollo
│   ├── src/
│   │   ├── app/               # Next.js app router
│   │   ├── components/canvas/ # Canvas components
│   │   ├── context/           # React contexts
│   │   ├── graphql/           # Queries & mutations
│   │   └── lib/               # Utilities
│   └── package.json
│
├── database_setup.sql          # Initial database schema
└── README.md
```

### Stack Detail

| Layer | Teknologi |
|:------|:----------|
| **Frontend** | Next.js 16, React 19, React Flow 12, Apollo Client 4, TipTap 3, Tailwind CSS 4 |
| **Backend** | NestJS 11, GraphQL (Apollo Server 5), MikroORM 6, Passport JWT |
| **Database** | PostgreSQL 15 (via Supabase) |
| **Auth** | Supabase Auth + Passport JWT Strategy |
| **Storage** | Supabase Storage (gambar catatan) |
| **Editor** | TipTap dengan extensions: Code Block Lowlight, Task List, Link |

---

## Quick Start

### Prasyarat

- **Node.js** ≥ 18
- **npm** ≥ 9
- Akun **Supabase** ([daftar gratis](https://supabase.com))

### 1. Clone Repository

```bash
git clone https://github.com/annda-ky/konstelasi.git
cd konstelasi
```

### 2. Setup Database

Jalankan SQL berikut di Supabase SQL Editor secara berurutan:

```bash
# Initial schema
database_setup.sql

# Migration untuk fitur baru (Archive, Streak, Nested Canvases)
backend/src/migrations/001_add_archive_streak_nested.sql
```

### 3. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env`:
```env
DATABASE_URL="postgresql://..."
SUPABASE_JWT_SECRET="..."
```

Jalankan:
```bash
npm run start:dev
```

Backend berjalan di `http://localhost:3001/graphql`

### 4. Setup Frontend

```bash
cd frontend
npm install
```

Buat file `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_GRAPHQL_API_URL=http://localhost:3001/graphql
```

Jalankan:
```bash
npm run dev
```

Frontend berjalan di `http://localhost:3000`

---

## Screenshots

<div align="center">

> Screenshot akan ditambahkan segera.

</div>

---

## Roadmap

- [x] Infinite Canvas dengan React Flow
- [x] Rich Text Editor dengan TipTap
- [x] Tag System dengan color coding
- [x] Search dengan visual spotlight
- [x] Canvas Export ke PNG
- [x] Multi-canvas support
- [x] Mood System dengan badges
- [x] Archive Feature (soft delete + restore)
- [x] Writing Streak tracking
- [x] Markdown Support (code blocks, task lists)
- [x] Nested Canvases (hierarki)
- [ ] Real-time Collaboration
- [ ] AI-Powered Auto-Tagging
- [ ] Dark Mode
- [ ] Mobile Apps (React Native)
- [ ] Public Sharing & Templates

---

## Dokumentasi Lanjutan

- [Backend README](./backend/README.md) — Detail arsitektur API, entities, dan GraphQL schema
- [Frontend README](./frontend/README.md) — Detail komponen UI, state management, dan fitur

---

## Kontribusi

Pull requests sangat diterima. Untuk perubahan besar, harap buka issue terlebih dahulu untuk mendiskusikan apa yang ingin Anda ubah.

---

## Lisensi

Proyek ini adalah proyek pribadi. Lihat [LICENSE](./LICENSE) untuk detail.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=120&section=footer" />

**Dibuat dengan ♥ menggunakan NestJS, Next.js, dan React Flow**

<sub>© 2026 Konstelasi — Visual Diary untuk Pikiran Anda</sub>

</div>
