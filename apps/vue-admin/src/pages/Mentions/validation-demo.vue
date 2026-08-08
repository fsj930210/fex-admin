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
import MentionsContent from '@fex-design/vue/primitive/mentions/content'
import MentionsItem from '@fex-design/vue/primitive/mentions/item'
import MentionsList from '@fex-design/vue/primitive/mentions/list'
import MentionsRoot from '@fex-design/vue/primitive/mentions/root'
import MentionsTrigger from '@fex-design/vue/primitive/mentions/trigger'
import Button from '@fex-design/vue/ui/button'
import Card from '@fex-design/vue/ui/card'
import { mentionUsers } from './data'

const form = useForm({ defaultValues: { prompt: '' }, onSubmit: () => undefined })
const validators = {
  onSubmit: ({ value }: { value: string }) => value.trim() ? undefined : 'Prompt is required.',
}
function invalid(state: AnyFieldApi['state']) {
  return state.meta.errors.length > 0
}
function errors(items: unknown[]) {
  return items.map(String)
}
</script>

<template>
  <Card title="Form validation" description="Field invalid state drives the default Textarea styling.">
    <FormHost :form="form" class="grid max-w-xl gap-space-md">
      <Field name="prompt" :validators="validators" v-slot="{ field, state }">
        <FieldRoot required :invalid="invalid(state)" :has-error="invalid(state)">
          <FieldLabel>Prompt <FieldRequiredIndicator /></FieldLabel>
          <FieldControl>
            <MentionsRoot
              :value="state.value"
              :invalid="invalid(state)"
              required
              @change="field.handleChange"
            >
              <MentionsTrigger placeholder="Submit empty content to see validation" />
              <MentionsContent>
                <MentionsList>
                  <MentionsItem v-for="user in mentionUsers" :key="user.id" :item-key="user.id" :value="user.name">
                    {{ user.name }}
                  </MentionsItem>
                </MentionsList>
              </MentionsContent>
            </MentionsRoot>
          </FieldControl>
          <FieldError v-if="invalid(state)" :errors="errors(state.meta.errors)" />
        </FieldRoot>
      </Field>
      <Button type="submit">Validate</Button>
    </FormHost>
  </Card>
</template>
