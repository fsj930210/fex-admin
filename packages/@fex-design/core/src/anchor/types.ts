export type AnchorActiveMode = 'current' | 'progress'

export type AnchorOrientation = 'vertical' | 'horizontal'

export type AnchorTarget = string | HTMLElement | (() => HTMLElement | null)

export interface AnchorItem<TTitle = unknown> {
  key: string
  title: TTitle
  target: AnchorTarget
  children?: AnchorItem<TTitle>[]
}

export interface AnchorFlatItem<TTitle = unknown> {
  item: AnchorItem<TTitle>
  level: number
  index: number
  parentKeys: readonly string[]
}

export interface AnchorTargetPosition<TTitle = unknown> {
  item: AnchorItem<TTitle>
  top: number
}

export interface AnchorActiveGroup {
  keys: readonly string[]
  level: number
}

export interface AnchorSnapshot {
  activeKeys: readonly string[]
}

export interface AnchorControllerOptions<TTitle = unknown> {
  activeKeys?: readonly string[]
  defaultActiveKeys?: readonly string[]
  onChange?: (activeKeys: readonly string[], items: readonly AnchorItem<TTitle>[]) => void
}

export interface AnchorController<TTitle = unknown> {
  getSnapshot(): AnchorSnapshot
  subscribe(listener: () => void): () => void
  updateOptions(options: AnchorControllerOptions<TTitle>): void
  change(activeKeys: readonly string[], items: readonly AnchorItem<TTitle>[]): void
}
