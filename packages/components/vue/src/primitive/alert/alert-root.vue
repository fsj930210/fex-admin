<script setup lang="ts">
import { alertClassName, type AlertStyleProps } from '@fex/components-styles/alert'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ class?: string | undefined; variant?: AlertStyleProps['variant'] }>(), {
  variant: 'default',
})
</script>

<template>
  <div v-bind="$attrs" data-slot="alert" role="alert" :class="cn(alertClassName({ variant: props.variant }), props.class)">
    <slot />
  </div>
</template>
