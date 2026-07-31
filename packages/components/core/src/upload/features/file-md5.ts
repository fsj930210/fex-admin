import type { UploadFeatureRegistration } from '../feature-types'
import type { UploadId } from '../types'

export interface FileMd5State {
  status: 'idle' | 'calculating' | 'success' | 'error'
  value?: string
  progress: number
  error?: unknown
}
export interface FileMd5FeatureOptions {
  chunkSize?: number
  createWorker?: () => Worker
}
export interface FileMd5FeatureApi {
  calculate(id: UploadId): Promise<string>
  getState(id: UploadId): FileMd5State
  cancel(id: UploadId): void
}

const idleMd5State: FileMd5State = { status: 'idle', progress: 0 }

export function fileMd5Feature<TResponse = unknown>(
  options: FileMd5FeatureOptions = {},
): UploadFeatureRegistration<TResponse> {
  if (
    options.chunkSize !== undefined &&
    (!Number.isFinite(options.chunkSize) || options.chunkSize <= 0)
  )
    throw new Error('File MD5 chunkSize must be greater than zero.')
  return {
    options,
    feature: {
      id: 'file-md5',
      setup(context, featureOptions) {
        const current = featureOptions as FileMd5FeatureOptions
        const states = new Map<UploadId, FileMd5State>()
        const workers = new Map<UploadId, Worker>()
        const getState = (id: UploadId) => states.get(id) ?? idleMd5State
        const setState = (id: UploadId, state: FileMd5State) => {
          states.set(id, state)
          context.notifyFeatureItem('file-md5', id)
        }
        const cancel = (id: UploadId) => {
          workers.get(id)?.terminate()
          workers.delete(id)
          if (states.get(id)?.status === 'calculating')
            setState(id, { status: 'idle', progress: 0 })
        }
        const api: FileMd5FeatureApi = {
          async calculate(id) {
            const cached = states.get(id)
            if (cached?.value) return cached.value
            const file = context.getItem(id)?.file
            if (!file) throw new Error('Upload item has no local file.')
            cancel(id)
            setState(id, { status: 'calculating', progress: 0 })
            const worker =
              current.createWorker?.() ??
              new Worker(new URL('./file-md5-worker.ts', import.meta.url), { type: 'module' })
            workers.set(id, worker)
            return new Promise<string>((resolve, reject) => {
              worker.addEventListener(
                'message',
                (
                  event: MessageEvent<{
                    type: string
                    value?: string
                    loaded?: number
                    total?: number
                    error?: string
                  }>,
                ) => {
                  const message = event.data
                  if (message.type === 'progress')
                    setState(id, {
                      status: 'calculating',
                      progress: message.total ? ((message.loaded ?? 0) / message.total) * 100 : 0,
                    })
                  if (message.type === 'success' && message.value) {
                    setState(id, { status: 'success', progress: 100, value: message.value })
                    worker.terminate()
                    workers.delete(id)
                    resolve(message.value)
                  }
                  if (message.type === 'error') {
                    const error = new Error(message.error)
                    setState(id, { status: 'error', progress: 0, error })
                    worker.terminate()
                    workers.delete(id)
                    reject(error)
                  }
                },
              )
              worker.addEventListener('error', (event: ErrorEvent) => {
                const error = event.error ?? new Error(event.message || 'MD5 Worker failed.')
                setState(id, { status: 'error', progress: 0, error })
                worker.terminate()
                workers.delete(id)
                reject(error)
              })
              // oxlint-disable-next-line unicorn/require-post-message-target-origin -- Worker postMessage has no target origin.
              worker.postMessage({ id, file, chunkSize: current.chunkSize })
            })
          },
          getState,
          cancel,
        }
        context.onRemove((id) => {
          cancel(id)
          states.delete(id)
        })
        context.onDestroy(() => {
          for (const id of workers.keys()) cancel(id)
        })
        return api
      },
    },
  }
}
