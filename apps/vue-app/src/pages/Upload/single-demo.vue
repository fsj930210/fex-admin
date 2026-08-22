<script setup lang="ts">
import { previewFeature } from '@fex-design/core/upload/features/preview'
import { uploadFeature } from '@fex-design/core/upload/features/upload'
import { UploadRoot, UploadTrigger, useUpload } from '@fex-design/vue/primitive/upload'
import Button from '@fex-design/vue/ui/button'
import { uploadBody, uploadServerUrl } from './api'
import DemoList from './demo-list.vue'
import DemoSection from './demo-section.vue'
const upload = useUpload({
  maxCount: 1,
  features: [
    uploadFeature({
      request: ({ file, signal, onProgress }) =>
        uploadBody(`${uploadServerUrl}/upload`, file, { fileName: file.name, signal, onProgress }),
    }),
    previewFeature(),
  ],
})
</script>
<template>
  <DemoSection
    title="单文件上传"
    description="向本地 Node 服务发送真实请求，maxCount 保证列表中只保留一个文件。"
    ><UploadRoot :controller="upload"
      ><UploadTrigger v-slot="{ props }"><Button v-bind="props">选择一个文件</Button></UploadTrigger
      ><DemoList /></UploadRoot
  ></DemoSection>
</template>
