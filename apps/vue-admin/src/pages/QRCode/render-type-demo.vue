<script setup lang="ts">
import { QrCodeBackground, QrCodeCanvas, QrCodeModules, QrCodeRoot, QrCodeSvg } from '@fex-design/vue/primitive/qrcode'
import Card from '@fex-design/vue/ui/card'
</script>

<template>
  <Card title="自定义渲染类型" description="同一个 Root 模型可以选择 SVG 或 Canvas 渲染面。">
    <div class="flex flex-wrap gap-space-lg">
      <QrCodeRoot value="https://fex.design/qrcode/svg" :size="160">
        <QrCodeSvg aria-label="SVG QR code"><QrCodeBackground /><QrCodeModules /></QrCodeSvg>
      </QrCodeRoot>
      <QrCodeRoot value="https://fex.design/qrcode/canvas" :size="160">
        <QrCodeCanvas aria-label="Canvas QR code" />
      </QrCodeRoot>
    </div>
  </Card>
</template>
