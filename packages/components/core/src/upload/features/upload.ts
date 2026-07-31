import type { UploadFeatureRegistration } from '../feature-types'
import type { UploadFeatureApi, UploadId, UploadItem, UploadProgress } from '../types'

export interface UploadRequestContext<TResponse> {
  item: UploadItem<TResponse>
  file: File
  signal: AbortSignal
  onProgress(progress: UploadProgress): void
}

export interface UploadFeatureOptions<TResponse> {
  request(context: UploadRequestContext<TResponse>): Promise<TResponse>
}

export function uploadFeature<TResponse>(
  options: UploadFeatureOptions<TResponse>,
): UploadFeatureRegistration<TResponse> {
  return {
    options,
    feature: {
      id: 'upload',
      setup(context, featureOptions) {
        const current = featureOptions as UploadFeatureOptions<TResponse>
        const requests = new Map<UploadId, AbortController>()

        const start = async (id: UploadId) => {
          const item = context.getItem(id)
          if (!item?.file || item.status === 'uploading') return
          const abortController = new AbortController()
          requests.set(id, abortController)
          context.updateItem(id, {
            status: 'uploading',
            progress: { loaded: 0, total: item.file.size, percent: 0 },
            error: undefined,
            errorStage: undefined,
          })
          try {
            const response = await current.request({
              item,
              file: item.file,
              signal: abortController.signal,
              onProgress(progress) {
                const total = progress.total ?? item.file?.size
                context.updateItem(id, {
                  progress: {
                    ...progress,
                    total,
                    percent: total ? Math.min(100, (progress.loaded / total) * 100) : undefined,
                  },
                })
              },
            })
            if (abortController.signal.aborted)
              throw abortController.signal.reason ?? new Error('Upload aborted.')
            const next = context.updateItem(id, {
              status: 'success',
              progress: { loaded: item.file.size, total: item.file.size, percent: 100 },
              response,
              error: undefined,
            })
            if (next) context.getOptions().onSuccess?.(next, response)
          } catch (error) {
            if (abortController.signal.aborted)
              context.updateItem(id, { status: 'pending', progress: undefined })
            else {
              const next = context.updateItem(id, { status: 'error', error, errorStage: 'upload' })
              if (next) context.getOptions().onError?.(next, error)
            }
          } finally {
            requests.delete(id)
          }
        }

        const api: UploadFeatureApi = {
          start,
          async startAll() {
            await Promise.all(
              context
                .getItems()
                .filter((item) => item.file && item.status !== 'success')
                .map((item) => start(item.id)),
            )
          },
          retry: start,
          cancel(id) {
            requests.get(id)?.abort()
            requests.delete(id)
          },
        }
        context.onRemove((id) => api.cancel(id))
        context.onDestroy(() => {
          for (const request of requests.values()) request.abort()
        })
        return api
      },
    },
  }
}
