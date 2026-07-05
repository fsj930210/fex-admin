<script setup lang="ts">
import { inputClassName } from '@fex/components-styles/input'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'

defineOptions({ name: 'FexInput', inheritAttrs: false })

const attrs = useAttrs()
</script>

<template>
  <input v-bind="attrs" data-slot="input" :class="cn(inputClassName, attrs.class as string | undefined)">
</template>
