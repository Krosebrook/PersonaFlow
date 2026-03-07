# Contributing to PersonaFlow

Thank you for considering a contribution to PersonaFlow! This document explains how to report issues, propose features, and submit pull requests.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Submitting a Pull Request](#submitting-a-pull-request)
- [Development Workflow](#development-workflow)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Checklist](#pull-request-checklist)
- [Getting Help](#getting-help)

---

## Code of Conduct

Please be respectful and constructive in all interactions. We welcome contributors of all backgrounds and experience levels.

---

## How to Contribute

### Reporting Bugs

Before opening a bug report, please:

1. Search existing [issues](https://github.com/Krosebrook/PersonaFlow/issues) to see if the bug has already been reported.
2. Check whether the problem reproduces in [demo mode](./DEVELOPMENT.md#demo-mode-vs-live-mode) (no Supabase credentials needed).

When filing a bug report, include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs. actual behaviour
- Browser name and version
- Whether you are in demo mode or live mode
- Any relevant console errors (open DevTools → Console)

### Suggesting Features

Open a [GitHub issue](https://github.com/Krosebrook/PersonaFlow/issues) with the label `enhancement`. Include:

- The problem you are trying to solve
- Your proposed solution or feature
- Any alternative approaches you considered

### Submitting a Pull Request

1. **Fork** the repository and create a new branch from `main`:

   ```bash
   git checkout -b feature/my-feature-name
   # or
   git checkout -b fix/issue-123-description
   ```

2. Follow the [Development Guide](./DEVELOPMENT.md) to set up your environment.

3. Make your changes, keeping them **focused and minimal**. One PR per logical change.

4. Verify your changes:
   - Run `npx tsc --noEmit` — fix any TypeScript errors.
   - Run `npm run build` — confirm the production build succeeds.
   - Test in both [demo mode and live mode](./DEVELOPMENT.md#demo-mode-vs-live-mode) where applicable.

5. Update documentation if your change affects any public interfaces, configuration, or behaviour described in the `docs/` directory or `README.md`.

6. Push your branch and open a pull request against `main`.

---

## Development Workflow

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Make changes (hot-reload active)

# 4. Type-check
npx tsc --noEmit

# 5. Build
npm run build
```

See the full [Development Guide](./DEVELOPMENT.md) for conventions, project structure, and tips.

---

## Commit Message Guidelines

Use the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <short summary>
```

**Types**

| Type | Use When |
|---|---|
| `feat` | Adding a new feature |
| `fix` | Fixing a bug |
| `docs` | Documentation changes only |
| `style` | Formatting, missing semicolons — no logic change |
| `refactor` | Code restructuring with no behaviour change |
| `chore` | Build configuration, dependency updates |

**Examples**

```
feat(wizard): add voice-profile step to org wizard
fix(adapter): handle empty compliance array in Claude export
docs(readme): update environment variable table
chore(deps): bump @google/genai to 0.7.0
```

---

## Pull Request Checklist

Before requesting a review, confirm:

- [ ] `npx tsc --noEmit` passes with no errors
- [ ] `npm run build` succeeds
- [ ] Feature works in demo mode (no Supabase required)
- [ ] New UI follows Tailwind styling conventions
- [ ] Any new types are added to `types.ts`
- [ ] Any new service functions follow the error-handling pattern in `aiService.ts`
- [ ] `docs/` or `README.md` updated if public-facing behaviour changed
- [ ] PR title follows Conventional Commits format
- [ ] PR description explains *what* changed and *why*

---

## Getting Help

- Open a [GitHub Discussion](https://github.com/Krosebrook/PersonaFlow/discussions) for questions, ideas, or general conversation.
- For bugs and feature requests, use [GitHub Issues](https://github.com/Krosebrook/PersonaFlow/issues).
