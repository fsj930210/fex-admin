import { createForm as createTanStackForm } from '@tanstack/svelte-form'
import EnhancedField from './enhanced-field.svelte'

function createEnhancedForm(options: Parameters<typeof createTanStackForm>[0]) {
  const form = createTanStackForm(options)
  const TanStackField = form.Field
  form.Field = ((internal: unknown, props: Record<string, unknown>) => EnhancedField(internal as never, {
    ...props,
    fieldComponent: TanStackField,
    form,
  })) as unknown as typeof TanStackField
  return form
}

export const createForm = createEnhancedForm as unknown as typeof createTanStackForm
export * from '@tanstack/svelte-form'
export type { AnyFieldApi, AnyFormApi, FormOptions } from '@tanstack/svelte-form'
