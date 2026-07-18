<script lang="ts">
  import { inputRootClassName } from '@fex/components-styles/input'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { setInputContext, type InputChangeReason } from './context'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> { class?: string; value?: string; defaultValue?: string; disabled?: boolean; readOnly?: boolean; invalid?: boolean; onValueChange?: (value: string, meta: { reason: InputChangeReason; event?: Event }) => void; onClear?: () => void; children?: Snippet }
  let { class: className, value, defaultValue = '', disabled = false, readOnly = false, invalid = false, onValueChange, onClear, children, ...rest }: Props = $props()
  let internalValue = $state(defaultValue)
  let element = $state<HTMLElement | null>(null)
  const currentValue = $derived(value ?? internalValue)
  const canClear = $derived(currentValue !== '' && !disabled && !readOnly)
  setInputContext({ value: () => currentValue, disabled: () => disabled, readOnly: () => readOnly, invalid: () => invalid, canClear: () => canClear, setFocusElement: (next) => { element = next }, setValue: (next, reason, event) => { if (disabled || readOnly) return; if (value === undefined) internalValue = next; onValueChange?.(next, { reason, ...(event === undefined ? {} : { event }) }) }, clear: () => { if (!canClear) return; if (value === undefined) internalValue = ''; onValueChange?.('', { reason: 'clear' }); onClear?.(); element?.focus() } })
</script>
<div {...rest} data-slot="input-root" data-disabled={disabled || undefined} data-readonly={readOnly || undefined} data-invalid={invalid || undefined} class={cn(inputRootClassName, className)}>{@render children?.()}</div>
