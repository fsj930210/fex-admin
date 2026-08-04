import type { UploadProgress } from '@fex-design/core/upload/types'

export const uploadServerUrl = '/upload-api'

function unwrap<T>(response: Response, value: { code: number; message: string; data: T }) {
  if (response.ok && value.code >= 200 && value.code < 300) return value.data
  throw new Error(value.message)
}

async function requestJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, init)
  return unwrap(
    response,
    JSON.parse(await response.text()) as { code: number; message: string; data: T },
  )
}

export const getJson = <T>(url: string) => requestJson<T>(url)
export const postJson = <T>(url: string, body: unknown) =>
  requestJson<T>(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

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
    const abort = () => request.abort()
    request.open(options.method ?? 'POST', url)
    if (options.fileName)
      request.setRequestHeader('x-file-name', encodeURIComponent(options.fileName))
    request.upload.onprogress = (event) =>
      options.onProgress({
        loaded: event.loaded,
        total: event.lengthComputable ? event.total : body.size,
      })
    request.onload = () => {
      options.signal.removeEventListener('abort', abort)
      try {
        const response = JSON.parse(request.responseText) as {
          code: number
          message: string
          data: TResponse
        }
        if (
          request.status >= 200 &&
          request.status < 300 &&
          response.code >= 200 &&
          response.code < 300
        )
          resolve(response.data)
        else reject(new Error(response.message))
      } catch (error) {
        reject(error)
      }
    }
    request.onerror = () => reject(new Error('上传请求失败，请确认上传服务是否已启动。'))
    request.onabort = () =>
      reject(options.signal.reason ?? new DOMException('上传已取消。', 'AbortError'))
    options.signal.addEventListener('abort', abort, { once: true })
    request.send(body)
  })
}
