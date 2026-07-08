import type { SnapshotStore } from '../store/create-store'

export interface ToggleSnapshot {
  checked: boolean
  disabled: boolean
}

export interface ToggleChangeMeta {
  previousChecked: boolean
  checked: boolean
}

export interface ToggleOptions {
  checked?: boolean | undefined
  defaultChecked?: boolean | undefined
  disabled?: boolean | undefined
  onChange?: (checked: boolean, meta: ToggleChangeMeta) => void
}

export interface ToggleController extends SnapshotStore<ToggleSnapshot> {
  setChecked: (checked: boolean) => ToggleChangeMeta | undefined
  toggle: () => ToggleChangeMeta | undefined
}
