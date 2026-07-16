import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
  ToastClose,
  ToastAction,
  ToastDescription,
  ToastIcon,
  ToastRoot,
  ToastService,
  ToastTitle,
  ToastViewport,
} from '@fex/components-angular/primitive/toast'
import type { AngularToastItem } from '@fex/components-angular/primitive/toast'
import { CheckIcon } from '@fex/components-angular/icon/check'
import { CloseIcon } from '@fex/components-angular/icon/close'
import { ErrorIcon } from '@fex/components-angular/icon/error'
import { InfoIcon } from '@fex/components-angular/icon/info'
import { LoadingIcon } from '@fex/components-angular/icon/loading'
import { WarningIcon } from '@fex/components-angular/icon/warning'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import type { ToastPlacement } from '@fex/components-styles/toast'

@Component({
  selector: 'fex-toast-page',
  standalone: true,
  imports: [
    RouterLink,
    Button,
    Card,
    CheckIcon,
    CloseIcon,
    ErrorIcon,
    InfoIcon,
    LoadingIcon,
    WarningIcon,
    ToastAction,
    ToastClose,
    ToastDescription,
    ToastIcon,
    ToastRoot,
    ToastTitle,
    ToastViewport,
  ],
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  readonly toast = inject(ToastService)
  readonly placements: ToastPlacement[] = [
    'top-left',
    'top',
    'top-right',
    'bottom-left',
    'bottom',
    'bottom-right',
  ]
  readonly placement = signal<ToastPlacement>('top')
  readonly stack = signal(false)
  readonly manualId = signal<string | null>(null)
  readonly itemsByPlacement = computed(() => groupItemsByPlacement(this.toast.items()))
  readonly visibleItemsByPlacement = computed(() => {
    const groups = this.itemsByPlacement()
    if (!this.stack()) return groups
    return mapPlacementGroups(groups, (items) => (items.length > 3 ? items.slice(-1) : items))
  })

  labelPlacement(value: ToastPlacement) {
    return value
      .split('-')
      .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
      .join(' ')
  }

  choosePlacement(value: ToastPlacement) {
    this.placement.set(value)
    this.toast.show({
      id: 'toast-position-preview',
      placement: value,
      title: `Position: ${this.labelPlacement(value)}`,
      duration: 2000,
    })
  }

  hasToastIcon(item: { icon?: unknown | null; variant: string }) {
    return (
      item.icon !== null && (item.icon !== undefined || this.isBuiltInIconVariant(item.variant))
    )
  }

  isBuiltInIconVariant(variant: string) {
    return (
      variant === 'success' ||
      variant === 'info' ||
      variant === 'warning' ||
      variant === 'error' ||
      variant === 'loading'
    )
  }

  showManyMessages() {
    for (let index = 1; index <= 6; index += 1) {
      this.toast.info({
        title: `Message ${index}: ${index % 2 === 0 ? 'This is a slightly longer stacked message.' : 'This is a stacked message.'}`,
        duration: 5000,
      })
    }
  }

  showManualToast() {
    this.manualId.set(
      this.toast.loading({
        title: 'Uploading report',
        description: 'This toast stays until it is dismissed manually.',
        duration: -1,
      }),
    )
  }

  toggleStack() {
    const nextStack = !this.stack()
    this.toast.configure({ max: nextStack ? -1 : 5 })
    this.stack.set(nextStack)
  }
}

type PlacementGroups = Record<ToastPlacement, AngularToastItem[]>

function groupItemsByPlacement(items: AngularToastItem[]): PlacementGroups {
  const groups = createPlacementGroups()
  for (const item of items) groups[item.placement].push(item)
  return groups
}

function mapPlacementGroups(
  groups: PlacementGroups,
  map: (items: AngularToastItem[]) => AngularToastItem[],
): PlacementGroups {
  const next = createPlacementGroups()
  for (const placement of Object.keys(next) as ToastPlacement[])
    next[placement] = map(groups[placement])
  return next
}

function createPlacementGroups(): PlacementGroups {
  return {
    top: [],
    'top-left': [],
    'top-right': [],
    bottom: [],
    'bottom-left': [],
    'bottom-right': [],
  }
}
