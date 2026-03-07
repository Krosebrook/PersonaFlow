# Architecture

This document describes the high-level architecture of PersonaFlow, explaining how the major parts of the system fit together.

## Table of Contents

- [Overview](#overview)
- [Layer Diagram](#layer-diagram)
- [Module Breakdown](#module-breakdown)
  - [Entry Point & Routing](#entry-point--routing)
  - [Authentication Layer](#authentication-layer)
  - [Page Layer](#page-layer)
  - [Component Layer](#component-layer)
  - [Service Layer](#service-layer)
  - [Data Layer](#data-layer)
- [Data Flow](#data-flow)
  - [Organization Creation Flow](#organization-creation-flow)
  - [Persona Export Flow](#persona-export-flow)
  - [AI Generation Flow](#ai-generation-flow)
- [State Management](#state-management)
- [Authentication Modes](#authentication-modes)
- [Key Design Decisions](#key-design-decisions)

---

## Overview

PersonaFlow is a **single-page application (SPA)** built with React and TypeScript. It has no dedicated API server — all backend functionality is handled through:

- **Supabase** (optional) — managed PostgreSQL database and auth
- **Google Gemini API** (optional) — AI content generation
- **Local storage** — demo mode persistence when Supabase is absent

The application is split into four logical layers: routing, pages, components, and services.

---

## Layer Diagram

```
┌──────────────────────────────────────────────────────┐
│                      Browser                         │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │               React Application                │  │
│  │                                                │  │
│  │  ┌──────────┐   ┌──────────────────────────┐  │  │
│  │  │  Router  │──▶│    Page Components        │  │  │
│  │  │ (Hash)   │   │  Landing / Auth /         │  │  │
│  │  └──────────┘   │  Dashboard / Wizard /     │  │  │
│  │                 │  OrgDetail / Creations /  │  │  │
│  │  ┌──────────┐   │  Settings                 │  │  │
│  │  │  Auth    │   └──────────┬───────────────┘  │  │
│  │  │ Context  │              │ uses              │  │
│  │  └────┬─────┘   ┌──────────▼───────────────┐  │  │
│  │       │         │    UI Components          │  │  │
│  │       │         │  Layout / Button /        │  │  │
│  │       │         │  MagicButton              │  │  │
│  │       │         └──────────┬───────────────┘  │  │
│  │       │                    │ calls             │  │
│  │       │         ┌──────────▼───────────────┐  │  │
│  │       │         │      Service Layer        │  │  │
│  │       │         │  aiService / adapter      │  │  │
│  │       │         │  Service                  │  │  │
│  │       │         └──────────┬───────────────┘  │  │
│  └───────┼──────────────────  │  ────────────────┘  │
│          │                    │                      │
└──────────┼────────────────────┼──────────────────────┘
           │                    │
    ┌──────▼──────┐    ┌────────▼────────────┐
    │  Supabase   │    │  Google Gemini API  │
    │  (Auth +    │    │  (Content           │
    │  Database)  │    │   Generation)       │
    └─────────────┘    └─────────────────────┘
```

---

## Module Breakdown

### Entry Point & Routing

| File | Role |
|---|---|
| `index.tsx` | React DOM render root, wraps `<App />` |
| `App.tsx` | `AuthProvider` + `HashRouter` + route definitions |

All routes use **hash-based routing** (`HashRouter`) which ensures the app works on any static file host without server-side routing configuration.

**Route guards** — the `ProtectedRoute` component in `App.tsx` reads `session` from `AuthContext`. If there is no active session the user is redirected to `/auth`.

### Authentication Layer

| File | Role |
|---|---|
| `contexts/AuthContext.tsx` | React Context that exposes `session`, `signIn`, `signOut` |
| `lib/supabase.ts` | Supabase client creation with graceful demo fallback |

See [Authentication Modes](#authentication-modes) for details on the two runtime modes.

### Page Layer

Each page is a self-contained React component responsible for its own data loading (from `constants.ts` in demo mode or Supabase in production mode) and rendering.

| Page | Route | Purpose |
|---|---|---|
| `Landing` | `/` | Public marketing / hero page |
| `Auth` | `/auth` | Sign-in / sign-up form |
| `Dashboard` | `/dashboard` | Stats and quick-access tiles |
| `Wizard` | `/wizard` | Six-step org profile creation |
| `OrgDetail` | `/org/:id` | Full org view — personas, exports, history |
| `MyCreations` | `/creations` | Filterable list of user profiles |
| `Settings` | `/settings` | User preferences |

### Component Layer

| Component | Location | Purpose |
|---|---|---|
| `Layout` | `components/Layout.tsx` | App shell — sidebar nav, top bar, mobile drawer |
| `Button` | `components/ui/Button.tsx` | Themed button with variant and size props |
| `MagicButton` | `components/ui/MagicButton.tsx` | AI-action button with animated loading state |

### Service Layer

| Service | File | Responsibility |
|---|---|---|
| AI Service | `services/aiService.ts` | Calls Google Gemini to generate structured content |
| Adapter Service | `services/adapterService.ts` | Converts `Organization + Persona` into a platform prompt string |

Services are **pure functions** — they have no internal state and can be called from any page or component.

### Data Layer

| File | Purpose |
|---|---|
| `types.ts` | All TypeScript interfaces (source of truth for the domain model) |
| `constants.ts` | Pre-built mock organizations and personas for demo mode |
| `lib/supabase.ts` | Supabase client for live auth and persistence |
| `migrations.sql` | SQL migration files for the Supabase database schema |

---

## Data Flow

### Organization Creation Flow

```
User fills Wizard steps
        │
        ▼
Wizard.tsx collects form state across 6 steps:
  1. Identity  (name, domain, industry, size, regions)
  2. Brand     (colors, font_vibe)
  3. Services  (service items — can AI-generate)
  4. Team      (team members — can AI-generate)
  5. Compliance(frameworks — can AI-generate)
  6. Voice     (tone, reading_level, banned_phrases)
        │
        ▼
On final submit → save to Supabase (or local state in demo mode)
        │
        ▼
Redirect to /org/:id  →  OrgDetail page
```

### Persona Export Flow

```
User opens OrgDetail  →  selects or creates a Persona
        │
        ▼
User clicks "Export" for a target platform
        │
        ▼
adapterService.generatePersonaExport(org, persona)
        │
        ├── platform === 'Claude'    → generateClaudePrompt()   → XML string
        ├── platform === 'Google'    → generateGooglePrompt()   → Markdown string
        ├── platform === 'Microsoft' → generateMicrosoftPrompt() → Markdown string
        └── platform === 'Custom'   → generateGenericPrompt()  → plain text
        │
        ▼
Display in modal  →  copy to clipboard  /  download as file
```

### AI Generation Flow

```
User clicks "Auto-generate" in Wizard (Services / Team / Compliance step)
        │
        ▼
aiService.generate*(industry, [companyName])
        │
        ▼
Google Gemini API (gemini-3-flash-preview)
  • Structured JSON schema enforced via responseSchema
  • responseMimeType: "application/json"
        │
        ▼
Parse response  →  add IDs  →  update Wizard state
        │
        ▼
(On error) → return hardcoded fallback data
```

---

## State Management

PersonaFlow uses **React built-in state** only — no external state library (Redux, Zustand, etc.).

| Mechanism | Usage |
|---|---|
| `useState` | Local component state (form fields, UI toggles, loaded data) |
| `useContext` | Global auth session via `AuthContext` |
| `useEffect` | Data loading side effects on mount or route param change |

Data is either loaded from `constants.ts` (demo mode) or fetched from Supabase. There is no shared global state beyond authentication.

---

## Authentication Modes

### Live Mode (Supabase)

When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set, the app uses Supabase for:

- Email/password authentication
- Session persistence via Supabase cookies
- Database reads and writes for organizations and personas

### Demo Mode (Local Storage)

When Supabase credentials are absent, `lib/supabase.ts` returns a no-op client and `AuthContext` falls back to local storage. In this mode:

- A guest session is created automatically
- All data comes from the mock records in `constants.ts`
- Changes are kept in component state and lost on page reload

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **Hash Router** | Works on any static host (GitHub Pages, S3, etc.) without server routing configuration |
| **No global state library** | The app's state surface is small enough that React Context + local `useState` is sufficient |
| **Service functions, not hooks** | AI generation and export logic is framework-agnostic pure functions, making them easy to test and reuse |
| **Tailwind via CDN** | Removes a build-step dependency; acceptable for the current app scale |
| **Structured Gemini output** | Using `responseSchema` guarantees valid JSON without post-processing fragility |
| **Demo mode fallback** | Allows the app to be evaluated with zero backend setup |
