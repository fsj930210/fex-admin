<script setup lang="ts">
import { resolveConversationSide, type BubbleGroupSpacing, type ConversationSide } from '@fex-design/core/bubble/types'; import { bubbleGroupClassName } from '@fex-design/styles/bubble'; import { cn } from '@fex/utils'; import { computed, inject, useAttrs } from 'vue'; import { messageSideKey } from './context'
defineOptions({ inheritAttrs: false }); const props = withDefaults(defineProps<{ side?: ConversationSide; spacing?: BubbleGroupSpacing }>(), { spacing: 'default' }); const attrs=useAttrs(); const inherited=inject(messageSideKey, undefined); const resolvedSide=computed(()=>resolveConversationSide(props.side,inherited?.value))
</script>
<template><div v-bind="attrs" data-slot="bubble-group" :data-side="resolvedSide" :data-spacing="spacing" :class="cn(bubbleGroupClassName({ spacing }), attrs.class as string | undefined)"><slot /></div></template>
