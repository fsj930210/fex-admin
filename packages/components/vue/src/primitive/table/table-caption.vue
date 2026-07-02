<script setup lang="ts">
import { tableCaptionClassName } from '@fex/components-styles/table'
import { cn } from '@fex/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
</script>

<template>
  <caption v-bind="$attrs" data-slot="table-caption" :class="cn(tableCaptionClassName, props.class)">
    <slot />
  </caption>
</template>

