import type { UploadController } from '@fex/components-core/upload/types'
import {
  createUploadMd5Signal,
  createUploadPartsSignal,
  createUploadProgressSignal,
} from '@fex/components-angular/primitive/upload'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
} from '@angular/core'
import type { OnInit } from '@angular/core'
@Component({
  selector: 'fex-multipart-details',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './multipart-details.component.html',
})
export class MultipartDetailsComponent implements OnInit {
  readonly id = input.required<string>()
  readonly upload = input.required<UploadController>()
  private readonly destroyRef = inject(DestroyRef)
  protected md5!: ReturnType<typeof createUploadMd5Signal>
  protected parts!: ReturnType<typeof createUploadPartsSignal>
  protected progress!: ReturnType<typeof createUploadProgressSignal>
  protected readonly completed = computed(
    () => this.parts?.().filter((part) => part.status === 'success').length ?? 0,
  )
  protected readonly statusText = {
    pending: '等待',
    uploading: '上传中',
    success: '完成',
    error: '失败',
  } as const
  ngOnInit() {
    this.md5 = createUploadMd5Signal(this.upload(), this.id, this.destroyRef)
    this.parts = createUploadPartsSignal(this.upload(), this.id, this.destroyRef)
    this.progress = createUploadProgressSignal(
      this.upload(),
      this.id,
      { md5Weight: 0.1 },
      this.destroyRef,
    )
  }
}
