<script setup lang="ts">
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-vue/primitive/select'
import { frameworkOptions } from './data'
import Demo from './demo-section.vue'
const prefixFilter = (keyword: string, option: { label: string }) =>
  option.label.toLocaleLowerCase().startsWith(keyword.trim().toLocaleLowerCase())
</script>
<template>
  <Demo title="Custom search" description="A custom filterOption matches labels by prefix only."
    ><SelectRoot show-search :options="frameworkOptions" :filter-option="prefixFilter"
      ><SelectTrigger placeholder="按名称前缀搜索" /><SelectContent /></SelectRoot
  ></Demo>
</template>
