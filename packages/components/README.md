# Components Packages

The component packages share one package per framework. Each package exposes APIs by capability category instead of mixing root-level component shortcuts.

## Import Paths

Use explicit category subpaths:

```ts
import { Button } from '@fex/components-react/ui/button'
import { Button as PrimitiveButton } from '@fex/components-react/primitive/button'
import { LoadingIcon } from '@fex/components-react/icon/loading'
import { useCoreStore } from '@fex/components-react/hooks/use-core-store'
```

The same layout applies to the other framework packages:

- `@fex/components-vue/primitive/*`
- `@fex/components-vue/ui/*`
- `@fex/components-vue/icon/*`
- `@fex/components-vue/composables/*`
- `@fex/components-solid/primitive/*`
- `@fex/components-solid/ui/*`
- `@fex/components-solid/icon/*`
- `@fex/components-solid/primitives/*`
- `@fex/components-svelte/primitive/*`
- `@fex/components-svelte/ui/*`
- `@fex/components-svelte/icon/*`
- `@fex/components-svelte/stores/*`
- `@fex/components-angular/primitive/*`
- `@fex/components-angular/ui/*`
- `@fex/components-angular/icon/*`
- `@fex/components-angular/signals/*`

Do not import package internals such as `src/**`, `dist/**`, or removed root shortcuts like `@fex/components-react/button`.

## Core Store Adapters

Complex cross-framework primitives should keep framework-free state in `@fex/components-core` and bridge `getSnapshot + subscribe` through the framework helper:

| Framework | Adapter |
| --- | --- |
| React | `@fex/components-react/hooks/use-core-store` |
| Vue | `@fex/components-vue/composables/use-core-store` |
| Solid | `@fex/components-solid/primitives/create-core-store-signal` |
| Svelte | `@fex/components-svelte/stores/core-store` |
| Angular | `@fex/components-angular/signals/core-store-signal` |

Adapters only synchronize snapshots into the framework runtime. Business actions still belong on explicit controllers, such as `open`, `close`, `select`, or `moveFocus`; do not turn component logic into a generic event bus.
