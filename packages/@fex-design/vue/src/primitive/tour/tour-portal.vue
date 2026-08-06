<script setup lang="ts">
import { computed } from 'vue'
import { useTourContext } from './context'
const props = defineProps<{ container?: HTMLElement | null }>()
const { snapshot, controller, getPopupContainer } = useTourContext('TourPortal')
const target = computed(() => snapshot.value.currentStep?.target ? controller.getTarget(snapshot.value.currentStep.target) : null)
const container = computed(() => props.container ?? getPopupContainer?.(target.value) ?? 'body')
</script>
<template><Teleport :to="container"><slot /></Teleport></template>
