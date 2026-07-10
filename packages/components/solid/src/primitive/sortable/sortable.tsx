import { sortableClassName, sortableItemClassName } from '@fex/components-styles/sortable'
import { cn } from '@fex/utils'
import type { SortableAxis, SortableId, SortableItems } from '@fex/components-core/sortable/types'
import type { JSX, ParentProps } from 'solid-js'
import { Portal } from 'solid-js/web'
import { createSortable, type CreateSortableOptions } from '../../primitives/create-sortable'

import { SortableContext, useSortableContext, type SortableContextValue } from './sortable-context'

export interface SortableRootProps<TItems extends SortableItems> {
  items: TItems
  axis?: SortableAxis
  containerId?: string
  class?: string
  onChange?: (items: TItems) => void
  children?: JSX.Element | ((state: { items: TItems }) => JSX.Element)
}

export function SortableRoot<TItems extends SortableItems>(props: SortableRootProps<TItems>) {
  const createOptions = (): CreateSortableOptions<TItems> => ({
    items: props.items,
    ...(props.axis === undefined ? {} : { axis: props.axis }),
    ...(props.onChange === undefined ? {} : { onChange: props.onChange }),
  })
  const sortable = createSortable(createOptions())
  const context: SortableContextValue = {
    ...sortable,
    previewItems: sortable.previewItems,
    update: (next) => sortable.update(next as unknown as CreateSortableOptions<TItems>),
    syncOptions: () => sortable.update(createOptions()),
  }
  const currentItems = () => {
    if (sortable.snapshot().dragging) {
      return sortable.previewItems() as TItems
    }
    return props.items
  }

  return (
    <SortableContext.Provider value={context}>
      <div
        ref={sortable.setContainer(props.containerId ?? 'default')}
        data-sortable-container={props.containerId ?? 'default'}
        class={cn(sortableClassName, props.class)}
      >
        {typeof props.children === 'function'
          ? (props.children as (state: { items: TItems }) => JSX.Element)({ items: currentItems() })
          : props.children}
      </div>
    </SortableContext.Provider>
  )
}

export interface SortableItemProps extends ParentProps<JSX.HTMLAttributes<HTMLDivElement>> {
  id: SortableId
  containerId?: string
}

export function SortableItem(props: SortableItemProps) {
  const sortable = useSortableContext()
  const containerId = () => props.containerId ?? 'default'
  function handlePointerDown(event: PointerEvent) {
    sortable.syncOptions()
    sortable.onPointerDown(event, props.id, containerId())
  }

  return (
    <div
      ref={sortable.setItem(props.id, containerId())}
      data-active={sortable.snapshot().activeId === props.id || undefined}
      data-sortable-id={props.id}
      data-sortable-container-id={containerId()}
      onPointerDown={handlePointerDown}
      style={sortable.getItemStyle(props.id)}
      class={cn(sortableItemClassName, props.class)}
    >
      {props.children}
    </div>
  )
}

export function SortableHandle(props: ParentProps<JSX.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      data-sortable-handle=""
      class={cn('cursor-grab touch-none select-none active:cursor-grabbing', props.class)}
    />
  )
}

export interface SortableOverlayProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: JSX.Element | ((activeId: SortableId) => JSX.Element)
}

export function SortableOverlay(props: SortableOverlayProps) {
  const sortable = useSortableContext()

  return (
    <>
      {sortable.snapshot().activeId && (
        <Portal>
          <div
            data-sortable-overlay=""
            style={sortable.getOverlayStyle()}
            class={cn(
              sortableItemClassName,
              'bg-card text-foreground opacity-100 shadow-xl ring-1 ring-border/70',
              props.class,
            )}
          >
            {typeof props.children === 'function'
              ? (props.children as (activeId: SortableId) => JSX.Element)(sortable.snapshot().activeId as SortableId)
              : props.children}
          </div>
        </Portal>
      )}
    </>
  )
}
