import { NgTemplateOutlet } from '@angular/common'
import { getDroppedFiles } from '@fex/components-core/upload/get-dropped-files'
import { createUploadController } from '@fex/components-core/upload/create-upload-controller'
import type { DropFeatureApi } from '@fex/components-core/upload/features/drop'
import type { PasteFeatureApi } from '@fex/components-core/upload/features/paste'
import type { UploadController, UploadId, UploadOptions } from '@fex/components-core/upload/types'
import {
  uploadDropzoneClassName,
  uploadItemClassName,
  uploadListClassName,
  uploadPreviewClassName,
  uploadProgressClassName,
  uploadProgressIndicatorClassName,
  uploadRootClassName,
  uploadTriggerClassName,
} from '@fex/components-styles/upload'
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core'
import type { OnDestroy, OnInit } from '@angular/core'
import { createHostClassName } from '../../signals/host-class'
import { createUploadItemSignal, readUploadPreview } from './create-upload-signals'
import { UploadContext } from './upload-context'

@Component({
  selector: 'fex-upload-root',
  standalone: true,
  providers: [UploadContext],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.data-disabled]': 'upload()?.getOptions()?.disabled || null',
    '[attr.data-invalid]': 'invalid() || null',
  },
  templateUrl: './upload-root.html',
})
export class UploadRoot<TResponse = unknown> implements OnDestroy {
  readonly controller = input<UploadController<TResponse>>()
  readonly options = input<UploadOptions<TResponse>>()
  readonly invalid = input(false, { transform: booleanAttribute })
  readonly name = input<string>()
  readonly required = input(false, { transform: booleanAttribute })
  protected readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('inputElement')
  protected readonly hostClass = createHostClassName(() => uploadRootClassName())
  protected readonly upload = computed(() => this.context.upload())
  private owned?: UploadController<TResponse>
  private readonly context = inject(UploadContext<TResponse>)
  constructor() {
    effect(() => {
      let upload = this.controller()
      if (!upload) this.owned ??= createUploadController(this.options() ?? {})
      upload ??= this.owned
      if (!upload) return
      if (this.options()) upload.updateOptions(this.options()!)
      this.context.setUpload(upload)
      this.context.invalid.set(this.invalid())
      const element = this.inputElement()?.nativeElement
      if (element) this.context.input.set(element)
    })
  }
  protected selectFiles(event: Event) {
    const element = event.currentTarget as HTMLInputElement
    const files = [...(element.files ?? [])]
    element.value = ''
    void this.upload()?.addFiles(files)
  }
  protected directory() {
    return this.upload()?.hasFeature('directory') ?? false
  }
  ngOnDestroy() {
    this.context.destroy()
    this.owned?.destroy()
  }
}

@Directive({
  selector: '[fexUploadTrigger]',
  standalone: true,
  host: {
    '[class]': 'hostClass()',
    '[attr.disabled]': "disabled() ? '' : null",
    '[attr.aria-controls]': 'inputId',
    '[attr.aria-invalid]': 'context.invalid() || null',
  },
})
export class UploadTrigger {
  protected readonly context = inject(UploadContext)
  protected readonly hostClass = createHostClassName(() => uploadTriggerClassName())
  protected readonly disabled = computed(
    () => this.context.upload()?.getOptions().disabled ?? false,
  )
  protected readonly inputId = undefined
  @HostListener('click', ['$event']) click(event: Event) {
    if (!event.defaultPrevented && !this.disabled()) this.context.input()?.click()
  }
}

