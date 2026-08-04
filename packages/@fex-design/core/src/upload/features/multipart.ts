import type { UploadFeatureRegistration } from '../feature-types'
import type { UploadFeatureApi, UploadId, UploadItem, UploadProgress } from '../types'

export type UploadPartStatus = 'pending' | 'uploading' | 'success' | 'error'
export interface UploadPart<TResponse = unknown> {
  index: number
  start: number
  end: number
  size: number
  status: UploadPartStatus
  progress?: UploadProgress
  response?: TResponse
  error?: unknown
}
export interface UploadPartPlan<TPartResponse = unknown, TResponse = unknown> {
  completed?: readonly { index: number; response?: TPartResponse }[]
  batches: readonly (readonly number[])[]
  complete?: { response: TResponse }
}
export interface ResolveUploadPlanContext<TPartResponse, TResponse> {
  item: UploadItem<TResponse>
  parts: readonly UploadPart<TPartResponse>[]
  reason: 'start' | 'continue' | 'retry'
  getFeature<TApi>(id: string): TApi | undefined
}
export interface MultipartFeatureOptions<TPartResponse, TResponse> {
  partSize: number
  resolveUploadPlan?(
    context: ResolveUploadPlanContext<TPartResponse, TResponse>,
  ): UploadPartPlan<TPartResponse, TResponse> | Promise<UploadPartPlan<TPartResponse, TResponse>>
  uploadPart(context: {
    item: UploadItem<TResponse>
    part: UploadPart<TPartResponse>
    blob: Blob
    signal: AbortSignal
    onProgress(progress: UploadProgress): void
  }): Promise<TPartResponse>
  complete?(context: {
    item: UploadItem<TResponse>
    parts: readonly UploadPart<TPartResponse>[]
  }): Promise<TResponse>
}
export interface MultipartFeatureApi<TPartResponse = unknown> extends UploadFeatureApi {
  pause(id: UploadId): void
  continue(id: UploadId): Promise<void>
  getParts(id: UploadId): readonly UploadPart<TPartResponse>[]
}

