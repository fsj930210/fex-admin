export const multipartPartSize = 1024 * 1024

export interface MultipartSession {
  uploadId: string
}
export interface PartResponse {
  index: number
  size: number
}
export interface CompleteResponse {
  uploadId: string
  name: string
  size: number
  storedAt: string
  md5?: string
  instant?: boolean
}

export interface UploadCheckResponse {
  exists: boolean
  response?: CompleteResponse
}
