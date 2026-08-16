import { splitOverflowItems } from '@fex-design/core/collection/split-overflow-items'
import { badgeClassName, badgeOverflowClassName, type BadgeStyleProps } from '@fex-design/styles/badge'
import { NgTemplateOutlet } from '@angular/common'
import { ChangeDetectionStrategy, Component, ElementRef, TemplateRef, computed, contentChildren, effect, inject, input } from '@angular/core'
import { createHostClassName } from '../../signals/host-class'

@Component({
  selector: 'fex-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClassName()', 'data-slot': 'badge', '[attr.data-variant]': 'variant()' },
  template: '<ng-content />',
})
export class Badge {
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef)
  readonly variant = input<BadgeStyleProps['variant']>('default')
  protected readonly hostClassName = createHostClassName(() =>
    badgeClassName({ variant: this.variant() }),
  )
}

@Component({
  selector: 'fex-badge-overflow',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClassName()', 'data-slot': 'badge-overflow' },
  templateUrl: './badge-overflow.html',
})
export class BadgeOverflow {
  readonly maxCount = input<number | undefined>()
  readonly overflow = input<TemplateRef<{ $implicit: number; items: readonly Badge[] }> | undefined>()
  private readonly badges = contentChildren(Badge)
  protected readonly hostClassName = createHostClassName(badgeOverflowClassName)
  protected readonly overflowCount = computed(() => splitOverflowItems(this.badges(), this.maxCount()).overflowCount)
  protected readonly overflowItems = computed(() => splitOverflowItems(this.badges(), this.maxCount()).overflowItems)
  protected readonly overflowClassName = badgeClassName({ variant: 'secondary' })
  constructor() {
    effect(() => {
      const split = splitOverflowItems(this.badges(), this.maxCount())
      const visible = new Set(split.visibleItems)
      for (const badge of this.badges()) badge.element.nativeElement.hidden = !visible.has(badge)
    })
  }
}
