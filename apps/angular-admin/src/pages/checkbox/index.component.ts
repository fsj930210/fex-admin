import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { CheckboxRoot } from '@fex/components-angular/primitive/checkbox'
import { Checkbox, CheckboxGroupUi } from '@fex/components-angular/ui/checkbox'
import Card from '@fex/components-angular/ui/card'

const options = [
  { label: 'Read records', value: 'read' },
  { label: 'Create records', value: 'create' },
  { label: 'Export data', value: 'export' },
] as const

type PermissionValue = (typeof options)[number]['value']
type CheckboxCheckedState = boolean | 'indeterminate'

function nextValues(
  current: PermissionValue[],
  value: PermissionValue,
  checked: CheckboxCheckedState,
) {
  if (checked === true) {
    return current.includes(value) ? current : [...current, value]
  }
  return current.filter((item) => item !== value)
}

@Component({
  selector: 'fex-checkbox-page',
  standalone: true,
  imports: [RouterLink, CheckboxRoot, Checkbox, CheckboxGroupUi, Card],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent {
  protected readonly options = options
  protected readonly controlled = signal<CheckboxCheckedState>(false)
  protected readonly partialValue = signal<PermissionValue[]>(['read'])
  protected readonly permissions = signal<PermissionValue[]>(['read'])
  protected readonly optionValues = options.map((option) => option.value)
  protected readonly allChecked = computed(
    () => this.partialValue().length === this.optionValues.length,
  )
  protected readonly partialChecked = computed(
    () => this.partialValue().length > 0 && !this.allChecked(),
  )
  protected readonly checkAllState = computed(() =>
    this.partialChecked() ? 'indeterminate' : this.allChecked(),
  )

  protected setPartialValue(value: PermissionValue, checked: CheckboxCheckedState) {
    this.partialValue.update((current) => nextValues(current, value, checked))
  }

  protected setPermission(value: PermissionValue, checked: CheckboxCheckedState) {
    this.permissions.update((current) => nextValues(current, value, checked))
  }
}
