<script setup lang="ts">
import { UploadRoot, UploadTrigger } from '@fex-design/vue/primitive/upload'
import Button from '@fex-design/vue/ui/button'
import { createMultipartUpload } from './create-multipart-upload'
import DemoList from './demo-list.vue'
import DemoSection from './demo-section.vue'
const upload = createMultipartUpload('retry')
</script>
<template>
  <DemoSection
    title="失败分片重传"
    description="第 2 个分片第一次会被有意置为失败。点击“重试”后，已成功分片保持完成状态，只重新上传失败及尚未上传的分片。"
    ><UploadRoot :controller="upload"
      ><UploadTrigger v-slot="{ props }"
        ><Button v-bind="props">选择至少 2 MB 的文件</Button></UploadTrigger
      ><DemoList show-multipart /></UploadRoot
  ></DemoSection>
</template>
