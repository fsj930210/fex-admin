<script setup lang="ts">
import {
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@fex-design/vue/primitive/dialog'
import {
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerMask,
  DrawerPortal,
  DrawerRoot,
} from '@fex-design/vue/primitive/drawer'
import { Watermark } from '@fex-design/vue/primitive/watermark'
import Button from '@fex-design/vue/ui/button'
import Card from '@fex-design/vue/ui/card'
import { ref } from 'vue'

const modalOpen = ref(false)
const drawerOpen = ref(false)
</script>

<template>
  <Card title="Modal and Drawer" description="Watermark can wrap modal and drawer content.">
    <div class="flex flex-wrap gap-space-md">
      <DialogRoot :open="modalOpen" @open-change="modalOpen = $event">
        <Button @click="modalOpen = true">Open modal</Button>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent aria-label="Watermarked modal">
            <Watermark content="FEX Admin">
              <DialogHeader>
                <DialogTitle>Watermarked modal</DialogTitle>
                <DialogDescription>Dialog content is covered by the watermark layer.</DialogDescription>
              </DialogHeader>
              <DialogBody class="min-h-36">This modal body is wrapped by Watermark.</DialogBody>
              <DialogFooter>
                <DialogClose v-slot="{ props }">
                  <Button v-bind="props">Close</Button>
                </DialogClose>
              </DialogFooter>
            </Watermark>
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
      <DrawerRoot :open="drawerOpen" @open-change="drawerOpen = $event">
        <Button variant="outline" @click="drawerOpen = true">Open drawer</Button>
        <DrawerPortal>
          <DrawerMask />
          <DrawerContent aria-label="Watermarked drawer">
            <Watermark content="FEX Admin">
              <DrawerHeader>
                <span class="font-medium">Watermarked drawer</span>
                <DrawerClose />
              </DrawerHeader>
              <DrawerBody>
                <div class="min-h-40">Drawer content is wrapped by Watermark.</div>
              </DrawerBody>
            </Watermark>
          </DrawerContent>
        </DrawerPortal>
      </DrawerRoot>
    </div>
  </Card>
</template>
