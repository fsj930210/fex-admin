import { createTabsController } from '@fex/components-core/tabs/create-tabs-controller'
import type { TabsActivationMode, TabsChangeMeta, TabsItemRecord, TabsOrientation } from '@fex/components-core/tabs/types'
import { createUniqueId, type JSX } from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'

export interface CreateTabsOptions {
  readonly value?: string
  readonly defaultValue?: string
  readonly orientation?: TabsOrientation
  readonly activationMode?: TabsActivationMode
  readonly loop?: boolean
  readonly onChange?: (value: string | undefined, meta: TabsChangeMeta) => void
  readonly onClose?: (item: TabsItemRecord) => void
}

export type TabsListDOMProps = JSX.HTMLAttributes<any> & { 'data-orientation': TabsOrientation }
export type TabsItemDOMProps = JSX.HTMLAttributes<any> & {
  ref: (element: HTMLElement) => void
  'data-state': 'active' | 'inactive'
  'data-disabled': true | undefined
  'data-orientation': TabsOrientation
}
export type TabsContentDOMProps = JSX.HTMLAttributes<any> & { 'data-state': 'active' | 'inactive' }

export function createTabs(options: CreateTabsOptions = {}) {
  const baseId = createUniqueId()
  const elements = new Map<string, HTMLElement>()
  const controller = createTabsController(options)
  const snapshot = createCoreStoreSignal(controller)
  const orientation = () => options.orientation ?? 'horizontal'
  function registerItem(item: TabsItemRecord, element?: HTMLElement | null) { controller.registerItem(item); controller.selectFirstAvailable(); if (element) elements.set(item.value, element); else if (element === null) { elements.delete(item.value); controller.unregisterItem(item.value) } }
  function itemState(item: TabsItemRecord) {
    return {
      get active() { return snapshot().value === item.value },
      get focused() { return snapshot().focusedValue === item.value },
      get disabled() { return item.disabled === true },
      get closable() { return item.closable === true },
      get orientation() { return orientation() },
    }
  }
  function getListProps(): TabsListDOMProps { return { role: 'tablist', 'aria-orientation': orientation(), 'data-orientation': orientation() } }
  function getItemProps(item: TabsItemRecord): TabsItemDOMProps {
    registerItem(item)
    const state = itemState(item)
    return {
      ref: (element) => registerItem(item, element),
      id: `${baseId}-tab-${item.value}`,
      role: 'tab',
      get tabIndex() { return state.active ? 0 : -1 },
      get 'aria-selected'() { return state.active },
      'aria-controls': `${baseId}-panel-${item.value}`,
      get 'aria-disabled'() { return state.disabled || undefined },
      get 'data-state'() { return state.active ? 'active' : 'inactive' },
      get 'data-disabled'() { return state.disabled || undefined },
      get 'data-orientation'() { return orientation() },
      onClick: (event) => { if (!event.defaultPrevented && !state.disabled) controller.select(item.value, 'click') },
      onKeyDown: (event) => { const horizontal = orientation() === 'horizontal'; const direction = event.key === 'Home' ? 'first' : event.key === 'End' ? 'last' : event.key === (horizontal ? 'ArrowRight' : 'ArrowDown') ? 'next' : event.key === (horizontal ? 'ArrowLeft' : 'ArrowUp') ? 'previous' : undefined; if (direction) { event.preventDefault(); const value = controller.moveFocus(direction); if (value) elements.get(value)?.focus(); return } if (options.activationMode === 'manual' && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); controller.select(item.value, 'keyboard') } },
    }
  }
  function getCloseProps(item: TabsItemRecord): JSX.ButtonHTMLAttributes<HTMLButtonElement> { return { type: 'button', 'aria-label': `Close ${item.value}`, onPointerDown: (event) => event.stopPropagation(), onClick: (event) => { event.stopPropagation(); options.onClose?.(item) } } }
  function getContentProps(value: string): TabsContentDOMProps { return { id: `${baseId}-panel-${value}`, role: 'tabpanel', tabIndex: 0, 'aria-labelledby': `${baseId}-tab-${value}`, hidden: snapshot().value !== value, 'data-state': snapshot().value === value ? 'active' : 'inactive' } }
  return { snapshot, orientation, registerItem, itemState, getListProps, getItemProps, getCloseProps, getContentProps, isContentMounted: controller.isContentMounted }
}
