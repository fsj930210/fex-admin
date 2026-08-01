<script setup lang="ts">
import { ref } from 'vue'
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from '@fex/components-vue/primitive/tooltip'
import Button from '@fex/components-vue/ui/button'
const open = ref(false)
</script>
<template><div class="flex gap-space-md"><Button variant="secondary" @click="open = !open">{{ open ? 'Close externally' : 'Open externally' }}</Button><TooltipRoot :open="open" @open-change="open = $event"><TooltipTrigger v-slot="slot"><Button v-bind="slot.props" :ref="slot.ref" variant="outline">Controlled trigger</Button></TooltipTrigger><TooltipPortal><TooltipContent>Controlled state remains external<TooltipArrow /></TooltipContent></TooltipPortal></TooltipRoot></div></template>
