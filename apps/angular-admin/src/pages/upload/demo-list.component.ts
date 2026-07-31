import { Button } from '@fex/components-angular/ui/button'
import { UploadContext, UploadItem, UploadItemPreview, UploadItemProgress, UploadItemTemplate, UploadList, UploadListTemplate } from '@fex/components-angular/primitive/upload'
import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input } from '@angular/core'
import { MultipartDetailsComponent } from './multipart-details.component'
@Component({ selector: 'fex-demo-upload-list', standalone: true, imports: [Button, UploadList, UploadListTemplate, UploadItem, UploadItemTemplate, UploadItemPreview, UploadItemProgress, MultipartDetailsComponent], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './demo-list.component.html' })
export class DemoUploadListComponent { readonly showMultipart = input(false, { transform: booleanAttribute }); protected readonly context = inject(UploadContext); protected message(error: unknown) { return error instanceof Error ? error.message : String(error) } protected instant(response: unknown) { return typeof response === 'object' && response !== null && 'instant' in response && response.instant === true } }
