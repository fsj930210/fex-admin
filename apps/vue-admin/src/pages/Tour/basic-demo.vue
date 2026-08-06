<script setup lang="ts">
import Card from '@fex-design/vue/ui/card'
import { TourArrow, TourContent, TourOverlay, TourPortal, TourRoot, TourStep } from '@fex-design/vue/primitive/tour'
import { DefaultTourActions, DemoTarget, TourPanel } from './shared'
import StartButton from './start-button.vue'
</script>
<template><Card title="基本 / 非受控" description="通过 TourStep 组合注册步骤，不使用 steps 数组。"><TourRoot><div class="flex flex-wrap items-center gap-2"><DemoTarget name="basic-first">第一个目标</DemoTarget><DemoTarget name="basic-second">第二个目标</DemoTarget><StartButton /></div><TourPortal><TourOverlay /><TourStep name="basic-first" target="basic-first"><TourContent><TourArrow /><TourPanel title="第 1 步" description="这是一个非受控 Tour。"><DefaultTourActions /></TourPanel></TourContent></TourStep><TourStep name="basic-second" target="basic-second"><TourContent><TourArrow /><TourPanel title="第 2 步" description="步骤通过组合式 primitive 注册。"><DefaultTourActions /></TourPanel></TourContent></TourStep></TourPortal></TourRoot></Card></template>
