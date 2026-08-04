import { dropFeature } from '@fex-design/core/upload/features/drop'
import { pasteFeature } from '@fex-design/core/upload/features/paste'
import { previewFeature } from '@fex-design/core/upload/features/preview'
import { uploadFeature } from '@fex-design/core/upload/features/upload'
import {
  UploadDropzone,
  UploadRoot,
  createUploadSignals,
} from '@fex-design/angular/primitive/upload'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { uploadBody, uploadServerUrl } from './api'
import { DemoUploadListComponent } from './demo-list.component'
import { UploadDemoSectionComponent } from './demo-section.component'
@Component({
  selector: 'fex-drop-paste-upload-demo',
  standalone: true,
  imports: [UploadDemoSectionComponent, UploadRoot, UploadDropzone, DemoUploadListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './drop-paste-demo.component.html',
})
export class DropPasteUploadDemoComponent {
  protected readonly upload = createUploadSignals({
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
  }).upload
}
