<script setup lang="ts">
import Card from '@fex-design/vue/ui/card'
import { TourArrow, TourContent, TourControl, TourOverlay, TourPortal, TourRoot, TourStep } from '@fex-design/vue/primitive/tour'
import { DemoTarget, TourPanel } from './shared'
import StartButton from './start-button.vue'
</script>
<template><Card title="自定义操作" description="Control 只提供行为，按钮布局和视觉由业务决定。"><TourRoot><div class="flex items-center gap-2"><DemoTarget name="actions-target">操作目标</DemoTarget><StartButton /></div><TourPortal><TourOverlay /><TourStep name="actions" target="actions-target"><TourContent><TourArrow /><TourPanel title="自定义操作" description="这里使用自定义的操作按钮布局。"><div class="flex items-center justify-between"><TourControl action="skip" class="border-transparent px-0 text-muted-foreground">稍后</TourControl><TourControl action="complete" class="!border-primary !bg-primary !text-primary-foreground">知道了</TourControl></div></TourPanel></TourContent></TourStep></TourPortal></TourRoot></Card></template>
