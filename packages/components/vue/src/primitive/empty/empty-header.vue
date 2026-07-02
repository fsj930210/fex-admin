<script setup lang="ts">
import { emptyHeaderClassName } from '@fex/components-styles/empty'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <div v-bind="$attrs" data-slot="empty-header" :class="cn(emptyHeaderClassName, props.class)">
    <slot />
  </div>
</template>
