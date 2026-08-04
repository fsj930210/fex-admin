import type { SelectVirtualOptions, SelectVirtualRange } from './types'

export function getSelectVirtualRange(
  itemCount: number,
  scrollTop: number,
  viewportHeight: number,
  options: SelectVirtualOptions,
): SelectVirtualRange {
  const itemHeight = Math.max(1, options.itemHeight)
  const overscan = Math.max(0, options.overscan ?? 3)
  const visibleStart = Math.floor(Math.max(0, scrollTop) / itemHeight)
  const visibleEnd = Math.ceil((Math.max(0, scrollTop) + Math.max(0, viewportHeight)) / itemHeight)
  const start = Math.max(0, visibleStart - overscan)
  const end = Math.min(itemCount, visibleEnd + overscan)
  return { start, end, offset: start * itemHeight, totalSize: itemCount * itemHeight }
}
