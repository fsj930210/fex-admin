<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BasicDemo from './basic-demo.vue'
import ControlledDemo from './controlled-demo.vue'
import CustomActionsDemo from './actions-demo.vue'
import CustomGapDemo from './gap-demo.vue'
import CustomIndicatorDemo from './indicator-demo.vue'
import CustomMaskDemo from './mask-demo.vue'
import NonModalDemo from './non-modal-demo.vue'
import PlacementDemo from './placement-demo.vue'
</script>
<template><main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-sm"><RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">返回首页</RouterLink><div><h1 class="text-2xl font-semibold text-foreground">Tour 漫游引导</h1><p class="max-w-3xl text-sm leading-6 text-muted-foreground">通过组合式 primitive 实现可控、可扩展的页面引导。</p></div></header><div class="space-y-space-xl"><BasicDemo /><ControlledDemo /><CustomActionsDemo /><CustomGapDemo /><CustomIndicatorDemo /><CustomMaskDemo /><NonModalDemo /><PlacementDemo /></div></div></main></template>
