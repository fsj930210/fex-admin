import * as Tooltip from '@fex-design/react/primitive/tooltip'
import { Button } from '@fex-design/react/ui/button'
const placements = ['topLeft', 'top', 'topRight', 'leftTop', 'rightTop', 'left', 'right', 'leftBottom', 'rightBottom', 'bottomLeft', 'bottom', 'bottomRight'] as const
export function PlacementDemo() {
  return <div className="grid grid-cols-3 gap-space-md py-space-lg">{placements.map((placement) => <Tooltip.TooltipRoot key={placement} placement={placement}><Tooltip.TooltipTrigger>{(props) => <Button {...props} className="h-16" variant="outline">{placement}</Button>}</Tooltip.TooltipTrigger><Tooltip.TooltipPortal><Tooltip.TooltipContent>{placement}<Tooltip.TooltipArrow /></Tooltip.TooltipContent></Tooltip.TooltipPortal></Tooltip.TooltipRoot>)}</div>
}
