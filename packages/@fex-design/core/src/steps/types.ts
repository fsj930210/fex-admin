import type { SnapshotStore } from '../store/create-store'

export type StepValue = string | number

export function serializeStepValue(value: StepValue): string {
  return `${typeof value === 'number' ? 'n' : 's'}:${String(value)}`
}

export function deserializeStepValue(value: string): StepValue {
  return value.startsWith('n:') ? Number(value.slice(2)) : value.slice(2)
}
export type StepBuiltinStatus = 'wait' | 'process' | 'finish' | 'error'
export type StepStatus = StepBuiltinStatus | (string & {})
export type StepsOrientation = 'horizontal' | 'vertical'
export type StepsChangeTrigger = 'pointer' | 'keyboard'

export interface StepRecord<TData = unknown> {
  value: StepValue
  disabled?: boolean | undefined
  status?: StepStatus | undefined
  data?: TData | undefined
}

export interface StepInfo<TData = unknown> {
  value: StepValue
  status: StepStatus
  disabled: boolean
  data?: TData
}

export interface StepsChangeMeta<TData = unknown> {
  previous: StepInfo<TData> | null
  current: StepInfo<TData>
  trigger: StepsChangeTrigger
}

export interface StepsSnapshot {
  current: StepValue | undefined
  revision: number
}

export interface StepsControllerOptions<TData = unknown> {
  current?: StepValue | undefined
  defaultCurrent?: StepValue | undefined
  navigation?: boolean | undefined
  onChange?: ((value: StepValue, meta: StepsChangeMeta<TData>) => void) | undefined
}

export interface StepsController<TData = unknown> extends SnapshotStore<StepsSnapshot> {
  updateOptions: (options: StepsControllerOptions<TData>) => void
  registerStep: (step: StepRecord<TData>) => void
  setOrder: (values: readonly StepValue[]) => void
  unregisterStep: (value: StepValue) => void
  getStepInfo: (value: StepValue) => StepInfo<TData> | undefined
  getPosition: (value: StepValue) => number
  select: (value: StepValue, trigger: StepsChangeTrigger) => StepValue | undefined
  move: (value: StepValue, direction: 'next' | 'previous' | 'first' | 'last') => StepValue | undefined
}
