<script setup lang="ts">import { dialogFooterClassName } from '@fex/components-styles/dialog'; import { cn } from '@fex/utils'; const props = defineProps<{ class?: string }>()</script>
<template><div v-bind="$attrs" data-slot="dialog-footer" :class="cn(dialogFooterClassName, props.class)"><slot /></div></template>
