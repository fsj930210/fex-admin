<script setup lang="ts">
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-vue/primitive/select'
import Demo from './demo-section.vue'
</script>
<template>
  <Demo title="Empty" description="An explicit empty state is rendered when there are no options."
    ><SelectRoot :options="[]"><SelectTrigger placeholder="请选择" /><SelectContent /></SelectRoot
  ></Demo>
</template>
