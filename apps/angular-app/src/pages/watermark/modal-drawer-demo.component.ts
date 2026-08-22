import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@fex-design/angular/primitive/dialog'
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerMask,
  DrawerPortal,
  DrawerTrigger,
} from '@fex-design/angular/primitive/drawer'
import { Watermark } from '@fex-design/angular/primitive/watermark'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-watermark-modal-drawer-demo',
  standalone: true,
  imports: [
    Card,
    Button,
    Dialog,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogBody,
    DialogFooter,
    DialogClose,
    Drawer,
    DrawerTrigger,
    DrawerPortal,
    DrawerMask,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerClose,
    Watermark,
  ],
  templateUrl: './modal-drawer-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDrawerDemo {}
