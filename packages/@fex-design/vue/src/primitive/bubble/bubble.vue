<script setup lang="ts">
import { resolveConversationSide, type BubbleSize, type BubbleVariant, type ConversationSide } from '@fex-design/core/bubble/types'
import { bubbleClassName } from '@fex-design/styles/bubble'
import { cn } from '@fex/utils'
import { computed, inject, provide, toRef, useAttrs } from 'vue'
import { bubbleKey, messageSideKey } from './context'
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ side?: ConversationSide; variant?: BubbleVariant; size?: BubbleSize }>(), { variant: 'soft', size: 'md' })
const attrs = useAttrs(); const inherited = inject(messageSideKey, undefined)
const side = computed(() => resolveConversationSide(props.side, inherited?.value))
provide(bubbleKey, { side, size: toRef(props, 'size'), variant: toRef(props, 'variant') })
</script>
<template><div v-bind="attrs" data-slot="bubble" :data-side="side" :data-variant="variant" :data-size="size" :class="cn(bubbleClassName({ size }), attrs.class as string | undefined)"><slot /></div></template>
