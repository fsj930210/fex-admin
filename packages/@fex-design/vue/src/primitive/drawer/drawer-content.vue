<script setup lang="ts">
import { drawerContentClassName } from '@fex-design/styles/drawer'
import { cn } from '@fex/utils'
import { computed, onBeforeUnmount } from 'vue'
import { useResize } from '../../composables/use-resize'
import { useDrawerContext } from './context'

const props = defineProps<{ class?: string; size?: string | number; style?: Record<string, string> }>()
const context = useDrawerContext('DrawerContent')
const { drawer, snapshot, placement } = context
const horizontal = computed(() => placement.value === 'left' || placement.value === 'right')
const edge = computed(() => ({ left: 'right', right: 'left', top: 'bottom', bottom: 'top' }[placement.value ?? 'right'] as 'top' | 'right' | 'bottom' | 'left'))
const numericSize = typeof props.size === 'number'
  ? props.size
  : Number.parseInt(({ sm: '320', md: '400', lg: '560', xl: '720', full: '100' } as Record<string, string>)[props.size ?? 'md'] ?? props.size ?? '400', 10) || 400
const resize = useResize({
  defaultRect: { x: 0, y: 0, width: horizontal.value ? numericSize : 0, height: horizontal.value ? 0 : numericSize },
  edges: [edge.value],
  ...(horizontal.value
    ? { minWidth: context.resizeOptions.minSize, maxWidth: context.resizeOptions.maxSize }
    : { minHeight: context.resizeOptions.minSize, maxHeight: context.resizeOptions.maxSize }),
  disabled: !context.resizeOptions.resizable,
  onResize(rect) {
    context.resizeOptions.onSizeChange?.(horizontal.value ? rect.width : rect.height)
  },
})
context.resize = resize
const sizeValue = computed(() => typeof props.size === 'number' ? `${props.size}px` : ({ sm: '320px', md: '400px', lg: '560px', xl: '720px', full: '100%' } as Record<string, string>)[props.size ?? 'md'] ?? props.size ?? '400px')

function setContent(element: HTMLDivElement | null) {
  drawer.setLayerElement(element)
  resize.setTarget(element)
}
function keydown(event: KeyboardEvent) {
  if (event.key === 'Escape') drawer.dismiss.escapeKey({ target: event.target, currentTarget: event.currentTarget, event })
}
onBeforeUnmount(() => {
  drawer.setLayerElement(null)
  resize.setTarget(null)
})
</script>

<template>
  <div v-if="snapshot.mounted" :ref="setContent" v-bind="$attrs" role="dialog" tabindex="-1" data-slot="drawer-content" :data-placement="placement" :data-state="snapshot.open ? 'open' : 'closed'" :data-phase="snapshot.phase" :aria-modal="true" :class="cn(drawerContentClassName({ placement }), props.class)" :style="{ '--drawer-size': sizeValue, ...props.style }" @keydown="keydown"><slot /></div>
</template>
