import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
  type PopoverContentProps,
  type PopoverRootProps,
  type PopoverTriggerProps,
} from '../popover/popover'
import { popoverMenuContentClassName } from '@fex/components-styles/popover'
import { cn } from '@fex/utils'
import { usePopover } from '../popover/use-popover'

export type DropdownRootProps = PopoverRootProps
export type DropdownTriggerProps = PopoverTriggerProps
export type DropdownContentProps = PopoverContentProps

export function DropdownRoot(props: DropdownRootProps) {
  return <PopoverRoot {...props} />
}

export function DropdownTrigger(props: DropdownTriggerProps) {
  return <PopoverTrigger {...props} aria-haspopup="menu" />
}

export function DropdownContent(props: DropdownContentProps) {
  const { hoverAncestors, overlay } = usePopover('DropdownContent')
  return (
    <PopoverContent
      {...props}
      className={cn(popoverMenuContentClassName, props.className)}
      role={props.role ?? 'menu'}
      onClick={(event) => {
        props.onClick?.(event)
        const item = event.target instanceof Element
          ? event.target.closest<HTMLElement>('[role="menuitem"]')
          : null
        if (!event.defaultPrevented && item && !item.hasAttribute('aria-haspopup')) {
          ;[...hoverAncestors, overlay].reverse().forEach((current) =>
            current.close({ reason: 'manual', source: 'menu-item', event: event.nativeEvent }),
          )
        }
      }}
    />
  )
}
