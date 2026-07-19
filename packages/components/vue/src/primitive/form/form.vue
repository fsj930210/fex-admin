<script setup lang="ts">
import { scrollToFirstError, type ScrollToFirstError } from '@fex/components-core'
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  form: { handleSubmit: () => unknown }
  component?: 'form' | false
  novalidate?: boolean
  scrollToFirstError?: ScrollToFirstError
}>(), { component: 'form' })
async function submit(event: Event) {
  const submitEvent = event as SubmitEvent
  if (submitEvent.defaultPrevented) return
  submitEvent.preventDefault()
  const element = submitEvent.currentTarget as HTMLFormElement
  await props.form.handleSubmit()
  await scrollToFirstError(element, props.scrollToFirstError ?? true)
}
</script>
<template><slot v-if="component === false" /><form v-else v-bind="$attrs" :novalidate="novalidate ?? true" @submit="submit"><slot /></form></template>
