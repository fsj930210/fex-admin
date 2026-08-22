import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@fex-design/react/primitive/collapse'
import { Card } from '@fex-design/react/ui/card'
import { collapseItems } from './demo-data'

export function AccordionCollapseDemo() {
  return (
    <Card title="Accordion" description="Set multiple=false to keep at most one panel expanded.">
      <Collapse multiple={false} collapsible={false} defaultExpandedKeys={['profile']}>
        {collapseItems.map((item) => (
          <CollapseItem key={item.value} value={item.value}>
            <CollapseTrigger>{item.title}</CollapseTrigger>
            <CollapseContent>{item.content}</CollapseContent>
          </CollapseItem>
        ))}
      </Collapse>
    </Card>
  )
}
