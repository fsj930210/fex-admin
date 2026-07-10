<script setup lang="ts">
import {
  DialogRoot,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@fex/components-vue/primitive/dialog'
import Button from '@fex/components-vue/ui/button'
import Card from '@fex/components-vue/ui/card'
import { ref } from 'vue'

const open = ref(false)
const iconCloseClassName =
  'absolute right-3 top-3 inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-xl leading-none text-muted-foreground outline-none transition-colors hover:bg-muted-background hover:text-foreground focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-xl">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</RouterLink>
        <div>
          <h1 class="text-2xl font-semibold text-foreground">Dialog</h1>
          <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
            Primitive modal composition backed by the shared core overlay controller.
          </p>
        </div>
      </header>

      <div class="space-y-space-xl">
        <Card title="Primitive" description="Trigger exposes slot props and content owns ARIA labels.">
          <div class="flex min-w-0 flex-wrap items-center gap-space-md">
            <DialogRoot>
              <DialogTrigger v-slot="{ props, ref }">
                <Button v-bind="props" :ref="ref">Open dialog</Button>
              </DialogTrigger>
              <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                  <DialogClose v-slot="{ props }"><button v-bind="props" :class="iconCloseClassName" aria-label="Close">&times;</button></DialogClose>
                  <DialogHeader>
                    <DialogTitle>Archive record</DialogTitle>
                    <DialogDescription>Review the record before archiving it.</DialogDescription>
                  </DialogHeader>
                  <DialogBody>The shared controller handles open state, mounted phase, Escape, and top-layer dismiss.</DialogBody>
                  <DialogFooter>
                    <DialogClose v-slot="{ props }"><Button v-bind="props" variant="outline">Cancel</Button></DialogClose>
                    <DialogClose v-slot="{ props }"><Button v-bind="props">Confirm</Button></DialogClose>
                  </DialogFooter>
                </DialogContent>
              </DialogPortal>
            </DialogRoot>
          </div>
        </Card>

        <Card title="Controlled" description="Controlled mode requests updates through open-change.">
          <div class="flex min-w-0 flex-wrap items-center gap-space-md">
            <DialogRoot :open="open" @open-change="open = $event">
              <DialogTrigger v-slot="{ props, ref }">
                <Button v-bind="props" :ref="ref" variant="outline">{{ open ? 'Open' : 'Closed' }}</Button>
              </DialogTrigger>
              <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                  <DialogClose v-slot="{ props }"><button v-bind="props" :class="iconCloseClassName" aria-label="Close">&times;</button></DialogClose>
                  <DialogHeader>
                    <DialogTitle>Controlled dialog</DialogTitle>
                    <DialogDescription>The parent owns the open state.</DialogDescription>
                  </DialogHeader>
                  <DialogBody>Overlay click and Escape request closing through the controlled callback.</DialogBody>
                  <DialogFooter><DialogClose v-slot="{ props }"><Button v-bind="props">Done</Button></DialogClose></DialogFooter>
                </DialogContent>
              </DialogPortal>
            </DialogRoot>
          </div>
        </Card>

        <Card title="Sizes" description="Content size is a primitive style variant.">
          <div class="flex min-w-0 flex-wrap items-center gap-space-md">
            <DialogRoot v-for="size in ['sm', 'md', 'lg']" :key="size">
              <DialogTrigger v-slot="{ props, ref }">
                <Button v-bind="props" :ref="ref" variant="outline">{{ size }}</Button>
              </DialogTrigger>
              <DialogPortal>
                <DialogOverlay />
                <DialogContent :size="size">
                  <DialogClose v-slot="{ props }"><button v-bind="props" :class="iconCloseClassName" aria-label="Close">&times;</button></DialogClose>
                  <DialogHeader>
                    <DialogTitle>{{ size }} dialog</DialogTitle>
                    <DialogDescription>Each size keeps the same behavior contract.</DialogDescription>
                  </DialogHeader>
                  <DialogBody>The size prop only changes content width.</DialogBody>
                  <DialogFooter><DialogClose v-slot="{ props }"><Button v-bind="props">Close</Button></DialogClose></DialogFooter>
                </DialogContent>
              </DialogPortal>
            </DialogRoot>
          </div>
        </Card>

        <Card title="Dismiss" description="Overlay pointer dismissal can be disabled.">
          <div class="flex min-w-0 flex-wrap items-center gap-space-md">
            <DialogRoot :close-on-overlay-pointer="false">
              <DialogTrigger v-slot="{ props, ref }">
                <Button v-bind="props" :ref="ref" variant="outline">No overlay close</Button>
              </DialogTrigger>
              <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                  <DialogClose v-slot="{ props }"><button v-bind="props" :class="iconCloseClassName" aria-label="Close">&times;</button></DialogClose>
                  <DialogHeader>
                    <DialogTitle>Explicit close</DialogTitle>
                    <DialogDescription>Clicking the overlay does not close this dialog.</DialogDescription>
                  </DialogHeader>
                  <DialogBody>Use the footer actions or Escape to close.</DialogBody>
                  <DialogFooter>
                    <DialogClose v-slot="{ props }"><Button v-bind="props" variant="outline">Cancel</Button></DialogClose>
                    <DialogClose v-slot="{ props }"><Button v-bind="props">Confirm</Button></DialogClose>
                  </DialogFooter>
                </DialogContent>
              </DialogPortal>
            </DialogRoot>
          </div>
        </Card>
      </div>
    </div>
  </main>
</template>
