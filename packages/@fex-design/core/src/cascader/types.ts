export type CascaderPrimitive = string | number
export type CascaderOption = Record<string, unknown>
export type CascaderPathValue = readonly CascaderPrimitive[]
export type CascaderValue = CascaderPathValue | readonly CascaderPathValue[] | undefined

export interface CascaderFieldNames {
  value?: string | undefined
  label?: string | undefined
  children?: string | undefined
  disabled?: string | undefined
  isLeaf?: string | undefined
}

export interface ResolvedCascaderFieldNames {
  value: string
  label: string
  children: string
  disabled: string
  isLeaf: string
}

export interface CascaderNode {
  key: string
  value: CascaderPrimitive
  label: string
  option: CascaderOption
  parentKey: string | undefined
  depth: number
  pathKeys: readonly string[]
  pathValues: CascaderPathValue
  disabled: boolean
  leaf: boolean
}

export interface CascaderColumn {
  parentKey: string | undefined
  nodes: readonly CascaderNode[]
}

export type CascaderFilterOption = (
  keyword: string,
  path: readonly CascaderOption[],
) => boolean

export interface CascaderChangeMeta {
  selectedOptions: readonly CascaderOption[]
  selectedPaths: readonly (readonly CascaderOption[])[]
  previousValue: CascaderValue
}

export interface CascaderSnapshot {
  open: boolean
  searchValue: string
  activePath: readonly string[]
  selectedPathKeys: readonly string[]
  checkedKeys: readonly string[]
  indeterminateKeys: readonly string[]
  loadingKeys: readonly string[]
  interaction: 'keyboard' | 'pointer' | null
}

export interface CascaderControllerOptions {
  options?: readonly CascaderOption[] | undefined
  fieldNames?: CascaderFieldNames | undefined
  value?: CascaderValue
  defaultValue?: CascaderValue
  multiple?: boolean | undefined
  checkStrictly?: boolean | undefined
  changeOnSelect?: boolean | undefined
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  expandTrigger?: 'click' | 'hover' | undefined
  filterOption?: boolean | CascaderFilterOption | undefined
  onChange?: ((value: CascaderValue, meta: CascaderChangeMeta) => void) | undefined
  onOpenChange?: ((open: boolean) => void) | undefined
  onSearch?: ((keyword: string) => void) | undefined
  loadData?: ((selectedOptions: readonly CascaderOption[]) => Promise<void>) | undefined
}

export interface CascaderController {
  getSnapshot: () => CascaderSnapshot
  subscribe: (listener: () => void) => () => void
  getNode: (key: string) => CascaderNode | undefined
  getPath: (key: string) => readonly CascaderNode[]
  getColumns: () => readonly CascaderColumn[]
  getSearchResults: () => readonly (readonly CascaderNode[])[]
  getSelectedPaths: () => readonly (readonly CascaderNode[])[]
  refresh: () => void
  open: () => void
  close: () => void
  toggleOpen: () => void
  setSearchValue: (keyword: string) => void
  activate: (key: string, interaction?: 'keyboard' | 'pointer') => void
  expand: (key: string) => void
  select: (key: string) => void
  toggleCheck: (key: string) => void
  removePath: (key: string) => void
  clear: () => void
  moveActive: (direction: 1 | -1) => void
  moveToBoundary: (position: 'first' | 'last') => void
  moveToParent: () => void
  moveToChild: () => void
  selectActive: () => boolean
  load: (key: string) => Promise<void>
}
