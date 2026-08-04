import type { SelectionSnapshot, SelectionValue } from './types'

export function normalizeSelectionValues(
  value: SelectionValue | readonly SelectionValue[] | undefined,
  multiple: boolean,
): SelectionValue[] {
  const values = Array.isArray(value) ? value : value === undefined ? [] : [value]
  const normalized: SelectionValue[] = []
  const seen = new Set<SelectionValue>()

  for (const item of values) {
    if (seen.has(item)) {
      continue
    }
    seen.add(item)
    normalized.push(item)
    if (!multiple) {
      break
    }
  }

  return normalized
}

export function createSelectionSnapshot(
  values: readonly SelectionValue[],
  multiple: boolean,
): SelectionSnapshot {
  const normalizedValues = normalizeSelectionValues(values, multiple)

  return {
    values: normalizedValues,
    value: normalizedValues[0],
    multiple,
  }
}

export function valuesEqual(left: readonly SelectionValue[], right: readonly SelectionValue[]) {
  if (left.length !== right.length) {
    return false
  }

  return left.every((value, index) => Object.is(value, right[index]))
}

export function diffSelectionValues(
  previousValues: readonly SelectionValue[],
  nextValues: readonly SelectionValue[],
) {
  const previousSet = new Set(previousValues)
  const nextSet = new Set(nextValues)
  const changedValues: SelectionValue[] = []

  for (const value of previousValues) {
    if (!nextSet.has(value)) {
      changedValues.push(value)
    }
  }

  for (const value of nextValues) {
    if (!previousSet.has(value)) {
      changedValues.push(value)
    }
  }

  return changedValues
}
