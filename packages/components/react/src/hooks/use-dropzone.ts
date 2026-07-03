import { createDropzoneController } from '@fex/components-core/dropzone/create-dropzone-controller'
import { getFilesFromDataTransfer } from '@fex/components-core/dropzone/files'
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import type { ChangeEvent, DragEvent, HTMLAttributes, InputHTMLAttributes, RefCallback } from 'react'
import type { DropzoneFileRejection, DropzoneValidationOptions } from '@fex/components-core/dropzone/types'
import { useMemoizedFn } from './use-memoized-fn'

export interface UseDropzoneOptions extends DropzoneValidationOptions {
  disabled?: boolean
  onDropFiles?: (files: File[]) => void
  onReject?: (rejections: DropzoneFileRejection[]) => void
}

export function useDropzone(options: UseDropzoneOptions = {}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null)
  const controller = useMemo(() => createDropzoneController(options), [])
  const snapshot = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  )

  useEffect(() => {
    controller.updateOptions(options)
  }, [controller, options])

  const onDragEnter = useMemoizedFn((event: DragEvent<HTMLElement>) => {
    if (options.disabled) {
      return
    }

    event.preventDefault()
    controller.dragEnter()
  })

  const onDragOver = useMemoizedFn((event: DragEvent<HTMLElement>) => {
    if (!options.disabled) {
      event.preventDefault()
    }
  })

  const onDragLeave = useMemoizedFn(() => {
    controller.dragLeave()
  })

  const onDrop = useMemoizedFn((event: DragEvent<HTMLElement>) => {
    if (options.disabled) {
      return
    }

    event.preventDefault()
    controller.drop(getFilesFromDataTransfer(event.dataTransfer))
  })

  const onInputChange = useMemoizedFn((event: ChangeEvent<HTMLInputElement>) => {
    controller.drop(Array.from(event.target.files ?? []))
    event.target.value = ''
  })

  const getRootProps = useMemoizedFn(
    (): HTMLAttributes<HTMLElement> & { ref: RefCallback<HTMLElement> } => ({
      ref: setRootElement,
      onClick: () => {
        if (!options.disabled) {
          inputRef.current?.click()
        }
      },
      onDragEnter,
      onDragOver,
      onDragLeave,
      onDrop,
      'data-dragging': snapshot.dragging || undefined,
      'data-accepted': snapshot.accepted || undefined,
      'data-rejected': snapshot.rejected || undefined,
    }),
  )

  const getInputProps = useMemoizedFn(
    (): InputHTMLAttributes<HTMLInputElement> & { ref: RefCallback<HTMLInputElement> } => ({
      ref: (element) => {
        inputRef.current = element
      },
      type: 'file',
      hidden: true,
      accept: Array.isArray(options.accept) ? options.accept.join(',') : options.accept,
      multiple: options.multiple,
      disabled: options.disabled,
      onChange: onInputChange,
    }),
  )

  return {
    rootElement,
    dragging: snapshot.dragging,
    accepted: snapshot.accepted,
    rejected: snapshot.rejected,
    getRootProps,
    getInputProps,
  }
}
