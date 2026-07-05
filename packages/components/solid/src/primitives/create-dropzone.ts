import { createDropzoneController } from '@fex/components-core/dropzone/create-dropzone-controller'
import { getFilesFromDataTransfer } from '@fex/components-core/dropzone/files'
import type { DropzoneFileRejection, DropzoneValidationOptions } from '@fex/components-core/dropzone/types'
import { createMemo, createSignal, onCleanup } from 'solid-js'

export interface CreateDropzoneOptions extends DropzoneValidationOptions {
  disabled?: boolean
  onDropFiles?: (files: File[]) => void
  onReject?: (rejections: DropzoneFileRejection[]) => void
}

export function createDropzone(options: CreateDropzoneOptions = {}) {
  let input: HTMLInputElement | null = null
  const controller = createDropzoneController(options)
  const [snapshot, setSnapshot] = createSignal(controller.getSnapshot())
  const unsubscribe = controller.subscribe(() => setSnapshot(controller.getSnapshot()))
  onCleanup(unsubscribe)

  function open() {
    if (!options.disabled) {
      input?.click()
    }
  }

  function onDragEnter(event: DragEvent) {
    if (options.disabled) {
      return
    }
    event.preventDefault()
    controller.dragEnter()
  }

  function onDragOver(event: DragEvent) {
    if (!options.disabled) {
      event.preventDefault()
    }
  }

  function onDragLeave() {
    controller.dragLeave()
  }

  function onDrop(event: DragEvent) {
    if (options.disabled) {
      return
    }
    event.preventDefault()
    controller.drop(getFilesFromDataTransfer(event.dataTransfer))
  }

  function onInputChange(event: Event) {
    const target = event.currentTarget as HTMLInputElement
    controller.drop(Array.from(target.files ?? []))
    target.value = ''
  }

  const rootDataAttributes = createMemo(() => ({
    'data-dragging': snapshot().dragging || undefined,
    'data-accepted': snapshot().accepted || undefined,
    'data-rejected': snapshot().rejected || undefined,
  }))

  return {
    setInput: (element: HTMLInputElement | null) => {
      input = element
    },
    dragging: () => snapshot().dragging,
    accepted: () => snapshot().accepted,
    rejected: () => snapshot().rejected,
    rootDataAttributes,
    inputProps: {
      type: 'file',
      hidden: true,
      accept: Array.isArray(options.accept) ? options.accept.join(',') : options.accept,
      multiple: options.multiple,
      disabled: options.disabled,
      onChange: onInputChange,
    },
    open,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
  }
}
