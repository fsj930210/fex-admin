<script setup lang="ts">
import { ref } from 'vue'
import { QrCodeBackground, QrCodeModules, QrCodeOverlay, QrCodeRoot, QrCodeSvg } from '@fex-design/vue/primitive/qrcode'
import Button from '@fex-design/vue/ui/button'
import Card from '@fex-design/vue/ui/card'

const expired = ref(true)
</script>

<template>
  <Card title="Overlay" description="Overlay 不参与二维码生成，可组合加载、失效和自定义操作状态。">
    <div class="flex flex-wrap items-center gap-space-md">
      <QrCodeRoot value="https://fex.design/overlay" :size="176">
        <QrCodeSvg>
          <QrCodeBackground />
          <QrCodeModules />
        </QrCodeSvg>
        <QrCodeOverlay v-if="expired">
          <Button size="sm" @click="expired = false">Refresh</Button>
        </QrCodeOverlay>
      </QrCodeRoot>
      <Button variant="outline" @click="expired = !expired">Toggle overlay</Button>
    </div>
  </Card>
</template>
