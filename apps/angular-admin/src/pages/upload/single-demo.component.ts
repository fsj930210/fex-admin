import { previewFeature } from '@fex-design/core/upload/features/preview'
import { uploadFeature } from '@fex-design/core/upload/features/upload'
import {
  UploadRoot,
  UploadTrigger,
  createUploadSignals,
} from '@fex-design/angular/primitive/upload'
import { Button } from '@fex-design/angular/ui/button'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { uploadBody, uploadServerUrl } from './api'
import { DemoUploadListComponent } from './demo-list.component'
import { UploadDemoSectionComponent } from './demo-section.component'
@Component({
  selector: 'fex-single-upload-demo',
  standalone: true,
  imports: [UploadDemoSectionComponent, UploadRoot, UploadTrigger, Button, DemoUploadListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './single-demo.component.html',
})
export class SingleUploadDemoComponent {
  protected readonly upload = createUploadSignals({
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
  }).upload
}
