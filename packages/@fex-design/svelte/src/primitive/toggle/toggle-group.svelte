<script lang="ts" module>
  import type { ToggleGroupChangeMeta, ToggleGroupValue } from '@fex-design/core/toggle/types'
  import type { ToggleStyleProps } from '@fex-design/styles/toggle'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  export type ToggleGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onchange'> & ToggleStyleProps & { multiple?: boolean; value?: ToggleGroupValue; defaultValue?: ToggleGroupValue; disabled?: boolean; orientation?: 'horizontal' | 'vertical'; spacing?: number; children?: Snippet; onchange?: (value: ToggleGroupValue, meta: ToggleGroupChangeMeta) => void }
</script>
<script lang="ts">
  import { createToggleGroupController } from '@fex-design/core/toggle/create-toggle-group-controller'
  import { getToggleGroupFocusIndex } from '@fex-design/core/toggle/types'
  import { toggleGroupClassName } from '@fex-design/styles/toggle'
  import { cn } from '@fex/utils'
  import { setContext } from 'svelte'
  import { readableCoreStore } from '../../stores/core-store'
  import { toggleGroupContextKey, type ToggleGroupContextValue } from './context'
  let { multiple = false, value, defaultValue, disabled = false, orientation = 'horizontal', spacing = 8, variant = 'default', size = 'default', class: className, onchange, onkeydown, children, ...rest }: ToggleGroupProps = $props()
  const controller = createToggleGroupController({ get multiple() { return multiple }, get value() { return value }, get defaultValue() { return defaultValue }, get disabled() { return disabled }, onChange(next, meta) { onchange?.(next, meta) } })
  const snapshot = readableCoreStore(controller)
  setContext<ToggleGroupContextValue>(toggleGroupContextKey, { disabled: () => disabled, variant: () => variant, size: () => size, isPressed: (item) => { $snapshot; return controller.isPressed(item) }, toggle: (item) => { controller.toggle(item) } })
</script>
<div {...rest} role="group" aria-orientation={orientation} data-slot="toggle-group" data-orientation={orientation} data-variant={variant} data-disabled={disabled ? 'true' : undefined} class={cn(toggleGroupClassName({ orientation, variant, connected: spacing === 0 }), className)} style:gap={spacing > 0 ? `${spacing}px` : undefined} onkeydown={(event) => { onkeydown?.(event); if (event.defaultPrevented) return; const items = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[data-slot=toggle]:not(:disabled)')]; const index = items.indexOf(event.target as HTMLButtonElement); const next = getToggleGroupFocusIndex(event.key, index, items.length, orientation); if (next === undefined || next === index) return; event.preventDefault(); items[next]?.focus() }}>{@render children?.()}</div>
