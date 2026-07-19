<script lang="ts">
  import { scrollToFirstError, type ScrollToFirstError } from '@fex/components-core'
  import type { AnyFormApi } from '@tanstack/svelte-form'
  import type { HTMLFormAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'
  let { form, component = 'form', children, onsubmit, scrollToFirstError: scrollOption = true, ...rest }: HTMLFormAttributes & { form: AnyFormApi; component?: 'form' | false; children?: Snippet; scrollToFirstError?: ScrollToFirstError } = $props()
  async function submit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) { onsubmit?.(event); if (event.defaultPrevented) return; event.preventDefault(); const element = event.currentTarget; await form.handleSubmit(); await scrollToFirstError(element, scrollOption) }
</script>
{#if component === false}{@render children?.()}{:else}<form {...rest} novalidate={rest.novalidate ?? true} onsubmit={submit}>{@render children?.()}</form>{/if}
