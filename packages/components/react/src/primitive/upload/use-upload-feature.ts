import type { DropFeatureApi } from '@fex/components-core/upload/features/drop'
import type { FileMd5FeatureApi } from '@fex/components-core/upload/features/file-md5'
import type {
  MultipartFeatureApi,
  UploadPart,
} from '@fex/components-core/upload/features/multipart'
import type { PreviewFeatureApi } from '@fex/components-core/upload/features/preview'
import type { UploadId } from '@fex/components-core/upload/types'
import { useSyncExternalStore } from 'react'
import { useUploadContext } from './upload-context'

const emptyParts: readonly UploadPart<unknown>[] = []

export function useUploadFeature<TApi>(id: string) {
  return useUploadContext().upload.getFeature<TApi>(id)
}

export function useUploadMd5(id: UploadId) {
  const { upload } = useUploadContext()
  const feature = upload.getFeature<FileMd5FeatureApi>('file-md5')
  const state = useSyncExternalStore(
    (listener) =>
      upload.hasFeature('file-md5')
        ? upload.subscribeFeatureItem('file-md5', id, listener)
        : () => {},
    () => feature?.getState(id),
    () => feature?.getState(id),
  )
  return {
    available: Boolean(feature),
    state,
    calculate: () => feature?.calculate(id),
    cancel: () => feature?.cancel(id),
  }
}

export function useUploadParts<TResponse = unknown>(id: UploadId) {
  const { upload } = useUploadContext()
  const feature = upload.getFeature<MultipartFeatureApi<TResponse>>('upload')
  return useSyncExternalStore(
    (listener) => upload.subscribeFeatureItem('upload', id, listener),
    () => feature?.getParts?.(id) ?? (emptyParts as readonly UploadPart<TResponse>[]),
    () => emptyParts as readonly UploadPart<TResponse>[],
  )
}

export function useUploadPreview(id: UploadId) {
  return useUploadFeature<PreviewFeatureApi>('preview')?.getUrl(id)
}
export function useUploadDragging() {
  const feature = useUploadFeature<DropFeatureApi>('drop')
  return useSyncExternalStore(
    feature?.subscribe ?? (() => () => {}),
    feature?.getDragging ?? (() => false),
    () => false,
  )
}
