<script lang="ts">
  import { inputClearClassName } from '@fex/components-styles/input'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import CloseIcon from '../../icon/close.svelte'
  import PrimitiveButton from '../button/button.svelte'
  import { getInputContext } from './context'

  interface Props extends Omit<HTMLButtonAttributes, 'class'> {
    class?: string
    forceMount?: boolean
    children?: Snippet
  }

  let {
    class: className,
    forceMount = false,
    children,
    onpointerdown,
    onclick,
    ...rest
  }: Props = $props()
  const input = getInputContext('InputClear')
</script>

{#if forceMount || input.canClear()}
  <PrimitiveButton
    type="button"
    aria-label="Clear input"
    {...rest}
    data-slot="input-clear"
    disabled={!input.canClear()}
    class={cn(inputClearClassName, className)}
    onpointerdown={(event) => {
      onpointerdown?.(event)
      if (!event.defaultPrevented) event.preventDefault()
    }}
    onclick={(event) => {
      onclick?.(event)
      if (!event.defaultPrevented) input.clear()
    }}
  >
    {#if children}{@render children()}{:else}<CloseIcon />{/if}
  </PrimitiveButton>
{/if}
