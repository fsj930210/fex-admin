<script setup lang="ts">
import { DrawerRoot, DrawerTrigger, DrawerPortal, DrawerMask, DrawerContent, DrawerHeader, DrawerBody, DrawerClose } from '@fex/components-vue/primitive/drawer'
import Button from '@fex/components-vue/ui/button'
</script>
<template><DrawerRoot><DrawerTrigger v-slot="{ props }"><Button v-bind="props">Open drawer</Button></DrawerTrigger><DrawerPortal><DrawerMask/><DrawerContent aria-label="Basic drawer"><DrawerHeader>Basic drawer<DrawerClose /></DrawerHeader><DrawerBody>Drawer content is composed from independent primitives.</DrawerBody></DrawerContent></DrawerPortal></DrawerRoot></template>
