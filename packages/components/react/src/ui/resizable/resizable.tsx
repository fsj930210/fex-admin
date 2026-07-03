import { resizePanelPair, normalizePanelLayout } from '@fex/components-core/resizable/layout'
import { cn } from '@fex/utils'
import { createContext, use, useRef, useState } from 'react'
import type { HTMLAttributes, KeyboardEvent, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import type { ResizableDirection, ResizablePanelConfig } from '@fex/components-core/resizable/types'
import { useControllableState } from '../../hooks/use-controllable-state'

interface ResizableContextValue {
  direction: ResizableDirection
  groupElement: HTMLDivElement | null
  layout: number[]
  registerPanel: (config: ResizablePanelConfig) => number
  resizeHandle: (handleIndex: number, deltaPercent: number) => void
}

const ResizableContext = createContext<ResizableContextValue | null>(null)

export interface ResizablePanelGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  direction?: ResizableDirection
  layout?: number[]
  defaultLayout?: number[]
  onLayout?: (layout: number[]) => void
  children: ReactNode
}

export function ResizablePanelGroup({
  direction = 'horizontal',
  layout,
  defaultLayout,
  onLayout,
  className,
  children,
  ...props
}: ResizablePanelGroupProps) {
  const [groupElement, setGroupElement] = useState<HTMLDivElement | null>(null)
  const panelConfigsRef = useRef<ResizablePanelConfig[]>([])
  const [currentLayout, setCurrentLayout] = useControllableState<number[]>({
    value: layout,
    defaultValue: defaultLayout ?? [],
    onChange: onLayout,
  })

  function registerPanel(config: ResizablePanelConfig) {
    const existingIndex = panelConfigsRef.current.findIndex((panel) => panel.id === config.id)
    if (existingIndex >= 0) {
      panelConfigsRef.current[existingIndex] = config
      return existingIndex
    }

    panelConfigsRef.current.push(config)
    return panelConfigsRef.current.length - 1
  }

  function resizeHandle(handleIndex: number, deltaPercent: number) {
    setCurrentLayout((value) =>
      resizePanelPair({
        layout: normalizePanelLayout(panelConfigsRef.current, value),
        panelConfigs: panelConfigsRef.current,
        handleIndex,
        delta: deltaPercent,
      }),
    )
  }

  return (
    <ResizableContext
      value={{ direction, groupElement, layout: currentLayout, registerPanel, resizeHandle }}
    >
      <div
        {...props}
        ref={setGroupElement}
        className={cn(
          'flex h-full w-full',
          direction === 'vertical' && 'flex-col',
          className,
        )}
        data-resizable-panel-group=""
        data-orientation={direction}
      >
        {children}
      </div>
    </ResizableContext>
  )
}

export interface ResizablePanelProps extends HTMLAttributes<HTMLDivElement> {
  id: string
  defaultSize?: number
  minSize?: number
  maxSize?: number
}

export function ResizablePanel({
  id,
  defaultSize,
  minSize,
  maxSize,
  className,
  style,
  ...props
}: ResizablePanelProps) {
  const context = useResizableContext()
  const index = context.registerPanel({ id, defaultSize, minSize, maxSize })
  const fallbackLayout = normalizePanelLayout([{ id, defaultSize, minSize, maxSize }], [defaultSize ?? 100])
  const basis = context.layout[index] ?? defaultSize ?? fallbackLayout[0]

  return (
    <div
      {...props}
      className={cn('min-h-0 min-w-0 overflow-hidden', className)}
      style={{
        ...style,
        flexBasis: `${basis}%`,
        flexGrow: 0,
        flexShrink: 0,
      }}
      data-resizable-panel={id}
    />
  )
}

export interface ResizableHandleProps extends HTMLAttributes<HTMLDivElement> {
  index?: number
  disabled?: boolean
}

export function ResizableHandle({ index, disabled, className, onKeyDown, ...props }: ResizableHandleProps) {
  const context = useResizableContext()
  const handleRef = useRef<HTMLDivElement | null>(null)
  const handleIndex = index ?? Math.max(0, context.layout.length - 2)

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (disabled) {
      return
    }
    let previous = context.direction === 'horizontal' ? event.clientX : event.clientY
    const size =
      context.direction === 'horizontal'
        ? context.groupElement?.getBoundingClientRect().width
        : context.groupElement?.getBoundingClientRect().height
    if (!size || !handleRef.current) {
      return
    }

    handleRef.current.setPointerCapture(event.pointerId)

    function onPointerMove(moveEvent: PointerEvent) {
      const current = context.direction === 'horizontal' ? moveEvent.clientX : moveEvent.clientY
      context.resizeHandle(handleIndex, ((current - previous) / size) * 100)
      previous = current
    }

    function onPointerUp() {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp, { once: true })
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented || disabled) {
      return
    }

    const step = event.shiftKey ? 10 : 2
    const isHorizontal = context.direction === 'horizontal'
    if ((isHorizontal && event.key === 'ArrowLeft') || (!isHorizontal && event.key === 'ArrowUp')) {
      context.resizeHandle(handleIndex, -step)
      event.preventDefault()
    }
    if ((isHorizontal && event.key === 'ArrowRight') || (!isHorizontal && event.key === 'ArrowDown')) {
      context.resizeHandle(handleIndex, step)
      event.preventDefault()
    }
  }

  return (
    <div
      {...props}
      ref={handleRef}
      role="separator"
      tabIndex={0}
      aria-orientation={context.direction === 'horizontal' ? 'vertical' : 'horizontal'}
      aria-disabled={disabled || undefined}
      className={cn(
        'relative flex shrink-0 touch-none select-none items-center justify-center outline-none transition-colors after:absolute after:bg-border focus-visible:after:bg-ring',
        context.direction === 'horizontal'
          ? 'h-full w-3 cursor-col-resize after:h-full after:w-px'
          : 'h-3 w-full cursor-row-resize after:h-px after:w-full',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
      data-resizable-handle=""
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
    />
  )
}

function useResizableContext() {
  const context = use(ResizableContext)
  if (!context) {
    throw new Error('Resizable components must be used inside ResizablePanelGroup.')
  }

  return context
}

export const Resizable = {
  PanelGroup: ResizablePanelGroup,
  Panel: ResizablePanel,
  Handle: ResizableHandle,
}
