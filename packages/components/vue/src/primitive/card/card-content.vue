<script setup lang="ts">
import { cardContentClassName } from '@fex/components-styles/card'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <div v-bind="$attrs" data-slot="card-content" :class="cn(cardContentClassName, props.class)">
    <slot />
  </div>
</template>

