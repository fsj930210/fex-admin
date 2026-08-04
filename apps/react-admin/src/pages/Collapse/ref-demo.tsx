import { Collapse, CollapseContent, CollapseItem, CollapseTrigger, type CollapseRef } from '@fex-design/react/primitive/collapse'
import { Button } from '@fex-design/react/ui/button'
import { Card } from '@fex-design/react/ui/card'
import { useRef } from 'react'
import { collapseItems } from './demo-data'

export function RefCollapseDemo() {
  const collapseRef = useRef<CollapseRef>(null)
  return (
    <Card title="Instance methods" description="Use ref methods for imperative actions tied to this Collapse instance.">
      <div className="mb-space-md flex flex-wrap gap-space-sm">
        <Button variant="outline" size="sm" onClick={() => collapseRef.current?.expand('security')}>
          Open security
        </Button>
        <Button variant="outline" size="sm" onClick={() => collapseRef.current?.toggle('billing')}>
          Toggle billing
        </Button>
        <Button variant="ghost" size="sm" onClick={() => collapseRef.current?.clear()}>
          Clear
        </Button>
      </div>
      <Collapse ref={collapseRef} defaultExpandedKeys={['profile']}>
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
