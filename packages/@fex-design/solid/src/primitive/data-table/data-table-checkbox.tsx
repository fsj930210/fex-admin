import type { CheckboxCheckedState } from '@fex-design/core/checkbox/types'
import type { JSX } from 'solid-js'
import { Checkbox } from '../../ui/checkbox/checkbox'

interface DataTableCheckboxProps extends Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'checked'
> {
  checked: CheckboxCheckedState
  onCheckedChange: (checked: CheckboxCheckedState) => void
}

export function DataTableCheckbox(props: DataTableCheckboxProps) {
  return <Checkbox {...props} onCheckedChange={(checked) => props.onCheckedChange(checked)} />
}
