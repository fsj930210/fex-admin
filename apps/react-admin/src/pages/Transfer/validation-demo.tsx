import { Field, FieldControl, FieldLabel, FieldRoot } from '@fex/components-react/primitive/field'
import { Form, useForm } from '@fex/components-react/primitive/form'
import { Button } from '@fex/components-react/ui/button'
import { Transfer } from '@fex/components-react/primitive/transfer'
import { transferFieldNames, transferMembers } from './data'
import { TransferDemoSection } from './demo-section'

export function ValidationTransferDemo() {
  const form = useForm({
    defaultValues: { members: [] as readonly (string | number)[] },
    onSubmit: () => undefined,
  })
  return (
    <TransferDemoSection
      title="Form validation states"
      description="Submit the real Form empty to see the error state; selecting exactly one member shows the warning style."
    >
      <Form form={form} className="space-y-space-lg">
        <Field
          name="members"
          validators={{
            onSubmit: ({ value }) =>
              (value as readonly (string | number)[]).length === 0
                ? 'Select at least one member.'
                : undefined,
          }}
        >
          {(field) => {
            const errors = field.state.meta.errors.map(String)
            const invalid = errors.length > 0
            const targetKeys = field.state.value as readonly (string | number)[]
            const warning = !invalid && targetKeys.length === 1
            return (
              <FieldRoot invalid={invalid} hasError={invalid}>
                <FieldLabel>Project members</FieldLabel>
                <FieldControl>
                  {({ props }) => (
                    <Transfer
                      {...props}
                      data-testid="validation-transfer"
                      items={transferMembers}
                      fieldNames={transferFieldNames}
                      targetKeys={targetKeys}
                      onChange={(keys) => field.handleChange(keys)}
                      validation={
                        invalid
                          ? { status: 'error', message: errors[0] }
                          : warning
                            ? {
                                status: 'warning',
                                message: 'Only one member is assigned; consider adding a backup.',
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
    </TransferDemoSection>
  )
}
