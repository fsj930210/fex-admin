import type { ExpansionKey, ExpansionSnapshot } from '@fex-design/core/expansion/types'
import type { Readable } from 'svelte/store'

export type CollapseVariant = 'outlined' | 'filled' | 'ghost'
export type CollapseSize = 'sm' | 'md' | 'lg'

export const collapseContextKey = Symbol('Collapse')
export const collapseItemContextKey = Symbol('CollapseItem')

export interface CollapseContext {
  baseId: string
  snapshot: Readable<ExpansionSnapshot>
  variant: () => CollapseVariant
  size: () => CollapseSize
  expand: (key: ExpansionKey) => void
  collapse: (key: ExpansionKey) => void
  toggle: (key: ExpansionKey) => void
  setExpandedKeys: (keys: readonly ExpansionKey[]) => void
  clear: () => void
  getExpandedKeys: () => ExpansionKey[]
  isExpanded: (key: ExpansionKey) => boolean
  isDisabled: (key: ExpansionKey) => boolean
}

export interface CollapseItemContext {
  value: ExpansionKey
  disabled: () => boolean
  triggerId: string
  contentId: string
}
