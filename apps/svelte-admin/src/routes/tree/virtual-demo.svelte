<script lang="ts">
  import { expansionFeature } from '@fex/components-core'
  import type { TreeKey } from '@fex/components-core/tree/types'
  import Button from '@fex/components-svelte/ui/button'
  import Card from '@fex/components-svelte/ui/card'
  import DemoTree from './demo-tree.svelte'
  import { createLargeTreeData, departmentFieldNames } from './data'

  const data = createLargeTreeData()
  let viewport:
    | { scrollToKey(key: TreeKey, settings?: { align?: 'auto' | 'start' | 'center' | 'end'; reveal?: boolean }): boolean }
    | undefined
</script>

<Card title="Virtualization and locate" description="Only viewport rows mount. scrollToKey resolves a visible index before asking TanStack Virtual to scroll.">
  <div class="mb-space-md flex gap-space-sm">
    <Button size="sm" variant="outline" onclick={() => viewport?.scrollToKey('large-3200', { reveal: true, align: 'start' })}>
      Locate row 3201
    </Button>
  </div>
  <DemoTree
    bind:this={viewport}
    treeData={data}
    fieldNames={departmentFieldNames}
    isLeaf={(node) => node.childCount === 0}
    features={[expansionFeature({ defaultExpandedKeys: ['large-root'] })]}
    virtual
    height={320}
    class="rounded-md border border-border bg-background p-space-sm"
  />
</Card>
