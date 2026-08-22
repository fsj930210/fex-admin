<script setup lang="ts">
import Card from '@fex-design/vue/ui/card'
import { TourArrow, TourContent, TourOverlay, TourPortal, TourRoot, TourStep } from '@fex-design/vue/primitive/tour'
import { DemoTarget, TourIndicators, TourNavigation, TourPanel, TourProgress } from './shared'
import StartButton from './start-button.vue'
const names = ['one', 'two', 'three']
</script>
<template><Card title="自定义指示器" description="指示器 DOM 完全由调用方自行实现。"><TourRoot><div class="flex flex-wrap items-center gap-2"><DemoTarget name="indicator-one">目标一</DemoTarget><DemoTarget name="indicator-two">目标二</DemoTarget><DemoTarget name="indicator-three">目标三</DemoTarget><StartButton /></div><TourPortal><TourOverlay /><TourStep v-for="(name, index) in names" :key="name" :name="`indicator-${name}`" :target="`indicator-${name}`"><TourContent><TourArrow /><TourPanel :title="`第 ${index + 1} 步`" description="点击指示器可以直接跳转。"><div class="space-y-3"><div class="flex items-center gap-2"><TourIndicators :count="names.length" /><TourProgress /></div><TourNavigation /></div></TourPanel></TourContent></TourStep></TourPortal></TourRoot></Card></template>
