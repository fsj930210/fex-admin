<script setup lang="ts">
import type { QrCodeErrorLevel } from '@fex-design/core/qrcode'
import { QrCodeBackground, QrCodeModules, QrCodeRoot, QrCodeSvg } from '@fex-design/vue/primitive/qrcode'
import Card from '@fex-design/vue/ui/card'

const levels: QrCodeErrorLevel[] = ['L', 'M', 'Q', 'H']
</script>

<template>
  <Card title="纠错比例" description="errorLevel 透传给编码层，适合 Logo 或污损容错场景。">
    <div class="flex flex-wrap gap-space-lg">
      <div v-for="level in levels" :key="level" class="grid gap-space-xs text-center text-sm text-muted-foreground">
        <QrCodeRoot :value="'https://fex.design/qrcode/error/' + level" :size="128" :error-level="level">
          <QrCodeSvg><QrCodeBackground /><QrCodeModules /></QrCodeSvg>
        </QrCodeRoot>
        <span>{{ level }}</span>
      </div>
    </div>
  </Card>
</template>
