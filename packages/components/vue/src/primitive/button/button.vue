<script setup lang="ts">
import { buttonPrimitiveClassName } from '@fex/components-styles/button'
import { cn } from '@fex/utils'
import { computed, useAttrs, useTemplateRef } from 'vue'

export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
})

const attrs = useAttrs()
const elementRef = useTemplateRef<HTMLButtonElement>('buttonElement')
const className = computed(() => cn(buttonPrimitiveClassName, attrs.class as string | undefined))

defineExpose({
  elementRef,
})
</script>

<template>
  <button
    ref="buttonElement"
    v-bind="{ ...attrs, class: undefined }"
    :class="className"
    data-slot="button"
    :type="props.type"
  >
    <slot />
  </button>
</template>
