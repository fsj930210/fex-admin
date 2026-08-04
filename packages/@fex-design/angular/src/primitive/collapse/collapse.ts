import { createExpansionController } from '@fex-design/core/expansion/create-expansion-controller'
import type { ExpansionChangeMeta, ExpansionKey } from '@fex-design/core/expansion/types'
import type { ExpansionController, ExpansionSnapshot } from '@fex-design/core/expansion/types'
import {
  collapseContentInnerClassName,
  collapseContentOuterClassName,
  collapseIconClassName,
  collapseItemClassName,
  collapseRootClassName,
  collapseTriggerClassName,
} from '@fex-design/styles/collapse'
import { cn } from '@fex/utils'
import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  Renderer2,
  type Signal,
} from '@angular/core'
import { buttonPrimitiveClassName } from '../button/button'
import {
  createCoreStoreSignalBinding,
  type CoreStoreSignalBinding,
} from '../../signals/core-store-signal'
import { createHostClassName } from '../../signals/host-class'

export type CollapseVariant = 'outlined' | 'filled' | 'ghost'
export type CollapseSize = 'sm' | 'md' | 'lg'

@Directive({
  selector: '[fexCollapse]',
  standalone: true,
  exportAs: 'fexCollapse',
  host: {
    '[class]': 'hostClassName()',
    'data-slot': 'collapse',
    '[attr.data-variant]': 'variant()',
  },
})
export class Collapse {
  expandedKeys = input<readonly ExpansionKey[] | undefined>()
  defaultExpandedKeys = input<readonly ExpansionKey[] | undefined>()
  disabledKeys = input<readonly ExpansionKey[] | undefined>()
  multiple = input<boolean | undefined>()
  collapsible = input<boolean | undefined>()
  variant = input<CollapseVariant>('outlined')
  size = input<CollapseSize>('md')
  change = output<{ keys: ExpansionKey[]; meta: ExpansionChangeMeta }>()

  readonly controller: ExpansionController
  private readonly binding: CoreStoreSignalBinding<ExpansionSnapshot>
  readonly snapshot: Signal<ExpansionSnapshot>
  protected readonly hostClassName = createHostClassName(() =>
    collapseRootClassName({ variant: this.variant(), size: this.size() }),
  )

  constructor() {
    const thisRoot = this
    this.controller = createExpansionController({
      get expandedKeys() {
        return thisRoot.expandedKeys()
      },
      get defaultExpandedKeys() {
        return thisRoot.defaultExpandedKeys()
      },
      get disabledKeys() {
        return thisRoot.disabledKeys()
      },
      get multiple() {
        return thisRoot.multiple()
      },
      get collapsible() {
        return thisRoot.collapsible()
      },
      onChange(keys, meta) {
        thisRoot.change.emit({ keys, meta })
      },
    })
    this.binding = createCoreStoreSignalBinding(this.controller)
    this.snapshot = this.binding.snapshot
    effect(() => {
      thisRoot.expandedKeys()
      thisRoot.disabledKeys()
      thisRoot.multiple()
      thisRoot.collapsible()
      thisRoot.binding.refresh()
    })
  }

  expand(key: ExpansionKey) {
    this.controller.expand(key)
  }

  collapse(key: ExpansionKey) {
    this.controller.collapse(key)
  }

  toggle(key: ExpansionKey) {
    this.controller.toggle(key)
  }

  setExpandedKeys(keys: readonly ExpansionKey[]) {
    this.controller.setExpandedKeys(keys)
  }

  clear() {
    this.controller.clear()
  }

  getExpandedKeys() {
    return this.controller.getSnapshot().expandedKeys
  }

  isExpanded(key: ExpansionKey) {
    return this.snapshot().expandedKeys.includes(key)
  }

  isDisabled(key: ExpansionKey) {
    return this.controller.isDisabled(key)
  }
}

@Directive({
  selector: '[fexCollapseItem]',
  standalone: true,
  exportAs: 'fexCollapseItem',
  host: {
    '[class]': 'hostClassName()',
    'data-slot': 'collapse-item',
    '[attr.data-state]': "expanded() ? 'open' : 'closed'",
    '[attr.data-disabled]': 'disabledState() || null',
  },
})
export class CollapseItem {
  readonly root = inject(Collapse)
  fexCollapseItem = input.required<ExpansionKey>()
  disabled = input(false, { transform: booleanAttribute })
  readonly expanded = computed(() => this.root.isExpanded(this.fexCollapseItem()))
  readonly disabledState = computed(
    () => this.disabled() || this.root.isDisabled(this.fexCollapseItem()),
  )
  readonly triggerId = computed(
    () => 'fex-collapse-' + String(this.fexCollapseItem()).replace(/\s+/g, '-') + '-trigger',
  )
  readonly contentId = computed(
    () => 'fex-collapse-' + String(this.fexCollapseItem()).replace(/\s+/g, '-') + '-content',
  )
  protected readonly hostClassName = createHostClassName(() =>
    collapseItemClassName({ variant: this.root.variant() }),
  )

  expand() {
    this.root.expand(this.fexCollapseItem())
  }

  collapse() {
    this.root.collapse(this.fexCollapseItem())
  }

  toggle() {
    this.root.toggle(this.fexCollapseItem())
  }
}

@Directive({
  selector: 'button[fexCollapseTrigger]',
  standalone: true,
  host: {
    '[class]': 'hostClassName()',
    type: 'button',
    'data-slot': 'collapse-trigger',
    '[attr.id]': 'item.triggerId()',
    '[attr.aria-expanded]': 'item.expanded()',
    '[attr.aria-controls]': 'item.contentId()',
    '[attr.data-state]': "item.expanded() ? 'open' : 'closed'",
    '[disabled]': 'item.disabledState()',
  },
})
export class CollapseTrigger {
  protected readonly item = inject(CollapseItem)
  protected readonly hostClassName = createHostClassName(() =>
    cn(buttonPrimitiveClassName(), collapseTriggerClassName({ variant: this.item.root.variant() })),
  )

  @HostListener('click', ['$event'])
  click(event: MouseEvent) {
    if (!event.defaultPrevented && !this.item.disabledState()) this.item.toggle()
  }
}

@Directive({
  selector: '[fexCollapseContent]',
  standalone: true,
})
export class CollapseContent {
  private readonly item = inject(CollapseItem)
  private readonly renderer = inject(Renderer2)
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly initialClassName = this.element.getAttribute('class') ?? undefined

  constructor() {
    effect(() => {
      const expanded = this.item.expanded()
      this.renderer.setAttribute(this.element, 'id', this.item.contentId())
      this.renderer.setAttribute(this.element, 'role', 'region')
      this.renderer.setAttribute(this.element, 'aria-labelledby', this.item.triggerId())
      this.renderer.setAttribute(this.element, 'aria-hidden', String(!expanded))
      this.renderer.setAttribute(this.element, 'data-slot', 'collapse-content')
      this.renderer.setAttribute(this.element, 'data-state', expanded ? 'open' : 'closed')
      this.renderer.setAttribute(
        this.element,
        'class',
        cn(
          collapseContentOuterClassName,
          collapseContentInnerClassName({ variant: this.item.root.variant() }),
          this.initialClassName,
        ),
      )
    })
  }
}

export const collapsePrimitiveClassNames = {
  icon: collapseIconClassName,
}
