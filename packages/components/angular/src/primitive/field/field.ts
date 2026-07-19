import {
  fieldContentClassName,
  fieldDescriptionClassName,
  fieldErrorClassName,
  fieldGroupClassName,
  fieldLabelClassName,
  fieldLegendClassName,
  fieldRequiredIndicatorClassName,
  fieldRootClassName,
  fieldSeparatorClassName,
  fieldSetClassName,
  fieldTitleClassName,
  type FieldStyleProps,
} from '@fex/components-styles/field'
import { ChangeDetectionStrategy, Component, Directive, Input, inject } from '@angular/core'
import { createHostClassName } from '../../signals/host-class'

let fieldId = 0

@Component({
  selector: 'fex-field-root', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClassName()', 'data-slot': 'field-root', '[attr.data-orientation]': 'orientation', '[attr.data-disabled]': 'disabled || null', '[attr.data-readonly]': 'readOnly || null', '[attr.data-required]': 'required || null', '[attr.data-invalid]': 'invalid || null' },
  template: '<ng-content />',
})
export class FieldRoot {
  @Input() id = `fex-field-${++fieldId}`
  @Input() orientation: NonNullable<FieldStyleProps['orientation']> = 'vertical'
  @Input() disabled = false
  @Input() readOnly = false
  @Input() required = false
  @Input() invalid = false
  @Input() hasDescription = false
  @Input() hasError = false
  get controlId() { return `${this.id}-control` }
  get descriptionId() { return `${this.id}-description` }
  get errorId() { return `${this.id}-error` }
  protected readonly hostClassName = createHostClassName(() => fieldRootClassName({ orientation: this.orientation }))
}

@Directive({ selector: '[fexFieldControl]', standalone: true, host: { '[id]': 'field.controlId', '[attr.required]': 'field.required || null', '[attr.disabled]': 'field.disabled || null', '[attr.readonly]': 'field.readOnly || null', '[attr.aria-required]': 'field.required || null', '[attr.aria-invalid]': 'field.invalid || null', '[attr.aria-describedby]': 'describedBy', '[attr.aria-errormessage]': 'field.invalid && field.hasError ? field.errorId : null', 'data-slot': 'field-control' } })
export class FieldControl { readonly field = inject(FieldRoot); get describedBy() { return [this.field.hasDescription ? this.field.descriptionId : '', this.field.hasError ? this.field.errorId : ''].filter(Boolean).join(' ') || null } }

@Directive({ selector: 'label[fexFieldLabel]', standalone: true, host: { '[class]': 'hostClassName()', '[attr.for]': 'field.controlId', 'data-slot': 'field-label' } })
export class FieldLabel { readonly field = inject(FieldRoot); protected readonly hostClassName = createHostClassName(fieldLabelClassName) }
@Directive({ selector: '[fexFieldRequiredIndicator]', standalone: true, host: { '[class]': 'hostClassName()', 'aria-hidden': 'true', 'data-slot': 'field-required-indicator' } })
export class FieldRequiredIndicator { protected readonly hostClassName = createHostClassName(fieldRequiredIndicatorClassName) }
@Directive({ selector: '[fexFieldDescription]', standalone: true, host: { '[class]': 'hostClassName()', '[id]': 'field.descriptionId', 'data-slot': 'field-description' } })
export class FieldDescription { readonly field = inject(FieldRoot); protected readonly hostClassName = createHostClassName(fieldDescriptionClassName) }
@Directive({ selector: '[fexFieldError]', standalone: true, host: { '[class]': 'hostClassName()', '[id]': 'field.errorId', 'role': 'alert', 'aria-live': 'polite', 'data-slot': 'field-error' } })
export class FieldError { readonly field = inject(FieldRoot); protected readonly hostClassName = createHostClassName(fieldErrorClassName) }
@Directive({ selector: '[fexFieldGroup]', standalone: true, host: { '[class]': 'hostClassName()', 'role': 'group', 'data-slot': 'field-group' } })
export class FieldGroup { protected readonly hostClassName = createHostClassName(fieldGroupClassName) }
@Directive({ selector: 'fieldset[fexFieldSet]', standalone: true, host: { '[class]': 'hostClassName()', 'data-slot': 'field-set' } })
export class FieldSet { protected readonly hostClassName = createHostClassName(fieldSetClassName) }
@Directive({ selector: 'legend[fexFieldLegend]', standalone: true, host: { '[class]': 'hostClassName()', 'data-slot': 'field-legend' } })
export class FieldLegend { protected readonly hostClassName = createHostClassName(fieldLegendClassName) }
@Directive({ selector: '[fexFieldContent]', standalone: true, host: { '[class]': 'hostClassName()', 'data-slot': 'field-content' } })
export class FieldContent { protected readonly hostClassName = createHostClassName(fieldContentClassName) }
@Directive({ selector: '[fexFieldTitle]', standalone: true, host: { '[class]': 'hostClassName()', 'data-slot': 'field-title' } })
export class FieldTitle { protected readonly hostClassName = createHostClassName(fieldTitleClassName) }
@Directive({ selector: '[fexFieldSeparator]', standalone: true, host: { '[class]': 'hostClassName()', 'role': 'separator', 'data-slot': 'field-separator' } })
export class FieldSeparator { protected readonly hostClassName = createHostClassName(fieldSeparatorClassName) }
