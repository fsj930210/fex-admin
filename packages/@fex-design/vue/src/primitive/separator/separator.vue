<script setup lang="ts">
import { separatorClassName } from '@fex-design/styles/separator'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'
defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{ orientation?: 'horizontal' | 'vertical'; decorative?: boolean }>(),
  { orientation: 'horizontal', decorative: true },
)
const attrs = useAttrs()
</script>
<template>
  <div
    v-bind="attrs"
    :role="props.decorative ? 'none' : 'separator'"
    :aria-orientation="props.decorative ? undefined : props.orientation"
    data-slot="separator"
    :data-orientation="props.orientation"
    :class="cn(separatorClassName, attrs.class as string | undefined)"
  />
</template>
