import {
  fileMd5Feature,
  type FileMd5FeatureApi,
} from '@fex/components-core/upload/features/file-md5'
import { multipartFeature } from '@fex/components-core/upload/features/multipart'
import { UploadRoot, UploadTrigger, useUpload } from '@fex/components-react/primitive/upload'
import { useLazyRef } from '@fex/components-react/hooks/use-lazy-ref'
import { Button } from '@fex/components-react/ui/button'
import { postJson, uploadBody, uploadServerUrl } from './api'
import { DemoUploadList } from './demo-list'
import { UploadDemoSection } from './demo-section'
import {
  multipartPartSize,
  type CompleteResponse,
  type MultipartSession,
  type PartResponse,
} from './multipart-types'

export function RetryUploadDemo() {
  const sessions = useLazyRef(() => new Map<string, MultipartSession>()).current
  const md5ById = useLazyRef(() => new Map<string, string>()).current
  const failedOnce = useLazyRef(() => new Set<string>()).current
  const upload = useUpload<CompleteResponse>({
    features: [
      fileMd5Feature({ chunkSize: multipartPartSize }),
      multipartFeature<PartResponse, CompleteResponse>({
        partSize: multipartPartSize,
        async resolveUploadPlan({ item, parts, getFeature }) {
          const md5 = await getFeature<FileMd5FeatureApi>('file-md5')?.calculate(item.id)
          if (md5) md5ById.set(item.id, md5)
          const session =
            sessions.get(item.id) ??
            (await postJson<MultipartSession>(`${uploadServerUrl}/multipart/init`, {
              name: item.name,
              size: item.size,
              md5,
            }))
          sessions.set(item.id, session)
          return {
            batches: parts.filter((part) => part.status !== 'success').map((part) => [part.index]),
          }
        },
        uploadPart({ item, part, blob, signal, onProgress }) {
          const session = sessions.get(item.id)
          if (!session) throw new Error('上传会话不存在。')
          const failureKey = `${item.id}:${part.index}`
          if (part.index === 1 && !failedOnce.has(failureKey)) {
            failedOnce.add(failureKey)
            throw new Error('演示：第 2 个分片首次上传失败。')
          }
          return uploadBody(
            `${uploadServerUrl}/multipart/${session.uploadId}/parts/${part.index + 1}`,
            blob,
            { method: 'PUT', signal, onProgress },
          )
        },
        complete({ item, parts }) {
          const session = sessions.get(item.id)
          if (!session) throw new Error('上传会话不存在。')
          return postJson(`${uploadServerUrl}/multipart/${session.uploadId}/complete`, {
            name: item.name,
            partCount: parts.length,
            md5: md5ById.get(item.id),
          })
        },
      }),
    ],
  })

  return (
    <UploadDemoSection
      title="失败分片重传"
      description="第 2 个分片第一次会被有意置为失败。点击“重试”后，已成功分片保持完成状态，只重新上传失败及尚未上传的分片。"
    >
      <UploadRoot controller={upload}>
        <UploadTrigger>
          {({ props }) => <Button {...props}>选择至少 2 MB 的文件</Button>}
        </UploadTrigger>
        <DemoUploadList showMultipart />
      </UploadRoot>
    </UploadDemoSection>
  )
}
