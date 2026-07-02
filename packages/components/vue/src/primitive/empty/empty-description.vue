<script setup lang="ts">
import { emptyDescriptionClassName } from '@fex/components-styles/empty'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <p v-bind="$attrs" data-slot="empty-description" :class="cn(emptyDescriptionClassName, props.class)">
    <slot />
  </p>
</template>
