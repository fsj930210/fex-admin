<script setup lang="ts">
import { autoCompleteOptionClassName } from '@fex-design/styles/auto-complete'
import { cn } from '@fex/utils'
import { computed } from 'vue'
import { useAutoComplete } from './use-auto-complete'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ itemKey: string | number; class?: string }>()
const autoComplete = useAutoComplete('AutoCompleteOption')
const entry = computed(() => autoComplete.items.value.find((item) => item.key === props.itemKey))
const active = computed(() => autoComplete.snapshot.value.activeKey === props.itemKey)
</script>
<template>
  <div
    v-bind="$attrs"
    :id="`${autoComplete.listId}-${props.itemKey}`"
    role="option"
    :aria-selected="active"
    :aria-disabled="entry?.disabled || undefined"
    :data-active="active || undefined"
    :data-disabled="entry?.disabled || undefined"
    :class="cn(autoCompleteOptionClassName, props.class)"
    @pointermove="autoComplete.controller.setActiveKey(props.itemKey, 'pointer')"
    @pointerdown.prevent
    @click="autoComplete.controller.selectItem(props.itemKey)"
  >
    <slot>{{ entry?.label }}</slot>
  </div>
</template>
