import { createForm as createTanStackForm } from '@tanstack/svelte-form'
export { scrollToField } from '@fex/components-core'

export const createForm = createTanStackForm
export * from '@tanstack/svelte-form'
export type { AnyFieldApi, AnyFormApi, FormOptions } from '@tanstack/svelte-form'
