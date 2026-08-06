<script setup lang="ts">
import { useTourContext } from '@fex-design/vue/primitive/tour'
const { controller, snapshot } = useTourContext('TourStartButton')
function handleClick() { controller.open() }
</script>
<template><button type="button" :data-tour-open="snapshot.open" class="inline-flex h-9 items-center justify-center rounded-md border border-primary bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90" @click="handleClick">开始引导</button></template>
