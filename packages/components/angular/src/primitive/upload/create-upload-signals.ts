import { createUploadController } from '@fex/components-core/upload/create-upload-controller'
import type { FileMd5FeatureApi } from '@fex/components-core/upload/features/file-md5'
import type { MultipartFeatureApi, UploadPart } from '@fex/components-core/upload/features/multipart'
import type { PreviewFeatureApi } from '@fex/components-core/upload/features/preview'
import type { UploadController, UploadId, UploadOptions, UploadStatus } from '@fex/components-core/upload/types'
import { computed, DestroyRef, effect, inject, signal, type Signal } from '@angular/core'

export function createUploadSignals<TResponse>(options: UploadOptions<TResponse> | (() => UploadOptions<TResponse>), supplied?: UploadController<TResponse>) {
  const readOptions = typeof options === 'function' ? options : () => options
  const upload = supplied ?? createUploadController(readOptions())
  const destroyRef = inject(DestroyRef)
  if (!supplied) destroyRef.onDestroy(() => upload.destroy())
  // Signal inputs are an external framework boundary; keep the shared controller options synchronized.
  effect(() => upload.updateOptions(readOptions()))
  const items = signal(upload.getItems())
  destroyRef.onDestroy(upload.subscribeItems(() => items.set(upload.getItems())))
  return { upload, items: items.asReadonly() }
}

export function createUploadItemSignal<TResponse>(upload: UploadController<TResponse>, id: Signal<UploadId>, destroyRef = inject(DestroyRef)) {
  const item = signal(upload.getItem(id()))
  destroyRef.onDestroy(upload.subscribeItem(id(), () => item.set(upload.getItem(id()))))
  const executor = upload.getFeature<import('@fex/components-core/upload/types').UploadFeatureApi>('upload')
  const multipart = executor as MultipartFeatureApi<TResponse> | undefined
  return { item: item.asReadonly(), start: () => executor?.start(id()) ?? Promise.resolve(), retry: () => executor?.retry(id()) ?? Promise.resolve(), cancel: () => executor?.cancel(id()), pause: multipart?.pause ? () => multipart.pause(id()) : undefined, continue: multipart?.continue ? () => multipart.continue(id()) : undefined, remove: () => upload.remove(id()) }
}

export function createUploadMd5Signal(upload: UploadController, id: Signal<UploadId>, destroyRef = inject(DestroyRef)) {
  const feature = upload.getFeature<FileMd5FeatureApi>('file-md5')
  const state = signal(feature?.getState(id()))
  if (feature) destroyRef.onDestroy(upload.subscribeFeatureItem('file-md5', id(), () => state.set(feature.getState(id()))))
  return { available: Boolean(feature), state: state.asReadonly(), calculate: () => feature?.calculate(id()), cancel: () => feature?.cancel(id()) }
}

export function createUploadPartsSignal<TResponse>(upload: UploadController<TResponse>, id: Signal<UploadId>, destroyRef = inject(DestroyRef)) {
  const feature = upload.getFeature<MultipartFeatureApi<TResponse>>('upload')
  const parts = signal<readonly UploadPart<TResponse>[]>(feature?.getParts?.(id()) ?? [])
  destroyRef.onDestroy(upload.subscribeFeatureItem('upload', id(), () => parts.set(feature?.getParts?.(id()) ?? [])))
  return parts.asReadonly()
}

export function readUploadPreview(upload: UploadController, id: UploadId) { return upload.getFeature<PreviewFeatureApi>('preview')?.getUrl(id) }

export function createUploadProgressSignal(upload: UploadController, id: Signal<UploadId>, options: { md5Weight?: number } = {}, destroyRef = inject(DestroyRef)) {
  const item = createUploadItemSignal(upload, id, destroyRef).item
  const md5 = createUploadMd5Signal(upload, id, destroyRef)
  return computed(() => { const weight = md5.available ? Math.min(1, Math.max(0, options.md5Weight ?? 0.1)) : 0; const md5Percent = md5.state()?.progress ?? 0; const uploadPercent = item()?.progress?.percent ?? 0; const status: UploadStatus | undefined = item()?.status; let percent = 0; if (status === 'processing') percent = md5Percent * weight; else if (status === 'error' && md5.available && md5.state()?.status !== 'success') percent = md5Percent * weight; else if (status === 'uploading' || status === 'paused' || status === 'error') percent = weight * 100 + uploadPercent * (1 - weight); else if (status === 'success') percent = 100; return { status, percent, md5Percent, uploadPercent } })
}
