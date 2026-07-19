import { compileFieldRuleProps, scrollToFirstError, type FieldRule, type ScrollToFirstError, type ValidateTrigger } from '@fex/components-core'
import { ChangeDetectorRef, Directive, HostListener, Input, type OnChanges, type OnDestroy, type OnInit } from '@angular/core'
import { FieldApi, type AnyFieldApi } from '@tanstack/angular-form'

export interface FormApiLike { handleSubmit: () => unknown }

@Directive({ selector: '[fexForm]', standalone: true })
export class Form {
  @Input({ required: true, alias: 'fexForm' }) form!: FormApiLike
  @Input() scrollToFirstError: ScrollToFirstError = true
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
  @Input() dependencies?: readonly string[]
  @Input() initialValue?: unknown
  @Input() rules?: readonly FieldRule<Record<string, unknown>, unknown>[]
  @Input() validateDebounce = 0
  @Input() validateFirst = false
  @Input() validateTrigger?: ValidateTrigger | readonly ValidateTrigger[]

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
    const compiled = compileFieldRuleProps({
      ...(this.dependencies === undefined ? {} : { dependencies: this.dependencies }),
      ...(this.initialValue === undefined ? {} : { initialValue: this.initialValue }),
      ...(this.rules === undefined ? {} : { rules: this.rules }),
      validateDebounce: this.validateDebounce,
      validateFirst: this.validateFirst,
      ...(this.validateTrigger === undefined ? {} : { validateTrigger: this.validateTrigger }),
    }, this.form as never)
    return { ...compiled, form: this.form, name: this.name }
  }
}

export * from '@tanstack/angular-form'
