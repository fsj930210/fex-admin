import { Collapse, CollapseContent, CollapseItem } from '@fex-design/react/primitive/collapse'
import { Button } from '@fex-design/react/ui/button'
import { Card } from '@fex-design/react/ui/card'
import { ChevronRightIcon } from '@fex-design/react/icon/chevron'
import { cn } from '@fex/utils'
import { collapseItems } from './demo-data'

export function CustomCollapseDemo() {
  return (
    <Card title="Custom trigger" description="Custom rendering can move the toggle to an icon while preserving ARIA props.">
      <Collapse variant="ghost" defaultExpandedKeys={['profile']}>
        {collapseItems.map((item) => (
          <CollapseItem key={item.value} value={item.value}>
            {({ state, actions }) => (
              <>
                <div className="flex items-center gap-space-sm px-space-sm py-space-sm">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-expanded={state.expanded}
                    aria-label="Toggle panel"
                    onClick={actions.toggle}
                  >
                    <ChevronRightIcon
                      className={cn('size-4 transition-transform', state.expanded && '-rotate-90')}
                    />
                  </Button>
                  <span className="flex-1 text-sm font-medium">{item.title}</span>
                  <Button variant="outline" size="sm" onClick={() => actions.expand()}>
                    Open
                  </Button>
                </div>
                <CollapseContent className="pt-0">{item.content}</CollapseContent>
              </>
            )}
          </CollapseItem>
        ))}
      </Collapse>
    </Card>
  )
}
