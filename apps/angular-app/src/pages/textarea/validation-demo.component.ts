import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  FieldControl,
  FieldError,
  FieldLabel,
  FieldRequiredIndicator,
  FieldRoot,
} from '@fex-design/angular/primitive/field'
import {
  Form,
  FormField,
  injectForm,
  type AnyFieldApi,
} from '@fex-design/angular/primitive/form'
import { TextareaInput, TextareaRoot } from '@fex-design/angular/primitive/textarea'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-textarea-validation-demo',
  imports: [
    Card,
    Form,
    FormField,
    FieldRoot,
    FieldControl,
    FieldLabel,
    FieldRequiredIndicator,
    FieldError,
    TextareaRoot,
    TextareaInput,
    Button,
  ],
  templateUrl: './validation-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaValidationDemo {
  protected readonly form = injectForm({
    defaultValues: { message: '' },
    onSubmit: () => undefined,
  })
  protected readonly validators = {
    onSubmit: ({ value }: { value: string }) =>
      value.trim() ? undefined : 'Message is required.',
  }
  protected invalid(field: AnyFieldApi) {
    return field.state.meta.errors.length > 0
  }
  protected errors(field: AnyFieldApi) {
    return field.state.meta.errors.map(String)
  }
}
