# ThemeProvider

Vue primitive adapter for the framework-neutral theme runtime exposed through `@fex-design/core/theme/*`. It provides provider context, DOM theme application, storage sync, and system theme resolution without rendering business UI.

## Import

```vue
<script setup lang="ts">
import ThemeProvider from '@fex-design/vue/primitive/theme-provider'
import { useTheme } from '@fex-design/vue/primitive/theme-provider/use-theme'
</script>
```

## Basic Usage

```vue
<ThemeProvider storage-key="fex-theme" enable-system default-theme="system">
  <App />
</ThemeProvider>
```

## Local Scopes

```vue
<ThemeProvider scope="local" forced-theme="dark" class="bg-background text-foreground">
  <PreviewPanel />
</ThemeProvider>
```

`scope="local"` renders the configured wrapper and applies the resolved theme there, allowing multiple independent theme regions on the same page.

## Inherited Scope

```vue
<ThemeProvider scope="inherit">
  <NestedPrimitive />
</ThemeProvider>
```

`scope="inherit"` reuses the nearest parent context and does not create a controller or DOM scope.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `scope` | `'root' \\| 'local' \\| 'inherit'` | `'root'` | Theme target: document root, local wrapper, or parent context. |
| `storageKey` | `string` | - | localStorage key for persisted theme state. |
| `themes` | `string[]` | `['light', 'dark']` | Selectable theme names. |
| `defaultTheme` | `string` | `'light'` | Initial theme when no valid stored theme exists. |
| `forcedTheme` | `string` | - | Highest-priority override; disables local theme writes. |
| `enableSystem` | `boolean` | `false` | Adds `system` and resolves it from `prefers-color-scheme`. |
| `enableColorScheme` | `boolean` | `false` | Syncs CSS `color-scheme`. |
| `attribute` | `'class' \\| \`data-${string}\`` | `'class'` | Attribute used to expose the active theme. |
| `className` / `class` | `string` | - | Class applied to the local wrapper. |
| `as` | `keyof HTMLElementTagNameMap` | `'div'` | Local wrapper element. |
| `colorSchemeMap` | `Record<string, 'light' \\| 'dark'>` | - | Custom theme to color-scheme mapping. |

## useTheme

`useTheme()` returns the primitive context: `controller` and reactive `snapshot`. Read `snapshot.value` for `theme`, `resolvedTheme`, `forcedTheme`, `themes`, and `systemTheme`; call `controller.setTheme(nextTheme)` to update user selection.

## Controlled Behavior

Use `forcedTheme` when a parent must lock the effective theme. Without `forcedTheme`, user selection is managed by the core controller and optionally persisted by `storageKey`.

## Notes

- Root providers cannot be nested.
- `scope="root"` requires `storageKey` unless `forcedTheme` is provided.
- `scope="inherit"` requires a parent provider and cannot receive `forcedTheme`.

