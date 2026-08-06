import {
  syncTextareaAutoSize,
  type TextareaAutoSize,
} from '@fex-design/core/textarea/autosize'
import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import type { TextareaContextValue } from './context'

export interface UseTextareaOptions {
  value?: MaybeRefOrGetter<string | undefined>
  defaultValue?: MaybeRefOrGetter<string | undefined>
  disabled?: MaybeRefOrGetter<boolean | undefined>
  readOnly?: MaybeRefOrGetter<boolean | undefined>
  invalid?: MaybeRefOrGetter<boolean | undefined>
  autoSize?: MaybeRefOrGetter<TextareaAutoSize | undefined>
  onChange?:
    | ((value: string, meta: { reason: 'input' | 'clear'; event?: Event }) => void)
    | undefined
  onClear?: ((meta: { reason: 'clear' }) => void) | undefined
}

export function useTextarea(options: UseTextareaOptions = {}): TextareaContextValue {
  const uncontrolledValue = ref(toValue(options.defaultValue) ?? '')
  const focusElement = ref<HTMLTextAreaElement | null>(null)
  const disabled = computed(() => toValue(options.disabled) ?? false)
  const readOnly = computed(() => toValue(options.readOnly) ?? false)
  const invalid = computed(() => toValue(options.invalid) ?? false)
  const autoSize = computed(() => toValue(options.autoSize))
  const value = computed(() => toValue(options.value) ?? uncontrolledValue.value)
  const canClear = computed(() => value.value !== '' && !disabled.value && !readOnly.value)

  const syncAutoSize = () => {
    if (focusElement.value) syncTextareaAutoSize(focusElement.value, autoSize.value)
  }
  const setValue = (nextValue: string, reason: 'input' | 'clear', event?: Event) => {
    if (disabled.value || readOnly.value) return
    if (toValue(options.value) === undefined) uncontrolledValue.value = nextValue
    options.onChange?.(nextValue, { reason, ...(event === undefined ? {} : { event }) })
  }
  const clear = () => {
    if (!canClear.value) return
    setValue('', 'clear')
    options.onClear?.({ reason: 'clear' })
    focusElement.value?.focus()
  }

  return {
    value,
    disabled,
    readOnly,
    invalid,
    canClear,
    autoSize,
    setValue,
    clear,
    focus: () => focusElement.value?.focus(),
    setFocusElement: (element) => {
      focusElement.value = element
      syncAutoSize()
    },
    syncAutoSize,
  }
}
