import { uploadFeature } from '@fex-design/core/upload/features/upload'
import { UploadRoot, UploadTrigger, useUpload } from '@fex-design/react/primitive/upload'
import { Button } from '@fex-design/react/ui/button'
import { uploadBody, uploadServerUrl } from './api'
import { DemoUploadList } from './demo-list'
import { UploadDemoSection } from './demo-section'

export function MultipleUploadDemo() {
  const upload = useUpload({
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
        <div className="flex gap-space-sm">
          <UploadTrigger>{({ props }) => <Button {...props}>选择多个文件</Button>}</UploadTrigger>
          <Button
            variant="outline"
            onClick={() =>
              void upload
                .getFeature<import('@fex-design/core/upload/types').UploadFeatureApi>('upload')
                ?.startAll()
            }
          >
            全部上传
          </Button>
        </div>
        <DemoUploadList />
      </UploadRoot>
    </UploadDemoSection>
  )
}
