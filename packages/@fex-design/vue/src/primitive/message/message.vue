<script setup lang="ts">
import type { MessageSide } from '@fex-design/core/message/types'; import { messageClassName } from '@fex-design/styles/message'; import { cn } from '@fex/utils'; import { provide,toRef,useAttrs } from 'vue'; import { messageSideKey } from '../bubble/context'; import { messageKey } from './context'
defineOptions({inheritAttrs:false}); const props=withDefaults(defineProps<{side?:MessageSide;busy?:boolean}>(),{side:'start',busy:false}); const attrs=useAttrs(); provide(messageKey,{side:toRef(props,'side'),busy:toRef(props,'busy')}); provide(messageSideKey,toRef(props,'side'))
</script>
<template><div v-bind="attrs" data-slot="message" :data-side="side" :data-busy="busy ? 'true':'false'" :aria-busy="busy" :class="cn(messageClassName,attrs.class as string|undefined)"><slot /></div></template>
