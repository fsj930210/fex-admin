<script setup lang="ts">
import type { CheckboxCheckedState } from '@fex/components-core/checkbox/types'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'
defineOptions({ inheritAttrs: false })
const props = defineProps<{ checked?: CheckboxCheckedState, class?: string, forceMount?: boolean }>()
const attrs = useAttrs()
const state = computed(() => props.checked === 'indeterminate' ? 'indeterminate' : props.checked ? 'checked' : 'unchecked')
</script>
<template><span v-if="props.forceMount || props.checked !== false" v-bind="attrs" :class="cn(props.class, attrs.class as string | undefined)" :data-state="state"><slot /></span></template>
