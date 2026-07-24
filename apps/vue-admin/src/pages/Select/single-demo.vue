<script setup lang="ts">
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-vue/primitive/select'
import { frameworkOptions } from './data'
import Demo from './demo-section.vue'
</script>
<template>
  <Demo title="Single" description="Single selection closes the panel after choosing an option."
    ><SelectRoot :options="frameworkOptions" default-value="react"
      ><SelectTrigger placeholder="请选择" /><SelectContent /></SelectRoot
  ></Demo>
</template>
