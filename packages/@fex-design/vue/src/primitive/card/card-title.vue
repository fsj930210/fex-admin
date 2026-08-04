<script setup lang="ts">
import { cardTitleClassName } from '@fex-design/styles/card'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <div v-bind="$attrs" data-slot="card-title" :class="cn(cardTitleClassName, props.class)">
    <slot />
  </div>
</template>
