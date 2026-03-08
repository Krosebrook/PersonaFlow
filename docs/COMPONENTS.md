# Component Reference

This document catalogues all reusable UI components in PersonaFlow with their props, variants, and usage examples.

## Table of Contents

- [Layout](#layout)
- [Button](#button)
- [MagicButton](#magicbutton)

---

## Layout

**File:** `components/Layout.tsx`

The application shell. Renders the sidebar navigation and wraps page content. Used by `DashboardLayoutWrapper` in `App.tsx` to surround every protected route.

### Features

- Collapsible sidebar with icon + label navigation items
- Active route highlighting via `useLocation()`
- Mobile-responsive — collapses to a hamburger-menu drawer on small screens
- User avatar and sign-out control at the bottom of the sidebar

### Usage

```tsx
// Layout is applied automatically via DashboardLayoutWrapper in App.tsx.
// You do not need to wrap individual pages manually.

<Layout>
  <YourPageComponent />
</Layout>
```

### Navigation Items

The sidebar items are defined internally and map to the following routes:

| Label | Icon | Route |
|---|---|---|
| Dashboard | `LayoutDashboard` | `/dashboard` |
| New Profile | `Plus` | `/wizard` |
| My Creations | `FolderOpen` | `/creations` |
| Settings | `Settings` | `/settings` |

---

## Button

**File:** `components/ui/Button.tsx`

A standard themed button component wrapping the native HTML `<button>` element. Supports multiple visual variants and sizes, and forwards all standard button props.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `className` | `string` | `''` | Additional Tailwind classes |
| `...rest` | `ButtonHTMLAttributes` | — | All native button attributes (`onClick`, `disabled`, `type`, etc.) |

### Variants

| Variant | Appearance | Use Case |
|---|---|---|
| `primary` | Solid indigo/violet background | Primary actions (Save, Continue, Create) |
| `secondary` | Outlined, transparent background | Secondary actions (Cancel, Back) |
| `ghost` | No border or background, text only | Tertiary or icon-adjacent actions |
| `danger` | Solid red background | Destructive actions (Delete, Revoke) |

### Sizes

| Size | Height | Padding | Font Size |
|---|---|---|---|
| `sm` | 32 px | `px-3 py-1.5` | `text-sm` |
| `md` | 40 px | `px-4 py-2` | `text-sm` |
| `lg` | 48 px | `px-6 py-3` | `text-base` |

### Usage Examples

```tsx
import { Button } from '../components/ui/Button';

// Primary action
<Button onClick={handleSave}>Save Profile</Button>

// Secondary action
<Button variant="secondary" onClick={handleCancel}>Cancel</Button>

// Small ghost button
<Button variant="ghost" size="sm">View Details</Button>

// Disabled destructive action
<Button variant="danger" disabled>Delete Organization</Button>

// With a native type attribute (for forms)
<Button type="submit">Submit</Button>
```

---

## MagicButton

**File:** `components/ui/MagicButton.tsx`

A specialised button for AI-triggered actions. Renders an animated sparkle/loading state while an async operation is in progress, and returns to its default label once complete.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `onClick` | `() => Promise<void>` | — | Async handler — the button manages its own loading state |
| `label` | `string` | — | Default button label |
| `loadingLabel` | `string` | `'Generating…'` | Label shown during the async operation |
| `className` | `string` | `''` | Additional Tailwind classes |
| `disabled` | `boolean` | `false` | Prevents interaction |

### States

| State | Appearance |
|---|---|
| Idle | Gradient border, sparkle icon, `label` text |
| Loading | Spinner animation, `loadingLabel` text, pointer-events disabled |
| Disabled | Reduced opacity, no hover effect |

### Usage Example

```tsx
import { MagicButton } from '../components/ui/MagicButton';
import { generateServices } from '../services/aiService';

<MagicButton
  label="Auto-generate Services"
  loadingLabel="Generating Services…"
  onClick={async () => {
    const services = await generateServices(industry, companyName);
    setServices(services);
  }}
/>
```

### Notes

- The `onClick` handler **must** return a `Promise`. The button sets `isLoading = true` before calling the handler and `isLoading = false` in a `finally` block.
- Do not wrap the handler in `try/catch` inside the parent component — let the button manage the loading state. Handle errors (toast, inline message) after the `await` returns.
