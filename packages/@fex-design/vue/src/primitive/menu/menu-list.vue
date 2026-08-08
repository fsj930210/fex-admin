<script setup lang="ts">
import {
  handleMenuListFocus,
  handleMenuListKeyDown,
  syncMenuListTabStops,
  type MenuOrientation,
} from '@fex-design/core/menu/navigation'
import { onMounted, onUpdated, ref, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{ orientation?: MenuOrientation; parentValue?: string | number }>(),
  { orientation: 'vertical', parentValue: undefined },
)
const attrs = useAttrs()
const element = ref<HTMLElement | null>(null)
const role = () => (attrs.role as string | undefined) ?? 'group'

function sync() {
  if (element.value) syncMenuListTabStops(element.value)
}

function onFocus(event: FocusEvent) {
  handleMenuListFocus(event)
}

function onKeydown(event: KeyboardEvent) {
  if (element.value) handleMenuListKeyDown(event, element.value, props.orientation)
}

onMounted(sync)
onUpdated(sync)
</script>

<template>
  <div
    v-bind="attrs"
    ref="element"
    :role="role()"
    :aria-orientation="orientation"
    :data-orientation="orientation"
    :data-parent-value="parentValue"
    data-slot="menu-list"
    @focus="onFocus"
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>
