import type { SelectionController, SelectionValue } from '@fex/components-core/selection/types'
import type { Readable } from 'svelte/store'

export const listboxContextKey = Symbol('listbox-context')

export type ListboxOrientation = 'vertical' | 'horizontal'

export type ListboxContext = {
  controller: SelectionController
  snapshot: Readable<ReturnType<SelectionController['getSnapshot']>>
  orientation: () => ListboxOrientation
  selectedValues: () => readonly SelectionValue[]
  selectItem: (value: SelectionValue) => void
}
