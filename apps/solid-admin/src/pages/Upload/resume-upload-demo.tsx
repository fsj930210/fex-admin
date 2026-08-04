import { UploadRoot, UploadTrigger } from '@fex-design/solid/primitive/upload'
import { Button } from '@fex-design/solid/ui/button'
import { createMultipartDemoUpload } from './create-multipart-upload'
import { DemoUploadList } from './demo-list'
import { UploadDemoSection } from './demo-section'
export function ResumeUploadDemo() {
  const upload = createMultipartDemoUpload('resume')
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
