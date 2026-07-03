export interface DropzoneFileRejection {
  file: File
  reason: 'file-invalid-type' | 'file-too-large' | 'too-many-files'
}

export interface DropzoneValidationOptions {
  accept?: string | string[]
  maxSize?: number
  maxCount?: number
  multiple?: boolean
}

