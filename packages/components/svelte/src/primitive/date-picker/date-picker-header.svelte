<script lang="ts">
  import { datePickerHeaderClassName } from '@fex/components-styles/date-picker'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet
  }
  let { class: className, children, ...rest }: Props = $props()
</script>

<div {...rest} data-slot="date-picker-header" class={cn(datePickerHeaderClassName, className)}>
  {@render children?.()}
</div>
