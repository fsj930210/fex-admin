<script setup lang="ts">
import { ref } from 'vue'
import { QrCodeBackground, QrCodeModules, QrCodeOverlay, QrCodeRoot, QrCodeSvg } from '@fex-design/vue/primitive/qrcode'
import Button from '@fex-design/vue/ui/button'
import Card from '@fex-design/vue/ui/card'

const expired = ref(true)
</script>

<template>
  <Card title="自定义状态渲染器" description="调用方完全控制遮罩内容、按钮和状态切换逻辑。">
    <div class="flex flex-wrap items-center gap-space-md">
      <QrCodeRoot value="https://fex.design/qrcode/custom-status" :size="176">
        <QrCodeSvg><QrCodeBackground /><QrCodeModules /></QrCodeSvg>
        <QrCodeOverlay v-if="expired">
          <div class="grid gap-space-xs">
            <span class="text-sm font-medium">二维码已过期</span>
            <Button size="sm" @click="expired = false">重新加载</Button>
          </div>
        </QrCodeOverlay>
      </QrCodeRoot>
      <Button variant="outline" @click="expired = !expired">切换状态</Button>
    </div>
  </Card>
</template>
