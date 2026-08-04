import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@fex-design/solid/primitive/collapse'
import { Card } from '@fex-design/solid/ui/card'
import { For } from 'solid-js'
import { collapseText } from './demo-data'

const variants = ['outlined', 'filled', 'ghost'] as const

export function VariantCollapseDemo() {
  return (
    <Card title="Variants" description="Outlined, filled and ghost cover bordered and borderless panel styles.">
      <div class="grid gap-space-lg lg:grid-cols-3">
        <For each={variants}>
          {(variant) => (
            <Collapse variant={variant} defaultExpandedKeys={['one']}>
              <CollapseItem value="one">
                <CollapseTrigger>{variant}</CollapseTrigger>
                <CollapseContent>{collapseText}</CollapseContent>
              </CollapseItem>
              <CollapseItem value="two">
                <CollapseTrigger>Second panel</CollapseTrigger>
                <CollapseContent>{collapseText}</CollapseContent>
              </CollapseItem>
            </Collapse>
          )}
        </For>
      </div>
    </Card>
  )
}
