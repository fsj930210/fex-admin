import { Collapse, CollapseContent, CollapseItem, CollapseTrigger, type CollapseRef } from '@fex-design/solid/primitive/collapse'
import { Button } from '@fex-design/solid/ui/button'
import { Card } from '@fex-design/solid/ui/card'
import { For } from 'solid-js'
import { collapseItems } from './demo-data'

export function RefCollapseDemo() {
  let collapseRef: CollapseRef | undefined
  return (
    <Card title="Instance methods" description="The ref callback exposes methods for this Collapse instance.">
      <div class="mb-space-md flex flex-wrap gap-space-sm">
        <Button variant="outline" size="sm" onClick={() => collapseRef?.expand('security')}>Open security</Button>
        <Button variant="outline" size="sm" onClick={() => collapseRef?.toggle('billing')}>Toggle billing</Button>
        <Button variant="ghost" size="sm" onClick={() => collapseRef?.clear()}>Clear</Button>
      </div>
      <Collapse ref={(api) => (collapseRef = api)} defaultExpandedKeys={['profile']}>
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
