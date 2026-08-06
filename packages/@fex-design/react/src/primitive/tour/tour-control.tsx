import type { ButtonHTMLAttributes, MouseEvent, Ref } from 'react'
import { cn } from '@fex/utils'
import { tourControlClassName } from '@fex-design/styles/tour'
import { useTourContext } from './tour-context'

export type TourAction = 'previous' | 'next' | 'skip' | 'close' | 'complete'

export interface TourControlProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  action: TourAction
  ref?: Ref<HTMLButtonElement>
}

export function TourControl({ action, className, onClick, ref, ...props }: TourControlProps) {
  const { controller, snapshot } = useTourContext('TourControl')
  const disabled = props.disabled || (action === 'previous' && snapshot.isFirst)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || disabled) return
    if (action === 'previous') void controller.previous()
    else if (action === 'next') void controller.next()
    else if (action === 'skip') controller.skip()
    else if (action === 'close') controller.close()
    else controller.complete()
  }
  return (
    <button
      {...props}
      ref={ref}
      type={props.type ?? 'button'}
      disabled={disabled}
      data-tour-action={action}
      className={cn(tourControlClassName, className)}
      onClick={handleClick}
    />
  )
}
