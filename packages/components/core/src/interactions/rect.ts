import type { Rect, ResizeEdge, ResizeEdges } from './types'

export const defaultRect: Rect = { x: 0, y: 0, width: 320, height: 240 }

export function normalizeResizeEdges(edges: ResizeEdges): ResizeEdge[] {
  if (edges === 'all') {
    return [
      'top',
      'right',
      'bottom',
      'left',
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right',
    ]
  }

  return edges
}

export function getInteractResizeEdges(edge: ResizeEdge) {
  return {
    top: edge.includes('top'),
    right: edge.includes('right'),
    bottom: edge.includes('bottom'),
    left: edge.includes('left'),
  }
}

export function rectToStyle(rect: Rect) {
  return {
    transform: `translate3d(${rect.x}px, ${rect.y}px, 0)`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  }
}

