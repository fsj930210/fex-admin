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
import { MentionsContent } from '@fex-design/angular/primitive/mentions/content'
import { MentionsItem } from '@fex-design/angular/primitive/mentions/item'
import { MentionsList } from '@fex-design/angular/primitive/mentions/list'
import { MentionsRoot } from '@fex-design/angular/primitive/mentions/root'
import { MentionsTrigger } from '@fex-design/angular/primitive/mentions/trigger'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'
import { mentionUsers } from './data'

@Component({
  selector: 'fex-mentions-validation-demo',
  imports: [
    Card,
    Form,
    FormField,
    FieldRoot,
    FieldControl,
    FieldLabel,
    FieldRequiredIndicator,
    FieldError,
    MentionsRoot,
    MentionsTrigger,
    MentionsContent,
    MentionsList,
    MentionsItem,
    Button,
  ],
  templateUrl: './validation-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MentionsValidationDemo {
  protected readonly users = mentionUsers
  protected readonly form = injectForm({ defaultValues: { prompt: '' }, onSubmit: () => undefined })
  protected readonly validators = {
    onSubmit: ({ value }: { value: string }) => value.trim() ? undefined : 'Prompt is required.',
  }
  protected invalid(field: AnyFieldApi) {
    return field.state.meta.errors.length > 0
  }
  protected errors(field: AnyFieldApi) {
    return field.state.meta.errors.map(String)
  }
}
