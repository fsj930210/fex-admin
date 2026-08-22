<script lang="ts">
  import { UploadItem, UploadItemPreview, UploadItemProgress, UploadList, useUploadContext } from '@fex-design/svelte/primitive/upload'
  import Button from '@fex-design/svelte/ui/button'
  import { readable } from 'svelte/store'
  import MultipartDetails from './multipart-details.svelte'
  let { showMultipart = false }: { showMultipart?: boolean } = $props()
  const { upload } = useUploadContext()
  const allItems = readable(upload.getItems(), (set) => upload.subscribeItems(() => set(upload.getItems())))
  const message = (error: unknown) => error instanceof Error ? error.message : String(error)
</script>
<UploadList>{#snippet children(items)}{#each items as item (item.id)}<UploadItem id={item.id}>{#snippet children(state)}<UploadItemPreview /><div class="min-w-0 flex-1"><div class="flex min-w-0 flex-1 flex-col gap-0.5"><span class="truncate font-medium">{state.item?.name}</span><span class="text-xs text-muted-foreground">{((state.item?.size ?? 0) / 1024).toFixed(1)} KB</span></div>{#if !showMultipart && state.item?.status === 'uploading'}<UploadItemProgress class="mt-1" />{/if}{#if showMultipart}<MultipartDetails id={item.id} />{/if}{#if state.item?.status === 'success'}<p class="mt-1 text-xs text-primary">{(state.item.response as { instant?: boolean })?.instant ? 'MD5 命中，已秒传' : '上传完成'}</p>{/if}{#if state.item?.error !== undefined && state.item.error !== false}<div class="mt-1 text-xs text-danger">{message(state.item.error)}</div>{/if}</div><div class="flex gap-space-xs">{#if state.item?.status === 'pending'}<Button size="xs" variant="ghost" onclick={() => void state.start()}>上传</Button>{/if}{#if state.item?.status === 'error' && state.item.errorStage !== 'before-upload'}<Button size="xs" variant="ghost" onclick={() => void state.retry()}>重试</Button>{/if}{#if state.pause && state.item?.status === 'uploading'}<Button size="xs" variant="ghost" onclick={state.pause}>暂停</Button>{/if}{#if state.continue && state.item?.status === 'paused'}<Button size="xs" variant="ghost" onclick={() => void state.continue?.()}>继续</Button>{/if}<Button size="xs" variant="destructive" onclick={() => void state.remove()}>删除</Button></div>{/snippet}</UploadItem>{/each}{/snippet}</UploadList>
{#if $allItems.length}<Button class="mt-space-sm w-full" size="xs" variant="ghost" onclick={() => void upload.clear()}>清空列表</Button>{/if}
