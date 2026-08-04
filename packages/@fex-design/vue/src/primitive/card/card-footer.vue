<script setup lang="ts">
import { cardFooterClassName } from '@fex-design/styles/card'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <div v-bind="$attrs" data-slot="card-footer" :class="cn(cardFooterClassName, props.class)">
    <slot />
  </div>
</template>
