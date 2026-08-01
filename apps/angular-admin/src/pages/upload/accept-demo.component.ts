import { uploadFeature } from '@fex/components-core/upload/features/upload'
import {
  UploadRoot,
  UploadTrigger,
  createUploadSignals,
} from '@fex/components-angular/primitive/upload'
import { Button } from '@fex/components-angular/ui/button'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { uploadBody, uploadServerUrl } from './api'
import { DemoUploadListComponent } from './demo-list.component'
import { UploadDemoSectionComponent } from './demo-section.component'
@Component({
  selector: 'fex-accept-upload-demo',
  standalone: true,
  imports: [UploadDemoSectionComponent, UploadRoot, UploadTrigger, Button, DemoUploadListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './accept-demo.component.html',
})
export class AcceptUploadDemoComponent {
  protected readonly upload = createUploadSignals({
    accept: 'image/png,image/jpeg',
    multiple: true,
    beforeUpload(file) {
      if (!['image/png', 'image/jpeg'].includes(file.type))
        throw new Error(`“${file.name}”不是 JPEG 或 PNG 图片。`)
      return file
    },
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
  }).upload
}
