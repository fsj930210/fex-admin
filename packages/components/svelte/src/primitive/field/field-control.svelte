<script lang="ts">
  import type { Snippet } from 'svelte'
  import { getFieldContext } from './context'
  export interface FieldControlBinding { props: Record<string, boolean | string | undefined>; state: { disabled: boolean; invalid: boolean; readOnly: boolean; required: boolean } }
  let { children }: { children: Snippet<[FieldControlBinding]> } = $props()
  const field = getFieldContext('FieldControl')
  const binding = $derived.by(() => { const describedBy = [field.hasDescription() ? field.descriptionId() : '', field.hasError() ? field.errorId() : ''].filter(Boolean).join(' ') || undefined; return { props: { id: field.controlId(), required: field.required() || undefined, disabled: field.disabled() || undefined, readonly: field.readOnly() || undefined, 'aria-required': field.required() || undefined, 'aria-invalid': field.invalid() || undefined, 'aria-describedby': describedBy, 'aria-errormessage': field.invalid() && field.hasError() ? field.errorId() : undefined }, state: { disabled: field.disabled(), invalid: field.invalid(), readOnly: field.readOnly(), required: field.required() } } })
</script>
{@render children(binding)}
