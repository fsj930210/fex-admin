import { Collapse, CollapseContent, CollapseItem } from '@fex-design/solid/primitive/collapse'
import { ChevronRightIcon } from '@fex-design/solid/icon/chevron'
import { Button } from '@fex-design/solid/ui/button'
import { Card } from '@fex-design/solid/ui/card'
import { cn } from '@fex/utils'
import { For } from 'solid-js'
import { collapseItems } from './demo-data'

export function CustomCollapseDemo() {
  return (
    <Card title="Custom trigger" description="Use item render actions when the toggle target is fully custom.">
      <Collapse variant="ghost" defaultExpandedKeys={['profile']}>
        <For each={collapseItems}>
          {(item) => (
            <CollapseItem value={item.value}>
              {({ state, actions }) => (
                <>
                  <div class="flex items-center gap-space-sm px-space-sm py-space-sm">
                    <Button variant="ghost" size="icon-sm" aria-expanded={state.expanded} aria-label="Toggle panel" onClick={actions.toggle}>
                      <ChevronRightIcon class={cn('size-4 transition-transform', state.expanded && '-rotate-90')} />
                    </Button>
                    <span class="flex-1 text-sm font-medium">{item.title}</span>
                    <Button variant="outline" size="sm" onClick={actions.expand}>Open</Button>
                  </div>
                  <CollapseContent class="pt-0">{item.content}</CollapseContent>
                </>
              )}
            </CollapseItem>
          )}
        </For>
      </Collapse>
    </Card>
  )
}
