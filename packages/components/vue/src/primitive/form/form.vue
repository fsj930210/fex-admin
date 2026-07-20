<script setup lang="ts">
import { scrollToFirstError, type ScrollToFirstError } from '@fex/components-core'
import { nextTick, provide } from 'vue'
import { formContextKey } from './form-context'
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  form: { Field: unknown; handleSubmit: () => unknown }
  component?: 'form' | false
  novalidate?: boolean
  scrollToFirstError?: ScrollToFirstError
}>(), { component: 'form' })
provide(formContextKey, props.form)
function nextTask() { return new Promise<void>((resolve) => setTimeout(resolve, 0)) }
async function submit(event: Event) {
  const submitEvent = event as SubmitEvent
  if (submitEvent.defaultPrevented) return
  submitEvent.preventDefault()
  const element = submitEvent.currentTarget as HTMLFormElement
  try {
    void Promise.resolve(props.form.handleSubmit()).catch(() => undefined)
  } catch {
    // TanStack Vue may throw synchronously for invalid submit; errors are already committed to field state.
  }
  await nextTask()
  await nextTick()
  await scrollToFirstError(element, props.scrollToFirstError ?? true)
}
</script>
<template><slot v-if="component === false" /><form v-else v-bind="$attrs" :noValidate="novalidate ?? true" @submit="submit"><slot /></form></template>
