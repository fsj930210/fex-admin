<script lang="ts">
  import { autoCompleteListClassName, autoCompleteOptionClassName } from '@fex/components-styles/auto-complete'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import Empty from '../empty/empty.svelte'
  import EmptyDescription from '../empty/empty-description.svelte'
  import Spinner from '../../ui/spinner/spinner.svelte'
  import { getAutoCompleteContext } from './context'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'children'> { class?: string; children?: Snippet; item?: Snippet<[Record<string, unknown>, { active: boolean; disabled: boolean }]> }
  let { class: className, children, item, ...rest }: Props = $props()
  const autoComplete = getAutoCompleteContext('AutoCompleteList')
  const snapshot = autoComplete.snapshot
</script>
<div {...rest} id={autoComplete.listId} role="listbox" class={cn(autoCompleteListClassName, className)}>
  {#if autoComplete.loading()}<div class="flex min-h-20 items-center justify-center"><Spinner /></div>
  {:else if !autoComplete.items().length}<Empty><EmptyDescription>No suggestions</EmptyDescription></Empty>
  {:else if children}{@render children()}{:else}
    {#each autoComplete.items() as entry (entry.key)}
      <div id={`${autoComplete.listId}-${entry.key}`} role="option" aria-selected={$snapshot.activeKey === entry.key} aria-disabled={entry.disabled || undefined} data-active={$snapshot.activeKey === entry.key || undefined} data-disabled={entry.disabled || undefined} class={autoCompleteOptionClassName} onpointermove={() => autoComplete.controller.setActiveKey(entry.key, 'pointer')} onpointerdown={event => event.preventDefault()} onclick={() => autoComplete.controller.selectItem(entry.key)}>
        {#if item}{@render item(entry.item, { active: $snapshot.activeKey === entry.key, disabled: entry.disabled })}{:else}{entry.label}{/if}
      </div>
    {/each}
  {/if}
</div>
