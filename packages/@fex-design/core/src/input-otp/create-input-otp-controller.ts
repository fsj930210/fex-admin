import { createStore } from '../store/create-store'
import { isInputOTPComplete } from './completion'
import type {
  InputOTPActionResult,
  InputOTPController,
  InputOTPInputAction,
  InputOTPRootOptions,
  InputOTPSegmentConfig,
  InputOTPSegmentSnapshot,
  InputOTPValue,
} from './types'
import { inputOTPValuesEqual, normalizeInputOTPValue } from './value'

function sortSegments(segments: Iterable<InputOTPSegmentConfig>): InputOTPSegmentConfig[] {
  return [...segments].sort((left, right) => left.index - right.index)
}

function changedIndexes(previous: InputOTPValue, next: InputOTPValue): number[] {
  const count = Math.max(previous.length, next.length)
  return Array.from({ length: count }, (_, index) => index).filter(
    (index) => previous[index] !== next[index],
  )
}

export function createInputOTPController(initialOptions: InputOTPRootOptions = {}): InputOTPController {
  let options = initialOptions
  let uncontrolledValue = [...(initialOptions.defaultValue ?? [])]
  let previousComplete = false
  const segments = new Map<number, InputOTPSegmentConfig>()

  const resolveSegments = (value: InputOTPValue): InputOTPSegmentSnapshot[] =>
    sortSegments(segments.values()).map((segment) => ({
      ...segment,
      autoAdvance: segment.autoAdvance ?? true,
      complete:
        segment.maxLength !== undefined &&
        segment.maxLength > 0 &&
        (value[segment.index]?.length ?? 0) === segment.maxLength,
    }))

  const resolveSnapshot = () => {
    const currentSegments = sortSegments(segments.values())
    const value = normalizeInputOTPValue(
      options.value ?? uncontrolledValue,
      currentSegments.length,
    )
    const segmentSnapshots = resolveSegments(value)
    const complete = options.isComplete
      ? options.isComplete(value, segmentSnapshots)
      : isInputOTPComplete(value, segmentSnapshots)
    return {
      value,
      segments: segmentSnapshots,
      complete,
      disabled: options.disabled ?? false,
      readOnly: options.readOnly ?? false,
      invalid: options.invalid ?? false,
    }
  }

  const store = createStore(resolveSnapshot())
  const refresh = () => store.setSnapshot(resolveSnapshot())

  const applyInput = (action: InputOTPInputAction): InputOTPActionResult => {
    const snapshot = resolveSnapshot()
    const segment = segments.get(action.index)
    if (
      !segment ||
      snapshot.disabled ||
      snapshot.readOnly ||
      segment.disabled ||
      segment.readOnly
    ) {
      return {
        accepted: false,
        value: snapshot.value,
        changedIndexes: [],
        complete: snapshot.complete,
      }
    }

    const previousValue = snapshot.value
    const nextValue = [...previousValue]
    let remaining = action.text
    let currentIndex = action.index
    let selection = action.selection
    let lastWrittenIndex: number | undefined

    if (remaining.length === 0) {
      const previousSegmentValue = nextValue[currentIndex] ?? ''
      const before = Array.from(previousSegmentValue).slice(0, selection.start)
      const after = Array.from(previousSegmentValue).slice(selection.end)
      const candidate = [...before, ...after].join('')
      if (
        !segment.accept ||
        segment.accept(candidate, {
          index: currentIndex,
          previousValue: previousSegmentValue,
          reason: action.reason,
        })
      ) {
        nextValue[currentIndex] = candidate
        if (candidate !== previousSegmentValue) lastWrittenIndex = currentIndex
      }
    }

    while (remaining.length > 0) {
      const currentSegment = segments.get(currentIndex)
      if (
        !currentSegment ||
        currentSegment.disabled ||
        currentSegment.readOnly ||
        options.disabled ||
        options.readOnly
      ) {
        break
      }

      const previousSegmentValue = nextValue[currentIndex] ?? ''
      const transformed = currentSegment.transform
        ? currentSegment.transform(remaining, {
            index: currentIndex,
            currentValue: previousSegmentValue,
            reason: action.reason,
          })
        : remaining
      const characters = Array.from(transformed)
      if (characters.length === 0) break

      const before = Array.from(previousSegmentValue).slice(0, selection.start)
      const after = Array.from(previousSegmentValue).slice(selection.end)
      const capacity = currentSegment.maxLength
      const available = capacity === undefined ? characters.length : Math.max(0, capacity - before.length - after.length)
      const acceptedCharacters = characters.slice(0, available)
      const candidate = [...before, ...acceptedCharacters, ...after].join('')

      if (
        currentSegment.accept &&
        !currentSegment.accept(candidate, {
          index: currentIndex,
          previousValue: previousSegmentValue,
          reason: action.reason,
        })
      ) {
        remaining = characters.slice(1).join('')
        continue
      }

      nextValue[currentIndex] = candidate
      if (candidate !== previousSegmentValue) lastWrittenIndex = currentIndex
      remaining = characters.slice(acceptedCharacters.length).join('')
      if (remaining.length === 0 || currentSegment.maxLength === undefined) break
      currentIndex += 1
      selection = { start: 0, end: nextValue[currentIndex]?.length ?? 0 }
    }

    const indexes = changedIndexes(previousValue, nextValue)
    if (indexes.length === 0 || inputOTPValuesEqual(previousValue, nextValue)) {
      return {
        accepted: false,
        value: previousValue,
        changedIndexes: [],
        complete: snapshot.complete,
      }
    }

    if (options.value === undefined) uncontrolledValue = nextValue
    const nextSegments = resolveSegments(nextValue)
    const complete = options.isComplete
      ? options.isComplete(nextValue, nextSegments)
      : isInputOTPComplete(nextValue, nextSegments)
    const meta = {
      index: action.index,
      reason: action.reason,
      previousValue,
      value: nextValue,
      changedIndexes: indexes,
      complete,
    }
    options.onChange?.(nextValue, meta)
    if (!previousComplete && complete) {
      options.onComplete?.(nextValue, {
        previousValue,
        changedIndexes: indexes,
        reason: action.reason,
      })
    }
    previousComplete = complete
    refresh()

    const writtenSegment = lastWrittenIndex === undefined ? undefined : segments.get(lastWrittenIndex)
    const wasAlreadyFull =
      writtenSegment?.maxLength !== undefined &&
      (previousValue[lastWrittenIndex!]?.length ?? 0) >= writtenSegment.maxLength
    const focusIndex =
      lastWrittenIndex !== undefined &&
      writtenSegment !== undefined &&
      writtenSegment?.autoAdvance !== false &&
      writtenSegment.maxLength !== undefined &&
      (nextValue[lastWrittenIndex]?.length ?? 0) >= writtenSegment.maxLength &&
      (!wasAlreadyFull || writtenSegment.maxLength === 1)
        ? lastWrittenIndex + 1
        : undefined

    return {
      accepted: true,
      value: nextValue,
      changedIndexes: indexes,
      focusIndex: segments.has(focusIndex ?? -1) ? focusIndex : undefined,
      cursor: 'all',
      complete,
    }
  }

  return {
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,
    setOptions(nextOptions) {
      options = nextOptions
      previousComplete = resolveSnapshot().complete
      refresh()
    },
    registerSegment(segment) {
      segments.set(segment.index, segment)
      previousComplete = resolveSnapshot().complete
      refresh()
      return () => {
        segments.delete(segment.index)
        refresh()
      }
    },
    updateSegment(segment) {
      segments.set(segment.index, segment)
      previousComplete = resolveSnapshot().complete
      refresh()
    },
    applyInput,
  }
}
