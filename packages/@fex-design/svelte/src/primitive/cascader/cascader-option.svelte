<script lang="ts">
  import type { CascaderNode } from '@fex-design/core/cascader/types'
  import { cascaderOptionClassName, cascaderOptionIconClassName, cascaderOptionLabelClassName } from '@fex-design/styles/cascader'
  import { checkboxCheckIconClassName, checkboxClassName, checkboxIndicatorClassName, checkboxMinusIconClassName } from '@fex-design/styles/checkbox'
  import { getContext, type Snippet } from 'svelte'
  import CheckIcon from '../../icon/check.svelte'
  import ChevronRight from '../../icon/chevron-right.svelte'
  import LoadingIcon from '../../icon/loading.svelte'
  import MinusIcon from '../../icon/minus.svelte'
  import Checkbox from '../checkbox/checkbox.svelte'
  import CheckboxIndicator from '../checkbox/checkbox-indicator.svelte'
  import { cascaderContextKey, type CascaderContext } from './context'

  let { node, label, children }: { node: CascaderNode; label?: string; children?: Snippet<[CascaderNode, { active: boolean; selected: boolean; checked: boolean; indeterminate: boolean; loading: boolean }]> } = $props()
  const cascader = getContext<CascaderContext>(cascaderContextKey)
  const snapshot = cascader.snapshot
  const state = () => ({ active: $snapshot.activePath.includes(node.key), selected: $snapshot.selectedPathKeys.includes(node.key), checked: $snapshot.checkedKeys.includes(node.key), indeterminate: $snapshot.indeterminateKeys.includes(node.key), loading: $snapshot.loadingKeys.includes(node.key) })
</script>

<div role="option" aria-selected={state().selected} aria-disabled={node.disabled || undefined} data-active={state().active || undefined} data-selected={state().selected || undefined} data-disabled={node.disabled || undefined} class={cascaderOptionClassName} onpointerenter={() => { if (cascader.expandTrigger() === 'hover' && !node.leaf) cascader.controller.expand(node.key) }} onclick={() => cascader.controller.select(node.key)}>
  {#if children}{@render children(node, state())}{:else}{#if cascader.multiple()}<Checkbox checked={state().indeterminate ? 'indeterminate' : state().checked} disabled={node.disabled} class={checkboxClassName()} onclick={event => { event.stopPropagation(); cascader.controller.toggleCheck(node.key) }}>{#snippet children(checked)}<CheckboxIndicator {checked} class={checkboxIndicatorClassName}><CheckIcon class={checkboxCheckIconClassName}/><MinusIcon class={checkboxMinusIconClassName}/></CheckboxIndicator>{/snippet}</Checkbox>{/if}<span class={cascaderOptionLabelClassName}>{label ?? node.label}</span><span class={cascaderOptionIconClassName}>{#if state().loading}<LoadingIcon class="animate-spin"/>{:else if !node.leaf}<ChevronRight/>{:else if state().selected}<CheckIcon/>{/if}</span>{/if}
</div>
