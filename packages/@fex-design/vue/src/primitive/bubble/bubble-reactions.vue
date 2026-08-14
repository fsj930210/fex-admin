<script setup lang="ts">
import type { BubbleAttachmentSide, ConversationSide } from '@fex-design/core/bubble/types'; import { bubbleReactionsClassName } from '@fex-design/styles/bubble'; import { cn } from '@fex/utils'; import { computed, inject, useAttrs } from 'vue'; import { bubbleKey } from './context'
defineOptions({inheritAttrs:false}); const props=withDefaults(defineProps<{side?:BubbleAttachmentSide;align?:ConversationSide}>(),{side:'bottom'}); const attrs=useAttrs(); const context=inject(bubbleKey); const resolvedAlign=computed(()=>props.align??context?.side.value??'start')
</script>
<template><div v-bind="attrs" data-slot="bubble-reactions" :data-side="side" :data-align="resolvedAlign" :class="cn(bubbleReactionsClassName({ side }), attrs.class as string | undefined)"><slot /></div></template>
