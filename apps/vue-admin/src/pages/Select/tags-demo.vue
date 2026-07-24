<script setup lang="ts">
import { defaultSelectFilterOption } from '@fex/components-core/select/filter-options'
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-vue/primitive/select'
import { frameworkOptions } from './data'
import Demo from './demo-section.vue'
</script>
<template>
  <Demo title="Tags" description="Type a new value and press Enter, or choose an existing option."
    ><SelectRoot
      mode="tags"
      :filter-option="defaultSelectFilterOption"
      :options="frameworkOptions"
      :default-value="['react']"
      ><SelectTrigger placeholder="请输入或选择标签" /><SelectContent /></SelectRoot
  ></Demo>
</template>
