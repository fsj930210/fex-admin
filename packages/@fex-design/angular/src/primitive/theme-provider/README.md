# ThemeProvider

Angular primitive adapter for the framework-neutral theme runtime exposed through `@fex-design/core/theme/*`. The component is standalone and applies the resolved theme to `document.documentElement` for root scope or to its host element for local scope.

## Import

```ts
import { ThemeProvider } from '@fex-design/angular/primitive/theme-provider'
```

## Basic Usage

```html
<fex-theme-provider storageKey="fex-theme" [enableSystem]="true" defaultTheme="system">
  <app-root />
</fex-theme-provider>
```

## Local Scopes

```html
<fex-theme-provider scope="local" forcedTheme="dark" class="bg-background text-foreground">
  <app-preview-panel />
</fex-theme-provider>
```

`scope="local"` applies the resolved theme to the component host, so several theme scopes can exist at the same time.

## Inherited Scope

```html
<fex-theme-provider scope="inherit">
  <app-nested-primitive />
</fex-theme-provider>
```

`scope="inherit"` reuses the nearest parent provider controller and does not apply a new DOM scope.

## Inputs

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `scope` | `'root' \\| 'local' \\| 'inherit'` | `'root'` | Theme target: document root, local host, or parent context. |
| `storageKey` | `string` | - | localStorage key for persisted theme state. |
| `themes` | `string[]` | `['light', 'dark']` | Selectable theme names. |
| `defaultTheme` | `string` | `'light'` | Initial theme when no valid stored theme exists. |
| `forcedTheme` | `string` | - | Highest-priority override; disables `setTheme`. |
| `enableSystem` | `boolean` | `false` | Adds `system` and resolves it from `prefers-color-scheme`. |
| `enableColorScheme` | `boolean` | `false` | Syncs CSS `color-scheme`. |
| `attribute` | `'class' \\| \`data-${string}\`` | `'class'` | Attribute used to expose the active theme. |
| `colorSchemeMap` | `Record<string, 'light' \\| 'dark'>` | - | Custom theme to color-scheme mapping. |

## Public Members

| Member | Description |
| --- | --- |
| `snapshot` | Angular signal for the active snapshot. |
| `currentSnapshot` | Current snapshot getter. |
| `setTheme(theme)` | Updates user selection unless `forcedTheme` is active. |

## Controlled Behavior

Use `forcedTheme` to lock the effective theme. Otherwise the core controller owns user selection and storage synchronization.

## Notes

- Root providers cannot be nested.
- `scope="root"` requires `storageKey` unless `forcedTheme` is provided.
- `scope="inherit"` requires a parent provider and cannot receive `forcedTheme`.

