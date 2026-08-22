import type { UploadProgress } from '@fex-design/core/upload/types'

export const uploadServerUrl = '/upload-api'

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export class ApiError extends Error {
  constructor(
    public readonly code: number,
    message: string,
    public readonly data: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function parseResponse<T>(text: string): ApiResponse<T> {
  const value: unknown = JSON.parse(text)
  if (
    typeof value !== 'object' ||
    value === null ||
    !('code' in value) ||
    !('message' in value) ||
    !('data' in value)
  )
    throw new Error('上传服务返回了无效的响应格式。')
  return value as ApiResponse<T>
}

function unwrapResponse<T>(response: ApiResponse<T>, httpStatus: number) {
  if (httpStatus >= 200 && httpStatus < 300 && response.code >= 200 && response.code < 300)
    return response.data
  throw new ApiError(response.code, response.message, response.data)
}

export function uploadBody<TResponse>(
  url: string,
  body: Blob,
  options: {
    method?: string
    fileName?: string
    signal: AbortSignal
    onProgress(progress: UploadProgress): void
  },
) {
  return new Promise<TResponse>((resolve, reject) => {
    const request = new XMLHttpRequest()
    let settled = false
    const abort = () => request.abort()
    const finish = (callback: () => void) => {
      if (settled) return
      settled = true
      options.signal.removeEventListener('abort', abort)
      callback()
    }
    request.open(options.method ?? 'POST', url)
    if (options.fileName)
      request.setRequestHeader('x-file-name', encodeURIComponent(options.fileName))
    request.upload.onprogress = (event) =>
      options.onProgress({
        loaded: event.loaded,
        total: event.lengthComputable ? event.total : body.size,
      })
    request.onload = () =>
      finish(() => {
        try {
          resolve(unwrapResponse(parseResponse<TResponse>(request.responseText), request.status))
        } catch (error) {
          reject(error)
        }
      })
    request.onerror = () =>
      finish(() => reject(new Error('上传请求失败，请确认上传服务是否已启动。')))
    request.onabort = () =>
      finish(() => reject(options.signal.reason ?? new DOMException('上传已取消。', 'AbortError')))
    if (options.signal.aborted) {
      finish(() => reject(options.signal.reason ?? new DOMException('上传已取消。', 'AbortError')))
      return
    }
    options.signal.addEventListener('abort', abort, { once: true })
    request.send(body)
  })
}

async function requestJson<TResponse>(url: string, init?: RequestInit) {
  const response = await fetch(url, init)
  return unwrapResponse(parseResponse<TResponse>(await response.text()), response.status)
}

export function postJson<TResponse>(url: string, body: unknown) {
  return requestJson<TResponse>(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function getJson<TResponse>(url: string) {
  return requestJson<TResponse>(url)
}
