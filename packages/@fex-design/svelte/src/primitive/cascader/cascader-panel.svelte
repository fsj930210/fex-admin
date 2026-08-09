<script lang="ts">
  import type { CascaderNode } from '@fex-design/core/cascader/types'
  import { cascaderColumnClassName, cascaderColumnViewportClassName, cascaderEmptyClassName, cascaderLoadingClassName, cascaderOptionClassName, cascaderOptionIconClassName, cascaderOptionLabelClassName, cascaderPanelClassName, cascaderPanelHeight } from '@fex-design/styles/cascader'
  import { checkboxCheckIconClassName, checkboxClassName, checkboxIndicatorClassName, checkboxMinusIconClassName } from '@fex-design/styles/checkbox'
  import { getContext } from 'svelte'
  import CheckIcon from '../../icon/check.svelte'
  import ChevronRight from '../../icon/chevron-right.svelte'
  import LoadingIcon from '../../icon/loading.svelte'
  import MinusIcon from '../../icon/minus.svelte'
  import Checkbox from '../checkbox/checkbox.svelte'
  import CheckboxIndicator from '../checkbox/checkbox-indicator.svelte'
  import Scrollbar from '../scrollbar/scrollbar.svelte'
  import ScrollbarBar from '../scrollbar/scrollbar-bar.svelte'
  import ScrollbarViewport from '../scrollbar/scrollbar-viewport.svelte'
  import { cascaderContextKey, type CascaderContext } from './context'

  const cascader = getContext<CascaderContext>(cascaderContextKey)
  const snapshot = cascader.snapshot
  const state = (node: CascaderNode) => ({ active: $snapshot.activePath.includes(node.key), selected: $snapshot.selectedPathKeys.includes(node.key), checked: $snapshot.checkedKeys.includes(node.key), indeterminate: $snapshot.indeterminateKeys.includes(node.key), loading: $snapshot.loadingKeys.includes(node.key) })
  const columns = () => { void $snapshot.activePath; return cascader.controller.getColumns() }
  const results = () => { void $snapshot.searchValue; return cascader.controller.getSearchResults() }
  const height = () => cascaderPanelHeight($snapshot.searchValue && cascader.showSearch() ? (cascader.loading() ? 0 : results().length) : Math.max(0, ...columns().map(column => column.nodes.length)))
  const columnCount = () => $snapshot.searchValue && cascader.showSearch() ? 1 : Math.max(1, columns().length)
  const enter = (node: CascaderNode) => { if (cascader.expandTrigger() === 'hover' && !node.leaf) cascader.controller.expand(node.key) }
</script>

{#snippet option(node: CascaderNode, label?: string)}
  <div role="option" aria-selected={state(node).selected} aria-disabled={node.disabled || undefined} data-active={state(node).active || undefined} data-selected={state(node).selected || undefined} data-disabled={node.disabled || undefined} class={cascaderOptionClassName} onpointerenter={() => enter(node)} onclick={() => cascader.controller.select(node.key)}>
    {#if cascader.multiple()}<Checkbox checked={state(node).indeterminate ? 'indeterminate' : state(node).checked} disabled={node.disabled} class={checkboxClassName()} onclick={event => { event.stopPropagation(); cascader.controller.toggleCheck(node.key) }}>{#snippet children(checked)}<CheckboxIndicator {checked} class={checkboxIndicatorClassName}><CheckIcon class={checkboxCheckIconClassName}/><MinusIcon class={checkboxMinusIconClassName}/></CheckboxIndicator>{/snippet}</Checkbox>{/if}
    <span class={cascaderOptionLabelClassName}>{label ?? node.label}</span><span class={cascaderOptionIconClassName}>{#if state(node).loading}<LoadingIcon class="animate-spin"/>{:else if !node.leaf}<ChevronRight/>{:else if state(node).selected}<CheckIcon/>{/if}</span>
  </div>
{/snippet}

<div class={cascaderPanelClassName} style={`--cascader-column-count:${columnCount()};--cascader-panel-height:${height()}`}>
  {#if $snapshot.searchValue && cascader.showSearch()}
    <div class={`${cascaderColumnClassName} w-full min-w-full border-r-0`}><Scrollbar class="h-full"><ScrollbarViewport overflowX="hidden" overflowY="auto" class={cascaderColumnViewportClassName}>{#if cascader.loading()}<div class={cascaderLoadingClassName}><LoadingIcon class="animate-spin"/>Loading...</div>{:else if results().length}{#each results() as path (path.at(-1)!.key)}{@render option(path.at(-1)!, path.map(node => node.label).join(' / '))}{/each}{:else}<div class={cascaderEmptyClassName}>No options</div>{/if}</ScrollbarViewport><ScrollbarBar axis="y"/></Scrollbar></div>
  {:else}
    {#each columns() as column, index (column.parentKey ?? 'root')}<div role="listbox" aria-label={`Level ${index + 1}`} class={cascaderColumnClassName}><Scrollbar class="h-full"><ScrollbarViewport overflowX="hidden" overflowY="auto" class={cascaderColumnViewportClassName}>{#each column.nodes as node (node.key)}{@render option(node)}{/each}</ScrollbarViewport><ScrollbarBar axis="y"/></Scrollbar></div>{/each}
  {/if}
</div>
