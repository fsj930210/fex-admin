import { ContextMenuContent, ContextMenuPortal, ContextMenuRoot, ContextMenuTrigger } from '@fex-design/react/primitive/context-menu'
import { Card } from '@fex-design/react/ui/card'
import { ContextMenuSurface } from './menu-surface'

const nodes = [
  { id: 'company', name: 'Fex Design', level: 0 },
  { id: 'platform', name: 'Platform team', level: 1 },
  { id: 'components', name: 'Components team', level: 1 },
  { id: 'docs', name: 'Docs team', level: 1 },
]

export function TreeContextMenuDemo() {
  return (
    <Card title="Tree node menu" description="Each tree row stays the actual trigger target, so ContextMenu does not disturb indentation, row height or virtual-list structure.">
      <ContextMenuRoot<string>>
        <div role="tree" className="max-w-md rounded-md border border-border bg-background p-1">
          {nodes.map((node) => (
            <ContextMenuTrigger<string, HTMLDivElement> key={node.id} payload={node.id}>
              {(props) => <div {...props} role="treeitem" tabIndex={0} aria-level={node.level + 1} className="flex h-8 items-center rounded-md px-2 text-sm outline-none hover:bg-muted-background focus:bg-muted-background" style={{ paddingLeft: 8 + node.level * 20 }}>{node.name}</div>}
            </ContextMenuTrigger>
          ))}
        </div>
        <ContextMenuPortal><ContextMenuContent><ContextMenuSurface label="Tree node actions" /></ContextMenuContent></ContextMenuPortal>
      </ContextMenuRoot>
    </Card>
  )
}
