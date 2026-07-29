import { ChangeDetectionStrategy, Component } from '@angular/core'
import { FieldControl, FieldLabel, FieldRoot } from '@fex/components-angular/primitive/field'
import { Form, FormField, injectForm, type AnyFieldApi } from '@fex/components-angular/primitive/form'
import { Transfer } from '@fex/components-angular/primitive/transfer'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import { transferFieldNames, transferMembers } from './data'

@Component({
  selector: 'fex-transfer-validation-demo',
  standalone: true,
  imports: [Card, Form, FormField, FieldRoot, FieldControl, FieldLabel, Transfer, Button],
  templateUrl: './validation-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferValidationDemoComponent {
  protected readonly members = transferMembers
  protected readonly fieldNames = transferFieldNames
  protected readonly form = injectForm({
    defaultValues: { members: [] as readonly (string | number)[] },
    onSubmit: () => undefined,
  })
  protected readonly validators = {
    onSubmit: ({ value }: { value: readonly (string | number)[] }) =>
      value.length === 0 ? 'Select at least one member.' : undefined,
  }

  protected invalid(field: AnyFieldApi) {
    return field.state.meta.errors.length > 0
  }
  protected validation(field: AnyFieldApi) {
    const errors = field.state.meta.errors.map(String)
    if (errors.length > 0) return { status: 'error', message: errors[0]! } as const
    return field.state.value.length === 1
      ? { status: 'warning', message: 'Only one member is assigned; consider adding a backup.' } as const
      : undefined
  }
}
