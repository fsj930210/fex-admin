<script setup lang="ts">
import { directoryFeature } from '@fex-design/core/upload/features/directory'
import { uploadFeature } from '@fex-design/core/upload/features/upload'
import { UploadRoot, UploadTrigger, useUpload } from '@fex-design/vue/primitive/upload'
import Button from '@fex-design/vue/ui/button'
import { uploadBody, uploadServerUrl } from './api'
import DemoList from './demo-list.vue'
import DemoSection from './demo-section.vue'
const upload = useUpload({
  autoUpload: false,
  features: [
    directoryFeature(),
    uploadFeature({
      request: ({ file, signal, onProgress }) =>
        uploadBody(`${uploadServerUrl}/upload`, file, {
          fileName: file.webkitRelativePath || file.name,
          signal,
          onProgress,
        }),
    }),
  ],
})
</script>
<template>
  <DemoSection
    title="文件夹上传"
    description="directoryFeature 将隐藏文件选择器切换为目录模式，并在请求中保留每个文件的 webkitRelativePath。"
    ><UploadRoot :controller="upload"
      ><UploadTrigger v-slot="{ props }"><Button v-bind="props">选择文件夹</Button></UploadTrigger
      ><DemoList /></UploadRoot
  ></DemoSection>
</template>
