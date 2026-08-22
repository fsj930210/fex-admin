<script setup lang="ts">
import Tag from '@fex-design/vue/primitive/tag'
import { SelectContent, SelectRoot, SelectTrigger } from '@fex-design/vue/primitive/select'
import { frameworkOptions } from './data'
import Demo from './demo-section.vue'
const colors: Record<string, string> = {
  react: '#0284c7', vue: '#059669', angular: '#dc2626',
}
</script>
<template>
  <Demo
    title="Custom selected tags"
    description="The tag slot controls each selected value while remove keeps shared selection behavior."
    ><SelectRoot multiple :options="frameworkOptions" :default-value="['react', 'vue', 'angular']"
      ><SelectTrigger placeholder="请选择"
        ><template #tag="{ option, remove }"
          ><Tag size="sm" closable :color="colors[String(option.value)] ?? 'neutral'" @pointerdown.capture.prevent @close.stop="remove">{{ option.label }}</Tag></template></SelectTrigger
      ><SelectContent /></SelectRoot
  ></Demo>
</template>
