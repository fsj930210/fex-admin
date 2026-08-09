import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  FieldRequiredIndicator,
  FieldRoot,
} from '@fex-design/react/primitive/field'
import { Form, useForm } from '@fex-design/react/primitive/form'
import { InputNumber } from '@fex-design/react/primitive/input-number'
import { Button } from '@fex-design/react/ui/button'
import { Card } from '@fex-design/react/ui/card'

export function ValidationDemo() {
  const form = useForm({
    defaultValues: { quantity: undefined as number | undefined },
    onSubmit: async () => undefined,
  })
  return (
    <Card
      title="Form validation"
      description="Field owns validation text and ARIA relationships; InputNumber only renders invalid state."
    >
      <Form form={form} className="grid max-w-xl gap-space-md">
        <Field
          name="quantity"
          validators={{
            onSubmit: ({ value }) =>
              typeof value === 'number' && value >= 1 ? undefined : 'Quantity must be at least 1.',
          }}
        >
          {(field) => {
            const errors = Array.isArray(field.state.meta.errors)
              ? field.state.meta.errors.map(String)
              : []
            const invalid = errors.length > 0
            return (
              <FieldRoot required invalid={invalid} hasError={invalid}>
                <FieldLabel>
                  Quantity <FieldRequiredIndicator />
                </FieldLabel>
                <FieldControl>
                  {({ props }) => (
                    <InputNumber
                      {...props}
                      value={field.state.value as number | undefined}
                      min={1}
                      clearable
                      invalid={invalid}
                      onChange={(_, value) => field.handleChange(value)}
                      onBlur={field.handleBlur}
                    />
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
