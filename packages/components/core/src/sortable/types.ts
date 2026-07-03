export type SortableId = string

export type SortableAxis = 'x' | 'y'

export type SortableItems = SortableId[] | Record<string, SortableId[]>

export interface SortableLocation {
  containerId: string
  index: number
}

export interface SortableSnapshot {
  activeId: SortableId | null
  activeContainerId: string | null
  overId: SortableId | null
  overContainerId: string | null
  dragging: boolean
  items: Record<string, SortableId[]>
}

export interface SortableMotionStyle {
  transform?: string
  transition?: string
  zIndex?: number
}

export interface SortableMotionOptions {
  duration?: number
  easing?: string
}

export interface RectLike {
  left: number
  top: number
  width: number
  height: number
}

export interface SortablePoint {
  x: number
  y: number
}

export interface SortableOverlayRect extends RectLike {}

export interface SortableControllerSnapshot extends SortableSnapshot {
  dragOffset: SortablePoint
  activeRect: SortableOverlayRect | null
  motionVersion: number
}
