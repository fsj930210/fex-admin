<script lang="ts">
  import { inputRootClassName } from '@fex-design/styles/input'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { setInputContext, type InputChangeReason } from './context'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'> { class?: string | undefined; value?: string | undefined; defaultValue?: string | undefined; disabled?: boolean | undefined; readOnly?: boolean | undefined; invalid?: boolean | undefined; status?: 'error' | 'warning' | undefined; action?: ((element: HTMLElement) => { destroy?: () => void } | void) | undefined; onValueChange?: ((value: string, meta: { reason: InputChangeReason; event?: Event }) => void) | undefined; onClear?: (() => void) | undefined; children?: Snippet | undefined }
  let { class: className, value, defaultValue = '', disabled = false, readOnly = false, invalid = false, status, action, onValueChange, onClear, children, ...rest }: Props = $props()
  // svelte-ignore state_referenced_locally -- defaultValue initializes uncontrolled state once.
  let internalValue = $state(defaultValue)
  let element = $state<HTMLElement | null>(null)
  const currentValue = $derived(value ?? internalValue)
  const canClear = $derived(currentValue !== '' && !disabled && !readOnly)
  function runAction(node: HTMLElement) {
    return action?.(node)
  }
  setInputContext({ value: () => currentValue, disabled: () => disabled, readOnly: () => readOnly, invalid: () => invalid || status === 'error', canClear: () => canClear, setFocusElement: (next) => { element = next }, setValue: (next, reason, event) => { if (disabled || readOnly) return; if (value === undefined) internalValue = next; onValueChange?.(next, { reason, ...(event === undefined ? {} : { event }) }) }, clear: () => { if (!canClear) return; if (value === undefined) internalValue = ''; onValueChange?.('', { reason: 'clear' }); onClear?.(); element?.focus() } })
</script>
<div use:runAction {...rest} data-slot="input-root" data-disabled={disabled || undefined} data-readonly={readOnly || undefined} data-invalid={(invalid || status === 'error') || undefined} data-status={status} class={cn(inputRootClassName, className)}>{@render children?.()}</div>
