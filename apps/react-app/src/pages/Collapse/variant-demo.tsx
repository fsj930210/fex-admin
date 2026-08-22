import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@fex-design/react/primitive/collapse'
import { Card } from '@fex-design/react/ui/card'
import { collapseText } from './demo-data'

export function VariantCollapseDemo() {
  return (
    <Card title="Variants" description="Outlined, filled and ghost cover bordered and borderless panel styles.">
      <div className="grid gap-space-lg lg:grid-cols-3">
        {(['outlined', 'filled', 'ghost'] as const).map((variant) => (
          <Collapse key={variant} variant={variant} defaultExpandedKeys={['one']}>
            <CollapseItem value="one">
              <CollapseTrigger>{variant}</CollapseTrigger>
              <CollapseContent>{collapseText}</CollapseContent>
            </CollapseItem>
            <CollapseItem value="two">
              <CollapseTrigger>Second panel</CollapseTrigger>
              <CollapseContent>{collapseText}</CollapseContent>
            </CollapseItem>
          </Collapse>
        ))}
      </div>
    </Card>
  )
}
