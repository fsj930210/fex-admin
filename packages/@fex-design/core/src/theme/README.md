# Theme Core

The `@fex-design/core/theme/*` file-level exports contain the framework-neutral theme runtime used by all ThemeProvider primitives.

## Responsibilities

- Resolve selected, system, default, stored, and forced themes.
- Keep `forcedTheme` as the highest-priority resolved theme.
- Apply theme names to a DOM element through `class` or `data-*` attributes.
- Persist user-selected themes when a storage key is provided.
- Expose a small controller contract with `getSnapshot`, `subscribe`, `setTheme`, `setOptions`, and `applyTo`.

## Layering

Core does not know about React, Vue, Solid, Svelte, or Angular. Framework packages create primitive adapters around `createThemeController` and are responsible for their own context, lifecycle, and DOM refs.
