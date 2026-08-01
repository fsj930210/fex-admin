import { uploadFeature } from '@fex/components-core/upload/features/upload'
import type { UploadItem } from '@fex/components-core/upload/types'
import { UploadRoot, UploadTrigger, useUpload } from '@fex/components-react/primitive/upload'
import { Button } from '@fex/components-react/ui/button'
import { useState } from 'react'
import { uploadBody, uploadServerUrl } from './api'
import { DemoUploadList } from './demo-list'
import { UploadDemoSection } from './demo-section'

export function ValidationUploadDemo() {
  const [items, setItems] = useState<readonly UploadItem[]>([])
  const [submitted, setSubmitted] = useState(false)
  const invalid = submitted && items.length === 0
  const upload = useUpload({
    items,
    onItemsChange: setItems,
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
      title="受控表单校验"
      description="父组件控制文件列表；必填字段为空时提交表单，选择文件按钮会公开 invalid 状态。"
    >
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(true)
        }}
      >
        <UploadRoot controller={upload} invalid={invalid} required>
          <UploadTrigger>
            {({ props }) => (
              <Button {...props} variant="outline">
                选择必填文件
              </Button>
            )}
          </UploadTrigger>
          <DemoUploadList />
        </UploadRoot>
        {invalid && (
          <p className="mt-space-xs text-sm text-danger" role="alert">
            请至少选择一个文件。
          </p>
        )}
        <Button className="mt-space-md" type="submit">
          校验表单
        </Button>
      </form>
    </UploadDemoSection>
  )
}
