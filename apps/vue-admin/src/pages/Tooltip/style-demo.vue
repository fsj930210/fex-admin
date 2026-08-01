<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from '@fex/components-vue/primitive/tooltip'
import Button from '@fex/components-vue/ui/button'
</script>
<template><div class="flex gap-space-md"><TooltipRoot><TooltipTrigger v-slot="slot"><Button v-bind="slot.props" :ref="slot.ref" variant="outline">Custom color</Button></TooltipTrigger><TooltipPortal><TooltipContent class="[--tooltip-background:#db2777] [--tooltip-foreground:white]">One variable colors both surfaces<TooltipArrow /></TooltipContent></TooltipPortal></TooltipRoot><TooltipRoot><TooltipTrigger v-slot="slot"><Button v-bind="slot.props" :ref="slot.ref" variant="outline">Without arrow</Button></TooltipTrigger><TooltipPortal><TooltipContent>No TooltipArrow is rendered</TooltipContent></TooltipPortal></TooltipRoot></div></template>
