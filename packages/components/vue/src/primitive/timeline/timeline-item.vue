<script setup lang="ts">
import { timelineItemClassName } from '@fex/components-styles/timeline'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'
import type { TimelinePlacement, TimelineStatus } from './timeline'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    status?: TimelineStatus
    connectorStatus?: TimelineStatus
    placement?: TimelinePlacement
  }>(),
  { status: 'default' },
)
const attrs = useAttrs()
const className = computed(() => cn(timelineItemClassName, attrs.class as string | undefined))
</script>

<template>
  <li
    v-bind="attrs"
    data-slot="timeline-item"
    :data-status="status"
    :data-connector-status="connectorStatus ?? status"
    :data-placement="placement"
    :aria-current="status === 'current' ? 'step' : undefined"
    :class="className"
  >
    <slot />
  </li>
</template>
