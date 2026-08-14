<script setup lang="ts">import { messageAvatarClassName } from '@fex-design/styles/message'; import { cn } from '@fex/utils'; import { useAttrs } from 'vue'; defineOptions({inheritAttrs:false}); const attrs=useAttrs()</script>
<template><div v-bind="attrs" data-slot="message-avatar" :class="cn(messageAvatarClassName,attrs.class as string|undefined)"><slot /></div></template>
