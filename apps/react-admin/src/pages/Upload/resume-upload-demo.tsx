import {
  fileMd5Feature,
  type FileMd5FeatureApi,
} from '@fex/components-core/upload/features/file-md5'
import { multipartFeature } from '@fex/components-core/upload/features/multipart'
import { UploadRoot, UploadTrigger, useUpload } from '@fex/components-react/primitive/upload'
import { useLazyRef } from '@fex/components-react/hooks/use-lazy-ref'
import { Button } from '@fex/components-react/ui/button'
import { getJson, postJson, uploadBody, uploadServerUrl } from './api'
import { DemoUploadList } from './demo-list'
import { UploadDemoSection } from './demo-section'
import {
  multipartPartSize,
  type CompleteResponse,
  type MultipartSession,
  type PartResponse,
} from './multipart-types'

interface PartsStatus {
  completedIndexes: number[]
}

export function ResumeUploadDemo() {
  const sessions = useLazyRef(() => new Map<string, MultipartSession>()).current
  const md5ById = useLazyRef(() => new Map<string, string>()).current
  const upload = useUpload<CompleteResponse>({
    features: [
      fileMd5Feature({ chunkSize: multipartPartSize }),
      multipartFeature<PartResponse, CompleteResponse>({
        partSize: multipartPartSize,
        async resolveUploadPlan({ item, parts, getFeature }) {
          const md5 = await getFeature<FileMd5FeatureApi>('file-md5')?.calculate(item.id)
          if (!md5) throw new Error('无法计算文件 MD5。')
          md5ById.set(item.id, md5)
          const storageKey = `fex-upload-resume:${md5}`
          let uploadId = localStorage.getItem(storageKey)
          if (!uploadId) {
            const created = await postJson<MultipartSession>(`${uploadServerUrl}/multipart/init`, {
              name: item.name,
              size: item.size,
              md5,
            })
            uploadId = created.uploadId
            localStorage.setItem(storageKey, uploadId)
          }
          sessions.set(item.id, { uploadId })
          const status = await getJson<PartsStatus>(
            `${uploadServerUrl}/multipart/${uploadId}/parts`,
          )
          const completed = status.completedIndexes.map((index) => ({ index }))
          const completedIndexes = new Set(status.completedIndexes)
          return {
            completed,
            batches: parts
              .filter((part) => !completedIndexes.has(part.index))
              .map((part) => [part.index]),
          }
        },
        uploadPart({ item, part, blob, signal, onProgress }) {
          const session = sessions.get(item.id)
          if (!session) throw new Error('上传会话不存在。')
          return uploadBody(
            `${uploadServerUrl}/multipart/${session.uploadId}/parts/${part.index + 1}`,
            blob,
            { method: 'PUT', signal, onProgress },
          )
        },
        async complete({ item, parts }) {
          const session = sessions.get(item.id)
          const md5 = md5ById.get(item.id)
          if (!session || !md5) throw new Error('上传会话不存在。')
          const response = await postJson<CompleteResponse>(
            `${uploadServerUrl}/multipart/${session.uploadId}/complete`,
            { name: item.name, partCount: parts.length, md5 },
          )
          localStorage.removeItem(`fex-upload-resume:${md5}`)
          return response
        },
      }),
    ],
  })

  return (
    <UploadDemoSection
      title="断点续传"
      description="暂停后可直接继续；刷新页面后重新选择同一个文件，也会根据 MD5 找回 uploadId，查询服务端已完成分片并跳过它们。浏览器安全限制决定了刷新后必须由用户重新选择文件。"
    >
      <UploadRoot controller={upload}>
        <UploadTrigger>
          {({ props }) => <Button {...props}>选择需要续传的文件</Button>}
        </UploadTrigger>
        <DemoUploadList showMultipart />
      </UploadRoot>
    </UploadDemoSection>
  )
}
