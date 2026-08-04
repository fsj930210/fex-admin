import { uploadFeature } from '@fex-design/core/upload/features/upload'
import type { UploadFeatureApi } from '@fex-design/core/upload/types'
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
  selector: 'fex-multiple-upload-demo',
  standalone: true,
  imports: [UploadDemoSectionComponent, UploadRoot, UploadTrigger, Button, DemoUploadListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './multiple-demo.component.html',
})
export class MultipleUploadDemoComponent {
  protected readonly upload = createUploadSignals({
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
  }).upload
  protected startAll() {
    void this.upload.getFeature<UploadFeatureApi>('upload')?.startAll()
  }
}
