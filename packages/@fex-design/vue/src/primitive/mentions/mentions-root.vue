<script setup lang="ts" generic="TData = unknown">
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
import { computed, provide, useId, watch } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { mentionsKey } from './context'

defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    value?: string
    defaultValue?: string
    prefix?: string | readonly string[]
    open?: boolean
    defaultOpen?: boolean
    disabled?: boolean
    readOnly?: boolean
    invalid?: boolean
    required?: boolean
    status?: 'error' | 'warning'
    class?: string
    parseQuery?: (input: MentionsParseInput) => MentionsQuery | null
  }>(),
  { open: undefined, disabled: false, readOnly: false, invalid: false, required: false },
)
const emit = defineEmits<{
  change: [value: string, meta: MentionsChangeMeta]
  search: [text: string, meta: MentionsSearchMeta]
  select: [item: MentionsRegisteredItem<TData>, meta: MentionsSelectMeta]
  openChange: [open: boolean, meta: { reason: MentionsOpenReason }]
}>()
function prefixes() {
  return Array.isArray(props.prefix) ? props.prefix : props.prefix ? [props.prefix] : ['@']
}
const controller = createMentionsController<TData>({
  get value() {
    return props.value
  },
  get defaultValue() {
    return props.defaultValue
  },
  get open() {
    return props.open
  },
  get defaultOpen() {
    return props.defaultOpen
  },
  get prefixes() {
    return prefixes()
  },
  get parseQuery() {
    return props.parseQuery
  },
  onChange: (value, meta) => emit('change', value, meta),
  onSearch: (text, meta) => emit('search', text, meta),
  onSelect: (item, meta) => emit('select', item, meta),
  onOpenChange: (open, meta) => emit('openChange', open, meta),
})
const snapshot = useCoreStore(controller)
watch(
  () => [props.value, props.open] as const,
  () => {
    snapshot.value = controller.getSnapshot()
  },
  { flush: 'sync' },
)
provide(mentionsKey, {
  controller,
  snapshot,
  listId: 'mentions-' + useId(),
  disabled: computed(() => props.disabled),
  readOnly: computed(() => props.readOnly),
  invalid: computed(() => props.invalid || props.status === 'error'),
  required: computed(() => props.required),
})
const className = computed(() => cn(mentionsRootClassName, props.class))
</script>

<template>
  <div v-bind="$attrs" data-slot="mentions-root" :class="className"><slot /></div>
</template>
