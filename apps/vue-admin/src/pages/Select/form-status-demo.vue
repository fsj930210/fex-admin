<script setup lang="ts">
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  FieldRoot,
} from '@fex/components-vue/primitive/field'
import { Form, useForm } from '@fex/components-vue/primitive/form'
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-vue/primitive/select'
import Button from '@fex/components-vue/ui/button'
import { frameworkOptions } from './data'
import Demo from './demo-section.vue'
const form = useForm({ defaultValues: { framework: '' }, onSubmit: () => undefined })
const required = {
  onSubmit: ({ value }: { value: string }) => (value ? '' : 'Please select a framework'),
}
</script>
<template>
  <Demo
    title="Form validation status"
    description="A real Form and Field drive Select error presentation."
    ><Form :form="form" class="space-y-space-md"
      ><Field name="framework" :validators="required" v-slot="{ field, state }"
        ><FieldRoot
          :invalid="state.meta.errors.length > 0"
          :has-error="state.meta.errors.length > 0"
          ><FieldLabel>Framework</FieldLabel
          ><FieldControl
            ><SelectRoot
              :value="state.value"
              :status="state.meta.errors.length ? 'error' : undefined"
              :options="frameworkOptions"
              @change="field.handleChange($event)"
              ><SelectTrigger placeholder="请选择" /><SelectContent /></SelectRoot></FieldControl
          ><FieldError :errors="state.meta.errors" /></FieldRoot></Field
      ><Button type="submit">Validate</Button></Form
    ></Demo
  >
</template>
