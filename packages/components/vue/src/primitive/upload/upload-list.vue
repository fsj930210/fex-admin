<script setup lang="ts">
import { uploadListClassName } from '@fex/components-styles/upload'
import { cn } from '@fex/utils'
import { onScopeDispose, shallowRef, useAttrs } from 'vue'
import { useUploadContext } from './context'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const { upload, listId } = useUploadContext()
const items = shallowRef(upload.getItems())
const unsubscribe = upload.subscribeItems(() => { items.value = upload.getItems() })
onScopeDispose(unsubscribe)
</script>
<template><div v-if="items.length" v-bind="{ ...attrs, class: undefined }" :id="listId" role="list" :class="cn(uploadListClassName(), attrs.class as string | undefined)"><slot :items="items" /></div></template>
