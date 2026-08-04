<script lang="ts">
  import { autoCompleteOptionClassName } from '@fex-design/styles/auto-complete'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getAutoCompleteContext } from './context'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'children'> { itemKey: string | number; class?: string; children?: Snippet }
  let { itemKey, class: className, children, ...rest }: Props = $props()
  const autoComplete = getAutoCompleteContext('AutoCompleteOption')
  const snapshot = autoComplete.snapshot
  const entry = $derived(autoComplete.items().find(item => item.key === itemKey))
</script>
<div {...rest} id={`${autoComplete.listId}-${itemKey}`} role="option" aria-selected={$snapshot.activeKey === itemKey} aria-disabled={entry?.disabled || undefined} data-active={$snapshot.activeKey === itemKey || undefined} data-disabled={entry?.disabled || undefined} class={cn(autoCompleteOptionClassName, className)} onpointermove={() => autoComplete.controller.setActiveKey(itemKey, 'pointer')} onpointerdown={event => event.preventDefault()} onclick={() => autoComplete.controller.selectItem(itemKey)}>{@render children?.()}</div>
