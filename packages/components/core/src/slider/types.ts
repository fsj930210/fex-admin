import type { SnapshotStore } from '../store/create-store'

export type SliderOrientation = 'horizontal' | 'vertical'

export interface SliderSnapshot {
  values: number[]
  disabled: boolean
  min: number
  max: number
  step: number
  minStepsBetweenThumbs: number
  activeIndex: number
  orientation: SliderOrientation
}

export interface SliderChangeMeta {
  previousValues: number[]
  values: number[]
  changedIndex: number
}

export interface SliderOptions {
  value?: readonly number[] | undefined
  defaultValue?: readonly number[] | undefined
  disabled?: boolean | undefined
  min?: number | undefined
  max?: number | undefined
  step?: number | undefined
  minStepsBetweenThumbs?: number | undefined
  orientation?: SliderOrientation | undefined
  onChange?: (values: number[], meta: SliderChangeMeta) => void
  onCommit?: (values: number[], meta: SliderChangeMeta) => void
}

export interface SliderController extends SnapshotStore<SliderSnapshot> {
  syncSnapshot: () => void
  startSlide: (value: number) => SliderChangeMeta | undefined
  moveSlide: (value: number) => SliderChangeMeta | undefined
  endSlide: () => SliderChangeMeta | undefined
  setValueAt: (index: number, value: number, options?: { commit?: boolean }) => SliderChangeMeta | undefined
  stepThumb: (index: number, direction: number, multiplier?: number) => SliderChangeMeta | undefined
  setActiveIndex: (index: number) => void
}
