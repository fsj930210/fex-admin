import * as Tooltip from '@fex-design/react/primitive/tooltip'
import { Button } from '@fex-design/react/ui/button'
export function StyleDemo() {
  return <div className="flex flex-wrap gap-space-md">
    <Tooltip.TooltipRoot><Tooltip.TooltipTrigger>{(props) => <Button {...props} variant="outline">Custom color</Button>}</Tooltip.TooltipTrigger><Tooltip.TooltipPortal><Tooltip.TooltipContent className="[--tooltip-background:#db2777] [--tooltip-foreground:white]">One variable colors the surface and arrow<Tooltip.TooltipArrow /></Tooltip.TooltipContent></Tooltip.TooltipPortal></Tooltip.TooltipRoot>
    <Tooltip.TooltipRoot><Tooltip.TooltipTrigger>{(props) => <Button {...props} variant="outline">Without arrow</Button>}</Tooltip.TooltipTrigger><Tooltip.TooltipPortal><Tooltip.TooltipContent>No TooltipArrow is rendered</Tooltip.TooltipContent></Tooltip.TooltipPortal></Tooltip.TooltipRoot>
  </div>
}
