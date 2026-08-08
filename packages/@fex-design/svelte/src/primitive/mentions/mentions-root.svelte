<script lang="ts">
  import { createMentionsController } from '@fex-design/core/mentions/create-mentions-controller'
  import type {
    MentionsChangeMeta,
    MentionsOpenReason,
    MentionsParseInput,
    MentionsQuery,
    MentionsRegisteredItem,
    MentionsSearchMeta,
    MentionsSelectMeta,
  } from '@fex-design/core/mentions/types'
  import { mentionsRootClassName } from '@fex-design/styles/mentions'
  import { cn } from '@fex/utils'
  import { onDestroy } from 'svelte'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { setMentionsContext } from './context'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'> {
    class?: string | undefined
    value?: string | undefined
    defaultValue?: string | undefined
    prefix?: string | readonly string[] | undefined
    open?: boolean | undefined
    defaultOpen?: boolean | undefined
    disabled?: boolean | undefined
    readOnly?: boolean | undefined
    invalid?: boolean | undefined
    required?: boolean | undefined
    status?: 'error' | 'warning' | undefined
    parseQuery?: ((input: MentionsParseInput) => MentionsQuery | null) | undefined
    onChange?: ((value: string, meta: MentionsChangeMeta) => void) | undefined
    onSearch?: ((text: string, meta: MentionsSearchMeta) => void) | undefined
    onSelect?: ((item: MentionsRegisteredItem, meta: MentionsSelectMeta) => void) | undefined
    onOpenChange?: ((open: boolean, meta: { reason: MentionsOpenReason }) => void) | undefined
    children?: Snippet | undefined
  }

  let {
    class: className,
    value,
    defaultValue,
    prefix,
    open,
    defaultOpen,
    disabled = false,
    readOnly = false,
    invalid = false,
    required = false,
    status,
    parseQuery,
    onChange,
    onSearch,
    onSelect,
    onOpenChange,
    children,
    ...rest
  }: Props = $props()

  function prefixes() {
    return Array.isArray(prefix) ? prefix : prefix ? [prefix] : ['@']
  }

  const controller = createMentionsController({
    get value() {
      return value
    },
    get defaultValue() {
      return defaultValue
    },
    get open() {
      return open
    },
    get defaultOpen() {
      return defaultOpen
    },
    get prefixes() {
      return prefixes()
    },
    get parseQuery() {
      return parseQuery
    },
    onChange: (nextValue, meta) => onChange?.(nextValue, meta),
    onSearch: (text, meta) => onSearch?.(text, meta),
    onSelect: (item, meta) => onSelect?.(item, meta),
    onOpenChange: (nextOpen, meta) => onOpenChange?.(nextOpen, meta),
  })
  let snapshot = $state(controller.getSnapshot())
  const unsubscribe = controller.subscribe(() => {
    snapshot = controller.getSnapshot()
  })
  onDestroy(unsubscribe)
  const listId = 'mentions-' + Math.random().toString(36).slice(2)
  setMentionsContext({
    controller,
    snapshot: () => snapshot,
    listId,
    disabled: () => disabled,
    readOnly: () => readOnly,
    invalid: () => invalid || status === 'error',
    required: () => required,
  })
</script>

<div {...rest} data-slot="mentions-root" class={cn(mentionsRootClassName, className)}>
  {@render children?.()}
</div>
