import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ChevronDownIcon } from '@fex-design/angular/icon/chevron'
import { DropdownContent } from '@fex-design/angular/primitive/dropdown'
import { MenuItem, MenuList, MenuRoot } from '@fex-design/angular/primitive/menu'
import { Popover, PopoverPortal, PopoverTrigger } from '@fex-design/angular/primitive/popover'
import { navListClassName, navPanelClassName, navTriggerClassName } from './demo-styles'

@Component({
  selector: 'app-menu-nav-demo',
  standalone: true,
  imports: [MenuRoot, MenuList, MenuItem, Popover, PopoverTrigger, PopoverPortal, DropdownContent, ChevronDownIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav-demo.component.html',
})
export class MenuNavDemoComponent {
  protected readonly components: ReadonlyArray<readonly [string, string]> = [
    ['Alert Dialog', 'A modal dialog that interrupts the user with important content.'],
    ['Hover Card', 'For sighted users to preview content behind a link.'],
    ['Progress', 'Displays an indicator showing completion progress.'],
    ['Scroll Area', 'Augments native scroll functionality for custom styling.'],
  ]
  protected readonly navListClassName = navListClassName
  protected readonly navPanelClassName = navPanelClassName
  protected readonly navTriggerClassName = navTriggerClassName
  protected anchor(label: string) { return '#' + label.toLowerCase().replace(' ', '-') }
}
