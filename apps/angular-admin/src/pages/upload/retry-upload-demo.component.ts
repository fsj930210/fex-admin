import { UploadRoot, UploadTrigger } from '@fex-design/angular/primitive/upload'
import { Button } from '@fex-design/angular/ui/button'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { createMultipartDemoUpload } from './create-multipart-upload'
import { DemoUploadListComponent } from './demo-list.component'
import { UploadDemoSectionComponent } from './demo-section.component'
@Component({
  selector: 'fex-retry-upload-demo',
  standalone: true,
  imports: [UploadDemoSectionComponent, UploadRoot, UploadTrigger, Button, DemoUploadListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './retry-upload-demo.component.html',
})
export class RetryUploadDemoComponent {
  protected readonly upload = createMultipartDemoUpload('retry').upload
}
