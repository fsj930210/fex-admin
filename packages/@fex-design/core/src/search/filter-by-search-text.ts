export function normalizeSearchText(value: unknown): string {
  return String(value ?? '').trim().toLocaleLowerCase()
}

export function tokenizeSearchText(keyword: string): readonly string[] {
  return normalizeSearchText(keyword).split(/\s+/).filter(Boolean)
}

export function matchSearchText(
  keyword: string,
  candidates: readonly unknown[],
): boolean {
  const tokens = tokenizeSearchText(keyword)
  if (tokens.length === 0) return true
  const normalizedCandidates = candidates.map(normalizeSearchText).filter(Boolean)
  return tokens.every((token) =>
    normalizedCandidates.some((candidate) => candidate.includes(token)),
  )
}

export function filterBySearchText<T>(
  items: readonly T[],
  keyword: string,
  getCandidates: (item: T) => readonly unknown[],
): readonly T[] {
  if (tokenizeSearchText(keyword).length === 0) return items
  return items.filter((item) => matchSearchText(keyword, getCandidates(item)))
}
