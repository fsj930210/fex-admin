<script setup lang="ts">
import { inputClearClassName } from '@fex/components-styles/input'
import { cn } from '@fex/utils'
import { computed, inject } from 'vue'
import { CloseIcon } from '../../icon/close'
import PrimitiveButton from '../button/button.vue'
import { inputContextKey } from './input-context'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ class?: string; forceMount?: boolean }>(), {
  forceMount: false,
})
const emit = defineEmits<{ click: [event: MouseEvent]; pointerdown: [event: PointerEvent] }>()
const input = inject(inputContextKey)
if (!input) throw new Error('InputClear must be used inside InputRoot.')
const inputContext = input
const className = computed(() => cn(inputClearClassName, props.class))

function pointerdown(event: PointerEvent) {
  emit('pointerdown', event)
  if (!event.defaultPrevented) event.preventDefault()
}

function click(event: MouseEvent) {
  emit('click', event)
  if (!event.defaultPrevented) inputContext.clear()
}
</script>

<template>
  <PrimitiveButton
    v-if="props.forceMount || inputContext.canClear.value"
    v-bind="$attrs"
    type="button"
    data-slot="input-clear"
    :data-visible="inputContext.canClear.value"
    :disabled="!props.forceMount && !inputContext.canClear.value"
    :class="className"
    @pointerdown="pointerdown"
    @click="click"
  >
    <slot><CloseIcon /></slot>
  </PrimitiveButton>
</template>
