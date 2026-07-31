<script setup lang="ts">
import { uploadProgressClassName, uploadProgressIndicatorClassName } from '@fex/components-styles/upload'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'
import { useUploadContext, useUploadItemId } from './context'
import { useUploadItem } from './use-upload'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const { upload } = useUploadContext()
const id = useUploadItemId()
const state = useUploadItem(upload, id)
const percent = computed(() => state.item.value?.progress?.percent ?? 0)
</script>
<template><div v-bind="{ ...attrs, class: undefined }" role="progressbar" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="Math.round(percent)" :class="cn(uploadProgressClassName(), attrs.class as string | undefined)"><div :class="uploadProgressIndicatorClassName()" :style="{ width: `${percent}%` }" /></div></template>
