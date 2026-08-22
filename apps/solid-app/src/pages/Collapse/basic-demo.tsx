import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@fex-design/solid/primitive/collapse'
import { Card } from '@fex-design/solid/ui/card'
import { For } from 'solid-js'
import { collapseItems } from './demo-data'

export function BasicCollapseDemo() {
  return (
    <Card title="Basic" description="Multiple panels can be open at the same time by default.">
      <Collapse defaultExpandedKeys={['profile']}>
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
