<script setup lang="ts">
import { UploadRoot, UploadTrigger } from '@fex/components-vue/primitive/upload'
import Button from '@fex/components-vue/ui/button'
import { createMultipartUpload } from './create-multipart-upload'
import DemoList from './demo-list.vue'
import DemoSection from './demo-section.vue'
const upload = createMultipartUpload('resume')
</script>
<template>
  <DemoSection
    title="断点续传"
    description="暂停后可直接继续；刷新页面后重新选择同一个文件，也会根据 MD5 找回 uploadId，查询服务端已完成分片并跳过它们。浏览器安全限制决定了刷新后必须由用户重新选择文件。"
    ><UploadRoot :controller="upload"
      ><UploadTrigger v-slot="{ props }"
        ><Button v-bind="props">选择需要续传的文件</Button></UploadTrigger
      ><DemoList show-multipart /></UploadRoot
  ></DemoSection>
</template>
