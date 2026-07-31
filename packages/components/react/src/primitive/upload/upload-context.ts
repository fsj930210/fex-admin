import type { UploadController } from '@fex/components-core/upload/types'
import { createContext, use, type RefObject } from 'react'

export interface UploadContextValue<TResponse = unknown> {
  upload: UploadController<TResponse>
  inputRef: RefObject<HTMLInputElement | null>
  inputId: string
  listId: string
  invalid: boolean
}

export const UploadContext = createContext<UploadContextValue<any> | null>(null)

export function useUploadContext<TResponse = unknown>() {
  const context = use(UploadContext)
  if (!context) throw new Error('Upload components must be used within UploadRoot.')
  return context as UploadContextValue<TResponse>
}
