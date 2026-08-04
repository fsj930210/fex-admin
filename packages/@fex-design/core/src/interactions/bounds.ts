import type { Rect } from './types'

export interface BoundsRect {
  top: number
  right: number
  bottom: number
  left: number
}

export function clamp(value: number, min: number, max: number) {
  if (min > max) {
    return min
  }
  return Math.min(Math.max(value, min), max)
}

export function resolveMoveRect({
  startPosition,
  startPointer,
  currentPointer,
  targetRect,
  boundsRect,
  axis,
}: {
  startPosition: { x: number; y: number }
  startPointer: { x: number; y: number }
  currentPointer: { x: number; y: number }
  targetRect: BoundsRect
  boundsRect: BoundsRect | null
  axis?: 'x' | 'y'
}) {
  const dx = currentPointer.x - startPointer.x
  const dy = currentPointer.y - startPointer.y
  let x = axis === 'y' ? startPosition.x : startPosition.x + dx
  let y = axis === 'x' ? startPosition.y : startPosition.y + dy

  if (boundsRect) {
    x = clamp(
      x,
      boundsRect.left - targetRect.left + startPosition.x,
      boundsRect.right - targetRect.right + startPosition.x,
    )
    y = clamp(
      y,
      boundsRect.top - targetRect.top + startPosition.y,
      boundsRect.bottom - targetRect.bottom + startPosition.y,
    )
  }

  return { x, y }
}

export function resolveResizeRect({
  edge,
  startRect,
  startPointer,
  currentPointer,
  targetRect,
  boundsRect,
  minWidth = 0,
  maxWidth = Number.POSITIVE_INFINITY,
  minHeight = 0,
  maxHeight = Number.POSITIVE_INFINITY,
}: {
  edge: string
  startRect: Rect
  startPointer: { x: number; y: number }
  currentPointer: { x: number; y: number }
  targetRect: BoundsRect
  boundsRect: BoundsRect | null
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
}) {
  const dx = currentPointer.x - startPointer.x
  const dy = currentPointer.y - startPointer.y
  let { x, y, width, height } = startRect

  if (edge.includes('right')) {
    width = startRect.width + dx
  }
  if (edge.includes('bottom')) {
    height = startRect.height + dy
  }
  if (edge.includes('left')) {
    width = startRect.width - dx
  }
  if (edge.includes('top')) {
    height = startRect.height - dy
  }

  width = clamp(width, minWidth, maxWidth)
  height = clamp(height, minHeight, maxHeight)

  if (edge.includes('left')) {
    x = startRect.x + (startRect.width - width)
  }
  if (edge.includes('top')) {
    y = startRect.y + (startRect.height - height)
  }

  if (boundsRect) {
    const left = targetRect.left + x - startRect.x
    const top = targetRect.top + y - startRect.y
    const right = left + width
    const bottom = top + height

    if (edge.includes('left') && left < boundsRect.left) {
      const diff = boundsRect.left - left
      x += diff
      width -= diff
    }
    if (edge.includes('top') && top < boundsRect.top) {
      const diff = boundsRect.top - top
      y += diff
      height -= diff
    }
    if (edge.includes('right') && right > boundsRect.right) {
      width -= right - boundsRect.right
    }
    if (edge.includes('bottom') && bottom > boundsRect.bottom) {
      height -= bottom - boundsRect.bottom
    }
  }

  return {
    x,
    y,
    width: clamp(width, minWidth, maxWidth),
    height: clamp(height, minHeight, maxHeight),
  }
}
