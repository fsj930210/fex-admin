<script setup lang="ts">
import { dropFeature } from '@fex-design/core/upload/features/drop'
import { pasteFeature } from '@fex-design/core/upload/features/paste'
import { previewFeature } from '@fex-design/core/upload/features/preview'
import { uploadFeature } from '@fex-design/core/upload/features/upload'
import { UploadDropzone, UploadRoot, useUpload } from '@fex-design/vue/primitive/upload'
import { uploadBody, uploadServerUrl } from './api'
import DemoList from './demo-list.vue'
import DemoSection from './demo-section.vue'
const upload = useUpload({
  multiple: true,
  features: [
    dropFeature(),
    pasteFeature(),
    previewFeature(),
    uploadFeature({
      request: ({ file, signal, onProgress }) =>
        uploadBody(`${uploadServerUrl}/upload`, file, { fileName: file.name, signal, onProgress }),
    }),
  ],
})
</script>
<template>
  <DemoSection
    title="拖拽、粘贴与图片预览"
    description="可选行为 feature 共用同一条 addFiles 处理链；支持递归拖入文件夹，也可以聚焦此区域后粘贴剪贴板图片。"
    ><UploadRoot :controller="upload"
      ><UploadDropzone>拖入文件或文件夹，或者聚焦此区域后粘贴图片</UploadDropzone
      ><DemoList /></UploadRoot
  ></DemoSection>
</template>
