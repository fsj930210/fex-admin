import { uploadFeature } from '@fex/components-core/upload/features/upload'
import { previewFeature } from '@fex/components-core/upload/features/preview'
import { UploadRoot, UploadTrigger, useUpload } from '@fex/components-react/primitive/upload'
import { Button } from '@fex/components-react/ui/button'
import { uploadBody, uploadServerUrl } from './api'
import { DemoUploadList } from './demo-list'
import { UploadDemoSection } from './demo-section'

export function SingleUploadDemo() {
  const upload = useUpload({
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
