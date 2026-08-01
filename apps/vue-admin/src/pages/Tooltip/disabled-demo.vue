<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from '@fex/components-vue/primitive/tooltip'
import Button from '@fex/components-vue/ui/button'
</script>
<template><TooltipRoot><TooltipTrigger v-slot="slot"><span v-bind="slot.props" :ref="slot.ref" tabindex="0" class="inline-flex rounded-md focus-visible:ring-3 focus-visible:ring-focus/50"><Button disabled class="pointer-events-none" variant="outline">Disabled</Button></span></TooltipTrigger><TooltipPortal><TooltipContent>This feature is currently unavailable<TooltipArrow /></TooltipContent></TooltipPortal></TooltipRoot></template>
