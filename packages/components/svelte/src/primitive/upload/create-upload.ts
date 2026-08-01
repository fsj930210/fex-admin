import { createUploadController } from '@fex/components-core/upload/create-upload-controller'
import type { FileMd5FeatureApi } from '@fex/components-core/upload/features/file-md5'
import type {
  MultipartFeatureApi,
  UploadPart,
} from '@fex/components-core/upload/features/multipart'
import type { PreviewFeatureApi } from '@fex/components-core/upload/features/preview'
import type {
  UploadController,
  UploadId,
  UploadItem,
  UploadOptions,
  UploadStatus,
} from '@fex/components-core/upload/types'
import { onDestroy } from 'svelte'
import { derived, readable } from 'svelte/store'
import { useUploadContext } from './context'
export function createUpload<TResponse>(options: UploadOptions<TResponse>) {
  const upload = createUploadController(options)
  onDestroy(() => upload.destroy())
  return upload
}
export function createUploadItem<TResponse>(
  upload: UploadController<TResponse>,
  id: () => UploadId,
) {
  const item = readable<UploadItem<TResponse> | undefined>(upload.getItem(id()), (set) =>
    upload.subscribeItem(id(), () => set(upload.getItem(id()))),
  )
  const executor =
    upload.getFeature<import('@fex/components-core/upload/types').UploadFeatureApi>('upload')
  const multipart = executor as MultipartFeatureApi<TResponse> | undefined
  return {
    item,
    start: () => executor?.start(id()) ?? Promise.resolve(),
    retry: () => executor?.retry(id()) ?? Promise.resolve(),
    cancel: () => executor?.cancel(id()),
    pause: multipart?.pause ? () => multipart.pause(id()) : undefined,
    continue: multipart?.continue ? () => multipart.continue(id()) : undefined,
    remove: () => upload.remove(id()),
  }
}
export function createUploadMd5(id: () => UploadId) {
  const { upload } = useUploadContext()
  const feature = upload.getFeature<FileMd5FeatureApi>('file-md5')
  const state = readable(feature?.getState(id()), (set) =>
    feature
      ? upload.subscribeFeatureItem('file-md5', id(), () => set(feature.getState(id())))
      : () => {},
  )
  return {
    available: Boolean(feature),
    state,
    calculate: () => feature?.calculate(id()),
    cancel: () => feature?.cancel(id()),
  }
}
export function createUploadParts<TResponse = unknown>(id: () => UploadId) {
  const { upload } = useUploadContext<TResponse>()
  const feature = upload.getFeature<MultipartFeatureApi<TResponse>>('upload')
  return readable<readonly UploadPart<TResponse>[]>(feature?.getParts?.(id()) ?? [], (set) =>
    upload.subscribeFeatureItem('upload', id(), () => set(feature?.getParts?.(id()) ?? [])),
  )
}
export function createUploadPreview(id: () => UploadId) {
  return useUploadContext().upload.getFeature<PreviewFeatureApi>('preview')?.getUrl(id())
}
export function createUploadProgress(id: () => UploadId, options: { md5Weight?: number } = {}) {
  const { upload } = useUploadContext()
  const item = createUploadItem(upload, id).item
  const md5 = createUploadMd5(id)
  return derived([item, md5.state], ([$item, $md5]) => {
    const weight = md5.available ? Math.min(1, Math.max(0, options.md5Weight ?? 0.1)) : 0
    const md5Percent = $md5?.progress ?? 0
    const uploadPercent = $item?.progress?.percent ?? 0
    const status: UploadStatus | undefined = $item?.status
    let percent = 0
    if (status === 'processing') percent = md5Percent * weight
    else if (status === 'error' && md5.available && $md5?.status !== 'success')
      percent = md5Percent * weight
    else if (status === 'uploading' || status === 'paused' || status === 'error')
      percent = weight * 100 + uploadPercent * (1 - weight)
    else if (status === 'success') percent = 100
    return { status, percent, md5Percent, uploadPercent }
  })
}
