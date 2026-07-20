import { useForm as useTanStackForm } from '@tanstack/vue-form'

export { default as Form } from './form.vue'
export { useFormContext } from './form-context'
export { scrollToField } from '@fex/components-core'

export const useForm = useTanStackForm
export * from '@tanstack/vue-form'
