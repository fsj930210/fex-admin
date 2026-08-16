<script setup lang="ts">
import { inputGroupAddonClassName } from '@fex-design/styles/input'
import { cn } from '@fex/utils'
defineProps<{ class?: string }>()
</script>
<template><span data-slot="input-group-addon" :class="cn(inputGroupAddonClassName, $props.class)"><slot /></span></template>
