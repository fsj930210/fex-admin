<script lang="ts">
  import type { TextareaAutoSize } from '@fex-design/core/textarea/autosize'
  import { syncTextareaAutoSize } from '@fex-design/core/textarea/autosize'
  import { textareaRootClassName } from '@fex-design/styles/textarea'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import TextareaClear from './textarea-clear.svelte'
  import { setTextareaContext, type TextareaChangeReason } from './context'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'> {
    class?: string | undefined
    value?: string | undefined
    defaultValue?: string | undefined
    disabled?: boolean | undefined
    readOnly?: boolean | undefined
    invalid?: boolean | undefined
    status?: 'error' | 'warning' | undefined
    autoSize?: TextareaAutoSize | undefined
    allowClear?: boolean | undefined
    onChange?: ((value: string, meta: { reason: TextareaChangeReason; event?: Event }) => void) | undefined
    onClear?: (() => void) | undefined
    children?: Snippet | undefined
  }

  let {
    class: className,
    value,
    defaultValue = '',
    disabled = false,
    readOnly = false,
    invalid = false,
    status,
    autoSize,
    allowClear = false,
    onChange,
    onClear,
    children,
    ...rest
  }: Props = $props()

  // svelte-ignore state_referenced_locally -- defaultValue initializes uncontrolled state once.
  let internalValue = $state(defaultValue)
  let element = $state<HTMLTextAreaElement | null>(null)
  const currentValue = $derived(value ?? internalValue)
  const resolvedInvalid = $derived(invalid || status === 'error')
  const canClear = $derived(currentValue !== '' && !disabled && !readOnly)

  function syncAutoSize() {
    if (element) syncTextareaAutoSize(element, autoSize)
  }

  setTextareaContext({
    value: () => currentValue,
    disabled: () => disabled,
    readOnly: () => readOnly,
    invalid: () => resolvedInvalid,
    canClear: () => canClear,
    autoSize: () => autoSize,
    setFocusElement: (next) => {
      element = next
      syncAutoSize()
    },
    setValue: (next, reason, event) => {
      if (disabled || readOnly) return
      if (value === undefined) internalValue = next
      onChange?.(next, { reason, ...(event === undefined ? {} : { event }) })
    },
    clear: () => {
      if (!canClear) return
      if (value === undefined) internalValue = ''
      onChange?.('', { reason: 'clear' })
      onClear?.()
      element?.focus()
    },
    syncAutoSize,
  })
</script>

<div
  {...rest}
  data-slot="textarea-root"
  data-disabled={disabled || undefined}
  data-readonly={readOnly || undefined}
  data-invalid={resolvedInvalid || undefined}
  data-status={status}
  class={cn(textareaRootClassName, className)}
>
  {@render children?.()}
  {#if allowClear}<TextareaClear />{/if}
</div>
