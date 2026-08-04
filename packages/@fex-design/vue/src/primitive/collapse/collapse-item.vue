<script setup lang="ts">
import type { ExpansionKey } from '@fex-design/core/expansion/types'
import { collapseItemClassName } from '@fex-design/styles/collapse'
import { cn } from '@fex/utils'
import { computed, inject, provide, shallowRef, useAttrs, useId, watchEffect } from 'vue'
import { collapseContextKey, collapseItemContextKey } from './context'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ value: ExpansionKey; disabled?: boolean }>(), {
  disabled: false,
})
const attrs = useAttrs()
const collapse = inject(collapseContextKey)
if (!collapse) throw new Error('CollapseItem must be used inside CollapseRoot.')
const fallbackId = useId()
const safeValue = computed(() => String(props.value).replace(/\s+/g, '-') || fallbackId)
const triggerId = computed(() => collapse.baseId + '-' + safeValue.value + '-trigger')
const contentId = computed(() => collapse.baseId + '-' + safeValue.value + '-content')
const disabled = shallowRef(false)
watchEffect(() => {
  disabled.value = props.disabled || collapse.isDisabled(props.value)
})
const expanded = computed(() => collapse.isExpanded(props.value))
const className = computed(() =>
  cn(collapseItemClassName({ variant: collapse.variant() }), attrs.class as string),
)
const actions = {
  expand: () => collapse.expand(props.value),
  collapse: () => collapse.collapse(props.value),
  toggle: () => collapse.toggle(props.value),
}
provide(collapseItemContextKey, {
  value: props.value,
  disabled,
  get triggerId() {
    return triggerId.value
  },
  get contentId() {
    return contentId.value
  },
})
</script>

<template>
  <div
    v-bind="{ ...attrs, class: undefined }"
    data-slot="collapse-item"
    :data-state="expanded ? 'open' : 'closed'"
    :data-disabled="disabled || undefined"
    :class="className"
  >
    <slot
      :state="{ expanded, disabled }"
      :actions="actions"
    />
  </div>
</template>
