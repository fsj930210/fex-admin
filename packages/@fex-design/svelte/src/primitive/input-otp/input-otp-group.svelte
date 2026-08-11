<script lang="ts">
  import { inputOTPGroupClassName } from '@fex-design/styles/input-otp'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  let { children, class: className, ...rest }: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props()
</script>
<div {...rest} data-slot="input-otp-group" class={cn(inputOTPGroupClassName, className)}>{@render children?.()}</div>
