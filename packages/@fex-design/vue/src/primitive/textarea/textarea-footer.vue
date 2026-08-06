<script setup lang="ts">
import { textareaFooterClassName } from '@fex-design/styles/textarea'
import { cn } from '@fex/utils'
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string | undefined }>()
const className = computed(() => cn(textareaFooterClassName, props.class))
</script>

<template>
  <div v-bind="$attrs" data-slot="textarea-footer" :class="className"><slot /></div>
</template>
