import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@fex-design/solid/primitive/collapse'
import { Card } from '@fex-design/solid/ui/card'
import { For } from 'solid-js'
import { collapseItems } from './demo-data'

export function AccordionCollapseDemo() {
  return (
    <Card title="Accordion" description="Set multiple=false to keep at most one panel expanded.">
      <Collapse multiple={false} collapsible={false} defaultExpandedKeys={['profile']}>
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
