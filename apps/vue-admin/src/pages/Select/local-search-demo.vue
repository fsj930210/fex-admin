<script setup lang="ts">
import { defaultSelectFilterOption } from '@fex/components-core/select/filter-options'
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-vue/primitive/select'
import { frameworkOptions } from './data'
import Demo from './demo-section.vue'
</script>
<template>
  <Demo
    title="Local search"
    description="filterOption filters options locally and search still receives every keyword."
    ><SelectRoot show-search :options="frameworkOptions" :filter-option="defaultSelectFilterOption"
      ><SelectTrigger placeholder="搜索选项" /><SelectContent /></SelectRoot
  ></Demo>
</template>
