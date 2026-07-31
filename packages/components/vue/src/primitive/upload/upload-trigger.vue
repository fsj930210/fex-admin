<script setup lang="ts">
import { uploadTriggerClassName } from '@fex/components-styles/upload'
import PrimitiveButton from '../button/button.vue'
import { computed } from 'vue'
import { useUploadContext } from './context'
const { upload, input, inputId, invalid } = useUploadContext()
const triggerProps = computed(() => ({
  type: 'button' as const,
  disabled: upload.getOptions().disabled === true,
  'aria-controls': inputId,
  'aria-invalid': invalid.value || undefined,
  class: uploadTriggerClassName(),
  onClick: () => { input.value?.click() },
}))
</script>

<template>
  <slot :props="triggerProps">
    <PrimitiveButton :class="uploadTriggerClassName()" :disabled="upload.getOptions().disabled" :aria-controls="inputId" @click="input?.click()"><slot name="label">选择文件</slot></PrimitiveButton>
  </slot>
</template>
