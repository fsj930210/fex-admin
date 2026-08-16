<script setup lang="ts">
import { buttonGroupClassName } from '@fex-design/styles/button'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  orientation?: 'horizontal' | 'vertical'
  spacing?: number | string
}>(), { orientation: 'horizontal', spacing: 0 })
const attrs = useAttrs()
const className = computed(() => cn(buttonGroupClassName({
  orientation: props.orientation,
  connected: props.spacing === 0,
}), attrs.class as string | undefined))
const style = computed(() => ({
  ...(attrs.style as Record<string, unknown> | undefined),
  gap: typeof props.spacing === 'number' ? `${props.spacing}px` : props.spacing,
}))
</script>

<template>
  <div v-bind="{ ...attrs, class: undefined, style: undefined }" role="group" data-slot="button-group" :data-orientation="props.orientation" :class="className" :style="style"><slot /></div>
</template>
