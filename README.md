<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,4,6,12&height=220&section=header&text=Konstelasi&fontSize=84&fontColor=ffffff&animation=fadeIn&fontAlignY=36&desc=Visual%20Diary%20%E2%80%A2%20Connected%20Bubbles%20%E2%80%A2%20Personal%20Storytelling&descSize=17&descAlignY=58" alt="Konstelasi Banner" />

<h3>
  <em>"Write your stories as stars. Connect them into constellations of memories."</em>
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

## Table of Contents

- [About](#about)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Feature Details](#feature-details)
- [GraphQL API](#graphql-api)
- [Database Schema](#database-schema)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## About

**Konstelasi** is a node-based visual diary platform that lets you write your stories as interconnected "bubbles." Each note is a star, and the relationships between notes form a personal constellation of memories.

Unlike traditional linear note-taking applications, Konstelasi leverages an **infinite canvas** with **graph-based note-taking**, enabling you to:

- Visualize relationships between thoughts, memories, and ideas
- Build complex stories with multi-branched narratives
- Use time capsules to unlock memories on specific dates
- Experience story mode with 6 distinct view modes (canvas, timeline, reading, gallery, outline, cinematic)
- Capture moments instantly with the integrated photobooth

### Why Konstelasi?

| Aspect | Traditional Notes | Konstelasi |
|--------|-------------------|------------|
| Format | Linear (top-to-bottom) | Visual graph + bubbles |
| Relationships | Implicit, scattered | Explicit via edges |
| Storytelling | Limited | 6 distinct view modes |
| Personalization | Minimal | Scrapbook themes + 6 fonts |
| Privacy | Local or cloud | Time capsules + per-story privacy |
| Collaboration | None | Friends-only stories + public sharing |

---

## Key Features

<div align="center">

| Module | Status | Highlights |
|--------|:------:|------------|
| **Visual Canvas** | Stable | Infinite canvas, drag-and-drop, undo/redo, keyboard nav |
| **Story Mode** | Stable | 6 view modes, templates, time capsule, branching narrative |
| **Rich Editor** | Stable | TipTap with markdown shortcuts, fonts, alignments, code blocks |
| **Photobooth** | Stable | Real-time webcam, filters, frames, batch capture |
| **Gallery** | Stable | Aggregated images across all notes |
| **Engagement** | New | Bookmarks, share links, view tracking |
| **Theming** | Stable | 4 scrapbook palettes, 3 scrapbook fonts, 6 content fonts |
| **Search** | Stable | Cross-mode filtering with grayscale dim for non-matches |

</div>

### Capability Highlights

- **Auto-save on every change** with real-time visual indicators (saving / saved / error)
- **Optimistic UI** for instant perceived performance
- **Undo / Redo** via keyboard shortcuts (Ctrl+Z / Ctrl+Shift+Z)
- **Keyboard navigation** between nodes using arrow keys
- **Edge reconnection** by dragging endpoints to other nodes
- **Branch-aware positioning** when adding new scenes to a story
- **Time capsules** with auto-reload on unlock
- **Multi-image notes** with badge counter on the canvas
- **Word count and reading time** estimation
- **Created and updated timestamps** with relative format
- **Scrapbook themes** with picker accessible directly in the header

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

### Tooling and DevOps

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

## Architecture

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

### Architectural Patterns

- **Code-first GraphQL** - Schema generated automatically from TypeScript decorators
- **Module-based feature isolation** - Notes, Story, Tag, Canvas, and Auth are separated as independent modules
- **Hooks-first frontend architecture** - Custom hooks encapsulate reusable logic (useEdgeOperations, useNoteCreation, useCanvasHistory, etc.)
- **Optimistic UI everywhere** - Apollo cache updates immediately before server confirmation
- **Debounced auto-save** - 800 ms debounce on all content updates
- **Graph-based data model** - Self-referential edges via the NoteLink entity

---


## Getting Started

### Prerequisites

- **Node.js** 20+ ([download](https://nodejs.org))
- **npm** 10+ or pnpm
- **PostgreSQL** 14+ (local or hosted on Supabase)
- A **Supabase** account for image storage ([sign up](https://supabase.com))

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/nndda-rzn/konstelasi.git
cd konstelasi/backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit DATABASE_URL, JWT_SECRET, and other variables as needed

# Start the development server
npm run start:dev
```

The backend will run at `http://localhost:3001`. The GraphQL playground is available at `http://localhost:3001/graphql`.

The database schema is **auto-synced** at startup via MikroORM `updateSchema({ safe: true })`, so no manual migration is required for initial setup.

### Frontend Setup

```bash
cd ../frontend

# Install dependencies (use --legacy-peer-deps because of TipTap)
npm install --legacy-peer-deps

# Configure environment variables
cp .env.example .env.local
# Edit NEXT_PUBLIC_GRAPHQL_URL, NEXT_PUBLIC_SUPABASE_URL, etc.

# Start the development server (Turbopack)
npm run dev
```

The frontend will run at `http://localhost:3000`.

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
npm run dev          # Start the dev server (port 3000)
npm run build        # Build for production
npm run lint         # Run ESLint

# Backend
npm run start:dev    # Watch mode (port 3001)
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # ESLint with auto-fix
```

---

## Project Structure

```
konstelasi/
+-- frontend/                       # Next.js 16 application
|   +-- src/
|   |   +-- app/                    # App Router pages
|   |   |   +-- (dashboard)/        # Protected routes
|   |   |   |   +-- canvas/         # Main canvas page
|   |   |   |   +-- story/          # Story dashboard and detail pages
|   |   |   |   +-- gallery/        # Aggregated image gallery
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
|   |   +-- components/             # Shared UI components
|   |   +-- context/                # CanvasContext, StoryContext, TagContext
|   |   +-- graphql/                # Queries, mutations, story.ts
|   |   +-- lib/                    # Apollo wrapper, providers, toast
|   +-- public/                     # Static assets
|
+-- backend/                        # NestJS 11 API
|   +-- src/
|   |   +-- auth/                   # JWT auth and guards
|   |   +-- canvas/                 # Canvas resolver and service
|   |   +-- entities/               # MikroORM entities (note, story, tag, etc.)
|   |   +-- migrations/             # SQL migration files
|   |   +-- notes/                  # Notes module (CRUD, links, images)
|   |   +-- story/                  # Story module (resolvers, bookmarks)
|   |   +-- streak/                 # Writing streak tracker
|   |   +-- tag/                    # Tag module
|   |   +-- mikro-orm.config.ts     # ORM configuration
|   |   +-- main.ts                 # Entry point and schema auto-sync
|   |   +-- schema.gql              # Generated GraphQL schema
|
+-- README.md
+-- database_setup.sql              # Initial RLS and bucket setup
```

---


## Feature Details

### Visual Canvas

An infinite canvas for visualizing thoughts as connected bubbles.

**Capabilities:**
- Drag-and-drop nodes with smooth bezier curves
- Multi-node selection and bulk delete with a confirmation dialog
- Undo / Redo (Ctrl+Z / Ctrl+Shift+Z) with a 50-step history
- Keyboard navigation between nodes using arrow keys
- 3 view modes: Canvas, Thread, Timeline
- Auto-layout to organize nodes automatically
- 8 color themes per node (default, red, amber, emerald, blue, indigo, purple, pink)
- 6 mood options (memory, hope, secret, dream, ordinary, important)
- Multi-image upload with badge counter
- Tag system with auto-complete
- Edge labels (narrative, causal, character, thematic, etc.)
- Search with grayscale dimming for non-matching nodes
- PNG export via html-to-image

### Story Mode

The next level beyond simple notes - a collection of nodes with narrative structure.

**6 View Modes:**

| Mode | Description |
|------|-------------|
| **Canvas** | Editing surface with React Flow: drag, connect, edit |
| **Timeline** | Vertical timeline sorted by eventDate or createdAt |
| **Reading** | Single-page reader with edge-aware navigation and bookmarks |
| **Gallery** | Masonry image grid with lightbox |
| **Outline** | Grouped by node type with collapsible sections |
| **Cinematic** | Full-screen 7s/slide auto-advance with Ken Burns effect |

**10 Story Node Types:**

scene, memory, character, dialogue, moment, feeling, timeline_event, media, quote, reflection

**5 Built-in Templates** (auto-generate starter scenes):
- Love Story - 4 scenes connected linearly
- Biography - 4 timeline events
- Memory Collection - branching memories
- Adventure - preparation, departure, journey, return
- Character Study - branching profile

**Sharing and Privacy:**
- 3 levels: Private, Friends Only, Public
- Copy public link with visual feedback
- Bookmark per node in reading view
- Friends-only access via email invite and `GRANT_STORY_ACCESS`

**Time Capsules:**
- Set an unlock date at the node level
- The backend hides content until the unlock date
- Auto-reload of content when the unlock date passes (no manual refresh required)

### Rich Text Editor (TipTap 3)

**Format Options:**
- Bold, Italic, Strikethrough
- Heading levels 2 and 3
- Bullet, ordered, and task lists
- Quote, code block (with syntax highlighting via lowlight)
- Link, horizontal rule
- 3 text alignments (left / center / right)
- 6 font families (Default, Serif, Display, Handwriting, Script, Monospace)

**Productivity:**
- Markdown shortcuts (`**bold**`, `# heading`, `> quote`, `- list`)
- Auto-save with a real-time visual indicator
- Word count and reading time estimation
- Title font picker (per-note customization)
- Created and updated timestamp display in relative format

### Photobooth

Real-time webcam capture with custom filters.

**Features:**
- Multi-shot batch capture
- Custom frame overlays
- Color filters (black-and-white, sepia, vintage, etc.)
- Caption and sticker support
- Direct save to a note as an image

### Gallery

Aggregates images from all notes into a single masonry grid:
- Filter by tag, color, or date range
- Lightbox preview
- Click to jump to the source note

### Engagement Layer

- **Bookmarks** per node with a filled visual indicator in reading view
- **View tracking** (`recordView` mutation, ready for analytics)
- **Badges** for milestones (`addBadge` mutation, ready for gamification)
- **Story analytics** with emotional arc, word count, and mood distribution

---


## GraphQL API

The main API is exposed at `/graphql` with code-first schema generation.

### Notes Module

**Queries:**
- `getNotes(canvasId, tagIds)` - List all notes with filters
- `getArchivedNotes(canvasId)` - List archived notes
- `getNote(id)` - Single note with full data
- `getWritingStreak` - User writing streak counter

**Mutations:**
- `createNote(input)` - Create a note with optional mood
- `updateNotePosition(input)` - Update single position
- `batchUpdateNotes(inputs)` - Batch position/size update (debounced)
- `updateNoteContent(input)` - Full content update (title, body, color, mood, titleFont, etc.)
- `deleteNote(id)` / `archiveNote(id)` / `unarchiveNote(id)`
- `createNoteLink(input)` / `updateNoteLink(input)` / `deleteNoteLink(id)`
- `addNoteImage(input)` / `deleteNoteImage(id)`
- `restoreNoteVersion(id)` - Restore a previous version

### Story Module

**Queries:**
- `getStories` - List all stories owned by the user
- `getStory(id)` - Full story with nodes and edges
- `getOnThisDayMemories` - Memories from this date in previous years
- `getPublicStory(id)` - Public access (no auth required)
- `getStoryAccess(storyId)` - List friend invitations
- `getBookmarks(storyId)` - User-bookmarked nodes
- `getStoryAnalytics(storyId)` - Aggregated stats and emotional arc

**Mutations:**
- `createStory(input)` - Create with privacy, theme, and storyType
- `updateStory(input)` - Update meta, status, and scrapbookTheme
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

### Tag and Canvas Modules

**Mutations:**
- `createTag(name, color)` / `updateTag(id, name, color)` / `deleteTag(id)`
- `assignTagsToNote(noteId, tagIds)` / `removeTagFromNote(noteId, tagId)`
- `createCanvas(name)` / `updateCanvas(id, name)` / `deleteCanvas(id)`
- `archiveCanvas(id)` / `unarchiveCanvas(id)`
- `moveCanvas(id, newParentId)` - Nested canvas hierarchy

### Auth Module

- `login(email, password)` - Returns a JWT token
- `register(email, password, name)` - Create account and auto-login
- `me` - Current user info

---

## Database Schema

PostgreSQL database with 12 entities:

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
|   +-> story_access (1:N - friend invites)
|   +-> story_engagement (1:N - bookmarks, views, badges)
+-> tags (1:N)
+-> writing_streak (1:1)
```

**Key Design Decisions:**

- **Single Note entity for canvas and story** - Story nodes are notes with `story_id` and `storyNodeType` discriminator
- **Self-relation NoteLink** - Directional edges with handle positions (top, bottom, left, right)
- **JSON fields for flexible data** - `storyMetadata` and `scrapbookTheme` stored as TEXT JSON
- **Soft archiving** - `isArchived` and `archivedAt` instead of hard deletion
- **Time capsules** - `unlockDate` field on Note hides content from the API until unlocked
- **Auto-sync schema** - MikroORM `updateSchema({ safe: true })` runs at startup in `main.ts`

---


## Roadmap

### Completed (Phase 1-31)

| Phase | Feature |
|-------|---------|
| 1-9 | Initial setup, refactor, hooks extraction, type safety |
| 10-12 | Empty states, useMemo optimization, story templates |
| 13-15 | Image lazy loading, loading skeletons, ConfirmDialog |
| 16-19 | Undo/redo, focus management, keyboard nav, type safety |
| 20-27 | Note editor improvements (auto-save, word count, timestamps, fonts) |
| 28-29 | Text alignment and Google Fonts integration |
| 30-31 | Title font with backend migration |
| Tier 1 | Critical story bugs (privacy, emotion, status, sort, click-nav) |
| Tier 2 | Story UX (insights, search, time capsule, wizard preview, share) |
| Tier 3 | Strategic features (status toggle, theme picker, bookmark, edge nav, branching) |

### In Progress

- Public viewer route for shared stories
- Reading time tracking with analytics dashboard
- Engagement layer UI (badges, view counter)

### Planned (Future Tiers)

- **Real-time collaboration** - WebSocket-based multi-user editing
- **Mobile-first canvas** - Touch gestures and responsive layout
- **Audio narration** - Voice notes for the reading view
- **AI assistance** - Auto-tagging, summary generation, suggestions
- **Export to ebook** - EPUB and PDF with layout preserved
- **Offline mode** - PWA with background sync when online

---

## Contributing

Konstelasi welcomes contributions. Here is how to get involved:

### Reporting Bugs

Open a [GitHub Issue](https://github.com/nndda-rzn/konstelasi/issues/new) with:
- A short, clear description
- Steps to reproduce
- Expected versus actual behavior
- Screenshots or videos if available
- Browser and OS information

### Feature Requests

For new features, open an issue with the `enhancement` label and explain:
- The use case you want to address
- Mockups or visual references (if any)
- Alternatives you have considered

### Pull Requests

```bash
# 1. Fork the repository
# 2. Clone your fork locally
git clone https://github.com/YOUR_USERNAME/konstelasi.git
cd konstelasi

# 3. Create a feature branch
git checkout -b feature/feature-name

# 4. Commit your changes (use conventional commits)
git commit -m "feat: short feature description"

# 5. Push to your fork
git push origin feature/feature-name

# 6. Open a Pull Request via the GitHub UI
```

### Conventional Commits

The format used in this project:
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring without behavior changes
- `docs:` - Documentation only
- `style:` - Formatting, missing semicolons, etc.
- `test:` - Adding tests
- `chore:` - Build process, tooling, etc.

### Code Style

- TypeScript strict mode is enabled
- ESLint config from `eslint-config-next` with custom rules
- Prefer functional components with hooks
- Use Tailwind classes; avoid custom CSS unless required for animations
- Keep comments consistent (English preferred for new files)

---

## License

This project is licensed under the **MIT License** - see [LICENSE](./LICENSE) for details.

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

<sub>"Every note is a star. Every connection is a constellation. Every story is a galaxy."</sub>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,4,6,12&height=120&section=footer" alt="Footer" />

</div>
