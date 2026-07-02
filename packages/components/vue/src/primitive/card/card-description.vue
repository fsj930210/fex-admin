<script setup lang="ts">
import { cardDescriptionClassName } from '@fex/components-styles/card'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <div v-bind="$attrs" data-slot="card-description" :class="cn(cardDescriptionClassName, props.class)">
    <slot />
  </div>
</template>

