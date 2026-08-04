import type { ExpansionKey } from '@fex-design/core/expansion/types'
import type { ShallowRef, InjectionKey } from 'vue'
import type { useCollapse } from './use-collapse'

export type CollapseVariant = 'outlined' | 'filled' | 'ghost'
export type CollapseSize = 'sm' | 'md' | 'lg'

export interface CollapseContextValue extends ReturnType<typeof useCollapse> {
  variant: () => CollapseVariant
  size: () => CollapseSize
}

export interface CollapseItemContextValue {
  value: ExpansionKey
  disabled: ShallowRef<boolean>
  triggerId: string
  contentId: string
}

export const collapseContextKey: InjectionKey<CollapseContextValue> = Symbol('CollapseContext')
export const collapseItemContextKey: InjectionKey<CollapseItemContextValue> =
  Symbol('CollapseItemContext')
