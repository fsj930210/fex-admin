import { createMasonryController, type MasonryController } from '@fex-design/core/masonry/create-masonry-controller'
import { resolveMasonryColumns, resolveMasonryGap } from '@fex-design/core/masonry/layout'
import type { MasonryControllerOptions, MasonryKey } from '@fex-design/core/masonry/types'
import { masonryItemClassName, masonryRootClassName, masonryViewportClassName, masonryVirtualViewportClassName } from '@fex-design/styles/masonry'
import { createVirtualizer } from '@tanstack/solid-virtual'
import { cn } from '@fex/utils'
import { createContext, createEffect, createMemo, For, onCleanup, onMount, splitProps, useContext, type Accessor, type JSX, type ParentProps } from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'

interface MasonryContextValue { controller: MasonryController; options: Accessor<MasonryControllerOptions> }
const MasonryContext = createContext<MasonryContextValue>()
function useMasonryContext(part: string) { const value = useContext(MasonryContext); if (!value) throw new Error(`${part} must be used inside MasonryRoot.`); return value }

export type MasonryRootProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement> & MasonryControllerOptions>
export function MasonryRoot(props: MasonryRootProps) {
  const [local, attrs] = splitProps(props, ['columns', 'gap', 'placement', 'direction', 'onLayoutChange', 'class', 'children'])
  const controller = createMasonryController()
  let element!: HTMLDivElement
  const options = () => ({ columns: local.columns, gap: local.gap, placement: local.placement, direction: local.direction ?? 'ltr', onLayoutChange: local.onLayoutChange })
  createEffect(() => controller.setOptions(options()))
  onMount(() => { const observer = new ResizeObserver(([entry]) => controller.setWidth(entry?.contentRect.width ?? 0)); observer.observe(element); onCleanup(() => observer.disconnect()) })
  onCleanup(() => controller.destroy())
  return <MasonryContext.Provider value={{ controller, options }}><div {...attrs} ref={element} dir={local.direction ?? 'ltr'} data-slot="masonry" class={cn(masonryRootClassName, local.class)}>{local.children}</div></MasonryContext.Provider>
}

export function MasonryViewport(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  const [local, attrs] = splitProps(props, ['class', 'style', 'children'])
  const { controller } = useMasonryContext('MasonryViewport'), snapshot = createCoreStoreSignal(controller)
  return <div {...attrs} data-slot="masonry-viewport" class={cn(masonryViewportClassName, local.class)} style={{ ...(local.style as JSX.CSSProperties), height: `${snapshot().height}px` }}>{local.children}</div>
}

export interface MasonryItemProps extends ParentProps<JSX.HTMLAttributes<HTMLDivElement>> { itemKey: MasonryKey; index: number; column?: number }
export function MasonryItem(props: MasonryItemProps) {
  const [local, attrs] = splitProps(props, ['itemKey', 'index', 'column', 'class', 'style', 'children'])
  const { controller } = useMasonryContext('MasonryItem'), snapshot = createCoreStoreSignal(controller)
  const position = createMemo(() => snapshot().items.find(item => item.key === local.itemKey))
  let element!: HTMLDivElement
  onMount(() => { const commit = (height: number) => controller.setItem({ key: local.itemKey, index: local.index, column: local.column, height }); const observer = new ResizeObserver(([entry]) => commit(entry?.borderBoxSize[0]?.blockSize ?? entry?.contentRect.height ?? 0)); observer.observe(element); commit(element.getBoundingClientRect().height); onCleanup(() => { observer.disconnect(); controller.removeItem(local.itemKey) }) })
  createEffect(() => { local.index; local.column; if (element) controller.setItem({ key: local.itemKey, index: local.index, column: local.column, height: element.getBoundingClientRect().height }) })
  return <div {...attrs} ref={element} data-slot="masonry-item" data-column={position()?.column} class={cn(masonryItemClassName, local.class)} style={{ ...(local.style as JSX.CSSProperties), visibility: position() ? undefined : 'hidden', '--masonry-inline-start': `${position()?.inlineStart ?? 0}px`, '--masonry-top': `${position()?.top ?? 0}px`, '--masonry-item-width': `${position()?.width ?? snapshot().columnWidth}px` }}>{local.children}</div>
}

export interface MasonryVirtualViewportProps<T> extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> { items: readonly T[]; getItemKey: (item: T, index: number) => MasonryKey; estimateSize: (item: T, index: number) => number; height: number; overscan?: number; children: (item: T, index: number) => JSX.Element }
export function MasonryVirtualViewport<T>(props: MasonryVirtualViewportProps<T>) {
  const [local, attrs] = splitProps(props, ['items', 'getItemKey', 'estimateSize', 'height', 'overscan', 'children', 'class', 'style'])
  const { controller, options } = useMasonryContext('MasonryVirtualViewport'), snapshot = createCoreStoreSignal(controller)
  const gap = () => resolveMasonryGap(options().gap), columns = () => resolveMasonryColumns(options().columns, snapshot().width, gap().column)
  const columnWidth = () => Math.max(0, (snapshot().width - gap().column * (columns() - 1)) / columns()), directionSign = () => options().direction === 'rtl' ? -1 : 1
  let scroll!: HTMLDivElement
  const virtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({ get count() { return local.items.length }, getScrollElement: () => scroll, getItemKey: index => local.getItemKey(local.items[index] as T, index), estimateSize: index => local.estimateSize(local.items[index] as T, index), get overscan() { return local.overscan ?? 4 }, get gap() { return gap().row }, get lanes() { return columns() }, laneAssignmentMode: 'measured' })
  return <div {...attrs} ref={scroll} data-slot="masonry-virtual-viewport" class={cn(masonryVirtualViewportClassName, local.class)} style={{ ...(local.style as JSX.CSSProperties), height: `${local.height}px` }}><div class="relative w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}><For each={virtualizer.getVirtualItems()}>{virtualItem => <div data-index={virtualItem.index} data-column={virtualItem.lane} ref={(element) => queueMicrotask(() => virtualizer.measureElement(element))} class="absolute start-0 top-0 min-w-0" style={{ width: `${columnWidth()}px`, transform: `translate3d(${directionSign() * (virtualItem.lane ?? 0) * (columnWidth() + gap().column)}px, ${virtualItem.start}px, 0)` }}>{local.children(local.items[virtualItem.index] as T, virtualItem.index)}</div>}</For></div></div>
}

export type { MasonryColumns, MasonryGap, MasonryLayoutDetail, MasonryPlacement } from '@fex-design/core/masonry/types'
