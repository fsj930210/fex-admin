<script setup lang="ts">
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  FieldRequiredIndicator,
  FieldRoot,
} from '@fex-design/vue/primitive/field'
import { Form as FormHost, useForm, type AnyFieldApi } from '@fex-design/vue/primitive/form'
import { TextareaInput, TextareaRoot } from '@fex-design/vue/primitive/textarea'
import Button from '@fex-design/vue/ui/button'
import Card from '@fex-design/vue/ui/card'

const form = useForm({
  defaultValues: { message: '' },
  onSubmit: () => undefined,
})
const validators = {
  onSubmit: ({ value }: { value: string }) =>
    value.trim() ? undefined : 'Message is required.',
}
function invalid(state: AnyFieldApi['state']) {
  return state.meta.errors.length > 0
}
function errors(items: unknown[]) {
  return items.map(String)
}
</script>

<template>
  <Card
    title="Form validation"
    description="Submit the real Form empty to show Field error text and Textarea error styling."
  >
    <FormHost :form="form" class="grid max-w-xl gap-space-md">
      <Field name="message" :validators="validators" v-slot="{ field, state }">
        <FieldRoot required :invalid="invalid(state)" :has-error="invalid(state)">
          <FieldLabel>Message <FieldRequiredIndicator /></FieldLabel>
          <FieldControl v-slot="{ props }">
            <TextareaRoot
              :value="state.value"
              :invalid="invalid(state)"
              :auto-size="{ minRows: 3, maxRows: 6 }"
              @change="field.handleChange"
            >
              <TextareaInput
                v-bind="props"
                placeholder="Submit without content to see validation"
                @blur="field.handleBlur"
              />
            </TextareaRoot>
          </FieldControl>
          <FieldError v-if="invalid(state)" :errors="errors(state.meta.errors)" />
        </FieldRoot>
      </Field>
      <Button type="submit">Validate message</Button>
    </FormHost>
  </Card>
</template>
