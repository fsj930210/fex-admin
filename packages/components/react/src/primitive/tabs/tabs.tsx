import { tabsCloseClassName, tabsContentClassName, tabsItemClassName, tabsListClassName, type TabsStyleProps } from '@fex/components-styles/tabs'
import { cn } from '@fex/utils'
import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactElement, ReactNode, Ref } from 'react'
import { useComposedRef } from '../../hooks/use-composed-ref'
import { CloseIcon } from '../../icon/close'
import { TabsContext, useTabsContext } from './tabs-context'
import { useTabs, type TabsContentDOMProps, type TabsItemData, type TabsItemDOMProps, type TabsItemState, type TabsListDOMProps, type UseTabsOptions } from './use-tabs'

type RenderChild<T> = (context: T) => ReactElement | null

export interface TabsRootProps extends UseTabsOptions { children: ReactNode, variant?: NonNullable<TabsStyleProps['variant']> }
export function TabsRoot({ children, variant = 'default', ...options }: TabsRootProps) {
  const tabs = useTabs(options)
  return <TabsContext value={{ ...tabs, variant }}>{children}</TabsContext>
}

export interface TabsListProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  ref?: Ref<HTMLElement>
  children?: ReactNode | RenderChild<{ props: TabsListDOMProps & { ref: (element: HTMLElement | null) => void } }>
}
export function TabsList({ className, children, ref, ...props }: TabsListProps) {
  const tabs = useTabsContext('TabsList')
  const listProps = tabs.getListProps()
  const composedRef = useComposedRef<HTMLElement>(ref)
  const renderProps = { ...props, ...listProps, ref: composedRef, className: cn(tabsListClassName({ variant: tabs.variant, orientation: tabs.orientation }), className) }
  if (typeof children === 'function') return children({ props: renderProps })
  return <div {...renderProps}>{children}</div>
}

export interface TabsItemProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>, TabsItemData {
  ref?: Ref<HTMLElement>
  children?: ReactNode | RenderChild<{ props: TabsItemDOMProps, state: TabsItemState, closeProps: ReturnType<ReturnType<typeof useTabs>['getCloseProps']> }>
}
export function TabsItem({ value, disabled, closable, label, className, children, onClick, onKeyDown, ref, ...props }: TabsItemProps) {
  const tabs = useTabsContext('TabsItem')
  const item: TabsItemData = { value, ...(disabled === undefined ? {} : { disabled }), ...(closable === undefined ? {} : { closable }), ...(label === undefined ? {} : { label }) }
  const itemProps = tabs.getItemProps(item)
  const composedRef = useComposedRef<HTMLElement>(itemProps.ref, ref)
  const state = tabs.getItemState(item)
  const closeProps = tabs.getCloseProps(item)
  const mergedProps = {
    ...props,
    ...itemProps,
    ref: composedRef,
    className: cn(tabsItemClassName({ variant: tabs.variant }), className),
    onClick: (event: MouseEvent<HTMLElement>) => { onClick?.(event); if (!event.defaultPrevented) itemProps.onClick?.(event) },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => { onKeyDown?.(event); if (!event.defaultPrevented) itemProps.onKeyDown?.(event) },
  }
  if (typeof children === 'function') return children({ props: mergedProps, state, closeProps })
  return <div {...mergedProps}>{children ?? label}{state.closable ? <button {...closeProps} className={tabsCloseClassName}><CloseIcon className="size-4" /></button> : null}</div>
}

export interface TabsContentProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  value: string
  children?: ReactNode | RenderChild<{ props: TabsContentDOMProps, active: boolean }>
}
export function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const tabs = useTabsContext('TabsContent')
  if (!tabs.isContentMounted(value)) return null
  const contentProps = tabs.getContentProps(value)
  const renderProps = { ...props, ...contentProps, className: cn(tabsContentClassName({ variant: tabs.variant }), className) }
  if (typeof children === 'function') return children({ props: renderProps, active: tabs.snapshot.value === value })
  return <div {...renderProps}>{children}</div>
}

export { useTabs }
