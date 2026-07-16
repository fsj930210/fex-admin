import type { CheckboxCheckedState } from '@fex/components-core/checkbox/types'
import type { ButtonHTMLAttributes } from 'react'
import { Checkbox } from '../../ui/checkbox/checkbox'

interface DataGridCheckboxProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'checked' | 'defaultChecked'> {
  checked: CheckboxCheckedState
  onCheckedChange: (checked: CheckboxCheckedState) => void
}

export function DataGridCheckbox({ checked, onCheckedChange, ...props }: DataGridCheckboxProps) {
  return (
    <Checkbox
      {...props}
      checked={checked}
      onCheckedChange={onCheckedChange}
    />
  )
}
