<script lang="ts">
  import { createTransferController } from '@fex/components-core/transfer/create-transfer-controller'
  import type { TransferControllerOptions, TransferDataItem, TransferKey, TransferSide, TransferSnapshot } from '@fex/components-core/transfer/types'
  import { readTransferDisabled, readTransferKey, resolveTransferFieldNames } from '@fex/components-core/transfer/utils'
  import { buttonClassName } from '@fex/components-styles/button'
  import { checkboxCheckIconClassName, checkboxClassName, checkboxIndicatorClassName, checkboxMinusIconClassName } from '@fex/components-styles/checkbox'
  import { listboxItemClassName, listboxRootClassName } from '@fex/components-styles/listbox'
  import { transferActionsClassName, transferLayoutClassName, transferMessageClassName, transferPanelBodyClassName, transferPanelFooterClassName, transferPanelHeaderClassName, transferRootClassName, transferSourcePanelClassName, transferTargetPanelClassName, transferWarningMessageClassName } from '@fex/components-styles/transfer'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import { readableCoreStore } from '../../stores/core-store'
  import CheckIcon from '../../icon/check.svelte'
  import MinusIcon from '../../icon/minus.svelte'
  import ChevronLeftIcon from '../../icon/chevron-left.svelte'
  import ChevronRightIcon from '../../icon/chevron-right.svelte'
  import ChevronsLeftIcon from '../../icon/chevrons-left.svelte'
  import ChevronsRightIcon from '../../icon/chevrons-right.svelte'
  import Button from '../button/button.svelte'
  import Checkbox from '../checkbox/checkbox.svelte'
  import CheckboxIndicator from '../checkbox/checkbox-indicator.svelte'
  import Listbox from '../listbox/listbox.svelte'
  import ListboxItem from '../listbox/listbox-item.svelte'

  export interface TransferPanelApi<TItem extends TransferDataItem> { side: TransferSide; items: readonly TItem[]; checkedKeys: readonly TransferKey[]; controller: ReturnType<typeof createTransferController<TItem>>; setCheckedKeys(keys: readonly TransferKey[]): void; isChecked(key: TransferKey): boolean }
  interface Props<TItem extends TransferDataItem> extends TransferControllerOptions<TItem> { title?: { source?: string; target?: string }; sourceHeader?: Snippet<[TransferPanelApi<TItem>]>; sourceBody?: Snippet<[TransferPanelApi<TItem>]>; sourceFooter?: Snippet<[TransferPanelApi<TItem>]>; targetHeader?: Snippet<[TransferPanelApi<TItem>]>; targetBody?: Snippet<[TransferPanelApi<TItem>]>; targetFooter?: Snippet<[TransferPanelApi<TItem>]>; actions?: Snippet<[ReturnType<typeof createTransferController<TItem>>, TransferSnapshot<TItem>]>; item?: Snippet<[TItem, TransferSide]>; validation?: { status: 'error' | 'warning'; message: string }; class?: string }
  let { items, fieldNames, disabled, targetKeys, defaultTargetKeys, checkedKeys, defaultCheckedKeys, onChange, onCheckedChange, title = {}, sourceHeader, sourceBody, sourceFooter, targetHeader, targetBody, targetFooter, actions, item, validation, class: className }: Props<TransferDataItem> = $props()
  const currentOptions = () => ({ items, fieldNames, disabled, targetKeys, defaultTargetKeys, checkedKeys, defaultCheckedKeys, onChange, onCheckedChange })
  const controller = createTransferController(currentOptions())
  const snapshot = readableCoreStore(controller)
  $effect(() => { controller.updateOptions(currentOptions()) })
  const fields = $derived(resolveTransferFieldNames(fieldNames))
  function api(side: TransferSide): TransferPanelApi<TransferDataItem> { const source = side === 'source'; const keys = source ? $snapshot.sourceCheckedKeys : $snapshot.targetCheckedKeys; return { side, items: source ? $snapshot.sourceItems : $snapshot.targetItems, checkedKeys: keys, controller, setCheckedKeys: source ? controller.setSourceCheckedKeys : controller.setTargetCheckedKeys, isChecked: (key) => keys.includes(key) } }
  function enabledKeys(side: TransferSide) { return api(side).items.filter((entry) => !readTransferDisabled(entry, fields)).map((entry) => readTransferKey(entry, fields)) }
  function checkedState(side: TransferSide) { const keys = enabledKeys(side); const count = keys.filter((key) => api(side).checkedKeys.includes(key)).length; return count === keys.length && keys.length > 0 ? true : count > 0 ? 'indeterminate' as const : false }
  function toggleAll(side: TransferSide, checked: boolean) { api(side).setCheckedKeys(checked ? enabledKeys(side) : []) }
  function can(action: 'target' | 'source' | 'allTarget' | 'allSource') { void $snapshot; return action === 'target' ? controller.canMoveToTarget() : action === 'source' ? controller.canMoveToSource() : action === 'allTarget' ? controller.canMoveAllToTarget() : controller.canMoveAllToSource() }
  function change(side: TransferSide, value: unknown) { api(side).setCheckedKeys(Array.isArray(value) ? value as TransferKey[] : value == null ? [] : [value as TransferKey]) }
