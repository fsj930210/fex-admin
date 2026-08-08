import { ChangeDetectionStrategy, Component } from '@angular/core'
import { DropdownContent } from '@fex-design/angular/primitive/dropdown'
import { MenuItem, MenuList, MenuRoot } from '@fex-design/angular/primitive/menu'
import { Popover, PopoverPortal, PopoverTrigger } from '@fex-design/angular/primitive/popover'
import { horizontalListClassName, menubarClassName, menubarTriggerClassName, popupClassName, verticalItemClassName, verticalListClassName } from './demo-styles'
@Component({ selector: 'app-menu-menubar-demo', standalone: true, imports: [MenuRoot, MenuList, MenuItem, Popover, PopoverTrigger, PopoverPortal, DropdownContent], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './menubar-demo.component.html' })
export class MenuMenubarDemoComponent {
  protected readonly menus = [{ name: 'File', items: ['New Tab', 'New Window', 'Print…'] }, { name: 'Edit', items: ['Undo', 'Redo', 'Copy', 'Paste'] }, { name: 'View', items: ['Reload', 'Fullscreen'] }, { name: 'Profiles', items: ['Andy', 'Benoit', 'Add Profile…'] }]
  protected readonly rootClassName = menubarClassName; protected readonly horizontalListClassName = horizontalListClassName; protected readonly horizontalItemClassName = menubarTriggerClassName; protected readonly verticalListClassName = verticalListClassName; protected readonly verticalItemClassName = verticalItemClassName; protected readonly popupClassName = popupClassName
}
