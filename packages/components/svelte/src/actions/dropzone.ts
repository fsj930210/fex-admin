import { createDropzoneController } from '@fex/components-core/dropzone/create-dropzone-controller'
import { getFilesFromDataTransfer } from '@fex/components-core/dropzone/files'
import type { DropzoneFileRejection, DropzoneValidationOptions } from '@fex/components-core/dropzone/types'

export interface DropzoneActionOptions extends DropzoneValidationOptions {
  disabled?: boolean
  input?: HTMLInputElement | null
  onDropFiles?: (files: File[]) => void
  onReject?: (rejections: DropzoneFileRejection[]) => void
}

export function dropzoneAction(node: HTMLElement, options: DropzoneActionOptions = {}) {
  let currentOptions = options
  const controller = createDropzoneController(options)
  const unsubscribe = controller.subscribe(() => {
    const snapshot = controller.getSnapshot()
    node.dataset.dragging = snapshot.dragging ? 'true' : ''
    node.dataset.accepted = snapshot.accepted ? 'true' : ''
    node.dataset.rejected = snapshot.rejected ? 'true' : ''
  })

  function onClick() {
    if (!currentOptions.disabled) {
      currentOptions.input?.click()
    }
  }

  function onDragEnter(event: DragEvent) {
    if (currentOptions.disabled) {
      return
    }
    event.preventDefault()
    controller.dragEnter()
  }

  function onDragOver(event: DragEvent) {
    if (!currentOptions.disabled) {
      event.preventDefault()
    }
  }

  function onDragLeave() {
    controller.dragLeave()
  }

  function onDrop(event: DragEvent) {
    if (currentOptions.disabled) {
      return
    }
    event.preventDefault()
    controller.drop(getFilesFromDataTransfer(event.dataTransfer))
  }

  node.addEventListener('click', onClick)
  node.addEventListener('dragenter', onDragEnter)
  node.addEventListener('dragover', onDragOver)
  node.addEventListener('dragleave', onDragLeave)
  node.addEventListener('drop', onDrop)

  return {
    update(nextOptions: DropzoneActionOptions = {}) {
      currentOptions = nextOptions
      controller.updateOptions(nextOptions)
    },
    destroy() {
      node.removeEventListener('click', onClick)
      node.removeEventListener('dragenter', onDragEnter)
      node.removeEventListener('dragover', onDragOver)
      node.removeEventListener('dragleave', onDragLeave)
      node.removeEventListener('drop', onDrop)
      unsubscribe()
    },
  }
}
