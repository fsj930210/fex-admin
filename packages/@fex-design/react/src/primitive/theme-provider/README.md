# ThemeProvider

React primitive adapter for the framework-neutral theme runtime exposed through `@fex-design/core/theme/*`. It only manages theme scope, context, DOM attributes, storage, and system color-scheme resolution; it does not include switchers, menus, or business UI.

## Import

```tsx
import { ThemeProvider } from '@fex-design/react/primitive/theme-provider'
import { useTheme } from '@fex-design/react/primitive/theme-provider/use-theme'
```

## Basic Usage

```tsx
<ThemeProvider storageKey="fex-theme" enableSystem defaultTheme="system">
  <App />
</ThemeProvider>
```

## Local Scopes

```tsx
<div className="grid grid-cols-2 gap-4">
  <ThemeProvider scope="local" forcedTheme="light" className="bg-background text-foreground">
    <Preview />
  </ThemeProvider>
  <ThemeProvider scope="local" forcedTheme="dark" className="bg-background text-foreground">
    <Preview />
  </ThemeProvider>
</div>
```

`scope="local"` renders a wrapper element and applies the resolved theme to that wrapper, so multiple themes can exist at the same time.

## Inherited Scope

```tsx
<ThemeProvider scope="inherit">
  <NestedPrimitive />
</ThemeProvider>
```

`scope="inherit"` reuses the nearest parent provider context and does not apply a new DOM theme scope.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | - | Rendered content. |
| `scope` | `'root' \\| 'local' \\| 'inherit'` | `'root'` | Theme target: document root, local wrapper, or parent context. |
| `storageKey` | `string` | - | localStorage key for persisted theme state. |
| `themes` | `string[]` | `['light', 'dark']` | Selectable theme names and class names removed before applying the next theme. |
| `defaultTheme` | `string` | `'light'` | Initial theme when no valid stored theme exists. |
| `forcedTheme` | `string` | - | Highest-priority theme override. While set, `setTheme` is ignored. |
| `enableSystem` | `boolean` | `false` | Adds `system` and resolves it from `prefers-color-scheme`. |
| `enableColorScheme` | `boolean` | `false` | Syncs CSS `color-scheme` from the resolved theme. |
| `attribute` | `'class' \\| \`data-${string}\`` | `'class'` | Attribute used to expose the active theme. |
| `className` | `string` | - | Class applied to the local wrapper only. |
| `as` | `keyof HTMLElementTagNameMap` | `'div'` | Local wrapper element. |
| `colorSchemeMap` | `Record<string, 'light' \\| 'dark'>` | - | Maps custom theme names to browser color schemes. |

## useTheme

`useTheme()` returns `theme`, `resolvedTheme`, `forcedTheme`, `themes`, `systemTheme`, and `setTheme`.

## Controlled Behavior

This primitive is controller-driven rather than fully controlled by a `theme` prop. Use `forcedTheme` when the parent must lock the effective theme. Use `setTheme` for user selection; it is a no-op while `forcedTheme` is active.

## Notes

- Root providers cannot be nested.
- `scope="root"` requires `storageKey` unless `forcedTheme` is provided.
- `scope="inherit"` requires a parent provider and cannot receive `forcedTheme`.
- Custom themes require matching CSS selectors such as `.tech-blue` or `[data-theme='tech-blue']`.

