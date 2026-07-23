import { tabsCloseClassName, tabsContentClassName, tabsItemClassName, tabsListClassName } from '@fex/components-styles/tabs'
import { cn } from '@fex/utils'
import { mergeProps, onCleanup, Show, splitProps, type JSX, type ParentProps } from 'solid-js'
import { CloseIcon } from '../../icon/close'
import {
  createTabs,
  type CreateTabsOptions,
  type TabsContentDOMProps,
  type TabsItemDOMProps,
  type TabsListDOMProps,
} from './create-tabs'
import { TabsContext, useTabsContext } from './tabs-context'

type RenderChild<T> = (context: T) => JSX.Element

function isRenderChild<T>(child: JSX.Element | RenderChild<T> | undefined): child is RenderChild<T> {
  return typeof child === 'function' && child.length > 0
}

export interface TabsRootProps extends ParentProps<CreateTabsOptions> {
  variant?: 'default' | 'line'
}

export function TabsRoot(props: TabsRootProps) {
  const tabs = createTabs(props)
  return <TabsContext.Provider value={{ ...tabs, variant: () => props.variant ?? 'default' }}>{props.children}</TabsContext.Provider>
}

export interface TabsListProps extends Omit<JSX.HTMLAttributes<any>, 'children'> {
  children?: JSX.Element | RenderChild<{ props: TabsListDOMProps }>
}

export function TabsList(props: TabsListProps) {
  const tabs = useTabsContext('TabsList')
  const [local, rest] = splitProps(props, ['children', 'class'])
  const renderProps = (): TabsListDOMProps => ({
    ...rest,
    ...tabs.getListProps(),
    class: cn(tabsListClassName({ variant: tabs.variant(), orientation: tabs.orientation() }), local.class),
  })
  return isRenderChild(local.children)
    ? local.children({ props: renderProps() })
    : <div {...renderProps()}>{local.children}</div>
}

export interface TabsItemProps extends Omit<JSX.HTMLAttributes<any>, 'children'> {
  value: string
  disabled?: boolean
  closable?: boolean
  children?: JSX.Element | RenderChild<{
    props: TabsItemDOMProps
    state: ReturnType<ReturnType<typeof createTabs>['itemState']>
    closeProps: JSX.ButtonHTMLAttributes<HTMLButtonElement>
  }>
}

export function TabsItem(props: TabsItemProps) {
  const tabs = useTabsContext('TabsItem')
  const [local, rest] = splitProps(props, ['value', 'disabled', 'closable', 'children', 'class'])
  const item = () => ({
    value: local.value,
    ...(local.disabled === undefined ? {} : { disabled: local.disabled }),
    ...(local.closable === undefined ? {} : { closable: local.closable }),
  })
  tabs.registerItem(item())
  onCleanup(() => tabs.registerItem(item(), null))
  const renderProps = (): TabsItemDOMProps => mergeProps(rest, tabs.getItemProps(item()), {
    get class() { return cn(tabsItemClassName({ variant: tabs.variant() }), local.class) },
  })
  const closeProps = () => ({ ...tabs.getCloseProps(item()), class: tabsCloseClassName })
  return isRenderChild(local.children)
    ? local.children({ props: renderProps(), state: tabs.itemState(item()), closeProps: closeProps() })
    : <div {...renderProps()}>{local.children}{local.closable && <button {...closeProps()}><CloseIcon class="size-4" /></button>}</div>
}

export interface TabsContentProps extends Omit<JSX.HTMLAttributes<any>, 'children'> {
  value: string
  children?: JSX.Element | RenderChild<{ props: TabsContentDOMProps, state: { active: boolean } }>
}

export function TabsContent(props: TabsContentProps) {
  const tabs = useTabsContext('TabsContent')
  const [local, rest] = splitProps(props, ['value', 'children', 'class'])
  const renderProps = (): TabsContentDOMProps => ({
    ...rest,
    ...tabs.getContentProps(local.value),
    class: cn(tabsContentClassName({ variant: tabs.variant() }), local.class),
  })
  return (
    <Show when={(tabs.snapshot(), tabs.isContentMounted(local.value))}>
      {isRenderChild(local.children)
        ? local.children({ props: renderProps(), state: { active: tabs.snapshot().value === local.value } })
        : <div {...renderProps()}>{local.children}</div>}
    </Show>
  )
}

export { createTabs }
