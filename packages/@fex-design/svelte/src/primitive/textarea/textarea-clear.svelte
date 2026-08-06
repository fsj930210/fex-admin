<script lang="ts">
  import { textareaClearClassName } from '@fex-design/styles/textarea'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import CloseIcon from '../../icon/close.svelte'
  import PrimitiveButton from '../button/button.svelte'
  import { getTextareaContext } from './context'

  interface Props extends Omit<HTMLButtonAttributes, 'class'> {
    class?: string | undefined
    forceMount?: boolean | undefined
    children?: Snippet | undefined
  }

  let {
    class: className,
    forceMount = false,
    children,
    onpointerdown,
    onclick,
    ...rest
  }: Props = $props()
  const textarea = getTextareaContext('TextareaClear')
</script>

{#if forceMount || textarea.canClear()}
  <PrimitiveButton
    type="button"
    aria-label="Clear textarea"
    {...rest}
    data-slot="textarea-clear"
    disabled={!forceMount && !textarea.canClear()}
    class={cn(textareaClearClassName, className)}
    onpointerdown={(event) => {
      onpointerdown?.(event)
      if (!event.defaultPrevented) event.preventDefault()
    }}
    onclick={(event) => {
      onclick?.(event)
      if (!event.defaultPrevented) textarea.clear()
    }}
  >
    {#if children}{@render children()}{:else}<CloseIcon />{/if}
  </PrimitiveButton>
{/if}
