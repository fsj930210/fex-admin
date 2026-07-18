<script setup lang="ts">
import type { ScrollbarAxis } from '@fex/components-core/scrollbar/types'
import { scrollbarBarClassName } from '@fex/components-styles/scrollbar'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'
import ScrollbarThumb from './scrollbar-thumb.vue'
import ScrollbarTrack from './scrollbar-track.vue'
defineOptions({ inheritAttrs: false })
const props = defineProps<{ axis: ScrollbarAxis }>()
const attrs = useAttrs()
</script>
<template><div v-bind="attrs" data-slot="scrollbar-bar" :data-axis="props.axis" data-visible="false" :class="cn(scrollbarBarClassName({ axis: props.axis }), attrs.class as string | undefined)"><slot><ScrollbarTrack :axis="props.axis"><ScrollbarThumb :axis="props.axis" /></ScrollbarTrack></slot></div></template>
