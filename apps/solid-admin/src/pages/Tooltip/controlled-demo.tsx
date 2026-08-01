import * as Tooltip from '@fex/components-solid/primitive/tooltip'
import { Button } from '@fex/components-solid/ui/button'
import { createSignal } from 'solid-js'
export function ControlledDemo() { const [open, setOpen] = createSignal(false); return <div class="flex gap-space-md"><Button variant="secondary" onClick={() => setOpen(!open())}>{open() ? 'Close externally' : 'Open externally'}</Button><Tooltip.TooltipRoot open={open()} onOpenChange={setOpen}><Tooltip.TooltipTrigger>{(slot) => <Button ref={slot.ref} {...slot.props} variant="outline">Controlled trigger</Button>}</Tooltip.TooltipTrigger><Tooltip.TooltipPortal><Tooltip.TooltipContent>Controlled state remains external<Tooltip.TooltipArrow /></Tooltip.TooltipContent></Tooltip.TooltipPortal></Tooltip.TooltipRoot></div> }
