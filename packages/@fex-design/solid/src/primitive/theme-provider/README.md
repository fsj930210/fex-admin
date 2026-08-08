# ThemeProvider

Solid primitive adapter for the framework-neutral theme runtime exposed through `@fex-design/core/theme/*`. It bridges the core controller into Solid context and accessors while keeping UI composition outside the primitive.

## Import

```tsx
import { ThemeProvider } from '@fex-design/solid/primitive/theme-provider'
import { useTheme } from '@fex-design/solid/primitive/theme-provider/use-theme'
```

## Basic Usage

```tsx
<ThemeProvider storageKey="fex-theme" enableSystem defaultTheme="system">
  <App />
</ThemeProvider>
```

## Local Scopes

```tsx
<ThemeProvider scope="local" forcedTheme="dark" class="bg-background text-foreground">
  <PreviewPanel />
</ThemeProvider>
```

`scope="local"` renders a wrapper and applies the resolved theme to that wrapper, so light and dark regions can render at the same time.

## Inherited Scope

```tsx
<ThemeProvider scope="inherit">
  <NestedPrimitive />
</ThemeProvider>
```

`scope="inherit"` reuses the parent context and does not create a controller or DOM scope.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `scope` | `'root' \\| 'local' \\| 'inherit'` | `'root'` | Theme target: document root, local wrapper, or parent context. |
| `storageKey` | `string` | - | localStorage key for persisted theme state. |
| `themes` | `string[]` | `['light', 'dark']` | Selectable theme names. |
| `defaultTheme` | `string` | `'light'` | Initial theme when no valid stored theme exists. |
| `forcedTheme` | `string` | - | Highest-priority override; disables `setTheme`. |
| `enableSystem` | `boolean` | `false` | Adds `system` and resolves it from `prefers-color-scheme`. |
| `enableColorScheme` | `boolean` | `false` | Syncs CSS `color-scheme`. |
| `attribute` | `'class' \\| \`data-${string}\`` | `'class'` | Attribute used to expose the active theme. |
| `class` | `string` | - | Class applied to the local wrapper. |
| `as` | `keyof JSX.IntrinsicElements` | `'div'` | Local wrapper element. |
| `colorSchemeMap` | `Record<string, 'light' \\| 'dark'>` | - | Custom theme to color-scheme mapping. |

## useTheme

`useTheme()` returns `controller` and `snapshot`. Read `snapshot()` for current fields and call `controller.setTheme(nextTheme)` to update user selection.

## Controlled Behavior

Use `forcedTheme` to lock the effective theme. Otherwise the core controller owns user selection and storage synchronization.

## Notes

- Root providers cannot be nested.
- `scope="root"` requires `storageKey` unless `forcedTheme` is provided.
- `scope="inherit"` requires a parent provider and cannot receive `forcedTheme`.

