import { createMentionsController } from '@fex-design/core/mentions/create-mentions-controller'
import type {
  MentionsChangeMeta,
  MentionsControllerConfig,
  MentionsOpenReason,
  MentionsParseInput,
  MentionsQuery,
  MentionsRegisteredItem,
  MentionsSearchMeta,
  MentionsSelectMeta,
} from '@fex-design/core/mentions/types'
import { mentionsRootClassName } from '@fex-design/styles/mentions'
import { cn } from '@fex/utils'
import { type HTMLAttributes, type ReactNode, useId, useRef } from 'react'
import { useCoreStore } from '../../hooks/use-core-store'
import { MentionsContext } from './mentions-context'

function normalizePrefix(prefix: string | readonly string[] | undefined) {
  if (Array.isArray(prefix)) return prefix
  return prefix ? [prefix] : ['@']
}

export interface MentionsRootProps<TData = unknown>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  value?: string | undefined
  defaultValue?: string | undefined
  onChange?: ((value: string, meta: MentionsChangeMeta) => void) | undefined
  prefix?: string | readonly string[] | undefined
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  onOpenChange?: ((open: boolean, meta: { reason: MentionsOpenReason }) => void) | undefined
  onSearch?: ((text: string, meta: MentionsSearchMeta) => void) | undefined
  onSelect?: ((item: MentionsRegisteredItem<TData>, meta: MentionsSelectMeta) => void) | undefined
  parseQuery?: ((input: MentionsParseInput) => MentionsQuery | null) | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  invalid?: boolean | undefined
  required?: boolean | undefined
  status?: 'error' | 'warning' | undefined
  children?: ReactNode
}

export function MentionsRoot<TData = unknown>({
  value,
  defaultValue,
  onChange,
  prefix,
  open,
  defaultOpen,
  onOpenChange,
  onSearch,
  onSelect,
  parseQuery,
  disabled = false,
  readOnly = false,
  invalid = false,
  required = false,
  status,
  className,
  children,
  ...props
}: MentionsRootProps<TData>) {
  const latest = useRef<MentionsControllerConfig<TData>>({})
  latest.current = {
    value,
    defaultValue,
    open,
    defaultOpen,
    prefixes: normalizePrefix(prefix),
    parseQuery,
    onChange,
    onOpenChange,
    onSearch,
    onSelect,
  }
  const controllerRef = useRef<ReturnType<typeof createMentionsController<TData>> | null>(null)
  controllerRef.current ??= createMentionsController<TData>({
    get value() {
      return latest.current.value
    },
    get defaultValue() {
      return latest.current.defaultValue
    },
    get open() {
      return latest.current.open
    },
    get defaultOpen() {
      return latest.current.defaultOpen
    },
    get prefixes() {
      return latest.current.prefixes
    },
    get parseQuery() {
      return latest.current.parseQuery
    },
    onChange: (nextValue, meta) => latest.current.onChange?.(nextValue, meta),
    onOpenChange: (nextOpen, meta) => latest.current.onOpenChange?.(nextOpen, meta),
    onSearch: (text, meta) => latest.current.onSearch?.(text, meta),
    onSelect: (item, meta) => latest.current.onSelect?.(item as MentionsRegisteredItem<TData>, meta),
  })
  const snapshot = useCoreStore(controllerRef.current)
  const listId = 'mentions-' + useId()

  return (
    <MentionsContext
      value={{
        controller: controllerRef.current,
        snapshot,
        listId,
        disabled,
        readOnly,
        invalid: invalid || status === 'error',
        required,
        status,
        setTriggerElement: () => {},
      }}
    >
      <div {...props} data-slot="mentions-root" className={cn(mentionsRootClassName, className)}>
        {children}
      </div>
    </MentionsContext>
  )
}
