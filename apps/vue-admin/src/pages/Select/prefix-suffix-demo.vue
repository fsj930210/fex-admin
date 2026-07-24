<script setup lang="ts">
import { CheckIcon } from '@fex/components-vue/icon/check'
import { InfoIcon } from '@fex/components-vue/icon/info'
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-vue/primitive/select'
import { frameworkOptions } from './data'
import Demo from './demo-section.vue'
</script>
<template>
  <Demo
    title="Prefix and suffix"
    description="prefix decorates the input; suffix replaces only the default dropdown chevron."
    ><div class="space-y-space-md">
      <SelectRoot :options="frameworkOptions"
        ><SelectTrigger placeholder="带前缀"
          ><template #prefix
            ><InfoIcon class="size-4 text-muted-foreground" /></template></SelectTrigger
        ><SelectContent /></SelectRoot
      ><SelectRoot :options="frameworkOptions"
        ><SelectTrigger placeholder="自定义后缀"
          ><template #suffix><CheckIcon /></template></SelectTrigger
        ><SelectContent
      /></SelectRoot></div
  ></Demo>
</template>
