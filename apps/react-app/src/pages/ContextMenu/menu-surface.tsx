import { ContextMenuItem } from '@fex-design/react/primitive/context-menu'

export function ContextMenuSurface({ label }: { label: string }) {
  return (
    <div className="grid min-w-44 gap-1 p-1 text-sm">
      <div className="px-2 py-1 text-xs text-muted-foreground">{label}</div>
      <ContextMenuItem className="rounded-md px-2 py-1.5 text-left hover:bg-muted-background">Open</ContextMenuItem>
      <ContextMenuItem className="rounded-md px-2 py-1.5 text-left hover:bg-muted-background">Rename</ContextMenuItem>
      <ContextMenuItem className="rounded-md px-2 py-1.5 text-left text-danger hover:bg-danger/10">Delete</ContextMenuItem>
    </div>
  )
}
