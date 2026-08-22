import {
  fileMd5Feature,
  type FileMd5FeatureApi,
} from '@fex-design/core/upload/features/file-md5'
import { multipartFeature } from '@fex-design/core/upload/features/multipart'
import { UploadRoot, UploadTrigger, useUpload } from '@fex-design/react/primitive/upload'
import { useLazyRef } from '@fex-design/react/hooks/use-lazy-ref'
import { Button } from '@fex-design/react/ui/button'
import { getJson, postJson, uploadBody, uploadServerUrl } from './api'
import { DemoUploadList } from './demo-list'
import { UploadDemoSection } from './demo-section'
import {
  multipartPartSize,
  type CompleteResponse,
  type MultipartSession,
  type PartResponse,
  type UploadCheckResponse,
} from './multipart-types'

export function InstantUploadDemo() {
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
          const checked = await getJson<UploadCheckResponse>(
            `${uploadServerUrl}/multipart/check?md5=${md5}`,
          )
          if (checked.exists && checked.response)
            return { batches: [], complete: { response: checked.response } }
          const session = await postJson<MultipartSession>(`${uploadServerUrl}/multipart/init`, {
            name: item.name,
            size: item.size,
            md5,
          })
          sessions.set(item.id, session)
          return { batches: parts.map((part) => [part.index]) }
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
      title="MD5 秒传"
      description="第一次选择文件会正常分片上传并登记 MD5；清空列表后再次选择相同文件，服务端命中 MD5，前端不会发送任何分片，直接使用服务端原样响应完成。"
    >
      <UploadRoot controller={upload}>
        <UploadTrigger>{({ props }) => <Button {...props}>选择文件验证秒传</Button>}</UploadTrigger>
        <DemoUploadList showMultipart />
      </UploadRoot>
    </UploadDemoSection>
  )
}
