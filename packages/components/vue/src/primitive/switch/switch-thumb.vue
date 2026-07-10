<script setup lang="ts">
import { switchThumbClassName, type SwitchStyleProps } from '@fex/components-styles/switch'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ checked?: boolean, size?: SwitchStyleProps['size'] }>(), { checked: false, size: 'default' })
const attrs = useAttrs()
const state = computed(() => props.checked ? 'checked' : 'unchecked')
</script>
<template><span v-bind="attrs" :data-state="state" :class="cn(switchThumbClassName({ size: props.size }), attrs.class as string | undefined)" /></template>
