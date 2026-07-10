<script setup lang="ts">
import { switchClassName, type SwitchStyleProps } from '@fex/components-styles/switch'
import { cn } from '@fex/utils'
import { computed, ref, useAttrs } from 'vue'
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ checked?: boolean, defaultChecked?: boolean, disabled?: boolean, size?: SwitchStyleProps['size'] }>(), { defaultChecked: false, disabled: false, size: 'default' })
const emit = defineEmits<{ checkedChange: [checked: boolean, event: MouseEvent] }>()
const attrs = useAttrs()
const internalChecked = ref(props.defaultChecked)
const currentChecked = computed(() => props.checked ?? internalChecked.value)
const state = computed(() => currentChecked.value ? 'checked' : 'unchecked')
function handleClick(event: MouseEvent) {
  if (event.defaultPrevented || props.disabled) return
  const nextChecked = !currentChecked.value
  if (props.checked === undefined) internalChecked.value = nextChecked
  emit('checkedChange', nextChecked, event)
}
</script>
<template><button v-bind="attrs" type="button" role="switch" :disabled="props.disabled" :aria-checked="currentChecked" :data-state="state" :data-disabled="props.disabled ? 'true' : undefined" :class="cn(switchClassName({ size: props.size }), attrs.class as string | undefined)" @click="handleClick"><slot :checked="currentChecked" :state="state" :size="props.size" /></button></template>
