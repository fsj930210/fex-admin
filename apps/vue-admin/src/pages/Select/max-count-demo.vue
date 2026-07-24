<script setup lang="ts">
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-vue/primitive/select'
import { frameworkOptions } from './data'
import Demo from './demo-section.vue'
</script>
<template>
  <Demo
    title="Maximum selection count"
    description="maxCount limits actual selection; maxTagCount only controls presentation."
    ><SelectRoot multiple :max-count="3" :options="frameworkOptions" :default-value="['react']"
      ><SelectTrigger :max-tag-count="2" placeholder="最多选择三个" /><SelectContent /></SelectRoot
  ></Demo>
</template>
