import type { MentionsParseInput, MentionsQuery } from './types'

function isBoundary(value: string, index: number) {
  if (index <= 0) return true
  return /\s/.test(value[index - 1] ?? '')
}

function hasSpace(value: string) {
  return /\s/.test(value)
}

export function normalizeMentionsPrefixes(prefixes: readonly string[] | undefined) {
  const next = (prefixes?.length ? prefixes : ['@'])
    .filter((prefix) => prefix.length > 0)
    .sort((left, right) => right.length - left.length)
  return next.length ? next : ['@']
}

export function parseMentionsQuery({
  value,
  selectionStart,
  selectionEnd,
  prefixes,
}: MentionsParseInput): MentionsQuery | null {
  if (selectionStart !== selectionEnd) return null
  const beforeCursor = value.slice(0, selectionStart)
  const normalizedPrefixes = normalizeMentionsPrefixes(prefixes)

  let match:
    | { prefix: string; start: number; text: string }
    | undefined

  for (const prefix of normalizedPrefixes) {
    const start = beforeCursor.lastIndexOf(prefix)
    if (start < 0 || !isBoundary(value, start)) continue
    const text = beforeCursor.slice(start + prefix.length)
    if (hasSpace(text)) continue
    if (
      match === undefined ||
      start > match.start ||
      (start === match.start && prefix.length > match.prefix.length)
    ) {
      match = { prefix, start, text }
    }
  }

  if (!match) return null

  return {
    prefix: match.prefix,
    text: match.text,
    start: match.start,
    end: selectionStart,
  }
}
