<script lang="ts">
  import { createExpansionController } from '@fex-design/core/expansion/create-expansion-controller'
  import type { ExpansionChangeMeta, ExpansionKey } from '@fex-design/core/expansion/types'
  import { collapseRootClassName } from '@fex-design/styles/collapse'
  import { cn } from '@fex/utils'
  import { setContext } from 'svelte'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { readableCoreStore } from '../../stores/core-store'
  import { collapseContextKey, type CollapseContext, type CollapseSize, type CollapseVariant } from './context'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'children' | 'onchange'> {
    expandedKeys?: readonly ExpansionKey[]
    defaultExpandedKeys?: readonly ExpansionKey[]
    disabledKeys?: readonly ExpansionKey[]
    multiple?: boolean
    collapsible?: boolean
    variant?: CollapseVariant
    size?: CollapseSize
    class?: string
    onchange?: (keys: ExpansionKey[], meta: ExpansionChangeMeta) => void
    children?: Snippet
  }

  let {
    expandedKeys,
    defaultExpandedKeys,
    disabledKeys,
    multiple,
    collapsible,
    variant = 'outlined',
    size = 'md',
    class: className,
    onchange,
    children,
    ...rest
  }: Props = $props()

  const controller = createExpansionController({
    get expandedKeys() {
      return expandedKeys
    },
    get defaultExpandedKeys() {
      return defaultExpandedKeys
    },
    get disabledKeys() {
      return disabledKeys
    },
    get multiple() {
      return multiple
    },
    get collapsible() {
      return collapsible
    },
    onChange(keys, meta) {
      onchange?.(keys, meta)
    },
  })
  const snapshot = readableCoreStore(controller)
  $effect(() => {
    expandedKeys
    disabledKeys
    multiple
    collapsible
    controller.refresh()
  })
  const baseId = crypto.randomUUID()
  const rootClassName = $derived(cn(collapseRootClassName({ variant, size }), className))

  const context: CollapseContext = {
    baseId,
    snapshot,
    variant: () => variant,
    size: () => size,
    expand: controller.expand,
    collapse: controller.collapse,
    toggle: controller.toggle,
    setExpandedKeys: controller.setExpandedKeys,
    clear: controller.clear,
    getExpandedKeys: () => controller.getSnapshot().expandedKeys,
    isExpanded: controller.isExpanded,
    isDisabled: controller.isDisabled,
  }
  setContext(collapseContextKey, context)

  export function expand(key: ExpansionKey) {
    controller.expand(key)
  }
  export function collapse(key: ExpansionKey) {
    controller.collapse(key)
  }
  export function toggle(key: ExpansionKey) {
    controller.toggle(key)
  }
  export function setExpandedKeys(keys: readonly ExpansionKey[]) {
    controller.setExpandedKeys(keys)
  }
  export function clear() {
    controller.clear()
  }
  export function getExpandedKeys() {
    return controller.getSnapshot().expandedKeys
  }
  export const isExpanded = controller.isExpanded
  export const isDisabled = controller.isDisabled
</script>

<div
  {...rest}
  data-slot="collapse"
  data-variant={variant}
  class={rootClassName}
>
  {@render children?.()}
</div>
