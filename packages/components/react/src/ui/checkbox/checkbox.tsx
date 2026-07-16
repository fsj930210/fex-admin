import {
  checkboxClassName,
  checkboxCheckIconClassName,
  checkboxGroupClassName,
  checkboxIndicatorClassName,
  checkboxMinusIconClassName,
  type CheckboxGroupStyleProps,
  type CheckboxStyleProps,
} from '@fex/components-styles/checkbox'
import { cn } from '@fex/utils'
import type { ComponentProps } from 'react'
import {
  CheckboxIndicator,
  CheckboxGroup as PrimitiveCheckboxGroup,
  CheckboxRoot,
} from '../../primitive/checkbox/checkbox'
import { CheckIcon } from '../../icon/check'
import { MinusIcon } from '../../icon/minus'

export type { CheckboxCheckedState } from '../../primitive/checkbox/checkbox'

export interface CheckboxProps
  extends ComponentProps<typeof CheckboxRoot>,
    CheckboxStyleProps {}

export interface CheckboxGroupProps
  extends ComponentProps<typeof PrimitiveCheckboxGroup>,
    CheckboxGroupStyleProps {}

export function Checkbox({
  className,
  children,
  size,
  ...props
}: CheckboxProps) {
  return (
    <CheckboxRoot
      data-slot="checkbox"
      className={cn(checkboxClassName({ size }), className)}
      {...props}
    >
      <CheckboxIndicator
        data-slot="checkbox-indicator"
        className={checkboxIndicatorClassName}
      >
        {children ?? (
          <>
            <CheckIcon className={checkboxCheckIconClassName} />
            <MinusIcon className={checkboxMinusIconClassName} />
          </>
        )}
      </CheckboxIndicator>
    </CheckboxRoot>
  )
}

export function CheckboxGroup({
  className,
  orientation = 'vertical',
  ...props
}: CheckboxGroupProps) {
  return (
    <PrimitiveCheckboxGroup
      {...props}
      data-slot="checkbox-group"
      data-orientation={orientation}
      className={cn(checkboxGroupClassName({ orientation }), className)}
    />
  )
}

export default Checkbox
