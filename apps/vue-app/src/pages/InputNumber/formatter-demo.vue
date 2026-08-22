<script setup lang="ts">
import { InputNumber } from '@fex-design/vue/primitive/input-number'
import Card from '@fex-design/vue/ui/card'
const parser = (text: string) => {
  const value = Number(text.replace(/[￥,\s]/g, ''))
  return Number.isFinite(value) ? value : undefined
}
const formatter = (value: number | undefined, info: { userTyping: boolean; input: string }) =>
  info.userTyping
    ? info.input
    : value === undefined
      ? ''
      : `￥${new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 }).format(value)}`
</script>
<template>
  <Card
    title="Parser and formatter"
    description="Typing keeps a raw draft; blur restores currency presentation."
    ><InputNumber
      class="max-w-sm"
      :default-value="1234.5"
      :parser="parser"
      :formatter="formatter"
      aria-label="Currency"
  /></Card>
</template>
