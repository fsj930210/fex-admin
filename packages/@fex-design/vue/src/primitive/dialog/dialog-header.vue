<script setup lang="ts">
import { dialogHeaderClassName } from '@fex-design/styles/dialog'
import { cn } from '@fex/utils'
const props = defineProps<{ class?: string }>()
</script>
<template>
  <div v-bind="$attrs" data-slot="dialog-header" :class="cn(dialogHeaderClassName, props.class)">
    <slot />
  </div>
</template>
