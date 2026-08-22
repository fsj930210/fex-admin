import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  FieldControl,
  FieldError,
  FieldLabel,
  FieldRequiredIndicator,
  FieldRoot,
} from '@fex-design/angular/primitive/field'
import { Form, FormField, injectForm, type AnyFieldApi } from '@fex-design/angular/primitive/form'
import { InputNumber, type InputNumberChange } from '@fex-design/angular/primitive/input-number'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-input-number-validation-demo',
  standalone: true,
  imports: [
    Card,
    Form,
    FormField,
    FieldRoot,
    FieldControl,
    FieldLabel,
    FieldRequiredIndicator,
    FieldError,
    InputNumber,
    Button,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './validation-demo.component.html',
})
export class ValidationDemoComponent {
  protected readonly form = injectForm({
    defaultValues: { quantity: undefined as number | undefined },
    onSubmit: () => undefined,
  })
  protected readonly validators = {
    onSubmit: ({ value }: { value: number | undefined }) =>
      typeof value === 'number' && value >= 1 ? undefined : 'Quantity must be at least 1.',
  }
  protected invalid(field: AnyFieldApi) {
    return field.state.meta.errors.length > 0
  }
  protected errors(field: AnyFieldApi) {
    return field.state.meta.errors.map(String)
  }
  protected change(field: AnyFieldApi, change: InputNumberChange) {
    field.handleChange(change.value)
  }
}
