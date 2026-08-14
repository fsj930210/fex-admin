<script setup lang="ts">import { messageHeaderClassName } from '@fex-design/styles/message'; import { cn } from '@fex/utils'; import { useAttrs } from 'vue'; defineOptions({inheritAttrs:false}); const attrs=useAttrs()</script>
<template><div v-bind="attrs" data-slot="message-header" :class="cn(messageHeaderClassName,attrs.class as string|undefined)"><slot /></div></template>
