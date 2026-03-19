# 🎨 Konstelasi — Frontend

Antarmuka pengguna untuk aplikasi Visual Node-Based Diary, dibangun dengan **Next.js 16**, **React Flow 12**, dan **Apollo Client 4**.

---

## 🏗️ Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| [Next.js](https://nextjs.org) | 16 | Framework React full-stack |
| [React](https://react.dev) | 19 | Library UI |
| [React Flow](https://reactflow.dev) | 12 | Infinite canvas & node graph |
| [Apollo Client](https://www.apollographql.com/docs/react) | 4 | GraphQL state management |
| [TipTap](https://tiptap.dev) | 3 | Rich text editor |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Styling framework |
| [Supabase JS](https://supabase.com/docs/reference/javascript) | 2 | Auth & Storage client |
| [Lucide React](https://lucide.dev) | - | Icon library |
| [html-to-image](https://github.com/niconi/html-to-image) | 1 | Canvas export ke PNG |

---

## 📁 Struktur Direktori

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout dengan font & providers
│   │   ├── page.tsx            # Halaman utama (redirect)
│   │   ├── globals.css         # Global styles & React Flow overrides
│   │   ├── login/
│   │   │   └── page.tsx        # Halaman login
│   │   ├── register/
│   │   │   └── page.tsx        # Halaman registrasi  
│   │   └── canvas/
│   │       └── page.tsx        # Halaman kanvas utama
│   │
│   ├── components/
│   │   └── canvas/
│   │       ├── DiaryCanvas.tsx      # Komponen kanvas utama (desktop)
│   │       ├── DiaryListView.tsx    # Tampilan daftar (mobile)
│   │       ├── NoteNode.tsx         # Custom node dengan glassmorphism
│   │       ├── SemanticEdge.tsx     # Custom edge dengan label interaktif
│   │       └── NoteEditorSidebar.tsx # Sidebar editor catatan
│   │
│   ├── graphql/
│   │   ├── queries.ts          # GraphQL queries (GET_NOTES)
│   │   └── mutations.ts        # GraphQL mutations (CRUD)
│   │
│   ├── lib/
│   │   ├── apollo/
│   │   │   └── ApolloWrapper.tsx  # Apollo Client provider
│   │   └── supabase/
│   │       ├── client.ts       # Supabase browser client
│   │       ├── server.ts       # Supabase server client
│   │       └── middleware.ts   # Auth middleware
│   │
│   └── middleware.ts           # Next.js route protection
│
├── .env.local                  # Environment variables
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts
```

---

## 🧩 Komponen Utama

### `DiaryCanvas.tsx`
Komponen utama untuk tampilan desktop. Fitur:
- 🗺️ Infinite canvas dengan pan & zoom
- ➕ Klik kanan untuk membuat catatan baru
- 🔗 Drag dari handle untuk membuat koneksi
- 🔍 Global search bar (Ctrl+F)
- 📸 Export canvas ke PNG
- ⌨️ Delete/Backspace untuk hapus node/edge
- 🎨 Node color inheritance pada edges

### `NoteNode.tsx`
Custom React Flow node dengan:
- 🌈 8 tema warna glassmorphism (Red, Amber, Emerald, Blue, Indigo, Purple, Pink, Default)
- ✨ Efek glow dan spotlight saat search match
- 🔘 4 connection handles (top, right, bottom, left)

### `SemanticEdge.tsx`
Custom React Flow edge dengan:
- 🏷️ Label teks interaktif (double-click untuk edit)
- 🎨 Warna dinamis mengikuti warna node sumber
- ✨ Drop-shadow glow effect

### `NoteEditorSidebar.tsx`
Sidebar editor untuk mengedit catatan:
- ✍️ Rich text editor (TipTap)
- 🖼️ Upload & kelola gambar (Supabase Storage)
- 🎨 Color picker untuk tema node
- 🔗 Daftar "Mentioned In" (backlinks)
- 🗑️ Hapus catatan

### `DiaryListView.tsx`
Tampilan alternatif untuk mobile:
- 📱 Grid responsif 1-2 kolom
- 🔍 Search filter langsung
- 🎨 Accent color sesuai tema node

---

## 🎨 Sistem Desain

### Tema Warna Node

| Tema | Border | Background | Glow |
|------|--------|------------|------|
| Default | `white/20` | `white/5` | `white/20` |
| Red | `red-500/30` | `red-500/10` | `red-500/40` |
| Amber | `amber-500/30` | `amber-500/10` | `amber-500/40` |
| Emerald | `emerald-500/30` | `emerald-500/10` | `emerald-500/40` |
| Blue | `blue-500/30` | `blue-500/10` | `blue-500/40` |
| Indigo | `indigo-500/30` | `indigo-500/10` | `indigo-500/40` |
| Purple | `purple-500/30` | `purple-500/10` | `purple-500/40` |
| Pink | `pink-500/30` | `pink-500/10` | `pink-500/40` |

### Keyboard Shortcuts

| Shortcut | Aksi |
|----------|------|
| `Ctrl + F` / `Cmd + F` | Fokus ke search bar |
| `Delete` / `Backspace` | Hapus node atau edge yang dipilih |
| Klik kanan di canvas | Buat catatan baru |
| Double-click node | Buka editor sidebar |
| Double-click edge label | Edit label koneksi |

---

## ⚙️ Konfigurasi

### Environment Variables (`.env.local`)

```env
# Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# Supabase Anonymous Key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Backend GraphQL API URL
NEXT_PUBLIC_GRAPHQL_API_URL=http://localhost:3001/graphql
```

---

## 🚀 Menjalankan

```bash
# Install dependencies
npm install

# Development mode (Turbopack)
npm run dev

# Production build
npm run build
npm start
```

Aplikasi berjalan di **http://localhost:3000**

### Halaman

| Route | Deskripsi |
|-------|-----------|
| `/` | Redirect ke `/canvas` atau `/login` |
| `/login` | Halaman login |
| `/register` | Halaman registrasi |
| `/canvas` | Kanvas utama (dilindungi auth) |

---

## 🔐 Autentikasi

Autentikasi menggunakan **Supabase Auth** dengan flow:
1. User register/login via Supabase client
2. Supabase mengembalikan JWT token
3. Token dikirim ke backend GraphQL via `Authorization: Bearer <token>`
4. Backend memverifikasi token menggunakan `passport-jwt`
5. Middleware Next.js memproteksi route `/canvas`
