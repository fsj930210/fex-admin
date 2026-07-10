<script setup lang="ts">
import { checkboxGroupClassName, type CheckboxGroupStyleProps } from '@fex/components-styles/checkbox'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'
import { CheckboxGroup as PrimitiveCheckboxGroup } from '../../primitive/checkbox/checkbox'
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ orientation?: CheckboxGroupStyleProps['orientation'] }>(), { orientation: 'vertical' })
const attrs = useAttrs()
</script>
<template><PrimitiveCheckboxGroup v-bind="attrs" data-slot="checkbox-group" :data-orientation="props.orientation" :class="cn(checkboxGroupClassName({ orientation: props.orientation }), attrs.class as string | undefined)"><slot /></PrimitiveCheckboxGroup></template>
