<script lang="ts">
  import { inputControlClassName } from '@fex/components-styles/input'; import { cn } from '@fex/utils'; import type { HTMLInputAttributes } from 'svelte/elements'; import { getInputContext } from './context'
  interface Props extends Omit<HTMLInputAttributes, 'class' | 'value'> { class?: string }
  let { class: className, oninput, ...rest }: Props = $props(); const input = getInputContext('InputControl'); let element: HTMLInputElement
  export function focus() { element?.focus() }
  export function blur() { element?.blur() }
  // bind:this is the framework boundary that keeps the shared clear/focus controller attached to the live node.
  $effect(() => { input.setFocusElement(element) })
</script>
<input {...rest} bind:this={element} value={input.value()} disabled={input.disabled()} readonly={input.readOnly()} aria-invalid={input.invalid() || undefined} data-slot="input-control" class={cn(inputControlClassName, className)} oninput={event => { oninput?.(event); if (!event.defaultPrevented) input.setValue(event.currentTarget.value, 'input', event) }} />
