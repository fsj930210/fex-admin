import type { DropFeatureApi } from '@fex/components-core/upload/features/drop'
import type { PasteFeatureApi } from '@fex/components-core/upload/features/paste'
import { getDroppedFiles } from '@fex/components-core/upload/get-dropped-files'
import type {
  UploadController,
  UploadId,
  UploadItem as UploadItemValue,
  UploadOptions,
} from '@fex/components-core/upload/types'
import {
  uploadDropzoneClassName,
  uploadItemClassName,
  uploadListClassName,
  uploadPreviewClassName,
  uploadProgressClassName,
  uploadProgressIndicatorClassName,
  uploadRootClassName,
  uploadTriggerClassName,
} from '@fex/components-styles/upload'
import { cn } from '@fex/utils'
import {
  useId,
  useRef,
  useSyncExternalStore,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react'
import useUnmount from '../../hooks/use-unmount'
import { Button } from '../button/button'
import { UploadContext, useUploadContext } from './upload-context'
import { UploadItemContext, useUploadItemId } from './upload-item-context'
import { useUploadDragging, useUploadPreview } from './use-upload-feature'
import { useUploadController } from './use-upload'
import { useUploadItem } from './use-upload-item'

export { useUploadContext } from './upload-context'
export { useUpload, useUploadController } from './use-upload'
export { useUploadItem } from './use-upload-item'
export { useUploadProgress } from './use-upload-progress'
export type { UploadProcessProgress, UseUploadProgressOptions } from './use-upload-progress'
export {
  useUploadFeature,
  useUploadMd5,
  useUploadParts,
  useUploadPreview,
} from './use-upload-feature'
export type { UploadItemValue }

export interface UploadRootProps<TResponse> extends HTMLAttributes<HTMLDivElement> {
  controller?: UploadController<TResponse>
  options?: UploadOptions<TResponse>
  invalid?: boolean
  name?: string
  required?: boolean
}

export function UploadRoot<TResponse>({
  controller: supplied,
  options,
  invalid = false,
  name,
  required,
  className,
  children,
  ...props
}: UploadRootProps<TResponse>) {
  const upload = useUploadController(options, supplied)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const listId = useId()
  useUnmount(() => {
    if (!supplied) upload.destroy()
  })
  const currentOptions = upload.getOptions()
  const directory = upload.hasFeature('directory')
  return (
    <UploadContext value={{ upload, inputRef, inputId, listId, invalid }}>
      <div
        {...props}
        className={cn(uploadRootClassName(), className)}
        data-disabled={currentOptions.disabled || undefined}
        data-invalid={invalid || undefined}
      >
        {children}
        <input
          {...(directory ? { webkitdirectory: '', directory: '' } : {})}
          ref={inputRef}
          id={inputId}
          className="sr-only"
          type="file"
          name={name}
          required={required}
          disabled={currentOptions.disabled}
          accept={currentOptions.accept}
          multiple={directory || currentOptions.multiple}
          onChange={(event) => {
            const files = [...(event.currentTarget.files ?? [])]
            event.currentTarget.value = ''
            void upload.addFiles(files)
          }}
        />
      </div>
    </UploadContext>
  )
}

export interface UploadTriggerRenderProps {
  props: ButtonHTMLAttributes<HTMLButtonElement>
  ref?: Ref<HTMLButtonElement> | undefined
}
export function UploadTrigger({
  children,
}: {
  children?: ReactNode | ((value: UploadTriggerRenderProps) => ReactNode)
}) {
  const { upload, inputRef, inputId, invalid } = useUploadContext()
  const disabled = upload.getOptions().disabled
  const triggerProps: ButtonHTMLAttributes<HTMLButtonElement> = {
    type: 'button',
    disabled,
    'aria-controls': inputId,
    'aria-invalid': invalid || undefined,
    className: uploadTriggerClassName(),
    onClick: () => inputRef.current?.click(),
  }
  if (typeof children === 'function') return children({ props: triggerProps, ref: undefined })
  return <Button {...triggerProps}>{children}</Button>
}

export function UploadDropzone({
  className,
  children,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onPaste,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { upload, invalid } = useUploadContext()
  const drop = upload.getFeature<DropFeatureApi>('drop')
  const paste = upload.getFeature<PasteFeatureApi>('paste')
  const dragging = useUploadDragging()
  const disabled = upload.getOptions().disabled
  return (
    <div
      {...props}
      className={cn(uploadDropzoneClassName(), className)}
      role="button"
      tabIndex={disabled ? undefined : 0}
      aria-disabled={disabled}
      aria-invalid={invalid}
      data-dragging={dragging || undefined}
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
      onDragEnter={(event) => {
        onDragEnter?.(event)
        if (!event.defaultPrevented && drop) {
          event.preventDefault()
          drop.dragEnter()
        }
      }}
      onDragOver={(event) => {
        onDragOver?.(event)
        if (!event.defaultPrevented && drop) event.preventDefault()
      }}
      onDragLeave={(event) => {
        onDragLeave?.(event)
        if (!event.defaultPrevented) drop?.dragLeave()
      }}
      onDrop={(event) => {
        onDrop?.(event)
        if (!event.defaultPrevented && drop) {
          event.preventDefault()
          void getDroppedFiles(event.dataTransfer).then((files) => drop.drop(files))
        }
      }}
      onPaste={(event) => {
        onPaste?.(event)
        if (!event.defaultPrevented && paste) {
          const files = [...event.clipboardData.files]
          if (files.length) {
            event.preventDefault()
            void paste.paste(files)
          }
        }
      }}
    >
      {children}
    </div>
  )
}

export function UploadList<TResponse>({
  children,
  className,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: (items: readonly UploadItemValue<TResponse>[]) => ReactNode
}) {
  const { upload, listId } = useUploadContext<TResponse>()
  const items = useSyncExternalStore(upload.subscribeItems, upload.getItems, upload.getItems)
  if (!items.length) return null
  return (
    <div {...props} id={listId} role="list" className={cn(uploadListClassName(), className)}>
      {children(items)}
    </div>
  )
}

export function UploadItem<TResponse>({
  id,
  children,
  className,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  id: UploadId
  children?: ReactNode | ((state: ReturnType<typeof useUploadItem<TResponse>>) => ReactNode)
}) {
  const { upload } = useUploadContext<TResponse>()
  const state = useUploadItem(upload, id)
  if (!state.item) return null
  return (
    <UploadItemContext value={id}>
      <div
        {...props}
        role="listitem"
        className={cn(uploadItemClassName(), className)}
        data-status={state.item.status}
      >
        {typeof children === 'function' ? children(state) : children}
      </div>
    </UploadItemContext>
  )
}

export function UploadItemPreview({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const id = useUploadItemId()
  const { upload } = useUploadContext()
  const item = upload.getItem(id)
  const url = useUploadPreview(id)
  return (
    <div {...props} className={cn(uploadPreviewClassName(), className)}>
      {children ??
        (url && item?.type?.startsWith('image/') ? (
          <img className="size-full object-cover" src={url} alt="" />
        ) : (
          <span aria-hidden>↥</span>
        ))}
    </div>
  )
}
export function UploadItemProgress({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const id = useUploadItemId()
  const { upload } = useUploadContext()
  const item = useUploadItem(upload, id).item
  const percent = item?.progress?.percent ?? 0
  return (
    <div
      {...props}
      className={cn(uploadProgressClassName(), className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
    >
      <div className={uploadProgressIndicatorClassName()} style={{ width: `${percent}%` }} />
    </div>
  )
}
