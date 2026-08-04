import type { UploadController, UploadId } from '@fex-design/core/upload/types'
import { inject, type InjectionKey, type Ref } from 'vue'

export interface UploadContextValue<TResponse = unknown> {
  upload: UploadController<TResponse>
  input: Ref<HTMLInputElement | null>
  inputId: string
  listId: string
  invalid: Ref<boolean>
}

export const uploadContextKey = Symbol('fex-upload') as InjectionKey<UploadContextValue<any>>
export const uploadItemIdKey = Symbol('fex-upload-item') as InjectionKey<UploadId>

export function useUploadContext<TResponse = unknown>() {
  const context = inject(uploadContextKey, null)
  if (!context) throw new Error('Upload components must be used within UploadRoot.')
  return context as UploadContextValue<TResponse>
}

export function useUploadItemId() {
  const id = inject(uploadItemIdKey, null)
  if (!id) throw new Error('Upload item components must be used within UploadItem.')
  return id
}
