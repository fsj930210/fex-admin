import { Field, FieldControl, FieldLabel, FieldRoot } from '@fex/components-solid/primitive/field'
import { createForm, Form } from '@fex/components-solid/primitive/form'
import { Transfer } from '@fex/components-solid/primitive/transfer'
import { Button } from '@fex/components-solid/ui/button'
import { Card } from '@fex/components-solid/ui/card'
import { fieldNames, members } from './data'
export function ValidationDemo() {
  const form = createForm(() => ({
    defaultValues: { members: [] as readonly (string | number)[] },
    onSubmit: () => undefined,
  }))
  return (
    <Card
      title="Form validation states"
      description="Submit the real Form empty to see the error state; selecting exactly one member shows the warning style."
    >
      <Form form={form} class="space-y-space-lg">
        <Field
          name="members"
          validators={{
            onSubmit: ({ value }: { value: readonly (string | number)[] }) =>
              value.length === 0 ? 'Select at least one member.' : undefined,
          }}
        >
          {(field) => {
            const errors = () => field().state.meta.errors.map(String),
              invalid = () => errors().length > 0,
              warning = () => !invalid() && field().state.value.length === 1
            return (
              <FieldRoot invalid={invalid()} hasError={invalid()}>
                <FieldLabel>Project members</FieldLabel>
                <FieldControl>
                  {() => (
                    <Transfer
                      items={members}
                      fieldNames={fieldNames}
                      targetKeys={field().state.value}
                      onChange={(keys) => field().handleChange(keys)}
                      validation={
                        invalid()
                          ? { status: 'error', message: <>{errors()[0]}</> }
                          : warning()
                            ? {
                                status: 'warning',
                                message: (
                                  <>Only one member is assigned; consider adding a backup.</>
                                ),
                              }
                            : undefined
                      }
                    />
                  )}
                </FieldControl>
              </FieldRoot>
            )
          }}
        </Field>
        <Button type="submit">Validate assignment</Button>
      </Form>
    </Card>
  )
}
