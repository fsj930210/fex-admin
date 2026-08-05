import { createSignal, For } from 'solid-js'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuTrigger,
} from '@fex-design/solid/primitive/context-menu'
import { ContextMenuSurface } from './menu-surface'

const columns = ['Name', 'Department', 'Status', 'Progress']
const rows = [
  ['Ada Lovelace', 'Platform', 'Active', '82%'],
  ['Grace Hopper', 'Components', 'Active', '91%'],
  ['Katherine Johnson', 'Docs', 'Paused', '64%'],
]

export function DataTableContextMenuDemo() {
  const [activePayload, setActivePayload] = createSignal('')
  const label = () => activePayload().startsWith('column:') ? 'Column actions' : 'Row actions'
  return (
    <ContextMenu onOpenChange={(open, info) => open && setActivePayload(info.payload ?? '')}>{() => <>
      <div class="overflow-hidden rounded-md border border-border bg-background">
        <table class="w-full border-collapse text-sm">
          <thead class="bg-muted-background text-muted-foreground">
            <tr>
              <For each={columns}>
                {(column) => (
                  <ContextMenuTrigger payload={'column:' + column}>
                    {(trigger) => (
                      <th
                        {...trigger.props}
                        ref={trigger.ref}
                        scope="col"
                        tabIndex={0}
                        class="border-b border-border px-3 py-2 text-left font-medium outline-none hover:bg-background focus:bg-background"
                      >
                        {column}
                      </th>
                    )}
                  </ContextMenuTrigger>
                )}
              </For>
            </tr>
          </thead>
          <tbody>
            <For each={rows}>
              {(row) => (
                <ContextMenuTrigger payload={'row:' + row[0]}>
                  {(trigger) => (
                    <tr
                      {...trigger.props}
                      ref={trigger.ref}
                      tabIndex={0}
                      class="outline-none hover:bg-muted-background focus:bg-muted-background"
                    >
                      <For each={row}>
                        {(cell) => <td class="border-b border-border px-3 py-2 last:text-right">{cell}</td>}
                      </For>
                    </tr>
                  )}
                </ContextMenuTrigger>
              )}
            </For>
          </tbody>
        </table>
      </div>
      <ContextMenuPortal>
        <ContextMenuContent>
          <ContextMenuSurface label={label()} />
        </ContextMenuContent>
      </ContextMenuPortal>
    </>}
    </ContextMenu>
  )
}
