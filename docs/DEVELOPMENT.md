# Development Guide

This guide covers everything you need to set up your development environment, understand the project conventions, and contribute code effectively.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Running the App](#running-the-app)
- [Project Conventions](#project-conventions)
  - [File Naming](#file-naming)
  - [Component Conventions](#component-conventions)
  - [TypeScript Conventions](#typescript-conventions)
  - [Styling Conventions](#styling-conventions)
  - [Import Order](#import-order)
- [Adding a New Page](#adding-a-new-page)
- [Adding a New Component](#adding-a-new-component)
- [Working with the AI Service](#working-with-the-ai-service)
- [Working with the Adapter Service](#working-with-the-adapter-service)
- [Demo Mode vs. Live Mode](#demo-mode-vs-live-mode)
- [TypeScript Configuration](#typescript-configuration)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Minimum Version | Install |
|---|---|---|
| Node.js | 18.x | [nodejs.org](https://nodejs.org) |
| npm | 9.x | Bundled with Node.js |
| Git | 2.x | [git-scm.com](https://git-scm.com) |

An optional but recommended VS Code extension: **ESLint**, **Tailwind CSS IntelliSense**, **Prettier**.

---

## Environment Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Krosebrook/PersonaFlow.git
   cd PersonaFlow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create the environment file**

   ```bash
   cp .env.local.example .env.local
   ```

   Then edit `.env.local`:

   ```env
   # Required for AI generation features
   GEMINI_API_KEY=your_key_here

   # Optional — omit to run in demo mode
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

   > **Note:** `.env.local` is listed in `.gitignore` and will never be committed.

---

## Running the App

```bash
# Development server (hot-reload on http://localhost:3000)
npm run dev

# Type-check without emitting files
npx tsc --noEmit

# Production build (outputs to dist/)
npm run build

# Preview the production build locally
npm run preview
```

---

## Project Conventions

### File Naming

| Item | Convention | Example |
|---|---|---|
| React components | `PascalCase.tsx` | `OrgDetail.tsx` |
| Utility / service files | `camelCase.ts` | `aiService.ts` |
| Type definition files | `camelCase.ts` | `types.ts` |
| Documentation | `SCREAMING_SNAKE_CASE.md` | `DATA_MODELS.md` |

### Component Conventions

- All components are **function components** using arrow function syntax.
- Props interfaces are defined immediately above the component function.
- Named exports are preferred over default exports for components (exception: `App.tsx`).

```tsx
// ✅ Preferred
interface Props {
  title: string;
  onClose: () => void;
}

export const MyComponent: React.FC<Props> = ({ title, onClose }) => {
  return <div>{title}</div>;
};
```

### TypeScript Conventions

- Use `interface` for object shapes and component props.
- Use `type` for union types, aliases, and computed types.
- Avoid `any` — use `unknown` and narrow the type where necessary.
- Keep all domain interfaces in `types.ts`. Only add component-local types to the component file.

### Styling Conventions

- All styling is done with **Tailwind CSS utility classes**.
- Use the `cn()` helper from `lib/utils.ts` to conditionally merge classes:

  ```tsx
  import { cn } from '../lib/utils';

  <div className={cn('base-class', isActive && 'active-class', className)} />
  ```

- Avoid inline `style` props except for dynamic values that cannot be expressed as Tailwind classes (e.g. dynamic hex colors from brand settings).
- Prefer Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) over media query hooks.

### Import Order

Organise imports in the following order, with a blank line between each group:

1. React and React ecosystem (`react`, `react-router-dom`)
2. Third-party libraries (`lucide-react`, `@supabase/supabase-js`)
3. Internal services (`../services/aiService`)
4. Internal components (`../components/ui/Button`)
5. Internal contexts and hooks (`../contexts/AuthContext`)
6. Types and constants (`../types`, `../constants`)

```tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PlusIcon } from 'lucide-react';

import { generateServices } from '../services/aiService';

import { Button } from '../components/ui/Button';

import { useAuth } from '../contexts/AuthContext';

import type { Organization } from '../types';
import { MOCK_ORGS } from '../constants';
```

---

## Adding a New Page

1. Create `pages/MyNewPage.tsx`:

   ```tsx
   import React from 'react';

   export const MyNewPage: React.FC = () => {
     return (
       <div className="p-6">
         <h1 className="text-2xl font-bold text-white">My New Page</h1>
       </div>
     );
   };
   ```

2. Import and register the route in `App.tsx`:

   ```tsx
   import { MyNewPage } from './pages/MyNewPage';

   // Inside AppRoutes:
   <Route path="/my-new-page" element={
     <DashboardLayoutWrapper>
       <MyNewPage />
     </DashboardLayoutWrapper>
   } />
   ```

3. If the page should appear in the sidebar, add an entry to the nav items array in `components/Layout.tsx`.

---

## Adding a New Component

1. Decide where the component lives:
   - **Reusable generic UI** → `components/ui/`
   - **Layout / structural** → `components/`
   - **Page-specific and unlikely to be reused** → keep it in the page file or create a co-located file (e.g. `pages/OrgDetail/PersonaCard.tsx`)

2. Create the file and export the component by name.

3. Import it where needed.

---

## Working with the AI Service

The three generation functions in `services/aiService.ts` follow a consistent pattern:

```ts
// 1. Get or create the Gemini client
const ai = getAiClient();

// 2. Call generateContent with a structured schema
const response = await ai.models.generateContent({
  model: MODEL_NAME,
  contents: `<your prompt>`,
  config: {
    responseMimeType: "application/json",
    responseSchema: { /* JSON Schema */ }
  }
});

// 3. Parse and hydrate with IDs
const data = JSON.parse(cleanJson(response.text));
return data.map((item, i) => ({ ...item, id: `prefix-${Date.now()}-${i}` }));
```

To add a new generation function:

1. Define the JSON schema for the desired response shape.
2. Write the prompt string.
3. Follow the `try/catch` pattern and provide meaningful fallback data.
4. Export the function.

---

## Working with the Adapter Service

To add a new platform adapter:

1. Add the platform value to the `Persona.platform` union in `types.ts`:

   ```ts
   platform: 'Claude' | 'Google' | 'Microsoft' | 'Custom' | 'YourPlatform';
   ```

2. Write a generator function in `services/adapterService.ts`:

   ```ts
   const generateYourPlatformPrompt = (org: Organization, persona: Persona): string => {
     return `Your formatted prompt here`;
   };
   ```

3. Add a branch in `generatePersonaExport`:

   ```ts
   if (persona.platform === 'YourPlatform') return generateYourPlatformPrompt(org, persona);
   ```

---

## Demo Mode vs. Live Mode

| Aspect | Demo Mode | Live Mode |
|---|---|---|
| Trigger | Supabase env vars absent | Both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set |
| Auth | Local storage mock session | Supabase email/password |
| Data | `constants.ts` mock records | Supabase database |
| Persistence | None (lost on reload) | Full persistence |

When developing new features, test in both modes to ensure the feature works without a backend.

---

## TypeScript Configuration

Key `tsconfig.json` settings:

| Setting | Value | Effect |
|---|---|---|
| `target` | `ES2022` | Modern JS features available |
| `module` | `ESNext` | ESM imports/exports |
| `jsx` | `react-jsx` | No need to import React in every file |
| `strict` | `true` | Full strict mode |
| `noEmit` | `true` | TypeScript is type-checking only; Vite handles transpilation |
| `paths` | `{ "@/*": ["./*"] }` | Import alias `@/` maps to project root |

---

## Troubleshooting

### AI generation buttons do nothing / show fallback data

- Check the browser console for `"AI Generation Error"` messages.
- Verify `GEMINI_API_KEY` is set correctly in `.env.local`.
- Confirm the Vite dev server was restarted after editing `.env.local`.

### Auth redirects to `/auth` unexpectedly

- In demo mode this should not happen — a mock session is created automatically on load.
- In live mode, check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct.
- Open DevTools → Application → Local Storage and check for any stale session data.

### TypeScript errors after pulling latest

- Run `npm install` to pick up any new dependencies.
- Run `npx tsc --noEmit` to see the full error list.

### Port 3000 already in use

```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
```
