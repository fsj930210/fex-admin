<script lang="ts">
  import Dialog from '@fex-design/svelte/primitive/dialog'
  import DialogBody from '@fex-design/svelte/primitive/dialog-body'
  import DialogClose from '@fex-design/svelte/primitive/dialog-close'
  import DialogContent from '@fex-design/svelte/primitive/dialog-content'
  import DialogDescription from '@fex-design/svelte/primitive/dialog-description'
  import DialogFooter from '@fex-design/svelte/primitive/dialog-footer'
  import DialogHeader from '@fex-design/svelte/primitive/dialog-header'
  import DialogOverlay from '@fex-design/svelte/primitive/dialog-overlay'
  import DialogPortal from '@fex-design/svelte/primitive/dialog-portal'
  import DialogTitle from '@fex-design/svelte/primitive/dialog-title'
  import DialogTrigger from '@fex-design/svelte/primitive/dialog-trigger'
  import Drawer from '@fex-design/svelte/primitive/drawer'
  import DrawerBody from '@fex-design/svelte/primitive/drawer-body'
  import DrawerClose from '@fex-design/svelte/primitive/drawer-close'
  import DrawerContent from '@fex-design/svelte/primitive/drawer-content'
  import DrawerHeader from '@fex-design/svelte/primitive/drawer-header'
  import DrawerMask from '@fex-design/svelte/primitive/drawer-mask'
  import DrawerPortal from '@fex-design/svelte/primitive/drawer-portal'
  import DrawerTrigger from '@fex-design/svelte/primitive/drawer-trigger'
  import Watermark from '@fex-design/svelte/primitive/watermark'
  import Button from '@fex-design/svelte/ui/button'
  import Card from '@fex-design/svelte/ui/card'
</script>

<Card title="Modal and Drawer" description="Watermark can wrap modal and drawer content.">
  <div class="flex flex-wrap gap-space-md">
    <Dialog>
      <DialogTrigger>
        {#snippet children(slot)}
          <Button
            action={slot.action}
            aria-controls={slot.props['aria-controls']}
            aria-expanded={slot.props['aria-expanded']}
            aria-haspopup={slot.props['aria-haspopup']}
            data-state={slot.props['data-state']}
            onclick={slot.props.onclick}
          >Open modal</Button>
        {/snippet}
      </DialogTrigger>
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
              <DialogClose>
                {#snippet button(props)}
                  <Button onclick={props.onclick}>Close</Button>
                {/snippet}
              </DialogClose>
            </DialogFooter>
          </Watermark>
        </DialogContent>
      </DialogPortal>
    </Dialog>
    <Drawer>
      <DrawerTrigger>
        {#snippet children(props)}
          <Button {...props} variant="outline">Open drawer</Button>
        {/snippet}
      </DrawerTrigger>
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
    </Drawer>
  </div>
</Card>
