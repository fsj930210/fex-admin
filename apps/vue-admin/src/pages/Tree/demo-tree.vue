<script setup lang="ts" generic="TNode extends TreeNodeData">
import type { TreeController, TreeKey, TreeNodeData, TreeOptions } from '@fex/components-core/tree/types'
import { TreeRoot, TreeViewport, TreeVirtualViewport } from '@fex/components-vue/primitive/tree'
import type { TreeVirtualViewportHandle } from '@fex/components-vue/primitive/tree'
import { computed, ref } from 'vue'
import DemoTreeRow from './demo-tree-row.vue'
interface Props<T extends TreeNodeData> extends TreeOptions<T> { controller?: TreeController<T>; checkable?: boolean; virtual?: boolean; height?: number; overscan?: number; indent?: number; searchKeyword?: string; class?: string; itemClass?: string }
const props = withDefaults(defineProps<Props<TNode>>(), { checkable: false, virtual: false, height: 320, searchKeyword: '', multiple: undefined })
const options = computed<TreeOptions<TNode>>(() => ({ treeData: props.treeData, ...(props.features === undefined ? {} : { features: props.features }), ...(props.fieldNames === undefined ? {} : { fieldNames: props.fieldNames }), ...(props.isLeaf === undefined ? {} : { isLeaf: props.isLeaf }), ...(props.checkMode === undefined ? {} : { checkMode: props.checkMode }), ...(props.asyncLoader === undefined ? {} : { asyncLoader: props.asyncLoader }), ...(props.expandedKeys === undefined ? {} : { expandedKeys: props.expandedKeys }), ...(props.defaultExpandedKeys === undefined ? {} : { defaultExpandedKeys: props.defaultExpandedKeys }), ...(props.onExpandedKeysChange === undefined ? {} : { onExpandedKeysChange: props.onExpandedKeysChange }), ...(props.selectedKeys === undefined ? {} : { selectedKeys: props.selectedKeys }), ...(props.defaultSelectedKeys === undefined ? {} : { defaultSelectedKeys: props.defaultSelectedKeys }), ...(props.onSelectedKeysChange === undefined ? {} : { onSelectedKeysChange: props.onSelectedKeysChange }), ...(props.checkedKeys === undefined ? {} : { checkedKeys: props.checkedKeys }), ...(props.defaultCheckedKeys === undefined ? {} : { defaultCheckedKeys: props.defaultCheckedKeys }), ...(props.onCheckedKeysChange === undefined ? {} : { onCheckedKeysChange: props.onCheckedKeysChange }), ...(props.focusedKey === undefined ? {} : { focusedKey: props.focusedKey }), ...(props.defaultFocusedKey === undefined ? {} : { defaultFocusedKey: props.defaultFocusedKey }), ...(props.onFocusedKeyChange === undefined ? {} : { onFocusedKeyChange: props.onFocusedKeyChange }), ...(props.multiple === undefined ? {} : { multiple: props.multiple }), ...(props.onTreeDataChange === undefined ? {} : { onTreeDataChange: props.onTreeDataChange }) }))
const titleField = computed(() => props.fieldNames?.title ?? 'title')
const virtualViewport = ref<TreeVirtualViewportHandle | null>(null)
function scrollToKey(key: TreeKey, settings?: { align?: 'auto' | 'start' | 'center' | 'end'; reveal?: boolean }) { return virtualViewport.value?.scrollToKey(key, settings) ?? false }
defineExpose({ scrollToKey })
</script>
<template>
  <TreeRoot :controller="props.controller" :options="options" :indent="props.indent" :class="['w-full', props.class]" v-slot="{ tree }">
    <TreeVirtualViewport v-if="props.virtual" ref="virtualViewport" :height="props.height" :overscan="props.overscan" v-slot="{ item }">
      <DemoTreeRow :tree="tree" :item="item" :checkable="props.checkable" :search-keyword="props.searchKeyword" :item-class="props.itemClass" :title-field="titleField"><template #title="context"><slot name="title" v-bind="context">{{ String(context.item.node[titleField] ?? context.item.key) }}</slot></template></DemoTreeRow>
    </TreeVirtualViewport>
    <TreeViewport v-else v-slot="{ item }">
      <DemoTreeRow :tree="tree" :item="item" :checkable="props.checkable" :search-keyword="props.searchKeyword" :item-class="props.itemClass" :title-field="titleField"><template #title="context"><slot name="title" v-bind="context">{{ String(context.item.node[titleField] ?? context.item.key) }}</slot></template></DemoTreeRow>
    </TreeViewport>
  </TreeRoot>
</template>
