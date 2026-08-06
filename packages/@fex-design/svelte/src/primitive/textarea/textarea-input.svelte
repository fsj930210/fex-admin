<script lang="ts">
  import { textareaInputClassName } from '@fex-design/styles/textarea'
  import { cn } from '@fex/utils'
  import type { HTMLTextareaAttributes } from 'svelte/elements'
  import { getTextareaContext } from './context'

  interface Props extends Omit<HTMLTextareaAttributes, 'class' | 'value'> {
    class?: string | undefined
  }

  let { class: className, oninput, ...rest }: Props = $props()
  const textarea = getTextareaContext('TextareaInput')
  let element: HTMLTextAreaElement | undefined = undefined
  let observer: ResizeObserver | undefined

  export function focus() { element?.focus() }
  export function blur() { element?.blur() }

  $effect(() => {
    textarea.setFocusElement(element ?? null)
    if (!element || !textarea.autoSize() || typeof ResizeObserver === 'undefined') return
    observer?.disconnect()
    observer = new ResizeObserver(() => textarea.syncAutoSize())
    observer.observe(element)
    return () => observer?.disconnect()
  })

  $effect(() => {
    textarea.value()
    textarea.autoSize()
    textarea.syncAutoSize()
  })
</script>

<textarea
  {...rest}
  bind:this={element}
  value={textarea.value()}
  disabled={textarea.disabled()}
  readonly={textarea.readOnly()}
  aria-invalid={textarea.invalid() || undefined}
  data-slot="textarea-input"
  class={cn(textareaInputClassName, className)}
  oninput={(event) => {
    oninput?.(event)
    if (!event.defaultPrevented) textarea.setValue(event.currentTarget.value, 'input', event)
  }}
></textarea>
