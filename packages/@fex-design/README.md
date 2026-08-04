# Components Packages

The component packages share one package per framework. Each package exposes APIs by capability category instead of mixing root-level component shortcuts.

## Import Paths

Use explicit category subpaths:

```ts
import { Button } from '@fex-design/react/ui/button'
import { Button as PrimitiveButton } from '@fex-design/react/primitive/button'
import { LoadingIcon } from '@fex-design/react/icon/loading'
import { useCoreStore } from '@fex-design/react/hooks/use-core-store'
```

The same layout applies to the other framework packages:

- `@fex-design/vue/primitive/*`
- `@fex-design/vue/ui/*`
- `@fex-design/vue/icon/*`
- `@fex-design/vue/composables/*`
- `@fex-design/solid/primitive/*`
- `@fex-design/solid/ui/*`
- `@fex-design/solid/icon/*`
- `@fex-design/solid/primitives/*`
- `@fex-design/svelte/primitive/*`
- `@fex-design/svelte/ui/*`
- `@fex-design/svelte/icon/*`
- `@fex-design/svelte/stores/*`
- `@fex-design/angular/primitive/*`
- `@fex-design/angular/ui/*`
- `@fex-design/angular/icon/*`
- `@fex-design/angular/signals/*`

Do not import package internals such as `src/**`, `dist/**`, or removed root shortcuts like `@fex-design/react/button`.

## Core Store Adapters

Complex cross-framework primitives should keep framework-free state in `@fex-design/core` and bridge `getSnapshot + subscribe` through the framework helper:

| Framework | Adapter                                                     |
| --------- | ----------------------------------------------------------- |
| React     | `@fex-design/react/hooks/use-core-store`                |
| Vue       | `@fex-design/vue/composables/use-core-store`            |
| Solid     | `@fex-design/solid/primitives/create-core-store-signal` |
| Svelte    | `@fex-design/svelte/stores/core-store`                  |
| Angular   | `@fex-design/angular/signals/core-store-signal`         |

Adapters only synchronize snapshots into the framework runtime. Business actions still belong on explicit controllers, such as `open`, `close`, `select`, or `moveFocus`; do not turn component logic into a generic event bus.
