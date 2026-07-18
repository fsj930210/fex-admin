import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import type { InputContextValue } from './input-context'

export interface UseInputOptions {
  value?: MaybeRefOrGetter<string | undefined>
  defaultValue?: MaybeRefOrGetter<string | undefined>
  disabled?: MaybeRefOrGetter<boolean | undefined>
  readOnly?: MaybeRefOrGetter<boolean | undefined>
  invalid?: MaybeRefOrGetter<boolean | undefined>
  onValueChange?: ((value: string, meta: { reason: 'input' | 'clear'; event?: Event }) => void) | undefined
  onClear?: ((meta: { reason: 'clear' }) => void) | undefined
}

export function useInput(options: UseInputOptions = {}): InputContextValue {
  const uncontrolledValue = ref(toValue(options.defaultValue) ?? '')
  const focusElement = ref<HTMLElement | null>(null)
  const disabled = computed(() => toValue(options.disabled) ?? false)
  const readOnly = computed(() => toValue(options.readOnly) ?? false)
  const invalid = computed(() => toValue(options.invalid) ?? false)
  const value = computed(() => toValue(options.value) ?? uncontrolledValue.value)
  const canClear = computed(() => value.value !== '' && !disabled.value && !readOnly.value)
  const setValue = (nextValue: string, reason: 'input' | 'clear', event?: Event) => {
    if (disabled.value || readOnly.value) return
    if (toValue(options.value) === undefined) uncontrolledValue.value = nextValue
    options.onValueChange?.(nextValue, { reason, ...(event === undefined ? {} : { event }) })
  }
  const clear = () => {
    if (!canClear.value) return
    setValue('', 'clear')
    options.onClear?.({ reason: 'clear' })
    focusElement.value?.focus()
  }
  return { value, disabled, readOnly, invalid, canClear, setValue, clear, focus: () => focusElement.value?.focus(), setFocusElement: (element) => { focusElement.value = element } }
}
