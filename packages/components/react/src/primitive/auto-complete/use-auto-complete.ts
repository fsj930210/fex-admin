import type { AutoCompleteKey } from '@fex/components-core/auto-complete/types'
import { useCoreStore } from '../../hooks/use-core-store'
import { useAutoCompleteContext } from './auto-complete-context'

export function useAutoComplete() {
  const context = useAutoCompleteContext('useAutoComplete')
  const snapshot = useCoreStore(context.controller)
  return {
    ...context,
    snapshot,
    activeId:
      snapshot.activeKey === undefined ? undefined : `${context.listId}-${snapshot.activeKey}`,
  }
}

export function useAutoCompleteOption(key: AutoCompleteKey) {
  const autoComplete = useAutoComplete()
  const entry = autoComplete.items.find((item) => item.key === key)
  return {
    active: autoComplete.snapshot.activeKey === key,
    disabled: entry?.disabled === true,
    activate: () => autoComplete.controller.setActiveKey(key, 'pointer'),
    select: () => autoComplete.controller.selectItem(key),
  }
}

export type {
  AutoCompleteChangeMeta,
  AutoCompleteFieldNames,
  AutoCompleteItem,
} from '@fex/components-core/auto-complete/types'
