<script setup lang="ts">
import {
  getQrCodeCenterExcludeRect,
  getQrCodeSvgPath,
  type QrCodeModuleExcludeRect,
} from '@fex-design/core/qrcode'
import { qrcodeModulesClassName } from '@fex-design/styles/qrcode'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'
import { useQrCode } from './context'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  centerSize?: number
  exclude?: QrCodeModuleExcludeRect
  class?: string
}>()
const attrs = useAttrs()
const { model } = useQrCode('QrCodeModules')
const className = computed(() => cn(qrcodeModulesClassName, attrs.class as string | undefined, props.class))
const path = computed(() => {
  const centerExclude = props.centerSize ? getQrCodeCenterExcludeRect(model.value, props.centerSize) : undefined
  return getQrCodeSvgPath(model.value, props.exclude ?? centerExclude)
})
</script>

<template>
  <path v-bind="attrs" data-slot="qrcode-modules" :class="className" :d="path" />
</template>
