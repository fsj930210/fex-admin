import { useState } from 'react'
import type { DrawerPlacement } from '@fex/components-core/drawer/types'
import { Radio, RadioGroup } from '@fex/components-react/primitive/radio'
import { DrawerBody, DrawerClose, DrawerContent, DrawerHeader, DrawerMask, DrawerPortal, DrawerResizeHandle, DrawerRoot, DrawerTrigger } from '@fex/components-react/primitive/drawer'

const placements: DrawerPlacement[] = ['top', 'right', 'bottom', 'left']

export function SizeDemo() {
  const [placement, setPlacement] = useState<DrawerPlacement>('right')
  const [size, setSize] = useState(400)
  return <div className="space-y-3">
    <RadioGroup value={placement} orientation="horizontal" onValueChange={(value) => setPlacement(value as DrawerPlacement)}>
      {placements.map((item) => <label key={item} className="inline-flex items-center gap-2 text-sm text-foreground"><Radio value={item} /><span>{item}</span></label>)}
    </RadioGroup>
    <DrawerRoot placement={placement} size={size} resizable onSizeChange={setSize}>
      <DrawerTrigger>{(props) => <button {...props} className="rounded-md bg-primary px-3 py-2 text-primary-foreground">Resizable {placement} ({Math.round(size)}px)</button>}</DrawerTrigger>
      <DrawerPortal><DrawerMask /><DrawerContent aria-label="Resizable drawer"><DrawerResizeHandle /><DrawerHeader><span>Resizable {placement} drawer</span><DrawerClose /></DrawerHeader><DrawerBody>Drag the inner edge to change {placement === 'left' || placement === 'right' ? 'width' : 'height'}.</DrawerBody></DrawerContent></DrawerPortal>
    </DrawerRoot>
  </div>
}
