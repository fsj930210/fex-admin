import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  FieldRoot,
  FieldRequiredIndicator,
} from '@fex-design/react/primitive/field'
import { Form, useForm } from '@fex-design/react/primitive/form'
import { TextareaInput, TextareaRoot } from '@fex-design/react/primitive/textarea'
import { Button } from '@fex-design/react/ui/button'
import { Card } from '@fex-design/react/ui/card'

function errorsOf(value: unknown) {
  return Array.isArray(value) ? value.map(String) : []
}

export function ValidationDemo() {
  const form = useForm({
    defaultValues: { message: '' },
    onSubmit: async () => undefined,
  })

  return (
    <Card
      title="Form validation"
      description="Submit with an empty value to see Field invalid state drive TextareaRoot styling."
    >
      <Form form={form} className="grid max-w-xl gap-space-md">
        <Field
          name="message"
          validators={{
            onSubmit: ({ value }) =>
              String(value).trim() ? undefined : 'Message is required.',
          }}
        >
          {(field) => {
            const errors = errorsOf(field.state.meta.errors)
            const invalid = errors.length > 0
            return (
              <FieldRoot required invalid={invalid} hasError={invalid}>
                <FieldLabel>
                  Message <FieldRequiredIndicator />
                </FieldLabel>
                <TextareaRoot
                  value={String(field.state.value)}
                  onChange={(next) => field.handleChange(next)}
                  invalid={invalid}
                  autoSize={{ minRows: 3, maxRows: 6 }}
                >
                  <FieldControl>
                    {({ props }) => (
                      <TextareaInput
                        {...props}
                        onBlur={field.handleBlur}
                        placeholder="Submit empty content to trigger validation"
                      />
                    )}
                  </FieldControl>
                </TextareaRoot>
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
