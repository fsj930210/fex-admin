<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from '@fex/components-vue/primitive/tooltip'
import Button from '@fex/components-vue/ui/button'
const placements = ['topLeft', 'top', 'topRight', 'leftTop', 'rightTop', 'left', 'right', 'leftBottom', 'rightBottom', 'bottomLeft', 'bottom', 'bottomRight'] as const
</script>
<template><div class="grid grid-cols-3 gap-space-md py-space-lg"><TooltipRoot v-for="placement in placements" :key="placement" :placement="placement"><TooltipTrigger v-slot="slot"><Button v-bind="slot.props" :ref="slot.ref" class="h-16" variant="outline">{{ placement }}</Button></TooltipTrigger><TooltipPortal><TooltipContent>{{ placement }}<TooltipArrow /></TooltipContent></TooltipPortal></TooltipRoot></div></template>
