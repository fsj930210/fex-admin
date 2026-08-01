import { uploadFeature } from '@fex/components-core/upload/features/upload'
import type { UploadFeatureApi } from '@fex/components-core/upload/types'
import { UploadRoot, UploadTrigger, createUpload } from '@fex/components-solid/primitive/upload'
import { Button } from '@fex/components-solid/ui/button'
import { uploadBody, uploadServerUrl } from './api'
import { DemoUploadList } from './demo-list'
import { UploadDemoSection } from './demo-section'
export function MultipleUploadDemo() {
  const upload = createUpload({
    multiple: true,
    autoUpload: false,
    features: [
      uploadFeature({
        request: ({ file, signal, onProgress }) =>
          uploadBody(`${uploadServerUrl}/upload`, file, {
            fileName: file.name,
            signal,
            onProgress,
          }),
      }),
    ],
  })
  return (
    <UploadDemoSection
      title="多文件手动上传"
      description="一次选择多个文件，可逐个上传，也可以手动启动整个文件队列。"
    >
      <UploadRoot controller={upload}>
        <div class="flex gap-space-sm">
          <UploadTrigger>{({ props }) => <Button {...props}>选择多个文件</Button>}</UploadTrigger>
          <Button
            variant="outline"
            onClick={() => void upload.getFeature<UploadFeatureApi>('upload')?.startAll()}
          >
            全部上传
          </Button>
        </div>
        <DemoUploadList />
      </UploadRoot>
    </UploadDemoSection>
  )
}
