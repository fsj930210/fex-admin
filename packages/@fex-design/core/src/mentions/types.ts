export type MentionsKey = string | number

export type MentionsInteraction = 'keyboard' | 'pointer' | null

export interface MentionsSelection {
  start: number
  end: number
}

export interface MentionsQuery {
  prefix: string
  text: string
  start: number
  end: number
}

export interface MentionsParseInput {
  value: string
  selectionStart: number
  selectionEnd: number
  prefixes: readonly string[]
}

export interface MentionsRegisteredItem<TData = unknown> {
  key: MentionsKey
  value: string
  disabled: boolean
  data?: TData | undefined
}

export interface MentionsSnapshot {
  value: string
  open: boolean
  query: MentionsQuery | null
  activeKey: MentionsKey | undefined
  interaction: MentionsInteraction
}

export type MentionsChangeReason = 'input'

export interface MentionsChangeMeta {
  reason: MentionsChangeReason
}

export type MentionsOpenReason =
  | 'input'
  | 'selection'
  | 'keyboard'
  | 'select'
  | 'escape'
  | 'outside'
  | 'blur'
  | 'programmatic'

export interface MentionsSearchMeta {
  prefix: string
  query: MentionsQuery
}

export interface MentionsSelectMeta {
  prefix: string
  text: string
  query: MentionsQuery
}

export interface MentionsControllerConfig<TData = unknown> {
  value?: string | undefined
  defaultValue?: string | undefined
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  prefixes?: readonly string[] | undefined
  parseQuery?: ((input: MentionsParseInput) => MentionsQuery | null) | undefined
  onChange?: ((value: string, meta: MentionsChangeMeta) => void) | undefined
  onSearch?: ((text: string, meta: MentionsSearchMeta) => void) | undefined
  onSelect?:
    | ((item: MentionsRegisteredItem<TData>, meta: MentionsSelectMeta) => void)
    | undefined
  onOpenChange?: ((open: boolean, meta: { reason: MentionsOpenReason }) => void) | undefined
}

export interface MentionsController<TData = unknown> {
  getSnapshot: () => MentionsSnapshot
  subscribe: (listener: () => void) => () => void
  setValue: (value: string, selection: MentionsSelection, reason?: MentionsChangeReason) => void
  setSelection: (selection: MentionsSelection, reason?: 'selection') => void
  setOpen: (open: boolean, reason?: MentionsOpenReason) => void
  registerItem: (item: MentionsRegisteredItem<TData>) => () => void
  getItems: () => readonly MentionsRegisteredItem<TData>[]
  moveActive: (direction: 1 | -1) => void
  setActiveKey: (key: MentionsKey | undefined, interaction?: Exclude<MentionsInteraction, null>) => void
  selectItem: (key: MentionsKey) => boolean
  selectActive: () => boolean
}
