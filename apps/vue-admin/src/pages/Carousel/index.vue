<script setup lang="ts">
import AutoHeight from 'embla-carousel-auto-height'
import { Carousel } from '@fex/components-vue/primitive/carousel'
import Card from '@fex/components-vue/ui/card'
import CarouselControls from './carousel-controls.vue'

const slides = ['订单概览', '待办审批', '团队动态']
const autoHeightSlides = [
  { title: '订单概览', items: ['今日新增订单 24'] },
  { title: '待办审批', items: ['采购申请待审批', '预算调整待确认', '合同归档待处理'] },
  { title: '团队动态', items: ['版本 v2.8 已发布', '设计评审将在下午举行', '本周目标完成 72%', '两位新成员已加入项目'] },
]
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-md"><RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">返回首页</RouterLink><h1 class="text-2xl font-semibold">Carousel</h1><p class="text-sm text-muted-foreground">仅提供 primitive；控制按钮与指示器由应用按需组合。</p></header>
      <Card title="Primitive composition" description="通过 controller 自行实现 Previous、Next 与 Indicators。">
        <Carousel :options="{ loop: true }"><div v-for="slide in slides" :key="slide" role="group" aria-roledescription="slide" class="min-w-0 shrink-0 grow-0 basis-full"><div class="flex h-40 items-center justify-center rounded-md bg-primary text-lg font-semibold text-primary-foreground">{{ slide }}</div></div><template #controls="{ controller, snapshot }"><CarouselControls :controller="controller" :snapshot="snapshot" /></template></Carousel>
      </Card>
      <Card title="Autoplay" description="Autoplay 是 primitive 的内置配置，controller.autoplay 返回官方实例。">
        <Carousel :options="{ loop: true }" :autoplay="{ delay: 2500, stopOnInteraction: true }"><div v-for="slide in slides" :key="slide" role="group" aria-roledescription="slide" class="min-w-0 shrink-0 grow-0 basis-full"><div class="flex h-40 items-center justify-center rounded-md bg-primary text-lg font-semibold text-primary-foreground">{{ slide }}</div></div><template #controls="{ controller, snapshot }"><CarouselControls :controller="controller" :snapshot="snapshot" /></template></Carousel>
      </Card>
      <Card title="Official plugin" description="AutoHeight 直接从 embla-carousel-auto-height 导入，不经过 FEX 封装。">
        <Carousel :plugins="[AutoHeight()]"><article v-for="slide in autoHeightSlides" :key="slide.title" role="group" aria-roledescription="slide" class="min-w-0 shrink-0 grow-0 basis-full rounded-md bg-muted-background p-6"><h3 class="text-base font-semibold">{{ slide.title }}</h3><ul class="mt-3 space-y-2 text-sm text-muted-foreground"><li v-for="item in slide.items" :key="item">{{ item }}</li></ul></article><template #controls="{ controller, snapshot }"><CarouselControls :controller="controller" :snapshot="snapshot" /></template></Carousel>
      </Card>
    </div>
  </main>
</template>
