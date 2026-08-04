<script setup lang="ts">import { stepContentClassName } from '@fex-design/styles/steps'; import { cn } from '@fex/utils'; import { useAttrs } from 'vue'; defineOptions({ inheritAttrs: false }); const attrs = useAttrs()</script>
<template><div v-bind="attrs" :class="cn(stepContentClassName, attrs.class as string | undefined)"><slot /></div></template>
