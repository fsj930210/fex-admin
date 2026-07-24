<script setup lang="ts">
import { defaultSelectFilterOption } from '@fex/components-core/select/filter-options'
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-vue/primitive/select'
import { frameworkOptions } from './data'
import Demo from './demo-section.vue'
</script>
<template>
  <Demo
    title="Multi-field search"
    description="Search label, searchText and keywords; try google or meta."
    ><SelectRoot show-search :options="frameworkOptions" :filter-option="defaultSelectFilterOption"
      ><SelectTrigger placeholder="输入 google 或 meta" /><SelectContent /></SelectRoot
  ></Demo>
</template>
