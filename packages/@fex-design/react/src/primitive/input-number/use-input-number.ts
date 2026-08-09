import {
  defaultInputNumberFormatter,
  defaultInputNumberParser,
  isInputNumberOutOfRange,
  normalizeInputNumber,
  stepInputNumber,
} from '@fex-design/core/input-number/value'
import type {
  InputNumberConstraints,
  InputNumberFormatter,
  InputNumberParser,
} from '@fex-design/core/input-number/types'
import { useState } from 'react'
import { useControllableState } from '../../hooks/use-controllable-state'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import useUpdateEffect from '../../hooks/use-update-effect'

export interface UseInputNumberOptions extends InputNumberConstraints {
  controlled?: boolean | undefined
  value?: number | undefined
  defaultValue?: number | undefined
  parser?: InputNumberParser | undefined
  formatter?: InputNumberFormatter | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
}

export function useInputNumber(options: UseInputNumberOptions = {}) {
  const {
    value,
    defaultValue,
    parser = defaultInputNumberParser,
    formatter = defaultInputNumberFormatter,
    disabled = false,
    readOnly = false,
  } = options
  const constraints: InputNumberConstraints = {
    min: options.min,
    max: options.max,
    step: options.step,
    precision: options.precision,
  }
  const [currentValue, setCurrentValue] = useControllableState<number | undefined>(
    { value, defaultValue },
    { trigger: 'onChange', isControlled: () => options.controlled ?? value !== undefined },
  )
  const format = useMemoizedFn(
    (nextValue: number | undefined, userTyping: boolean, input: string) =>
      formatter(nextValue, { userTyping, input }),
  )
  const [draft, setDraft] = useState(() => format(currentValue, false, ''))
  const [userTyping, setUserTyping] = useState(false)

  // The editable text buffer follows external controlled values only while the user is not typing.
  useUpdateEffect(() => {
    if (!userTyping) setDraft(format(currentValue, false, draft))
  }, [currentValue, format, userTyping])

  const parse = useMemoizedFn((text: string) => parser(text))
  const setDraftValue = useMemoizedFn((text: string) => {
    setUserTyping(true)
    setDraft(text)
    const nextValue = parse(text)
    if (text.trim() === '' || nextValue !== undefined) setCurrentValue(nextValue)
    return nextValue
  })
  const commit = useMemoizedFn((nextValue: number | undefined) => {
    const normalized =
      nextValue === undefined ? undefined : normalizeInputNumber(nextValue, constraints)
    setCurrentValue(normalized)
    setUserTyping(false)
    setDraft(format(normalized, false, draft))
    return normalized
  })
  const stepBy = useMemoizedFn((direction: 'increment' | 'decrement') =>
    commit(stepInputNumber(parse(draft) ?? currentValue, direction, constraints)),
  )
  const clear = useMemoizedFn(() => commit(undefined))

  return {
    value: currentValue,
    draft,
    userTyping,
    disabled,
    readOnly,
    outOfRange: isInputNumberOutOfRange(currentValue, constraints),
    canIncrement:
      !disabled &&
      !readOnly &&
      (options.max === undefined || currentValue === undefined || currentValue < options.max),
    canDecrement:
      !disabled &&
      !readOnly &&
      (options.min === undefined || currentValue === undefined || currentValue > options.min),
    setDraftValue,
    commit,
    increment: () => stepBy('increment'),
    decrement: () => stepBy('decrement'),
    clear,
    parseDraft: () => parse(draft),
  }
}
