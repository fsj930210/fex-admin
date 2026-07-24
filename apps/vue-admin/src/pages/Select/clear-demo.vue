<script setup lang="ts">
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-vue/primitive/select'
import { frameworkOptions } from './data'
import Demo from './demo-section.vue'
</script>
<template>
  <Demo
    title="Clear"
    description="Clear and the dropdown indicator share one suffix position and never render together."
    ><SelectRoot clearable default-value="solid" :options="frameworkOptions"
      ><SelectTrigger placeholder="请选择" /><SelectContent /></SelectRoot
  ></Demo>
</template>
