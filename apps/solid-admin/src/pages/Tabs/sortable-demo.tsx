import { EllipsisIcon } from '@fex/components-solid/icon/more'
import * as Sortable from '@fex/components-solid/primitive/sortable'
import { TabsContent, TabsItem, TabsList, TabsRoot } from '@fex/components-solid/primitive/tabs'
import { Card } from '@fex/components-solid/ui/card'
import { For, createSignal } from 'solid-js'
import { initialTabs } from './data'

export function SortableTabsDemo() {
  const fixed = initialTabs[0]!
  const [items, setItems] = createSignal(initialTabs.slice(1))
  const itemByValue = (value: string) => items().find((item) => item.value === value)

  function reorder(values: string[]) {
    const byValue = new Map(items().map((item) => [item.value, item]))
    setItems(values.map((value) => byValue.get(value)).filter((item): item is NonNullable<typeof item> => Boolean(item)))
  }

  return (
    <Card title="Sortable composition" description="Overview stays fixed while the remaining tabs can be dragged horizontally.">
      <Sortable.SortableRoot items={items().map((item) => item.value)} axis="x" onChange={reorder} class="block">
        {({ items: values }) => (
          <>
            <TabsRoot defaultValue="overview">
              <TabsList>
                <TabsItem value={fixed.value}>{fixed.label}</TabsItem>
                <For each={values}>{(value) => (
                  <Sortable.SortableItem id={value} class="!inline-flex !min-h-0 !border-0 !bg-transparent !p-0 !shadow-none">
                    <TabsItem value={value} class="cursor-grab touch-none active:cursor-grabbing">
                      <EllipsisIcon class="size-3 rotate-90 text-muted-foreground" />
                      {itemByValue(value)?.label}
                    </TabsItem>
                  </Sortable.SortableItem>
                )}</For>
              </TabsList>
              <TabsContent value={fixed.value}>{fixed.content}</TabsContent>
              <For each={items()}>{(item) => <TabsContent value={item.value}>{item.content}</TabsContent>}</For>
            </TabsRoot>
            <Sortable.SortableOverlay class="!box-border !inline-flex !h-7 !min-h-0 !items-center !rounded-md !border-0 !bg-muted-background !p-0 !text-muted-foreground !shadow-sm !outline-none !ring-0">
              {(activeId) => <div class="flex h-7 items-center gap-1.5 px-2.5 text-sm"><EllipsisIcon class="size-3 rotate-90" />{itemByValue(String(activeId))?.label}</div>}
            </Sortable.SortableOverlay>
          </>
        )}
      </Sortable.SortableRoot>
    </Card>
  )
}
