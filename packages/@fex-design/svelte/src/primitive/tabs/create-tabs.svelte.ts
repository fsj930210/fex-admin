import { createTabsController } from '@fex-design/core/tabs/create-tabs-controller'
import type {
  TabsActivationMode,
  TabsChangeMeta,
  TabsItemRecord,
  TabsOrientation,
} from '@fex-design/core/tabs/types'
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements'
import { readableCoreStore } from '../../stores/core-store'

export interface CreateTabsOptions {
  readonly value?: string | undefined
  readonly defaultValue?: string | undefined
  readonly orientation?: TabsOrientation | undefined
  readonly activationMode?: TabsActivationMode | undefined
  readonly loop?: boolean | undefined
  readonly onChange?: ((value: string | undefined, meta: TabsChangeMeta) => void) | undefined
  readonly onClose?: ((item: TabsItemRecord) => void) | undefined
}

export function createTabs(options: CreateTabsOptions = {}) {
  const baseId = `fex-tabs-${Math.random().toString(36).slice(2)}`
  const elements = new Map<string, HTMLElement>()
  const controller = createTabsController(options)
  const snapshot = readableCoreStore(controller)
  const orientation = () => options.orientation ?? 'horizontal'

  function syncOptions() {
    controller.updateOptions(options)
  }

  function registerItem(item: TabsItemRecord, element?: HTMLElement | null) {
    controller.registerItem(item)
    controller.selectFirstAvailable()
    if (element) {
      elements.set(item.value, element)
    } else if (element === null) {
      elements.delete(item.value)
      controller.unregisterItem(item.value)
    }
  }

  function itemState(item: TabsItemRecord) {
    const current = controller.getSnapshot()
    return {
      active: current.value === item.value,
      focused: current.focusedValue === item.value,
      disabled: item.disabled === true,
      closable: item.closable === true,
      orientation: orientation(),
    }
  }

  function getListProps(): HTMLAttributes<HTMLDivElement> {
    return { role: 'tablist', 'aria-orientation': orientation(), 'data-orientation': orientation() }
  }

  function getItemProps(item: TabsItemRecord): HTMLAttributes<HTMLDivElement> {
    const state = itemState(item)
    return {
      id: `${baseId}-tab-${item.value}`,
      role: 'tab',
      tabindex: state.active ? 0 : -1,
      'aria-selected': state.active,
      'aria-controls': `${baseId}-panel-${item.value}`,
      'aria-disabled': state.disabled || undefined,
      'data-state': state.active ? 'active' : 'inactive',
      'data-disabled': state.disabled || undefined,
      'data-orientation': orientation(),
      onclick: (event) => {
        if (!event.defaultPrevented && !state.disabled) controller.select(item.value, 'click')
      },
      onkeydown: (event) => {
        const horizontal = orientation() === 'horizontal'
        const direction =
          event.key === 'Home'
            ? 'first'
            : event.key === 'End'
              ? 'last'
              : event.key === (horizontal ? 'ArrowRight' : 'ArrowDown')
                ? 'next'
                : event.key === (horizontal ? 'ArrowLeft' : 'ArrowUp')
                  ? 'previous'
                  : undefined
        if (direction) {
          event.preventDefault()
          const value = controller.moveFocus(direction)
          if (value) elements.get(value)?.focus()
          return
        }
        if (options.activationMode === 'manual' && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          controller.select(item.value, 'keyboard')
        }
      },
    }
  }

  function getCloseProps(item: TabsItemRecord): HTMLButtonAttributes {
    return {
      type: 'button',
      'aria-label': `Close ${item.value}`,
      onpointerdown: (event) => event.stopPropagation(),
      onclick: (event) => {
        event.stopPropagation()
        options.onClose?.(item)
      },
    }
  }

  function getContentProps(value: string): HTMLAttributes<HTMLDivElement> {
    const current = controller.getSnapshot()
    return {
      id: `${baseId}-panel-${value}`,
      role: 'tabpanel',
      tabindex: 0,
      'aria-labelledby': `${baseId}-tab-${value}`,
      hidden: current.value !== value,
      'data-state': current.value === value ? 'active' : 'inactive',
    }
  }

  return {
    controller,
    snapshot,
    orientation,
    syncOptions,
    registerItem,
    itemState,
    getListProps,
    getItemProps,
    getCloseProps,
    getContentProps,
    isContentMounted: controller.isContentMounted,
  }
}
