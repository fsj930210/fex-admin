<script lang="ts">
  import FieldRoot from '@fex-design/svelte/primitive/field'
  import FieldControl from '@fex-design/svelte/primitive/field-control'
  import FieldError from '@fex-design/svelte/primitive/field-error'
  import FieldLabel from '@fex-design/svelte/primitive/field-label'
  import FieldRequiredIndicator from '@fex-design/svelte/primitive/field-required-indicator'
  import Field from '@fex-design/svelte/primitive/form-field'
  import Form from '@fex-design/svelte/primitive/form'
  import { createForm, type AnyFieldApi } from '@fex-design/svelte/primitive/form/create-form'
  import TextareaRoot from '@fex-design/svelte/primitive/textarea'
  import TextareaInput from '@fex-design/svelte/primitive/textarea-input'
  import Button from '@fex-design/svelte/ui/button'
  import Card from '@fex-design/svelte/ui/card'

  const form = createForm(() => ({
    defaultValues: { message: '' },
    onSubmit: () => undefined,
  }))
  const validators = {
    onSubmit: ({ value }: { value: string }) =>
      value.trim() ? undefined : 'Message is required.',
  }
  const invalid = (field: AnyFieldApi) => field.state.meta.errors.length > 0
  const errors = (field: AnyFieldApi) => field.state.meta.errors.map(String)
</script>

<Card
  title="Form validation"
  description="Submit the real Form empty to show Field error text and Textarea error styling."
>
  <Form {form} class="grid max-w-xl gap-space-md">
    <Field name="message" {validators}>
      {#snippet children(field)}
        {@const hasError = invalid(field)}
        <FieldRoot required invalid={hasError} hasError={hasError}>
          <FieldLabel>
            {#snippet children()}Message <FieldRequiredIndicator />{/snippet}
          </FieldLabel>
          <FieldControl>
            {#snippet children(binding)}
              <TextareaRoot
                value={field.state.value}
                invalid={hasError}
                autoSize={{ minRows: 3, maxRows: 6 }}
                onChange={(next) => field.handleChange(next)}
              >
                <TextareaInput
                  {...binding.props}
                  placeholder="Submit without content to see validation"
                  onblur={() => field.handleBlur()}
                />
              </TextareaRoot>
            {/snippet}
          </FieldControl>
          {#if hasError}
            <FieldError>
              {#snippet children()}
                {errors(field).join(', ')}
              {/snippet}
            </FieldError>
          {/if}
        </FieldRoot>
      {/snippet}
    </Field>
    <Button type="submit">
      {#snippet children()}Validate message{/snippet}
    </Button>
  </Form>
</Card>
