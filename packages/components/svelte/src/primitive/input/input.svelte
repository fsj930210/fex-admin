<script lang="ts">
  import { inputClassName } from '@fex/components-styles/input'
  import { cn } from '@fex/utils'
  import type { HTMLInputAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLInputAttributes, 'class'> { class?: string }
  let { class: className, ...rest }: Props = $props()
  const classList = $derived(cn(inputClassName, className))
</script>
<input {...rest} data-slot="input" class={classList} />
