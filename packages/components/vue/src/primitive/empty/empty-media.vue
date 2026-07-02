<script setup lang="ts">
import { emptyMediaClassName, type EmptyMediaStyleProps } from '@fex/components-styles/empty'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{ class?: string | undefined; variant?: EmptyMediaStyleProps['variant'] }>(),
  { variant: 'icon' },
)
</script>

<template>
  <div v-bind="$attrs" data-slot="empty-icon" :data-variant="props.variant" :class="cn(emptyMediaClassName({ variant: props.variant }), props.class)">
    <slot />
  </div>
</template>
