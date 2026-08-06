<script setup lang="ts">
import Card from '@fex-design/vue/ui/card'
import { TourArrow, TourContent, TourOverlay, TourPortal, TourRoot, TourStep } from '@fex-design/vue/primitive/tour'
import { DemoTarget, TourPanel } from './shared'
import StartButton from './start-button.vue'
</script>
<template><Card title="非模态" description="关闭遮罩，同时保持目标区域可交互。"><TourRoot><div class="flex flex-wrap items-center gap-2"><DemoTarget name="non-modal-target">可交互目标</DemoTarget><StartButton /></div><TourPortal><TourOverlay /><TourStep name="non-modal" target="non-modal-target" :mask="false" :disabled-interaction="false"><TourContent><TourArrow /><TourPanel title="非模态引导" description="页面其他区域和目标区域仍然可以交互。" /></TourContent></TourStep></TourPortal></TourRoot></Card></template>
