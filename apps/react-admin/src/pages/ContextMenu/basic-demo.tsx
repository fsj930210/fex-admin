import { useState } from 'react'
import { ContextMenuContent, ContextMenuPortal, ContextMenuRoot, ContextMenuTrigger } from '@fex-design/react/primitive/context-menu'
import { Card } from '@fex-design/react/ui/card'
import { ContextMenuSurface } from './menu-surface'

export function BasicContextMenuDemo() {
  const [last, setLast] = useState('Right click the panel')
  return (
    <Card title="Basic right click" description="Trigger render props bind directly to the caller element; no wrapper is inserted.">
      <ContextMenuRoot<string> onOpenChange={(open, info) => open && setLast(`Opened ${info.payload} at ${Math.round(info.clientX ?? 0)}, ${Math.round(info.clientY ?? 0)}`)}>
        <ContextMenuTrigger<string, HTMLDivElement> payload="basic-panel">
          {(props) => <div {...props} tabIndex={0} className="rounded-md border border-dashed border-border bg-background p-space-xl text-sm text-muted-foreground outline-none focus:ring-2 focus:ring-ring">{last}</div>}
        </ContextMenuTrigger>
        <ContextMenuPortal><ContextMenuContent><ContextMenuSurface label="Panel actions" /></ContextMenuContent></ContextMenuPortal>
      </ContextMenuRoot>
    </Card>
  )
}
