import { isTagPresetColor, tagClassName, tagCloseClassName, type TagColor, type TagStyleProps } from '@fex-design/styles/tag'
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, Directive, input, output } from '@angular/core'
import { CloseIcon } from '../../icon/close'
import { createHostClassName } from '../../signals/host-class'

@Directive({ selector: '[fexTagCloseIcon]', standalone: true })
export class TagCloseIcon {}

@Component({
  selector: 'fex-tag', standalone: true, imports: [CloseIcon], changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()', '[style.--tag-color]': 'customColor()', '[attr.data-color]': 'dataColor()',
    '[attr.data-variant]': 'variant()', '[attr.data-size]': 'size()', '[attr.data-disabled]': "disabled() ? 'true' : null", 'data-slot': 'tag',
  },
  templateUrl: './tag.html',
})
export class Tag {
  readonly color = input<TagColor>('neutral')
  readonly variant = input<TagStyleProps['variant']>('subtle')
  readonly size = input<TagStyleProps['size']>('md')
  readonly closable = input(false, { transform: booleanAttribute })
  readonly closeLabel = input('Close')
  readonly disabled = input(false, { transform: booleanAttribute })
  readonly close = output<MouseEvent>()
  protected readonly projectedCloseIcon = contentChild(TagCloseIcon)
  protected readonly dataColor = computed(() => isTagPresetColor(this.color()) ? this.color() : 'custom')
  protected readonly customColor = computed(() => isTagPresetColor(this.color()) ? null : this.color())
  protected readonly closeClassName = tagCloseClassName
  protected readonly hostClassName = createHostClassName(() => tagClassName({ variant: this.variant(), size: this.size() }))
}
