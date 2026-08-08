<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    disabled?: boolean
    selected?: boolean
    submenu?: boolean
    value?: string | number
  }>(),
  { disabled: false, selected: false, submenu: false },
)
const attrs = useAttrs()
const slots = useSlots()
const itemProps = computed(() => ({
  ...attrs,
  role: (attrs.role as string | undefined) ?? 'menuitem',
  tabindex: props.disabled ? -1 : ((attrs.tabindex as number | undefined) ?? -1),
  'aria-disabled': props.disabled || undefined,
  'aria-haspopup': props.submenu ? 'menu' : undefined,
  'data-slot': 'menu-item',
  'data-menu-value': props.value === undefined ? undefined : String(props.value),
  'data-selected': props.selected ? 'true' : undefined,
}))
const state = computed(() => ({
  disabled: props.disabled,
  selected: props.selected,
  submenu: props.submenu,
}))
</script>

<template>
  <slot v-if="slots.trigger" name="trigger" :props="itemProps" :state="state" />
  <button v-else v-bind="itemProps" type="button" :disabled="disabled"><slot /></button>
</template>
