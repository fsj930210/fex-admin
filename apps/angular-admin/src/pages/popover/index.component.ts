import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core'
import { RouterLink } from '@angular/router'
import Card from '@fex/components-angular/ui/card'
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@fex/components-angular/primitive/popover'

@Component({
  selector: 'fex-popover-page',
  imports: [
    RouterLink,
    Card,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverHeader,
    PopoverTitle,
    PopoverDescription,
  ],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverComponent {
  protected open = false
  @ViewChild('popupContainer') private containerRef?: ElementRef<HTMLDivElement>
  protected readonly outlineButtonClass =
    'inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted-background disabled:pointer-events-none disabled:opacity-50'
  protected readonly secondaryButtonClass =
    'inline-flex h-9 items-center justify-center rounded-md border border-transparent bg-secondary-background px-4 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-muted-background disabled:pointer-events-none disabled:opacity-50'
  protected readonly placementGroups = [
    [
      { label: 'TL', placement: 'topLeft' },
      { label: 'Top', placement: 'top' },
      { label: 'TR', placement: 'topRight' },
    ],
    [
      { label: 'LT', placement: 'leftTop' },
      { label: 'RT', placement: 'rightTop' },
    ],
    [
      { label: 'Left', placement: 'left' },
      { label: 'Right', placement: 'right' },
    ],
    [
      { label: 'LB', placement: 'leftBottom' },
      { label: 'RB', placement: 'rightBottom' },
    ],
    [
      { label: 'BL', placement: 'bottomLeft' },
      { label: 'Bottom', placement: 'bottom' },
      { label: 'BR', placement: 'bottomRight' },
    ],
  ] as const

  protected getPopupContainer = () => this.containerRef?.nativeElement ?? document.body

  protected setOpen(nextOpen: boolean) {
    this.open = nextOpen
  }
}
