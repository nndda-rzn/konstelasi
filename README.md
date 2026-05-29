<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,4,6,12&height=220&section=header&text=Konstelasi&fontSize=84&fontColor=ffffff&animation=fadeIn&fontAlignY=36&desc=Visual%20Diary%20%E2%80%A2%20Connected%20Bubbles%20%E2%80%A2%20Personal%20Storytelling&descSize=17&descAlignY=58" alt="Konstelasi Banner" />

<h3>
  <em>"Tulis ceritamu sebagai bintang. Hubungkan mereka menjadi konstelasi kenangan."</em>
</h3>

<p>
  <a href="https://github.com/nndda-rzn/konstelasi/stargazers"><img src="https://img.shields.io/github/stars/nndda-rzn/konstelasi?style=for-the-badge&logo=starship&color=E63946&logoColor=white&labelColor=302D41" alt="Stars"/></a>
  <a href="https://github.com/nndda-rzn/konstelasi/network/members"><img src="https://img.shields.io/github/forks/nndda-rzn/konstelasi?style=for-the-badge&logo=git&color=38D9A9&logoColor=white&labelColor=302D41" alt="Forks"/></a>
  <a href="https://github.com/nndda-rzn/konstelasi/issues"><img src="https://img.shields.io/github/issues/nndda-rzn/konstelasi?style=for-the-badge&logo=gitbook&color=FF6B7A&logoColor=white&labelColor=302D41" alt="Issues"/></a>
  <a href="https://github.com/nndda-rzn/konstelasi/commits/main"><img src="https://img.shields.io/github/last-commit/nndda-rzn/konstelasi?style=for-the-badge&logo=git&color=7C83FD&logoColor=white&labelColor=302D41" alt="Last Commit"/></a>
  <a href="https://github.com/nndda-rzn/konstelasi/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-FFB8C0?style=for-the-badge&logo=opensourceinitiative&logoColor=white&labelColor=302D41" alt="License"/></a>
</p>

<p>
  <img src="https://img.shields.io/badge/Status-Active_Development-38D9A9?style=flat-square&labelColor=302D41" />
  <img src="https://img.shields.io/badge/Version-3.4.0-E63946?style=flat-square&labelColor=302D41" />
  <img src="https://img.shields.io/badge/Phase-31_Complete-FFD93D?style=flat-square&labelColor=302D41" />
  <img src="https://img.shields.io/badge/Stage-Production_Ready-2ECC71?style=flat-square&labelColor=302D41" />
  <img src="https://img.shields.io/badge/Made_with-Love-E63946?style=flat-square&labelColor=302D41" />
</p>

</div>

---

## Daftar Isi

