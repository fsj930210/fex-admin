import { compileFieldRuleProps, scrollToFirstError, type ScrollToFirstError } from '@fex/components-core'
import { useForm as useTanStackForm } from '@tanstack/react-form'
import { type ComponentProps, type FormEvent, type ReactNode, type Ref } from 'react'
import { useLazyRef } from '../../hooks/use-lazy-ref'

export interface FormApiLike { handleSubmit: () => unknown }
export type FormProps =
  | ({ component?: 'form'; form: FormApiLike; ref?: Ref<HTMLFormElement>; scrollToFirstError?: ScrollToFirstError } & Omit<ComponentProps<'form'>, 'onSubmit'> & { onSubmit?: (event: FormEvent<HTMLFormElement>) => void })
  | { component: false; form: FormApiLike; children?: ReactNode }

export function Form(props: FormProps) {
  if (props.component === false) return <>{props.children}</>
  const { component: _component, form, onSubmit, scrollToFirstError: scrollOption = true, children, ...formProps } = props
  return <form {...formProps} noValidate={formProps.noValidate ?? true} onSubmit={(event) => {
    onSubmit?.(event)
    if (event.defaultPrevented) return
    event.preventDefault()
    const element = event.currentTarget
    void Promise.resolve(form.handleSubmit()).then(() => scrollToFirstError(element, scrollOption))
  }}>{children}</form>
}

function useEnhancedForm(options: Parameters<typeof useTanStackForm>[0]) {
  const form = useTanStackForm(options)
  const enhancedFormRef = useLazyRef(() => {
    const TanStackField = form.Field
    const EnhancedField = ((props: Parameters<typeof TanStackField>[0]) => {
      const fieldProps = compileFieldRuleProps(props as never, form as never)
      return <TanStackField {...fieldProps as unknown as Parameters<typeof TanStackField>[0]} />
    }) as typeof TanStackField
    form.Field = EnhancedField
    return form
  })
  return enhancedFormRef.current
}

export const useForm = useEnhancedForm as unknown as typeof useTanStackForm

export * from '@tanstack/react-form'
