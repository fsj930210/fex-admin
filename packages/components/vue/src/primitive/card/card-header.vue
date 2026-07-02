<script setup lang="ts">
import { cardHeaderClassName } from '@fex/components-styles/card'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <div v-bind="$attrs" data-slot="card-header" :class="cn(cardHeaderClassName, props.class)">
    <slot />
  </div>
</template>

