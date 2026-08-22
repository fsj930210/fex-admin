<script lang="ts">
  import Collapse from '@fex-design/svelte/primitive/collapse'
  import CollapseItem from '@fex-design/svelte/primitive/collapse-item'
  import CollapseTrigger from '@fex-design/svelte/primitive/collapse-trigger'
  import CollapseContent from '@fex-design/svelte/primitive/collapse-content'
  import Card from '@fex-design/svelte/ui/card'
  import { collapseText } from './demo-data'
</script>

<Card title="Nested" description="Nested instances keep separate expansion state.">
  <Collapse defaultExpandedKeys={['outer']}>
    <CollapseItem value="outer">
      <CollapseTrigger>Outer panel</CollapseTrigger>
      <CollapseContent>
        <Collapse defaultExpandedKeys={['inner']}>
          <CollapseItem value="inner">
            <CollapseTrigger>Nested panel</CollapseTrigger>
            <CollapseContent>{collapseText}</CollapseContent>
          </CollapseItem>
        </Collapse>
      </CollapseContent>
    </CollapseItem>
  </Collapse>
</Card>
