<script lang="ts">
  import Collapse from '@fex-design/svelte/primitive/collapse'
  import CollapseItem from '@fex-design/svelte/primitive/collapse-item'
  import CollapseTrigger from '@fex-design/svelte/primitive/collapse-trigger'
  import CollapseContent from '@fex-design/svelte/primitive/collapse-content'
  import Card from '@fex-design/svelte/ui/card'
  import { collapseText } from './demo-data'

  const variants = ['outlined', 'filled', 'ghost'] as const
</script>

<Card title="Variants" description="Outlined, filled and ghost cover bordered and borderless panel styles.">
  <div class="grid gap-space-lg lg:grid-cols-3">
    {#each variants as variant}
      <Collapse {variant} defaultExpandedKeys={['one']}>
        <CollapseItem value="one">
          <CollapseTrigger>{variant}</CollapseTrigger>
          <CollapseContent>{collapseText}</CollapseContent>
        </CollapseItem>
        <CollapseItem value="two">
          <CollapseTrigger>Second panel</CollapseTrigger>
          <CollapseContent>{collapseText}</CollapseContent>
        </CollapseItem>
      </Collapse>
    {/each}
  </div>
</Card>
