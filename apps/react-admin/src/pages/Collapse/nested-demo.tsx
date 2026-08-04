import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@fex-design/react/primitive/collapse'
import { Card } from '@fex-design/react/ui/card'
import { collapseText } from './demo-data'

export function NestedCollapseDemo() {
  return (
    <Card title="Nested" description="Collapse instances are isolated, so nested panels keep separate state.">
      <Collapse defaultExpandedKeys={['outer']}>
        <CollapseItem value="outer">
          <CollapseTrigger>Outer panel</CollapseTrigger>
          <CollapseContent>
            <Collapse variant="outlined" defaultExpandedKeys={['inner']}>
              <CollapseItem value="inner">
                <CollapseTrigger>Nested panel</CollapseTrigger>
                <CollapseContent>{collapseText}</CollapseContent>
              </CollapseItem>
            </Collapse>
          </CollapseContent>
        </CollapseItem>
      </Collapse>
    </Card>
  )
}
