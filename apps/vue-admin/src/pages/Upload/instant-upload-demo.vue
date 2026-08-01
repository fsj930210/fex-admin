<script setup lang="ts">
import { UploadRoot, UploadTrigger } from '@fex/components-vue/primitive/upload'
import Button from '@fex/components-vue/ui/button'
import { createMultipartUpload } from './create-multipart-upload'
import DemoList from './demo-list.vue'
import DemoSection from './demo-section.vue'
const upload = createMultipartUpload('instant')
</script>
<template>
  <DemoSection
    title="MD5 秒传"
    description="第一次选择文件会正常分片上传并登记 MD5；清空列表后再次选择相同文件，服务端命中 MD5，前端不会发送任何分片，直接使用服务端原样响应完成。"
    ><UploadRoot :controller="upload"
      ><UploadTrigger v-slot="{ props }"
        ><Button v-bind="props">选择文件验证秒传</Button></UploadTrigger
      ><DemoList show-multipart /></UploadRoot
  ></DemoSection>
</template>
