import type {
  ComponentProps,
  CSSProperties,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  Ref,
} from 'react'
import { cn } from '@fex/utils'
import { popoverContentClassName, popoverMenuContentClassName } from '@fex-design/styles/popover'
import { useComposedRef } from '../../hooks/use-composed-ref'
import { useCoreStore } from '../../hooks/use-core-store'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import type { ContextMenuTriggerRenderProps } from './context-menu'
import { useContextMenuContext } from './context-menu-context'

function eventInfo(event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) {
  const pointerType =
    'pointerType' in event && typeof event.pointerType === 'string' ? event.pointerType : undefined
  return {
    target: event.target,
    currentTarget: event.currentTarget,
    clientX: 'clientX' in event ? event.clientX : undefined,
    clientY: 'clientY' in event ? event.clientY : undefined,
    button: 'button' in event ? event.button : undefined,
    pointerType,
    event,
    preventDefault: event.preventDefault.bind(event),
    stopPropagation: event.stopPropagation.bind(event),
  }
}

export function useContextMenu<T>(component = 'useContextMenu') {
  const { controller } = useContextMenuContext<T>(component)
  const snapshot = useCoreStore(controller)
  return { ...controller, snapshot }
}

export function useContextMenuTrigger<T, TElement extends HTMLElement = HTMLElement>({
  payload,
  ref,
  onContextMenu,
  onKeyDown,
  ...props
}: {
  payload?: T | undefined
  ref?: Ref<TElement> | undefined
  onContextMenu?: ((event: MouseEvent<TElement>) => void) | undefined
  onKeyDown?: ((event: KeyboardEvent<TElement>) => void) | undefined
} & Omit<HTMLAttributes<TElement>, 'ref' | 'onContextMenu' | 'onKeyDown'>) {
  const contextMenu = useContextMenu<T>('useContextMenuTrigger')
  const snapshot = contextMenu.snapshot
  const setReference = useMemoizedFn((element: HTMLElement | null) => {
    contextMenu.overlay.setReferenceElement(element)
  })
  const composedRef = useComposedRef<TElement>((element) => setReference(element), ref)
  const openAt = useMemoizedFn((event: MouseEvent<TElement>, x = event.clientX, y = event.clientY) => {
    if (event.defaultPrevented) return
    onContextMenu?.(event)
    if (event.defaultPrevented) return
    contextMenu.openAt(
      { payload, element: event.currentTarget, clientX: x, clientY: y, event: event.nativeEvent },
      eventInfo(event),
    )
  })
  const triggerProps: ContextMenuTriggerRenderProps<TElement> = {
    ...props,
    ref: composedRef,
    role: props.role,
    'aria-haspopup': 'menu',
    'data-state': snapshot.overlay.open ? 'open' : 'closed',
    onContextMenu: (event) => openAt(event),
    onKeyDown: (event) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return
      if ((event.shiftKey && event.key === 'F10') || event.key === 'ContextMenu') {
        event.preventDefault()
        const rect = event.currentTarget.getBoundingClientRect()
        openAt(event as unknown as MouseEvent<TElement>, rect.left, rect.bottom)
      }
    },
  }
  return { props: triggerProps, snapshot, openAt }
}

export function useContextMenuContent({
  ref,
  className,
  style,
  onKeyDown,
  ...props
}: {
  ref?: Ref<HTMLDivElement> | undefined
  className?: string | undefined
  style?: CSSProperties | undefined
  onKeyDown?: ((event: KeyboardEvent<HTMLDivElement>) => void) | undefined
} & Omit<ComponentProps<'div'>, 'ref' | 'className' | 'style' | 'onKeyDown'>) {
  const contextMenu = useContextMenu('useContextMenuContent')
  const snapshot = contextMenu.snapshot
  const setContent = useMemoizedFn((element: HTMLDivElement | null) => {
    contextMenu.overlay.setFloatingElement(element)
  })
  const composedRef = useComposedRef<HTMLDivElement>(setContent, ref)
  if (!snapshot.overlay.mounted) return { mounted: false as const, props: null, snapshot }
  return {
    mounted: true as const,
    snapshot,
    props: {
      ...props,
      ref: composedRef,
      role: props.role ?? 'menu',
      tabIndex: -1,
      'data-slot': 'context-menu-content',
      'data-state': snapshot.overlay.open ? 'open' : 'closed',
      'data-phase': snapshot.overlay.phase,
      'data-side': snapshot.overlay.side,
      'data-align': snapshot.overlay.align,
      className: cn(popoverContentClassName(), popoverMenuContentClassName, className),
      style: {
        position: 'var(--floating-strategy, absolute)',
        left: 'var(--floating-x, 0px)',
        top: 'var(--floating-y, 0px)',
        transformOrigin: 'var(--floating-transform-origin)',
        ...style,
      } as CSSProperties,
      onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => onKeyDown?.(event),
    },
  }
}
