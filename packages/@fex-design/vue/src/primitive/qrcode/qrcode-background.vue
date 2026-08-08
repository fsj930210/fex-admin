<script setup lang="ts">
import { qrcodeBackgroundClassName } from '@fex-design/styles/qrcode'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'
import { useQrCode } from './context'

defineOptions({ inheritAttrs: false })

const props = defineProps<{ class?: string }>()
const attrs = useAttrs()
const { model } = useQrCode('QrCodeBackground')
const className = computed(() => cn(qrcodeBackgroundClassName, attrs.class as string | undefined, props.class))
</script>

<template>
  <rect
    v-bind="attrs"
    data-slot="qrcode-background"
    :class="className"
    :width="model.viewBoxSize"
    :height="model.viewBoxSize"
  />
</template>
