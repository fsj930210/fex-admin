<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { onBeforeUnmount, onMounted, shallowRef, useAttrs } from 'vue'
import { useTourContext } from './context'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ name: string }>()
const attrs = useAttrs()
const { controller, snapshot } = useTourContext('TourTarget')
const element = shallowRef<HTMLElement | null>(null)
let unregister: (() => void) | undefined
function setReference(value: Element | ComponentPublicInstance | null) {
  const component = value as (ComponentPublicInstance & { $el?: unknown }) | null
  element.value = value instanceof HTMLElement ? value : component?.$el instanceof HTMLElement ? component.$el : null
  controller.refreshTarget()
}
onMounted(() => { unregister = controller.registerTarget(props.name, () => element.value) })
onBeforeUnmount(() => { unregister?.(); controller.refreshTarget() })
</script>
<template><slot :props="{ ...attrs, 'data-tour-target': props.name }" :ref="setReference" :state="snapshot" /></template>
