export type MasonryKey = string | number

export interface MasonryGap {
  column: number
  row: number
}

export interface MasonryBreakpoint {
  minWidth: number
  columns: number
}

export type MasonryColumns =
  | number
  | { minColumnWidth: number; max?: number | undefined }
  | readonly MasonryBreakpoint[]

export type MasonryPlacement = 'shortest' | 'ordered'

export interface MasonryItemInput {
  key: MasonryKey
  index: number
  height: number
  column?: number | undefined
}

export interface MasonryItemPosition extends MasonryItemInput {
  column: number
  top: number
  inlineStart: number
  width: number
}

export interface MasonryLayoutDetail {
  width: number
  height: number
  columnCount: number
  columnWidth: number
  items: readonly MasonryItemPosition[]
}

export interface MasonryControllerOptions {
  columns?: MasonryColumns | undefined
  gap?: number | Partial<MasonryGap> | undefined
  placement?: MasonryPlacement | undefined
  onLayoutChange?: ((detail: MasonryLayoutDetail) => void) | undefined
  direction?: 'ltr' | 'rtl' | undefined
}
