<script setup lang="ts">
import { tabsContentClassName } from '@fex/components-styles/tabs'
import { cn } from '@fex/utils'
import { computed, inject, mergeProps, useAttrs } from 'vue'
import { tabsContextKey } from './context'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ value: string }>()
const attrs = useAttrs()
const context = inject(tabsContextKey)
if (!context) throw new Error('TabsContent must be used inside TabsRoot.')

const mounted = computed(() => {
  const active = context.snapshot.value.value === props.value
  return active || context.isContentMounted(props.value)
})
const active = computed(() => context.snapshot.value.value === props.value)
const contentProps = computed(() => {
  const { class: userClass, ...forwardedAttrs } = attrs
  return mergeProps(forwardedAttrs, context.getContentProps(props.value), {
    class: cn(tabsContentClassName({ variant: context.variant() }), userClass as string | undefined),
  })
})
</script>

<template><slot v-if="mounted && $slots.render" name="render" :props="contentProps" :state="{ active }" /><div v-else-if="mounted" v-bind="contentProps"><slot /></div></template>
