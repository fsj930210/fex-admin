import type { MentionsQuery } from './types'

export function replaceMentionsQuery({
  value,
  query,
  text,
}: {
  value: string
  query: MentionsQuery
  text: string
}) {
  const nextValue = value.slice(0, query.start) + text + value.slice(query.end)
  const selection = query.start + text.length
  return {
    value: nextValue,
    selectionStart: selection,
    selectionEnd: selection,
  }
}
