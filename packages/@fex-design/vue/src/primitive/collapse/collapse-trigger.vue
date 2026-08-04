<script setup lang="ts">
import { collapseIconClassName, collapseTriggerClassName } from '@fex-design/styles/collapse'
import { cn } from '@fex/utils'
import { computed, inject, useAttrs } from 'vue'
import PrimitiveButton from '../button/button.vue'
import { ChevronRightIcon } from '../../icon/chevron'
import { collapseContextKey, collapseItemContextKey } from './context'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ showIcon?: boolean }>(), { showIcon: true })
const attrs = useAttrs()
const collapseContext = inject(collapseContextKey)
const itemContext = inject(collapseItemContextKey)
if (!collapseContext || !itemContext) throw new Error('CollapseTrigger must be used inside CollapseItem.')
const collapse = collapseContext
const item = itemContext
const expanded = computed(() => collapse.isExpanded(item.value))
const disabled = computed(() => item.disabled.value || collapse.isDisabled(item.value))
const triggerAttrs = computed(() => {
  const { class: _class, onClick: _onClick, ...rest } = attrs
  return rest
})
const triggerProps = computed(() => ({
  type: 'button' as const,
  id: item.triggerId,
  disabled: disabled.value,
  'aria-expanded': expanded.value,
  'aria-controls': item.contentId,
  'data-slot': 'collapse-trigger',
  'data-state': expanded.value ? 'open' : 'closed',
  class: cn(collapseTriggerClassName({ variant: collapse.variant() }), attrs.class as string),
}))

function handleClick(event: MouseEvent) {
  const listener = attrs.onClick
  if (typeof listener === 'function') listener(event)
  if (!event.defaultPrevented && !disabled.value) collapse.toggle(item.value)
}
</script>

<template>
  <slot
    v-if="$slots.render"
    name="render"
    :props="triggerProps"
    :state="{ expanded, disabled }"
    :iconClass="collapseIconClassName"
  />
  <PrimitiveButton
    v-else
    v-bind="triggerAttrs"
    :type="triggerProps.type"
    :id="triggerProps.id"
    :disabled="triggerProps.disabled"
    :aria-expanded="triggerProps['aria-expanded']"
    :aria-controls="triggerProps['aria-controls']"
    data-slot="collapse-trigger"
    :data-state="triggerProps['data-state']"
    :class="triggerProps.class"
    @click="handleClick"
  >
    <span class="min-w-0 flex-1"><slot /></span>
    <ChevronRightIcon
      v-if="props.showIcon"
      :class="collapseIconClassName"
    />
  </PrimitiveButton>
</template>
