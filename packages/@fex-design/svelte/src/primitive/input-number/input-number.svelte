<script lang="ts">
  import type { InputNumberFormatter, InputNumberParser } from '@fex-design/core/input-number/types'
  import { defaultInputNumberFormatter, defaultInputNumberParser, isInputNumberOutOfRange, normalizeInputNumber, stepInputNumber } from '@fex-design/core/input-number/value'
  import { inputNumberActionsClassName, inputNumberDecrementClassName, inputNumberIncrementClassName } from '@fex-design/styles/input-number'
  import type { Snippet } from 'svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'
  import MinusIcon from '../../icon/minus.svelte'
  import PlusIcon from '../../icon/plus.svelte'
  import InputRoot from '../input/input-root.svelte'
  import InputControl from '../input/input-control.svelte'
  import InputClear from '../input/input-clear.svelte'
  import InputPrefix from '../input/input-prefix.svelte'
  import InputSuffix from '../input/input-suffix.svelte'

  type ChangeEvent = InputEvent | FocusEvent | MouseEvent | KeyboardEvent
  interface Props extends Omit<HTMLInputAttributes, 'value' | 'class' | 'onchange' | 'oninput'> {
    value?: number
    defaultValue?: number
    min?: number
    max?: number
    step?: number
    precision?: number
    parser?: InputNumberParser
    formatter?: InputNumberFormatter
    clearable?: boolean
    invalid?: boolean
    status?: 'error' | 'warning'
    class?: string
    prefix?: Snippet
    suffix?: Snippet
    onChange?: (event: ChangeEvent, value: number | undefined) => void
  }
  let componentProps: Props = $props()
  const controlled = Object.prototype.hasOwnProperty.call(componentProps, 'value')
  let { value, defaultValue, min, max, step = 1, precision, parser = defaultInputNumberParser, formatter = defaultInputNumberFormatter, clearable = false, invalid = false, status, class: className, prefix, suffix, disabled = false, readonly = false, onChange, onblur, onkeydown, ...rest }: Props = componentProps
  let internalValue = $state(defaultValue)
  let draft = $state(formatter(value ?? internalValue, { userTyping: false, input: '' }))
  const currentValue = $derived(controlled ? value : internalValue)
  const constraints = $derived({ min, max, step, precision })
  const outOfRange = $derived(isInputNumberOutOfRange(currentValue, constraints))
  const canIncrement = $derived(!disabled && !readonly && (max === undefined || currentValue === undefined || currentValue < max))
  const canDecrement = $derived(!disabled && !readonly && (min === undefined || currentValue === undefined || currentValue > min))
  // This effect is the framework boundary that mirrors an external controlled value into the text buffer.
  $effect(() => { if (controlled) draft = formatter(value, { userTyping: false, input: value === undefined ? '' : String(value) }) })

  function setValue(next: number | undefined) { if (!controlled) internalValue = next }
  function input(text: string, event?: Event) {
    draft = text
    const next = parser(text)
    if (text.trim() === '' || next !== undefined) {
      setValue(next)
      if (event) onChange?.(event as InputEvent, next)
    }
  }
  function commit(next: number | undefined) {
    const normalized = next === undefined ? undefined : normalizeInputNumber(next, constraints)
    setValue(normalized)
    draft = formatter(normalized, { userTyping: false, input: draft })
    return normalized
  }
  function stepBy(event: MouseEvent | KeyboardEvent, direction: 'increment' | 'decrement') {
    const next = commit(stepInputNumber(parser(draft) ?? currentValue, direction, constraints))
    onChange?.(event, next)
  }
</script>

<InputRoot value={draft} {disabled} readOnly={readonly} {invalid} {status} class={className} data-out-of-range={outOfRange || undefined} onValueChange={(text, meta) => input(text, meta.event)}>
  {#if prefix}<InputPrefix>{@render prefix()}</InputPrefix>{/if}
  <InputControl
    {...rest}
    type="text"
    role="spinbutton"
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={currentValue}
    onblur={(event) => {
      onblur?.(event)
      if (event.defaultPrevented) return
      const before = currentValue
      const next = commit(parser(draft) ?? before)
      if (next !== before) onChange?.(event, next)
    }}
    onkeydown={(event) => {
      onkeydown?.(event)
      if (event.defaultPrevented || disabled || readonly) return
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault()
        stepBy(event, event.key === 'ArrowUp' ? 'increment' : 'decrement')
      }
    }}
  />
  {#if clearable}<InputClear onclick={(event) => onChange?.(event, commit(undefined))} />{/if}
  {#if suffix}
    <InputSuffix>{@render suffix()}</InputSuffix>
  {:else}
    <InputSuffix class={inputNumberActionsClassName}>
      <button type="button" aria-label="Increase value" data-action="increment" disabled={!canIncrement} class={inputNumberIncrementClassName} onpointerdown={(event) => event.preventDefault()} onclick={(event) => stepBy(event, 'increment')}><PlusIcon /></button>
      <button type="button" aria-label="Decrease value" data-action="decrement" disabled={!canDecrement} class={inputNumberDecrementClassName} onpointerdown={(event) => event.preventDefault()} onclick={(event) => stepBy(event, 'decrement')}><MinusIcon /></button>
    </InputSuffix>
  {/if}
</InputRoot>
