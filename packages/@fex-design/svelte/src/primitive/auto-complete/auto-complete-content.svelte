<script lang="ts">
  import { autoCompleteContentClassName } from '@fex-design/styles/auto-complete'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import PopoverContent from '../popover/popover-content.svelte'
  import PopoverPortal from '../popover/popover-portal.svelte'
  import AutoCompleteList from './auto-complete-list.svelte'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> { class?: string; children?: Snippet }
  let { class: className, children, style, ...rest }: Props = $props()
</script>
<PopoverPortal><PopoverContent {...rest} class={cn(autoCompleteContentClassName, className)} style={`width:var(--auto-complete-content-width,var(--floating-reference-width));max-width:var(--auto-complete-content-width,var(--floating-reference-width));${style ?? ''}`}>{#if children}{@render children()}{:else}<AutoCompleteList />{/if}</PopoverContent></PopoverPortal>
