# 🛰️ Konstelasi — Backend API

Backend GraphQL API untuk aplikasi Visual Node-Based Diary, dibangun dengan **NestJS 11**, **MikroORM 6**, dan **Apollo Server 5**.

---

## 🏗️ Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| [NestJS](https://nestjs.com) | 11 | Framework backend utama |
| [GraphQL](https://graphql.org) | 16 | API query language |
| [Apollo Server](https://www.apollographql.com) | 5 | GraphQL server |
| [MikroORM](https://mikro-orm.io) | 6 | ORM untuk PostgreSQL |
| [PostgreSQL](https://www.postgresql.org) | 15+ | Database relasional |
| [Passport JWT](http://www.passportjs.org) | 4 | Autentikasi berbasis JWT |
| [Supabase](https://supabase.com) | - | Auth & Storage provider |

---

## 📁 Struktur Direktori

```
backend/
├── src/
│   ├── app.module.ts          # Root module
│   ├── main.ts                # Entry point & bootstrap
│   ├── mikro-orm.config.ts    # Konfigurasi database
│   │
│   ├── entities/              # Database entities (MikroORM)
│   │   ├── user.entity.ts     # Entitas pengguna
│   │   ├── note.entity.ts     # Entitas catatan (node di canvas)
│   │   ├── note-link.entity.ts  # Entitas koneksi antar-catatan (edge)
│   │   └── note-image.entity.ts # Entitas gambar catatan
│   │
│   ├── auth/                  # Modul autentikasi
│   │   ├── auth.module.ts
│   │   ├── auth.resolver.ts   # GraphQL resolver untuk login/register
│   │   ├── jwt.strategy.ts    # Passport JWT strategy
│   │   ├── gql-auth.guard.ts  # Guard untuk proteksi query/mutation
│   │   └── current-user.decorator.ts
│   │
│   └── notes/                 # Modul catatan (CRUD + relasi)
│       ├── notes.module.ts
│       ├── notes.resolver.ts  # GraphQL resolver untuk notes
│       ├── notes.service.ts   # Business logic
│       └── dto/
│           └── note.input.ts  # Input types untuk mutations
│
├── .env                       # Environment variables
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## 📊 Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ NOTE : memiliki
    NOTE ||--o{ NOTE_LINK : "source (outgoing)"
    NOTE ||--o{ NOTE_LINK : "target (incoming)"
    NOTE ||--o{ NOTE_IMAGE : memiliki

    USER {
        uuid id PK
        string email
        datetime created_at
    }

    NOTE {
        uuid id PK
        string title
        text content
        float position_x
        float position_y
        string color
        uuid user_id FK
        datetime created_at
        datetime updated_at
    }

    NOTE_LINK {
        uuid id PK
        string label
        string color
        string source_handle
        string target_handle
        uuid source_id FK
        uuid target_id FK
    }

    NOTE_IMAGE {
        uuid id PK
        string image_url
        string caption
        int order
        uuid note_id FK
        uuid user_id FK
    }
```

---

## 🔌 GraphQL API

### Queries

| Query | Deskripsi |
|-------|-----------|
| `getNotes` | Mengambil semua catatan milik user beserta edges dan gambar |

### Mutations

| Mutation | Deskripsi |
|----------|-----------|
| `createNote` | Membuat catatan baru di posisi tertentu |
| `updateNotePosition` | Memperbarui posisi X/Y catatan di canvas |
| `updateNoteContent` | Memperbarui judul, konten, dan warna catatan |
| `deleteNote` | Menghapus catatan beserta relasi terkait |
| `createNoteLink` | Membuat koneksi (edge) antar catatan |
| `updateNoteLink` | Memperbarui label dan warna koneksi |
| `deleteNoteLink` | Menghapus koneksi antar catatan |
| `addNoteImage` | Menambahkan gambar ke catatan |
| `deleteNoteImage` | Menghapus gambar dari catatan |

---

## ⚙️ Konfigurasi

### Environment Variables (`.env`)

```env
# PostgreSQL Connection String (dari Supabase)
DATABASE_URL="postgresql://user:password@host:5432/postgres"

# Supabase JWT Secret (untuk verifikasi token autentikasi)
SUPABASE_JWT_SECRET="your-jwt-secret"
```

---

## 🚀 Menjalankan

```bash
# Install dependencies
npm install

# Generate schema database (pertama kali)
npx mikro-orm schema:create --run

# Development mode (hot-reload)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

Server berjalan di **http://localhost:3001/graphql**

---

## 🧪 Testing

```bash
npm run test          # Unit tests
npm run test:watch    # Watch mode
npm run test:cov      # Coverage report
npm run test:e2e      # End-to-end tests
```
