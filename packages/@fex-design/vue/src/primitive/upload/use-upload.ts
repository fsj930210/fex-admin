import { createUploadController } from '@fex-design/core/upload/create-upload-controller'
import type { UploadController, UploadId, UploadOptions } from '@fex-design/core/upload/types'
import { onScopeDispose, shallowRef, type MaybeRefOrGetter, toValue, watch } from 'vue'

export function useUpload<TResponse>(options: UploadOptions<TResponse>) {
  const upload = createUploadController(options)
  onScopeDispose(() => upload.destroy())
  return upload
}

export function useUploadController<TResponse>(
  options: MaybeRefOrGetter<UploadOptions<TResponse> | undefined>,
  supplied?: UploadController<TResponse>,
) {
  const owned = supplied ? undefined : createUploadController(toValue(options) ?? {})
  const upload = supplied ?? owned!
  watch(
    () => toValue(options),
    (value) => value && upload.updateOptions(value),
    { deep: false },
  )
  if (owned) onScopeDispose(() => owned.destroy())
  return upload
}

export function useUploadItem<TResponse>(
  upload: UploadController<TResponse>,
  id: MaybeRefOrGetter<UploadId>,
) {
  const item = shallowRef(upload.getItem(toValue(id)))
  let unsubscribe = upload.subscribeItem(toValue(id), () => {
    item.value = upload.getItem(toValue(id))
  })
  watch(
    () => toValue(id),
    (next) => {
      unsubscribe()
      item.value = upload.getItem(next)
      unsubscribe = upload.subscribeItem(next, () => {
        item.value = upload.getItem(next)
      })
    },
  )
  onScopeDispose(() => unsubscribe())
  const executor =
    upload.getFeature<import('@fex-design/core/upload/types').UploadFeatureApi>('upload')
  const multipart = executor as
    | import('@fex-design/core/upload/features/multipart').MultipartFeatureApi<TResponse>
    | undefined
  return {
    item,
    start: () => executor?.start(toValue(id)) ?? Promise.resolve(),
    retry: () => executor?.retry(toValue(id)) ?? Promise.resolve(),
    cancel: () => executor?.cancel(toValue(id)),
    pause: multipart?.pause ? () => multipart.pause(toValue(id)) : undefined,
    continue: multipart?.continue ? () => multipart.continue(toValue(id)) : undefined,
    remove: () => upload.remove(toValue(id)),
  }
}
