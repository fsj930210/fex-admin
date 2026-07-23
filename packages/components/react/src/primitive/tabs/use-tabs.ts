import { createTabsController } from '@fex/components-core/tabs/create-tabs-controller'
import type { TabsActivationMode, TabsChangeMeta, TabsItemRecord, TabsOrientation, TabsValue } from '@fex/components-core/tabs/types'
import { useId, useRef, type ButtonHTMLAttributes, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode, type RefCallback } from 'react'
import { useCoreStore } from '../../hooks/use-core-store'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { useLazyRef } from '../../hooks/use-lazy-ref'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'

export interface TabsItemData extends TabsItemRecord { label?: ReactNode }
export interface UseTabsOptions {
  value?: TabsValue
  defaultValue?: TabsValue
  orientation?: TabsOrientation
  activationMode?: TabsActivationMode
  loop?: boolean
  onChange?: (value: TabsValue | undefined, meta: TabsChangeMeta) => void
  onClose?: (item: TabsItemData) => void
}

export interface TabsItemState {
  active: boolean
  focused: boolean
  disabled: boolean
  closable: boolean
  orientation: TabsOrientation
}

export type TabsListDOMProps = HTMLAttributes<HTMLElement> & {
  'data-orientation': TabsOrientation
}

export type TabsItemDOMProps = HTMLAttributes<HTMLElement> & {
  ref: RefCallback<HTMLElement>
  'data-state': 'active' | 'inactive'
  'data-disabled': true | undefined
  'data-orientation': TabsOrientation
}

export type TabsContentDOMProps = HTMLAttributes<HTMLElement> & {
  'data-state': 'active' | 'inactive'
}

export function useTabs(options: UseTabsOptions = {}) {
  const optionsRef = useRef(options)
  optionsRef.current = options
  const itemsRef = useRef(new Map<TabsValue, TabsItemData>())
  const elementsRef = useRef(new Map<TabsValue, HTMLElement>())
  const itemRefs = useRef(new Map<TabsValue, RefCallback<HTMLElement>>())
  const cleanupTokensRef = useRef(new Map<TabsValue, object>())
  const baseId = useId()
  const controllerRef = useLazyRef(() =>
    createTabsController({
      get value() { return optionsRef.current.value },
      get defaultValue() { return optionsRef.current.defaultValue },
      get orientation() { return optionsRef.current.orientation },
      get activationMode() { return optionsRef.current.activationMode },
      get loop() { return optionsRef.current.loop },
      onChange(value, meta) { optionsRef.current.onChange?.(value, meta) },
    }),
  )
  const controller = controllerRef.current
  useIsomorphicLayoutEffect(() => {
    controller.updateOptions(options)
  }, [controller, options])
  const snapshot = useCoreStore(controller)
  const orientation = options.orientation ?? 'horizontal'

  const getItemState = useMemoizedFn((item: TabsItemData): TabsItemState => ({
    active: snapshot.value === item.value,
    focused: snapshot.focusedValue === item.value,
    disabled: item.disabled === true,
    closable: item.closable === true,
    orientation,
  }))

  const getListProps = useMemoizedFn((): TabsListDOMProps => ({
    role: 'tablist' as const,
    'aria-orientation': orientation,
    'data-orientation': orientation,
  }))

  const getItemProps = useMemoizedFn((item: TabsItemData): TabsItemDOMProps => {
    itemsRef.current.set(item.value, item)
    if (elementsRef.current.has(item.value)) controller.registerItem(item)
    const state = getItemState(item)
    let itemRef = itemRefs.current.get(item.value)
    if (!itemRef) {
      itemRef = (element) => {
        if (element) {
          cleanupTokensRef.current.delete(item.value)
          elementsRef.current.set(item.value, element)
          const currentItem = itemsRef.current.get(item.value)
          if (currentItem) {
            controller.registerItem(currentItem)
            controller.selectFirstAvailable()
          }
          return
        }
        elementsRef.current.delete(item.value)
        controller.unregisterItem(item.value)
        const cleanupToken = {}
        cleanupTokensRef.current.set(item.value, cleanupToken)
        queueMicrotask(() => {
          if (cleanupTokensRef.current.get(item.value) !== cleanupToken || elementsRef.current.has(item.value)) return
          cleanupTokensRef.current.delete(item.value)
          itemsRef.current.delete(item.value)
          itemRefs.current.delete(item.value)
        })
      }
      itemRefs.current.set(item.value, itemRef)
    }
    return {
      ref: itemRef,
      id: `${baseId}-tab-${item.value}`,
      role: 'tab',
      tabIndex: state.active ? 0 : -1,
      'aria-selected': state.active,
      'aria-controls': `${baseId}-panel-${item.value}`,
      'aria-disabled': state.disabled || undefined,
      'data-state': state.active ? 'active' : 'inactive',
      'data-disabled': state.disabled || undefined,
      'data-orientation': orientation,
      onClick: (event: MouseEvent<HTMLElement>) => {
        if (!event.defaultPrevented && !state.disabled) controller.select(item.value, 'click')
      },
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        if (state.disabled) return
        const horizontal = orientation === 'horizontal'
        const direction = event.key === 'Home' ? 'first' : event.key === 'End' ? 'last'
          : event.key === (horizontal ? 'ArrowRight' : 'ArrowDown') ? 'next'
          : event.key === (horizontal ? 'ArrowLeft' : 'ArrowUp') ? 'previous' : undefined
        if (direction) {
          event.preventDefault()
          const focusedValue = controller.moveFocus(direction)
          if (focusedValue) elementsRef.current.get(focusedValue)?.focus()
          return
        }
        if (options.activationMode === 'manual' && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          controller.select(item.value, 'keyboard')
        }
      },
    }
  })

  const getCloseProps = useMemoizedFn((item: TabsItemData): ButtonHTMLAttributes<HTMLButtonElement> => ({
    type: 'button',
    'aria-label': `Close ${item.value}`,
    onPointerDown: (event) => event.stopPropagation(),
    onClick: (event) => {
      event.stopPropagation()
      optionsRef.current.onClose?.(item)
    },
  }))

  const getContentProps = useMemoizedFn((value: TabsValue): TabsContentDOMProps => ({
    id: `${baseId}-panel-${value}`,
    role: 'tabpanel',
    tabIndex: 0,
    'aria-labelledby': `${baseId}-tab-${value}`,
    hidden: snapshot.value !== value,
    'data-state': snapshot.value === value ? 'active' : 'inactive',
  }))

  return { snapshot, orientation, getListProps, getItemProps, getItemState, getCloseProps, getContentProps, isContentMounted: controller.isContentMounted }
}
