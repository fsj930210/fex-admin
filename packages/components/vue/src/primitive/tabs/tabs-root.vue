<script setup lang="ts">
import { provide } from 'vue'
import { tabsContextKey } from './context'
import { useTabs } from './use-tabs'

const props = withDefaults(defineProps<{ modelValue?: string, defaultValue?: string, orientation?: 'horizontal' | 'vertical', variant?: 'default' | 'line', activationMode?: 'automatic' | 'manual', loop?: boolean }>(), { orientation: 'horizontal', variant: 'default', activationMode: 'automatic', loop: true })
const emit = defineEmits<{ 'update:modelValue': [value: string | undefined], change: [value: string | undefined], close: [item: { value: string, disabled?: boolean, closable?: boolean }] }>()
const tabs = useTabs({
  get value() { return props.modelValue }, get defaultValue() { return props.defaultValue },
  get orientation() { return props.orientation }, get activationMode() { return props.activationMode }, get loop() { return props.loop },
  onChange(value) { emit('update:modelValue', value); emit('change', value) }, onClose(item) { emit('close', item) },
})
provide(tabsContextKey, { ...tabs, variant: () => props.variant })
</script>
<template><slot /></template>
