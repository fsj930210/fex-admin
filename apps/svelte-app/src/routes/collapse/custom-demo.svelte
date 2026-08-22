<script lang="ts">
  import Collapse from '@fex-design/svelte/primitive/collapse'
  import CollapseItem from '@fex-design/svelte/primitive/collapse-item'
  import CollapseContent from '@fex-design/svelte/primitive/collapse-content'
  import Button from '@fex-design/svelte/ui/button'
  import Card from '@fex-design/svelte/ui/card'
  import ChevronRightIcon from '@fex-design/svelte/icon/chevron-right'
  import { cn } from '@fex/utils'
  import { collapseItems } from './demo-data'
</script>

<Card title="Custom trigger" description="Use item render actions when the toggle target is fully custom.">
  <Collapse variant="ghost" defaultExpandedKeys={['profile']}>
    {#each collapseItems as item (item.value)}
      <CollapseItem value={item.value}>
        {#snippet render(value)}
          <div class="flex items-center gap-space-sm px-space-sm py-space-sm">
            <Button variant="ghost" size="icon-sm" aria-expanded={value.state.expanded} aria-label="Toggle panel" onclick={value.actions.toggle}>
              <ChevronRightIcon class={cn('size-4 transition-transform', value.state.expanded && '-rotate-90')} />
            </Button>
            <span class="flex-1 text-sm font-medium">{item.title}</span>
            <Button variant="outline" size="sm" onclick={value.actions.expand}>Open</Button>
          </div>
          <CollapseContent class="pt-0">{item.content}</CollapseContent>
        {/snippet}
      </CollapseItem>
    {/each}
  </Collapse>
</Card>
