<script lang="ts">
  import { getFormContext } from '../form/form-context'
  import type { Component, Snippet } from 'svelte'
  import FieldNameProvider from './field-name-provider.svelte'

  let { name, children: child, ...props }: { name: string; children?: Snippet<[any]>; [key: string]: unknown } = $props()
  const form = getFormContext()
  const FieldComponent = form.Field as Component
</script>

<FieldComponent {name} {...props}>
  {#snippet children(field)}
    <FieldNameProvider name={String(field.name ?? name)}>
      {@render child?.(field)}
    </FieldNameProvider>
  {/snippet}
</FieldComponent>
