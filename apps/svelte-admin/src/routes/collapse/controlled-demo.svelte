<script lang="ts">
  import type { ExpansionKey } from '@fex-design/core/expansion/types'
  import Collapse from '@fex-design/svelte/primitive/collapse'
  import CollapseItem from '@fex-design/svelte/primitive/collapse-item'
  import CollapseTrigger from '@fex-design/svelte/primitive/collapse-trigger'
  import CollapseContent from '@fex-design/svelte/primitive/collapse-content'
  import Button from '@fex-design/svelte/ui/button'
  import Card from '@fex-design/svelte/ui/card'
  import { collapseItems } from './demo-data'

  let expandedKeys = $state<ExpansionKey[]>(['billing'])
</script>

<Card title="Controlled" description="expandedKeys and onchange let external state own the panels.">
  <div class="mb-space-md flex flex-wrap gap-space-sm">
    <Button variant="outline" size="sm" onclick={() => (expandedKeys = ['profile'])}>Open profile</Button>
    <Button variant="outline" size="sm" onclick={() => (expandedKeys = ['billing', 'security'])}>Open billing and security</Button>
    <Button variant="ghost" size="sm" onclick={() => (expandedKeys = [])}>Clear</Button>
  </div>
  <Collapse {expandedKeys} onchange={(keys) => (expandedKeys = keys)}>
    {#each collapseItems as item (item.value)}
      <CollapseItem value={item.value}>
        <CollapseTrigger>{item.title}</CollapseTrigger>
        <CollapseContent>{item.content}</CollapseContent>
      </CollapseItem>
    {/each}
  </Collapse>
</Card>
