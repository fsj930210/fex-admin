import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  FieldControl,
  FieldError,
  FieldLabel,
  FieldRoot,
} from '@fex/components-angular/primitive/field'
import {
  Form,
  FormField,
  injectForm,
  type AnyFieldApi,
} from '@fex/components-angular/primitive/form'
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-angular/primitive/select'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import { frameworkOptions } from './data'
export
@Component({
  selector: 'fex-select-form-status-demo',
  standalone: true,
  imports: [
    Card,
    Button,
    Form,
    FormField,
    FieldRoot,
    FieldControl,
    FieldLabel,
    FieldError,
    SelectRoot,
    SelectTrigger,
    SelectContent,
    SelectList,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-status-demo.component.html',
})
class FormStatusDemo {
  protected readonly options = frameworkOptions
  protected readonly form = injectForm({
    defaultValues: { framework: '' },
    onSubmit: () => undefined,
  })
  protected readonly validators = {
    onSubmit: ({ value }: { value: string }) => (value ? undefined : 'Please select a framework'),
  }
  protected invalid(field: AnyFieldApi) {
    return field.state.meta.errors.length > 0
  }
  protected errors(field: AnyFieldApi) {
    return field.state.meta.errors.map(String)
  }
}
