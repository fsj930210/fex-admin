<script setup lang="ts">
import { cn } from '@fex/utils'
import { popoverContentClassName, popoverMenuContentClassName } from '@fex-design/styles/popover'
import { useContextMenuContext } from './context'
import {
  computed,
  onBeforeUnmount,
  useAttrs,
  type ComponentPublicInstance,
  type StyleValue,
} from 'vue'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const { controller, snapshot } = useContextMenuContext('ContextMenuContent')

function setContentElement(element: Element | ComponentPublicInstance | null) {
  controller.overlay.setFloatingElement(element instanceof HTMLDivElement ? element : null)
}

const passthroughAttrs = computed(() => {
  const { class: _className, role: _role, style: _style, ...rest } = attrs
  return rest
})
const contentClass = computed(() =>
  cn(popoverContentClassName(), popoverMenuContentClassName, attrs.class as string | undefined),
)
const contentRole = computed(() => (typeof attrs.role === 'string' ? attrs.role : 'menu'))
const contentStyle = computed<StyleValue>(() => [
  attrs.style as StyleValue,
  {
    position: 'var(--floating-strategy, absolute)',
    left: 'var(--floating-x, 0px)',
    top: 'var(--floating-y, 0px)',
  } as unknown as StyleValue,
])
onBeforeUnmount(() => controller.overlay.setFloatingElement(null))
</script>
<template>
  <div
    v-if="snapshot.overlay.mounted"
    v-bind="passthroughAttrs"
    :ref="setContentElement"
    :role="contentRole"
    :class="contentClass"
    :style="contentStyle"
    tabindex="-1"
    data-slot="context-menu-content"
    :data-state="snapshot.overlay.open ? 'open' : 'closed'"
    :data-phase="snapshot.overlay.phase"
    :data-side="snapshot.overlay.side"
    :data-align="snapshot.overlay.align"
  >
    <slot />
  </div>
</template>
