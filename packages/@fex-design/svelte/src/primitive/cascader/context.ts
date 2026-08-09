import type { CascaderController, CascaderNode, CascaderOption } from '@fex-design/core/cascader/types'
import type { Readable } from 'svelte/store'
export const cascaderContextKey = Symbol('Cascader')
export interface CascaderContext {
  controller: CascaderController
  snapshot: Readable<ReturnType<CascaderController['getSnapshot']>>
  selectedPaths: () => readonly (readonly CascaderNode[])[]
  multiple: () => boolean
  expandTrigger: () => 'click' | 'hover'
  showSearch: () => boolean
  clearable: () => boolean
  disabled: () => boolean
  loading: () => boolean
  status: () => 'error' | 'warning' | undefined
  placeholder: () => string | undefined
  displayRender?: ((labels: readonly string[], path: readonly CascaderOption[]) => unknown) | undefined
}
