import type { SnapshotStore } from '../store/create-store'

export type RateDirection = 'ltr' | 'rtl'

export interface RateSnapshot {
  value: number
  previewValue: number | null
  displayValue: number
  count: number
  step: number
  disabled: boolean
  readOnly: boolean
  allowClear: boolean
  direction: RateDirection
  interacting: boolean
}

export interface RateChangeMeta {
  previousValue: number
  value: number
}

export interface RateOptions {
  value?: number | undefined
  defaultValue?: number | undefined
  count?: number | undefined
  step?: number | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  allowClear?: boolean | undefined
  direction?: RateDirection | undefined
  onPreviewChange?: (value: number | null) => void
  onChange?: (value: number, meta: RateChangeMeta) => void
  onCommit?: (value: number, meta: RateChangeMeta) => void
}

export interface RateController extends SnapshotStore<RateSnapshot> {
  syncSnapshot: () => void
  preview: (value: number) => void
  clearPreview: () => void
  startInteraction: (value: number) => void
  moveInteraction: (value: number) => void
  commitInteraction: () => RateChangeMeta | undefined
  cancelInteraction: () => void
  setValue: (value: number, options?: { commit?: boolean }) => RateChangeMeta | undefined
  stepValue: (direction: number, multiplier?: number) => RateChangeMeta | undefined
}
