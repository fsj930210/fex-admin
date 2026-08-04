<script setup lang="ts">
import { ref } from 'vue'
import { DrawerRoot, DrawerTrigger, DrawerPortal, DrawerMask, DrawerContent, DrawerHeader, DrawerBody, DrawerClose } from '@fex-design/vue/primitive/drawer'
import { RadioGroup, Radio } from '@fex-design/vue/primitive/radio'
import Button from '@fex-design/vue/ui/button'
const placement = ref<'top' | 'right' | 'bottom' | 'left'>('right')
</script>
<template>
  <div class="space-y-3">
    <RadioGroup :value="placement" orientation="horizontal" @value-change="value => placement = value as typeof placement">
      <label v-for="item in ['top','right','bottom','left']" :key="item" class="inline-flex items-center gap-2 text-sm text-foreground"><Radio :value="item" /><span>{{ item }}</span></label>
    </RadioGroup>
    <DrawerRoot :placement="placement"><DrawerTrigger v-slot="{ props }"><Button v-bind="props">Open {{ placement }}</Button></DrawerTrigger><DrawerPortal><DrawerMask/><DrawerContent :aria-label="`${placement} drawer`"><DrawerHeader>{{ placement }} drawer<DrawerClose /></DrawerHeader><DrawerBody>Direction is controlled by the radio group.</DrawerBody></DrawerContent></DrawerPortal></DrawerRoot>
  </div>
</template>
