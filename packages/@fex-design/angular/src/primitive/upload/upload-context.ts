import type { UploadController } from '@fex-design/core/upload/types'
import { Injectable, signal } from '@angular/core'
@Injectable()
export class UploadContext<TResponse = unknown> {
  readonly upload = signal<UploadController<TResponse> | undefined>(undefined)
  readonly input = signal<HTMLInputElement | undefined>(undefined)
  readonly invalid = signal(false)
  readonly items = signal<
    readonly import('@fex-design/core/upload/types').UploadItem<TResponse>[]
  >([])
  private unsubscribe?: () => void
  setUpload(upload: UploadController<TResponse>) {
    if (this.upload() === upload) return
    this.unsubscribe?.()
    this.upload.set(upload)
    this.items.set(upload.getItems())
    this.unsubscribe = upload.subscribeItems(() => this.items.set(upload.getItems()))
  }
  destroy() {
    this.unsubscribe?.()
  }
}
