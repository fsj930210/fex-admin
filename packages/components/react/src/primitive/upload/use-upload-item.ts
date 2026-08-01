import type { MultipartFeatureApi } from '@fex/components-core/upload/features/multipart'
import type {
  UploadController,
  UploadFeatureApi,
  UploadId,
} from '@fex/components-core/upload/types'
import { useSyncExternalStore } from 'react'

export function useUploadItem<TResponse>(upload: UploadController<TResponse>, id: UploadId) {
  const item = useSyncExternalStore(
    (listener) => upload.subscribeItem(id, listener),
    () => upload.getItem(id),
    () => upload.getItem(id),
  )
  const executor = upload.getFeature<UploadFeatureApi>('upload')
  const multipart = executor as MultipartFeatureApi | undefined
  return {
    item,
    start: () => executor?.start(id) ?? Promise.resolve(),
    retry: () => executor?.retry(id) ?? Promise.resolve(),
    cancel: () => executor?.cancel(id),
    pause: multipart?.pause ? () => multipart.pause(id) : undefined,
    continue: multipart?.continue ? () => multipart.continue(id) : undefined,
    remove: () => upload.remove(id),
  }
}
