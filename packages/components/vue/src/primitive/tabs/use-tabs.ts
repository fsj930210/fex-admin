import { createTabsController } from '@fex/components-core/tabs/create-tabs-controller'
import type { TabsActivationMode, TabsChangeMeta, TabsItemRecord, TabsOrientation } from '@fex/components-core/tabs/types'
import { onScopeDispose, useId, watchEffect } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'

export interface UseTabsOptions {
  readonly value?: string | undefined
  readonly defaultValue?: string | undefined
  readonly orientation?: TabsOrientation | undefined
  readonly activationMode?: TabsActivationMode | undefined
  readonly loop?: boolean | undefined
  readonly onChange?: ((value: string | undefined, meta: TabsChangeMeta) => void) | undefined
  readonly onClose?: ((item: TabsItemRecord) => void) | undefined
}

export function useTabs(options: UseTabsOptions = {}) {
  const baseId = useId()
  const items = new Map<string, TabsItemRecord>()
  const elements = new Map<string, HTMLElement>()
  const itemRefs = new Map<string, (element: unknown) => void>()
  const controller = createTabsController(options)
  const snapshot = useCoreStore(controller)

  // Vue props are an external reactive source for the framework-neutral controller.
  watchEffect(() => controller.updateOptions({
    value: options.value,
    defaultValue: options.defaultValue,
    orientation: options.orientation,
    activationMode: options.activationMode,
    loop: options.loop,
    onChange: options.onChange,
  }))
  onScopeDispose(() => { for (const value of items.keys()) controller.unregisterItem(value) })

  const orientation = () => options.orientation ?? 'horizontal'
  function registerItem(item: TabsItemRecord, element?: HTMLElement | null) {
    items.set(item.value, item)
    controller.registerItem(item)
    controller.selectFirstAvailable()
    if (element) elements.set(item.value, element)
    else if (element === null) { elements.delete(item.value); items.delete(item.value); controller.unregisterItem(item.value) }
  }
  function itemState(item: TabsItemRecord) {
    return { active: snapshot.value.value === item.value, focused: snapshot.value.focusedValue === item.value, disabled: item.disabled === true, closable: item.closable === true, orientation: orientation() }
  }
  function getListProps() { return { role: 'tablist', 'aria-orientation': orientation(), 'data-orientation': orientation() } }
  function getItemProps(item: TabsItemRecord) {
    registerItem(item)
    const state = itemState(item)
    let itemRef = itemRefs.get(item.value)
    if (!itemRef) {
      itemRef = (element) => registerItem(item, element as HTMLElement | null)
      itemRefs.set(item.value, itemRef)
    }
    return {
      ref: itemRef,
      id: `${baseId}-tab-${item.value}`, role: 'tab', tabindex: state.active ? 0 : -1,
      'aria-selected': state.active, 'aria-controls': `${baseId}-panel-${item.value}`,
      'aria-disabled': state.disabled || undefined, 'data-state': state.active ? 'active' : 'inactive',
      'data-disabled': state.disabled || undefined, 'data-orientation': orientation(),
      onClick: (event: MouseEvent) => { if (!event.defaultPrevented && !state.disabled) controller.select(item.value, 'click') },
      onKeydown: (event: KeyboardEvent) => {
        if (state.disabled) return
        const horizontal = orientation() === 'horizontal'
        const direction = event.key === 'Home' ? 'first' : event.key === 'End' ? 'last' : event.key === (horizontal ? 'ArrowRight' : 'ArrowDown') ? 'next' : event.key === (horizontal ? 'ArrowLeft' : 'ArrowUp') ? 'previous' : undefined
        if (direction) { event.preventDefault(); const value = controller.moveFocus(direction); if (value) elements.get(value)?.focus(); return }
        if (options.activationMode === 'manual' && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); controller.select(item.value, 'keyboard') }
      },
    }
  }
  function getCloseProps(item: TabsItemRecord) { return { type: 'button' as const, 'aria-label': `Close ${item.value}`, onPointerdown: (event: PointerEvent) => event.stopPropagation(), onClick: (event: MouseEvent) => { event.stopPropagation(); options.onClose?.(item) } } }
  function getContentProps(value: string) { return { id: `${baseId}-panel-${value}`, role: 'tabpanel', tabindex: 0, 'aria-labelledby': `${baseId}-tab-${value}`, hidden: snapshot.value.value !== value, 'data-state': snapshot.value.value === value ? 'active' : 'inactive' } }

  return { snapshot, orientation, registerItem, itemState, getListProps, getItemProps, getCloseProps, getContentProps, isContentMounted: controller.isContentMounted }
}
