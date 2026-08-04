import type { ExpansionKey, ExpansionSnapshot } from './types'

export function normalizeExpansionKeys(
  keys: readonly ExpansionKey[] | undefined,
  multiple: boolean,
): ExpansionKey[] {
  const normalized: ExpansionKey[] = []
  const seen = new Set<ExpansionKey>()

  for (const key of keys ?? []) {
    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    normalized.push(key)

    if (!multiple) {
      break
    }
  }

  return normalized
}

export function createExpansionSnapshot(
  expandedKeys: readonly ExpansionKey[],
  multiple: boolean,
): ExpansionSnapshot {
  return {
    expandedKeys: normalizeExpansionKeys(expandedKeys, multiple),
    multiple,
  }
}

export function expansionKeysEqual(left: readonly ExpansionKey[], right: readonly ExpansionKey[]) {
  if (left.length !== right.length) {
    return false
  }

  return left.every((key, index) => Object.is(key, right[index]))
}

export function diffExpansionKeys(
  previousKeys: readonly ExpansionKey[],
  nextKeys: readonly ExpansionKey[],
) {
  const previousSet = new Set(previousKeys)
  const nextSet = new Set(nextKeys)
  const changedKeys: ExpansionKey[] = []

  for (const key of previousKeys) {
    if (!nextSet.has(key)) {
      changedKeys.push(key)
    }
  }

  for (const key of nextKeys) {
    if (!previousSet.has(key)) {
      changedKeys.push(key)
    }
  }

  return changedKeys
}
