export interface Point {
  x: number
  y: number
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export type InteractionAxis = 'x' | 'y'

export type DropEdge = 'top' | 'right' | 'bottom' | 'left'
export type DropPosition = DropEdge | 'inside'

export type ResizeEdge =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

export type ResizeEdges = ResizeEdge[] | 'all'
