<script lang="ts">
  import { getFormContext } from '../form/form-context'
  import type { AnyFieldApi } from '@tanstack/svelte-form'
  import type { Snippet } from 'svelte'
  import FieldNameProvider from './field-name-provider.svelte'

  let { name, children: child, ...props }: { name: string; children?: Snippet<[AnyFieldApi]>; [key: string]: unknown } = $props()
  const form = getFormContext()
  const FieldComponent = form.Field
</script>

<FieldComponent {name} {...props}>
  {#snippet children(field)}
    <FieldNameProvider name={String(field.name ?? name)}>
      {@render child?.(field)}
    </FieldNameProvider>
  {/snippet}
</FieldComponent>
