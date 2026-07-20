import { scrollToFirstError, type ScrollToFirstError } from '@fex/components-core'
export { scrollToField } from '@fex/components-core'
import { ChangeDetectorRef, Directive, HostBinding, HostListener, Input, type OnChanges, type OnDestroy, type OnInit } from '@angular/core'
import { FieldApi, type AnyFieldApi } from '@tanstack/angular-form'

export interface FormApiLike { handleSubmit: () => unknown }

@Directive({ selector: '[fexForm]', standalone: true })
export class Form {
  @Input({ required: true, alias: 'fexForm' }) form!: FormApiLike
  @Input() scrollToFirstError: ScrollToFirstError = true
  @HostBinding('attr.novalidate') readonly noValidate = ''
  @HostListener('submit', ['$event']) async submit(event: Event) {
    if (event.defaultPrevented) return
    event.preventDefault()
    const element = event.currentTarget
    await this.form.handleSubmit()
    if (element instanceof HTMLFormElement) await scrollToFirstError(element, this.scrollToFirstError)
  }
}

@Directive({ selector: '[fexField]', standalone: true, exportAs: 'field' })
export class FormField implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true, alias: 'fexField' }) form!: FormApiLike
  @Input({ required: true }) name!: string
  /** Native TanStack FieldApi options. */
  @Input() defaultValue?: unknown
  @Input() listeners?: Record<string, unknown>
  @Input() validators?: Record<string, unknown>

  api!: AnyFieldApi
  private cleanup?: () => void
  private subscription?: { unsubscribe: () => void }

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.api = new FieldApi(this.options() as never)
    this.cleanup = this.api.mount()
    this.subscription = this.api.store.subscribe(() => this.changeDetector.markForCheck())
  }

  ngOnChanges() {
    if (this.api) this.api.update(this.options() as never)
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
    this.cleanup?.()
  }

  private options() {
    return {
      ...(this.defaultValue === undefined ? {} : { defaultValue: this.defaultValue }),
      ...(this.listeners === undefined ? {} : { listeners: this.listeners }),
      ...(this.validators === undefined ? {} : { validators: this.validators }),
      form: this.form,
      name: this.name,
    }
  }
}

export * from '@tanstack/angular-form'
