<p align="center">
  <img src="https://img.shields.io/badge/Konstelasi-Visual_Diary-DC2626?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTkuOTM3IDEuODcxYy4yLjg5OC4wOTIgMS44ODQtLjMwNyAyLjcyM2ExLjI3NiAxLjI3NiAwIDAgMS0uODIyLjcwMmMtLjg3LjE4LTEuNzI1LS4yNjItMi4zNTctMS4wMjRhLjkuOSAwIDAgMC0xLjQzLS4xMiIvPjwvc3ZnPg==&logoColor=white" alt="Konstelasi Badge" />
</p>

<h1 align="center">✨ Konstelasi — Visual Node-Based Diary ✨</h1>

<p align="center">
  <b>Sebuah aplikasi catatan harian berbasis graf visual.</b><br/>
  Tulis pikiran Anda sebagai bintang-bintang, dan hubungkan mereka menjadi konstelasi ide.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/React_Flow-12-FF6B35?logo=react" alt="React Flow" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Supabase-Auth_&_Storage-3ECF8E?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/GraphQL-API-E10098?logo=graphql" alt="GraphQL" />
</p>

---

## 🌌 Tentang Proyek

**Konstelasi** adalah aplikasi diary digital yang menampilkan catatan-catatan Anda sebagai **node-node visual** di atas kanvas tanpa batas (*infinite canvas*). Setiap catatan adalah sebuah bintang, dan setiap koneksi antar-catatan adalah garis konstelasi yang bisa diberi label semantik.

### ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🎨 **Infinite Canvas** | Kanvas tanpa batas untuk menyusun catatan secara visual dengan drag & drop |
| 🔗 **Edge Semantik** | Hubungkan catatan dengan garis berlabel (mendukung, berkaitan, dll) |
| 🌈 **Pewarnaan Node** | 8 tema warna glassmorphism untuk mengkategorikan catatan |
| ✍️ **Rich Text Editor** | Editor teks kaya berbasis TipTap dengan dukungan gambar |
| 🔍 **Global Search** | Pencarian real-time dengan visual spotlight highlight |
| 📸 **Canvas Export** | Ekspor seluruh kanvas ke gambar PNG berkualitas tinggi |
| ⌨️ **Keyboard Shortcuts** | Ctrl+F untuk pencarian, Delete untuk menghapus |
| 🔐 **Autentikasi** | Register/Login via Supabase Auth |
| 📱 **Responsif** | Desktop: Canvas View, Mobile: List View |

---

## 🏗️ Arsitektur

```
konstelasi/
├── backend/           # NestJS + GraphQL + MikroORM
├── frontend/          # Next.js 16 + React Flow + Apollo Client
└── database_setup.sql # SQL setup untuk PostgreSQL/Supabase
```

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, React Flow 12, Apollo Client 4, TipTap, Tailwind CSS 4 |
| **Backend** | NestJS 11, GraphQL (Apollo Server 5), MikroORM 6 |
| **Database** | PostgreSQL (via Supabase) |
| **Auth** | Supabase Auth + Passport JWT |
| **Storage** | Supabase Storage (untuk gambar catatan) |

---

## 🚀 Quick Start

### Prasyarat

- **Node.js** ≥ 18
- **npm** ≥ 9
- Akun **Supabase** (gratis) → [supabase.com](https://supabase.com)

### 1. Clone Repository

```bash
git clone https://github.com/annda-ky/konstelasi.git
cd konstelasi
```

### 2. Setup Database

Jalankan isi `database_setup.sql` di Supabase SQL Editor untuk membuat tabel-tabel yang diperlukan.

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

## 📄 Dokumentasi Lanjutan

- 📦 [Backend README](./backend/README.md) — Detail arsitektur API, entity, dan GraphQL schema
- 🎨 [Frontend README](./frontend/README.md) — Detail komponen UI, state management, dan fitur

---

## 📝 Lisensi

Proyek ini adalah proyek pribadi dan tidak berlisensi terbuka.

---

<p align="center">
  Dibuat dengan ❤️ menggunakan <b>NestJS</b>, <b>Next.js</b>, dan <b>React Flow</b>
</p>
