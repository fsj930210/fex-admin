import type { ExpansionKey } from '@fex-design/core/expansion/types'
import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@fex-design/solid/primitive/collapse'
import { Button } from '@fex-design/solid/ui/button'
import { Card } from '@fex-design/solid/ui/card'
import { For, createSignal } from 'solid-js'
import { collapseItems } from './demo-data'

export function ControlledCollapseDemo() {
  const [expandedKeys, setExpandedKeys] = createSignal<ExpansionKey[]>(['billing'])
  return (
    <Card title="Controlled" description="expandedKeys and onChange let external state own the panels.">
      <div class="mb-space-md flex flex-wrap gap-space-sm">
        <Button variant="outline" size="sm" onClick={() => setExpandedKeys(['profile'])}>Open profile</Button>
        <Button variant="outline" size="sm" onClick={() => setExpandedKeys(['billing', 'security'])}>Open billing and security</Button>
        <Button variant="ghost" size="sm" onClick={() => setExpandedKeys([])}>Clear</Button>
      </div>
      <Collapse expandedKeys={expandedKeys()} onChange={(keys) => setExpandedKeys(keys)}>
        <For each={collapseItems}>
          {(item) => (
            <CollapseItem value={item.value}>
              <CollapseTrigger>{item.title}</CollapseTrigger>
              <CollapseContent>{item.content}</CollapseContent>
            </CollapseItem>
          )}
        </For>
      </Collapse>
    </Card>
  )
}