</script>

<div data-slot="transfer-root" data-invalid={validation?.status === 'error' || undefined} aria-invalid={validation?.status === 'error' || undefined} class={cn(transferRootClassName, validation?.status === 'warning' && '[&_[data-slot=transfer-panel]]:border-warning [&_[data-slot=transfer-panel]]:ring-3 [&_[data-slot=transfer-panel]]:ring-warning/20', className)}>
  <div data-slot="transfer-layout" class={transferLayoutClassName}>
    {#each ['source', 'target'] as side (side)}
      {@const typedSide = side as TransferSide}{@const panel = api(typedSide)}{@const header = typedSide === 'source' ? sourceHeader : targetHeader}{@const body = typedSide === 'source' ? sourceBody : targetBody}{@const footer = typedSide === 'source' ? sourceFooter : targetFooter}
      <section data-slot="transfer-panel" data-side={typedSide} class={cn(typedSide === 'source' ? transferSourcePanelClassName : transferTargetPanelClassName, 'row-start-1', typedSide === 'source' ? 'col-start-1' : 'col-start-3')}>
        <header data-slot="transfer-panel-header" class={transferPanelHeaderClassName}>
          {#if header}{@render header(panel)}{:else}<Checkbox checked={checkedState(typedSide)} disabled={disabled || enabledKeys(typedSide).length === 0} class={checkboxClassName()} aria-label={`Select all ${title[typedSide] ?? (typedSide === 'source' ? 'Source' : 'Target')}`} onCheckedChange={(next) => toggleAll(typedSide, next === true)}>{#snippet children(current)}<CheckboxIndicator checked={current} class={checkboxIndicatorClassName}>{#snippet children()}<CheckIcon class={checkboxCheckIconClassName}/><MinusIcon class={checkboxMinusIconClassName}/>{/snippet}</CheckboxIndicator>{/snippet}</Checkbox><span class="min-w-0 flex-1 truncate font-medium">{title[typedSide] ?? (typedSide === 'source' ? 'Source' : 'Target')}</span><span class="shrink-0 text-muted-foreground">{panel.checkedKeys.length}/{panel.items.length}</span>{/if}
        </header>
        <div data-slot="transfer-panel-body" class={transferPanelBodyClassName}>{#if body}{@render body(panel)}{:else}<Listbox data-variant="transfer" multiple {disabled} items={panel.items} value={panel.checkedKeys} getItemValue={(entry) => readTransferKey(entry, fields)} getItemDisabled={(entry) => disabled || readTransferDisabled(entry, fields)} onChange={(value) => change(typedSide, value)} class={listboxRootClassName({ variant: 'transfer' })}>{#snippet children()}{#each panel.items as entry (readTransferKey(entry, fields))}{@const key = readTransferKey(entry, fields)}<ListboxItem value={key} class={listboxItemClassName({ size: 'sm' })}>{#snippet children()}<span aria-hidden="true" data-checked={panel.isChecked(key) || undefined} class="flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-border text-primary-foreground data-[checked=true]:border-primary data-[checked=true]:bg-primary">{#if panel.isChecked(key)}<CheckIcon class="size-3" />{/if}</span><span class="min-w-0 flex-1 truncate text-sm">{#if item}{@render item(entry, typedSide)}{:else}{entry[fields.label]}{/if}</span>{/snippet}</ListboxItem>{/each}{/snippet}</Listbox>{/if}</div>
        {#if footer}<footer data-slot="transfer-panel-footer" class={transferPanelFooterClassName}>{@render footer(panel)}</footer>{/if}
      </section>
    {/each}
    <div data-slot="transfer-actions" class={cn(transferActionsClassName, 'col-start-2 row-start-1')}>{#if actions}{@render actions(controller, $snapshot)}{:else}<Button class={buttonClassName({ variant: 'outline', size: 'icon' })} disabled={!can('target')} aria-label="Move selected to target" onclick={controller.moveToTarget}>{#snippet children()}<ChevronRightIcon />{/snippet}</Button><Button class={buttonClassName({ variant: 'outline', size: 'icon' })} disabled={!can('source')} aria-label="Move selected to source" onclick={controller.moveToSource}>{#snippet children()}<ChevronLeftIcon />{/snippet}</Button><Button class={buttonClassName({ variant: 'outline', size: 'icon' })} disabled={!can('allTarget')} aria-label="Move all to target" onclick={controller.moveAllToTarget}>{#snippet children()}<ChevronsRightIcon />{/snippet}</Button><Button class={buttonClassName({ variant: 'outline', size: 'icon' })} disabled={!can('allSource')} aria-label="Move all to source" onclick={controller.moveAllToSource}>{#snippet children()}<ChevronsLeftIcon />{/snippet}</Button>{/if}</div>
  </div>
  {#if validation}<div data-slot="transfer-message" role={validation.status === 'error' ? 'alert' : undefined} class={validation.status === 'warning' ? transferWarningMessageClassName : transferMessageClassName}>{validation.message}</div>{/if}
</div>
