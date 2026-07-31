<script setup lang="ts">
import { useUploadMd5, useUploadParts, useUploadProgress } from '@fex/components-vue/primitive/upload'
import { computed } from 'vue'
const props = defineProps<{ id: string }>()
const md5 = useUploadMd5(() => props.id)
const parts = useUploadParts(() => props.id)
const progress = useUploadProgress(() => props.id, { md5Weight: 0.1 })
const completed = computed(() => parts.value.filter((part) => part.status === 'success').length)
const statusText = { pending: '等待', uploading: '上传中', success: '完成', error: '失败' } as const
</script>
<template><div class="mt-space-sm space-y-space-sm text-xs"><div><div class="mb-1 flex justify-between text-muted-foreground"><span>总进度（MD5 10% + 上传 90%）</span><span>{{ progress.percent.toFixed(0) }}%</span></div><div class="h-1.5 overflow-hidden rounded-full bg-muted"><div class="h-full bg-primary transition-[width]" :style="{ width: `${progress.percent}%` }" /></div></div><div v-if="md5.available"><div class="mb-1 flex justify-between text-muted-foreground"><span>{{ md5.state.value?.status === 'calculating' ? '正在计算 MD5' : md5.state.value?.status === 'success' ? 'MD5 计算完成' : '准备计算 MD5' }}</span><span>{{ (md5.state.value?.progress ?? 0).toFixed(0) }}%</span></div><p v-if="md5.state.value?.value" class="mt-1 break-all text-muted-foreground">{{ md5.state.value.value }}</p></div><div v-if="parts.length"><p class="mb-1 text-muted-foreground">分片进度：{{ completed }}/{{ parts.length }}</p><div class="grid grid-cols-4 gap-1 sm:grid-cols-8"><div v-for="part in parts" :key="part.index" class="rounded border border-border px-1 py-0.5 text-center data-[status=error]:border-danger data-[status=error]:text-danger data-[status=success]:border-primary data-[status=success]:text-primary" :data-status="part.status" :title="`分片 ${part.index + 1}：${statusText[part.status]}`">{{ part.index + 1 }} · {{ part.status === 'uploading' ? `${part.progress?.percent?.toFixed(0) ?? 0}%` : statusText[part.status] }}</div></div></div></div></template>
