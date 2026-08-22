<script lang="ts">
  import FieldRoot from '@fex-design/svelte/primitive/field'
  import FieldControl from '@fex-design/svelte/primitive/field-control'
  import FieldError from '@fex-design/svelte/primitive/field-error'
  import FieldLabel from '@fex-design/svelte/primitive/field-label'
  import FieldRequiredIndicator from '@fex-design/svelte/primitive/field-required-indicator'
  import Field from '@fex-design/svelte/primitive/form-field'
  import Form from '@fex-design/svelte/primitive/form'
  import { createForm, type AnyFieldApi } from '@fex-design/svelte/primitive/form/create-form'
  import MentionsRoot from '@fex-design/svelte/primitive/mentions/root'
  import MentionsTrigger from '@fex-design/svelte/primitive/mentions/trigger'
  import MentionsContent from '@fex-design/svelte/primitive/mentions/content'
  import MentionsList from '@fex-design/svelte/primitive/mentions/list'
  import MentionsItem from '@fex-design/svelte/primitive/mentions/item'
  import Button from '@fex-design/svelte/ui/button'
  import Card from '@fex-design/svelte/ui/card'
  import { mentionUsers } from './data'

  const form = createForm(() => ({ defaultValues: { prompt: '' }, onSubmit: () => undefined }))
  const validators = {
    onSubmit: ({ value }: { value: string }) => value.trim() ? undefined : 'Prompt is required.',
  }
  const invalid = (field: AnyFieldApi) => field.state.meta.errors.length > 0
  const errors = (field: AnyFieldApi) => field.state.meta.errors.map(String)
</script>

<Card title="Form validation" description="Invalid state drives the default Textarea styling.">
  <Form {form} class="grid max-w-xl gap-space-md">
    <Field name="prompt" {validators}>
      {#snippet children(field)}
        {@const hasError = invalid(field)}
        <FieldRoot required invalid={hasError} hasError={hasError}>
          <FieldLabel>{#snippet children()}Prompt <FieldRequiredIndicator />{/snippet}</FieldLabel>
          <FieldControl>
            {#snippet children()}
              <MentionsRoot value={field.state.value} invalid={hasError} required onChange={(next) => field.handleChange(next)}>
                <MentionsTrigger placeholder="Submit empty content to see validation" />
                <MentionsContent>
                  <MentionsList>
                    {#each mentionUsers as user (user.id)}
                      <MentionsItem itemKey={user.id} value={user.name}>{#snippet children()}{user.name}{/snippet}</MentionsItem>
                    {/each}
                  </MentionsList>
                </MentionsContent>
              </MentionsRoot>
            {/snippet}
          </FieldControl>
          {#if hasError}<FieldError>{#snippet children()}{errors(field).join(', ')}{/snippet}</FieldError>{/if}
        </FieldRoot>
      {/snippet}
    </Field>
    <Button type="submit">{#snippet children()}Validate{/snippet}</Button>
  </Form>
</Card>
