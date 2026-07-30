import type {
  AutoCompleteController,
  ResolvedAutoCompleteItem,
} from '@fex/components-core/auto-complete/types'
import type { InjectionKey, ShallowRef } from 'vue'

export interface AutoCompleteContext {
  controller: AutoCompleteController<Record<string, unknown>>
  snapshot: ShallowRef<ReturnType<AutoCompleteController['getSnapshot']>>
  items: ShallowRef<readonly ResolvedAutoCompleteItem<Record<string, unknown>>[]>
  loading: ShallowRef<boolean>
  disabled: ShallowRef<boolean>
  readOnly: ShallowRef<boolean>
  listId: string
}

export const autoCompleteKey: InjectionKey<AutoCompleteContext> = Symbol('AutoComplete')
