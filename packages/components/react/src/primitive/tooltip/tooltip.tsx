import { useId, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { createPortal } from 'react-dom'
import { createTooltip, type TooltipOptions } from '@fex/components-core/tooltip/create-tooltip'
import { shallowEqualObject } from '@fex/utils'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { useLazyRef } from '../../hooks/use-lazy-ref'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import useUnmount from '../../hooks/use-unmount'
import { TooltipContext } from './tooltip-context'
import { useTooltip, useTooltipArrow, useTooltipContent, useTooltipTrigger, type UseTooltipTriggerProps } from './use-tooltip'

export interface TooltipRootProps extends TooltipOptions { children?: ReactNode }

export function TooltipRoot({ children, open: openProp, defaultOpen, onOpenChange, ...config }: TooltipRootProps) {
  const controlled = openProp !== undefined
  const [localOpen, setLocalOpen] = useState(defaultOpen ?? false)
  const handleOpenChange = useMemoizedFn<NonNullable<TooltipOptions['onOpenChange']>>((open, info) => {
    if (!controlled) setLocalOpen(open)
    onOpenChange?.(open, info)
  })
  const options: TooltipOptions = { ...config, open: controlled ? openProp : localOpen, onOpenChange: handleOpenChange }
  const overlayRef = useLazyRef(() => createTooltip(options))
  const latestOptions = useRef(options)
  const triggerRef = useRef<HTMLElement | null>(null)
  const contentId = `fex-tooltip-${useId().replaceAll(':', '')}`
  const overlay = overlayRef.current
  useIsomorphicLayoutEffect(() => {
    if (shallowEqualObject(latestOptions.current, options)) return
    latestOptions.current = options
    overlay.setOptions(options)
  })
  useUnmount(() => overlay.destroy())
  return <TooltipContext value={{ contentId, overlay, triggerRef }}>{children}</TooltipContext>
}

export type TooltipTriggerRenderProps = ReturnType<typeof useTooltipTrigger>['props']
export interface TooltipTriggerProps extends UseTooltipTriggerProps { children: (props: TooltipTriggerRenderProps) => ReactNode }
export function TooltipTrigger({ children, ...props }: TooltipTriggerProps) { return children(useTooltipTrigger(props).props) }

export interface TooltipPortalProps { children?: ReactNode; container?: HTMLElement | null; forceMount?: boolean }
export function TooltipPortal({ children, container, forceMount }: TooltipPortalProps) {
  const { overlay, snapshot } = useTooltip('TooltipPortal')
  const target = container ?? overlay.resolvePopupContainer()
  return target && (snapshot.mounted || forceMount) ? createPortal(children, target) : null
}

export interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> { ref?: Ref<HTMLDivElement> }
export function TooltipContent({ children, ...props }: TooltipContentProps) {
  const content = useTooltipContent(props)
  return content.mounted ? <div {...content.props}>{children}</div> : null
}

export interface TooltipArrowProps extends HTMLAttributes<HTMLDivElement> { ref?: Ref<HTMLDivElement> }
export function TooltipArrow(props: TooltipArrowProps) { return <div {...useTooltipArrow(props).props} /> }

export { useTooltip, useTooltipArrow, useTooltipContent, useTooltipTrigger } from './use-tooltip'