- [Tentang](#tentang)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Arsitektur](#arsitektur)
- [Memulai](#memulai)
- [Struktur Project](#struktur-project)
- [Fitur Detail](#fitur-detail)
- [GraphQL API](#graphql-api)
- [Database Schema](#database-schema)
- [Roadmap](#roadmap)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

---

## Tentang

**Konstelasi** adalah platform diary visual berbasis node yang memungkinkan kamu menulis cerita sebagai "bubble" yang saling terhubung. Setiap catatan adalah bintang, dan hubungan antar catatan membentuk konstelasi kenangan personal kamu.

Tidak seperti aplikasi catatan linear tradisional, Konstelasi menggunakan **canvas tak terbatas** dengan **graph-based note-taking** sehingga kamu bisa:

- Visualisasi hubungan antara pikiran, kenangan, dan ide
- Membangun cerita kompleks dengan multi-cabang naratif
- Time capsule untuk membuka memory di tanggal tertentu
- Story mode dengan 6 view modes (canvas, timeline, reading, gallery, outline, cinematic)
- Photobooth untuk mengabadikan momen langsung

### Kenapa Konstelasi?

| Aspek | Catatan Tradisional | Konstelasi |
|-------|---------------------|------------|
| Format | Linear (top-to-bottom) | Visual graph + bubbles |
| Hubungan | Implisit, tersebar | Eksplisit via edges |
| Storytelling | Terbatas | 6 view modes berbeda |
| Personalisasi | Minim | Scrapbook themes + 6 fonts |
| Privasi | Local atau cloud | Time capsules + per-story privacy |
| Kolaborasi | Tidak ada | Friends-only stories + public sharing |

---

## Fitur Utama

<div align="center">

| Module | Status | Highlights |
|--------|:------:|------------|
| **Visual Canvas** | Stable | Infinite canvas, drag-and-drop, undo/redo, keyboard nav |
| **Story Mode** | Stable | 6 view modes, templates, time capsule, branching narrative |
| **Rich Editor** | Stable | TipTap with markdown shortcuts, fonts, alignments, code blocks |
| **Photobooth** | Stable | Real-time webcam, filters, frames, batch capture |
| **Gallery** | Stable | Aggregate images across all notes |
| **Engagement** | New | Bookmarks, share links, view tracking |
| **Theming** | Stable | 4 scrapbook palettes, 3 scrapbook fonts, 6 content fonts |
| **Search** | Stable | Cross-mode filtering with grayscale dim for non-matches |

</div>

### Capability Highlights

- **Auto-save semua perubahan** dengan visual indicator (saving/saved/error)
- **Optimistic UI** untuk perceived performance instant
- **Undo/Redo** dengan keyboard shortcut (Ctrl+Z / Ctrl+Shift+Z)
- **Keyboard navigation** antar nodes (arrow keys)
- **Edge reconnection** drag endpoint ke node lain
- **Branch-aware positioning** saat add scene baru di story
- **Time capsules** dengan auto-reload saat unlock
- **Multi-image notes** dengan badge counter di canvas
- **Word count + reading time** estimasi
- **Created/Updated timestamps** dengan format relatif Indonesia
- **Scrapbook themes** dengan picker visible di header

---

## Tech Stack

<div align="center">

### Frontend

<p>
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Apollo_Client_4-311C87?style=for-the-badge&logo=apollographql&logoColor=white" alt="Apollo"/>
</p>

<p>
  <img src="https://img.shields.io/badge/React_Flow_12-FF0072?style=for-the-badge&logo=react&logoColor=white" alt="React Flow"/>
  <img src="https://img.shields.io/badge/TipTap_3-000000?style=for-the-badge&logo=tiptap&logoColor=white" alt="TipTap"/>
  <img src="https://img.shields.io/badge/Framer_Motion-EF4444?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion"/>
  <img src="https://img.shields.io/badge/Lucide_Icons-F56565?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide"/>
  <img src="https://img.shields.io/badge/Sonner-000000?style=for-the-badge&logo=sonarcloud&logoColor=white" alt="Sonner"/>
</p>

<p>
  <img src="https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Recharts"/>
  <img src="https://img.shields.io/badge/HTML_to_Image-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML to Image"/>
  <img src="https://img.shields.io/badge/React_Webcam-1572B6?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Webcam"/>
  <img src="https://img.shields.io/badge/Lowlight-282A36?style=for-the-badge&logo=javascript&logoColor=F1FA8C" alt="Lowlight"/>
</p>

### Backend

<p>
  <img src="https://img.shields.io/badge/NestJS_11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"/>
  <img src="https://img.shields.io/badge/Apollo_Server_5-311C87?style=for-the-badge&logo=apollographql&logoColor=white" alt="Apollo Server"/>
  <img src="https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white" alt="GraphQL"/>
  <img src="https://img.shields.io/badge/MikroORM_6-FF5733?style=for-the-badge&logo=database&logoColor=white" alt="MikroORM"/>
  <img src="https://img.shields.io/badge/Passport_JWT-34E27A?style=for-the-badge&logo=passport&logoColor=white" alt="Passport"/>
</p>

<p>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white" alt="RxJS"/>
</p>

### Tooling & DevOps

<p>
  <img src="https://img.shields.io/badge/ESLint_9-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint"/>
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" alt="Prettier"/>
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest"/>
  <img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm"/>
</p>

<p>
  <img src="https://img.shields.io/badge/Turbopack-EF4444?style=for-the-badge&logo=turbo&logoColor=white" alt="Turbopack"/>
  <img src="https://img.shields.io/badge/React_Compiler-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Compiler"/>
  <img src="https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white" alt="PostCSS"/>
</p>

### Fonts (Google Fonts)

<p>
  <img src="https://img.shields.io/badge/Inter-000000?style=flat-square&logo=googlefonts&logoColor=white" alt="Inter"/>
  <img src="https://img.shields.io/badge/Caveat-FF8FA3?style=flat-square&logo=googlefonts&logoColor=white" alt="Caveat"/>
  <img src="https://img.shields.io/badge/Dancing_Script-E63946?style=flat-square&logo=googlefonts&logoColor=white" alt="Dancing Script"/>
  <img src="https://img.shields.io/badge/Playfair_Display-4A2F3C?style=flat-square&logo=googlefonts&logoColor=white" alt="Playfair Display"/>
  <img src="https://img.shields.io/badge/Lora-7C83FD?style=flat-square&logo=googlefonts&logoColor=white" alt="Lora"/>
  <img src="https://img.shields.io/badge/Geist_Mono-1E1E2E?style=flat-square&logo=vercel&logoColor=white" alt="Geist Mono"/>
</p>

</div>

---

## Arsitektur

```
                    +---------------------+
                    |     Browser         |
                    |   (React 19 RSC)    |
                    +----------+----------+
                               |
                               | HTTPS / GraphQL
                               v
        +----------------------+----------------------+
        |          Next.js 16 (App Router)             |
        |   * Apollo Client 4   * TipTap Editor        |
        |   * React Flow 12     * Tailwind v4          |
        |   * Framer Motion     * Sonner Toasts        |
        +----------------------+----------------------+
                               |
                               | GraphQL Queries / Mutations
                               v
        +----------------------+----------------------+
        |          NestJS 11 + Apollo Server 5         |
        |   * Code-first GraphQL Schema                |
        |   * Passport JWT Authentication              |
        |   * Module-based Architecture                |
        +----------------------+----------------------+
                               |
                  +------------+-----------+
                  |                        |
                  v                        v
        +-------------------+    +-------------------+
        |   MikroORM 6      |    |  Supabase Storage |
        |   * PostgreSQL    |    |  * notes_images   |
        |   * Migrations    |    |  * RLS policies   |
        |   * Schema sync   |    +-------------------+
        +-------------------+
                  |
                  v
        +-------------------+
        |   PostgreSQL 16   |
        +-------------------+
```

### Pattern yang Dipakai

- **Code-first GraphQL** - Schema generated otomatis dari TypeScript decorators
- **Module-based feature isolation** - Notes, Story, Tag, Canvas, Auth sebagai modules terpisah
- **Hooks-first frontend architecture** - Custom hooks untuk reusable logic (useEdgeOperations, useNoteCreation, useCanvasHistory, dll)
- **Optimistic UI everywhere** - Apollo cache update langsung sebelum server respond
- **Debounced auto-save** - 800ms debounce untuk semua content updates
- **Graph-based data model** - Self-referential edges via NoteLink entity

---

## Memulai

### Prasyarat

- **Node.js** 20+ ([download](https://nodejs.org))
- **npm** 10+ atau pnpm
- **PostgreSQL** 14+ (lokal atau hosted di Supabase)
- **Supabase** account untuk image storage ([signup](https://supabase.com))

### Setup Backend

```bash
# Clone repo
git clone https://github.com/nndda-rzn/konstelasi.git
cd konstelasi/backend

# Install dependencies
npm install

# Setup .env
cp .env.example .env
# Edit DATABASE_URL, JWT_SECRET, dll.

# Start dev server
npm run start:dev
```

Backend akan running di `http://localhost:3001`. GraphQL playground tersedia di `http://localhost:3001/graphql`.

Schema database **auto-sync** saat startup via MikroORM `updateSchema({ safe: true })` - tidak perlu run migration manual untuk setup awal.

### Setup Frontend

```bash
cd ../frontend

# Install dependencies (gunakan --legacy-peer-deps karena TipTap)
npm install --legacy-peer-deps

# Setup .env.local
cp .env.example .env.local
# Edit NEXT_PUBLIC_GRAPHQL_URL, NEXT_PUBLIC_SUPABASE_URL, dll.

# Start dev server (Turbopack)
npm run dev
```

Frontend akan running di `http://localhost:3000`.

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/konstelasi
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
NODE_ENV=development
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3001/graphql
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Quick Commands

```bash
# Frontend
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run lint         # ESLint check

# Backend
npm run start:dev    # Watch mode (port 3001)
npm run build        # Production build
npm run test         # Run tests
npm run lint         # ESLint + auto-fix
```

---

## Struktur Project

```
konstelasi/
+-- frontend/                       # Next.js 16 App
|   +-- src/
|   |   +-- app/                    # App Router pages
|   |   |   +-- (dashboard)/        # Protected routes
|   |   |   |   +-- canvas/         # Main canvas page
|   |   |   |   +-- story/          # Story dashboard + detail
|   |   |   |   +-- gallery/        # Aggregate image gallery
|   |   |   |   +-- photobooth/     # Webcam capture
|   |   |   +-- login/              # Auth pages
|   |   |   +-- register/
|   |   +-- features/               # Feature modules
|   |   |   +-- canvas/
|   |   |   |   +-- components/     # NoteNode, DiaryCanvas, panels
|   |   |   |   +-- hooks/          # useEdgeOperations, useCanvasHistory
|   |   |   |   +-- panels/         # Tag, Search, Stats, Archive panels
|   |   |   |   +-- utils/          # notesToFlow, fontOptions, textStats
|   |   |   |   +-- types/          # Domain types
|   |   |   +-- story/
|   |   |   |   +-- components/     # StoryNode, StoryHeader, view modes
|   |   |   |   +-- utils/          # scrapbookTheme, nodeOrder
|   |   |   |   +-- templates.ts    # Story type templates
|   |   |   +-- photobooth/
|   |   +-- components/             # Shared UI
|   |   +-- context/                # CanvasContext, StoryContext, TagContext
|   |   +-- graphql/                # Queries, mutations, story.ts
|   |   +-- lib/                    # Apollo wrapper, providers, toast
|   +-- public/                     # Static assets
|
+-- backend/                        # NestJS 11 API
|   +-- src/
|   |   +-- auth/                   # JWT auth + guards
|   |   +-- canvas/                 # Canvas resolver + service
|   |   +-- entities/               # MikroORM entities (note, story, tag, etc)
|   |   +-- migrations/             # SQL migration files
|   |   +-- notes/                  # Notes module (CRUD + links + images)
|   |   +-- story/                  # Story module (resolvers + bookmarks)
|   |   +-- streak/                 # Writing streak tracker
|   |   +-- tag/                    # Tag module
|   |   +-- mikro-orm.config.ts     # ORM config
|   |   +-- main.ts                 # Entry + schema auto-sync
|   |   +-- schema.gql              # Generated GraphQL schema
|
+-- README.md
+-- database_setup.sql              # Initial RLS + bucket setup
```

---

## Fitur Detail

### Visual Canvas

Canvas tak terbatas untuk visualisasi pikiran sebagai connected bubbles.

**Capabilities:**
- Drag-and-drop nodes dengan smooth bezier curves
- Multi-node selection + bulk delete dengan ConfirmDialog
- Undo/Redo (Ctrl+Z / Ctrl+Shift+Z) dengan 50-step history
- Keyboard navigation (arrow keys) antar nodes
- 3 view modes: Canvas, Thread, Timeline
- Auto-layout untuk merapikan posisi node otomatis
- 8 color themes per node (default, red, amber, emerald, blue, indigo, purple, pink)
- 6 mood options (memory, hope, secret, dream, ordinary, important)
- Multi-image upload dengan badge counter
- Tag system dengan auto-complete
- Edge labels (narrative, causal, character, thematic, dll)
- Search dengan grayscale dim untuk non-matches
- Export ke PNG via html-to-image

### Story Mode

Tingkat selanjutnya dari catatan biasa - kumpulan node dengan struktur naratif.

**6 View Modes:**

| Mode | Deskripsi |
|------|-----------|
| **Canvas** | Editing surface dengan React Flow, drag, connect, edit |
| **Timeline** | Vertical timeline sorted by eventDate atau createdAt |
| **Reading** | Single-page reader, navigate via edges atau array order, bookmark |
| **Gallery** | Masonry image grid dengan lightbox |
| **Outline** | Grouped by node type dengan collapsible sections |
| **Cinematic** | Full-screen 7s/slide auto-advance dengan Ken Burns effect |

**10 Story Node Types:**

scene, memory, character, dialogue, moment, feeling, timeline_event, media, quote, reflection

**5 Built-in Templates** (auto-generate starter scenes):
- Love Story - 4 scenes connected linearly
- Biography - 4 timeline events
- Memory Collection - branching memories
- Adventure - persiapan -> berangkat -> petualangan -> pulang
- Character Study - branching profil

**Sharing & Privacy:**
- 3 levels: Private, Friends Only, Public
- Copy public link dengan visual feedback
- Bookmark per node untuk reading view
- Friends-only via email invite + GRANT_STORY_ACCESS

**Time Capsules:**
- Set unlock date pada node level
- Backend menyembunyikan content sampai tanggal unlock
- Auto-reload content saat unlock date passed (no manual refresh)

### Rich Text Editor (TipTap 3)

**Format Options:**
- Bold, Italic, Strikethrough
- Heading 2/3
- Bullet/Ordered/Task lists
- Quote, Code block (dengan syntax highlight via lowlight)
- Link, Horizontal rule
- 3 Text alignment (left/center/right)
- 6 Font families (Default, Serif, Display, Handwriting, Script, Monospace)

**Productivity:**
- Markdown shortcuts (`**bold**`, `# heading`, `> quote`, `- list`)
- Auto-save dengan visual indicator real-time
- Word count + reading time estimasi
- Title font picker (per-note customization)
- Created/Updated timestamp display dengan format relatif Indonesia

### Photobooth

Real-time webcam capture dengan custom filters.

**Features:**
- Multi-shot batch capture
- Custom frame overlays
- Color filters (B&W, sepia, vintage, dll)
- Caption + sticker support
- Direct save ke note sebagai image

### Gallery

Aggregate semua image dari semua notes ke satu masonry grid:
- Filter by tag, color, atau date range
- Lightbox preview
- Click untuk jump ke source note

### Engagement Layer

- **Bookmarks** per node dengan visual indicator filled di reading view
- **View tracking** (RECORD_VIEW mutation, ready untuk analytics)
- **Badges** untuk milestone (ADD_BADGE mutation, ready untuk gamification)
- **Story analytics** dengan emotional arc, word count, mood distribution

---

## GraphQL API

API utama tersedia di `/graphql` dengan code-first schema generation.

### Notes Module

**Queries:**
- `getNotes(canvasId, tagIds)` - List all notes dengan filter
- `getArchivedNotes(canvasId)` - List archived notes
- `getNote(id)` - Single note dengan full data
- `getWritingStreak` - User's writing streak counter

**Mutations:**
- `createNote(input)` - Create note dengan optional mood
- `updateNotePosition(input)` - Single position update
- `batchUpdateNotes(inputs)` - Batch position/size update (debounced)
- `updateNoteContent(input)` - Full content update (title, body, color, mood, titleFont, etc)
- `deleteNote(id)` / `archiveNote(id)` / `unarchiveNote(id)`
- `createNoteLink(input)` / `updateNoteLink(input)` / `deleteNoteLink(id)`
- `addNoteImage(input)` / `deleteNoteImage(id)`
- `restoreNoteVersion(id)` - Restore previous version

### Story Module

**Queries:**
- `getStories` - List user's stories
- `getStory(id)` - Full story dengan nodes + edges
- `getOnThisDayMemories` - Memory dari tahun lalu di tanggal ini
- `getPublicStory(id)` - Public access (no auth required)
- `getStoryAccess(storyId)` - List friend invitations
- `getBookmarks(storyId)` - User's bookmarked nodes
- `getStoryAnalytics(storyId)` - Aggregate stats + emotional arc

**Mutations:**
- `createStory(input)` - Create dengan privacy + theme + storyType
- `updateStory(input)` - Update meta + status + scrapbookTheme
- `deleteStory(id)`
- `addNodeToStory(storyId, noteId, nodeType, metadata)`
- `removeNodeFromStory(storyId, noteId)`
- `toggleNodeLock(nodeId)` - Manual lock toggle
- `grantStoryAccess(storyId, email, level)` - Friend invite
- `revokeStoryAccess(accessId)`
- `toggleBookmark(storyId, nodeId)` - Engagement
- `addBadge(storyId, nodeId, badgeType)`
- `recordView(storyId, nodeId, timeSpent)`
- `createStoryVersion(storyId)` / `restoreStoryVersion(id)` / `deleteStoryVersion(id)`

### Tag & Canvas Module

**Mutations:**
- `createTag(name, color)` / `updateTag(id, name, color)` / `deleteTag(id)`
- `assignTagsToNote(noteId, tagIds)` / `removeTagFromNote(noteId, tagId)`
- `createCanvas(name)` / `updateCanvas(id, name)` / `deleteCanvas(id)`
- `archiveCanvas(id)` / `unarchiveCanvas(id)`
- `moveCanvas(id, newParentId)` - Nested canvas hierarchy

### Auth Module

- `login(email, password)` - Returns JWT token
- `register(email, password, name)` - Create account + auto-login
- `me` - Current user info

---

## Database Schema

PostgreSQL database dengan 12 entities:

```
users
+-> canvases (1:N)
|   +-> notes (1:N)
+-> notes (1:N owner)
|   +-> note_images (1:N)
|   +-> note_links (1:N self-relation via NoteLink)
|   +-> note_versions (1:N)
|   +-> tags (M:N via junction)
|   +-> story (N:1 optional)
+-> stories (1:N)
|   +-> nodes [Note] (1:N via story_id)
|   +-> story_versions (1:N)
|   +-> story_access (1:N - friends invites)
|   +-> story_engagement (1:N - bookmarks, views, badges)
+-> tags (1:N)
+-> writing_streak (1:1)
```

**Key Design Decisions:**

- **Single Note entity untuk canvas + story** - Story nodes are notes dengan `story_id` + `storyNodeType` discriminator
- **Self-relation NoteLink** - Edges direksional dengan handle positions (top/bottom/left/right)
- **JSON fields untuk flexible data** - `storyMetadata`, `scrapbookTheme` sebagai TEXT JSON
- **Soft archiving** - `isArchived` + `archivedAt` instead of hard delete
- **Time capsule** - `unlockDate` field di Note, content sembunyi dari API jika belum unlock
- **Auto-sync schema** - MikroORM `updateSchema({ safe: true })` di `main.ts` startup

---

## Roadmap

### Selesai (Phase 1-31)

| Phase | Feature |
|-------|---------|
| 1-9 | Initial setup, refactor, hooks extraction, type safety |
| 10-12 | Empty states, useMemo optimization, story templates |
| 13-15 | Image lazy loading, loading skeletons, ConfirmDialog |
| 16-19 | Undo/redo, focus management, keyboard nav, type safety |
| 20-27 | Note editor improvements (auto-save, word count, timestamps, fonts) |
| 28-29 | Text alignment + Google Fonts integration |
| 30-31 | Title font with backend migration |
| Tier 1 | Critical story bugs (privacy, emotion, status, sort, click-nav) |
| Tier 2 | Story UX (insights, search, time capsule, wizard preview, share) |
| Tier 3 | Strategic features (status toggle, theme picker, bookmark, edge nav, branching) |

### In Progress

- Public viewer route untuk shared stories
- Reading time tracking dengan analytics dashboard
- Engagement layer UI (badges, view counter)

### Planned (Future Tiers)

- **Real-time collaboration** - WebSocket multi-user editing
- **Mobile-first canvas** - Touch gestures + responsive layout
- **Audio narration** - Voice notes untuk reading view
- **AI assistance** - Auto-tagging, summary generation, suggestion
- **Export to ebook** - EPUB/PDF dengan layout preserved
- **Offline mode** - PWA dengan sync saat online

---

## Kontribusi

Konstelasi terbuka untuk kontribusi! Berikut cara untuk berpartisipasi:

### Reporting Bugs

Buka [GitHub Issue](https://github.com/nndda-rzn/konstelasi/issues/new) dengan:
- Deskripsi singkat dan jelas
- Steps to reproduce
- Expected vs actual behavior
- Screenshot atau video jika ada
- Browser + OS info

### Feature Requests

Untuk fitur baru, buka issue dengan label `enhancement` dan jelaskan:
- Use case yang ingin diselesaikan
- Mockup atau referensi visual (jika ada)
- Alternatif yang sudah dipertimbangkan

### Pull Requests

```bash
# 1. Fork repository
# 2. Clone fork lokal
git clone https://github.com/YOUR_USERNAME/konstelasi.git
cd konstelasi

# 3. Buat branch feature
git checkout -b feature/nama-fitur

# 4. Commit changes (gunakan conventional commits)
git commit -m "feat: deskripsi singkat fitur"

# 5. Push ke fork
git push origin feature/nama-fitur

# 6. Buat Pull Request via GitHub UI
```

### Conventional Commits

Format yang dipakai:
- `feat:` - Fitur baru
- `fix:` - Bug fix
- `refactor:` - Code refactoring tanpa perubahan behavior
- `docs:` - Documentation only
- `style:` - Formatting, missing semi colons, dll
- `test:` - Adding tests
- `chore:` - Build process, tooling, dll

### Code Style

- TypeScript strict mode aktif
- ESLint config dari `eslint-config-next` + custom rules
- Prefer functional components dengan hooks
- Use Tailwind classes, hindari custom CSS kecuali animations
- Comment dalam Bahasa Indonesia atau English (consistent per file)

---

## Lisensi

Project ini dilisensikan di bawah **MIT License** - lihat [LICENSE](./LICENSE) untuk detail.

```
MIT License

Copyright (c) 2026 Konstelasi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

<div align="center">

### Built with care, designed for storytellers

<p>
  <img src="https://img.shields.io/badge/Crafted_in-Indonesia-FF0000?style=flat-square&labelColor=FFFFFF" />
  <img src="https://img.shields.io/badge/Powered_by-Coffee-6F4E37?style=flat-square&labelColor=FFFFFF" />
  <img src="https://img.shields.io/badge/Driven_by-Storytelling-E63946?style=flat-square&labelColor=FFFFFF" />
</p>

<p>
  <a href="https://github.com/nndda-rzn/konstelasi">
    <img src="https://img.shields.io/badge/Star_on_GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="Star on GitHub"/>
  </a>
</p>

<sub>"Setiap catatan adalah bintang. Setiap koneksi adalah konstelasi. Setiap cerita adalah galaksi."</sub>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,4,6,12&height=120&section=footer" alt="Footer" />

</div>
