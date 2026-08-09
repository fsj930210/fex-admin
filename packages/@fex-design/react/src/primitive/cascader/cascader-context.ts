import type {
  CascaderController,
  CascaderNode,
  CascaderOption,
  CascaderSnapshot,
} from '@fex-design/core/cascader/types'
import { createContext, use, type ReactNode } from 'react'

export interface CascaderContextValue {
  controller: CascaderController
  snapshot: CascaderSnapshot
  multiple: boolean
  expandTrigger: 'click' | 'hover'
  showSearch: boolean
  clearable: boolean
  disabled: boolean
  loading: boolean
  status?: 'error' | 'warning' | undefined
  placeholder?: string | undefined
  selectedPaths: readonly (readonly CascaderNode[])[]
  displayRender?: ((labels: readonly string[], path: readonly CascaderOption[]) => ReactNode) | undefined
}

export const CascaderContext = createContext<CascaderContextValue | null>(null)

export function useCascader() {
  const context = use(CascaderContext)
  if (!context) throw new Error('Cascader parts must be used inside CascaderRoot.')
  return context
}
