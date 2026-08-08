<script setup lang="ts">
import { qrcodeSurfaceClassName } from '@fex-design/styles/qrcode'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'
import { useQrCode } from './context'

defineOptions({ inheritAttrs: false })

const props = defineProps<{ class?: string }>()
const attrs = useAttrs()
const { model } = useQrCode('QrCodeSvg')
const className = computed(() => cn(qrcodeSurfaceClassName, attrs.class as string | undefined, props.class))
const viewBox = computed(() => '0 0 ' + model.value.viewBoxSize + ' ' + model.value.viewBoxSize)
const ariaLabel = computed(() => (attrs['aria-label'] as string | undefined) ?? 'QR code')
</script>

<template>
  <svg
    v-bind="attrs"
    role="img"
    :aria-label="ariaLabel"
    data-slot="qrcode-svg"
    :class="className"
    :viewBox="viewBox"
    :width="model.size"
    :height="model.size"
    shape-rendering="crispEdges"
    xmlns="http://www.w3.org/2000/svg"
  >
    <slot />
  </svg>
</template>
