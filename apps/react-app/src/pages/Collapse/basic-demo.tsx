import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@fex-design/react/primitive/collapse'
import { Card } from '@fex-design/react/ui/card'
import { collapseItems } from './demo-data'

export function BasicCollapseDemo() {
  return (
    <Card title="Basic" description="Multiple panels can be open at the same time by default.">
      <Collapse defaultExpandedKeys={['profile']}>
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
