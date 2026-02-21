# Add Light/Dark Theme Toggle

## Context

The app is a minimal React + TypeScript + Vite project with no component or style architecture in place yet. The [cssLayer skill](../.github/skills/cssLayer/SKILL.md) and [serviceLayer skill](../.github/skills/serviceLayer/SKILL.md) define conventions we must follow. Current theme support is purely CSS `prefers-color-scheme` in `src/index.css`; we need an explicit user-controlled toggle that persists.

---

## 1. Bootstrap the CSS architecture

Per the cssLayer skill, create the `style/` folder tree and move existing resets/variables out of `src/index.css`:

```
src/style/
  main.css            <-- imports all sub-files, imported in main.tsx
  setup/
    var.css            <-- CSS custom properties (colors, spacing, etc.)
    typography.css     <-- font-family, sizes, weights
  basics/
    reset.css          <-- universal box-sizing / margin reset (from current index.css)
    helper.css         <-- utility classes (visually-hidden, etc.)
    layout.css         <-- body/root layout (flex centering from current index.css)
    base.css           <-- base element styles
    button.css         <-- shared button styles
  cmps/
    ThemeToggle.css    <-- toggle button styles
```

`src/index.css` will be replaced by importing `style/main.css` in `src/main.tsx`.

### Theme variables in `var.css`

Define two sets of CSS variables scoped by a `data-theme` attribute on `<html>`:

```css
:root,
:root[data-theme="dark"] {
  --clr-bg: #111;
  --clr-text: rgba(255, 255, 255, 0.87);
  /* ... more semantic tokens */
}

:root[data-theme="light"] {
  --clr-bg: #fafafa;
  --clr-text: #1a1a1a;
}
```

The `prefers-color-scheme` media query will remain as a fallback when no `data-theme` is set (system default).

---

## 2. Create the theme service

Per the serviceLayer skill, add a pure-function service at `src/services/theme.service.ts`:

- `getTheme(): 'light' | 'dark'` -- reads from `localStorage` key `theme`, falls back to `matchMedia('(prefers-color-scheme: dark)')`.
- `setTheme(theme: 'light' | 'dark'): void` -- writes to `localStorage` and sets `document.documentElement.dataset.theme`.
- `toggleTheme(): 'light' | 'dark'` -- flips current theme and returns the new value.

Types will live in `src/types/theme.types.ts`:

```typescript
export type Theme = 'light' | 'dark'
```

---

## 3. Create the ThemeToggle component

A small button component at `src/components/ThemeToggle.tsx`:

- Uses a Lucide icon (`Sun` / `Moon`) based on current theme.
- Calls `toggleTheme()` from the service on click (handler named `onToggleTheme` per coding conventions).
- Manages theme state with `useState`, initialized from `getTheme()`.
- On mount, calls `setTheme()` to apply the persisted preference to the DOM.

Styles in `src/style/cmps/ThemeToggle.css` (imported via `main.css`).

---

## 4. Integrate into App

Update `src/App.tsx`:

- Remove all inline `style` props (per cssLayer: no inline styles).
- Render `<ThemeToggle />` (e.g., positioned top-right).
- Layout/styling handled purely via CSS classes.

Update `src/main.tsx`:

- Replace `import './index.css'` with `import './style/main.css'`.

---

## 5. Install Lucide

Add `lucide-react` as a dependency (per cssLayer skill: use Lucide icons).

---

## Questions

1. **Default theme** -- Should the default be dark (current behavior), or should it follow the system preference when the user hasn't explicitly toggled? dark
2. **Toggle placement** -- Top-right corner of the page, or somewhere else? Top-right corner
