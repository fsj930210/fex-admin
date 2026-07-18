import { inputAddonAfterClassName, inputAddonBeforeClassName, inputClearClassName, inputControlClassName, inputPrefixClassName, inputRootClassName, inputSuffixClassName } from '@fex/components-styles/input'
import { ChangeDetectionStrategy, Component, Directive, ElementRef, EventEmitter, HostListener, Input, Output, inject, signal } from '@angular/core'
import type { OnChanges, SimpleChanges } from '@angular/core'
import { CloseIcon } from '../../icon/close'
import { createHostClassName } from '../../signals/host-class'
import { Button, buttonPrimitiveClassName } from '../button/button'

@Component({ selector: 'fex-input-root', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[class]': 'hostClassName()', '[attr.data-disabled]': 'disabled || null', '[attr.data-readonly]': 'readOnly || null', '[attr.data-invalid]': 'invalid || null', 'data-slot': 'input-root' }, template: '<ng-content />' })
export class InputRoot implements OnChanges {
  @Input() value?: string
  @Input() defaultValue = ''
  @Input() disabled = false
  @Input() readOnly = false
  @Input() invalid = false
  @Output() readonly valueChange = new EventEmitter<string>()
  @Output() readonly clear = new EventEmitter<void>()
  protected readonly hostClassName = createHostClassName(inputRootClassName)
  private readonly uncontrolledValue = signal(this.defaultValue)
  private focusElement?: HTMLElement
  get currentValue() { return this.value ?? this.uncontrolledValue() }
  get canClear() { return this.currentValue !== '' && !this.disabled && !this.readOnly }
  ngOnChanges(changes: SimpleChanges) { if (changes['defaultValue'] && this.value === undefined) this.uncontrolledValue.set(this.defaultValue) }
  setFocusElement(element: HTMLElement) { this.focusElement = element }
  setValue(value: string) { if (this.disabled || this.readOnly) return; if (this.value === undefined) this.uncontrolledValue.set(value); this.valueChange.emit(value) }
  clearValue() { if (!this.canClear) return; this.setValue(''); this.clear.emit(); this.focusElement?.focus() }
}

@Directive({ selector: 'input[fexInputControl]', standalone: true, host: { '[class]': 'hostClassName()', 'data-slot': 'input-control', '[value]': 'root.currentValue', '[disabled]': 'root.disabled', '[readOnly]': 'root.readOnly', '[attr.aria-invalid]': 'root.invalid || null' } })
export class InputControl {
  readonly root = inject(InputRoot)
  protected readonly hostClassName = createHostClassName(inputControlClassName)
  private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef)
  constructor() { this.root.setFocusElement(this.element.nativeElement) }
  @HostListener('input', ['$event']) onInput(event: Event) { this.root.setValue((event.currentTarget as HTMLInputElement).value) }
}

@Directive({ selector: '[fexInputPrefix]', standalone: true, host: { '[class]': 'hostClassName()', 'data-slot': 'input-prefix' } })
export class InputPrefix { protected readonly hostClassName = createHostClassName(inputPrefixClassName) }
@Directive({ selector: '[fexInputSuffix]', standalone: true, host: { '[class]': 'hostClassName()', 'data-slot': 'input-suffix' } })
export class InputSuffix { protected readonly hostClassName = createHostClassName(inputSuffixClassName) }
@Directive({ selector: '[fexInputAddonBefore]', standalone: true, host: { '[class]': 'hostClassName()', 'data-slot': 'input-addon-before' } })
export class InputAddonBefore { protected readonly hostClassName = createHostClassName(inputAddonBeforeClassName) }
@Directive({ selector: '[fexInputAddonAfter]', standalone: true, host: { '[class]': 'hostClassName()', 'data-slot': 'input-addon-after' } })
export class InputAddonAfter { protected readonly hostClassName = createHostClassName(inputAddonAfterClassName) }
@Component({ selector: 'button[fexInputClear]', standalone: true, imports: [CloseIcon], hostDirectives: [Button], changeDetection: ChangeDetectionStrategy.OnPush, host: { '[class]': 'hostClassName()', 'data-slot': 'input-clear', '[hidden]': '!root.canClear', '[disabled]': '!root.canClear', '(pointerdown)': '$event.preventDefault()', '(click)': 'root.clearValue()' }, template: '<ng-content><fex-close-icon /></ng-content>' })
export class InputClear { readonly root = inject(InputRoot); protected readonly hostClassName = createHostClassName(buttonPrimitiveClassName(inputClearClassName)) }
