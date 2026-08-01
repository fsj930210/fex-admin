import type { FileMd5FeatureApi } from '@fex/components-core/upload/features/file-md5'
import type {
  MultipartFeatureApi,
  UploadPart,
} from '@fex/components-core/upload/features/multipart'
import type { PreviewFeatureApi } from '@fex/components-core/upload/features/preview'
import type { UploadId, UploadStatus } from '@fex/components-core/upload/types'
import { computed, onScopeDispose, shallowRef, type MaybeRefOrGetter, toValue } from 'vue'
import { useUploadContext } from './context'
import { useUploadItem } from './use-upload'

export function useUploadFeature<TApi>(id: string) {
  return useUploadContext().upload.getFeature<TApi>(id)
}

export function useUploadMd5(id: MaybeRefOrGetter<UploadId>) {
  const { upload } = useUploadContext()
  const feature = upload.getFeature<FileMd5FeatureApi>('file-md5')
  const state = shallowRef(feature?.getState(toValue(id)))
  const unsubscribe = feature
    ? upload.subscribeFeatureItem('file-md5', toValue(id), () => {
        state.value = feature.getState(toValue(id))
      })
    : undefined
  onScopeDispose(() => unsubscribe?.())
  return {
    available: Boolean(feature),
    state,
    calculate: () => feature?.calculate(toValue(id)),
    cancel: () => feature?.cancel(toValue(id)),
  }
}

export function useUploadParts<TResponse = unknown>(id: MaybeRefOrGetter<UploadId>) {
  const { upload } = useUploadContext<TResponse>()
  const feature = upload.getFeature<MultipartFeatureApi<TResponse>>('upload')
  const parts = shallowRef<readonly UploadPart<TResponse>[]>(feature?.getParts?.(toValue(id)) ?? [])
  const unsubscribe = upload.subscribeFeatureItem('upload', toValue(id), () => {
    parts.value = feature?.getParts?.(toValue(id)) ?? []
  })
  onScopeDispose(unsubscribe)
  return parts
}

export function useUploadPreview(id: MaybeRefOrGetter<UploadId>) {
  return useUploadFeature<PreviewFeatureApi>('preview')?.getUrl(toValue(id))
}

export function useUploadProgress(
  id: MaybeRefOrGetter<UploadId>,
  options: { md5Weight?: number } = {},
) {
  const { upload } = useUploadContext()
  const item = useUploadItem(upload, id).item
  const md5 = useUploadMd5(id)
  return computed(() => {
    const weight = md5.available ? Math.min(1, Math.max(0, options.md5Weight ?? 0.1)) : 0
    const md5Percent = md5.state.value?.progress ?? 0
    const uploadPercent = item.value?.progress?.percent ?? 0
    const status: UploadStatus | undefined = item.value?.status
    let percent = 0
    if (status === 'processing') percent = md5Percent * weight
    else if (status === 'error' && md5.available && md5.state.value?.status !== 'success')
      percent = md5Percent * weight
    else if (status === 'uploading' || status === 'paused' || status === 'error')
      percent = weight * 100 + uploadPercent * (1 - weight)
    else if (status === 'success') percent = 100
    return { status, percent, md5Percent, uploadPercent }
  })
}
