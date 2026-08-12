import {
  getAnchorScrollTop,
  getAnchorTargetTop,
  getAnchorViewportHeight,
  getAnchorIndicatorStyles,
  ensureAnchorLinkVisible,
  isAnchorScrolledToEnd,
  resolveAnchorTarget,
} from '@fex-design/core/anchor/dom'
import { createAnchorController } from '@fex-design/core/anchor/model'
import { flattenAnchorItems, getAnchorActiveKeys, getAnchorHighlightedKeys } from '@fex-design/core/anchor/model'
import type { AnchorActiveMode, AnchorItem, AnchorOrientation } from '@fex-design/core/anchor/types'
import { anchorIndicatorClassName, anchorLinkClassName, anchorListClassName, anchorRailClassName, anchorRootClassName } from '@fex-design/styles/anchor'
import { cn } from '@fex/utils'
import { createEffect, createMemo, createSignal, For, onCleanup, onMount, splitProps, type JSX } from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'

export interface AnchorProps extends Omit<JSX.HTMLAttributes<HTMLElement>, 'children' | 'onChange'> {
  items: readonly AnchorItem<JSX.Element>[]
  activeKeys?: readonly string[]
  defaultActiveKeys?: readonly string[]
  activeMode?: AnchorActiveMode
  orientation?: AnchorOrientation
  container?: Window | HTMLElement | (() => Window | HTMLElement)
  offset?: number
  activeOffset?: number
  behavior?: ScrollBehavior
  onChange?: (keys: readonly string[], items: readonly AnchorItem<JSX.Element>[]) => void
}

export function Anchor(props: AnchorProps) {
  const [local, rest] = splitProps(props, ['items', 'activeKeys', 'defaultActiveKeys', 'activeMode', 'orientation', 'container', 'offset', 'activeOffset', 'behavior', 'onChange', 'class', 'ref'])
  const controller = createAnchorController<JSX.Element>({ activeKeys: local.activeKeys, defaultActiveKeys: local.defaultActiveKeys, onChange: local.onChange })
  const storeSnapshot = createCoreStoreSignal(controller)
  const activeKeys = createMemo(() => {
    void storeSnapshot()
    controller.updateOptions({ activeKeys: local.activeKeys, defaultActiveKeys: local.defaultActiveKeys, onChange: local.onChange })
    return controller.getSnapshot().activeKeys
  })
  const orientation = () => local.orientation ?? 'vertical'
  const flatItems = createMemo(() => flattenAnchorItems(local.items))
  const visibleItems = createMemo(() => orientation() === 'horizontal' ? flatItems().filter((item) => item.level === 0) : flatItems())
  const highlightedKeys = createMemo(() => getAnchorHighlightedKeys(activeKeys(), flatItems()))
  const scrollContainer = () => typeof local.container === 'function' ? local.container() : (local.container ?? window)
  let root: HTMLElement | undefined
  const [inkStyles, setInkStyles] = createSignal<ReturnType<typeof getAnchorIndicatorStyles>>([])

  // Indicator geometry mirrors the rendered links and therefore must be synchronized with the DOM.
  createEffect(() => {
    const keys = activeKeys()
    if (root) { ensureAnchorLinkVisible(root, keys, orientation()); setInkStyles(getAnchorIndicatorStyles(root, keys, orientation())) }
  })

  const change = (keys: readonly string[]) => {
    const keySet = new Set(keys)
    controller.change(keys, flatItems().filter(({ item }) => keySet.has(item.key)).map(({ item }) => item))
  }
  const update = () => {
    const container = scrollContainer()
    const positions = visibleItems().flatMap(({ item }) => {
      const target = resolveAnchorTarget(item.target)
      return target ? [{ item, top: getAnchorTargetTop(target, container) }] : []
    })
    change(getAnchorActiveKeys({ positions, scrollTop: getAnchorScrollTop(container), viewportHeight: getAnchorViewportHeight(container), offset: local.offset ?? 0, activeOffset: local.activeOffset ?? 0, mode: local.activeMode ?? 'current', scrolledToEnd: isAnchorScrolledToEnd(container) }))
    if (root) { ensureAnchorLinkVisible(root, activeKeys(), orientation()); setInkStyles(getAnchorIndicatorStyles(root, activeKeys(), orientation())) }
  }
  const activate = (item: AnchorItem<JSX.Element>) => {
    const target = resolveAnchorTarget(item.target)
    if (!target) return
    const container = scrollContainer()
    const index = visibleItems().findIndex(({ item: entry }) => entry.key === item.key)
    change(local.activeMode === 'progress' ? visibleItems().slice(0, index + 1).map(({ item: entry }) => entry.key) : [item.key])
    container.scrollTo({ top: Math.max(getAnchorTargetTop(target, container) - (local.offset ?? 0), 0), behavior: local.behavior ?? 'smooth' })
  }
  let frame = 0
  const scheduleUpdate = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update) }
  onMount(() => {
    const container = scrollContainer()
    scheduleUpdate()
    container.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    onCleanup(() => { cancelAnimationFrame(frame); container.removeEventListener('scroll', scheduleUpdate); window.removeEventListener('resize', scheduleUpdate) })
  })

  const renderItems = (items: readonly AnchorItem<JSX.Element>[], level = 0): JSX.Element => (
    <ul data-slot="anchor-list" data-level={level} class={anchorListClassName({ orientation: orientation(), nested: level > 0 })}>
      <For each={items}>{(item) => {
        const active = () => activeKeys().includes(item.key)
        const highlighted = () => highlightedKeys().has(item.key)
        return <li data-slot="anchor-item" data-active={active() || undefined} data-parent-active={!active() && highlighted() || undefined}>
          <button type="button" data-slot="anchor-link" data-anchor-key={item.key} data-state={active() ? 'active' : 'inactive'} class={anchorLinkClassName({ orientation: orientation(), active: highlighted() })} onClick={() => activate(item)}>{item.title}</button>
          {orientation() === 'vertical' && item.children?.length ? renderItems(item.children, level + 1) : null}
        </li>
      }}</For>
    </ul>
  )

  return <nav {...rest} ref={(element) => { root = element; if (typeof local.ref === 'function') local.ref(element) }} data-slot="anchor" data-orientation={orientation()} class={cn(anchorRootClassName({ orientation: orientation() }), local.class)}>
    <div aria-hidden="true" data-slot="anchor-rail" class={anchorRailClassName({ orientation: orientation() })}>
      <For each={inkStyles()}>{(inkStyle) => <span data-slot="anchor-indicator" class={anchorIndicatorClassName({ orientation: orientation() })} style={{ top: inkStyle.top === undefined ? undefined : `${inkStyle.top}px`, left: inkStyle.left === undefined ? undefined : `${inkStyle.left}px`, width: inkStyle.width === undefined ? undefined : `${inkStyle.width}px`, height: inkStyle.height === undefined ? undefined : `${inkStyle.height}px` }} />}</For>
    </div>
    {renderItems(local.items)}
  </nav>
}

export type { AnchorActiveMode, AnchorItem, AnchorOrientation, AnchorTarget } from '@fex-design/core/anchor/types'
export { createAnchorController } from '@fex-design/core/anchor/model'
