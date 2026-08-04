<script setup lang="ts">
import { buttonPrimitiveClassName } from '@fex-design/styles/button'
import { cn } from '@fex/utils'
import { computed, useAttrs, useTemplateRef } from 'vue'

export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
})
const emit = defineEmits<{ click: [event: MouseEvent] }>()

const attrs = useAttrs()
const elementRef = useTemplateRef<HTMLButtonElement>('buttonElement')
const className = computed(() => cn(buttonPrimitiveClassName, attrs.class as string | undefined))

function handleClick(event: MouseEvent) {
  emit('click', event)
}

defineExpose({
  elementRef,
})
</script>

<template>
  <button
    ref="buttonElement"
    data-slot="button"
    @click="handleClick"
    v-bind="{ ...attrs, class: undefined }"
    :class="className"
    :type="props.type"
  >
    <slot />
  </button>
</template>
