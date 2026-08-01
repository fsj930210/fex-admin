export type AutoCompleteKey = string | number
export type AutoCompleteInteraction = 'keyboard' | 'pointer' | null

export interface AutoCompleteItem {
  key: AutoCompleteKey
  value: string
  label?: string
  disabled?: boolean
}

type FieldNameByValue<TItem, TValue> = {
  [TKey in keyof TItem]-?: NonNullable<TItem[TKey]> extends TValue ? TKey : never
}[keyof TItem]

type CompatibleFieldName<TItem, TValue> = unknown extends TItem[keyof TItem]
  ? keyof TItem
  : FieldNameByValue<TItem, TValue>

export interface AutoCompleteFieldNames<TItem> {
  key: CompatibleFieldName<TItem, AutoCompleteKey>
  value: CompatibleFieldName<TItem, string>
  label?: CompatibleFieldName<TItem, string>
  disabled?: CompatibleFieldName<TItem, boolean>
}

export interface ResolvedAutoCompleteItem<TItem> {
  item: TItem
  key: AutoCompleteKey
  value: string
  label: string
  disabled: boolean
}

export type AutoCompleteFilterOption<TItem> = (keyword: string, item: TItem) => boolean

export type AutoCompleteChangeMeta<TItem> =
  | { reason: 'input'; previousValue: string; selectedItem?: undefined; selectedKey?: undefined }
  | {
      reason: 'select'
      previousValue: string
      selectedItem: TItem
      selectedKey: AutoCompleteKey
    }
  | { reason: 'clear'; previousValue: string; selectedItem?: undefined; selectedKey?: undefined }

export type AutoCompleteOpenReason =
  | 'focus'
  | 'input'
  | 'keyboard'
  | 'select'
  | 'escape'
  | 'outside'
  | 'blur'
  | 'programmatic'

export interface AutoCompleteSnapshot {
  value: string
  open: boolean
  activeKey: AutoCompleteKey | undefined
  interaction: AutoCompleteInteraction
}

export interface AutoCompleteControllerOptions<TItem> {
  items?: readonly TItem[] | undefined
  fieldNames?: Partial<AutoCompleteFieldNames<TItem>> | undefined
  value?: string | undefined
  defaultValue?: string | undefined
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  filterOption?: boolean | AutoCompleteFilterOption<TItem> | undefined
  autoHighlight?: boolean | undefined
  closeOnSelect?: boolean | undefined
  loop?: boolean | undefined
  onChange?: (value: string, meta: AutoCompleteChangeMeta<TItem>) => void
  onSearch?: (keyword: string, meta: { reason: 'input' | 'clear'; previousValue: string }) => void
  onSelect?: (
    value: string,
    meta: { selectedItem: TItem; selectedKey: AutoCompleteKey; previousValue: string },
  ) => void
  onClear?: (meta: { previousValue: string }) => void
  onOpenChange?: (open: boolean, meta: { reason: AutoCompleteOpenReason }) => void
}

export interface AutoCompleteController<TItem> {
  getSnapshot: () => AutoCompleteSnapshot
  subscribe: (listener: () => void) => () => void
  getVisibleItems: () => readonly ResolvedAutoCompleteItem<TItem>[]
  setValue: (value: string, reason?: 'input' | 'clear') => void
  setOpen: (open: boolean, reason?: AutoCompleteOpenReason) => void
  setActiveKey: (
    key: AutoCompleteKey | undefined,
    interaction?: Exclude<AutoCompleteInteraction, null>,
  ) => void
  moveActive: (direction: 1 | -1) => void
  selectItem: (key: AutoCompleteKey) => boolean
  selectActive: () => boolean
  clear: () => void
}
