import * as Tooltip from '@fex-design/react/primitive/tooltip'
import { Button } from '@fex-design/react/ui/button'
import { Kbd } from '@fex-design/react/ui/kbd'

export function BasicDemo() {
  return <div className="flex flex-wrap items-center gap-space-md">
    <Tooltip.TooltipRoot><Tooltip.TooltipTrigger>{(props) => <Button {...props} variant="outline">Hover or focus</Button>}</Tooltip.TooltipTrigger><Tooltip.TooltipPortal><Tooltip.TooltipContent>Helpful information<Tooltip.TooltipArrow /></Tooltip.TooltipContent></Tooltip.TooltipPortal></Tooltip.TooltipRoot>
    <Tooltip.TooltipRoot><Tooltip.TooltipTrigger>{(props) => <Button {...props} variant="outline">Save</Button>}</Tooltip.TooltipTrigger><Tooltip.TooltipPortal><Tooltip.TooltipContent className="flex items-center gap-2">Save changes <Kbd>S</Kbd><Tooltip.TooltipArrow /></Tooltip.TooltipContent></Tooltip.TooltipPortal></Tooltip.TooltipRoot>
  </div>
}
