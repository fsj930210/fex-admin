<script lang="ts">
  import Collapse from '@fex-design/svelte/primitive/collapse'
  import CollapseItem from '@fex-design/svelte/primitive/collapse-item'
  import CollapseTrigger from '@fex-design/svelte/primitive/collapse-trigger'
  import CollapseContent from '@fex-design/svelte/primitive/collapse-content'
  import Button from '@fex-design/svelte/ui/button'
  import Card from '@fex-design/svelte/ui/card'
  import { collapseItems } from './demo-data'

  let collapseRef: {
    expand(key: string): void
    collapse(key: string): void
    toggle(key: string): void
    clear(): void
  }
</script>

<Card title="Instance methods" description="bind:this exposes methods for this Collapse instance.">
  <div class="mb-space-md flex flex-wrap gap-space-sm">
    <Button variant="outline" size="sm" onclick={() => collapseRef?.expand('security')}>Open security</Button>
    <Button variant="outline" size="sm" onclick={() => collapseRef?.toggle('billing')}>Toggle billing</Button>
    <Button variant="ghost" size="sm" onclick={() => collapseRef?.clear()}>Clear</Button>
  </div>
  <Collapse bind:this={collapseRef} defaultExpandedKeys={['profile']}>
    {#each collapseItems as item (item.value)}
      <CollapseItem value={item.value}>
        <CollapseTrigger>{item.title}</CollapseTrigger>
        <CollapseContent>{item.content}</CollapseContent>
      </CollapseItem>
    {/each}
  </Collapse>
</Card>
