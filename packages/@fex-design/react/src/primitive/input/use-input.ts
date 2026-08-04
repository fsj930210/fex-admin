import { useRef, type ChangeEvent, type RefCallback } from 'react'
import { useControllableState } from '../../hooks/use-controllable-state'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'

export type InputChangeReason = 'input' | 'clear'

export interface InputChangeMeta {
  reason: InputChangeReason
  event?: ChangeEvent<HTMLInputElement>
}

export interface UseInputOptions {
  value?: string | undefined
  defaultValue?: string | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  invalid?: boolean | undefined
  onValueChange?: ((value: string, meta: InputChangeMeta) => void) | undefined
  onClear?: ((meta: InputChangeMeta) => void) | undefined
}

export interface InputController {
  value: string
  disabled: boolean
  readOnly: boolean
  invalid: boolean
  canClear: boolean
  focusRef: RefCallback<HTMLElement>
  setValue: (value: string, meta: InputChangeMeta) => void
  clear: () => void
  focus: () => void
}

export function useInput({
  value,
  defaultValue = '',
  disabled = false,
  readOnly = false,
  invalid = false,
  onValueChange,
  onClear,
}: UseInputOptions = {}): InputController {
  const elementRef = useRef<HTMLElement | null>(null)
  const [currentValue, setCurrentValue] = useControllableState<string>(
    { value, defaultValue, onValueChange },
    { trigger: 'onValueChange' },
  )

  const focusRef = useMemoizedFn((element: HTMLElement | null) => {
    elementRef.current = element
  })

  const focus = useMemoizedFn(() => {
    elementRef.current?.focus()
  })

  const setValue = useMemoizedFn((nextValue: string, meta: InputChangeMeta) => {
    if (disabled || readOnly) return
    setCurrentValue(nextValue, meta)
  })

  const clear = useMemoizedFn(() => {
    if (currentValue === '' || disabled || readOnly) return
    const meta: InputChangeMeta = { reason: 'clear' }
    setCurrentValue('', meta)
    onClear?.(meta)
    focus()
  })

  return {
    value: currentValue,
    disabled,
    readOnly,
    invalid,
    canClear: currentValue !== '' && !disabled && !readOnly,
    focusRef,
    setValue,
    clear,
    focus,
  }
}
