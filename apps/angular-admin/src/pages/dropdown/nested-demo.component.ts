import { ChangeDetectionStrategy, Component } from '@angular/core'
import { DropdownContent, DropdownRoot, DropdownTrigger } from '@fex/components-angular/primitive/dropdown'
import { Popover, PopoverPortal, PopoverTrigger } from '@fex/components-angular/primitive/popover'
import { MenuItem, MenuList, MenuRoot } from '@fex/components-angular/primitive/menu'
import { ChevronRightIcon } from '@fex/components-angular/icon/chevron'
import { itemClassName, triggerClassName } from './demo-classes'

@Component({ selector: 'app-dropdown-nested-demo', standalone: true, imports: [DropdownRoot, DropdownTrigger, DropdownContent, Popover, PopoverTrigger, PopoverPortal, MenuRoot, MenuList, MenuItem, ChevronRightIcon], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './nested-demo.component.html' })
export class DropdownNestedDemoComponent { protected readonly triggerClassName = triggerClassName; protected readonly itemClassName = itemClassName }
