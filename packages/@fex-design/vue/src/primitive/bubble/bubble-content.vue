<script setup lang="ts">
import { bubbleContentClassName } from '@fex-design/styles/bubble'; import { cn } from '@fex/utils'; import { computed, inject, useAttrs } from 'vue'; import { bubbleKey } from './context'
defineOptions({ inheritAttrs: false }); const attrs = useAttrs(); const context = inject(bubbleKey)
const state = computed(() => ({ side: context?.side.value ?? 'start', size: context?.size.value ?? 'md', variant: context?.variant.value ?? 'soft' }))
const binding = computed(() => ({ ...attrs, 'data-slot': 'bubble-content', 'data-side': state.value.side, class: cn(bubbleContentClassName({ size: state.value.size, variant: state.value.variant }), attrs.class as string | undefined) }))
</script>
<template><slot name="render" :props="binding" :state="state"><div v-bind="binding"><slot /></div></slot></template>
