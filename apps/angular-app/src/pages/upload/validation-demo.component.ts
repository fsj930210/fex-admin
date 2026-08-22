import { uploadFeature } from '@fex-design/core/upload/features/upload'
import type { UploadItem } from '@fex-design/core/upload/types'
import {
  UploadRoot,
  UploadTrigger,
  createUploadSignals,
} from '@fex-design/angular/primitive/upload'
import { Button } from '@fex-design/angular/ui/button'
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core'
import { uploadBody, uploadServerUrl } from './api'
import { DemoUploadListComponent } from './demo-list.component'
import { UploadDemoSectionComponent } from './demo-section.component'

@Component({
  selector: 'fex-validation-upload-demo',
  standalone: true,
  imports: [UploadDemoSectionComponent, UploadRoot, UploadTrigger, Button, DemoUploadListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './validation-demo.component.html',
})
export class ValidationUploadDemoComponent {
  protected readonly items = signal<readonly UploadItem[]>([])
  protected readonly submitted = signal(false)
  protected readonly invalid = computed(() => this.submitted() && this.items().length === 0)
  protected readonly upload = createUploadSignals(() => ({
    items: this.items(),
    onItemsChange: (items) => this.items.set(items),
    autoUpload: false,
    features: [
      uploadFeature({
        request: ({ file, signal: abortSignal, onProgress }) =>
          uploadBody(`${uploadServerUrl}/upload`, file, {
            fileName: file.name,
            signal: abortSignal,
            onProgress,
          }),
      }),
    ],
  })).upload
  protected submit(event: Event) {
    event.preventDefault()
    this.submitted.set(true)
  }
}
