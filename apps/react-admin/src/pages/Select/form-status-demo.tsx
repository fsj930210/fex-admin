import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  FieldRequiredIndicator,
  FieldRoot,
} from '@fex/components-react/primitive/field'
import { Form, useForm } from '@fex/components-react/primitive/form'
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-react/primitive/select'
import { Button } from '@fex/components-react/ui/button'
import { frameworkOptions } from './data'
import { SelectDemoSection } from './demo-section'

export function FormStatusDemo() {
  const form = useForm({
    defaultValues: { framework: '' },
    onSubmit: () => undefined,
  })
  return (
    <SelectDemoSection
      title="Form validation"
      description="Submit the real form without a value to produce Select error state and field feedback."
    >
      <Form form={form} className="space-y-space-md">
        <Field
          name="framework"
          validators={{ onSubmit: ({ value }) => (value ? undefined : '请选择框架') }}
        >
          {(field) => {
            const errors = field.state.meta.errors.map(String)
            const invalid = errors.length > 0
            return (
              <FieldRoot required invalid={invalid} hasError={invalid}>
                <FieldLabel>
                  前端框架 <FieldRequiredIndicator />
                </FieldLabel>
                <FieldControl>
                  {({ props }) => (
                    <SelectRoot
                      value={field.state.value}
                      status={invalid ? 'error' : undefined}
                      options={frameworkOptions}
                      onChange={(value) => field.handleChange(String(value ?? ''))}
                    >
                      <SelectTrigger {...props} placeholder="请选择框架" />
                      <SelectContent>
                        <SelectList />
                      </SelectContent>
                    </SelectRoot>
                  )}
                </FieldControl>
                {invalid ? <FieldError errors={errors} /> : null}
              </FieldRoot>
            )
          }}
        </Field>
        <Button type="submit">提交校验</Button>
      </Form>
    </SelectDemoSection>
  )
}
