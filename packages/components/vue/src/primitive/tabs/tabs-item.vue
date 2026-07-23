<script setup lang="ts">
import { tabsCloseClassName, tabsItemClassName } from '@fex/components-styles/tabs'
import { cn } from '@fex/utils'
import { computed, inject, mergeProps, onBeforeUnmount, useAttrs } from 'vue'
import CloseIcon from '../../icon/close-icon.vue'
import { tabsContextKey } from './context'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ value: string, disabled?: boolean, closable?: boolean }>(), { disabled: false, closable: false })
const attrs = useAttrs()
const context = inject(tabsContextKey)
if (!context) throw new Error('TabsItem must be used inside TabsRoot.')

const item = computed(() => ({ value: props.value, disabled: props.disabled, closable: props.closable }))
const itemProps = computed(() => {
  const { class: userClass, ...forwardedAttrs } = attrs
  return mergeProps(forwardedAttrs, context.getItemProps(item.value), {
    class: cn(tabsItemClassName({ variant: context.variant() }), userClass as string | undefined),
  })
})
const state = computed(() => context.itemState(item.value))
const closeProps = computed(() => ({ ...context.getCloseProps(item.value), class: tabsCloseClassName }))
context.registerItem(item.value)
onBeforeUnmount(() => context.registerItem(item.value, null))
</script>

<template><slot v-if="$slots.render" name="render" :props="itemProps" :state="state" :close-props="closeProps" /><div v-else v-bind="itemProps"><slot /><button v-if="props.closable" v-bind="closeProps"><CloseIcon class="size-4" /></button></div></template>
