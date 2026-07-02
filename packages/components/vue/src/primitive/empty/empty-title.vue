<script setup lang="ts">
import { emptyTitleClassName } from '@fex/components-styles/empty'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <div v-bind="$attrs" data-slot="empty-title" :class="cn(emptyTitleClassName, props.class)">
    <slot />
  </div>
</template>
