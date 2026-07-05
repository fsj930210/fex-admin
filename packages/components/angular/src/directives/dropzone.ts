import { Directive, ElementRef, EventEmitter, Input, Output, inject } from '@angular/core'
import type { OnDestroy, OnInit } from '@angular/core'
import { createDropzoneController } from '@fex/components-core/dropzone/create-dropzone-controller'
import { getFilesFromDataTransfer } from '@fex/components-core/dropzone/files'
import type { DropzoneFileRejection } from '@fex/components-core/dropzone/types'

@Directive({
  selector: '[fexDropzone]',
  standalone: true,
})
export class FexDropzoneDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  private unsubscribe: (() => void) | undefined
  private readonly controller = createDropzoneController({
    onDropFiles: (files) => this.dropFiles.emit(files),
    onReject: (rejections) => this.reject.emit(rejections),
  })
  @Input() accept?: string | string[]
  @Input() multiple?: boolean
  @Input() disabled = false
  @Input() input?: HTMLInputElement
  @Output() dropFiles = new EventEmitter<File[]>()
  @Output() reject = new EventEmitter<DropzoneFileRejection[]>()

  ngOnInit() {
    const element = this.elementRef.nativeElement
    this.controller.updateOptions({
      disabled: this.disabled,
      onDropFiles: (files) => this.dropFiles.emit(files),
      onReject: (rejections) => this.reject.emit(rejections),
      ...(this.accept ? { accept: this.accept } : {}),
      ...(this.multiple === undefined ? {} : { multiple: this.multiple }),
    })
    this.unsubscribe = this.controller.subscribe(() => {
      const snapshot = this.controller.getSnapshot()
      element.dataset.dragging = snapshot.dragging ? 'true' : ''
      element.dataset.accepted = snapshot.accepted ? 'true' : ''
      element.dataset.rejected = snapshot.rejected ? 'true' : ''
    })
    element.addEventListener('click', this.onClick)
    element.addEventListener('dragenter', this.onDragEnter)
    element.addEventListener('dragover', this.onDragOver)
    element.addEventListener('dragleave', this.onDragLeave)
    element.addEventListener('drop', this.onDrop)
  }

  ngOnDestroy() {
    const element = this.elementRef.nativeElement
    element.removeEventListener('click', this.onClick)
    element.removeEventListener('dragenter', this.onDragEnter)
    element.removeEventListener('dragover', this.onDragOver)
    element.removeEventListener('dragleave', this.onDragLeave)
    element.removeEventListener('drop', this.onDrop)
    this.unsubscribe?.()
  }

  private readonly onClick = () => {
    if (!this.disabled) {
      this.input?.click()
    }
  }

  private readonly onDragEnter = (event: DragEvent) => {
    if (this.disabled) {
      return
    }
    event.preventDefault()
    this.controller.dragEnter()
  }

  private readonly onDragOver = (event: DragEvent) => {
    if (!this.disabled) {
      event.preventDefault()
    }
  }

  private readonly onDragLeave = () => {
    this.controller.dragLeave()
  }

  private readonly onDrop = (event: DragEvent) => {
    if (this.disabled) {
      return
    }
    event.preventDefault()
    this.controller.drop(getFilesFromDataTransfer(event.dataTransfer))
  }
}
