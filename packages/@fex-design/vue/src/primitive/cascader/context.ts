import type { CascaderController, CascaderNode, CascaderOption, CascaderSnapshot } from '@fex-design/core/cascader/types'
import type { ComputedRef, InjectionKey, Ref } from 'vue'

export interface CascaderContextValue {
  controller: CascaderController
  snapshot: Ref<CascaderSnapshot>
  selectedPaths: ComputedRef<readonly (readonly CascaderNode[])[]>
  multiple: ComputedRef<boolean>
  expandTrigger: ComputedRef<'click' | 'hover'>
  showSearch: ComputedRef<boolean>
  clearable: ComputedRef<boolean>
  disabled: ComputedRef<boolean>
  loading: ComputedRef<boolean>
  status: ComputedRef<'error' | 'warning' | undefined>
  placeholder: ComputedRef<string | undefined>
  displayRender?: ((labels: readonly string[], path: readonly CascaderOption[]) => unknown) | undefined
}
export const cascaderKey: InjectionKey<CascaderContextValue> = Symbol('cascader')
