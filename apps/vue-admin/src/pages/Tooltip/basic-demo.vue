<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger } from '@fex/components-vue/primitive/tooltip'
import Button from '@fex/components-vue/ui/button'
import { Kbd } from '@fex/components-vue/ui/kbd'
</script>
<template><div class="flex flex-wrap gap-space-md"><TooltipRoot><TooltipTrigger v-slot="slot"><Button v-bind="slot.props" :ref="slot.ref" variant="outline">Hover or focus</Button></TooltipTrigger><TooltipPortal><TooltipContent>Helpful information<TooltipArrow /></TooltipContent></TooltipPortal></TooltipRoot><TooltipRoot><TooltipTrigger v-slot="slot"><Button v-bind="slot.props" :ref="slot.ref" variant="outline">Save</Button></TooltipTrigger><TooltipPortal><TooltipContent class="flex items-center gap-2">Save changes <Kbd>S</Kbd><TooltipArrow /></TooltipContent></TooltipPortal></TooltipRoot></div></template>
