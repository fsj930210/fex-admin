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
import { InputNumber } from '@fex-design/vue/primitive/input-number'
import Button from '@fex-design/vue/ui/button'
import Card from '@fex-design/vue/ui/card'

const form = useForm({
  defaultValues: { quantity: undefined as number | undefined },
  onSubmit: () => undefined,
})
const validators = {
  onSubmit: ({ value }: { value: number | undefined }) =>
    typeof value === 'number' && value >= 1 ? undefined : 'Quantity must be at least 1.',
}
function invalid(state: AnyFieldApi['state']) {
  return state.meta.errors.length > 0
}
</script>

<template>
  <Card
    title="Form validation"
    description="Field owns validation text and ARIA relationships; InputNumber only renders invalid state."
  >
    <FormHost :form="form" class="grid max-w-xl gap-space-md">
      <Field name="quantity" :validators="validators" v-slot="{ field, state }">
        <FieldRoot required :invalid="invalid(state)" :has-error="invalid(state)">
          <FieldLabel>Quantity <FieldRequiredIndicator /></FieldLabel>
          <FieldControl v-slot="{ props }">
            <InputNumber
              v-bind="props"
              clearable
              :value="state.value"
              :min="1"
              :invalid="invalid(state)"
              @change="(_, value) => field.handleChange(value)"
              @blur="field.handleBlur"
            />
          </FieldControl>
          <FieldError v-if="invalid(state)" :errors="state.meta.errors.map(String)" />
        </FieldRoot>
      </Field>
      <Button class="w-fit" type="submit">Validate quantity</Button>
    </FormHost>
  </Card>
</template>
