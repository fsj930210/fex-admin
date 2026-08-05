import { createSignal } from 'solid-js'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuTrigger,
} from '@fex-design/solid/primitive/context-menu'
import { ContextMenuSurface } from './menu-surface'

export function BasicContextMenuDemo() {
  const [last, setLast] = createSignal('Right click the panel')
  return (
    <ContextMenu
      onOpenChange={(open, info) => {
        if (open) setLast('Opened ' + info.payload + ' at ' + Math.round(info.clientX ?? 0) + ', ' + Math.round(info.clientY ?? 0))
      }}
    >
      {() => <>
      <ContextMenuTrigger payload="basic-panel">
        {(trigger) => (
          <div
            {...trigger.props}
            ref={trigger.ref}
            tabIndex={0}
            class="rounded-md border border-dashed border-border bg-background p-space-xl text-sm text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            {last()}
          </div>
        )}
      </ContextMenuTrigger>
      <ContextMenuPortal>
        <ContextMenuContent>
          <ContextMenuSurface label="Panel actions" />
        </ContextMenuContent>
      </ContextMenuPortal>
      </>}
    </ContextMenu>
  )
}
