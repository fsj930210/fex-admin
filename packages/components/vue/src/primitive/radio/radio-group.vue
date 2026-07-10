<script setup lang="ts">
import { createSelectionController } from '@fex/components-core/selection/create-selection-controller'
import type { SelectionChangeMeta } from '@fex/components-core/selection/types'
import { radioGroupClassName, type RadioGroupStyleProps } from '@fex/components-styles/radio'
import { cn } from '@fex/utils'
import { computed, provide, useAttrs } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { radioContextKey, type RadioChangeMeta, type RadioValue } from './context'
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ value?: RadioValue, defaultValue?: RadioValue, disabled?: boolean, orientation?: RadioGroupStyleProps['orientation'] }>(), { disabled: false, orientation: 'vertical' })
const emit = defineEmits<{ valueChange: [value: RadioValue, meta: RadioChangeMeta] }>()
const attrs = useAttrs()
const controller = createSelectionController({
  get value() { return props.value }, get defaultValue() { return props.defaultValue }, get multiple() { return false },
  onChange(values, meta: SelectionChangeMeta) {
    const value = values[0]
    if (value !== undefined) emit('valueChange', value, { previousValue: meta.previousValues[0], value, changedValues: meta.changedValues })
  },
})
const snapshot = useCoreStore(controller)
const currentValue = computed(() => props.value ?? snapshot.value.value)
provide(radioContextKey, { value: () => currentValue.value, disabled: () => props.disabled, select: (value) => controller.replace(value) })
</script>
<template><div v-bind="attrs" role="radiogroup" :data-orientation="props.orientation" :data-disabled="props.disabled ? 'true' : undefined" :class="cn(radioGroupClassName({ orientation: props.orientation }), attrs.class as string | undefined)"><slot /></div></template>
