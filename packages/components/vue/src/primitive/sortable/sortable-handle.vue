<script setup lang="ts">import { cn } from '@fex/utils'; import { useAttrs } from 'vue'; defineOptions({ inheritAttrs: false }); const props = defineProps<{ class?: string }>(); const attrs = useAttrs()</script>
<template><button v-bind="attrs" type="button" data-sortable-handle="" :class="cn('cursor-grab touch-none select-none active:cursor-grabbing', props.class)"><slot /></button></template>
