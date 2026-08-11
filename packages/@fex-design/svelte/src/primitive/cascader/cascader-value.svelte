<script lang="ts">
  import { cascaderPlaceholderClassName, cascaderValueClassName } from '@fex-design/styles/cascader'
  import { getContext } from 'svelte'
  import Tag from '../tag/tag.svelte'
  import { cascaderContextKey, type CascaderContext } from './context'
  const cascader = getContext<CascaderContext>(cascaderContextKey), snapshot = cascader.snapshot
  const selected = () => { void $snapshot.selectedPathKeys; return cascader.selectedPaths() }
  const display = (path: ReturnType<typeof selected>[number]) => cascader.displayRender?.(path.map(node => node.label), path.map(node => node.option)) ?? path.map(node => node.label).join(' / ')
</script>
{#if selected().length}
  {#if cascader.multiple()}
    {#each selected() as path (path.at(-1)?.key)}<Tag size="sm" closable onClose={event => { event.stopPropagation(); cascader.controller.removePath(path.at(-1)!.key) }}>{display(path)}</Tag>{/each}
  {:else}<div class={cascaderValueClassName}>{display(selected()[0]!)}</div>{/if}
{:else if !$snapshot.searchValue && !cascader.showSearch()}<span class={cascaderPlaceholderClassName}>{cascader.placeholder()}</span>{/if}
