import { Component } from '@angular/core'
import { Drawer, DrawerBody, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerMask, DrawerPortal, DrawerTrigger } from '@fex/components-angular/primitive/drawer'
import { Button } from '@fex/components-angular/ui/button'

@Component({
  selector: 'fex-drawer-header-footer-demo',
  standalone: true,
  imports: [Drawer, DrawerTrigger, DrawerPortal, DrawerMask, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, DrawerClose, Button],
  template: '<fex-drawer><button fexButton variant="outline" fexDrawerTrigger>Header + footer</button><fex-drawer-portal><fex-drawer-mask/><fex-drawer-content aria-label="Header footer drawer"><fex-drawer-header>Custom header<button fexDrawerClose></button></fex-drawer-header><fex-drawer-body>Body remains the scrollable region.</fex-drawer-body><fex-drawer-footer><button fexDrawerClose [showIcon]="false" class="!size-auto rounded-md bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/90">Done</button></fex-drawer-footer></fex-drawer-content></fex-drawer-portal></fex-drawer>',
})
export class HeaderFooterDemoComponent {}
