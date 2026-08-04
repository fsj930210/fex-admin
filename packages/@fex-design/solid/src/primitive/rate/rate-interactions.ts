import type { RateDirection } from '@fex-design/core/rate/types'
import { getRateValueFromPointer } from '@fex-design/core/rate/utils'

export function getRatePointerValue(
  root: HTMLElement,
  clientX: number,
  step: number,
  count: number,
  direction: RateDirection,
) {
  const items = root.querySelectorAll<HTMLElement>('[data-rate-item]')
  let closest = { distance: Number.POSITIVE_INFINITY, value: 0 }
  for (const item of items) {
    const index = Number(item.dataset.rateItem)
    const rect = item.getBoundingClientRect()
    if (clientX >= rect.left && clientX <= rect.right) {
      const ratio = rect.width === 0 ? 0 : (clientX - rect.left) / rect.width
      return getRateValueFromPointer(index, direction === 'rtl' ? 1 - ratio : ratio, step, count)
    }
    const edges =
      direction === 'rtl'
        ? [
            { position: rect.right, value: index },
            { position: rect.left, value: index + 1 },
          ]
        : [
            { position: rect.left, value: index },
            { position: rect.right, value: index + 1 },
          ]
    for (const edge of edges) {
      const distance = Math.abs(clientX - edge.position)
      if (distance < closest.distance) closest = { distance, value: edge.value }
    }
  }
  return closest.value
}
