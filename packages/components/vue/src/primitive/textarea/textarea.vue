<script setup lang="ts">
import { textareaClassName } from '@fex/components-styles/textarea'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'

defineOptions({ name: 'Textarea', inheritAttrs: false })

const attrs = useAttrs()
</script>

<template>
  <textarea v-bind="attrs" data-slot="textarea" :class="cn(textareaClassName, attrs.class as string | undefined)" />
</template>
