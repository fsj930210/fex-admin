import { UploadRoot, UploadTrigger } from '@fex/components-angular/primitive/upload'
import { Button } from '@fex/components-angular/ui/button'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { createMultipartDemoUpload } from './create-multipart-upload'
import { DemoUploadListComponent } from './demo-list.component'
import { UploadDemoSectionComponent } from './demo-section.component'
@Component({
  selector: 'fex-multipart-upload-demo',
  standalone: true,
  imports: [UploadDemoSectionComponent, UploadRoot, UploadTrigger, Button, DemoUploadListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './multipart-md5-demo.component.html',
})
export class MultipartMd5UploadDemoComponent {
  protected readonly upload = createMultipartDemoUpload('basic').upload
}
