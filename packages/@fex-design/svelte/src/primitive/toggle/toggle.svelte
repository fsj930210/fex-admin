<script lang="ts">
  import { toggleClassName, type ToggleStyleProps } from '@fex-design/styles/toggle'
  import { cn } from '@fex/utils'
  import { getContext, type Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import Button from '../button/button.svelte'
  import { toggleGroupContextKey, type ToggleGroupContextValue } from './context'
  interface Props extends Omit<HTMLButtonAttributes, 'children' | 'onchange' | 'value'>, ToggleStyleProps { pressed?: boolean; defaultPressed?: boolean; value?: string; children?: Snippet; onchange?: (pressed: boolean) => void }
  let { pressed, defaultPressed = false, value, disabled, variant, size, class: className, onclick, onchange, children, ...rest }: Props = $props()
  const group = getContext<ToggleGroupContextValue | undefined>(toggleGroupContextKey)
  let internalPressed = $state(defaultPressed)
  const inGroup = $derived(group !== undefined && value !== undefined)
  const currentPressed = $derived(inGroup ? group!.isPressed(value!) : (pressed ?? internalPressed))
  const currentDisabled = $derived(disabled === true || (group?.disabled() ?? false))
</script>
<Button {...rest} disabled={currentDisabled} aria-pressed={currentPressed} data-slot="toggle" data-state={currentPressed ? 'on' : 'off'} data-value={value} class={cn(toggleClassName({ variant: variant ?? group?.variant(), size: size ?? group?.size() }), className)} onclick={(event) => { onclick?.(event); if (event.defaultPrevented || currentDisabled) return; if (inGroup) group!.toggle(value!); else { const next = !currentPressed; internalPressed = next; onchange?.(next) } }}>{@render children?.()}</Button>
