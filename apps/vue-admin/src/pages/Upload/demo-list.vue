<script setup lang="ts">
import { UploadItem, UploadItemPreview, UploadItemProgress, UploadList, useUploadContext } from '@fex/components-vue/primitive/upload'
import Button from '@fex/components-vue/ui/button'
import { onScopeDispose, shallowRef } from 'vue'
import MultipartDetails from './multipart-details.vue'
defineProps<{ showMultipart?: boolean }>()
const { upload } = useUploadContext()
const allItems = shallowRef(upload.getItems())
const unsubscribe = upload.subscribeItems(() => { allItems.value = upload.getItems() })
onScopeDispose(unsubscribe)
const message = (error: unknown) => error instanceof Error ? error.message : String(error)
const isInstant = (response: unknown) => typeof response === 'object' && response !== null && 'instant' in response && response.instant === true
</script>
<template>
  <UploadList class="mt-space-md" v-slot="{ items }">
    <UploadItem v-for="item in items" :key="item.id" :id="item.id" v-slot="state">
      <UploadItemPreview />
      <div class="min-w-0 flex-1">
        <div class="flex min-w-0 flex-1 flex-col gap-0.5"><span class="truncate font-medium">{{ state.item.name }}</span><span class="text-xs text-muted-foreground">{{ ((state.item.size ?? 0) / 1024).toFixed(1) }} KB</span></div>
        <UploadItemProgress v-if="!showMultipart && state.item.status === 'uploading'" class="mt-1" />
        <MultipartDetails v-if="showMultipart" :id="item.id" />
        <p v-if="state.item.status === 'success'" class="mt-1 text-xs text-primary">{{ isInstant(state.item.response) ? 'MD5 命中，已秒传' : '上传完成' }}</p>
        <div v-if="state.item.error !== undefined && state.item.error !== false" class="mt-1 text-xs text-danger">{{ message(state.item.error) }}</div>
      </div>
      <div class="flex gap-space-xs"><Button v-if="state.item.status === 'pending'" size="xs" variant="ghost" @click="state.start">上传</Button><Button v-if="state.item.status === 'error' && state.item.errorStage !== 'before-upload'" size="xs" variant="ghost" @click="state.retry">重试</Button><Button v-if="state.pause && state.item.status === 'uploading'" size="xs" variant="ghost" @click="state.pause">暂停</Button><Button v-if="state.continue && state.item.status === 'paused'" size="xs" variant="ghost" @click="state.continue">继续</Button><Button size="xs" variant="destructive" @click="state.remove">删除</Button></div>
    </UploadItem>
  </UploadList>
  <Button v-if="allItems.length" class="mt-space-sm w-full" size="xs" variant="ghost" @click="() => upload.clear()">清空列表</Button>
</template>
