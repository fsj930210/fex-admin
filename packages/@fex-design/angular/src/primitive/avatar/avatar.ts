import {
  avatarBadgeClassName,
  avatarClassName,
  avatarFallbackClassName,
  avatarImageClassName,
  avatarImageHostClassName,
  avatarGroupClassName,
  avatarGroupOverflowClassName,
  type AvatarStyleProps,
} from '@fex-design/styles/avatar'
import { splitOverflowItems } from '@fex-design/core/collection/split-overflow-items'
import { NgTemplateOutlet } from '@angular/common'
import { ChangeDetectionStrategy, Component, ElementRef, TemplateRef, computed, contentChildren, effect, inject, input } from '@angular/core'
import { createHostClassName } from '../../signals/host-class'
import { AvatarContext } from './avatar-context'
@Component({
  selector: 'fex-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AvatarContext],
  host: {
    '[class]': 'hostClassName()',
    'data-slot': 'avatar',
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'shape()',
  },
  template: '<ng-content />',
})
export class Avatar {
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef)
  readonly size = input<AvatarStyleProps['size']>('md')
  readonly shape = input<AvatarStyleProps['shape']>('circle')
  protected readonly hostClassName = createHostClassName(() =>
    avatarClassName({ size: this.size(), shape: this.shape() }),
  )
}

@Component({
  selector: 'fex-avatar-group',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClassName()', role: 'group', 'data-slot': 'avatar-group' },
  templateUrl: './avatar-group.html',
})
export class AvatarGroup {
  readonly maxCount = input<number | undefined>()
  readonly overflow = input<TemplateRef<{ $implicit: number; items: readonly Avatar[] }> | undefined>()
  private readonly avatars = contentChildren(Avatar)
  protected readonly hostClassName = createHostClassName(avatarGroupClassName)
  protected readonly overflowCount = computed(() => splitOverflowItems(this.avatars(), this.maxCount()).overflowCount)
  protected readonly overflowItems = computed(() => splitOverflowItems(this.avatars(), this.maxCount()).overflowItems)
  protected readonly overflowClassName = `${avatarClassName({ size: 'md', shape: 'circle' })} ${avatarGroupOverflowClassName}`
  constructor() {
    effect(() => {
      const split = splitOverflowItems(this.avatars(), this.maxCount())
      const visible = new Set(split.visibleItems)
      for (const avatar of this.avatars()) avatar.element.nativeElement.hidden = !visible.has(avatar)
    })
  }
}
@Component({
  selector: 'fex-avatar-image',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClassName()' },
  templateUrl: './avatar-image.html',
})
export class AvatarImage {
  readonly src = input.required<string>()
  readonly alt = input('')
  readonly class = input('')
  protected readonly context = inject(AvatarContext)
  protected readonly hostClassName = createHostClassName(() => avatarImageHostClassName)
  protected readonly imageClass = computed(() => `${avatarImageClassName} ${this.class()}`)
  protected load() {
    this.context.loaded.set(true)
  }
  protected error() {
    this.context.loaded.set(false)
  }
}
@Component({
  selector: 'fex-avatar-fallback',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    'data-slot': 'avatar-fallback',
    '[hidden]': 'context.loaded()',
  },
  template: '<ng-content />',
})
export class AvatarFallback {
  protected readonly context = inject(AvatarContext)
  protected readonly hostClassName = createHostClassName(() => avatarFallbackClassName)
}
@Component({
  selector: 'fex-avatar-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClassName()', 'data-slot': 'avatar-badge' },
  template: '<ng-content />',
})
export class AvatarBadge {
  protected readonly hostClassName = createHostClassName(() => avatarBadgeClassName)
}
