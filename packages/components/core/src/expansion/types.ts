export type ExpansionKey = string | number

export interface ExpansionChangeMeta {
  previousKeys: ExpansionKey[]
  changedKeys: ExpansionKey[]
}

export interface ExpansionOptions {
  expandedKeys?: readonly ExpansionKey[] | undefined
  defaultExpandedKeys?: readonly ExpansionKey[] | undefined
  disabledKeys?: readonly ExpansionKey[] | undefined
  multiple?: boolean | undefined
  onChange?: (keys: ExpansionKey[], meta: ExpansionChangeMeta) => void
}

export interface ExpansionSnapshot {
  expandedKeys: ExpansionKey[]
  multiple: boolean
}

export interface ExpansionController {
  getSnapshot: () => ExpansionSnapshot
  subscribe: (listener: () => void) => () => void
  isExpanded: (key: ExpansionKey) => boolean
  isDisabled: (key: ExpansionKey) => boolean
  expand: (key: ExpansionKey) => void
  collapse: (key: ExpansionKey) => void
  toggle: (key: ExpansionKey) => void
  setExpandedKeys: (keys: readonly ExpansionKey[]) => void
  clear: () => void
}
