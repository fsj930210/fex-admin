export { columnOrderingFeature } from '@tanstack/table-core'
export type { ColumnOrderState } from '@tanstack/table-core'

export function moveDataGridColumn(
  order: readonly string[],
  sourceId: string,
  targetId: string,
): string[] {
  const sourceIndex = order.indexOf(sourceId)
  const targetIndex = order.indexOf(targetId)
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return [...order]
  const next = [...order]
  const [source] = next.splice(sourceIndex, 1)
  if (!source) return [...order]
  next.splice(targetIndex, 0, source)
  return next
}
