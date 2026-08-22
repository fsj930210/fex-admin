import * as Dialog from '@fex-design/react/primitive/dialog'
import {
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerMask,
  DrawerPortal,
  DrawerRoot,
  DrawerTrigger,
} from '@fex-design/react/primitive/drawer'
import { Watermark } from '@fex-design/react/primitive/watermark'
import { Button } from '@fex-design/react/ui/button'
import { Card } from '@fex-design/react/ui/card'

export function ModalDrawerDemo() {
  return (
    <Card title="Modal and Drawer" description="Watermark can wrap modal and drawer content.">
      <div className="flex flex-wrap gap-space-md">
        <Dialog.DialogRoot>
          <Dialog.DialogTrigger>
            {(props) => <Button {...props}>Open modal</Button>}
          </Dialog.DialogTrigger>
          <Dialog.DialogPortal>
            <Dialog.DialogOverlay />
            <Dialog.DialogContent aria-label="Watermarked modal">
              <Watermark content="FEX Admin">
                <Dialog.DialogHeader>
                  <Dialog.DialogTitle>Watermarked modal</Dialog.DialogTitle>
                  <Dialog.DialogDescription>
                    Dialog content is covered by the watermark layer.
                  </Dialog.DialogDescription>
                </Dialog.DialogHeader>
                <Dialog.DialogBody className="min-h-36">
                  This modal body is wrapped by Watermark.
                </Dialog.DialogBody>
                <Dialog.DialogFooter>
                  <Dialog.DialogClose>
                    {(props) => <Button {...props}>Close</Button>}
                  </Dialog.DialogClose>
                </Dialog.DialogFooter>
              </Watermark>
            </Dialog.DialogContent>
          </Dialog.DialogPortal>
        </Dialog.DialogRoot>
        <DrawerRoot>
          <DrawerTrigger>
            {(props) => (
              <Button {...props} variant="outline">
                Open drawer
              </Button>
            )}
          </DrawerTrigger>
          <DrawerPortal>
            <DrawerMask />
            <DrawerContent aria-label="Watermarked drawer">
              <Watermark content="FEX Admin">
                <DrawerHeader>
                  <span className="font-medium">Watermarked drawer</span>
                  <DrawerClose />
                </DrawerHeader>
                <DrawerBody>
                  <div className="min-h-40">Drawer content is wrapped by Watermark.</div>
                </DrawerBody>
              </Watermark>
            </DrawerContent>
          </DrawerPortal>
        </DrawerRoot>
      </div>
    </Card>
  )
}
