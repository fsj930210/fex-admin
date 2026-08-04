import { createSignal } from 'solid-js'
import type { DrawerPlacement } from '@fex-design/core/drawer/types'
import { Radio, RadioGroup } from '@fex-design/solid/primitive/radio'
import { Drawer, DrawerBody, DrawerClose, DrawerContent, DrawerHeader, DrawerMask, DrawerPortal, DrawerResizeHandle, DrawerTrigger } from '@fex-design/solid/primitive/drawer'
import { Button } from '@fex-design/solid/ui/button'

const placements: DrawerPlacement[] = ['top', 'right', 'bottom', 'left']

export function SizeDemo() {
  const [placement, setPlacement] = createSignal<DrawerPlacement>('right')
  const [size, setSize] = createSignal(400)
  return <div class="space-y-3">
    <RadioGroup value={placement()} orientation="horizontal" onValueChange={(value) => setPlacement(value as DrawerPlacement)}>
      {placements.map((item) => <label class="inline-flex items-center gap-2 text-sm text-foreground"><Radio value={item} /><span>{item}</span></label>)}
    </RadioGroup>
    <Drawer placement={placement()} size={size()} resizable onSizeChange={setSize}>
      <DrawerTrigger>{(slot) => <Button {...slot.props} ref={slot.ref}>Resizable {placement()} ({Math.round(size())}px)</Button>}</DrawerTrigger>
      <DrawerPortal><DrawerMask/><DrawerContent aria-label="Resizable drawer"><DrawerResizeHandle /><DrawerHeader>Resizable {placement()} drawer<DrawerClose /></DrawerHeader><DrawerBody>Drag the inner edge to change {placement() === 'left' || placement() === 'right' ? 'width' : 'height'}.</DrawerBody></DrawerContent></DrawerPortal>
    </Drawer>
  </div>
}
