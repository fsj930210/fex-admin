import type { CheckboxCheckedState } from '@fex-design/core/checkbox/types'
import type { ButtonHTMLAttributes } from 'react'
import { Checkbox } from '../../ui/checkbox/checkbox'

interface DataTableCheckboxProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'checked' | 'defaultChecked'
> {
  checked: CheckboxCheckedState
  onCheckedChange: (checked: CheckboxCheckedState) => void
}

export function DataTableCheckbox({ checked, onCheckedChange, ...props }: DataTableCheckboxProps) {
  return <Checkbox {...props} checked={checked} onCheckedChange={onCheckedChange} />
}
