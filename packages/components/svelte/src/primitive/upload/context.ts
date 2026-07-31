import type { UploadController, UploadId } from '@fex/components-core/upload/types'
import { getContext, setContext } from 'svelte'
export interface UploadContextValue<TResponse = unknown> { upload: UploadController<TResponse>, input: () => HTMLInputElement | undefined, setInput: (element: HTMLInputElement) => void, inputId: string, listId: string, invalid: () => boolean }
const uploadKey = Symbol('fex-upload')
const itemKey = Symbol('fex-upload-item')
export const setUploadContext = <TResponse>(value: UploadContextValue<TResponse>) => setContext(uploadKey, value)
export function useUploadContext<TResponse = unknown>() { const value = getContext<UploadContextValue<TResponse>>(uploadKey); if (!value) throw new Error('Upload components must be used within UploadRoot.'); return value }
export const setUploadItemId = (id: UploadId) => setContext(itemKey, id)
export function useUploadItemId() { const id = getContext<UploadId>(itemKey); if (!id) throw new Error('Upload item components must be used within UploadItem.'); return id }
