<div align="center">
  <img width="1200" height="475" alt="PersonaFlow Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  <h1>PersonaFlow</h1>
  <p><strong>Enterprise AI Persona Generator &amp; Management Platform</strong></p>

  <p>
    <img alt="React" src="https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white&style=flat-square" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white&style=flat-square" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white&style=flat-square" />
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square" />
    <img alt="Supabase" src="https://img.shields.io/badge/Supabase-2.98-3FCF8E?logo=supabase&logoColor=white&style=flat-square" />
    <img alt="Gemini AI" src="https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google&logoColor=white&style=flat-square" />
    <img alt="License" src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
  </p>
</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Routes](#routes)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**PersonaFlow** is a modern web application for creating, configuring, and exporting enterprise AI personas. It provides a structured workflow for organizations to define their brand identity and voice, then generate platform-optimised system prompts for AI assistants running on Claude, Google, or Microsoft AI platforms.

Key capabilities at a glance:

| Capability | Description |
|---|---|
| 🏢 **Organization Profiles** | Define company identity, brand colors, voice, team, services, and compliance |
| 🤖 **AI Personas** | Create role-specific AI agents (Sales, Support, IT, Security, and more) |
| ✨ **AI-Assisted Setup** | Auto-generate services, compliance requirements, and team structures via Google Gemini |
| 📤 **Platform Exports** | One-click export to Claude XML, Google Markdown, or Microsoft system prompts |
| 🔄 **Version History** | Track every change to an organization profile with the ability to compare and revert |
| 🔐 **Flexible Auth** | Runs with Supabase authentication or in a fully offline demo mode |

---

## Features

### Organization Management

- **Multi-step Wizard** — six guided steps (Identity → Brand → Services → Team → Compliance → Voice) to build a complete organization profile
- **Brand Configuration** — primary, secondary, and accent colors; font personality
- **Voice Profile** — tone (Professional, Friendly, Technical, Urgent), reading level, and a banned-phrase list
- **Service Catalogue** — named offerings with descriptions and measurable outcomes
- **Team Structure** — define roles, headcounts, and descriptions
- **Compliance Registry** — track frameworks and certification status (Certified, Compliant, In Progress)

### Persona Management

- **Role Archetypes** — Sales, Support, IT, Security, HR, Ops, Finance, Engineering
- **Platform Targeting** — Claude, Google, Microsoft, or a generic Custom format
- **Deployment Mode** — Front-of-House (customer-facing) or Back-of-House (internal)
- **Constraints & Capabilities** — granular control over what the AI can and cannot do
- **Few-Shot Examples** — add Standard and Edge Case input/output pairs to guide the model

### AI-Powered Generation

- Auto-generate service offerings from an industry name using Google Gemini
- Auto-generate compliance frameworks relevant to an industry
- Auto-generate a suggested team structure for an industry
- Structured JSON responses validated against a strict schema

### Export & Adapters

| Platform | Format | Highlights |
|---|---|---|
| **Claude** | XML | `<system_prompt>` structure with tagged sections |
| **Google** | Markdown | Hierarchical headers, bullet lists |
| **Microsoft** | Markdown | Numbered sections, `## System Message` convention |
| **Custom** | Plain text | Minimal, portable format |

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| UI Framework | React | 18.2.0 |
| Language | TypeScript | ~5.8.2 |
| Build Tool | Vite | ^6.2.0 |
| Styling | Tailwind CSS | via CDN |
| Icons | Lucide React | 0.344.0 |
| Routing | React Router DOM | 6.22.3 |
| Auth & Database | Supabase | ^2.98.0 |
| AI | Google Gemini (genai) | latest |
| Class Utilities | clsx + tailwind-merge | 2.1 / 2.2 |

---

## Quick Start

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later (bundled with Node.js)
- A **Google Gemini API key** (optional — app runs in demo mode without it)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Optional | Enables AI-assisted generation. Get a key at [aistudio.google.com](https://aistudio.google.com) |
| `VITE_SUPABASE_URL` | Optional | Supabase project URL. Omit to use demo mode |
| `VITE_SUPABASE_ANON_KEY` | Optional | Supabase anonymous key. Omit to use demo mode |

> **Demo Mode** — If Supabase credentials are absent, the app falls back to local-storage-based auth and pre-loaded mock data. No backend setup required.

### 3. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**.

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server (hot reload on port 3000) |
| `npm run build` | Compile TypeScript and produce an optimised production build in `dist/` |
| `npm run preview` | Serve the production build locally for pre-deployment verification |

---

## Project Structure

```
PersonaFlow/
├── components/                # Reusable UI components
│   ├── ui/
│   │   ├── Button.tsx         # Standard button component
│   │   └── MagicButton.tsx    # AI-action button with animated state
│   └── Layout.tsx             # Sidebar navigation shell
│
├── contexts/
│   └── AuthContext.tsx        # React Context – session management (Supabase + demo)
│
├── lib/
│   ├── supabase.ts            # Supabase client initialisation with demo fallback
│   └── utils.ts               # Shared utilities (cn class helper, etc.)
│
├── pages/
│   ├── Landing.tsx            # Public marketing / landing page
│   ├── Auth.tsx               # Login / sign-up page
│   ├── Dashboard.tsx          # Protected home – stats and recent activity
│   ├── Wizard.tsx             # Multi-step org profile creation wizard
│   ├── OrgDetail.tsx          # Organization detail, persona management, exports
│   ├── MyCreations.tsx        # List of all user-created profiles
│   └── Settings.tsx           # User preferences and settings
│
├── services/
│   ├── aiService.ts           # Google Gemini API – content generation
│   └── adapterService.ts      # Persona export adapters (Claude / Google / Microsoft)
│
├── App.tsx                    # Root component – routing and auth guards
├── types.ts                   # Shared TypeScript interfaces
├── constants.ts               # Mock / seed data for demo mode
├── index.tsx                  # React DOM entry point
├── index.html                 # HTML shell – Tailwind CDN, import map
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript compiler configuration
└── package.json               # Dependencies and npm scripts
```

---

## Configuration

### Environment Variables

Create a `.env.local` file at the project root:

```env
# AI Generation (Google Gemini)
GEMINI_API_KEY=your_gemini_api_key_here

# Authentication & Database (Supabase) — omit both to use demo mode
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Vite Configuration Highlights

- Dev server runs on `0.0.0.0:3000` (accessible from network)
- `process.env.API_KEY` and `process.env.GEMINI_API_KEY` are injected at build time
- Path alias `@/` maps to the project root

---

## Routes

| Path | Access | Description |
|---|---|---|
| `/` | Public | Landing / marketing page |
| `/auth` | Public | Login and sign-up |
| `/dashboard` | Protected | Overview dashboard with stats |
| `/wizard` | Protected | Create a new organization profile |
| `/org/:id` | Protected | Organization detail — personas, exports, history |
| `/org/:id/personas` | Protected | Persona list for an organization |
| `/creations` | Protected | All user-created profiles |
| `/settings` | Protected | User preferences |

Protected routes redirect to `/auth` when no active session is detected.

---

## Documentation

Detailed documentation lives in the [`docs/`](./docs/) directory:

| Document | Description |
|---|---|
| [Architecture](./docs/ARCHITECTURE.md) | System design, component relationships, and data flow |
| [Data Models](./docs/DATA_MODELS.md) | TypeScript interface reference for all domain entities |
| [API Reference](./docs/API.md) | AI service and adapter service function documentation |
| [Components](./docs/COMPONENTS.md) | UI component catalogue with props and usage examples |
| [Development Guide](./docs/DEVELOPMENT.md) | Local setup, coding conventions, and workflow |
| [Deployment Guide](./docs/DEPLOYMENT.md) | Environment configuration and production deployment |
| [Contributing](./docs/CONTRIBUTING.md) | How to report issues, propose features, and submit pull requests |

---

## Contributing

Contributions are welcome! Please read the [Contributing Guide](./docs/CONTRIBUTING.md) before opening a pull request.

Short summary:

1. Fork the repository and create a feature branch off `main`
2. Make your changes following the coding conventions in the [Development Guide](./docs/DEVELOPMENT.md)
3. Open a pull request with a clear title and description

---

## License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

<div align="center">
  <sub>Built with ❤️ using React, TypeScript, and Google Gemini AI</sub>
</div>
