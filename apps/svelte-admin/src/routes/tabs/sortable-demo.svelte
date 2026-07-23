<script lang="ts">
  import EllipsisIcon from '@fex/components-svelte/icon/more'
  import { SortableItem, SortableOverlay, SortableRoot } from '@fex/components-svelte/primitive/sortable'
  import TabsRoot from '@fex/components-svelte/primitive/tabs-root'
  import TabsList from '@fex/components-svelte/primitive/tabs-list'
  import TabsItem from '@fex/components-svelte/primitive/tabs-item'
  import TabsContent from '@fex/components-svelte/primitive/tabs-content'
  import Card from '@fex/components-svelte/ui/card'
  import { initialTabs } from './data'

  const fixed = initialTabs[0]!
  let items = $state(initialTabs.slice(1))
  const asValues = (values: string[] | Record<string, string[]>) => Array.isArray(values) ? values : []
  const itemByValue = (value: string) => items.find((item) => item.value === value)

  function reorder(values: string[] | Record<string, string[]>) {
    const byValue = new Map(items.map((item) => [item.value, item]))
    items = asValues(values).map((value) => byValue.get(value)).filter((item): item is NonNullable<typeof item> => Boolean(item))
  }
</script>

<Card title="Sortable composition" description="Overview stays fixed while the remaining tabs can be dragged horizontally.">
  <SortableRoot items={items.map((item) => item.value)} axis="x" class="block" onChange={reorder}>
    {#snippet children({ items: preview })}
      <TabsRoot defaultValue="overview">
        <TabsList>
          <TabsItem value={fixed.value}>{fixed.label}</TabsItem>
          {#each asValues(preview) as value (value)}
            <SortableItem id={value} class="!inline-flex !min-h-0 !border-0 !bg-transparent !p-0 !shadow-none">
              <TabsItem {value} class="cursor-grab touch-none active:cursor-grabbing">
                <EllipsisIcon class="size-3 rotate-90 text-muted-foreground" />
                {itemByValue(value)?.label}
              </TabsItem>
            </SortableItem>
          {/each}
        </TabsList>
        <TabsContent value={fixed.value}>{fixed.content}</TabsContent>
        {#each items as item (item.value)}<TabsContent value={item.value}>{item.content}</TabsContent>{/each}
      </TabsRoot>
      <SortableOverlay class="!box-border !inline-flex !h-7 !min-h-0 !items-center !rounded-md !border-0 !bg-muted-background !p-0 !text-muted-foreground !shadow-sm !outline-none !ring-0">
        {#snippet children({ activeId })}<div class="flex h-7 items-center gap-1.5 px-2.5 text-sm"><EllipsisIcon class="size-3 rotate-90" />{itemByValue(String(activeId))?.label}</div>{/snippet}
      </SortableOverlay>
    {/snippet}
  </SortableRoot>
</Card>
