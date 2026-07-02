<script setup lang="ts">
import { alertDescriptionClassName } from '@fex/components-styles/alert'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <div v-bind="$attrs" data-slot="alert-description" :class="cn(alertDescriptionClassName, props.class)">
    <slot />
  </div>
</template>
