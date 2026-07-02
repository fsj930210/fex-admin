<script setup lang="ts">
import { spinnerClassName, type SpinnerStyleProps } from '@fex/components-styles/spinner'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'
import { LoadingIcon } from '../../icon/loading'

defineOptions({ name: 'Spinner', inheritAttrs: false })

const props = defineProps<{
  size?: SpinnerStyleProps['size']
}>()

const attrs = useAttrs()
</script>

<template>
  <span v-bind="attrs" data-slot="spinner" :class="cn(spinnerClassName({ size: props.size }), attrs.class as string | undefined)">
    <LoadingIcon />
  </span>
</template>
