import type { UploadController, UploadId } from '@fex/components-core/upload/types'
import { createContext, useContext, type Accessor } from 'solid-js'

export interface UploadContextValue<TResponse = unknown> {
  upload: UploadController<TResponse>
  input: Accessor<HTMLInputElement | undefined>
  setInput(element: HTMLInputElement): void
  inputId: string
  listId: string
  invalid: Accessor<boolean>
}

export const UploadContext = createContext<UploadContextValue<any>>()
export const UploadItemContext = createContext<UploadId>()

export function useUploadContext<TResponse = unknown>() {
  const context = useContext(UploadContext)
  if (!context) throw new Error('Upload components must be used within UploadRoot.')
  return context as UploadContextValue<TResponse>
}

export function useUploadItemId() {
  const id = useContext(UploadItemContext)
  if (!id) throw new Error('Upload item components must be used within UploadItem.')
  return id
}
