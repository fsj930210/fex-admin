import { UploadRoot, UploadTrigger } from '@fex-design/solid/primitive/upload'
import { Button } from '@fex-design/solid/ui/button'
import { createMultipartDemoUpload } from './create-multipart-upload'
import { DemoUploadList } from './demo-list'
import { UploadDemoSection } from './demo-section'
export function InstantUploadDemo() {
  const upload = createMultipartDemoUpload('instant')
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
