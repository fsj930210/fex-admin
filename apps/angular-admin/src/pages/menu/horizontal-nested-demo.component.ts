import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ChevronDownIcon, ChevronRightIcon } from '@fex-design/angular/icon/chevron'
import { DropdownContent } from '@fex-design/angular/primitive/dropdown'
import { MenuItem, MenuList, MenuRoot } from '@fex-design/angular/primitive/menu'
import { Popover, PopoverPortal, PopoverTrigger } from '@fex-design/angular/primitive/popover'
import { horizontalItemClassName, horizontalListClassName, popupClassName, rootClassName, verticalItemClassName, verticalListClassName } from './demo-styles'

@Component({
  selector: 'app-menu-horizontal-nested-demo',
  standalone: true,
  imports: [MenuRoot, MenuList, MenuItem, Popover, PopoverTrigger, PopoverPortal, DropdownContent, ChevronDownIcon, ChevronRightIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './horizontal-nested-demo.component.html',
})
export class MenuHorizontalNestedDemoComponent {
  protected readonly rootClassName = rootClassName
  protected readonly horizontalListClassName = horizontalListClassName
  protected readonly horizontalItemClassName = horizontalItemClassName
  protected readonly verticalListClassName = verticalListClassName
  protected readonly verticalItemClassName = verticalItemClassName
  protected readonly popupClassName = popupClassName
}
