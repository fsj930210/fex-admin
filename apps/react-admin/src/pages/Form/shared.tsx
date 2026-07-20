import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldRequiredIndicator,
  FieldRoot,
  type FieldProps,
} from '@fex/components-react/primitive/field'
import { InputControl, InputRoot } from '@fex/components-react/primitive/input'
import { type AnyFieldApi } from '@fex/components-react/primitive/form'
import { type ReactNode } from 'react'

export const locations = {
  浙江: ['杭州', '宁波', '温州'],
  江苏: ['南京', '苏州', '无锡'],
  广东: ['广州', '深圳', '珠海'],
} as const

export const selectClassName = 'h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20'

export type SetDemoResult = (result: string) => void

export function errorsOf(field: AnyFieldApi) {
  return field.state.meta.errors.map(String)
}

interface TextFieldProps {
  description?: ReactNode
  label: ReactNode
  name: string
  placeholder?: string
  required?: boolean
  type?: 'email' | 'password' | 'text'
  validators?: FieldProps['validators']
}

export function TextField({
  description,
  label,
  name,
  placeholder,
  required = false,
  type = 'text',
  validators,
}: TextFieldProps) {
  return (
    <Field name={name} validators={validators}>
      {(field) => {
        const invalid = field.state.meta.isTouched && !field.state.meta.isValid

        return (
          <FieldRoot required={required} invalid={invalid} hasDescription={Boolean(description)} hasError={invalid}>
            <FieldLabel>
              {label} {required && <FieldRequiredIndicator />}
            </FieldLabel>
            <FieldControl>
              {({ props }) => (
                <InputRoot value={field.state.value as string} onValueChange={field.handleChange} invalid={invalid}>
                  <InputControl {...props} placeholder={placeholder} type={type} onBlur={field.handleBlur} />
                </InputRoot>
              )}
            </FieldControl>
            {description && <FieldDescription>{description}</FieldDescription>}
            {invalid && <FieldError errors={errorsOf(field)} />}
          </FieldRoot>
        )
      }}
    </Field>
  )
}
