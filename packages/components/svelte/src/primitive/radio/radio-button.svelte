<script lang="ts">
  import { radioButtonClassName, type RadioButtonStyleProps } from '@fex/components-styles/radio'
  import { cn } from '@fex/utils'
  import { getContext, type Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { radioContextKey, type RadioContextValue, type RadioValue } from './context'

  interface RadioButtonProps extends Omit<HTMLButtonAttributes, 'children' | 'type' | 'value' | 'onchange'> {
    value: RadioValue
    disabled?: boolean | null | undefined
    size?: RadioButtonStyleProps['size']
    children?: Snippet
  }

  let {
    value,
    disabled,
    size = 'default',
    children,
    class: className,
    onclick,
    ...rest
  }: RadioButtonProps = $props()

  const context = getContext<RadioContextValue>(radioContextKey)
  if (context === undefined) {
    throw new Error('RadioButton must be used inside RadioGroup.')
  }

  const checked = $derived(context.value() === value)
  const currentDisabled = $derived(context.disabled() || disabled === true)
</script>

<button
  {...rest}
  type="button"
  role="radio"
  disabled={currentDisabled}
  aria-checked={checked}
  data-state={checked ? 'checked' : 'unchecked'}
  data-disabled={currentDisabled ? 'true' : undefined}
  data-value={value}
  class={cn(radioButtonClassName({ size }), className)}
  onclick={(event) => {
    onclick?.(event)
    if (event.defaultPrevented || currentDisabled) return
    context.select(value)
  }}
>
  {@render children?.()}
</button>
