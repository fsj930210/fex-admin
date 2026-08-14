import { createContext, use, useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { createMasonryController, type MasonryController } from '@fex-design/core/masonry/create-masonry-controller'
import type { MasonryColumns, MasonryControllerOptions, MasonryKey } from '@fex-design/core/masonry/types'
import { resolveMasonryColumns, resolveMasonryGap } from '@fex-design/core/masonry/layout'
import { masonryItemClassName, masonryRootClassName, masonryViewportClassName, masonryVirtualViewportClassName } from '@fex-design/styles/masonry'
import { cn } from '@fex/utils'
import { useCoreStore } from '../../hooks/use-core-store'
import { useLazyRef } from '../../hooks/use-lazy-ref'

interface MasonryContextValue {
  controller: MasonryController
  options: MasonryControllerOptions
}

const MasonryContext = createContext<MasonryContextValue | null>(null)

function useMasonryContext() {
  const value = use(MasonryContext)
  if (!value) throw new Error('Masonry parts must be used within MasonryRoot')
  return value
}

export interface MasonryRootProps extends Omit<HTMLAttributes<HTMLDivElement>, 'dir'>, MasonryControllerOptions {}

export function MasonryRoot({ columns, gap, placement, direction = 'ltr', onLayoutChange, className, children, ...props }: MasonryRootProps) {
  const controller = useLazyRef(() => createMasonryController({ columns, gap, placement, direction, onLayoutChange })).current
  const rootRef = useRef<HTMLDivElement>(null)
  controller.setOptions({ columns, gap, placement, direction, onLayoutChange })

  // Container geometry is an external DOM source and must stay synchronized with core.
  useEffect(() => {
    const element = rootRef.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => controller.setWidth(entry?.contentRect.width ?? 0))
    observer.observe(element)
    return () => observer.disconnect()
  }, [controller])

  useEffect(() => () => controller.destroy(), [controller])

  return (
    <MasonryContext value={{ controller, options: { columns, gap, placement, direction, onLayoutChange } }}>
      <div {...props} ref={rootRef} dir={direction} data-slot="masonry" className={cn(masonryRootClassName, className)}>
        {children}
      </div>
    </MasonryContext>
  )
}

export function MasonryViewport({ className, style, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { controller } = useMasonryContext()
  const snapshot = useCoreStore(controller)
  return <div {...props} data-slot="masonry-viewport" className={cn(masonryViewportClassName, className)} style={{ ...style, height: snapshot.height }} />
}

export interface MasonryItemProps extends HTMLAttributes<HTMLDivElement> {
  itemKey: MasonryKey
  index: number
  column?: number
}

export function MasonryItem({ itemKey, index, column, className, style, ...props }: MasonryItemProps) {
  const { controller } = useMasonryContext()
  const snapshot = useCoreStore(controller)
  const itemRef = useRef<HTMLDivElement>(null)
  const position = snapshot.items.find((item) => item.key === itemKey)

  // Item size is external layout state; one observer instance follows this item's element.
  useEffect(() => {
    const element = itemRef.current
    if (!element) return
    const commit = (height: number) => controller.setItem({ key: itemKey, index, column, height })
    const observer = new ResizeObserver(([entry]) => commit(entry?.borderBoxSize[0]?.blockSize ?? entry?.contentRect.height ?? 0))
    observer.observe(element)
    commit(element.getBoundingClientRect().height)
    return () => {
      observer.disconnect()
      controller.removeItem(itemKey)
    }
  }, [column, controller, index, itemKey])

  return (
    <div
      {...props}
      ref={itemRef}
      data-slot="masonry-item"
      data-column={position?.column}
      data-positioned={position ? '' : undefined}
      className={cn(masonryItemClassName, className)}
      style={{
        ...style,
        visibility: position ? style?.visibility : 'hidden',
        '--masonry-inline-start': `${position?.inlineStart ?? 0}px`,
        '--masonry-top': `${position?.top ?? 0}px`,
        '--masonry-item-width': `${position?.width ?? snapshot.columnWidth}px`,
      } as CSSProperties}
    />
  )
}

export interface MasonryVirtualViewportProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  items: readonly T[]
  getItemKey: (item: T, index: number) => MasonryKey
  estimateSize: (item: T, index: number) => number
  height: number
  overscan?: number
  children: (item: T, index: number) => ReactNode
}

export function MasonryVirtualViewport<T>({ items, getItemKey, estimateSize, height, overscan = 4, children, className, style, ...props }: MasonryVirtualViewportProps<T>) {
  const { controller, options } = useMasonryContext()
  const snapshot = useCoreStore(controller)
  const scrollRef = useRef<HTMLDivElement>(null)
  const gap = resolveMasonryGap(options.gap)
  const columns = resolveMasonryColumns(options.columns as MasonryColumns | undefined, snapshot.width, gap.column)
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    getItemKey: (index) => getItemKey(items[index] as T, index),
    estimateSize: (index) => estimateSize(items[index] as T, index),
    overscan,
    gap: gap.row,
    lanes: columns,
    laneAssignmentMode: 'measured',
  })
  const columnWidth = Math.max(0, (snapshot.width - gap.column * (columns - 1)) / columns), sign = options.direction === 'rtl' ? -1 : 1

  return (
    <div {...props} ref={scrollRef} data-slot="masonry-virtual-viewport" className={cn(masonryVirtualViewportClassName, className)} style={{ ...style, height }}>
      <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = items[virtualItem.index]
          if (!item) return null
          return (
            <div
              key={virtualItem.key}
              ref={virtualizer.measureElement}
              data-index={virtualItem.index}
              data-column={virtualItem.lane}
              className="absolute start-0 top-0 min-w-0"
              style={{ width: columnWidth, transform: `translate3d(${sign * (virtualItem.lane ?? 0) * (columnWidth + gap.column)}px, ${virtualItem.start}px, 0)` }}
            >
              {children(item, virtualItem.index)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export type { MasonryColumns, MasonryGap, MasonryLayoutDetail, MasonryPlacement } from '@fex-design/core/masonry/types'
