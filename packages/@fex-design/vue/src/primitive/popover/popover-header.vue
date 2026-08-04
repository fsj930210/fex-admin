<script setup lang="ts">
import { popoverHeaderClassName } from '@fex-design/styles/popover'
import { cn } from '@fex/utils'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <div data-slot="popover-header" :class="cn(popoverHeaderClassName, props.class)">
    <slot />
  </div>
</template>
