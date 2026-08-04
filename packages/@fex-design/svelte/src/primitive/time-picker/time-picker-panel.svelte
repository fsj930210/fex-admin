<script lang="ts">
  import { timePickerRootClassName } from '@fex-design/styles/time-picker'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'> { class?: string | undefined; children?: Snippet | undefined }
  let { class: className, children, ...rest }: Props = $props()
</script>

<div {...rest} data-slot="time-picker-panel" class={cn(timePickerRootClassName, className)}>{@render children?.()}</div>
