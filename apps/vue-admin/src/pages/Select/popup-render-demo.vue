<script setup lang="ts">
import type { SelectOption } from '@fex/components-core/select/types'
import { PlusIcon } from '@fex/components-vue/icon/plus'
import { InputControl, InputRoot } from '@fex/components-vue/primitive/input'
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-vue/primitive/select'
import Button from '@fex/components-vue/ui/button'
import { ref } from 'vue'
import Demo from './demo-section.vue'
const options = ref<SelectOption[]>([
  { value: 'jack', label: 'Jack' },
  { value: 'lucy', label: 'Lucy' },
])
const name = ref('')
function addItem() {
  const label = name.value.trim()
  if (!label || options.value.some((item) => item.value === label.toLocaleLowerCase())) return
  options.value = [...options.value, { value: label.toLocaleLowerCase(), label }]
  name.value = ''
}
</script>
<template>
  <Demo
    title="Custom popup rendering"
    description="The content slot wraps the default menu with interactive custom content."
    ><SelectRoot :options="options"
      ><SelectTrigger placeholder="自定义下拉面板" /><SelectContent
        ><SelectList />
        <div class="flex items-center gap-2 border-t border-border p-2" @pointerdown.stop>
          <InputRoot :value="name" class="flex-1" @value-change="name = $event"
            ><InputControl placeholder="请输入新选项" /></InputRoot
          ><Button size="sm" variant="ghost" @click="addItem"
            ><PlusIcon class="size-4" />添加</Button
          >
        </div></SelectContent
      ></SelectRoot
    ></Demo
  >
</template>
