<script setup lang="ts">
import type { ScrollbarAxis } from '@fex/components-core/scrollbar/types'
import { scrollbarTrackClassName } from '@fex/components-styles/scrollbar'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'
defineOptions({ inheritAttrs: false }); defineProps<{ axis: ScrollbarAxis }>(); const attrs = useAttrs()
</script>
<template><div v-bind="attrs" data-slot="scrollbar-track" :class="cn(scrollbarTrackClassName, attrs.class as string | undefined)"><slot /></div></template>
