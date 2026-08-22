import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  FieldRequiredIndicator,
  FieldRoot,
} from '@fex-design/solid/primitive/field'
import { createForm, Form } from '@fex-design/solid/primitive/form'
import { TextareaInput, TextareaRoot } from '@fex-design/solid/primitive/textarea'
import { Button } from '@fex-design/solid/ui/button'
import { Card } from '@fex-design/solid/ui/card'

function errorsOf(value: unknown) {
  return Array.isArray(value) ? value.map(String) : []
}

export function ValidationDemo() {
  const form = createForm(() => ({
    defaultValues: { message: '' },
    onSubmit: async () => undefined,
  }))

  return (
    <Card
      title="Form validation"
      description="Submit with an empty value to see Field invalid state drive TextareaRoot styling."
    >
      <Form form={form} class="grid max-w-xl gap-space-md">
        <Field
          name="message"
          validators={{
            onSubmit: ({ value }) =>
              String(value).trim() ? undefined : 'Message is required.',
          }}
        >
          {(field) => {
            const errors = () => errorsOf(field().state.meta.errors)
            const invalid = () => errors().length > 0
            return (
              <FieldRoot required invalid={invalid()} hasError={invalid()}>
                <FieldLabel>
                  Message <FieldRequiredIndicator />
                </FieldLabel>
                <TextareaRoot
                  value={String(field().state.value)}
                  onChange={(next) => field().handleChange(next)}
                  invalid={invalid()}
                  autoSize={{ minRows: 3, maxRows: 6 }}
                >
                  <FieldControl>
                    {({ props }) => (
                      <TextareaInput
                        {...props}
                        onBlur={field().handleBlur}
                        placeholder="Submit empty content to trigger validation"
                      />
                    )}
                  </FieldControl>
                </TextareaRoot>
                <FieldError errors={errors()} />
              </FieldRoot>
            )
          }}
        </Field>
        <Button class="w-fit" type="submit">
          Validate
        </Button>
      </Form>
    </Card>
  )
}
