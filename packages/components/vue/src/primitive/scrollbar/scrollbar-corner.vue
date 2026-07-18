<script setup lang="ts">
import { scrollbarCornerClassName } from '@fex/components-styles/scrollbar'; import { cn } from '@fex/utils'; import { useAttrs } from 'vue'
defineOptions({ inheritAttrs: false }); const attrs = useAttrs()
</script>
<template><div v-bind="attrs" data-slot="scrollbar-corner" :class="cn(scrollbarCornerClassName, attrs.class as string | undefined)" /></template>
