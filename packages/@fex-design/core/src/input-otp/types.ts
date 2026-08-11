import type { SnapshotStore } from '../store/create-store'

export type InputOTPValue = readonly string[]

export type InputOTPChangeReason =
  | 'input'
  | 'paste'
  | 'autofill'
  | 'delete'
  | 'composition'

export interface InputOTPTransformContext {
  index: number
  currentValue: string
  reason: InputOTPChangeReason
}

export interface InputOTPAcceptContext {
  index: number
  previousValue: string
  reason: InputOTPChangeReason
}

export type InputOTPTransform = (input: string, context: InputOTPTransformContext) => string
export type InputOTPAccept = (nextValue: string, context: InputOTPAcceptContext) => boolean

export interface InputOTPSegmentConfig {
  index: number
  maxLength?: number | undefined
  autoAdvance?: boolean | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  transform?: InputOTPTransform | undefined
  accept?: InputOTPAccept | undefined
}

export interface InputOTPSegmentSnapshot extends InputOTPSegmentConfig {
  autoAdvance: boolean
  complete: boolean
}

export interface InputOTPChangeMeta {
  index: number
  reason: InputOTPChangeReason
  previousValue: InputOTPValue
  value: InputOTPValue
  changedIndexes: readonly number[]
  complete: boolean
}

export interface InputOTPCompleteMeta {
  previousValue: InputOTPValue
  changedIndexes: readonly number[]
  reason: InputOTPChangeReason
}

export interface InputOTPRootOptions {
  value?: InputOTPValue | undefined
  defaultValue?: InputOTPValue | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  invalid?: boolean | undefined
  isComplete?:
    | ((value: InputOTPValue, segments: readonly InputOTPSegmentSnapshot[]) => boolean)
    | undefined
  onChange?: ((value: InputOTPValue, meta: InputOTPChangeMeta) => void) | undefined
  onComplete?: ((value: InputOTPValue, meta: InputOTPCompleteMeta) => void) | undefined
}

export interface InputOTPSelection {
  start: number
  end: number
}

export interface InputOTPInputAction {
  index: number
  text: string
  selection: InputOTPSelection
  reason: InputOTPChangeReason
}

export interface InputOTPActionResult {
  accepted: boolean
  value: InputOTPValue
  changedIndexes: readonly number[]
  focusIndex?: number | undefined
  cursor?: 'start' | 'end' | 'all' | undefined
  complete: boolean
}

export interface InputOTPSnapshot {
  value: InputOTPValue
  segments: readonly InputOTPSegmentSnapshot[]
  complete: boolean
  disabled: boolean
  readOnly: boolean
  invalid: boolean
}

export interface InputOTPController extends SnapshotStore<InputOTPSnapshot> {
  setOptions: (options: InputOTPRootOptions) => void
  registerSegment: (segment: InputOTPSegmentConfig) => () => void
  updateSegment: (segment: InputOTPSegmentConfig) => void
  applyInput: (action: InputOTPInputAction) => InputOTPActionResult
}
