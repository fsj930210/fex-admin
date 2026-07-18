<script setup lang="ts">
import { createScrollbarController } from '@fex/components-core/scrollbar/create-scrollbar-controller'
import type { ScrollbarAutoHide, ScrollbarClickScroll, ScrollbarScrollDetail, ScrollbarVisibility } from '@fex/components-core/scrollbar/types'
import { scrollbarRootClassName } from '@fex/components-styles/scrollbar'
import { cn } from '@fex/utils'
import { onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ visibility?: ScrollbarVisibility; autoHide?: ScrollbarAutoHide; autoHideDelay?: number; dragScroll?: boolean; clickScroll?: ScrollbarClickScroll; minThumbSize?: number; disabled?: boolean }>(), { visibility: 'auto', autoHide: 'scroll', autoHideDelay: 900, dragScroll: true, clickScroll: false, minThumbSize: 24, disabled: false })
const emit = defineEmits<{ scrollChange: [detail: ScrollbarScrollDetail] }>()
const attrs = useAttrs()
const root = ref<HTMLDivElement>()
let destroy: (() => void) | undefined
onMounted(() => {
  if (!root.value) return
  const controller = createScrollbarController({ ...props, onScroll: (detail) => emit('scrollChange', detail) })
  destroy = controller.connect(root.value)
})
onBeforeUnmount(() => destroy?.())
</script>
<template><div v-bind="attrs" ref="root" data-slot="scrollbar-root" :class="cn(scrollbarRootClassName, attrs.class as string | undefined)"><slot /></div></template>
