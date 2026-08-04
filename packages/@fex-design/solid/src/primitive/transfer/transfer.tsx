import { createTransferController } from '@fex-design/core/transfer/create-transfer-controller'
import type {
  TransferControllerOptions,
  TransferDataItem,
  TransferKey,
  TransferSide,
  TransferSnapshot,
} from '@fex-design/core/transfer/types'
import {
  readTransferDisabled,
  readTransferKey,
  resolveTransferFieldNames,
} from '@fex-design/core/transfer/utils'
import { buttonClassName } from '@fex-design/styles/button'
import {
  checkboxCheckIconClassName,
  checkboxClassName,
  checkboxIndicatorClassName,
  checkboxMinusIconClassName,
} from '@fex-design/styles/checkbox'
import { listboxItemClassName, listboxRootClassName } from '@fex-design/styles/listbox'
import {
  transferActionsClassName,
  transferLayoutClassName,
  transferMessageClassName,
  transferPanelBodyClassName,
  transferPanelFooterClassName,
  transferPanelHeaderClassName,
  transferRootClassName,
  transferSourcePanelClassName,
  transferTargetPanelClassName,
  transferWarningMessageClassName,
} from '@fex-design/styles/transfer'
import { cn } from '@fex/utils'
import { createEffect, createMemo, For, Show, splitProps, type JSX } from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'
import { CheckIcon } from '../../icon/check'
import { MinusIcon } from '../../icon/minus'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from '../../icon/chevron'
import { Button } from '../button/button'
import { CheckboxIndicator, CheckboxRoot } from '../checkbox/checkbox'
import { ListboxItem, ListboxRoot } from '../listbox/listbox'

export interface TransferPanelApi<TItem extends TransferDataItem> {
  side: TransferSide
  items: readonly TItem[]
  checkedKeys: readonly TransferKey[]
  controller: ReturnType<typeof createTransferController<TItem>>
  setCheckedKeys(keys: readonly TransferKey[]): void
  isChecked(key: TransferKey): boolean
}
export interface TransferPanelOptions<TItem extends TransferDataItem> {
  header?: ((api: TransferPanelApi<TItem>) => JSX.Element) | false
  body?: (api: TransferPanelApi<TItem>) => JSX.Element
  footer?: (api: TransferPanelApi<TItem>) => JSX.Element
}
export interface TransferProps<
  TItem extends TransferDataItem,
> extends TransferControllerOptions<TItem> {
  title?: { source?: JSX.Element; target?: JSX.Element } | undefined
  panels?:
    | { source?: TransferPanelOptions<TItem>; target?: TransferPanelOptions<TItem> }
    | undefined
  actions?:
    | ((
        controller: ReturnType<typeof createTransferController<TItem>>,
        snapshot: TransferSnapshot<TItem>,
      ) => JSX.Element)
    | undefined
  renderItem?: ((item: TItem) => JSX.Element) | undefined
  validation?: { status: 'error' | 'warning'; message: JSX.Element } | undefined
  class?: string | undefined
}

