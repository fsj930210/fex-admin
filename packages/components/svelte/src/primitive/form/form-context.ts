import { getContext, setContext } from 'svelte'
import type { AnyFormApi } from '@tanstack/svelte-form'

const key = Symbol('FexForm')

export function setFormContext(form: AnyFormApi) {
  setContext(key, form)
}

export function getFormContext() {
  const form = getContext<AnyFormApi>(key)
  if (!form) throw new Error('Field must be used inside Form.')
  return form
}
