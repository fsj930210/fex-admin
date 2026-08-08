<script setup lang="ts">
import { QrCodeCanvas, QrCodeRoot } from '@fex-design/vue/primitive/qrcode'
import Card from '@fex-design/vue/ui/card'
</script>

<template>
  <Card title="Canvas" description="Canvas renderer 适合需要像素绘制或后续导出的场景。">
    <QrCodeRoot
      value="https://fex.design/canvas"
      :size="176"
      color="#075985"
      bg-color="#f0f9ff"
    >
      <QrCodeCanvas aria-label="Canvas QR code" />
    </QrCodeRoot>
  </Card>
</template>
