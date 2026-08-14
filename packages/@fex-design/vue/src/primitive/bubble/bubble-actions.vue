<script setup lang="ts">
import type { BubbleAttachmentSide, BubbleVisibility, ConversationSide } from '@fex-design/core/bubble/types'; import { bubbleActionsClassName } from '@fex-design/styles/bubble'; import { cn } from '@fex/utils'; import { computed, inject, useAttrs } from 'vue'; import { bubbleKey } from './context'
defineOptions({ inheritAttrs:false }); const props=withDefaults(defineProps<{side?:BubbleAttachmentSide;align?:ConversationSide;visibility?:BubbleVisibility}>(),{side:'bottom',visibility:'always'}); const attrs=useAttrs(); const context=inject(bubbleKey); const resolvedAlign=computed(()=>props.align??context?.side.value??'start')
</script>
<template><div v-bind="attrs" data-slot="bubble-actions" :data-side="side" :data-align="resolvedAlign" :data-visibility="visibility" :class="cn(bubbleActionsClassName({ side }), attrs.class as string | undefined)"><slot /></div></template>
