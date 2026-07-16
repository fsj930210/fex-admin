import type { CheckboxCheckedState } from '@fex/components-core/checkbox/types'
import type { JSX } from 'solid-js'
import { Checkbox } from '../../ui/checkbox/checkbox'

interface DataGridCheckboxProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'checked'> {
  checked: CheckboxCheckedState
  onCheckedChange: (checked: CheckboxCheckedState) => void
}

export function DataGridCheckbox(props: DataGridCheckboxProps) {
  return <Checkbox {...props} onCheckedChange={(checked) => props.onCheckedChange(checked)} />
}
