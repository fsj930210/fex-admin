<script setup lang="ts">
import { cardClassName } from '@fex/components-styles/card'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <div v-bind="$attrs" data-slot="card" :class="cn(cardClassName, props.class)">
    <slot />
  </div>
</template>

