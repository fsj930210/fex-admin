<script setup lang="ts">
import { emptyContentClassName } from '@fex/components-styles/empty'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <div v-bind="$attrs" data-slot="empty-content" :class="cn(emptyContentClassName, props.class)">
    <slot />
  </div>
</template>
