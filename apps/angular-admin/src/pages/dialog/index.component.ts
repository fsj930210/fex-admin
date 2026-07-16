import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
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
} from '@fex/components-angular/primitive/dialog'

@Component({
  selector: 'fex-dialog-page',
  imports: [
    RouterLink,
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
  ],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  protected open = false
  protected readonly sizes = ['sm', 'md', 'lg'] as const
  protected readonly iconCloseClassName =
    'absolute right-3 top-3 inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-xl leading-none text-muted-foreground outline-none transition-colors hover:bg-muted-background hover:text-foreground focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'

  protected setOpen(nextOpen: boolean) {
    this.open = nextOpen
  }
}
