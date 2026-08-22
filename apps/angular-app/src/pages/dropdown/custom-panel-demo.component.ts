import { ChangeDetectionStrategy, Component } from '@angular/core'
import { DropdownContent, DropdownRoot, DropdownTrigger } from '@fex-design/angular/primitive/dropdown'
import { PopoverPortal } from '@fex-design/angular/primitive/popover'
import { Checkbox } from '@fex-design/angular/ui/checkbox'
import { triggerClassName } from './demo-classes'

@Component({ selector: 'app-dropdown-custom-panel-demo', standalone: true, imports: [DropdownRoot, DropdownTrigger, DropdownContent, PopoverPortal, Checkbox], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './custom-panel-demo.component.html' })
export class DropdownCustomPanelDemoComponent { protected readonly triggerClassName = triggerClassName }
