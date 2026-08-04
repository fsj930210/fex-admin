<script lang="ts">
  import { datePickerHeaderTitleClassName } from '@fex-design/styles/date-picker'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet
  }
  let { class: className, children, ...rest }: Props = $props()
</script>

<div {...rest} data-slot="date-picker-header-title" class={cn(datePickerHeaderTitleClassName, className)}>
  {@render children?.()}
</div>
