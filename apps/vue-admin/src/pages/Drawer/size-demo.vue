<script setup lang="ts">
import { ref } from 'vue'
import { DrawerRoot, DrawerTrigger, DrawerPortal, DrawerMask, DrawerContent, DrawerResizeHandle, DrawerHeader, DrawerBody, DrawerClose } from '@fex/components-vue/primitive/drawer'
import Button from '@fex/components-vue/ui/button'
const size = ref(400)
</script>
<template><DrawerRoot :size="size" resizable :on-size-change="value => size = value"><DrawerTrigger v-slot="{ props }"><Button v-bind="props">Resizable ({{ size }}px)</Button></DrawerTrigger><DrawerPortal><DrawerMask/><DrawerContent :size="size" aria-label="Resizable drawer"><DrawerResizeHandle /><DrawerHeader>Resizable drawer<DrawerClose /></DrawerHeader><DrawerBody>Resize uses the shared Vue composable.</DrawerBody></DrawerContent></DrawerPortal></DrawerRoot></template>
