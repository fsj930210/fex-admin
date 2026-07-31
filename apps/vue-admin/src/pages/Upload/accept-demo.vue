<script setup lang="ts">
import { uploadFeature } from '@fex/components-core/upload/features/upload'
import { UploadRoot, UploadTrigger, useUpload } from '@fex/components-vue/primitive/upload'
import Button from '@fex/components-vue/ui/button'
import { uploadBody, uploadServerUrl } from './api'
import DemoList from './demo-list.vue'
import DemoSection from './demo-section.vue'
const upload = useUpload({ accept: 'image/png,image/jpeg', multiple: true, beforeUpload(file) { if (!['image/png', 'image/jpeg'].includes(file.type)) throw new Error(`“${file.name}”不是 JPEG 或 PNG 图片。`); return file }, features: [uploadFeature({ request: ({ file, signal, onProgress }) => uploadBody(`${uploadServerUrl}/upload`, file, { fileName: file.name, signal, onProgress }) })] })
</script>
<template><DemoSection title="文件类型与上传前处理" description="原生文件选择器通过 accept 筛选 JPEG/PNG，beforeUpload 对所有入口统一校验；校验失败会保留文件并展示具体错误。"><UploadRoot :controller="upload"><UploadTrigger v-slot="{ props }"><Button v-bind="props">选择 JPEG 或 PNG</Button></UploadTrigger><DemoList /></UploadRoot></DemoSection></template>
