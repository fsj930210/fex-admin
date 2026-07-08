import {
  checkboxCheckIconClassName,
  checkboxClassName,
  checkboxGroupClassName,
  checkboxIndicatorClassName,
  checkboxMinusIconClassName,
  type CheckboxGroupStyleProps,
  type CheckboxStyleProps,
} from '@fex/components-styles/checkbox'
import { cn } from '@fex/utils'
import { splitProps, type JSX, type ParentProps } from 'solid-js'
import { CheckIcon } from '../../icon/check'
import { MinusIcon } from '../../icon/minus'
import { CheckboxGroup as PrimitiveCheckboxGroup, CheckboxIndicator, CheckboxRoot, type CheckboxRootProps } from '../../primitive/checkbox/checkbox'

export type { CheckboxCheckedState } from '../../primitive/checkbox/checkbox'

export interface CheckboxProps extends ParentProps<CheckboxRootProps>, CheckboxStyleProps {}

export function Checkbox(props: CheckboxProps) {
  const [local, rest] = splitProps(props, ['class', 'size', 'children'])
  return (
    <CheckboxRoot {...rest} data-slot="checkbox" class={cn(checkboxClassName({ size: local.size }), local.class)}>
      <CheckboxIndicator data-slot="checkbox-indicator" class={checkboxIndicatorClassName}>
        {local.children ?? (
          <>
            <CheckIcon class={checkboxCheckIconClassName} />
            <MinusIcon class={checkboxMinusIconClassName} />
          </>
        )}
      </CheckboxIndicator>
    </CheckboxRoot>
  )
}

export interface CheckboxGroupProps extends ParentProps<JSX.HTMLAttributes<HTMLDivElement>>, CheckboxGroupStyleProps {}

export function CheckboxGroup(props: CheckboxGroupProps) {
  const [local, rest] = splitProps(props, ['class', 'orientation'])
  return (
    <PrimitiveCheckboxGroup
      {...rest}
      data-slot="checkbox-group"
      data-orientation={local.orientation ?? 'vertical'}
      class={cn(checkboxGroupClassName({ orientation: local.orientation ?? 'vertical' }), local.class)}
    />
  )
}

export default Checkbox
