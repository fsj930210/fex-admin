import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  FieldRoot,
  FieldRequiredIndicator,
} from '@fex-design/react/primitive/field'
import { Form, useForm } from '@fex-design/react/primitive/form'
import { MentionsContent } from '@fex-design/react/primitive/mentions/content'
import { MentionsItem } from '@fex-design/react/primitive/mentions/item'
import { MentionsList } from '@fex-design/react/primitive/mentions/list'
import { MentionsRoot } from '@fex-design/react/primitive/mentions/root'
import { MentionsTrigger } from '@fex-design/react/primitive/mentions/trigger'
import { useMentions } from '@fex-design/react/primitive/mentions/use-mentions'
import { Button } from '@fex-design/react/ui/button'
import { Card } from '@fex-design/react/ui/card'
import { filterByText, mentionUsers } from './data'

function errorsOf(value: unknown) {
  return Array.isArray(value) ? value.map(String) : []
}

function UserItems() {
  const mentions = useMentions()
  return (
    <MentionsList>
      {filterByText(mentionUsers, mentions.text, (user) => user.name).map((user) => (
        <MentionsItem key={user.id} itemKey={user.id} value={user.name} data={user}>
          {user.name}
        </MentionsItem>
      ))}
    </MentionsList>
  )
}

export function ValidationDemo() {
  const form = useForm({ defaultValues: { prompt: '' }, onSubmit: async () => undefined })
  return (
    <Card title="Form validation" description="Invalid state drives the default system Textarea styling.">
      <Form form={form} className="grid max-w-xl gap-space-md">
        <Field
          name="prompt"
          validators={{ onSubmit: ({ value }) => (String(value).trim() ? undefined : 'Prompt is required.') }}
        >
          {(field) => {
            const errors = errorsOf(field.state.meta.errors)
            const invalid = errors.length > 0
            return (
              <FieldRoot required invalid={invalid} hasError={invalid}>
                <FieldLabel>
                  Prompt <FieldRequiredIndicator />
                </FieldLabel>
                <FieldControl>
                  {() => (
                    <MentionsRoot
                      value={String(field.state.value)}
                      onChange={(next) => field.handleChange(next)}
                      invalid={invalid}
                      required
                    >
                      <MentionsTrigger placeholder="Submit empty content to see validation" />
                      <MentionsContent>
                        <UserItems />
                      </MentionsContent>
                    </MentionsRoot>
                  )}
                </FieldControl>
                <FieldError errors={errors} />
              </FieldRoot>
            )
          }}
        </Field>
        <Button className="w-fit" type="submit">
          Validate
        </Button>
      </Form>
    </Card>
  )
}
