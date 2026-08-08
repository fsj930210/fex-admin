<script setup lang="ts">
import { QrCodeBackground, QrCodeModules, QrCodeRoot, QrCodeSvg } from '@fex-design/vue/primitive/qrcode'
import Card from '@fex-design/vue/ui/card'

const sizes = [96, 128, 176]
</script>

<template>
  <Card title="自定义尺寸" description="通过 Root 的 size 控制二维码输出尺寸。">
    <div class="flex flex-wrap items-end gap-space-lg">
      <QrCodeRoot v-for="size in sizes" :key="size" :value="'https://fex.design/qrcode/size/' + size" :size="size">
        <QrCodeSvg><QrCodeBackground /><QrCodeModules /></QrCodeSvg>
      </QrCodeRoot>
    </div>
  </Card>
</template>
