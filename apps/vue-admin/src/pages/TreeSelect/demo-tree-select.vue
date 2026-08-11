<script setup lang="ts">
import { asyncLoadFeature, checkFeature, expansionFeature, selectionFeature } from '@fex-design/core'
import type { TreeItem, TreeKey } from '@fex-design/core/tree/types'
import type { TreeSelectItem, TreeSelectValue } from '@fex-design/core/tree-select/types'
import { InputClear, InputControl, InputRoot } from '@fex-design/vue/primitive/input'
import Tag from '@fex-design/vue/primitive/tag'
import { TreeSelectContent, TreeSelectOption, TreeSelectRoot, TreeSelectTrigger } from '@fex-design/vue/primitive/tree-select'
import { computed, ref, useSlots } from 'vue'
import DemoTree from '../Tree/demo-tree.vue'
import { departmentFieldNames, type DepartmentNode } from '../Tree/data'

const props = defineProps<{
  treeData: readonly DepartmentNode[]
  value?: TreeSelectValue | readonly TreeSelectValue[] | undefined
  defaultValue?: TreeSelectValue | readonly TreeSelectValue[] | undefined
  multiple?: boolean | undefined
  checkStrictly?: boolean | undefined
  maxTagCount?: number | undefined
  searchable?: boolean | undefined
  searchValue?: string | undefined
  contentActive?: boolean | undefined
  expandedKeys?: readonly TreeKey[] | undefined
  asyncLoader?: ((item: TreeItem<DepartmentNode>, context: { signal: AbortSignal }) => Promise<readonly DepartmentNode[]>) | undefined
  onTreeDataChange?: ((treeData: readonly DepartmentNode[]) => void) | undefined
}>()
const emit = defineEmits<{
  change: [value: TreeSelectValue | TreeSelectValue[] | undefined]
  search: [value: string]
  clear: []
  expandedKeysChange: [keys: readonly TreeKey[]]
}>()
const slots = useSlots()
const panelOpen = ref(false)
const hasCustomContent = computed(() => Boolean(slots.default) && props.contentActive === true)
function toItems(nodes: readonly DepartmentNode[]): TreeSelectItem<DepartmentNode>[] {
  return nodes.flatMap((node) => [{ value: node.id, label: node.name, node }, ...toItems(node.childrenList ?? [])])
}
function inputRootTriggerProps(triggerProps: Record<string, unknown>) {
  const { onClick: _onClick, onFocus: _onFocus, onBlur: _onBlur, ...rest } = triggerProps
  return rest
}
function features() {
  return [
    expansionFeature<DepartmentNode>(props.expandedKeys === undefined ? { defaultExpandedKeys: ['company', 'engineering', 'finance', 'product'] } : {}),
    ...(props.asyncLoader ? [asyncLoadFeature<DepartmentNode>({ loadChildren: props.asyncLoader })] : []),
    ...(props.multiple ? [checkFeature<DepartmentNode>({ mode: props.checkStrictly ? 'strict' : 'cascade' })] : [selectionFeature<DepartmentNode>()]),
  ]
}
function highlightParts(label: string) {
  const keyword = props.searchValue?.trim()
  if (!keyword) return [{ text: label, match: false }]
  const index = label.toLowerCase().indexOf(keyword.toLowerCase())
  if (index < 0) return [{ text: label, match: false }]
  return [
    { text: label.slice(0, index), match: false },
    { text: label.slice(index, index + keyword.length), match: true },
    { text: label.slice(index + keyword.length), match: false },
  ].filter((part) => part.text)
}
</script>

<template>
  <TreeSelectRoot
    :items="toItems(props.treeData)"
    :value="props.value"
    :default-value="props.defaultValue"
    :multiple="props.multiple"
    :searchable="props.searchable"
    :search-value="props.searchValue"
    :open="panelOpen"
    @open-change="panelOpen = $event"
    @change="emit('change', $event)"
    @search-value-change="emit('search', $event)"
    v-slot="root"
  >
    <TreeSelectTrigger v-slot="{ triggerProps, triggerRef, inputProps, selectedItems, clear }">
      <div :ref="triggerRef" v-bind="inputRootTriggerProps(triggerProps)" class="w-80" @click="panelOpen = true" @focusin="panelOpen = true">
        <InputRoot :value="String(inputProps.value)" class="w-full" @clear="clear(); emit('clear')">
          <template v-if="props.multiple"><template v-if="selectedItems.length <= (props.maxTagCount ?? 2)"><Tag v-for="item in selectedItems" :key="item.value" size="sm" closable class="ml-1.5" @pointerdown.capture.prevent @close.stop="root.controller.setValues(root.state.values.filter((value: TreeSelectValue) => value !== item.value))">{{ item.label }}</Tag></template><Tag v-else size="sm" class="ml-1.5">已选择 {{ selectedItems.length }} 项</Tag></template>
          <InputControl
            :read-only="Boolean(inputProps.readonly)"
            :placeholder="selectedItems.length ? undefined : props.searchable ? '搜索部门' : '请选择部门'"
            @input="inputProps.onInput"
          />
          <InputClear :force-mount="selectedItems.length > 0 || Boolean(props.searchValue)" aria-label="清除" @click.stop.prevent="clear(); emit('clear')" />
        </InputRoot>
      </div>
    </TreeSelectTrigger>
    <TreeSelectContent class="w-80 p-space-sm">
      <slot v-if="hasCustomContent" />
      <div :class="hasCustomContent ? 'hidden' : undefined">
        <DemoTree
          :tree-data="props.treeData"
          :field-names="departmentFieldNames"
          :is-leaf="(node: DepartmentNode) => node.childCount === 0"
          :features="features()"
          :selected-keys="props.multiple ? [] : root.state.values"
          :checked-keys="props.multiple ? root.state.values : undefined"
          :checkable="props.multiple"
          :expanded-keys="props.expandedKeys"
          :on-expanded-keys-change="(keys: readonly TreeKey[]) => emit('expandedKeysChange', keys)"
          :on-checked-keys-change="props.multiple ? (keys: readonly TreeKey[], meta: { changedKeys: readonly TreeKey[] }) => { if (!props.checkStrictly) { root.controller.setValues(keys); return }; const next = new Set(root.state.values); meta.changedKeys.forEach((key) => keys.includes(key) ? next.add(key) : next.delete(key)); root.controller.setValues([...next]) } : undefined"
          :on-tree-data-change="props.onTreeDataChange"
          item-class="cursor-pointer data-[disabled=true]:cursor-not-allowed"
          :search-keyword="props.searchValue ?? ''"
        >
          <template #title="{ item }">
            <TreeSelectOption :item="{ value: item.key, label: String(item.node.name), node: item.node, disabled: item.disabled }" v-slot="option">
              <button
                type="button"
                :data-selected="!props.multiple && option.selected || undefined"
                :disabled="item.disabled"
                class="rounded-sm px-space-xs text-left data-[selected=true]:bg-accent disabled:cursor-not-allowed"
                @click.stop="option.select"
              >
                <span v-for="(part, index) in highlightParts(String(item.node.name))" :key="index" :class="part.match ? 'bg-warning/30' : undefined">{{ part.text }}</span>
              </button>
            </TreeSelectOption>
          </template>
        </DemoTree>
      </div>
    </TreeSelectContent>
  </TreeSelectRoot>
</template>
