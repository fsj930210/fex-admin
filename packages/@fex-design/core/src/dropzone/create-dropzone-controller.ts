import { validateDropzoneFiles } from './validate'
import type { DropzoneFileRejection, DropzoneValidationOptions } from './types'

export interface DropzoneControllerOptions extends DropzoneValidationOptions {
  disabled?: boolean
  onDropFiles?: (files: File[]) => void
  onReject?: (rejections: DropzoneFileRejection[]) => void
}

export interface DropzoneControllerSnapshot {
  dragging: boolean
  accepted: boolean
  rejected: boolean
}

type Listener = () => void

export function createDropzoneController(options: DropzoneControllerOptions = {}) {
  let currentOptions = options
  let dragDepth = 0
  let snapshot: DropzoneControllerSnapshot = {
    dragging: false,
    accepted: false,
    rejected: false,
  }

  const listeners = new Set<Listener>()

  function getSnapshot() {
    return snapshot
  }

  function subscribe(listener: Listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  function setSnapshot(next: Partial<DropzoneControllerSnapshot>) {
    snapshot = { ...snapshot, ...next }
    for (const listener of listeners) {
      listener()
    }
  }

  function updateOptions(next: DropzoneControllerOptions) {
    currentOptions = next
  }

  function dragEnter() {
    if (currentOptions.disabled) {
      return
    }

    dragDepth += 1
    setSnapshot({ dragging: true })
  }

  function dragLeave() {
    dragDepth = Math.max(0, dragDepth - 1)
    if (dragDepth === 0) {
      setSnapshot({ dragging: false })
    }
  }

  function drop(files: File[]) {
    if (currentOptions.disabled) {
      return
    }

    dragDepth = 0
    const result = validateDropzoneFiles(files, currentOptions)
    setSnapshot({
      dragging: false,
      accepted: result.acceptedFiles.length > 0,
      rejected: result.rejectedFiles.length > 0,
    })

    if (result.acceptedFiles.length > 0) {
      currentOptions.onDropFiles?.(result.acceptedFiles)
    }
    if (result.rejectedFiles.length > 0) {
      currentOptions.onReject?.(result.rejectedFiles)
    }
  }

  function reset() {
    dragDepth = 0
    setSnapshot({ dragging: false, accepted: false, rejected: false })
  }

  return {
    getSnapshot,
    subscribe,
    updateOptions,
    dragEnter,
    dragLeave,
    drop,
    reset,
  }
}
