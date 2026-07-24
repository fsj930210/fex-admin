<script setup lang="ts">
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-vue/primitive/select'
import { virtualOptions } from './data'
import Demo from './demo-section.vue'
</script>
<template>
  <Demo
    title="Virtual scrolling"
    description="Only the visible fixed-height options and overscan are mounted from 1,000 entries."
    ><SelectRoot show-search :options="virtualOptions" :virtual="{ itemHeight: 32, overscan: 4 }"
      ><SelectTrigger placeholder="请输入关键词或选择选项" /><SelectContent
        class="[--select-content-max-height:256px]" /></SelectRoot
  ></Demo>
</template>
