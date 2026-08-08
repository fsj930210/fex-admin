<script setup lang="ts" generic="TData = unknown">
import type { MentionsKey, MentionsRegisteredItem } from '@fex-design/core/mentions/types'
import { mentionsItemClassName } from '@fex-design/styles/mentions'
import { cn } from '@fex/utils'
import { computed, onScopeDispose, watchEffect } from 'vue'
import ListboxItem from '../listbox/listbox-item.vue'
import { useMentions } from './context'

const props = withDefaults(
  defineProps<{
    itemKey?: MentionsKey
    value: string
    disabled?: boolean
    data?: TData
    class?: string
  }>(),
  { disabled: false },
)
const mentions = useMentions('MentionsItem')
const key = computed(() => props.itemKey ?? props.value)
const active = computed(() => mentions.snapshot.value.activeKey === key.value)
const item = computed<MentionsRegisteredItem<TData>>(() => ({
  key: key.value,
  value: props.value,
  disabled: props.disabled,
  data: props.data,
}))
let unregister: (() => void) | undefined
watchEffect(() => {
  unregister?.()
  unregister = mentions.controller.registerItem(item.value)
})
onScopeDispose(() => unregister?.())
const className = computed(() => cn(mentionsItemClassName, props.class))
</script>

<template>
  <ListboxItem
    :id="`${mentions.listId}-${key}`"
    :value="key"
    :disabled="props.disabled"
    :class="className"
    @pointermove="mentions.controller.setActiveKey(key, 'pointer')"
    @pointerdown.prevent
    @select="mentions.controller.selectItem(key)"
  >
    <slot :active="active" :disabled="props.disabled" :item="item">{{ props.value }}</slot>
  </ListboxItem>
</template>
