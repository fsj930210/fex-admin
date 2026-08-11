<script lang="ts">
  import type { InputOTPAccept, InputOTPTransform } from '@fex-design/core/input-otp/types'
  import { inputOTPInputClassName } from '@fex-design/styles/input-otp'
  import { cn } from '@fex/utils'
  import { onMount } from 'svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { getInputOTPContext } from './context'

  interface Props extends Omit<HTMLInputAttributes, 'value' | 'maxlength'> {
    index: number
    maxLength?: number
    autoAdvance?: boolean
    transform?: InputOTPTransform
    accept?: InputOTPAccept
  }

  let {
    index,
    maxLength,
    autoAdvance = true,
    transform,
    accept,
    disabled = false,
    readonly = false,
    class: className,
    oninput,
    onpaste,
    onkeydown,
    ...rest
  }: Props = $props()
  const context = getInputOTPContext('InputOTPInput')
  let element: HTMLInputElement | undefined
  const currentValue = $derived(context.snapshot().value[index] ?? '')
  const currentDisabled = $derived(context.snapshot().disabled || disabled)
  const currentReadOnly = $derived(context.snapshot().readOnly || readonly)
  const segment = $derived(context.snapshot().segments.find((item) => item.index === index))
  const config = $derived({ index, maxLength, autoAdvance, transform, accept, disabled, readOnly: readonly })

  onMount(() => {
    const unregister = context.controller.registerSegment(config)
    context.registerInput(index, element ?? null)
    return () => {
      unregister()
      context.registerInput(index, null)
    }
  })

  $effect(() => context.controller.updateSegment(config))

  function applyText(
    text: string,
    reason: 'input' | 'paste' | 'delete' | 'composition',
    selection = { start: 0, end: currentValue.length },
  ) {
    const result = context.controller.applyInput({ index, text, selection, reason })
    if (result.focusIndex !== undefined) context.focusInput(result.focusIndex, result.cursor)
    return result
  }
</script>

<input
  {...rest}
  bind:this={element}
  type="text"
  value={currentValue}
  disabled={currentDisabled}
  readonly={currentReadOnly}
  aria-invalid={context.snapshot().invalid || undefined}
  data-slot="input-otp-input"
  data-index={index}
  data-filled={currentValue.length > 0 || undefined}
  data-complete={segment?.complete || undefined}
  class={cn(inputOTPInputClassName, className)}
  oninput={(event) => {
    oninput?.(event)
    if (event.defaultPrevented) return
    const native = event as InputEvent
    const result = applyText(event.currentTarget.value, native.inputType?.startsWith('delete') ? 'delete' : 'input')
    if (!result.accepted) event.currentTarget.value = currentValue
  }}
  onpaste={(event) => {
    onpaste?.(event)
    if (event.defaultPrevented || currentDisabled || currentReadOnly) return
    event.preventDefault()
    applyText(event.clipboardData?.getData('text') ?? '', 'paste', {
      start: event.currentTarget.selectionStart ?? 0,
      end: event.currentTarget.selectionEnd ?? 0,
    })
  }}
  onkeydown={(event) => {
    onkeydown?.(event)
    if (event.defaultPrevented) return
    const start = event.currentTarget.selectionStart ?? 0
    const end = event.currentTarget.selectionEnd ?? start
    if (event.key === 'Backspace' && currentValue === '' && start === 0 && end === 0) {
      event.preventDefault(); context.focusInput(index - 1, 'end')
    } else if (event.key === 'ArrowLeft' && start === 0 && end === 0) {
      event.preventDefault(); context.focusInput(index - 1, 'end')
    } else if (event.key === 'ArrowRight' && start === currentValue.length && end === start) {
      event.preventDefault(); context.focusInput(index + 1, 'start')
    }
  }}
/>
