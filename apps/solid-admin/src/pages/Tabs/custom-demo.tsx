import { TabsContent, TabsItem, TabsList, TabsRoot } from '@fex/components-solid/primitive/tabs'
import { Card } from '@fex/components-solid/ui/card'
import { cn } from '@fex/utils'

const itemClassName = 'justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
const contentClassName = 'mt-space-md border-l-2 border-primary pl-space-md'

export function CustomTabsDemo() {
  return (
    <Card title="Custom render" description="Children functions replace List, Item and Content root nodes without losing behavior.">
      <TabsRoot defaultValue="files">
        <TabsList>
          {({ props }) => (
            <ul {...props} class={cn(props.class, 'rounded-md border border-border bg-secondary-background p-2')}>
              <TabsItem value="files">
                {({ props: itemProps, state }) => (
                  <li {...itemProps} class={cn(itemProps.class, itemClassName)}>
                    Files
                    {state.active && <span aria-hidden="true" class="size-1.5 rounded-full bg-current" />}
                  </li>
                )}
              </TabsItem>
              <TabsItem value="search">
                {({ props: itemProps, state }) => (
                  <li {...itemProps} class={cn(itemProps.class, itemClassName)}>
                    Search
                    {state.active && <span aria-hidden="true" class="size-1.5 rounded-full bg-current" />}
                  </li>
                )}
              </TabsItem>
            </ul>
          )}
        </TabsList>
        <TabsContent value="files">
          {({ props }) => <section {...props} class={contentClassName}>Fully custom files panel.</section>}
        </TabsContent>
        <TabsContent value="search">
          {({ props }) => <section {...props} class={contentClassName}>Custom search panel.</section>}
        </TabsContent>
      </TabsRoot>
    </Card>
  )
}
