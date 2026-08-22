<script setup lang="ts">
import { ref } from 'vue'
import { QrCodeCanvas, QrCodeRoot } from '@fex-design/vue/primitive/qrcode'
import Button from '@fex-design/vue/ui/button'
import Card from '@fex-design/vue/ui/card'

const container = ref<HTMLElement | null>(null)

function download() {
  const canvas = container.value?.querySelector('canvas')
  if (!canvas) return
  const link = document.createElement('a')
  link.download = 'fex-qrcode.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}
</script>

<template>
  <Card title="下载二维码" description="下载不是 QRCode 内置能力，这里演示业务侧基于 Canvas 组合导出 PNG。">
    <div ref="container" class="flex flex-wrap items-center gap-space-md">
      <QrCodeRoot value="https://fex.design/qrcode/download" :size="176">
        <QrCodeCanvas aria-label="Downloadable QR code" />
      </QrCodeRoot>
      <Button @click="download">下载 PNG</Button>
    </div>
  </Card>
</template>
