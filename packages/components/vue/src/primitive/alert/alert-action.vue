<script setup lang="ts">
import { alertActionClassName } from '@fex/components-styles/alert'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <div v-bind="$attrs" data-slot="alert-action" :class="cn(alertActionClassName, props.class)">
    <slot />
  </div>
</template>
