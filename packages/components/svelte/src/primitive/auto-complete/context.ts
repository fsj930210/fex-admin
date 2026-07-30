import type {
  AutoCompleteController,
  ResolvedAutoCompleteItem,
} from '@fex/components-core/auto-complete/types'
import { getContext, setContext } from 'svelte'
import type { Readable } from 'svelte/store'

type Item = Record<string, unknown>
export const autoCompleteContextKey = Symbol('AutoComplete')
export interface AutoCompleteContext {
  controller: AutoCompleteController<Item>
  snapshot: Readable<ReturnType<AutoCompleteController['getSnapshot']>>
  items: () => readonly ResolvedAutoCompleteItem<Item>[]
  loading: () => boolean
  disabled: () => boolean
  readOnly: () => boolean
  listId: string
}
export function setAutoCompleteContext(value: AutoCompleteContext) {
  setContext(autoCompleteContextKey, value)
}
export function getAutoCompleteContext(component: string) {
  const value = getContext<AutoCompleteContext>(autoCompleteContextKey)
  if (!value) throw new Error(`${component} must be used inside AutoCompleteRoot.`)
  return value
}
