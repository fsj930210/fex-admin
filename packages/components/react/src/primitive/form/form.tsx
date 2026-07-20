import { scrollToField, type ScrollToFirstError } from '@fex/components-core'
import { useForm as useTanStackForm } from '@tanstack/react-form'
import { createContext, type ComponentProps, type FormEvent, type ReactNode, type Ref, use } from 'react'

export interface FormApiLike {
  Field: unknown
  handleSubmit: () => unknown
}
export type FormProps =
  | ({ component?: 'form'; form: FormApiLike; ref?: Ref<HTMLFormElement>; scrollToFirstError?: ScrollToFirstError } & Omit<ComponentProps<'form'>, 'onSubmit'> & { onSubmit?: (event: FormEvent<HTMLFormElement>) => void })
  | { component: false; form: FormApiLike; children?: ReactNode }

const FormContext = createContext<FormApiLike | null>(null)

export function useFormContext() {
  const form = use(FormContext)
  if (!form) throw new Error('Field must be used inside Form.')
  return form
}

export function Form(props: FormProps) {
  if (props.component === false) return <FormContext value={props.form}>{props.children}</FormContext>
  const { component: _component, form, onSubmit, scrollToFirstError: scrollOption = true, children, ...formProps } = props
  return <FormContext value={form}><form {...formProps} noValidate={formProps.noValidate ?? true} onSubmit={(event) => {
    onSubmit?.(event)
    if (event.defaultPrevented) return
    event.preventDefault()
    const element = event.currentTarget
    void Promise.resolve(form.handleSubmit()).then(() => {
      if (!scrollOption) return
      void scrollToField(element, undefined, scrollOption)
    })
  }}>{children}</form></FormContext>
}

export const useForm = useTanStackForm

export { scrollToField } from '@fex/components-core'
export type { AnyFieldApi, AnyFormApi, FormOptions } from '@tanstack/react-form'
