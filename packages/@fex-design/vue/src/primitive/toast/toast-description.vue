<script setup lang="ts">
import { toastDescriptionClassName } from '@fex-design/styles/toast'
import { cn } from '@fex/utils'
const props = defineProps<{ class?: string }>()
</script>
<template>
  <div
    v-bind="$attrs"
    data-slot="toast-description"
    :class="cn(toastDescriptionClassName, props.class)"
  >
    <slot />
  </div>
</template>
