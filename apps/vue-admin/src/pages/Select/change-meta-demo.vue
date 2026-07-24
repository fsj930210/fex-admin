<script setup lang="ts">
import type { SelectOption } from '@fex/components-core/select/types'
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-vue/primitive/select'
import { ref } from 'vue'
import Demo from './demo-section.vue'
const options: SelectOption[] = [
  { value: 'u-101', label: 'Ada Lovelace', data: { id: 101, department: 'Research' } },
  { value: 'u-102', label: 'Grace Hopper', data: { id: 102, department: 'Platform' } },
]
const result = ref('请选择用户')
</script>
<template>
  <Demo
    title="Change metadata"
    description="change returns value plus the complete selected option for backend fields."
    ><div class="space-y-space-md">
      <SelectRoot
        :options="options"
        @change="
          (value, meta) =>
            (result = JSON.stringify({ value, selectedItem: meta.selectedItem }, null, 2))
        "
        ><SelectTrigger placeholder="请选择用户" /><SelectContent
      /></SelectRoot>
      <pre class="overflow-auto rounded-md bg-muted-background p-3 text-xs">{{ result }}</pre>
    </div></Demo
  >
</template>
