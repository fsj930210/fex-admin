import { createMemo, createSignal, type Accessor } from 'solid-js'

export type InputChangeReason = 'input' | 'clear'
export interface CreateInputOptions {
  value?: Accessor<string | undefined>
  defaultValue?: string | undefined
  disabled?: Accessor<boolean | undefined>
  readOnly?: Accessor<boolean | undefined>
  invalid?: Accessor<boolean | undefined>
  onValueChange?: ((value: string, meta: { reason: InputChangeReason; event?: InputEvent }) => void) | undefined
  onClear?: (() => void) | undefined
}
export function createInput(options: CreateInputOptions = {}) {
  const [internalValue, setInternalValue] = createSignal(options.defaultValue ?? '')
  let focusElement: HTMLElement | undefined
  const value = createMemo(() => options.value?.() ?? internalValue())
  const disabled = createMemo(() => options.disabled?.() ?? false)
  const readOnly = createMemo(() => options.readOnly?.() ?? false)
  const invalid = createMemo(() => options.invalid?.() ?? false)
  const canClear = createMemo(() => value() !== '' && !disabled() && !readOnly())
  function setValue(nextValue: string, reason: InputChangeReason, event?: InputEvent) {
    if (disabled() || readOnly()) return
    if (options.value?.() === undefined) setInternalValue(nextValue)
    options.onValueChange?.(nextValue, { reason, ...(event === undefined ? {} : { event }) })
  }
  function clear() {
    if (!canClear()) return
    setValue('', 'clear')
    options.onClear?.()
    focusElement?.focus()
  }
  return { value, disabled, readOnly, invalid, canClear, setValue, clear, focus: () => focusElement?.focus(), setFocusElement: (element: HTMLElement) => { focusElement = element } }
}
