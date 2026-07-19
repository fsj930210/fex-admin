import { compileFieldRuleProps } from '@fex/components-core'
import { useForm as useTanStackForm } from '@tanstack/vue-form'
import { defineComponent, h } from 'vue'

export { default as Form } from './form.vue'

function useEnhancedForm(options: Parameters<typeof useTanStackForm>[0]) {
  const form = useTanStackForm(options)
  const TanStackField = form.Field
  form.Field = defineComponent({
    name: 'FexFormField',
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(TanStackField as never, compileFieldRuleProps(attrs as never, form as never) as never, slots)
    },
  }) as unknown as typeof TanStackField
  return form
}

export const useForm = useEnhancedForm as unknown as typeof useTanStackForm
export * from '@tanstack/vue-form'
