<script setup lang="ts" generic="TNode extends TreeNodeData">
import type { TreeController, TreeNodeData, TreeVisibleItem } from '@fex/components-core/tree/types'
import { TreeItem, TreeTitle, TreeTrigger } from '@fex/components-vue/primitive/tree'
import Checkbox from '@fex/components-vue/ui/checkbox'
import { Spinner } from '@fex/components-vue/ui/spinner'
const props = defineProps<{ tree: TreeController<TNode>; item: TreeVisibleItem<TNode>; checkable: boolean; searchKeyword: string; itemClass?: string; titleField: string }>()
</script>
<template>
  <TreeItem :item-key="props.item.key" :class="props.itemClass" v-slot="{ item, itemProps, checkedState, loadState, actions }">
    <div v-bind="itemProps">
      <Spinner v-if="loadState === 'loading'" size="sm" aria-label="Loading children" />
      <TreeTrigger v-else :item-key="item.key" />
      <Checkbox v-if="props.checkable && props.tree.hasFeature('check')" :checked="checkedState" :disabled="item.disabled" @click.stop @checked-change="actions.toggleChecked()" />
      <TreeTitle><slot name="title" :item="item" :tree="props.tree" :is-searching="Boolean(props.searchKeyword)" :search-keyword="props.searchKeyword">{{ String(item.node[props.titleField] ?? item.key) }}</slot></TreeTitle>
    </div>
  </TreeItem>
</template>
