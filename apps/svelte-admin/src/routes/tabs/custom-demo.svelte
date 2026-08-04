<script lang="ts">
  import TabsRoot from '@fex-design/svelte/primitive/tabs-root'
  import TabsList from '@fex-design/svelte/primitive/tabs-list'
  import TabsItem from '@fex-design/svelte/primitive/tabs-item'
  import TabsContent from '@fex-design/svelte/primitive/tabs-content'
  import Card from '@fex-design/svelte/ui/card'
  import { cn } from '@fex/utils'
  import type { HTMLAttributes } from 'svelte/elements'

  const itemClassName = 'justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
  const contentClassName = 'mt-space-md border-l-2 border-primary pl-space-md'
  const asUlProps = (props: HTMLAttributes<HTMLDivElement>) => props as unknown as HTMLAttributes<HTMLUListElement>
  const asLiProps = (props: HTMLAttributes<HTMLDivElement>) => props as unknown as HTMLAttributes<HTMLLIElement>
  const asSectionProps = (props: HTMLAttributes<HTMLDivElement>) => props as unknown as HTMLAttributes<HTMLElement>
</script>

<Card title="Custom render" description="Children functions replace List, Item and Content root nodes without losing behavior.">
  <TabsRoot defaultValue="files">
    <TabsList>
      {#snippet render({ props })}
        <ul {...asUlProps(props)} class={cn(props.class, 'rounded-md border border-border bg-secondary-background p-2')}>
          <TabsItem value="files">
            {#snippet render({ props: itemProps, state, itemRef })}
              <li {...asLiProps(itemProps)} use:itemRef class={cn(itemProps.class, itemClassName)}>
                Files
                {#if state.active}<span aria-hidden="true" class="size-1.5 rounded-full bg-current"></span>{/if}
              </li>
            {/snippet}
          </TabsItem>
          <TabsItem value="search">
            {#snippet render({ props: itemProps, state, itemRef })}
              <li {...asLiProps(itemProps)} use:itemRef class={cn(itemProps.class, itemClassName)}>
                Search
                {#if state.active}<span aria-hidden="true" class="size-1.5 rounded-full bg-current"></span>{/if}
              </li>
            {/snippet}
          </TabsItem>
        </ul>
      {/snippet}
    </TabsList>
    <TabsContent value="files">
      {#snippet render({ props })}<section {...asSectionProps(props)} class={contentClassName}>Fully custom files panel.</section>{/snippet}
    </TabsContent>
    <TabsContent value="search">
      {#snippet render({ props })}<section {...asSectionProps(props)} class={contentClassName}>Custom search panel.</section>{/snippet}
    </TabsContent>
  </TabsRoot>
</Card>
