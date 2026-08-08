<script setup lang="ts">
import AdvancedDemo from './advanced-demo.vue'
import BasicDemo from './basic-demo.vue'
import ColorDemo from './color-demo.vue'
import CustomStatusDemo from './custom-status-demo.vue'
import DownloadDemo from './download-demo.vue'
import ErrorLevelDemo from './error-level-demo.vue'
import IconDemo from './icon-demo.vue'
import RenderTypeDemo from './render-type-demo.vue'
import SizeDemo from './size-demo.vue'
import StatusDemo from './status-demo.vue'
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-md">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</RouterLink>
        <h1 class="text-2xl font-semibold text-foreground">QRCode</h1>
        <p class="max-w-2xl text-sm leading-6 text-muted-foreground">
          使用 primitive 部件组合二维码结构、渲染面、中心内容和自定义状态。
        </p>
      </header>
      <div class="grid gap-space-xl">
        <BasicDemo />
        <IconDemo />
        <StatusDemo />
        <CustomStatusDemo />
        <RenderTypeDemo />
        <SizeDemo />
        <ColorDemo />
        <DownloadDemo />
        <ErrorLevelDemo />
        <AdvancedDemo />
      </div>
    </div>
  </main>
</template>
