import {
  readTransferDisabled,
  readTransferKey,
  resolveTransferFieldNames,
} from '@fex/components-core/transfer/utils'
import {
  checkboxCheckIconClassName,
  checkboxClassName,
  checkboxIndicatorClassName,
  checkboxMinusIconClassName,
} from '@fex/components-styles/checkbox'
import { listboxItemClassName, listboxRootClassName } from '@fex/components-styles/listbox'
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
} from '@fex/components-styles/transfer'
import { cn } from '@fex/utils'
import type { ReactNode } from 'react'
import { CheckIcon } from '../../icon/check'
import { MinusIcon } from '../../icon/minus'
import { CheckboxIndicator, CheckboxRoot } from '../checkbox/checkbox'
import { ListboxItem, ListboxRoot } from '../listbox/listbox'
import type { TransferPanelConfig, TransferPanelContent } from './transfer-panel'
import { TransferRoot, type TransferRootProps } from './transfer-root'
import { useTransfer, type TransferPanelRenderApi } from './use-transfer'
import { TransferDefaultActions } from './transfer-default-actions'

export interface TransferPanelOptions<TItem extends Record<string, unknown>> {
  header?: TransferPanelContent<TItem> | undefined
  body?: TransferPanelContent<TItem> | undefined
  footer?: TransferPanelContent<TItem> | undefined
}

export interface TransferProps<TItem extends Record<string, unknown>> extends Omit<
  TransferRootProps<TItem>,
  'source' | 'target' | 'actions' | 'className' | 'message' | 'invalid' | 'title'
> {
  title?: { source?: ReactNode; target?: ReactNode } | undefined
  panels?:
    | { source?: TransferPanelOptions<TItem>; target?: TransferPanelOptions<TItem> }
    | undefined
  actions?: ReactNode | undefined
  renderItem?: ((item: TItem) => ReactNode) | undefined
  validation?: { status: 'error' | 'warning'; message: ReactNode } | undefined
  className?: TransferRootProps<TItem>['className'] | undefined
}

function HeaderCheckbox({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean | 'indeterminate'
  disabled: boolean
  label: string
  onChange(checked: boolean): void
}) {
  return (
    <CheckboxRoot
      checked={checked}
      disabled={disabled}
      aria-label={label}
      onCheckedChange={(next) => onChange(next === true)}
      className={checkboxClassName()}
    >
      <CheckboxIndicator className={checkboxIndicatorClassName}>
        <CheckIcon className={checkboxCheckIconClassName} />
        <MinusIcon className={checkboxMinusIconClassName} />
      </CheckboxIndicator>
    </CheckboxRoot>
  )
}

function DefaultHeader<TItem extends Record<string, unknown>>({
  api,
  title,
  fields,
}: {
  api: TransferPanelRenderApi<TItem>
  title: ReactNode
  fields: ReturnType<typeof resolveTransferFieldNames>
}) {
  const { disabled } = useTransfer<TItem>()
  const enabledKeys = api.items
    .filter((item) => !readTransferDisabled(item, fields))
    .map((item) => readTransferKey(item, fields))
  const checkedCount = enabledKeys.filter((key) => api.checkedKeys.includes(key)).length
  const checked =
    checkedCount === enabledKeys.length && enabledKeys.length > 0
      ? true
      : checkedCount > 0
        ? 'indeterminate'
        : false
  return (
    <>
      <HeaderCheckbox
        checked={checked}
        disabled={disabled || enabledKeys.length === 0}
        label={`Select all ${String(title)}`}
        onChange={(next) => api.setCheckedKeys(next ? enabledKeys : [])}
      />
      <span className="min-w-0 flex-1 truncate font-medium">{title}</span>
      <span className="shrink-0 text-muted-foreground">
        {api.checkedKeys.length}/{api.items.length}
      </span>
    </>
  )
}

function DefaultBody<TItem extends Record<string, unknown>>({
  api,
  fields,
  renderItem,
}: {
  api: TransferPanelRenderApi<TItem>
  fields: ReturnType<typeof resolveTransferFieldNames>
  renderItem?: ((item: TItem) => ReactNode) | undefined
}) {
  const { disabled } = useTransfer<TItem>()
  return (
    <ListboxRoot
      data-variant="transfer"
      multiple
      disabled={disabled}
      items={api.items}
      value={api.checkedKeys}
      getItemValue={(item) => readTransferKey(item as TItem, fields)}
      getItemDisabled={(item) => disabled || readTransferDisabled(item as TItem, fields)}
      onChange={(keys) =>
        api.setCheckedKeys(Array.isArray(keys) ? keys : keys === undefined ? [] : [keys])
      }
      className={listboxRootClassName({ variant: 'transfer' })}
    >
      {api.items.map((item) => {
        const key = readTransferKey(item, fields)
        const selected = api.isChecked(key)
        return (
          <ListboxItem key={key} value={key} className={listboxItemClassName({ size: 'sm' })}>
            <span
              aria-hidden="true"
              data-checked={selected ? 'true' : undefined}
              className="flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-border text-primary-foreground data-[checked=true]:border-primary data-[checked=true]:bg-primary"
            >
              {selected ? <CheckIcon className="size-3" /> : null}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm">
              {renderItem?.(item) ?? (item[fields.label] as ReactNode)}
            </span>
          </ListboxItem>
        )
      })}
    </ListboxRoot>
  )
}

export function Transfer<TItem extends Record<string, unknown>>({
  title,
  panels,
  actions,
  renderItem,
  validation,
  className,
  fieldNames,
  ...props
}: TransferProps<TItem>) {
  const fields = resolveTransferFieldNames(fieldNames)
  const panel = (
    side: 'source' | 'target',
    options?: TransferPanelOptions<TItem>,
  ): TransferPanelConfig<TItem> => ({
    header:
      options?.header ??
      ((api) => (
        <DefaultHeader
          api={api}
          title={title?.[side] ?? (side === 'source' ? 'Source' : 'Target')}
          fields={fields}
        />
      )),
    body:
      options?.body ?? ((api) => <DefaultBody api={api} fields={fields} renderItem={renderItem} />),
    ...(options?.footer === undefined ? {} : { footer: options.footer }),
  })
  const warning = validation?.status === 'warning'
  return (
    <TransferRoot
      {...props}
      fieldNames={fieldNames}
      source={panel('source', panels?.source)}
      target={panel('target', panels?.target)}
      actions={actions ?? <TransferDefaultActions />}
      invalid={validation?.status === 'error'}
      message={validation?.message}
      className={{
        root: cn(
          transferRootClassName,
          warning &&
            '[&_[data-slot=transfer-panel]]:border-warning [&_[data-slot=transfer-panel]]:ring-3 [&_[data-slot=transfer-panel]]:ring-warning/20',
          className?.root,
        ),
        layout: cn(transferLayoutClassName, className?.layout),
        source: {
          root: cn(transferSourcePanelClassName, className?.source?.root),
          header: cn(transferPanelHeaderClassName, className?.source?.header),
          body: cn(transferPanelBodyClassName, className?.source?.body),
          footer: cn(transferPanelFooterClassName, className?.source?.footer),
        },
        target: {
          root: cn(transferTargetPanelClassName, className?.target?.root),
          header: cn(transferPanelHeaderClassName, className?.target?.header),
          body: cn(transferPanelBodyClassName, className?.target?.body),
          footer: cn(transferPanelFooterClassName, className?.target?.footer),
        },
        actions: cn(transferActionsClassName, className?.actions),
        message: cn(
          warning ? transferWarningMessageClassName : transferMessageClassName,
          className?.message,
        ),
      }}
    />
  )
}
