import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@fex-design/solid/primitive/collapse'
import { Card } from '@fex-design/solid/ui/card'
import { collapseText } from './demo-data'

export function NestedCollapseDemo() {
  return (
    <Card title="Nested" description="Nested instances keep separate expansion state.">
      <Collapse defaultExpandedKeys={['outer']}>
        <CollapseItem value="outer">
          <CollapseTrigger>Outer panel</CollapseTrigger>
          <CollapseContent>
            <Collapse defaultExpandedKeys={['inner']}>
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
