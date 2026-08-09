<script lang="ts">
  import FieldRoot from '@fex-design/svelte/primitive/field'
  import FieldControl from '@fex-design/svelte/primitive/field-control'
  import FieldError from '@fex-design/svelte/primitive/field-error'
  import FieldLabel from '@fex-design/svelte/primitive/field-label'
  import FieldRequiredIndicator from '@fex-design/svelte/primitive/field-required-indicator'
  import Field from '@fex-design/svelte/primitive/form-field'
  import Form from '@fex-design/svelte/primitive/form'
  import { createForm, type AnyFieldApi } from '@fex-design/svelte/primitive/form/create-form'
  import InputNumber from '@fex-design/svelte/primitive/input-number'
  import Button from '@fex-design/svelte/ui/button'
  import Card from '@fex-design/svelte/ui/card'

  const form = createForm(() => ({
    defaultValues: { quantity: undefined as number | undefined },
    onSubmit: () => undefined,
  }))
  const validators = {
    onSubmit: ({ value }: { value: number | undefined }) =>
      typeof value === 'number' && value >= 1 ? undefined : 'Quantity must be at least 1.',
  }
  const invalid = (field: AnyFieldApi) => field.state.meta.errors.length > 0
  const errors = (field: AnyFieldApi) => field.state.meta.errors.map(String)
</script>

<Card
  title="Form validation"
  description="Field owns validation text and ARIA relationships; InputNumber only renders invalid state."
>
  <Form {form} class="grid max-w-xl gap-space-md">
    <Field name="quantity" {validators}>
      {#snippet children(field)}
        {@const hasError = invalid(field)}
        <FieldRoot required invalid={hasError} hasError={hasError}>
          <FieldLabel>
            {#snippet children()}Quantity <FieldRequiredIndicator />{/snippet}
          </FieldLabel>
          <FieldControl>
            {#snippet children(binding)}
              <InputNumber
                {...binding.props}
                clearable
                value={field.state.value}
                min={1}
                invalid={hasError}
                onChange={(_, value) => field.handleChange(value)}
                onblur={() => field.handleBlur()}
              />
            {/snippet}
          </FieldControl>
          {#if hasError}
            <FieldError>
              {#snippet children()}{errors(field).join(', ')}{/snippet}
            </FieldError>
          {/if}
        </FieldRoot>
      {/snippet}
    </Field>
    <Button class="w-fit" type="submit">
      {#snippet children()}Validate quantity{/snippet}
    </Button>
  </Form>
</Card>
