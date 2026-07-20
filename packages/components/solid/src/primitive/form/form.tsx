import { scrollToFirstError, type ScrollToFirstError } from '@fex/components-core'
import { createForm as createTanStackForm } from '@tanstack/solid-form'
import { createContext, splitProps, useContext, type JSX, type ParentProps } from 'solid-js'

export interface FormApiLike { Field: unknown; handleSubmit: () => unknown }
const FormContext = createContext<FormApiLike>()

export function useFormContext() {
  const form = useContext(FormContext)
  if (!form) throw new Error('Field must be used inside Form.')
  return form
}

export type FormProps = ParentProps<{ component?: 'form' | false; form: FormApiLike; scrollToFirstError?: ScrollToFirstError } & JSX.FormHTMLAttributes<HTMLFormElement>>
export function Form(props: FormProps) {
  const [local, rest] = splitProps(props, ['component', 'form', 'children', 'onSubmit', 'scrollToFirstError'])
  const content = () => local.component === false ? local.children : <form {...rest} noValidate={rest.noValidate ?? true} onSubmit={(event) => {
    if (typeof local.onSubmit === 'function') local.onSubmit(event)
    if (event.defaultPrevented) return
    event.preventDefault()
    const element = event.currentTarget
    void Promise.resolve(local.form.handleSubmit()).then(() => scrollToFirstError(element, local.scrollToFirstError ?? true))
  }}>{local.children}</form>
  return <FormContext.Provider value={local.form}>{content()}</FormContext.Provider>
}

export const createForm = createTanStackForm
export { scrollToField } from '@fex/components-core'
export * from '@tanstack/solid-form'
