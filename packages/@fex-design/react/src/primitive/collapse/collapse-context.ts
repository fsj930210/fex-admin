import { createContext, use } from 'react'
import type { ExpansionKey } from '@fex-design/core/expansion/types'
import type { CollapseStyleProps } from '@fex-design/styles/collapse'
import type { useCollapse } from './use-collapse'

export type CollapseVariant = NonNullable<CollapseStyleProps['variant']>
export type CollapseSize = NonNullable<CollapseStyleProps['size']>

export interface CollapseContextValue extends ReturnType<typeof useCollapse> {
  variant: CollapseVariant
  size: CollapseSize
}

export interface CollapseItemContextValue {
  value: ExpansionKey
  disabled: boolean
  triggerId: string
  contentId: string
}

export const CollapseContext = createContext<CollapseContextValue | null>(null)
export const CollapseItemContext = createContext<CollapseItemContextValue | null>(null)

export function useCollapseContext(componentName: string) {
  const context = use(CollapseContext)
  if (!context) throw new Error(componentName + ' must be used inside Collapse.')
  return context
}

export function useCollapseItemContext(componentName: string) {
  const context = use(CollapseItemContext)
  if (!context) throw new Error(componentName + ' must be used inside CollapseItem.')
  return context
}
