import {
  Dialog,
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
} from '@fex-design/solid/primitive/dialog'
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerMask,
  DrawerPortal,
  DrawerTrigger,
} from '@fex-design/solid/primitive/drawer'
import { Watermark } from '@fex-design/solid/primitive/watermark'
import { Button } from '@fex-design/solid/ui/button'
import { Card } from '@fex-design/solid/ui/card'

export function ModalDrawerDemo() {
  return (
    <Card title="Modal and Drawer" description="Watermark can wrap modal and drawer content.">
      <div class="flex flex-wrap gap-space-md">
        <Dialog>
          <DialogTrigger>
            {(slot) => (
              <Button {...slot.props} ref={(element) => slot.ref(element)}>
                Open modal
              </Button>
            )}
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent>
              <Watermark content="FEX Admin">
                <DialogHeader>
                  <DialogTitle>Watermarked modal</DialogTitle>
                  <DialogDescription>
                    Dialog content is covered by the watermark layer.
                  </DialogDescription>
                </DialogHeader>
                <DialogBody class="min-h-36">This modal body is wrapped by Watermark.</DialogBody>
                <DialogFooter>
                  <DialogClose>{(props) => <Button {...props}>Close</Button>}</DialogClose>
                </DialogFooter>
              </Watermark>
            </DialogContent>
          </DialogPortal>
        </Dialog>
        <Drawer>
          <DrawerTrigger>
            {(slot) => (
              <Button {...slot.props} ref={(element) => slot.ref(element)} variant="outline">
                Open drawer
              </Button>
            )}
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
  )
}
