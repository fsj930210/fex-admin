<script setup lang="ts">
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-vue/primitive/select'
import { frameworkOptions } from './data'
import Demo from './demo-section.vue'
</script>
<template>
  <Demo title="Group" description="Options sharing a group render below a stable group label."
    ><SelectRoot :options="frameworkOptions"
      ><SelectTrigger placeholder="请选择" /><SelectContent /></SelectRoot
  ></Demo>
</template>
