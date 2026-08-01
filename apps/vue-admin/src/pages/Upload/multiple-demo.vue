<script setup lang="ts">
import { uploadFeature } from '@fex/components-core/upload/features/upload'
import type { UploadFeatureApi } from '@fex/components-core/upload/types'
import { UploadRoot, UploadTrigger, useUpload } from '@fex/components-vue/primitive/upload'
import Button from '@fex/components-vue/ui/button'
import { uploadBody, uploadServerUrl } from './api'
import DemoList from './demo-list.vue'
import DemoSection from './demo-section.vue'
const upload = useUpload({
  multiple: true,
  autoUpload: false,
  features: [
    uploadFeature({
      request: ({ file, signal, onProgress }) =>
        uploadBody(`${uploadServerUrl}/upload`, file, { fileName: file.name, signal, onProgress }),
    }),
  ],
})
const startAll = () => upload.getFeature<UploadFeatureApi>('upload')?.startAll()
</script>
<template>
  <DemoSection
    title="多文件手动上传"
    description="一次选择多个文件，可逐个上传，也可以手动启动整个文件队列。"
    ><UploadRoot :controller="upload"
      ><div class="flex gap-space-sm">
        <UploadTrigger v-slot="{ props }"
          ><Button v-bind="props">选择多个文件</Button></UploadTrigger
        ><Button variant="outline" @click="startAll">全部上传</Button>
      </div>
      <DemoList /></UploadRoot
  ></DemoSection>
</template>
