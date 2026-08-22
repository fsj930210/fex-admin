import {
  fileMd5Feature,
  type FileMd5FeatureApi,
} from '@fex-design/core/upload/features/file-md5'
import { multipartFeature } from '@fex-design/core/upload/features/multipart'
import { useUpload } from '@fex-design/vue/primitive/upload'
import { getJson, postJson, uploadBody, uploadServerUrl } from './api'
import {
  multipartPartSize,
  type CompleteResponse,
  type MultipartSession,
  type PartResponse,
  type UploadCheckResponse,
} from './multipart-types'

export type MultipartDemoMode = 'basic' | 'resume' | 'retry' | 'instant'

export function createMultipartUpload(mode: MultipartDemoMode) {
  const sessions = new Map<string, MultipartSession>()
  const md5ById = new Map<string, string>()
  const failedOnce = new Set<string>()
  return useUpload<CompleteResponse>({
    features: [
      fileMd5Feature({ chunkSize: multipartPartSize }),
      multipartFeature<PartResponse, CompleteResponse>({
        partSize: multipartPartSize,
        async resolveUploadPlan({ item, parts, getFeature }) {
          const md5 = await getFeature<FileMd5FeatureApi>('file-md5')?.calculate(item.id)
          if (!md5 && mode !== 'basic' && mode !== 'retry') throw new Error('无法计算文件 MD5。')
          if (md5) md5ById.set(item.id, md5)
          if (mode === 'instant' && md5) {
            const checked = await getJson<UploadCheckResponse>(
              `${uploadServerUrl}/multipart/check?md5=${md5}`,
            )
            if (checked.exists && checked.response)
              return { batches: [], complete: { response: checked.response } }
          }
          if (mode === 'resume' && md5) {
            const storageKey = `fex-upload-resume:${md5}`
            let uploadId = localStorage.getItem(storageKey)
            if (!uploadId) {
              uploadId = (
                await postJson<MultipartSession>(`${uploadServerUrl}/multipart/init`, {
                  name: item.name,
                  size: item.size,
                  md5,
                })
              ).uploadId
              localStorage.setItem(storageKey, uploadId)
            }
            sessions.set(item.id, { uploadId })
            const status = await getJson<{ completedIndexes: number[] }>(
              `${uploadServerUrl}/multipart/${uploadId}/parts`,
            )
            const completedIndexes = new Set(status.completedIndexes)
            return {
              completed: status.completedIndexes.map((index) => ({ index })),
              batches: parts
                .filter((part) => !completedIndexes.has(part.index))
                .map((part) => [part.index]),
            }
          }
          const session =
            sessions.get(item.id) ??
            (await postJson<MultipartSession>(`${uploadServerUrl}/multipart/init`, {
              name: item.name,
              size: item.size,
              md5,
            }))
          sessions.set(item.id, session)
          if (mode === 'basic') return { batches: [parts.map((part) => part.index)] }
          return {
            batches: parts.filter((part) => part.status !== 'success').map((part) => [part.index]),
          }
        },
        uploadPart({ item, part, blob, signal, onProgress }) {
          const session = sessions.get(item.id)
          if (!session) throw new Error('上传会话不存在。')
          const failureKey = `${item.id}:${part.index}`
          if (mode === 'retry' && part.index === 1 && !failedOnce.has(failureKey)) {
            failedOnce.add(failureKey)
            throw new Error('演示：第 2 个分片首次上传失败。')
          }
          return uploadBody(
            `${uploadServerUrl}/multipart/${session.uploadId}/parts/${part.index + 1}`,
            blob,
            { method: 'PUT', signal, onProgress },
          )
        },
        async complete({ item, parts }) {
          const session = sessions.get(item.id)
          const md5 = md5ById.get(item.id)
          if (!session) throw new Error('上传会话不存在。')
          const response = await postJson<CompleteResponse>(
            `${uploadServerUrl}/multipart/${session.uploadId}/complete`,
            { name: item.name, partCount: parts.length, md5 },
          )
          if (mode === 'resume' && md5) localStorage.removeItem(`fex-upload-resume:${md5}`)
          return response
        },
      }),
    ],
  })
}
