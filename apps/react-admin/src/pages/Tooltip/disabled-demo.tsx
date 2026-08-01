import * as Tooltip from '@fex/components-react/primitive/tooltip'
import { Button } from '@fex/components-react/ui/button'
export function DisabledDemo() {
  return <Tooltip.TooltipRoot><Tooltip.TooltipTrigger>{(props) => <span {...props} tabIndex={0} className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus/50"><Button disabled className="pointer-events-none" variant="outline">Disabled</Button></span>}</Tooltip.TooltipTrigger><Tooltip.TooltipPortal><Tooltip.TooltipContent>This feature is currently unavailable<Tooltip.TooltipArrow /></Tooltip.TooltipContent></Tooltip.TooltipPortal></Tooltip.TooltipRoot>
}
