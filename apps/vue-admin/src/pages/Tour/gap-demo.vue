<script setup lang="ts">
import Card from '@fex-design/vue/ui/card'
import { TourArrow, TourContent, TourOverlay, TourPortal, TourRoot, TourStep } from '@fex-design/vue/primitive/tour'
import { DemoTarget, TourPanel } from './shared'
import StartButton from './start-button.vue'
</script>
<template><Card title="自定义高亮区域" description="使用统一的 gap 控制矩形镂空区域四边间距。"><TourRoot><div class="flex items-center gap-2"><DemoTarget name="gap-target">高亮目标</DemoTarget><StartButton>开始引导</StartButton></div><TourPortal><TourOverlay /><TourStep name="gap" target="gap-target" :gap="{ offset: 16 }"><TourContent><TourArrow /><TourPanel title="高亮区域参数" description="镂空区域上下左右保持相同间距。" /></TourContent></TourStep></TourPortal></TourRoot></Card></template>
