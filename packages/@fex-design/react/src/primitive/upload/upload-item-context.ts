import type { UploadId } from '@fex-design/core/upload/types'
import { createContext, use } from 'react'
export const UploadItemContext = createContext<UploadId | null>(null)
export function useUploadItemId() {
  const id = use(UploadItemContext)
  if (!id) throw new Error('Upload item part must be used within UploadItem.')
  return id
}
