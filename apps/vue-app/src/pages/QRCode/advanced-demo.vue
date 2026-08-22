<script setup lang="ts">
import {
  QrCodeBackground,
  QrCodeCenter,
  QrCodeModules,
  QrCodeRoot,
  QrCodeSvg,
} from '@fex-design/vue/primitive/qrcode'
import Card from '@fex-design/vue/ui/card'
</script>

<template>
  <Card
    title="高级用法"
    description="通过 Center 和 Modules 的 centerSize 组合，在二维码中心叠加任意内容。"
  >
    <QrCodeRoot
      value="https://fex.design/qrcode/advanced"
      :size="192"
      error-level="H"
      color="#111827"
      bg-color="#f8fafc"
    >
      <QrCodeSvg>
        <QrCodeBackground />
        <QrCodeModules :center-size="56" />
        <QrCodeCenter :size="56">
          <circle cx="50" cy="50" r="48" class="fill-background stroke-border" stroke-width="2" />
          <text
            x="50"
            y="52"
            text-anchor="middle"
            dominant-baseline="middle"
            font-size="26"
            class="fill-foreground font-semibold"
          >
            FEX
          </text>
        </QrCodeCenter>
      </QrCodeSvg>
    </QrCodeRoot>
  </Card>
</template>
