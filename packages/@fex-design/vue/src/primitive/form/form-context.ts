import { inject, type InjectionKey } from 'vue'

export interface FormApiLike {
  Field: unknown
  handleSubmit: () => unknown
}

export const formContextKey: InjectionKey<FormApiLike> = Symbol('FexForm')

export function useFormContext() {
  const form = inject(formContextKey)
  if (!form) throw new Error('Field must be used inside Form.')
  return form
}
