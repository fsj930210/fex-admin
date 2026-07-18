<script setup lang="ts">
import { scrollbarViewportClassName } from '@fex/components-styles/scrollbar'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ overflowX?: 'auto' | 'hidden'; overflowY?: 'auto' | 'hidden' }>(), { overflowX: 'auto', overflowY: 'auto' })
const attrs = useAttrs()
</script>
<template><div v-bind="attrs" data-slot="scrollbar-viewport" :class="cn(scrollbarViewportClassName({ overflowX: props.overflowX, overflowY: props.overflowY }), attrs.class as string | undefined)"><slot /></div></template>
