import type { DropFeatureApi } from '@fex/components-core/upload/features/drop'
import type { PasteFeatureApi } from '@fex/components-core/upload/features/paste'
import { getDroppedFiles } from '@fex/components-core/upload/get-dropped-files'
import { createUploadController } from '@fex/components-core/upload/create-upload-controller'
import type { UploadController, UploadId, UploadItem as UploadItemValue, UploadOptions } from '@fex/components-core/upload/types'
import { uploadDropzoneClassName, uploadItemClassName, uploadListClassName, uploadPreviewClassName, uploadProgressClassName, uploadProgressIndicatorClassName, uploadRootClassName, uploadTriggerClassName } from '@fex/components-styles/upload'
import { cn } from '@fex/utils'
import { createSignal, createUniqueId, onCleanup, Show, splitProps, type JSX, type ParentProps } from 'solid-js'
import { UploadContext, UploadItemContext, useUploadContext, useUploadItemId } from './context'
import { createUploadItem, createUploadPreview } from './create-upload'

export * from './context'
export * from './create-upload'
export type { UploadItemValue }

export interface UploadRootProps<TResponse> extends ParentProps<JSX.HTMLAttributes<HTMLDivElement>> {
  controller?: UploadController<TResponse>
  options?: UploadOptions<TResponse>
  invalid?: boolean
  name?: string
  required?: boolean
}

export function UploadRoot<TResponse>(props: UploadRootProps<TResponse>) {
  const [local, rest] = splitProps(props, ['controller', 'options', 'invalid', 'name', 'required', 'class', 'children'])
  const owned = local.controller ? undefined : createUploadController(local.options ?? {})
  const upload = local.controller ?? owned!
  if (owned) onCleanup(() => owned.destroy())
  const [input, setInput] = createSignal<HTMLInputElement>()
  const inputId = createUniqueId()
  const listId = createUniqueId()
  const directory = () => upload.hasFeature('directory')
  return <UploadContext.Provider value={{ upload, input, setInput, inputId, listId, invalid: () => local.invalid ?? false }}><div {...rest} class={cn(uploadRootClassName(), local.class)} data-disabled={upload.getOptions().disabled || undefined} data-invalid={local.invalid || undefined}>{local.children}<input ref={setInput} id={inputId} class="sr-only" type="file" name={local.name} required={local.required} disabled={upload.getOptions().disabled} accept={upload.getOptions().accept} multiple={directory() || upload.getOptions().multiple} {...(directory() ? { webkitdirectory: '', directory: '' } : {})} onChange={(event) => { const files = [...(event.currentTarget.files ?? [])]; event.currentTarget.value = ''; void upload.addFiles(files) }} /></div></UploadContext.Provider>
}

export interface UploadTriggerProps {
  children(value: { props: UploadTriggerBindings }): JSX.Element
}

export interface UploadTriggerBindings {
  type: 'button'
  disabled: boolean
  'aria-controls': string
  'aria-invalid': boolean | undefined
  class: string
  onClick(): void
}

export function UploadTrigger(props: UploadTriggerProps) {
  const { upload, input, inputId, invalid } = useUploadContext()
  const triggerProps: UploadTriggerBindings = { type: 'button', disabled: upload.getOptions().disabled === true, 'aria-controls': inputId, get 'aria-invalid'() { return invalid() || undefined }, class: uploadTriggerClassName(), onClick: () => { input()?.click() } }
  return props.children({ props: triggerProps })
}

export function UploadDropzone(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  const [local, rest] = splitProps(props, ['class', 'children', 'onDragEnter', 'onDragLeave', 'onDragOver', 'onDrop', 'onPaste'])
  const { upload, invalid } = useUploadContext()
  const drop = upload.getFeature<DropFeatureApi>('drop')
  const paste = upload.getFeature<PasteFeatureApi>('paste')
  const [dragging, setDragging] = createSignal(drop?.getDragging() ?? false)
  const unsubscribe = drop?.subscribe(() => setDragging(drop.getDragging()))
  onCleanup(() => unsubscribe?.())
  return <div {...rest} class={cn(uploadDropzoneClassName(), local.class)} role="button" tabIndex={upload.getOptions().disabled ? undefined : 0} aria-disabled={upload.getOptions().disabled} aria-invalid={invalid()} data-dragging={dragging() || undefined} data-disabled={upload.getOptions().disabled || undefined} data-invalid={invalid() || undefined} onDragEnter={(event) => { drop && event.preventDefault(); drop?.dragEnter() }} onDragOver={(event) => { drop && event.preventDefault() }} onDragLeave={() => drop?.dragLeave()} onDrop={(event) => { if (!drop || !event.dataTransfer) return; event.preventDefault(); void getDroppedFiles(event.dataTransfer).then((files) => drop.drop(files)) }} onPaste={(event) => { const files = [...(event.clipboardData?.files ?? [])]; if (paste && files.length) { event.preventDefault(); void paste.paste(files) } }}>{local.children}</div>
}

export function UploadList<TResponse>(props: Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> & { children(items: readonly UploadItemValue<TResponse>[]): JSX.Element }) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const { upload, listId } = useUploadContext<TResponse>()
  const [items, setItems] = createSignal(upload.getItems())
  const unsubscribe = upload.subscribeItems(() => setItems(() => upload.getItems()))
  onCleanup(unsubscribe)
  return <Show when={items().length}><div {...rest} id={listId} role="list" class={cn(uploadListClassName(), local.class)}>{local.children(items())}</div></Show>
}

export function UploadItem<TResponse>(props: Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> & { id: UploadId, children?: JSX.Element | ((state: ReturnType<typeof createUploadItem<TResponse>>) => JSX.Element) }) {
  const [local, rest] = splitProps(props, ['id', 'class', 'children'])
  const { upload } = useUploadContext<TResponse>()
  const state = createUploadItem(upload, () => local.id)
  return <Show when={state.item()}><UploadItemContext.Provider value={local.id}><div {...rest} role="listitem" class={cn(uploadItemClassName(), local.class)} data-status={state.item()?.status}>{typeof local.children === 'function' ? local.children(state) : local.children}</div></UploadItemContext.Provider></Show>
}

export function UploadItemPreview(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const id = useUploadItemId()
  const { upload } = useUploadContext()
  const item = upload.getItem(id)
  const url = createUploadPreview(() => id)
  return <div {...rest} class={cn(uploadPreviewClassName(), local.class)}>{local.children ?? (url && item?.type?.startsWith('image/') ? <img class="size-full object-cover" src={url} alt="" /> : <span aria-hidden="true">↥</span>)}</div>
}

export function UploadItemProgress(props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, rest] = splitProps(props, ['class'])
  const id = useUploadItemId()
  const { upload } = useUploadContext()
  const item = createUploadItem(upload, () => id).item
  const percent = () => item()?.progress?.percent ?? 0
  return <div {...rest} class={cn(uploadProgressClassName(), local.class)} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percent())}><div class={uploadProgressIndicatorClassName()} style={{ width: `${percent()}%` }} /></div>
}
