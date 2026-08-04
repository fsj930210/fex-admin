import { previewFeature } from '@fex-design/core/upload/features/preview'
import { uploadFeature } from '@fex-design/core/upload/features/upload'
import { UploadRoot, UploadTrigger, createUpload } from '@fex-design/solid/primitive/upload'
import { Button } from '@fex-design/solid/ui/button'
import { uploadBody, uploadServerUrl } from './api'
import { DemoUploadList } from './demo-list'
import { UploadDemoSection } from './demo-section'
export function SingleUploadDemo() {
  const upload = createUpload({
    maxCount: 1,
    features: [
      uploadFeature({
        request: ({ file, signal, onProgress }) =>
          uploadBody(`${uploadServerUrl}/upload`, file, {
            fileName: file.name,
            signal,
            onProgress,
          }),
      }),
      previewFeature(),
    ],
  })
  return (
    <UploadDemoSection
      title="单文件上传"
      description="向本地 Node 服务发送真实请求，maxCount 保证列表中只保留一个文件。"
    >
      <UploadRoot controller={upload}>
        <UploadTrigger>{({ props }) => <Button {...props}>选择一个文件</Button>}</UploadTrigger>
        <DemoUploadList />
      </UploadRoot>
    </UploadDemoSection>
  )
}
