export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const next = [...array]
  const startIndex = from < 0 ? next.length + from : from

  if (startIndex < 0 || startIndex >= next.length) {
    return next
  }

  const [item] = next.splice(startIndex, 1)
  const targetIndex = to < 0 ? next.length + to : to
  next.splice(Math.max(0, Math.min(targetIndex, next.length)), 0, item as T)

  return next
}