export function Transfer<TItem extends TransferDataItem>(props: TransferProps<TItem>) {
  const [local] = splitProps(props, [
    'items',
    'fieldNames',
    'disabled',
    'targetKeys',
    'defaultTargetKeys',
    'checkedKeys',
    'defaultCheckedKeys',
    'onChange',
    'onCheckedChange',
  ])
  const controller = createTransferController({
    items: local.items,
    fieldNames: local.fieldNames,
    disabled: local.disabled,
    targetKeys: local.targetKeys,
    defaultTargetKeys: local.defaultTargetKeys,
    checkedKeys: local.checkedKeys,
    defaultCheckedKeys: local.defaultCheckedKeys,
    onChange: (keys, meta) => local.onChange?.(keys, meta),
    onCheckedChange: (keys, meta) => local.onCheckedChange?.(keys, meta),
  })
  const snapshot = createCoreStoreSignal(controller)
  // Synchronize framework-controlled inputs and item batch identity into the core controller.
  createEffect(() =>
    controller.updateOptions({
      items: local.items,
      fieldNames: local.fieldNames,
      disabled: local.disabled,
      targetKeys: local.targetKeys,
      checkedKeys: local.checkedKeys,
    }),
  )
  const fields = createMemo(() => resolveTransferFieldNames(local.fieldNames))
  const api = (side: TransferSide): TransferPanelApi<TItem> => {
    const source = side === 'source'
    return {
      side,
      get items() {
        const state = snapshot()
        return source ? state.sourceItems : state.targetItems
      },
      get checkedKeys() {
        const state = snapshot()
        return source ? state.sourceCheckedKeys : state.targetCheckedKeys
      },
      controller,
      setCheckedKeys: source ? controller.setSourceCheckedKeys : controller.setTargetCheckedKeys,
      isChecked: (key) => {
        const state = snapshot()
        return (source ? state.sourceCheckedKeys : state.targetCheckedKeys).includes(key)
      },
    }
  }
  const can = (action: 'target' | 'source' | 'allTarget' | 'allSource') => {
    snapshot()
    return action === 'target'
      ? controller.canMoveToTarget()
      : action === 'source'
        ? controller.canMoveToSource()
        : action === 'allTarget'
          ? controller.canMoveAllToTarget()
          : controller.canMoveAllToSource()
  }
  const enabledKeys = (side: TransferSide) =>
    api(side)
      .items.filter((item) => !readTransferDisabled(item, fields()))
      .map((item) => readTransferKey(item, fields()))
  const defaultHeader = (side: TransferSide) => {
    const panel = api(side)
    const enabled = enabledKeys(side)
    const count = enabled.filter((key) => panel.checkedKeys.includes(key)).length
    const checked =
      count === enabled.length && enabled.length > 0 ? true : count > 0 ? 'indeterminate' : false
    const title = () => props.title?.[side] ?? (side === 'source' ? 'Source' : 'Target')
    return (
      <>
        <CheckboxRoot
          checked={checked}
          disabled={local.disabled || enabled.length === 0}
          class={checkboxClassName()}
          aria-label={`Select all ${title()}`}
          onCheckedChange={(next) => panel.setCheckedKeys(next === true ? enabled : [])}
        >
          <CheckboxIndicator class={checkboxIndicatorClassName}>
            <CheckIcon class={checkboxCheckIconClassName} />
            <MinusIcon class={checkboxMinusIconClassName} />
          </CheckboxIndicator>
        </CheckboxRoot>
        <span class="min-w-0 flex-1 truncate font-medium">{title()}</span>
        <span class="shrink-0 text-muted-foreground">
          {panel.checkedKeys.length}/{panel.items.length}
        </span>
      </>
    )
  }
  const defaultBody = (side: TransferSide) => {
    const panel = api(side)
    return (
      <ListboxRoot
        data-variant="transfer"
        multiple
        disabled={local.disabled}
        items={panel.items}
        value={panel.checkedKeys}
        getItemValue={(item) => readTransferKey(item, fields())}
        getItemDisabled={(item) => local.disabled || readTransferDisabled(item, fields())}
        onChange={(keys) =>
          panel.setCheckedKeys(Array.isArray(keys) ? keys : keys == null ? [] : [keys])
        }
        class={listboxRootClassName({ variant: 'transfer' })}
      >
        <For each={panel.items}>
          {(item) => {
            const key = () => readTransferKey(item, fields())
            return (
              <ListboxItem value={key()} class={listboxItemClassName({ size: 'sm' })}>
                <span
                  aria-hidden="true"
                  data-checked={panel.isChecked(key()) || undefined}
                  class="flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-border text-primary-foreground data-[checked=true]:border-primary data-[checked=true]:bg-primary"
                >
                  {panel.isChecked(key()) ? <CheckIcon class="size-3" /> : null}
                </span>
                <span class="min-w-0 flex-1 truncate text-sm">
                  {props.renderItem?.(item) ?? (item[fields().label] as JSX.Element)}
                </span>
              </ListboxItem>
            )
          }}
        </For>
      </ListboxRoot>
    )
  }
  const panel = (side: TransferSide) => {
    const options = props.panels?.[side]
    const panelApi = api(side)
    return (
      <section
        data-slot="transfer-panel"
        data-side={side}
        class={side === 'source' ? transferSourcePanelClassName : transferTargetPanelClassName}
      >
        <Show when={options?.header !== false}>
          <header data-slot="transfer-panel-header" class={transferPanelHeaderClassName}>
            {typeof options?.header === 'function' ? options.header(panelApi) : defaultHeader(side)}
          </header>
        </Show>
        <div data-slot="transfer-panel-body" class={transferPanelBodyClassName}>
          {options?.body?.(panelApi) ?? defaultBody(side)}
        </div>
        <Show when={options?.footer}>
          {(footer) => (
            <footer data-slot="transfer-panel-footer" class={transferPanelFooterClassName}>
              {footer()(panelApi)}
            </footer>
          )}
        </Show>
      </section>
    )
  }
  return (
    <div
      data-slot="transfer-root"
      data-invalid={props.validation?.status === 'error' || undefined}
      aria-invalid={props.validation?.status === 'error' || undefined}
      class={cn(
        transferRootClassName,
        props.validation?.status === 'warning' &&
          '[&_[data-slot=transfer-panel]]:border-warning [&_[data-slot=transfer-panel]]:ring-3 [&_[data-slot=transfer-panel]]:ring-warning/20',
        props.class,
      )}
    >
      <div data-slot="transfer-layout" class={transferLayoutClassName}>
        {panel('source')}
        <div data-slot="transfer-actions" class={transferActionsClassName}>
          {props.actions?.(controller, snapshot()) ?? (
            <>
              <Button
                type="button"
                class={buttonClassName({ variant: 'outline', size: 'icon' })}
                disabled={!can('target')}
                aria-label="Move selected to target"
                onClick={controller.moveToTarget}
              >
                <ChevronRightIcon />
              </Button>
              <Button
                type="button"
                class={buttonClassName({ variant: 'outline', size: 'icon' })}
                disabled={!can('source')}
                aria-label="Move selected to source"
                onClick={controller.moveToSource}
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                type="button"
                class={buttonClassName({ variant: 'outline', size: 'icon' })}
                disabled={!can('allTarget')}
                aria-label="Move all to target"
                onClick={controller.moveAllToTarget}
              >
                <ChevronsRightIcon />
              </Button>
              <Button
                type="button"
                class={buttonClassName({ variant: 'outline', size: 'icon' })}
                disabled={!can('allSource')}
                aria-label="Move all to source"
                onClick={controller.moveAllToSource}
              >
                <ChevronsLeftIcon />
              </Button>
            </>
          )}
        </div>
        {panel('target')}
      </div>
      <Show when={props.validation}>
        {(validation) => (
          <div
            data-slot="transfer-message"
            role={validation().status === 'error' ? 'alert' : undefined}
            class={
              validation().status === 'warning'
                ? transferWarningMessageClassName
                : transferMessageClassName
            }
          >
            {validation().message}
          </div>
        )}
      </Show>
    </div>
  )
}
