<script setup lang="ts">
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-vue/primitive/select'
import { frameworkOptions } from './data'
import Demo from './demo-section.vue'
</script>
<template>
  <Demo
    title="Multiple"
    description="Multiple selection keeps the panel open and renders selected values together."
    ><SelectRoot multiple :options="frameworkOptions" :default-value="['react', 'vue']"
      ><SelectTrigger placeholder="请选择" :max-tag-count="3" /><SelectContent /></SelectRoot
  ></Demo>
</template>
