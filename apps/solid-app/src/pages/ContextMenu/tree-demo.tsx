import { For } from 'solid-js'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuTrigger,
} from '@fex-design/solid/primitive/context-menu'
import { ContextMenuSurface } from './menu-surface'

const nodes = [
  { id: 'company', name: 'Fex Design', level: 0 },
  { id: 'platform', name: 'Platform team', level: 1 },
  { id: 'components', name: 'Components team', level: 1 },
  { id: 'docs', name: 'Docs team', level: 1 },
]

export function TreeContextMenuDemo() {
  return (
    <ContextMenu>{() => <>
      <div role="tree" class="max-w-md rounded-md border border-border bg-background p-1">
        <For each={nodes}>
          {(node) => (
            <ContextMenuTrigger payload={node.id}>
              {(trigger) => (
                <div
                  {...trigger.props}
                  ref={trigger.ref}
                  role="treeitem"
                  tabIndex={0}
                  aria-level={node.level + 1}
                  class="flex h-8 items-center rounded-md px-2 text-sm outline-none hover:bg-muted-background focus:bg-muted-background"
                  style={{ 'padding-left': 8 + node.level * 20 + 'px' }}
                >
                  {node.name}
                </div>
              )}
            </ContextMenuTrigger>
          )}
        </For>
      </div>
      <ContextMenuPortal>
        <ContextMenuContent>
          <ContextMenuSurface label="Tree node actions" />
        </ContextMenuContent>
      </ContextMenuPortal>
    </>}
    </ContextMenu>
  )
}
