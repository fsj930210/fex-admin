import { createDropzoneController } from '@fex/components-core/dropzone/create-dropzone-controller'
import { getFilesFromDataTransfer } from '@fex/components-core/dropzone/files'
import type { DropzoneFileRejection, DropzoneValidationOptions } from '@fex/components-core/dropzone/types'
import { computed, onBeforeUnmount, shallowRef } from 'vue'

export interface UseDropzoneOptions extends DropzoneValidationOptions {
  disabled?: boolean
  onDropFiles?: (files: File[]) => void
  onReject?: (rejections: DropzoneFileRejection[]) => void
}

export function useDropzone(options: UseDropzoneOptions = {}) {
  const rootRef = shallowRef<HTMLElement | null>(null)
  const inputRef = shallowRef<HTMLInputElement | null>(null)
  const controller = createDropzoneController(options)
  const snapshot = shallowRef(controller.getSnapshot())
  const unsubscribe = controller.subscribe(() => {
    snapshot.value = controller.getSnapshot()
  })

  controller.updateOptions(options)
  onBeforeUnmount(unsubscribe)

  function open() {
    if (!options.disabled) {
      inputRef.value?.click()
    }
  }

  function setRoot(element: HTMLElement | null) {
    if (rootRef.value === element) {
      return
    }

    rootRef.value = element
  }

  function setInput(element: HTMLInputElement | null) {
    if (inputRef.value === element) {
      return
    }

    inputRef.value = element
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
    const input = event.currentTarget as HTMLInputElement
    controller.drop(Array.from(input.files ?? []))
    input.value = ''
  }

  const rootDataAttributes = computed(() => ({
    'data-dragging': snapshot.value.dragging || undefined,
    'data-accepted': snapshot.value.accepted || undefined,
    'data-rejected': snapshot.value.rejected || undefined,
  }))

  const inputAttributes = computed(() => ({
    accept: Array.isArray(options.accept) ? options.accept.join(',') : options.accept,
    multiple: options.multiple,
    disabled: options.disabled,
  }))

  return {
    rootRef,
    inputRef,
    setRoot,
    setInput,
    dragging: computed(() => snapshot.value.dragging),
    accepted: computed(() => snapshot.value.accepted),
    rejected: computed(() => snapshot.value.rejected),
    rootDataAttributes,
    inputAttributes,
    open,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    onInputChange,
  }
}
