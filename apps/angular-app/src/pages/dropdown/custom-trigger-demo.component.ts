import { ChangeDetectionStrategy, Component } from '@angular/core'
import { DropdownContent, DropdownRoot, DropdownTrigger } from '@fex-design/angular/primitive/dropdown'
import { PopoverPortal } from '@fex-design/angular/primitive/popover'
import { MenuItem, MenuList, MenuRoot } from '@fex-design/angular/primitive/menu'
import { itemClassName } from './demo-classes'

@Component({ selector: 'app-dropdown-custom-trigger-demo', standalone: true, imports: [DropdownRoot, DropdownTrigger, DropdownContent, PopoverPortal, MenuRoot, MenuList, MenuItem], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './custom-trigger-demo.component.html' })
export class DropdownCustomTriggerDemoComponent { protected readonly itemClassName = itemClassName }
