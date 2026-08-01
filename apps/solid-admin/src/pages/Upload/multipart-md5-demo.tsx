import { UploadRoot, UploadTrigger } from '@fex/components-solid/primitive/upload'
import { Button } from '@fex/components-solid/ui/button'
import { createMultipartDemoUpload } from './create-multipart-upload'
import { DemoUploadList } from './demo-list'
import { UploadDemoSection } from './demo-section'
export function MultipartMd5UploadDemo() {
  const upload = createMultipartDemoUpload('basic')
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
