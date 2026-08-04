import { directoryFeature } from '@fex-design/core/upload/features/directory'
import { uploadFeature } from '@fex-design/core/upload/features/upload'
import { UploadRoot, UploadTrigger, createUpload } from '@fex-design/solid/primitive/upload'
import { Button } from '@fex-design/solid/ui/button'
import { uploadBody, uploadServerUrl } from './api'
import { DemoUploadList } from './demo-list'
import { UploadDemoSection } from './demo-section'
export function DirectoryUploadDemo() {
  const upload = createUpload({
    autoUpload: false,
    features: [
      directoryFeature(),
      uploadFeature({
        request: ({ file, signal, onProgress }) =>
          uploadBody(`${uploadServerUrl}/upload`, file, {
            fileName: file.webkitRelativePath || file.name,
            signal,
            onProgress,
          }),
      }),
    ],
  })
  return (
    <UploadDemoSection
      title="文件夹上传"
      description="directoryFeature 将隐藏文件选择器切换为目录模式，并在请求中保留每个文件的 webkitRelativePath。"
    >
      <UploadRoot controller={upload}>
        <UploadTrigger>{({ props }) => <Button {...props}>选择文件夹</Button>}</UploadTrigger>
        <DemoUploadList />
      </UploadRoot>
    </UploadDemoSection>
  )
}
