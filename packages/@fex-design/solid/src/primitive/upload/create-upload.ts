import { createUploadController } from '@fex-design/core/upload/create-upload-controller'
import type { FileMd5FeatureApi } from '@fex-design/core/upload/features/file-md5'
import type {
  MultipartFeatureApi,
  UploadPart,
} from '@fex-design/core/upload/features/multipart'
import type { PreviewFeatureApi } from '@fex-design/core/upload/features/preview'
import type {
  UploadController,
  UploadId,
  UploadOptions,
  UploadStatus,
} from '@fex-design/core/upload/types'
import { createMemo, createSignal, onCleanup, type Accessor } from 'solid-js'
import { useUploadContext } from './context'

export function createUpload<TResponse>(options: UploadOptions<TResponse>) {
  const upload = createUploadController(options)
  onCleanup(() => upload.destroy())
  return upload
}

export function createUploadItem<TResponse>(
  upload: UploadController<TResponse>,
  id: Accessor<UploadId>,
) {
  const [item, setItem] = createSignal(upload.getItem(id()))
  let unsubscribe = upload.subscribeItem(id(), () => setItem(() => upload.getItem(id())))
  onCleanup(unsubscribe)
  const executor =
    upload.getFeature<import('@fex-design/core/upload/types').UploadFeatureApi>('upload')
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

export function createUploadMd5(id: Accessor<UploadId>) {
  const { upload } = useUploadContext()
  const feature = upload.getFeature<FileMd5FeatureApi>('file-md5')
  const [state, setState] = createSignal(feature?.getState(id()))
  const unsubscribe = feature
    ? upload.subscribeFeatureItem('file-md5', id(), () => setState(() => feature.getState(id())))
    : undefined
  onCleanup(() => unsubscribe?.())
  return {
    available: Boolean(feature),
    state,
    calculate: () => feature?.calculate(id()),
    cancel: () => feature?.cancel(id()),
  }
}

export function createUploadParts<TResponse = unknown>(id: Accessor<UploadId>) {
  const { upload } = useUploadContext<TResponse>()
  const feature = upload.getFeature<MultipartFeatureApi<TResponse>>('upload')
  const getPartsSnapshot = () =>
    (feature?.getParts?.(id()) ?? []).map((part) => ({
      ...part,
      ...(part.progress ? { progress: { ...part.progress } } : {}),
    }))
  const [parts, setParts] = createSignal<readonly UploadPart<TResponse>[]>(getPartsSnapshot())
  const unsubscribe = upload.subscribeFeatureItem('upload', id(), () =>
    setParts(getPartsSnapshot()),
  )
  onCleanup(unsubscribe)
  return parts
}

export function createUploadPreview(id: Accessor<UploadId>) {
  return useUploadContext().upload.getFeature<PreviewFeatureApi>('preview')?.getUrl(id())
}

export function createUploadProgress(id: Accessor<UploadId>, options: { md5Weight?: number } = {}) {
  const { upload } = useUploadContext()
  const item = createUploadItem(upload, id).item
  const md5 = createUploadMd5(id)
  return createMemo(() => {
    const weight = md5.available ? Math.min(1, Math.max(0, options.md5Weight ?? 0.1)) : 0
    const md5Percent = md5.state()?.progress ?? 0
    const uploadPercent = item()?.progress?.percent ?? 0
    const status: UploadStatus | undefined = item()?.status
    let percent = 0
    if (status === 'processing') percent = md5Percent * weight
    else if (status === 'error' && md5.available && md5.state()?.status !== 'success')
      percent = md5Percent * weight
    else if (status === 'uploading' || status === 'paused' || status === 'error')
      percent = weight * 100 + uploadPercent * (1 - weight)
    else if (status === 'success') percent = 100
    return { status, percent, md5Percent, uploadPercent }
  })
}
