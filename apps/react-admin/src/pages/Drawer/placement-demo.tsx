import { useState } from 'react'
import type { DrawerPlacement } from '@fex/components-core/drawer/create-drawer-controller'
import { Radio, RadioGroup } from '@fex/components-react/primitive/radio'
import {
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerMask,
  DrawerPortal,
  DrawerRoot,
  DrawerTrigger,
} from '@fex/components-react/primitive/drawer'

const placements: DrawerPlacement[] = ['top', 'right', 'bottom', 'left']

export function PlacementDemo() {
  const [placement, setPlacement] = useState<DrawerPlacement>('right')

  return (
    <div className="space-y-3">
      <RadioGroup
        value={placement}
        orientation="horizontal"
        onValueChange={(value) => setPlacement(value as DrawerPlacement)}
      >
        {placements.map((item) => (
          <label key={item} className="inline-flex items-center gap-2 text-sm text-foreground">
            <Radio value={item} />
            <span>{item}</span>
          </label>
        ))}
      </RadioGroup>

      <DrawerRoot placement={placement}>
        <DrawerTrigger>
          {(props) => (
            <button
              {...props}
              className="rounded-md bg-primary px-3 py-2 text-primary-foreground"
            >
              Open {placement}
            </button>
          )}
        </DrawerTrigger>
        <DrawerPortal>
          <DrawerMask />
          <DrawerContent aria-label={`${placement} drawer`}>
            <DrawerHeader>
              <span>{placement} drawer</span>
              <DrawerClose />
            </DrawerHeader>
            <DrawerBody>Placement is controlled by the parent.</DrawerBody>
          </DrawerContent>
        </DrawerPortal>
      </DrawerRoot>
    </div>
  )
}
