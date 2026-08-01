import type { TransferDataItem, TransferSide } from '@fex/components-core/transfer/types'
import type { HTMLAttributes, ReactNode } from 'react'
import { TransferPanelContext } from './transfer-context'
import { useTransferPanel, type TransferPanelRenderApi } from './use-transfer'

export type TransferPanelContent<TItem extends TransferDataItem> =
  | ReactNode
  | ((api: TransferPanelRenderApi<TItem>) => ReactNode)

export interface TransferPanelConfig<TItem extends TransferDataItem> {
  header?: TransferPanelContent<TItem> | undefined
  body: TransferPanelContent<TItem>
  footer?: TransferPanelContent<TItem> | undefined
}

export interface TransferPanelClassName {
  root?: string | undefined
  header?: string | undefined
  body?: string | undefined
  footer?: string | undefined
}

interface TransferPanelProps<
  TItem extends TransferDataItem,
> extends HTMLAttributes<HTMLDivElement> {
  side: TransferSide
  config: TransferPanelConfig<TItem>
  partClassName?: TransferPanelClassName | undefined
}

function TransferPanelContentSlot<TItem extends TransferDataItem>({
  content,
}: {
  content: TransferPanelContent<TItem>
}) {
  const api = useTransferPanel<TItem>()
  return <>{typeof content === 'function' ? content(api) : content}</>
}

export function TransferPanel<TItem extends TransferDataItem>({
  side,
  config,
  partClassName,
  ...props
}: TransferPanelProps<TItem>) {
  return (
    <TransferPanelContext value={side}>
      <section
        {...props}
        data-slot="transfer-panel"
        data-side={side}
        className={partClassName?.root}
      >
        {config.header !== undefined ? (
          <header data-slot="transfer-panel-header" className={partClassName?.header}>
            <TransferPanelContentSlot content={config.header} />
          </header>
        ) : null}
        <div data-slot="transfer-panel-body" className={partClassName?.body}>
          <TransferPanelContentSlot content={config.body} />
        </div>
        {config.footer !== undefined ? (
          <footer data-slot="transfer-panel-footer" className={partClassName?.footer}>
            <TransferPanelContentSlot content={config.footer} />
          </footer>
        ) : null}
      </section>
    </TransferPanelContext>
  )
}