@Directive({
  selector: '[fexUploadDropzone]',
  standalone: true,
  host: {
    role: 'button',
    '[class]': 'hostClass()',
    '[attr.tabindex]': 'disabled() ? null : 0',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.aria-invalid]': 'context.invalid()',
    '[attr.data-dragging]': 'dragging() || null',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.data-invalid]': 'context.invalid() || null',
  },
})
export class UploadDropzone implements OnDestroy {
  protected readonly context = inject(UploadContext)
  private readonly drop = computed(() => this.context.upload()?.getFeature<DropFeatureApi>('drop'))
  private readonly paste = computed(() =>
    this.context.upload()?.getFeature<PasteFeatureApi>('paste'),
  )
  protected readonly dragging = signal(false)
  protected readonly disabled = computed(
    () => this.context.upload()?.getOptions().disabled ?? false,
  )
  protected readonly hostClass = createHostClassName(() => uploadDropzoneClassName())
  private unsubscribe: (() => void) | undefined
  constructor() {
    effect(() => {
      this.unsubscribe?.()
      const feature = this.drop()
      this.dragging.set(feature?.getDragging() ?? false)
      this.unsubscribe = feature?.subscribe(() => this.dragging.set(feature.getDragging()))
    })
  }
  @HostListener('dragenter', ['$event']) dragEnter(event: DragEvent) {
    const feature = this.drop()
    if (feature) {
      event.preventDefault()
      feature.dragEnter()
    }
  }
  @HostListener('dragover', ['$event']) dragOver(event: DragEvent) {
    if (this.drop()) event.preventDefault()
  }
  @HostListener('dragleave') dragLeave() {
    this.drop()?.dragLeave()
  }
  @HostListener('drop', ['$event']) dropFiles(event: DragEvent) {
    const feature = this.drop()
    if (feature && event.dataTransfer) {
      event.preventDefault()
      void getDroppedFiles(event.dataTransfer).then((files) => feature.drop(files))
    }
  }
  @HostListener('paste', ['$event']) pasteFiles(event: ClipboardEvent) {
    const files = [...(event.clipboardData?.files ?? [])]
    const feature = this.paste()
    if (feature && files.length) {
      event.preventDefault()
      void feature.paste(files)
    }
  }
  ngOnDestroy() {
    this.unsubscribe?.()
  }
}

@Directive({ selector: 'ng-template[fexUploadList]', standalone: true })
export class UploadListTemplate {
  constructor(readonly template: TemplateRef<any>) {}
}
@Component({
  selector: 'fex-upload-list',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './upload-list.html',
})
export class UploadList {
  protected readonly context = inject(UploadContext)
  protected readonly custom = contentChild.required(UploadListTemplate)
  protected readonly className = uploadListClassName()
}

@Directive({ selector: 'ng-template[fexUploadItem]', standalone: true })
export class UploadItemTemplate {
  constructor(readonly template: TemplateRef<any>) {}
}
@Component({
  selector: 'fex-upload-item',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './upload-item.html',
})
export class UploadItem<TResponse = unknown> implements OnInit {
  readonly id = input.required<UploadId>()
  protected readonly custom = contentChild.required(UploadItemTemplate)
  readonly context = inject(UploadContext<TResponse>)
  readonly destroyRef = inject(DestroyRef)
  state!: ReturnType<typeof createUploadItemSignal<TResponse>>
  protected readonly className = uploadItemClassName()
  ngOnInit() {
    const upload = this.context.upload()
    if (!upload) throw new Error('UploadItem must be used within UploadRoot.')
    this.state = createUploadItemSignal(upload, this.id, this.destroyRef)
  }
}

@Component({
  selector: 'fex-upload-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './upload-preview.html',
})
export class UploadItemPreview {
  private readonly item = inject(UploadItem)
  protected readonly value = computed(() => this.item.state.item())
  protected readonly url = computed(() => {
    const upload = this.item.context.upload()
    return upload ? readUploadPreview(upload, this.item.id()) : undefined
  })
  protected readonly className = uploadPreviewClassName()
}

@Component({
  selector: 'fex-upload-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './upload-progress.html',
})
export class UploadItemProgress {
  private readonly item = inject(UploadItem)
  protected readonly percent = computed(() => this.item.state.item()?.progress?.percent ?? 0)
  protected readonly className = uploadProgressClassName()
  protected readonly indicatorClassName = uploadProgressIndicatorClassName()
}

export {
  createUploadSignals,
  createUploadItemSignal,
  createUploadMd5Signal,
  createUploadPartsSignal,
  createUploadProgressSignal,
  readUploadPreview,
} from './create-upload-signals'
export { UploadContext } from './upload-context'
