<script setup lang="ts">
import { getQrCodeCenterRect } from '@fex-design/core/qrcode'
import { qrcodeCenterClassName } from '@fex-design/styles/qrcode'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'
import { useQrCode } from './context'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{ size?: number; class?: string }>(), { size: 40 })
const attrs = useAttrs()
const { model } = useQrCode('QrCodeCenter')
const rect = computed(() => getQrCodeCenterRect(model.value, props.size))
const className = computed(() => cn(qrcodeCenterClassName, attrs.class as string | undefined, props.class))
</script>

<template>
  <svg
    v-bind="attrs"
    data-slot="qrcode-center"
    :class="className"
    :x="rect.x"
    :y="rect.y"
    :width="rect.width"
    :height="rect.height"
    viewBox="0 0 100 100"
    overflow="visible"
  >
    <slot />
  </svg>
</template>
