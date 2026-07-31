<script setup lang="ts">
import { uploadPreviewClassName } from '@fex/components-styles/upload'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'
import { useUploadContext, useUploadItemId } from './context'
import { useUploadPreview } from './use-upload-feature'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const id = useUploadItemId()
const { upload } = useUploadContext()
const item = upload.getItem(id)
const url = useUploadPreview(id)
</script>
<template><div v-bind="{ ...attrs, class: undefined }" :class="cn(uploadPreviewClassName(), attrs.class as string | undefined)"><slot :url="url" :item="item"><img v-if="url && item?.type?.startsWith('image/')" class="size-full object-cover" :src="url" alt="" /><span v-else aria-hidden="true">↥</span></slot></div></template>
