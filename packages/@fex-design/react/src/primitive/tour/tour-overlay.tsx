import { useId } from 'react'
import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { cn } from '@fex/utils'
import { tourOverlayClassName } from '@fex-design/styles/tour'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import { useTourContext } from './tour-context'

export interface TourOverlayRenderProps {
  props: {
    className: string
    style: CSSProperties
    onClick: (event: MouseEvent<HTMLDivElement>) => void
    'data-slot': string
  }
  targetRect: DOMRect | null
  gap: number | [number, number]
  color: string
}

export interface TourOverlayProps {
  children?: ReactNode | ((props: TourOverlayRenderProps) => ReactNode)
  className?: string
  style?: CSSProperties
}

export function TourOverlay({ children, className, style }: TourOverlayProps) {
  const { snapshot, overlay, closeOnOverlayClick, controller, defaultGap, zIndex } = useTourContext('TourOverlay')
  const maskId = `tour-spotlight-mask-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const step = snapshot.currentStep
  const mask = step?.mask !== false && overlay
  const color = typeof step?.mask === 'object' && step.mask.color ? step.mask.color : 'rgba(15, 23, 42, 0.58)'
  const gap = step?.gap?.offset ?? defaultGap
  const target = snapshot.targetRect
  const paddingX = Array.isArray(gap) ? gap[0] : gap
  const paddingY = Array.isArray(gap) ? gap[1] : gap
  const rect = target
    ? {
        x: target.x - paddingX,
        y: target.y - paddingY,
        width: target.width + paddingX * 2,
        height: target.height + paddingY * 2,
      }
    : null
  const onClick = useMemoizedFn((event: MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) controller.close()
  })
  const props = {
    className: cn(tourOverlayClassName, className),
    style: { pointerEvents: step?.disabledInteraction ? 'auto' : 'none', zIndex: zIndex - 1, ...style },
    onClick,
    'data-slot': 'tour-overlay',
  } satisfies TourOverlayRenderProps['props']
  const renderProps = { props, targetRect: target, gap, color }
  if (!snapshot.open || !mask) return null
  if (typeof children === 'function') return children(renderProps)
  return (
    <div {...props}>
      <svg aria-hidden="true" className="size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <mask id={maskId}>
            <rect width="100" height="100" fill="white" />
            {rect ? (
              <rect
                x={`${(rect.x / window.innerWidth) * 100}%`}
                y={`${(rect.y / window.innerHeight) * 100}%`}
                width={`${(rect.width / window.innerWidth) * 100}%`}
                height={`${(rect.height / window.innerHeight) * 100}%`}
                fill="black"
              />
            ) : null}
          </mask>
        </defs>
        <rect
          width="100"
          height="100"
          fill={color}
          mask={`url(#${maskId})`}
        />
      </svg>
    </div>
  )
}
