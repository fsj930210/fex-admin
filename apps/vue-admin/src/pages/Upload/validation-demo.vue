<script setup lang="ts">
import { uploadFeature } from '@fex/components-core/upload/features/upload'
import type { UploadItem } from '@fex/components-core/upload/types'
import { UploadRoot, UploadTrigger, useUpload } from '@fex/components-vue/primitive/upload'
import Button from '@fex/components-vue/ui/button'
import { computed, ref } from 'vue'
import { uploadBody, uploadServerUrl } from './api'
import DemoList from './demo-list.vue'
import DemoSection from './demo-section.vue'
const items = ref<readonly UploadItem[]>([])
const submitted = ref(false)
const invalid = computed(() => submitted.value && items.value.length === 0)
const upload = useUpload({
  get items() {
    return items.value
  },
  onItemsChange: (next) => {
    items.value = next
  },
  autoUpload: false,
  features: [
    uploadFeature({
      request: ({ file, signal, onProgress }) =>
        uploadBody(`${uploadServerUrl}/upload`, file, { fileName: file.name, signal, onProgress }),
    }),
  ],
})
</script>
<template>
  <DemoSection
    title="受控表单校验"
    description="父组件控制文件列表；必填字段为空时提交表单，选择文件按钮会公开 invalid 状态。"
    ><form novalidate @submit.prevent="submitted = true">
      <UploadRoot :controller="upload" :invalid="invalid" required
        ><UploadTrigger v-slot="{ props }"
          ><Button v-bind="props" variant="outline">选择必填文件</Button></UploadTrigger
        ><DemoList
      /></UploadRoot>
      <p v-if="invalid" class="mt-space-xs text-sm text-danger" role="alert">
        请至少选择一个文件。
      </p>
      <Button class="mt-space-md" type="submit">校验表单</Button>
    </form></DemoSection
  >
</template>
