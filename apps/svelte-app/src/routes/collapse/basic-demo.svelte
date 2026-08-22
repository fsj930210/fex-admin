<script lang="ts">
  import Collapse from '@fex-design/svelte/primitive/collapse'
  import CollapseItem from '@fex-design/svelte/primitive/collapse-item'
  import CollapseTrigger from '@fex-design/svelte/primitive/collapse-trigger'
  import CollapseContent from '@fex-design/svelte/primitive/collapse-content'
  import Card from '@fex-design/svelte/ui/card'
  import { collapseItems } from './demo-data'
</script>

<Card title="Basic" description="Multiple panels can be open at the same time by default.">
  <Collapse defaultExpandedKeys={['profile']}>
    {#each collapseItems as item (item.value)}
      <CollapseItem value={item.value}>
        <CollapseTrigger>{item.title}</CollapseTrigger>
        <CollapseContent>{item.content}</CollapseContent>
      </CollapseItem>
    {/each}
  </Collapse>
</Card>
