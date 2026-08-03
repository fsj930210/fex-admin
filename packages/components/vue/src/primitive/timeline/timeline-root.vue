<script setup lang="ts">
import { timelineClassName } from '@fex/components-styles/timeline'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'
import type { TimelineAlign, TimelineOrientation } from './timeline'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    orientation?: TimelineOrientation
    align?: TimelineAlign
    reverse?: boolean
  }>(),
  { orientation: 'vertical', align: 'end', reverse: false },
)
const attrs = useAttrs()
const className = computed(() =>
  cn(
    timelineClassName({
      orientation: props.orientation,
      align: props.align,
      reverse: props.reverse,
    }),
    attrs.class as string | undefined,
  ),
)
</script>

<template>
  <ol
    v-bind="attrs"
    data-slot="timeline"
    :data-orientation="orientation"
    :data-align="align"
    :data-reverse="reverse || undefined"
    :class="className"
  >
    <slot />
  </ol>
</template>
