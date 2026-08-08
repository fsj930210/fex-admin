<script setup lang="ts">
import { createQrCodeModel, type QrCodeErrorLevel } from '@fex-design/core/qrcode'
import { qrcodeRootClassName } from '@fex-design/styles/qrcode'
import { cn } from '@fex/utils'
import { computed, provide, useAttrs, type StyleValue } from 'vue'
import { qrcodeContextKey } from './context'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    value: string
    errorLevel?: QrCodeErrorLevel
    margin?: number
    size?: number
    color?: string
    bgColor?: string
    class?: string
  }>(),
  { errorLevel: 'M', margin: 4, size: 160, color: '#000000', bgColor: '#ffffff' },
)
const attrs = useAttrs()
const model = computed(() =>
  createQrCodeModel({
    value: props.value,
    errorLevel: props.errorLevel,
    margin: props.margin,
    size: props.size,
    color: props.color,
    bgColor: props.bgColor,
  }),
)
const className = computed(() => cn(qrcodeRootClassName, attrs.class as string | undefined, props.class))
const rootStyle = computed<StyleValue>(() => [
  {
    width: model.value.size + 'px',
    height: model.value.size + 'px',
    '--qrcode-size': model.value.size + 'px',
    '--qrcode-color': model.value.color,
    '--qrcode-bg-color': model.value.bgColor,
  },
  attrs.style as StyleValue,
])

provide(qrcodeContextKey, { model })
</script>

<template>
  <div v-bind="attrs" data-slot="qrcode" :class="className" :style="rootStyle">
    <slot />
  </div>
</template>
