import { ChangeDetectionStrategy, Component, Directive, HostListener, forwardRef } from '@angular/core'
import {
  popoverContentClassName,
  popoverMenuContentClassName,
} from '@fex-design/styles/popover'
import { cn } from '@fex/utils'
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover'
import { createHostClassName } from '../../signals/host-class'

@Component({
  selector: 'fex-dropdown',
  standalone: true,
  providers: [{ provide: Popover, useExisting: forwardRef(() => DropdownRoot) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
})
export class DropdownRoot extends Popover {}

@Directive({
  selector: '[fexDropdownTrigger]',
  standalone: true,
  host: { 'aria-haspopup': 'menu' },
})
export class DropdownTrigger extends PopoverTrigger {}

@Component({
  selector: 'fex-dropdown-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'menu' },
  template: '<ng-content />',
})
export class DropdownContent extends PopoverContent {
  protected override readonly hostClassName = createHostClassName(
    cn(popoverContentClassName(), popoverMenuContentClassName),
  )

  @HostListener('click', ['$event'])
  closeFromItem(event: MouseEvent) {
    const item = event.target instanceof Element
      ? event.target.closest<HTMLElement>('[role="menuitem"]')
      : null
    if (!event.defaultPrevented && item && !item.hasAttribute('aria-haspopup')) {
      ;[...this.popover.hoverAncestors, this.popover.overlay].reverse().forEach((current) =>
        current.close({ reason: 'manual', source: 'menu-item', event }),
      )
    }
  }
}
