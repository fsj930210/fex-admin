import type { UploadFeatureRegistration } from './feature-types'

export const UPLOAD_IGNORE = Symbol('UPLOAD_IGNORE')

export type UploadId = string
export type UploadStatus = 'pending' | 'processing' | 'uploading' | 'paused' | 'success' | 'error'

export interface UploadProgress {
  loaded: number
  total?: number | undefined
  percent?: number | undefined
}

export interface UploadItem<TResponse = unknown> {
  id: UploadId
  file?: File | undefined
  name: string
  size?: number | undefined
  type?: string | undefined
  status: UploadStatus
  progress?: UploadProgress | undefined
  response?: TResponse | undefined
  error?: unknown
  errorStage?: 'before-upload' | 'upload' | undefined
}

export interface BeforeUploadContext<TResponse> {
  item: UploadItem<TResponse>
  items: readonly UploadItem<TResponse>[]
  batch: readonly File[]
}

export type BeforeUploadResult = void | boolean | File | Blob | typeof UPLOAD_IGNORE

export interface UploadOptions<TResponse = unknown> {
  items?: readonly UploadItem<TResponse>[]
  defaultItems?: readonly UploadItem<TResponse>[]
  onItemsChange?: (items: readonly UploadItem<TResponse>[]) => void
  beforeUpload?: (
    file: File,
    context: BeforeUploadContext<TResponse>,
  ) => BeforeUploadResult | Promise<BeforeUploadResult>
  beforeRemove?: (item: UploadItem<TResponse>) => boolean | void | Promise<boolean | void>
  onReject?: (file: File, reason: unknown) => void
  onSuccess?: (item: UploadItem<TResponse>, response: TResponse) => void
  onError?: (item: UploadItem<TResponse>, error: unknown) => void
  autoUpload?: boolean
  accept?: string
  multiple?: boolean
  maxCount?: number
  disabled?: boolean
  features?: readonly UploadFeatureRegistration<TResponse>[]
}

export interface UploadSnapshot<TResponse = unknown> {
  items: readonly UploadItem<TResponse>[]
}

export interface UploadController<TResponse = unknown> {
  getSnapshot(): UploadSnapshot<TResponse>
  subscribe(listener: () => void): () => void
  subscribeItems(listener: () => void): () => void
  subscribeItem(id: UploadId, listener: () => void): () => void
  subscribeFeatureItem(featureId: string, id: UploadId, listener: () => void): () => void
  updateOptions(options: Partial<UploadOptions<TResponse>>): void
  getOptions(): UploadOptions<TResponse>
  addFiles(files: readonly File[]): Promise<void>
  remove(id: UploadId): Promise<boolean>
  clear(): Promise<void>
  getItem(id: UploadId): UploadItem<TResponse> | undefined
  getItems(): readonly UploadItem<TResponse>[]
  hasFeature(id: string): boolean
  getFeature<TApi>(id: string): TApi | undefined
  destroy(): void
}

export interface UploadFeatureApi {
  start(id: UploadId): Promise<void>
  startAll(): Promise<void>
  retry(id: UploadId): Promise<void>
  cancel(id: UploadId): void
}
