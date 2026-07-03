import { matchAccept } from './accept'
import type { DropzoneFileRejection, DropzoneValidationOptions } from './types'

export function validateDropzoneFiles(files: File[], options: DropzoneValidationOptions = {}) {
  const maxCount = options.multiple === false ? 1 : options.maxCount
  const acceptedFiles: File[] = []
  const rejectedFiles: DropzoneFileRejection[] = []

  for (const file of files) {
    if (maxCount !== undefined && acceptedFiles.length >= maxCount) {
      rejectedFiles.push({ file, reason: 'too-many-files' })
      continue
    }

    if (!matchAccept(file, options.accept)) {
      rejectedFiles.push({ file, reason: 'file-invalid-type' })
      continue
    }

    if (options.maxSize !== undefined && file.size > options.maxSize) {
      rejectedFiles.push({ file, reason: 'file-too-large' })
      continue
    }

    acceptedFiles.push(file)
  }

  return { acceptedFiles, rejectedFiles }
}

