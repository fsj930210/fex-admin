<script setup lang="ts" generic="TData = unknown">
import { createFloating } from '@fex-design/core/floating/create-floating'
import type { TourRegisteredStep } from '@fex-design/core/tour/types'
import { tourContentClassName } from '@fex-design/styles/tour'
import { cn } from '@fex/utils'
import type { ComponentPublicInstance, StyleValue } from 'vue'
import { computed, onBeforeUnmount, provide, shallowRef, useAttrs, watchEffect } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { tourContentKey } from './context'
import { useTourContext } from './context'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string; style?: StyleValue }>()
const attrs = useAttrs()
const { controller, snapshot, defaultGap, zIndex } = useTourContext('TourContent')
const floating = createFloating({ placement: 'bottom', arrow: true, offset: 12 })
const floatingSnapshot = useCoreStore(floating)
const contentElement = shallowRef<HTMLDivElement | null>(null)
const step = computed(() => snapshot.value.currentStep as TourRegisteredStep< TData> | null)
const target = computed(() => step.value?.target ? controller.getTarget(step.value.target) : null)
const showArrow = computed(() => step.value?.arrow !== false)
const gap = computed(() => step.value?.gap?.offset ?? defaultGap)
const floatingOffset = computed(() => (Array.isArray(gap.value) ? Math.max(...gap.value) : gap.value) + 12)
const contentClass = computed(() => cn(tourContentClassName, props.class))
function setContent(element: Element | ComponentPublicInstance | null) {
  contentElement.value = element instanceof HTMLDivElement ? element : null
  floating.setFloatingElement(contentElement.value)
}
watchEffect(() => {
  floating.setOptions({ placement: step.value?.placement ?? 'bottom', arrow: showArrow.value, offset: floatingOffset.value })
  floating.setReferenceElement(target.value)
  if (snapshot.value.open && target.value) floating.startAutoUpdate()
  else floating.stopAutoUpdate()
})
onBeforeUnmount(() => {
  floating.setFloatingElement(null)
  floating.destroy()
})
provide(tourContentKey, { floating, snapshot: floatingSnapshot })
</script>
<template>
  <div
    v-if="snapshot.open && step"
    v-bind="attrs"
    :ref="setContent"
    role="dialog"
    tabindex="-1"
    data-slot="tour-content"
    :data-side="floatingSnapshot.side"
    :data-placement="floatingSnapshot.placement"
    :class="contentClass"
    :style="[{ position: 'var(--floating-strategy, absolute)', left: 'var(--floating-x, 0px)', top: 'var(--floating-y, 0px)', transformOrigin: 'var(--floating-transform-origin)', zIndex }, props.style]"
  >
    <slot :step="step" :index="snapshot.currentIndex" :total="snapshot.total" />
  </div>
</template>
