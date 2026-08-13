<script setup lang="ts">
import { aspectRatioClassName } from '@fex-design/styles/aspect-ratio'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'
defineOptions({ inheritAttrs: false })
const props = defineProps<{ ratio: number }>()
const attrs = useAttrs()
</script>
<template>
  <div
    v-bind="attrs"
    data-slot="aspect-ratio"
    :class="cn(aspectRatioClassName, attrs.class as string | undefined)"
    :style="[{ aspectRatio: props.ratio }, attrs.style]"
  >
    <slot />
  </div>
</template>
