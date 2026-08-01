import { dropFeature } from '@fex/components-core/upload/features/drop'
import { pasteFeature } from '@fex/components-core/upload/features/paste'
import { previewFeature } from '@fex/components-core/upload/features/preview'
import { uploadFeature } from '@fex/components-core/upload/features/upload'
import { UploadDropzone, UploadRoot, useUpload } from '@fex/components-react/primitive/upload'
import { uploadBody, uploadServerUrl } from './api'
import { DemoUploadList } from './demo-list'
import { UploadDemoSection } from './demo-section'

export function DropPasteUploadDemo() {
  const upload = useUpload({
    multiple: true,
    features: [
      dropFeature(),
      pasteFeature(),
      previewFeature(),
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
      title="拖拽、粘贴与图片预览"
      description="可选行为 feature 共用同一条 addFiles 处理链；支持递归拖入文件夹，也可以聚焦此区域后粘贴剪贴板图片。"
    >
      <UploadRoot controller={upload}>
        <UploadDropzone>拖入文件或文件夹，或者聚焦此区域后粘贴图片</UploadDropzone>
        <DemoUploadList />
      </UploadRoot>
    </UploadDemoSection>
  )
}
