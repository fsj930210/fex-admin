<script setup lang="ts">
import { mentionsListClassName } from '@fex-design/styles/mentions'
import { cn } from '@fex/utils'
import { computed } from 'vue'
import ListboxRoot from '../listbox/listbox-root.vue'
import { useMentions } from './context'

const props = defineProps<{ class?: string }>()
const mentions = useMentions('MentionsList')
const className = computed(() => cn(mentionsListClassName, props.class))
</script>

<template>
  <ListboxRoot
    :id="mentions.listId"
    :value="mentions.snapshot.value.activeKey"
    :class="className"
    @change="(value) => mentions.controller.setActiveKey(Array.isArray(value) ? value[0] : value)"
  >
    <slot />
  </ListboxRoot>
</template>
