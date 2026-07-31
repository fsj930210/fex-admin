<script setup lang="ts">
import type { UploadId } from '@fex/components-core/upload/types'
import { uploadItemClassName } from '@fex/components-styles/upload'
import { cn } from '@fex/utils'
import { provide, useAttrs } from 'vue'
import { uploadItemIdKey, useUploadContext } from './context'
import { useUploadItem } from './use-upload'
defineOptions({ inheritAttrs: false })
const props = defineProps<{ id: UploadId }>()
const attrs = useAttrs()
const { upload } = useUploadContext()
const state = useUploadItem(upload, () => props.id)
provide(uploadItemIdKey, props.id)
</script>
<template><div v-if="state.item.value" v-bind="{ ...attrs, class: undefined }" role="listitem" :data-status="state.item.value.status" :class="cn(uploadItemClassName(), attrs.class as string | undefined)"><slot :item="state.item.value" :start="state.start" :retry="state.retry" :cancel="state.cancel" :pause="state.pause" :continue="state.continue" :remove="state.remove" /></div></template>
