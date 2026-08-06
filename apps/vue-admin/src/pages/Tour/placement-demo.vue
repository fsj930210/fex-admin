<script setup lang="ts">
import Card from '@fex-design/vue/ui/card'
import { TourArrow, TourContent, TourOverlay, TourPortal, TourRoot, TourStep, TourTarget } from '@fex-design/vue/primitive/tour'
import { TourNavigation, TourPanel } from './shared'
import StartButton from './start-button.vue'
const placements = ['top', 'topLeft', 'topRight', 'right', 'rightTop', 'rightBottom', 'bottom', 'bottomLeft', 'bottomRight', 'left', 'leftTop', 'leftBottom'] as const
</script>
<template><Card title="位置" description="主方向决定浮层在哪一侧，后缀决定与目标边缘的对齐方式。"><TourRoot><div class="grid grid-cols-2 items-center gap-3 lg:grid-cols-3"><TourTarget v-for="placement in placements" :key="placement" :name="`placement-${placement}`" v-slot="slot"><div v-bind="slot.props" :ref="slot.ref" role="button" tabindex="0" class="flex h-12 w-36 items-center justify-center justify-self-center rounded-md border border-border px-3 text-sm">{{ placement }}</div></TourTarget><StartButton /></div><TourPortal><TourOverlay /><TourStep v-for="placement in placements" :key="placement" :name="`placement-${placement}`" :target="`placement-${placement}`" :placement="placement"><TourContent><TourArrow /><TourPanel :title="placement" :description="`当前浮层位于目标的 ${placement} 方向。`"><TourNavigation /></TourPanel></TourContent></TourStep></TourPortal></TourRoot></Card></template>
