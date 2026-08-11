<script lang="ts">
  import { inputOTPSeparatorClassName } from '@fex-design/styles/input-otp'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  let { children, class: className, ...rest }: HTMLAttributes<HTMLSpanElement> & { children?: Snippet } = $props()
</script>
<span {...rest} aria-hidden="true" data-slot="input-otp-separator" class={cn(inputOTPSeparatorClassName, className)}>{#if children}{@render children()}{:else}–{/if}</span>
