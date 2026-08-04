<script setup lang="ts">
import type { ExpansionChangeMeta, ExpansionKey } from '@fex-design/core/expansion/types'
import { collapseRootClassName } from '@fex-design/styles/collapse'
import { cn } from '@fex/utils'
import { computed, provide, useAttrs } from 'vue'
import { collapseContextKey, type CollapseSize, type CollapseVariant } from './context'
import { useCollapse } from './use-collapse'

defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    expandedKeys?: readonly ExpansionKey[]
    defaultExpandedKeys?: readonly ExpansionKey[]
    disabledKeys?: readonly ExpansionKey[]
    multiple?: boolean
    collapsible?: boolean
    variant?: CollapseVariant
    size?: CollapseSize
  }>(),
  { multiple: true, collapsible: true, variant: 'outlined', size: 'md' },
)
const emit = defineEmits<{
  change: [keys: ExpansionKey[], meta: ExpansionChangeMeta]
}>()
const attrs = useAttrs()
const collapse = useCollapse({
  get expandedKeys() {
    return props.expandedKeys
  },
  get defaultExpandedKeys() {
    return props.defaultExpandedKeys
  },
  get disabledKeys() {
    return props.disabledKeys
  },
  get multiple() {
    return props.multiple
  },
  get collapsible() {
    return props.collapsible
  },
  onChange(keys, meta) {
    emit('change', keys, meta)
  },
})
const className = computed(() =>
  cn(collapseRootClassName({ variant: props.variant, size: props.size }), attrs.class as string),
)
provide(collapseContextKey, {
  ...collapse,
  variant: () => props.variant,
  size: () => props.size,
})
defineExpose({
  expand: collapse.expand,
  collapse: collapse.collapse,
  toggle: collapse.toggle,
  setExpandedKeys: collapse.setExpandedKeys,
  clear: collapse.clear,
  getExpandedKeys: collapse.getExpandedKeys,
  isExpanded: collapse.isExpanded,
  isDisabled: collapse.isDisabled,
})
</script>

<template>
  <div
    v-bind="{ ...attrs, class: undefined }"
    data-slot="collapse"
    :data-variant="variant"
    :class="className"
  >
    <slot />
  </div>
</template>
