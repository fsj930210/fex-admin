import { EllipsisIcon } from '@fex/components-react/icon/more'
import * as Sortable from '@fex/components-react/primitive/sortable'
import { TabsContent, TabsItem, TabsList, TabsRoot } from '@fex/components-react/primitive/tabs'
import { Card } from '@fex/components-react/ui/card'
import { useState } from 'react'
import { initialTabs } from './data'

const sortableItemClassName = 'cursor-grab touch-none active:cursor-grabbing data-[dragging=true]:opacity-60'

export function SortableTabsDemo() {
  const fixed = initialTabs[0]!
  const [items, setItems] = useState(initialTabs.slice(1))
  const byValue = new Map(items.map((item) => [item.value, item]))

  function reorder(values: string[]) {
    setItems(values.map((value) => byValue.get(value)).filter((item): item is NonNullable<typeof item> => Boolean(item)))
  }

  return (
    <Card title="Sortable composition" description="Overview stays fixed while the remaining tabs can be dragged horizontally.">
      <Sortable.SortableRoot items={items.map((item) => item.value)} axis="x" onChange={reorder} className="block">
        {({ items: values }) => (
          <>
            <TabsRoot defaultValue="overview">
              <TabsList>
                <TabsItem value={fixed.value}>{fixed.label}</TabsItem>
                {values.map((value) => {
                  const item = byValue.get(value)
                  return item ? (
                    <Sortable.SortableItem key={value} id={value}>
                      {({ props }) => (
                        <TabsItem value={value} {...props} className={sortableItemClassName}>
                          <EllipsisIcon className="size-3 rotate-90 text-muted-foreground" />
                          {item.label}
                        </TabsItem>
                      )}
                    </Sortable.SortableItem>
                  ) : null
                })}
              </TabsList>
              <TabsContent value={fixed.value}>{fixed.content}</TabsContent>
              {items.map((item) => <TabsContent key={item.value} value={item.value}>{item.content}</TabsContent>)}
            </TabsRoot>
            <Sortable.SortableOverlay className="!box-border !inline-flex !h-7 !min-h-0 !items-center !rounded-md !border-0 !bg-muted-background !p-0 !text-muted-foreground !shadow-sm !outline-none !ring-0">
              {({ activeId }) => <div className="flex h-7 items-center gap-1.5 px-2.5 text-sm"><EllipsisIcon className="size-3 rotate-90" />{byValue.get(String(activeId))?.label}</div>}
            </Sortable.SortableOverlay>
          </>
        )}
      </Sortable.SortableRoot>
    </Card>
  )
}
