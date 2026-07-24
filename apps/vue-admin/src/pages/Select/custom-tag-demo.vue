<script setup lang="ts">
import { CloseIcon } from '@fex/components-vue/icon/close'
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-vue/primitive/select'
import { frameworkOptions } from './data'
import Demo from './demo-section.vue'
const colors: Record<string, string> = {
  react: 'bg-sky-100 text-sky-700',
  vue: 'bg-emerald-100 text-emerald-700',
  angular: 'bg-red-100 text-red-700',
}
</script>
<template>
  <Demo
    title="Custom selected tags"
    description="The tag slot controls each selected value while remove keeps shared selection behavior."
    ><SelectRoot multiple :options="frameworkOptions" :default-value="['react', 'vue', 'angular']"
      ><SelectTrigger placeholder="请选择"
        ><template #tag="{ option, remove }"
          ><span
            :class="[
              'inline-flex h-6 items-center gap-1 rounded-md px-2 text-xs',
              colors[String(option.value)] ?? 'bg-muted-background',
            ]"
            >{{ option.label
            }}<button
              type="button"
              class="inline-flex size-4 items-center justify-center"
              @pointerdown.prevent
              @click.stop="remove"
            >
              <CloseIcon class="size-3" /></button></span></template></SelectTrigger
      ><SelectContent /></SelectRoot
  ></Demo>
</template>
