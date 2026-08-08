import {
  syncTextareaAutoSize,
  type TextareaAutoSize,
} from '@fex-design/core/textarea/autosize'
import {
  textareaClearClassName,
  textareaFooterClassName,
  textareaInputClassName,
  textareaRootClassName,
} from '@fex-design/styles/textarea'
import { cn } from '@fex/utils'
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core'
import type { OnChanges, OnDestroy, SimpleChanges } from '@angular/core'
import { CloseIcon } from '../../icon/close'
import { createHostClassName } from '../../signals/host-class'
import { Button, buttonPrimitiveClassName } from '../button/button'

@Component({
  selector: 'fex-textarea-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    '[attr.data-disabled]': 'disabled || null',
    '[attr.data-readonly]': 'readOnly || null',
    '[attr.data-invalid]': 'resolvedInvalid || null',
    '[attr.data-status]': 'status || null',
    'data-slot': 'textarea-root',
  },
  template: '<ng-content /> @if (allowClear) { <button fexTextareaClear type="button"></button> }',
  imports: [forwardRef(() => TextareaClear)],
})
export class TextareaRoot implements OnChanges {
  private readonly classInput = signal('')
  @Input('class') set className(value: string | null | undefined) {
    this.classInput.set(value ?? '')
  }
  @Input() value?: string
  @Input() defaultValue = ''
  @Input() disabled = false
  @Input() readOnly = false
  @Input() invalid = false
  @Input() status: 'error' | 'warning' | undefined = undefined
  @Input() autoSize: TextareaAutoSize | undefined = undefined
  @Input() allowClear = false
  @Output() readonly change = new EventEmitter<string>()
  @Output() readonly clear = new EventEmitter<void>()
  protected readonly hostClassName = createHostClassName(() =>
    cn(textareaRootClassName, this.classInput()),
  )
  private readonly uncontrolledValue = signal(this.defaultValue)
  private focusElement?: HTMLTextAreaElement

  get currentValue() {
    return this.value ?? this.uncontrolledValue()
  }
  get resolvedInvalid() {
    return this.invalid || this.status === 'error'
  }
  get canClear() {
    return this.currentValue !== '' && !this.disabled && !this.readOnly
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['defaultValue'] && this.value === undefined)
      this.uncontrolledValue.set(this.defaultValue)
    this.queueAutoSize()
  }
  setFocusElement(element: HTMLTextAreaElement) {
    this.focusElement = element
    this.queueAutoSize()
  }
  setValue(value: string) {
    if (this.disabled || this.readOnly) return
    if (this.value === undefined) this.uncontrolledValue.set(value)
    this.change.emit(value)
    this.queueAutoSize()
  }
  clearValue() {
    if (!this.canClear) return
    this.setValue('')
    this.clear.emit()
    this.focusElement?.focus()
  }
  syncAutoSize() {
    if (this.focusElement) syncTextareaAutoSize(this.focusElement, this.autoSize)
  }
  private queueAutoSize() {
    queueMicrotask(() => this.syncAutoSize())
  }
}

@Directive({
  selector: 'textarea[fexTextareaInput]',
  standalone: true,
  host: {
    '[class]': 'hostClassName()',
    'data-slot': 'textarea-input',
    '[value]': 'root.currentValue',
    '[disabled]': 'root.disabled',
    '[readOnly]': 'root.readOnly',
    '[attr.aria-invalid]': 'root.resolvedInvalid || null',
  },
})
export class TextareaInput implements OnDestroy {
  readonly root = inject(TextareaRoot)
  private readonly classInput = signal('')
  @Input('class') set className(value: string | null | undefined) {
    this.classInput.set(value ?? '')
  }
  protected readonly hostClassName = createHostClassName(() =>
    cn(textareaInputClassName, this.classInput()),
  )
  private readonly element = inject<ElementRef<HTMLTextAreaElement>>(ElementRef)
  private readonly observer: ResizeObserver | undefined =
    typeof ResizeObserver === 'undefined'
      ? undefined
      : new ResizeObserver(() => this.root.syncAutoSize())

  constructor() {
    this.root.setFocusElement(this.element.nativeElement)
    this.observer?.observe(this.element.nativeElement)
  }
  ngOnDestroy() {
    this.observer?.disconnect()
  }
  @HostListener('input', ['$event']) onInput(event: Event) {
    this.root.setValue((event.currentTarget as HTMLTextAreaElement).value)
  }
  @HostListener('change', ['$event']) onChange(event: Event) {
    event.stopPropagation()
  }
}

@Directive({
  selector: '[fexTextareaFooter]',
  standalone: true,
  host: { '[class]': 'hostClassName()', 'data-slot': 'textarea-footer' },
})
export class TextareaFooter {
  protected readonly hostClassName = createHostClassName(textareaFooterClassName)
}

@Component({
  selector: 'button[fexTextareaClear]',
  standalone: true,
  imports: [CloseIcon],
  hostDirectives: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    'data-slot': 'textarea-clear',
    '[hidden]': '!root.canClear',
    '[disabled]': '!root.canClear',
    '(pointerdown)': '$event.preventDefault()',
    '(click)': 'root.clearValue()',
  },
  template: '<ng-content><fex-close-icon /></ng-content>',
})
export class TextareaClear {
  readonly root = inject(TextareaRoot)
  protected readonly hostClassName = createHostClassName(
    buttonPrimitiveClassName(textareaClearClassName),
  )
}
