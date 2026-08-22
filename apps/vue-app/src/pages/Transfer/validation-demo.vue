<script setup lang="ts">
import { Field, FieldControl, FieldLabel, FieldRoot } from '@fex-design/vue/primitive/field'
import { Form, useForm } from '@fex-design/vue/primitive/form'
import { Transfer } from '@fex-design/vue/primitive/transfer'
import Button from '@fex-design/vue/ui/button'
import Card from '@fex-design/vue/ui/card'
import { fieldNames, members } from './data'
const form = useForm({
  defaultValues: { members: [] as readonly (string | number)[] },
  onSubmit: () => undefined,
})
const validators = {
  onSubmit: ({ value }: { value: readonly (string | number)[] }) =>
    value.length === 0 ? 'Select at least one member.' : undefined,
}
</script>
<template>
  <Card
    title="Form validation states"
    description="Submit the real Form empty to see the error state; selecting exactly one member shows the warning style."
    ><Form :form="form" class="space-y-space-lg"
      ><Field name="members" :validators="validators" v-slot="{ field, state }"
        ><FieldRoot
          :invalid="state.meta.errors.length > 0"
          :has-error="state.meta.errors.length > 0"
          ><FieldLabel>Project members</FieldLabel
          ><FieldControl
            ><Transfer
              :items="members"
              :field-names="fieldNames"
              :target-keys="state.value"
              :validation="
                state.meta.errors.length
                  ? { status: 'error', message: String(state.meta.errors[0]) }
                  : state.value.length === 1
                    ? {
                        status: 'warning',
                        message: 'Only one member is assigned; consider adding a backup.',
                      }
                    : undefined
              "
              @change="field.handleChange($event)" /></FieldControl></FieldRoot></Field
      ><Button type="submit">Validate assignment</Button></Form
    ></Card
  >
</template>
