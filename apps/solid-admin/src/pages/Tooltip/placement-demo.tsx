import * as Tooltip from '@fex/components-solid/primitive/tooltip'
import { Button } from '@fex/components-solid/ui/button'
import { For } from 'solid-js'
const placements = ['topLeft', 'top', 'topRight', 'leftTop', 'rightTop', 'left', 'right', 'leftBottom', 'rightBottom', 'bottomLeft', 'bottom', 'bottomRight'] as const
export function PlacementDemo() { return <div class="grid grid-cols-3 gap-space-md py-space-lg"><For each={placements}>{(placement) => <Tooltip.TooltipRoot placement={placement}><Tooltip.TooltipTrigger>{(slot) => <Button ref={slot.ref} {...slot.props} class="h-16" variant="outline">{placement}</Button>}</Tooltip.TooltipTrigger><Tooltip.TooltipPortal><Tooltip.TooltipContent>{placement}<Tooltip.TooltipArrow /></Tooltip.TooltipContent></Tooltip.TooltipPortal></Tooltip.TooltipRoot>}</For></div> }
