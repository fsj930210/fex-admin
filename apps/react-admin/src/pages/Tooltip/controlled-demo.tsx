import * as Tooltip from '@fex-design/react/primitive/tooltip'
import { Button } from '@fex-design/react/ui/button'
import { useState } from 'react'
export function ControlledDemo() {
  const [open, setOpen] = useState(false)
  return <div className="flex items-center gap-space-md"><Button variant="secondary" onClick={() => setOpen((value) => !value)}>{open ? 'Close externally' : 'Open externally'}</Button><Tooltip.TooltipRoot open={open} onOpenChange={setOpen}><Tooltip.TooltipTrigger>{(props) => <Button {...props} variant="outline">Controlled trigger</Button>}</Tooltip.TooltipTrigger><Tooltip.TooltipPortal><Tooltip.TooltipContent>Controlled state remains external<Tooltip.TooltipArrow /></Tooltip.TooltipContent></Tooltip.TooltipPortal></Tooltip.TooltipRoot></div>
}
