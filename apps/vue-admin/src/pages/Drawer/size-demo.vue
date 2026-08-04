<script setup lang="ts">
import { ref } from 'vue'
import { Radio, RadioGroup } from '@fex-design/vue/primitive/radio'
import { DrawerRoot, DrawerTrigger, DrawerPortal, DrawerMask, DrawerContent, DrawerResizeHandle, DrawerHeader, DrawerBody, DrawerClose } from '@fex-design/vue/primitive/drawer'
import Button from '@fex-design/vue/ui/button'
const placements = ['top', 'right', 'bottom', 'left'] as const
const placement = ref<(typeof placements)[number]>('right')
const size = ref(400)
</script>
<template>
  <div class="space-y-3">
    <RadioGroup :value="placement" orientation="horizontal" @value-change="value => placement = value as typeof placement">
      <label v-for="item in placements" :key="item" class="inline-flex items-center gap-2 text-sm text-foreground"><Radio :value="item" /><span>{{ item }}</span></label>
    </RadioGroup>
    <DrawerRoot :placement="placement" :size="size" resizable :on-size-change="value => size = value"><DrawerTrigger v-slot="{ props }"><Button v-bind="props">Resizable {{ placement }} ({{ Math.round(size) }}px)</Button></DrawerTrigger><DrawerPortal><DrawerMask/><DrawerContent :size="size" aria-label="Resizable drawer"><DrawerResizeHandle /><DrawerHeader>Resizable {{ placement }} drawer<DrawerClose /></DrawerHeader><DrawerBody>Drag the inner edge to change {{ placement === 'left' || placement === 'right' ? 'width' : 'height' }}.</DrawerBody></DrawerContent></DrawerPortal></DrawerRoot>
  </div>
</template>
