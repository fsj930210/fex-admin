import { inject, provide } from 'vue'

export type FormDemoContext = Record<string, any>

const formDemoContextKey = Symbol('FormDemoContext')

export function provideFormDemoContext(context: FormDemoContext) {
  provide(formDemoContextKey, context)
}

export function useFormDemoContext() {
  const context = inject<FormDemoContext>(formDemoContextKey)
  if (!context) throw new Error('Form demo context is missing.')
  return context
}
