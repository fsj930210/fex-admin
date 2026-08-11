import type { SnapshotStore } from '../store/create-store'

export interface ToggleSnapshot {
  pressed: boolean
  checked: boolean
  disabled: boolean
}

export interface ToggleChangeMeta {
  previousPressed: boolean
  pressed: boolean
  previousChecked: boolean
  checked: boolean
}

export interface ToggleOptions {
  pressed?: boolean | undefined
  defaultPressed?: boolean | undefined
  checked?: boolean | undefined
  defaultChecked?: boolean | undefined
  disabled?: boolean | undefined
  onChange?: (pressed: boolean, meta: ToggleChangeMeta) => void
}

export interface ToggleController extends SnapshotStore<ToggleSnapshot> {
  setPressed: (pressed: boolean) => ToggleChangeMeta | undefined
  setChecked: (checked: boolean) => ToggleChangeMeta | undefined
  toggle: () => ToggleChangeMeta | undefined
}

export type ToggleGroupValue = string | string[]

export interface ToggleGroupSnapshot {
  value: string[]
  multiple: boolean
  disabled: boolean
}

export interface ToggleGroupChangeMeta {
  previousValue: string[]
  value: string[]
  changedValue: string
  pressed: boolean
}

export interface ToggleGroupOptions {
  value?: ToggleGroupValue | undefined
  defaultValue?: ToggleGroupValue | undefined
  multiple?: boolean | undefined
  disabled?: boolean | undefined
  onChange?: (value: ToggleGroupValue, meta: ToggleGroupChangeMeta) => void
}

export interface ToggleGroupController extends SnapshotStore<ToggleGroupSnapshot> {
  isPressed: (value: string) => boolean
  toggle: (value: string) => ToggleGroupChangeMeta | undefined
  setValue: (value: ToggleGroupValue) => ToggleGroupChangeMeta | undefined
}

export type ToggleGroupOrientation = 'horizontal' | 'vertical'

export function getToggleGroupFocusIndex(
  key: string,
  currentIndex: number,
  itemCount: number,
  orientation: ToggleGroupOrientation,
) {
  if (itemCount === 0) return undefined
  if (key === 'Home') return 0
  if (key === 'End') return itemCount - 1
  const previous = orientation === 'horizontal' ? key === 'ArrowLeft' : key === 'ArrowUp'
  const next = orientation === 'horizontal' ? key === 'ArrowRight' : key === 'ArrowDown'
  if (!previous && !next) return undefined
  return Math.max(0, Math.min(itemCount - 1, currentIndex + (next ? 1 : -1)))
}
