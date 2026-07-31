import {
  fileMd5Feature,
  type FileMd5FeatureApi,
} from '@fex/components-core/upload/features/file-md5'
import { multipartFeature } from '@fex/components-core/upload/features/multipart'
import { UploadRoot, UploadTrigger, useUpload } from '@fex/components-react/primitive/upload'
import { Button } from '@fex/components-react/ui/button'
import { useLazyRef } from '@fex/components-react/hooks/use-lazy-ref'
import { postJson, uploadBody, uploadServerUrl } from './api'
import { DemoUploadList } from './demo-list'
import { UploadDemoSection } from './demo-section'
import {
  multipartPartSize,
  type CompleteResponse,
  type MultipartSession,
  type PartResponse,
} from './multipart-types'

export function MultipartMd5UploadDemo() {
  const sessions = useLazyRef(() => new Map<string, MultipartSession>()).current
  const md5ById = useLazyRef(() => new Map<string, string>()).current
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
          return { batches: [parts.map((part) => part.index)] }
        },
        uploadPart({ item, part, blob, signal, onProgress }) {
          const session = sessions.get(item.id)
          if (!session) throw new Error('Multipart session was not initialized.')
          return uploadBody(
            `${uploadServerUrl}/multipart/${session.uploadId}/parts/${part.index + 1}`,
            blob,
            { method: 'PUT', signal, onProgress },
          )
        },
        complete({ item, parts }) {
          const session = sessions.get(item.id)
          if (!session) throw new Error('Multipart session was not initialized.')
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
      title="大文件分片上传与 MD5"
      description="使用 Worker 按 1 MB 分块计算整文件 MD5，同时展示计算进度、总上传进度和每个分片的实时状态。"
    >
      <UploadRoot controller={upload}>
        <UploadTrigger>{({ props }) => <Button {...props}>选择大文件</Button>}</UploadTrigger>
        <DemoUploadList showMultipart />
      </UploadRoot>
    </UploadDemoSection>
  )
}
