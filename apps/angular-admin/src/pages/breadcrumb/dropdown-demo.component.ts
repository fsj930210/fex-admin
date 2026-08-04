import { ChangeDetectionStrategy, Component } from '@angular/core'
import { BreadcrumbEllipsis } from '@fex-design/angular/primitive/breadcrumb'
import { DropdownContent, DropdownRoot, DropdownTrigger } from '@fex-design/angular/primitive/dropdown'
import { PopoverPortal } from '@fex-design/angular/primitive/popover'

@Component({
  selector: 'app-breadcrumb-dropdown-demo',
  standalone: true,
  imports: [BreadcrumbEllipsis, DropdownRoot, DropdownTrigger, DropdownContent, PopoverPortal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<fex-dropdown><button fexDropdownTrigger class="inline-flex size-7 items-center justify-center rounded-md hover:bg-muted-background" type="button" aria-label="Show hidden path"><fex-breadcrumb-ellipsis /></button><fex-popover-portal><fex-dropdown-content><div class="min-w-40 space-y-1 p-1" role="menu"><button class="block w-full rounded px-2 py-1 text-left hover:bg-muted-background" role="menuitem" type="button">Planning</button><button class="block w-full rounded px-2 py-1 text-left hover:bg-muted-background" role="menuitem" type="button">Archive</button></div></fex-dropdown-content></fex-popover-portal></fex-dropdown>',
})
export class BreadcrumbDropdownDemoComponent {}
