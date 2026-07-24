import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  FieldRoot,
} from '@fex/components-solid/primitive/field'
import { createForm, Form } from '@fex/components-solid/primitive/form'
import { SelectContent, SelectRoot, SelectTrigger } from '@fex/components-solid/primitive/select'
import { Button } from '@fex/components-solid/ui/button'
import { Show } from 'solid-js'
import { frameworkOptions } from './data'
import { SelectDemoSection as Demo } from './demo-section'
export function FormStatusDemo() {
  const form = createForm(() => ({ defaultValues: { framework: '' }, onSubmit: () => undefined }))
  return (
    <Demo
      title="Form validation"
      description="Submit the real form without a value to produce Select error state."
    >
      <Form form={form} class="space-y-space-md">
        <Field
          name="framework"
          validators={{
            onSubmit: ({ value }: { value: string }) =>
              value ? undefined : 'Please select a framework',
          }}
        >
          {(field) => {
            const errors = () => field().state.meta.errors.map(String),
              invalid = () => errors().length > 0
            return (
              <FieldRoot invalid={invalid()} hasError={invalid()}>
                <FieldLabel>Framework</FieldLabel>
                <FieldControl>
                  {({ props }) => (
                    <SelectRoot
                      value={field().state.value as string}
                      status={invalid() ? 'error' : undefined}
                      options={frameworkOptions}
                      onChange={(value) => field().handleChange(String(value ?? ''))}
                    >
                      <SelectTrigger {...props} placeholder="请选择" />
                      <SelectContent />
                    </SelectRoot>
                  )}
                </FieldControl>
                <Show when={invalid()}>
                  <FieldError errors={errors()} />
                </Show>
              </FieldRoot>
            )
          }}
        </Field>
        <Button type="submit">Validate</Button>
      </Form>
    </Demo>
  )
}
