import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@fex-design/react/primitive/collapse'
import type { ExpansionKey } from '@fex-design/core/expansion/types'
import { Button } from '@fex-design/react/ui/button'
import { Card } from '@fex-design/react/ui/card'
import { useState } from 'react'
import { collapseItems } from './demo-data'

export function ControlledCollapseDemo() {
  const [expandedKeys, setExpandedKeys] = useState<ExpansionKey[]>(['billing'])
  return (
    <Card title="Controlled" description="expandedKeys and onChange let external state own the panels.">
      <div className="mb-space-md flex flex-wrap gap-space-sm">
        <Button variant="outline" size="sm" onClick={() => setExpandedKeys(['profile'])}>
          Open profile
        </Button>
        <Button variant="outline" size="sm" onClick={() => setExpandedKeys(['billing', 'security'])}>
          Open billing and security
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setExpandedKeys([])}>
          Clear
        </Button>
      </div>
      <Collapse expandedKeys={expandedKeys} onChange={setExpandedKeys}>
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