export function multipartFeature<TPartResponse = unknown, TResponse = unknown>(
  options: MultipartFeatureOptions<TPartResponse, TResponse>,
): UploadFeatureRegistration<TResponse> {
  if (!Number.isFinite(options.partSize) || options.partSize <= 0)
    throw new Error('Multipart partSize must be greater than zero.')
  return {
    options,
    feature: {
      id: 'upload',
      setup(context, featureOptions) {
        const current = featureOptions as MultipartFeatureOptions<TPartResponse, TResponse>
        const partsById = new Map<UploadId, UploadPart<TPartResponse>[]>()
        const emptyParts: readonly UploadPart<TPartResponse>[] = []
        const requests = new Map<UploadId, Map<number, AbortController>>()
        const paused = new Set<UploadId>()
        const generations = new Map<UploadId, number>()

        const ensureParts = (item: UploadItem<TResponse>) => {
          const existing = partsById.get(item.id)
          if (existing) return existing
          if (!item.file) return []
          const parts: UploadPart<TPartResponse>[] = []
          for (
            let start = 0, index = 0;
            start < item.file.size;
            start += current.partSize, index++
          ) {
            const end = Math.min(start + current.partSize, item.file.size)
            parts.push({ index, start, end, size: end - start, status: 'pending' })
          }
          partsById.set(item.id, parts)
          return parts
        }
        const notify = (id: UploadId) => {
          const parts = partsById.get(id)
          if (parts) partsById.set(id, [...parts])
          context.notifyFeatureItem('upload', id)
        }
        const updateOverallProgress = (id: UploadId) => {
          const item = context.getItem(id)
          const parts = partsById.get(id)
          if (!item || !parts) return
          const loaded = parts.reduce(
            (sum, part) =>
              sum + (part.status === 'success' ? part.size : (part.progress?.loaded ?? 0)),
            0,
          )
          context.updateItem(id, {
            progress: {
              loaded,
              total: item.size,
              percent: item.size ? (loaded / item.size) * 100 : 100,
            },
          })
        }
        const executePart = async (
          item: UploadItem<TResponse>,
          part: UploadPart<TPartResponse>,
        ) => {
          if (!item.file || paused.has(item.id)) return
          const controller = new AbortController()
          const byPart = requests.get(item.id) ?? new Map()
          byPart.set(part.index, controller)
          requests.set(item.id, byPart)
          Object.assign(part, {
            status: 'uploading',
            error: undefined,
            progress: { loaded: 0, total: part.size, percent: 0 },
          })
          notify(item.id)
          try {
            const response = await current.uploadPart({
              item,
              part,
              blob: item.file.slice(part.start, part.end),
              signal: controller.signal,
              onProgress(progress) {
                if (byPart.get(part.index) !== controller) return
                const total = progress.total ?? part.size
                part.progress = {
                  ...progress,
                  total,
                  percent: total ? (progress.loaded / total) * 100 : undefined,
                }
                notify(item.id)
                updateOverallProgress(item.id)
              },
            })
            if (controller.signal.aborted)
              throw controller.signal.reason ?? new Error('Upload aborted.')
            if (byPart.get(part.index) !== controller) return
            Object.assign(part, {
              status: 'success',
              response,
              progress: { loaded: part.size, total: part.size, percent: 100 },
            })
            notify(item.id)
            updateOverallProgress(item.id)
          } catch (error) {
            if (byPart.get(part.index) === controller) {
              Object.assign(
                part,
                controller.signal.aborted
                  ? { status: 'pending', progress: undefined }
                  : { status: 'error', error },
              )
              notify(item.id)
            }
          } finally {
            if (byPart.get(part.index) === controller) byPart.delete(part.index)
          }
        }
        const run = async (
          id: UploadId,
          reason: ResolveUploadPlanContext<TPartResponse, TResponse>['reason'],
        ) => {
          const item = context.getItem(id)
          if (!item?.file) return
          const generation = (generations.get(id) ?? 0) + 1
          generations.set(id, generation)
          paused.delete(id)
          const parts = ensureParts(item)
          context.updateItem(id, {
            status: 'processing',
            progress: { loaded: 0, total: item.file.size, percent: 0 },
            error: undefined,
            errorStage: undefined,
          })
          try {
            const plan = (await current.resolveUploadPlan?.({
              item,
              parts,
              reason,
              getFeature: context.getFeature,
            })) ?? {
              batches: parts
                .filter((part) => part.status !== 'success')
                .map((part) => [part.index]),
            }
            if (generations.get(id) !== generation) return
            if (plan.complete) {
              for (const part of parts)
                Object.assign(part, {
                  status: 'success',
                  progress: { loaded: part.size, total: part.size, percent: 100 },
                })
              notify(id)
              const next = context.updateItem(id, {
                status: 'success',
                response: plan.complete.response,
                error: undefined,
                progress: { loaded: item.file.size, total: item.file.size, percent: 100 },
              })
              if (next) context.getOptions().onSuccess?.(next, plan.complete.response)
              return
            }
            context.updateItem(id, { status: 'uploading' })
            for (const restored of plan.completed ?? []) {
              const part = parts[restored.index]
              if (part)
                Object.assign(part, {
                  status: 'success',
                  response: restored.response,
                  progress: { loaded: part.size, total: part.size, percent: 100 },
                })
            }
            notify(id)
            updateOverallProgress(id)
            for (const batch of plan.batches) {
              if (paused.has(id) || generations.get(id) !== generation) return
              await Promise.allSettled(
                batch
                  .map((index) => parts[index])
                  .filter((part): part is UploadPart<TPartResponse> => part !== undefined)
                  .filter((part) => part.status !== 'success')
                  .map((part) => executePart(item, part)),
              )
              if (generations.get(id) !== generation) return
              if (parts.some((part) => part.status === 'error')) break
            }
            if (paused.has(id) || generations.get(id) !== generation) return
            const incomplete = parts.filter((part) => part.status !== 'success')
            if (incomplete.length) {
              const errors = incomplete
                .filter((part) => part.status === 'error')
                .map((part) => part.error)
              if (errors.length === 1) throw errors[0]
              if (errors.length > 1) throw errors
              throw new Error('Multipart upload did not complete all parts.')
            }
            const response = current.complete
              ? await current.complete({ item, parts })
              : (parts.map((part) => part.response) as TResponse)
            const next = context.updateItem(id, {
              status: 'success',
              response,
              error: undefined,
              progress: { loaded: item.file.size, total: item.file.size, percent: 100 },
            })
            if (next) context.getOptions().onSuccess?.(next, response)
          } catch (error) {
            if (generations.get(id) !== generation) return
            const next = context.updateItem(id, { status: 'error', error, errorStage: 'upload' })
            if (next) context.getOptions().onError?.(next, error)
          }
        }
        const cancel = (id: UploadId) => {
          const active = requests.get(id)
          for (const request of active?.values() ?? []) request.abort()
          active?.clear()
          requests.delete(id)
        }
        const api: MultipartFeatureApi<TPartResponse> = {
          start: (id) => run(id, 'start'),
          async startAll() {
            await Promise.all(
              context
                .getItems()
                .filter((item) => item.file && item.status !== 'success')
                .map((item) => run(item.id, 'start')),
            )
          },
          retry: (id) => run(id, 'retry'),
          cancel(id) {
            generations.set(id, (generations.get(id) ?? 0) + 1)
            cancel(id)
          },
          pause(id) {
            generations.set(id, (generations.get(id) ?? 0) + 1)
            paused.add(id)
            cancel(id)
            context.updateItem(id, { status: 'paused' })
          },
          continue: (id) => run(id, 'continue'),
          getParts(id) {
            return partsById.get(id) ?? emptyParts
          },
        }
        context.onRemove((id) => {
          api.cancel(id)
          partsById.delete(id)
          generations.delete(id)
        })
        context.onDestroy(() => {
          for (const id of requests.keys()) cancel(id)
        })
        return api
      },
    },
  }
}
