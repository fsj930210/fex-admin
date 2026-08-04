import type { UploadId, UploadItem, UploadOptions, UploadSnapshot } from './types'

export interface UploadFeatureContext<TResponse> {
  getSnapshot(): UploadSnapshot<TResponse>
  getOptions(): UploadOptions<TResponse>
  getItem(id: UploadId): UploadItem<TResponse> | undefined
  getItems(): readonly UploadItem<TResponse>[]
  updateItem(id: UploadId, patch: Partial<UploadItem<TResponse>>): UploadItem<TResponse> | undefined
  addFiles(files: readonly File[]): Promise<void>
  getFeature<TApi>(id: string): TApi | undefined
  notifyFeatureItem(featureId: string, id: UploadId): void
  subscribeFeatureItem(featureId: string, id: UploadId, listener: () => void): () => void
  onRemove(handler: (id: UploadId) => void): () => void
  onDestroy(handler: () => void): () => void
}

export interface UploadFeature<TResponse, TOptions = unknown, TApi = unknown> {
  id: string
  requires?: readonly string[]
  conflicts?: readonly string[]
  setup(context: UploadFeatureContext<TResponse>, options: TOptions): TApi
}

export interface UploadFeatureRegistration<TResponse = unknown> {
  feature: UploadFeature<TResponse, unknown, unknown>
  options: unknown
}
