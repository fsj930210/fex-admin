import { createTransferController } from '@fex/components-core/transfer/create-transfer-controller'
import type {
  TransferController,
  TransferControllerOptions,
  TransferDataItem,
} from '@fex/components-core/transfer/types'
import type { HTMLAttributes, ReactNode } from 'react'
import { useRef } from 'react'
import { useCoreStore } from '../../hooks/use-core-store'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { useLazyRef } from '../../hooks/use-lazy-ref'
import { TransferContext } from './transfer-context'
import {
  TransferPanel,
  type TransferPanelClassName,
  type TransferPanelConfig,
} from './transfer-panel'

export interface TransferRootClassName {
  root?: string | undefined
  layout?: string | undefined
  source?: TransferPanelClassName | undefined
  target?: TransferPanelClassName | undefined
  actions?: string | undefined
  message?: string | undefined
}

export interface TransferRootProps<TItem extends TransferDataItem>
  extends
    TransferControllerOptions<TItem>,
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className' | 'defaultValue' | 'onChange'> {
  controller?: TransferController<TItem> | undefined
  source: TransferPanelConfig<TItem>
  target: TransferPanelConfig<TItem>
  actions: ReactNode
  className?: TransferRootClassName | undefined
  invalid?: boolean | undefined
  message?: ReactNode | undefined
}

export function TransferRoot<TItem extends TransferDataItem>({
  controller: suppliedController,
  source,
  target,
  actions,
  className,
  invalid = false,
  message,
  items,
  fieldNames,
  disabled,
  targetKeys,
  defaultTargetKeys,
  checkedKeys,
  defaultCheckedKeys,
  onChange,
  onCheckedChange,
  ...domProps
}: TransferRootProps<TItem>) {
  const options: TransferControllerOptions<TItem> = {
    items,
    fieldNames,
    disabled,
    targetKeys,
    defaultTargetKeys,
    checkedKeys,
    defaultCheckedKeys,
    onChange,
    onCheckedChange,
  }
  const optionsRef = useRef(options)
  Object.assign(optionsRef.current, options)
  const ownedController = useLazyRef(() => createTransferController(optionsRef.current))
  const controller = suppliedController ?? ownedController.current
  useCoreStore(controller)

  useIsomorphicLayoutEffect(() => {
    if (!suppliedController) controller.updateOptions(optionsRef.current)
  }, [
    controller,
    suppliedController,
    options.items,
    options.targetKeys,
    options.checkedKeys,
    options.disabled,
    options.fieldNames,
  ])

  return (
    <TransferContext
      value={{
        controller: controller as unknown as TransferController<TransferDataItem>,
        disabled: options.disabled === true,
      }}
    >
      <div
        {...domProps}
        data-slot="transfer-root"
        data-invalid={invalid ? 'true' : undefined}
        aria-invalid={invalid || undefined}
        className={className?.root}
      >
        <div data-slot="transfer-layout" className={className?.layout}>
          <TransferPanel side="source" config={source} partClassName={className?.source} />
          <div className={className?.actions}>{actions}</div>
          <TransferPanel side="target" config={target} partClassName={className?.target} />
        </div>
        {message !== undefined ? (
          <div
            data-slot="transfer-message"
            role={invalid ? 'alert' : undefined}
            className={className?.message}
          >
            {message}
          </div>
        ) : null}
      </div>
    </TransferContext>
  )
}
