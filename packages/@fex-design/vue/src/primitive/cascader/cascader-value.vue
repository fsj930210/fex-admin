<script setup lang="ts">
import { cascaderPlaceholderClassName, cascaderValueClassName } from '@fex-design/styles/cascader'
import Tag from '../tag/tag.vue'
import { useCascader } from './use-cascader'
const cascader = useCascader('CascaderValue')
function display(path: (typeof cascader.selectedPaths.value)[number]) { return cascader.displayRender?.(path.map((node) => node.label), path.map((node) => node.option)) ?? path.map((node) => node.label).join(' / ') }
</script>
<template>
  <span v-if="!cascader.selectedPaths.value.length && !cascader.snapshot.value.searchValue && !cascader.showSearch.value" :class="cascaderPlaceholderClassName">{{ cascader.placeholder.value }}</span>
  <div v-else-if="!cascader.multiple.value && cascader.selectedPaths.value[0]" :class="cascaderValueClassName"><slot :path="cascader.selectedPaths.value[0]">{{ display(cascader.selectedPaths.value[0]) }}</slot></div>
  <template v-else><Tag v-for="path in cascader.selectedPaths.value" :key="path.at(-1)?.key" size="sm" closable @close.stop="cascader.controller.removePath(path.at(-1)!.key)">{{ display(path) }}</Tag></template>
</template>
