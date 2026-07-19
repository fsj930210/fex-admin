import { compileFieldRuleProps, scrollToFirstError, type ScrollToFirstError } from '@fex/components-core'
import { createForm as createTanStackForm } from '@tanstack/solid-form'
import { createComponent, splitProps, type JSX, type ParentProps } from 'solid-js'

export type FormProps = ParentProps<{ component?: 'form' | false; form: { handleSubmit: () => unknown }; scrollToFirstError?: ScrollToFirstError } & JSX.FormHTMLAttributes<HTMLFormElement>>
export function Form(props: FormProps) {
  const [local, rest] = splitProps(props, ['component', 'form', 'children', 'onSubmit', 'scrollToFirstError'])
  if (local.component === false) return local.children
  return <form {...rest} noValidate={rest.noValidate ?? true} onSubmit={(event) => {
    if (typeof local.onSubmit === 'function') local.onSubmit(event)
    if (event.defaultPrevented) return
    event.preventDefault()
    const element = event.currentTarget
    void Promise.resolve(local.form.handleSubmit()).then(() => scrollToFirstError(element, local.scrollToFirstError ?? true))
  }}>{local.children}</form>
}

function createEnhancedForm(options: Parameters<typeof createTanStackForm>[0]) {
  const form = createTanStackForm(options)
  const TanStackField = form.Field
  form.Field = ((props: Parameters<typeof TanStackField>[0]) => createComponent(
    TanStackField,
    compileFieldRuleProps(props as never, form as never) as unknown as Parameters<typeof TanStackField>[0],
  )) as typeof TanStackField
  return form
}

export const createForm = createEnhancedForm as unknown as typeof createTanStackForm
export * from '@tanstack/solid-form'
