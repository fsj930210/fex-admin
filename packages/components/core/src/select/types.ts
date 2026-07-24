import type { SelectionController, SelectionValue } from '../selection/types'

export type SelectMode = 'tags'

export interface SelectOption<TValue extends SelectionValue = SelectionValue> {
  value: TValue
  label: string
  disabled?: boolean | undefined
  group?: string | undefined
  searchText?: string | undefined
  keywords?: readonly string[] | undefined
  data?: unknown
}

export type SelectFilterOption<TValue extends SelectionValue = SelectionValue> = (
  keyword: string,
  option: SelectOption<TValue>,
) => boolean

export interface SelectVirtualOptions {
  itemHeight: number
  overscan?: number | undefined
}

export interface SelectVirtualRange {
  start: number
  end: number
  offset: number
  totalSize: number
}

export interface SelectSnapshot<TValue extends SelectionValue = SelectionValue> {
  open: boolean
  searchValue: string
  activeValue: TValue | undefined
  interaction: 'keyboard' | 'pointer' | null
  selectedValues: readonly SelectionValue[]
}

export interface SelectControllerOptions<TValue extends SelectionValue = SelectionValue> {
  selection: SelectionController
  options?: readonly SelectOption<TValue>[] | undefined
  mode?: SelectMode | undefined
  multiple?: boolean | undefined
  maxCount?: number | undefined
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  searchValue?: string | undefined
  defaultSearchValue?: string | undefined
  loop?: boolean | undefined
  onOpenChange?: ((open: boolean) => void) | undefined
  onSearch?: ((keyword: string) => void) | undefined
  onTagCreate?: ((value: string) => boolean | void) | undefined
}

export interface SelectController<TValue extends SelectionValue = SelectionValue> {
  selection: SelectionController
  getSnapshot: () => SelectSnapshot<TValue>
  subscribe: (listener: () => void) => () => void
  open: () => void
  close: () => void
  toggleOpen: () => void
  setSearchValue: (keyword: string) => void
  setActiveValue: (value: TValue | undefined, interaction?: 'keyboard' | 'pointer') => void
  moveActive: (direction: 1 | -1) => void
  moveActiveTo: (position: 'first' | 'last') => void
  selectValue: (value: TValue) => void
  selectActive: () => boolean
  createTag: (keyword?: string) => boolean
  removeLastSelected: () => void
  clear: () => void
}
