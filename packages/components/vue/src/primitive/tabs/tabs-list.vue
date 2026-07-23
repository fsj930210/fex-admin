<script setup lang="ts">
import { tabsListClassName } from '@fex/components-styles/tabs'
import { cn } from '@fex/utils'
import { computed, inject, mergeProps, useAttrs } from 'vue'
import { tabsContextKey } from './context'

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const context = inject(tabsContextKey)
if (!context) throw new Error('TabsList must be used inside TabsRoot.')

const listProps = computed(() => {
  const { class: userClass, ...forwardedAttrs } = attrs
  return mergeProps(forwardedAttrs, context.getListProps(), {
    class: cn(tabsListClassName({ variant: context.variant(), orientation: context.orientation() }), userClass as string | undefined),
  })
})
</script>

<template><slot v-if="$slots.render" name="render" :props="listProps" /><div v-else v-bind="listProps"><slot /></div></template>
