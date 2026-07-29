<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { datePickerPresetClassName } from '@fex/components-styles/date-picker'
  import Button from '../button/button.svelte'
  interface Props extends Omit<HTMLButtonAttributes, 'children' | 'class'> { class?: string; children?: Snippet }
  let { class: className, children, ...rest }: Props = $props()
</script>

<Button {...rest} data-slot="date-picker-preset" class={className ? `${datePickerPresetClassName} ${className}` : datePickerPresetClassName}>
  {@render children?.()}
</Button>
