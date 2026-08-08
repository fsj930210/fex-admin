<script lang="ts">
  import type { MentionsKey, MentionsRegisteredItem } from '@fex-design/core/mentions/types'
  import { mentionsItemClassName } from '@fex-design/styles/mentions'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import ListboxItem from '../listbox/listbox-item.svelte'
  import { useMentions } from './context'

  interface Props {
    class?: string | undefined
    itemKey?: MentionsKey | undefined
    value: string
    disabled?: boolean | undefined
    data?: unknown
    children?: Snippet | undefined
  }

  let { class: className, itemKey, value, disabled = false, data, children }: Props = $props()
  const mentions = useMentions('MentionsItem')
  const key = $derived(itemKey ?? value)
  const active = $derived(mentions.snapshot().activeKey === key)
  let unregister: (() => void) | undefined
  $effect(() => {
    unregister?.()
    const item: MentionsRegisteredItem = { key, value, disabled, data }
    unregister = mentions.controller.registerItem(item)
    return () => unregister?.()
  })
</script>

<ListboxItem
  id={mentions.listId + '-' + key}
  value={key}
  {disabled}
  class={cn(mentionsItemClassName, className)}
  onpointermove={() => mentions.controller.setActiveKey(key, 'pointer')}
  onpointerdown={(event) => event.preventDefault()}
  onSelect={() => mentions.controller.selectItem(key)}
>
  {@render children?.()}
  {#if !children}{value}{/if}
</ListboxItem>
