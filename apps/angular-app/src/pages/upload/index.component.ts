import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AcceptUploadDemoComponent } from './accept-demo.component'
import { DirectoryUploadDemoComponent } from './directory-demo.component'
import { DropPasteUploadDemoComponent } from './drop-paste-demo.component'
import { InstantUploadDemoComponent } from './instant-upload-demo.component'
import { MultipartMd5UploadDemoComponent } from './multipart-md5-demo.component'
import { MultipleUploadDemoComponent } from './multiple-demo.component'
import { ResumeUploadDemoComponent } from './resume-upload-demo.component'
import { RetryUploadDemoComponent } from './retry-upload-demo.component'
import { SingleUploadDemoComponent } from './single-demo.component'
import { ValidationUploadDemoComponent } from './validation-demo.component'
@Component({
  selector: 'fex-upload-page',
  standalone: true,
  imports: [
    RouterLink,
    SingleUploadDemoComponent,
    MultipleUploadDemoComponent,
    AcceptUploadDemoComponent,
    DirectoryUploadDemoComponent,
    DropPasteUploadDemoComponent,
    MultipartMd5UploadDemoComponent,
    ResumeUploadDemoComponent,
    RetryUploadDemoComponent,
    InstantUploadDemoComponent,
    ValidationUploadDemoComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './index.component.html',
})
export class UploadComponent {}
