<script lang="ts">
  import TextareaInput from '../textarea/textarea-input.svelte'
  import TextareaRoot from '../textarea/textarea-root.svelte'
  import type { MentionsSnapshot } from '@fex-design/core/mentions/types'
  import type { Snippet } from 'svelte'
  import { useMentions } from './context'

  interface Props {
    class?: string | undefined
    placeholder?: string | undefined
    children?: Snippet<[
      {
        props: Record<string, unknown>
        state: MentionsSnapshot
      },
    ]>
  }

  const mentions = useMentions('MentionsTrigger')
  let { class: className, placeholder, children }: Props = $props()
  let element = $state<HTMLTextAreaElement | null>(null)
  let composing = false

  function selection(target = element) {
    return { start: target?.selectionStart ?? 0, end: target?.selectionEnd ?? 0 }
  }
  function input(event: Event) {
    const target = event.target as HTMLTextAreaElement
    mentions.controller.setValue(target.value, selection(target))
  }
  function eventSelection(event: Event) {
    mentions.controller.setSelection(selection(event.currentTarget as HTMLTextAreaElement))
  }
  function keydown(event: KeyboardEvent) {
    if (composing) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      mentions.controller.setOpen(true, 'keyboard')
      mentions.controller.moveActive(event.key === 'ArrowDown' ? 1 : -1)
    } else if ((event.key === 'Enter' || event.key === 'Tab') && mentions.snapshot().open) {
      if (mentions.controller.selectActive()) event.preventDefault()
    } else if (event.key === 'Escape') mentions.controller.setOpen(false, 'escape')
  }
  const customProps = $derived({
    value: mentions.snapshot().value,
    disabled: mentions.disabled(),
    readOnly: mentions.readOnly(),
    required: mentions.required(),
    role: 'combobox',
    'aria-expanded': mentions.snapshot().open,
    'aria-controls': mentions.listId,
    'aria-activedescendant':
      mentions.snapshot().activeKey === undefined
        ? undefined
        : mentions.listId + '-' + mentions.snapshot().activeKey,
    'aria-invalid': mentions.invalid() || undefined,
    'aria-required': mentions.required() || undefined,
    oninput: input,
    onkeydown: keydown,
    onclick: eventSelection,
    onselect: eventSelection,
    onfocus: eventSelection,
    onblur: () => mentions.controller.setOpen(false, 'blur'),
    oncompositionstart: () => (composing = true),
    oncompositionend: (event: Event) => {
      composing = false
      input(event)
    },
  })
</script>

{#if children}
  {@render children({ props: customProps, state: mentions.snapshot() })}
{:else}
  <TextareaRoot
    class={className}
    value={mentions.snapshot().value}
    disabled={mentions.disabled()}
    readOnly={mentions.readOnly()}
    invalid={mentions.invalid()}
  >
    <TextareaInput
      bind:this={element}
      {placeholder}
      role="combobox"
      aria-expanded={mentions.snapshot().open}
      aria-controls={mentions.listId}
      aria-activedescendant={mentions.snapshot().activeKey === undefined
        ? undefined
        : mentions.listId + '-' + mentions.snapshot().activeKey}
      aria-required={mentions.required() || undefined}
      oninput={input}
      onkeydown={keydown}
      onkeyup={input}
      onclick={eventSelection}
      onselect={eventSelection}
      onfocus={eventSelection}
      onblur={() => mentions.controller.setOpen(false, 'blur')}
      oncompositionstart={() => (composing = true)}
      oncompositionend={(event) => {
        composing = false
        input(event)
      }}
    />
  </TextareaRoot>
{/if}
