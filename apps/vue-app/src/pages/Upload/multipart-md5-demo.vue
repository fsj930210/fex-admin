<script setup lang="ts">
import { UploadRoot, UploadTrigger } from '@fex-design/vue/primitive/upload'
import Button from '@fex-design/vue/ui/button'
import { createMultipartUpload } from './create-multipart-upload'
import DemoList from './demo-list.vue'
import DemoSection from './demo-section.vue'
const upload = createMultipartUpload('basic')
</script>
<template>
  <DemoSection
    title="大文件分片上传与 MD5"
    description="使用 Worker 按 1 MB 分块计算整文件 MD5，同时展示计算进度、总上传进度和每个分片的实时状态。"
    ><UploadRoot :controller="upload"
      ><UploadTrigger v-slot="{ props }"><Button v-bind="props">选择大文件</Button></UploadTrigger
      ><DemoList show-multipart /></UploadRoot
  ></DemoSection>
</template>
