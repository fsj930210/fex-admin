<script setup lang="ts">
import { QrCodeBackground, QrCodeModules, QrCodeOverlay, QrCodeRoot, QrCodeSvg } from '@fex-design/vue/primitive/qrcode'
import Button from '@fex-design/vue/ui/button'
import Card from '@fex-design/vue/ui/card'
</script>

<template>
  <Card title="不同的状态" description="状态不是 primitive 内建枚举，通过 Overlay 和业务按钮组合。">
    <div class="flex flex-wrap gap-space-lg">
      <QrCodeRoot value="https://fex.design/qrcode/active" :size="144">
        <QrCodeSvg><QrCodeBackground /><QrCodeModules /></QrCodeSvg>
      </QrCodeRoot>
      <QrCodeRoot value="https://fex.design/qrcode/loading" :size="144">
        <QrCodeSvg><QrCodeBackground /><QrCodeModules /></QrCodeSvg>
        <QrCodeOverlay>Loading...</QrCodeOverlay>
      </QrCodeRoot>
      <QrCodeRoot value="https://fex.design/qrcode/expired" :size="144">
        <QrCodeSvg><QrCodeBackground /><QrCodeModules /></QrCodeSvg>
        <QrCodeOverlay><Button size="sm">Refresh</Button></QrCodeOverlay>
      </QrCodeRoot>
    </div>
  </Card>
</template>
