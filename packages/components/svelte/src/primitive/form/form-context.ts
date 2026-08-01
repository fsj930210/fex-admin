import { getContext, setContext } from 'svelte'
import { createForm as createTanStackForm } from '@tanstack/svelte-form'

export type FormInstance = ReturnType<typeof createTanStackForm>

const key = Symbol('FexForm')

export function setFormContext(form: FormInstance) {
  setContext(key, form)
}

export function getFormContext() {
  const form = getContext<FormInstance>(key)
  if (!form) throw new Error('Field must be used inside Form.')
  return form
}
