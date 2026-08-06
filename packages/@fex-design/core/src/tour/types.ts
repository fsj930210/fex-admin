import type { FloatingPlacement } from '../floating/placement'

export type TourTargetResolver = () => HTMLElement | null
export type TourTargetMissingStrategy = 'wait' | 'skip' | 'close'

export interface TourGapOptions {
  offset?: number | [number, number]
}

export interface TourArrowOptions {
  pointAtCenter?: boolean
}

export interface TourMaskOptions {
  color?: string
}

export interface TourStepOptions<TData = unknown> {
  name: string
  target?: string | null
  placement?: FloatingPlacement
  arrow?: boolean | TourArrowOptions
  mask?: boolean | TourMaskOptions
  gap?: TourGapOptions
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions
  disabledInteraction?: boolean
  data?: TData
}

export interface TourRegisteredStep<TData = unknown> extends TourStepOptions<TData> {
  order: number
}

export interface TourChangeInfo<TData = unknown> {
  reason:
    | 'open'
    | 'next'
    | 'previous'
    | 'go-to'
    | 'skip'
    | 'close'
    | 'complete'
    | 'target-missing'
  step?: TourRegisteredStep<TData> | undefined
}

export interface TourSnapshot<TData = unknown> {
  open: boolean
  status: 'idle' | 'waiting-target' | 'running' | 'completed'
  currentIndex: number
  total: number
  currentStep: TourRegisteredStep<TData> | null
  targetKey: string | null
  targetRect: DOMRect | null
  targetAvailable: boolean
  isFirst: boolean
  isLast: boolean
}

export interface TourOptions<TData = unknown> {
  open?: boolean
  defaultOpen?: boolean
  current?: number
  defaultCurrent?: number
  targetMissing?: TourTargetMissingStrategy
  targetTimeout?: number
  onOpenChange?: (open: boolean, info: TourChangeInfo<TData>) => void
  onChange?: (index: number, info: TourChangeInfo<TData>) => void
  onClose?: (info: TourChangeInfo<TData>) => void
  onFinish?: () => void
  onTargetMissing?: (step: TourRegisteredStep<TData>) => void
}

export interface TourController<TData = unknown> {
  getSnapshot(): TourSnapshot<TData>
  subscribe(listener: () => void): () => void
  setOptions(options: TourOptions<TData>): void
  registerStep(step: TourStepOptions<TData>): () => void
  registerTarget(name: string, resolver: TourTargetResolver): () => void
  getTarget(name: string): HTMLElement | null
  open(): void
  close(reason?: TourChangeInfo<TData>['reason']): void
  next(): Promise<void>
  previous(): Promise<void>
  goTo(index: number): Promise<void>
  skip(): void
  complete(): void
  refreshTarget(): void
  destroy(): void
}
