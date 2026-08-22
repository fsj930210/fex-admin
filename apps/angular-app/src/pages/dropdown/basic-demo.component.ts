import { ChangeDetectionStrategy, Component } from '@angular/core'
import { DropdownContent, DropdownRoot, DropdownTrigger } from '@fex-design/angular/primitive/dropdown'
import { PopoverPortal } from '@fex-design/angular/primitive/popover'
import { MenuItem, MenuList, MenuRoot } from '@fex-design/angular/primitive/menu'
import { itemClassName, triggerClassName } from './demo-classes'

@Component({
  selector: 'app-dropdown-basic-demo',
  standalone: true,
  imports: [DropdownRoot, DropdownTrigger, DropdownContent, PopoverPortal, MenuRoot, MenuList, MenuItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './basic-demo.component.html',
})
export class DropdownBasicDemoComponent { protected readonly triggerClassName = triggerClassName; protected readonly itemClassName = itemClassName }
