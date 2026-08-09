<script setup lang="ts">
import { cascaderPanelClassName, cascaderPanelHeight } from '@fex-design/styles/cascader'
import CascaderColumn from './cascader-column.vue'
import CascaderEmpty from './cascader-empty.vue'
import CascaderLoading from './cascader-loading.vue'
import CascaderOption from './cascader-option.vue'
import { useCascader } from './use-cascader'
import { useSlots } from 'vue'
const cascader = useCascader('CascaderPanel')
const slots = useSlots()
function panelHeight() {
  if (cascader.snapshot.value.searchValue && cascader.showSearch.value) return cascaderPanelHeight(cascader.loading.value ? 0 : cascader.controller.getSearchResults().length)
  return cascaderPanelHeight(Math.max(0, ...cascader.controller.getColumns().map(column => column.nodes.length)))
}
function columnCount() { return cascader.snapshot.value.searchValue && cascader.showSearch.value ? 1 : Math.max(1, cascader.controller.getColumns().length) }
</script>
<template>
  <div :class="cascaderPanelClassName" :style="{ '--cascader-column-count': columnCount(), '--cascader-panel-height': panelHeight() }">
    <template v-if="cascader.snapshot.value.searchValue && cascader.showSearch.value">
      <CascaderColumn class="w-full min-w-full border-r-0">
        <CascaderLoading v-if="cascader.loading.value" />
        <template v-else-if="cascader.controller.getSearchResults().length">
          <CascaderOption v-for="path in cascader.controller.getSearchResults()" :key="path.at(-1)!.key" :node="path.at(-1)!" :label="path.map(item => item.label).join(' / ')" />
        </template>
        <CascaderEmpty v-else><slot name="empty">No options</slot></CascaderEmpty>
      </CascaderColumn>
    </template>
    <template v-else>
      <CascaderColumn v-for="(column,index) in cascader.controller.getColumns()" :key="column.parentKey ?? 'root'" :aria-label="`Level ${index+1}`">
        <CascaderOption v-for="node in column.nodes" :key="node.key" :node="node"><template v-if="slots.option" #default="slotProps"><slot name="option" v-bind="slotProps" /></template></CascaderOption>
      </CascaderColumn>
    </template>
  </div>
</template>
