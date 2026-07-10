<script setup lang="ts">import { dialogBodyClassName } from '@fex/components-styles/dialog'; import { cn } from '@fex/utils'; const props = defineProps<{ class?: string }>()</script>
<template><div v-bind="$attrs" data-slot="dialog-body" :class="cn(dialogBodyClassName, props.class)"><slot /></div></template>
