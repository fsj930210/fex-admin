import { sortableClassName, sortableItemClassName } from '@fex/components-styles/sortable'
import { cn } from '@fex/utils'
import { createContext, use } from 'react'
import { createPortal } from 'react-dom'
import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from 'react'
import type { SortableAxis, SortableId, SortableItems } from '@fex/components-core/sortable/types'
import { useSortable } from '../../hooks/use-sortable'

interface SortableContextValue {
  getContainerProps: ReturnType<typeof useSortable>['getContainerProps']
  getItemProps: ReturnType<typeof useSortable>['getItemProps']
  getHandleProps: ReturnType<typeof useSortable>['getHandleProps']
  getOverlayStyle: ReturnType<typeof useSortable>['getOverlayStyle']
  activeId: SortableId | null
}

const SortableContext = createContext<SortableContextValue | null>(null)

export interface SortableRootProps<TItems extends SortableItems>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  items: TItems
  axis?: SortableAxis
  containerId?: string
  children: ReactNode
  onChange?: (items: TItems) => void
}

export function SortableRoot<TItems extends SortableItems>({
  items,
  axis,
  containerId = 'default',
  className,
  children,
  onChange,
  ...props
}: SortableRootProps<TItems>) {
  const sortable = useSortable({ items, axis, onChange })
  const containerProps = sortable.getContainerProps(containerId)

  return (
    <SortableContext value={sortable}>
      <div {...props} {...containerProps} className={cn(sortableClassName, className)}>
        {children}
      </div>
    </SortableContext>
  )
}

export interface SortableItemRenderState {
  active: boolean
  style: CSSProperties
  props: HTMLAttributes<HTMLElement>
  handleProps: HTMLAttributes<HTMLElement>
}

export interface SortableItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  id: SortableId
  containerId?: string
  children?: ReactNode | ((state: SortableItemRenderState) => ReactNode)
}

export function SortableItem({
  id,
  containerId = 'default',
  className,
  children,
  ...props
}: SortableItemProps) {
  const sortable = useSortableContext()
  const itemProps = sortable.getItemProps(id, containerId)
  const handleProps = sortable.getHandleProps()
  const active = sortable.activeId === id
  const state = {
    active,
    style: itemProps.style ?? {},
    props: itemProps,
    handleProps,
  }

  if (typeof children === 'function') {
    return children(state)
  }

  return (
    <div
      {...props}
      {...itemProps}
      className={cn(sortableItemClassName, className)}
      data-active={active || undefined}
    >
      {children}
    </div>
  )
}

export interface SortableHandleProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function SortableHandle({ className, type = 'button', ...props }: SortableHandleProps) {
  const sortable = useSortableContext()

  return (
    <button
      {...props}
      {...sortable.getHandleProps()}
      type={type}
      className={cn('cursor-grab touch-none select-none active:cursor-grabbing', className)}
    />
  )
}

export interface SortableOverlayRenderState {
  activeId: SortableId
  style: CSSProperties
}

export interface SortableOverlayProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode | ((state: SortableOverlayRenderState) => ReactNode)
}

export function SortableOverlay({ className, children, style, ...props }: SortableOverlayProps) {
  const sortable = useSortableContext()
  const activeId = sortable.activeId
  if (!activeId) {
    return null
  }

  const overlayStyle = {
    ...sortable.getOverlayStyle(),
    ...style,
  }
  const state = { activeId, style: overlayStyle }

  return createPortal(
    <div
      {...props}
      data-sortable-overlay=""
      className={cn(
        sortableItemClassName,
        'bg-card text-foreground opacity-100 shadow-xl ring-1 ring-border/70',
        className,
      )}
      style={overlayStyle}
    >
      {typeof children === 'function' ? children(state) : children}
    </div>,
    document.body,
  )
}

function useSortableContext() {
  const context = use(SortableContext)
  if (!context) {
    throw new Error('Sortable components must be used inside SortableRoot.')
  }

  return context
}

export const Sortable = {
  Root: SortableRoot,
  Item: SortableItem,
  Handle: SortableHandle,
  Overlay: SortableOverlay,
}
