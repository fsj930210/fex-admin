import { Component } from '@angular/core'
import { Drawer, DrawerBody, DrawerClose, DrawerContent, DrawerHeader, DrawerMask, DrawerPortal, DrawerTrigger } from '@fex/components-angular/primitive/drawer'
import { Button } from '@fex/components-angular/ui/button'

@Component({
  selector: 'fex-drawer-preset-demo',
  standalone: true,
  imports: [Drawer, DrawerTrigger, DrawerPortal, DrawerMask, DrawerContent, DrawerHeader, DrawerBody, DrawerClose, Button],
  template: '<div class="flex gap-2">@for (size of sizes; track size) {<fex-drawer [size]="size"><button fexButton variant="outline" fexDrawerTrigger>{{size}}</button><fex-drawer-portal><fex-drawer-mask/><fex-drawer-content [size]="size" [attr.aria-label]="size + \' preset\'"><fex-drawer-header>{{size}}<button fexDrawerClose></button></fex-drawer-header><fex-drawer-body>Preset size: {{size}}</fex-drawer-body></fex-drawer-content></fex-drawer-portal></fex-drawer>}</div>',
})
export class PresetDemoComponent { protected readonly sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const }
