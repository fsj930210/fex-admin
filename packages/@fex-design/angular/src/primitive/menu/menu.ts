import {
  handleMenuListFocus,
  handleMenuListKeyDown,
  syncMenuListTabStops,
  type MenuOrientation,
} from '@fex-design/core/menu/navigation'
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  HostListener,
  Input,
  inject,
} from '@angular/core'
import type { AfterContentInit } from '@angular/core'

@Component({ selector: 'fex-menu-root', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[attr.role]': 'role', 'data-slot': 'menu' }, template: '<ng-content />' })
export class MenuRoot { @Input() role = 'menu' }

@Component({
  selector: 'fex-menu-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'group',
    'data-slot': 'menu-list',
    '[attr.aria-orientation]': 'orientation',
    '[attr.data-orientation]': 'orientation',
    '[attr.data-parent-value]': 'parentValue',
  },
  template: '<ng-content />',
})
export class MenuList implements AfterContentInit {
  @Input() orientation: MenuOrientation = 'vertical'
  @Input() parentValue?: string | number
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef)

  ngAfterContentInit() {
    queueMicrotask(() => syncMenuListTabStops(this.elementRef.nativeElement))
  }

  @HostListener('focusin', ['$event'])
  focus(event: FocusEvent) {
    handleMenuListFocus(event)
  }

  @HostListener('keydown', ['$event'])
  keydown(event: KeyboardEvent) {
    handleMenuListKeyDown(event, this.elementRef.nativeElement, this.orientation)
  }
}

@Directive({
  selector: '[fexMenuItem]',
  standalone: true,
  host: {
    role: 'menuitem',
    tabindex: '-1',
    'data-slot': 'menu-item',
    '[attr.aria-disabled]': 'disabled || null',
    '[attr.aria-haspopup]': "submenu ? 'menu' : null",
    '[attr.data-menu-value]': 'value',
    '[attr.data-selected]': "selected ? 'true' : null",
  },
})
export class MenuItem {
  @Input() value?: string | number
  @Input() disabled = false
  @Input() selected = false
  @Input() submenu = false
}

@Component({ selector: 'fex-menu-group', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { role: 'group', 'data-slot': 'menu-group' }, template: '<ng-content />' })
export class MenuGroup {}

@Component({ selector: 'fex-menu-group-label', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { 'data-slot': 'menu-group-label' }, template: '<ng-content />' })
export class MenuGroupLabel {}

@Component({ selector: 'fex-menu-divider', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { role: 'separator', 'data-slot': 'menu-divider' }, template: '' })
export class MenuDivider {}
