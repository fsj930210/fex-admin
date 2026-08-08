import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  FieldRequiredIndicator,
  FieldRoot,
} from '@fex-design/solid/primitive/field'
import { createForm, Form } from '@fex-design/solid/primitive/form'
import { MentionsContent } from '@fex-design/solid/primitive/mentions/content'
import { MentionsItem } from '@fex-design/solid/primitive/mentions/item'
import { MentionsList } from '@fex-design/solid/primitive/mentions/list'
import { MentionsRoot } from '@fex-design/solid/primitive/mentions/root'
import { MentionsTrigger } from '@fex-design/solid/primitive/mentions/trigger'
import { Button } from '@fex-design/solid/ui/button'
import { Card } from '@fex-design/solid/ui/card'
import { For } from 'solid-js'
import { mentionUsers } from './data'

function errorsOf(value: unknown) {
  return Array.isArray(value) ? value.map(String) : []
}

export function ValidationDemo() {
  const form = createForm(() => ({ defaultValues: { prompt: '' }, onSubmit: async () => undefined }))
  return (
    <Card title="Form validation" description="Invalid state drives the default system Textarea styling.">
      <Form form={form} class="grid max-w-xl gap-space-md">
        <Field name="prompt" validators={{ onSubmit: ({ value }) => String(value).trim() ? undefined : 'Prompt is required.' }}>
          {(field) => {
            const errors = () => errorsOf(field().state.meta.errors)
            const invalid = () => errors().length > 0
            return (
              <FieldRoot required invalid={invalid()} hasError={invalid()}>
                <FieldLabel>Prompt <FieldRequiredIndicator /></FieldLabel>
                <FieldControl>
                  {() => (
                    <MentionsRoot value={String(field().state.value)} onChange={(next) => field().handleChange(next)} invalid={invalid()} required>
                      <MentionsTrigger placeholder="Submit empty content to see validation" />
                      <MentionsContent>
                        <MentionsList><For each={mentionUsers}>{(user) => <MentionsItem itemKey={user.id} value={user.name}>{user.name}</MentionsItem>}</For></MentionsList>
                      </MentionsContent>
                    </MentionsRoot>
                  )}
                </FieldControl>
                <FieldError errors={errors()} />
              </FieldRoot>
            )
          }}
        </Field>
        <Button class="w-fit" type="submit">Validate</Button>
      </Form>
    </Card>
  )
}
