<script setup lang="ts">
import Card from '@fex-design/vue/ui/card'
import { TourArrow, TourContent, TourOverlay, TourPortal, TourRoot, TourStep } from '@fex-design/vue/primitive/tour'
import { DemoTarget, TourPanel } from './shared'
import StartButton from './start-button.vue'
</script>
<template><Card title="自定义遮罩" description="Overlay 的渲染结果可以完全替换。"><TourRoot><div class="flex items-center gap-2"><DemoTarget name="mask-target">遮罩目标</DemoTarget><StartButton /></div><TourPortal><TourOverlay v-slot="{ props, targetRect }"><div v-bind="props" class="fixed inset-0 z-[1000] bg-slate-950/70"><div v-if="targetRect" class="absolute border-2 border-primary bg-primary/10 shadow-[0_0_0_9999px_rgba(15,23,42,0.7)]" :style="{ left: `${targetRect.x - 8}px`, top: `${targetRect.y - 8}px`, width: `${targetRect.width + 16}px`, height: `${targetRect.height + 16}px`, borderRadius: 0 }" /></div></TourOverlay><TourStep name="mask" target="mask-target"><TourContent><TourArrow /><TourPanel title="自定义遮罩" description="这里使用了调用方自定义的高亮边框和阴影。" /></TourContent></TourStep></TourPortal></TourRoot></Card></template>
