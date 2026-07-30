import type { RateDirection } from '@fex/components-core/rate/types'
import { getRateValueFromPointer } from '@fex/components-core/rate/utils'
import type { KeyboardEvent } from 'react'

export function getRatePointerValue(
  root: HTMLDivElement,
  clientX: number,
  step: number,
  count: number,
  direction: RateDirection,
) {
  const items = root.querySelectorAll<HTMLElement>('[data-rate-item]')
  let closestValue = 0
  let closestDistance = Number.POSITIVE_INFINITY

  for (const item of items) {
    const index = Number(item.dataset.rateItem)
    const rect = item.getBoundingClientRect()
    if (clientX >= rect.left && clientX <= rect.right) {
      const visualRatio = rect.width === 0 ? 0 : (clientX - rect.left) / rect.width
      const ratio = direction === 'rtl' ? 1 - visualRatio : visualRatio
      return getRateValueFromPointer(index, ratio, step, count)
    }

    const edges = direction === 'rtl'
      ? [{ position: rect.right, value: index }, { position: rect.left, value: index + 1 }]
      : [{ position: rect.left, value: index }, { position: rect.right, value: index + 1 }]
    for (const edge of edges) {
      const distance = Math.abs(clientX - edge.position)
      if (distance < closestDistance) {
        closestDistance = distance
        closestValue = edge.value
      }
    }
  }
  return closestValue
}

export function handleRateKeyDown(
  event: KeyboardEvent<HTMLDivElement>,
  direction: RateDirection,
  stepValue: (direction: number, multiplier?: number) => void,
  setValue: (value: number) => void,
  count: number,
) {
  const horizontalDirection = direction === 'rtl' ? -1 : 1
  const directionMap: Record<string, number> = {
    ArrowRight: horizontalDirection,
    ArrowLeft: -horizontalDirection,
    ArrowUp: 1,
    ArrowDown: -1,
  }

  if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    setValue(event.key === 'Home' ? 0 : count)
  } else if (event.key === 'PageUp' || event.key === 'PageDown') {
    event.preventDefault()
    stepValue(event.key === 'PageUp' ? 1 : -1, 10)
  } else if (event.key in directionMap) {
    event.preventDefault()
    stepValue(directionMap[event.key]!)
  }
}
