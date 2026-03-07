# Deployment Guide

This guide covers how to build PersonaFlow for production and deploy it to common hosting platforms.

## Table of Contents

- [Environment Variables](#environment-variables)
- [Production Build](#production-build)
- [Deployment Options](#deployment-options)
  - [Vercel](#vercel)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
  - [Docker / Self-hosted](#docker--self-hosted)
- [Supabase Setup](#supabase-setup)
- [Security Considerations](#security-considerations)

---

## Environment Variables

Configure these variables in your hosting platform's environment settings **before** running a production build.

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Optional | Google Gemini API key. Required for AI-assisted generation features. Get one at [aistudio.google.com](https://aistudio.google.com) |
| `VITE_SUPABASE_URL` | Optional | Your Supabase project URL, e.g. `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Optional | Supabase anonymous (public) key |

> **Important:** Variables prefixed with `VITE_` are embedded into the client bundle at build time. Do **not** place secrets that must remain server-side in `VITE_` variables. The Supabase anon key is designed to be public.

> The `GEMINI_API_KEY` is **not** prefixed with `VITE_` — it is injected by Vite's `define` configuration and **is** embedded in the bundle. Treat it as a client-visible key and use Gemini's API key restrictions (HTTP referrers) to limit its scope.

---

## Production Build

```bash
# Install dependencies
npm install

# Compile and bundle for production
npm run build
```

The output is written to the `dist/` directory. This directory contains all static assets and can be served by any static file server.

To verify the production build locally:

```bash
npm run preview
# Serves dist/ at http://localhost:4173
```

---

## Deployment Options

### Vercel

Vercel is the recommended platform for zero-config React deployments.

1. Push your fork to GitHub.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Add environment variables in **Settings → Environment Variables**.
4. Deploy. Vercel detects Vite automatically and runs `npm run build`.

**No additional configuration files are needed.**

### Netlify

1. Push your fork to GitHub.
2. Create a new site in Netlify and connect the repository.
3. Set the build command to `npm run build` and the publish directory to `dist`.
4. Add environment variables under **Site settings → Environment variables**.
5. Deploy.

Optionally, add a `netlify.toml` at the project root for consistent configuration across team members:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

> The redirect rule is required because PersonaFlow uses hash-based routing. Without it, direct URL access to `/dashboard` would return a 404 on Netlify.

### GitHub Pages

Because PersonaFlow uses `HashRouter`, it is compatible with GitHub Pages without any server-side routing configuration.

1. Build the project:

   ```bash
   npm run build
   ```

2. Deploy the `dist/` directory to the `gh-pages` branch. Using the `gh-pages` npm package:

   ```bash
   npm install --save-dev gh-pages
   npx gh-pages -d dist
   ```

3. In your repository's **Settings → Pages**, set the source to the `gh-pages` branch.

> **Note:** Environment variables must be baked in at build time. Set them in your local `.env.local` or in a GitHub Actions secret before running the build step.

### Docker / Self-hosted

A minimal Docker setup to serve the static build:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx config for hash-router SPAs
RUN printf 'server {\n\
  listen 80;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
docker build -t personaflow .
docker run -p 8080:80 personaflow
```

Pass environment variables at build time using `--build-arg`:

```dockerfile
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY
```

```bash
docker build --build-arg GEMINI_API_KEY=your_key -t personaflow .
```

---

## Supabase Setup

If you want to enable live authentication and persistent storage:

1. Create a free project at [supabase.com](https://supabase.com).

2. Apply the database schema using the migration file:

   ```bash
   # From the Supabase dashboard → SQL Editor, paste the contents of:
   cat migrations.sql
   ```

3. Copy your project URL and anon key from **Project Settings → API**.

4. Set them as environment variables:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

5. In the Supabase dashboard, configure **Authentication → Providers**. The app uses email/password by default.

---

## Security Considerations

| Concern | Mitigation |
|---|---|
| **Gemini API key exposure** | Restrict the key to your production domain in the Google Cloud Console under **Credentials → API key restrictions** |
| **Supabase anon key** | The anon key is designed to be public. Access to data is controlled by Supabase Row Level Security (RLS) policies in `migrations.sql` |
| **No server-side secrets** | PersonaFlow is a client-only SPA. Any secret that must remain private cannot be stored here — use Supabase Edge Functions or a separate API server for server-side logic |
| **User data** | If deploying for real users, ensure your Supabase project is in a GDPR-compliant region and that your privacy policy is up to date |
