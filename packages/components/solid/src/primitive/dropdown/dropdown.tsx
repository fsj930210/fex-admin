import {
  Popover as DropdownRoot,
  PopoverContent,
  PopoverTrigger,
  type PopoverContentProps,
  type PopoverTriggerProps,
} from '../popover/popover'
import { popoverMenuContentClassName } from '@fex/components-styles/popover'
import { cn } from '@fex/utils'
import { usePopover } from '../popover/popover-context'

export { DropdownRoot }

export function DropdownTrigger(props: PopoverTriggerProps) {
  return (
    <PopoverTrigger {...props}>
      {(slot) => props.children({ ...slot, props: { ...slot.props, 'aria-haspopup': 'menu' } })}
    </PopoverTrigger>
  )
}

export function DropdownContent(props: PopoverContentProps) {
  const { hoverAncestors, overlay } = usePopover('DropdownContent')
  return (
    <PopoverContent
      {...props}
      class={cn(popoverMenuContentClassName, props.class)}
      role={props.role ?? 'menu'}
      onClick={(event) => {
        const item = event.target instanceof Element
          ? event.target.closest<HTMLElement>('[role="menuitem"]')
          : null
        if (!event.defaultPrevented && item && !item.hasAttribute('aria-haspopup')) {
          ;[...hoverAncestors, overlay].reverse().forEach((current) =>
            current.close({ reason: 'manual', source: 'menu-item', event }),
          )
        }
      }}
    />
  )
}

export type {
  PopoverContentProps as DropdownContentProps,
  PopoverProps as DropdownRootProps,
  PopoverTriggerProps as DropdownTriggerProps,
} from '../popover/popover'
