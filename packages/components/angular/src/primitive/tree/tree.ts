import { NgTemplateOutlet } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  Directive,
  effect,
  HostListener,
  inject,
  input,
  signal,
  TemplateRef,
  viewChild,
  ElementRef,
} from '@angular/core'
import { createTreeController } from '@fex/components-core/tree/create-tree-controller'
import type { AsyncLoadFeatureApi } from '@fex/components-core/tree/features/async-load'
import type { CheckFeatureApi } from '@fex/components-core/tree/features/check'
import type { ExpansionFeatureApi } from '@fex/components-core/tree/features/expansion'
import type { FocusFeatureApi } from '@fex/components-core/tree/features/focus'
import type { SelectionFeatureApi } from '@fex/components-core/tree/features/selection'
import type {
  TreeController,
  TreeKey,
  TreeNodeData,
  TreeOptions,
  TreeSnapshot,
  TreeVisibleItem,
} from '@fex/components-core/tree/types'
import {
  treeItemClassName,
  treeRootClassName,
  treeTitleClassName,
  treeTriggerClassName,
  treeViewportClassName,
} from '@fex/components-styles/tree'
import { injectVirtualizer } from '@tanstack/angular-virtual'
import { createHostClassName } from '../../signals/host-class'

function createEmptySnapshot<TNode extends TreeNodeData>(): TreeSnapshot<TNode> {
  return {
    treeData: [],
    expandedKeys: [],
    selectedKeys: [],
    checkedKeys: [],
    focusedKey: null,
    items: new Map(),
    visibleItems: [],
  }
}

@Component({
  selector: 'fex-tree',
  standalone: true,
  exportAs: 'fexTree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    'data-slot': 'tree',
    role: 'tree',
    tabindex: '0',
    '[attr.aria-multiselectable]': 'selection()?.isMultiple() || null',
    '[style.--tree-indent]': "indent() + 'px'",
  },
  template: '<ng-content />',
})
export class TreeRoot<TNode extends TreeNodeData = TreeNodeData> {
  readonly options = input<TreeOptions<TNode> | undefined>()
  readonly controller = input<TreeController<TNode> | undefined>()
  readonly indent = input(16)
  readonly rowHeight = input(32)

  private ownedController: TreeController<TNode> | undefined
  readonly tree = computed(
    () =>
      this.controller() ??
      (this.ownedController ??= createTreeController(this.options() ?? { treeData: [] })),
  )
  readonly snapshot = signal<TreeSnapshot<TNode>>(createEmptySnapshot<TNode>())
  readonly visibleItems = signal<readonly TreeVisibleItem<TNode>[]>([])
  protected readonly hostClassName = createHostClassName(treeRootClassName)
  protected readonly selection = () => this.tree().getFeature<SelectionFeatureApi>('selection')

  constructor() {
    // The effect is the Angular adapter boundary that keeps the external core store subscription in sync.
    effect((cleanup) => {
      const tree = this.tree()
      const options = this.options()
      if (options) tree.updateOptions(options)
      this.updateSnapshot(tree)
      const unsubscribe = tree.subscribe(() => this.updateSnapshot(tree))
      cleanup(unsubscribe)
    })
  }

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.defaultPrevented || event.isComposing || !this.tree().hasFeature('keyboard')) return
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return

    const tree = this.tree()
    const items = tree.getVisibleItems()
    const expansion = tree.getFeature<ExpansionFeatureApi>('expansion')
    const check = tree.getFeature<CheckFeatureApi>('check')
    const focus = tree.getFeature<FocusFeatureApi>('focus')
    const index = items.findIndex((item) => item.key === tree.getSnapshot().focusedKey)
    const item = index >= 0 ? items[index] : undefined
    const focusAt = (next: number) => focus?.focus(items[next]?.key ?? null)

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusAt(Math.min(index + 1, items.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusAt(Math.max(index - 1, 0))
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusAt(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusAt(items.length - 1)
    } else if (event.key === 'ArrowRight' && item) {
      event.preventDefault()
      if (!item.isLeaf && !tree.getSnapshot().expandedKeys.includes(item.key)) expansion?.expand(item.key)
      else focus?.focus(tree.getVisibleItemAt(index + 1)?.key ?? item.key)
    } else if (event.key === 'ArrowLeft' && item) {
      event.preventDefault()
      if (tree.getSnapshot().expandedKeys.includes(item.key)) expansion?.collapse(item.key)
      else focus?.focus(item.parentKey)
    } else if (event.key === 'Enter' && item) {
      this.selection()?.toggle(item.key)
    } else if (event.key === ' ' && item) {
      event.preventDefault()
      check?.check(item.key, !tree.getSnapshot().checkedKeys.includes(item.key))
    }
  }

  private updateSnapshot(tree: TreeController<TNode>) {
    const snapshot = tree.getSnapshot()
    this.snapshot.set(snapshot)
    this.visibleItems.set(tree.getVisibleItems())
  }

}

@Component({
  selector: 'fex-tree-viewport',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClassName()', 'data-slot': 'tree-viewport' },
  templateUrl: './tree-viewport.html',
})
export class TreeViewport<TNode extends TreeNodeData = TreeNodeData> {
  readonly root = inject<TreeRoot<TNode>>(TreeRoot)
  readonly template = contentChild.required<
    TemplateRef<{ $implicit: TreeVisibleItem<TNode>; tree: TreeController<TNode> }>
  >(TemplateRef)
  protected readonly hostClassName = createHostClassName(treeViewportClassName)
}

@Component({
  selector: 'fex-tree-virtual-viewport',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block', 'data-slot': 'tree-virtual-viewport' },
  templateUrl: './tree-virtual-viewport.html',
})
export class TreeVirtualViewport<TNode extends TreeNodeData = TreeNodeData> {
  readonly root = inject<TreeRoot<TNode>>(TreeRoot)
  readonly height = input.required<number>()
  readonly overscan = input(6)
  readonly template = contentChild.required<
    TemplateRef<{ $implicit: TreeVisibleItem<TNode>; tree: TreeController<TNode> }>
  >(TemplateRef)
  readonly scrollElement = viewChild<ElementRef<HTMLDivElement>>('scrollElement')
  readonly virtualizer = injectVirtualizer<HTMLDivElement, HTMLDivElement>(() => ({
    scrollElement: this.scrollElement(),
    count: this.root.visibleItems().length,
    estimateSize: () => this.root.rowHeight(),
    overscan: this.overscan(),
    getItemKey: (index: number) => this.root.visibleItems()[index]?.key ?? index,
  }))

  scrollToKey(
    key: TreeKey,
    options?: { align?: 'auto' | 'start' | 'center' | 'end'; reveal?: boolean },
  ) {
    if (options?.reveal) this.root.tree().getFeature<FocusFeatureApi>('focus')?.reveal(key)
    const index = this.root.tree().getVisibleIndex(key)
    if (index === undefined || index < 0) return false
    this.virtualizer.scrollToIndex(index, { align: options?.align ?? 'auto' })
    return true
  }
}

@Directive({
  selector: '[fexTreeItem]',
  standalone: true,
  exportAs: 'fexTreeItem',
  host: {
    '[class]': 'hostClassName()',
    '[attr.role]': "'treeitem'",
    '[attr.tabindex]': 'focused() ? 0 : -1',
    '[attr.aria-level]': 'item() ? item()!.depth + 1 : null',
    '[attr.aria-expanded]': 'item()?.isLeaf ? null : expanded()',
    '[attr.aria-selected]': 'selected() || null',
    '[attr.aria-checked]': "checkedState() === 'indeterminate' ? 'mixed' : checked() || null",
    '[attr.aria-disabled]': 'item()?.disabled || null',
    '[attr.aria-posinset]': 'item() ? item()!.index + 1 : null',
    '[attr.data-key]': 'item()?.key',
    '[attr.data-selected]': 'selected() || null',
    '[attr.data-expanded]': 'expanded() || null',
    '[attr.data-checked]': 'checked() || null',
    '[attr.data-disabled]': 'item()?.disabled || null',
    '[attr.data-leaf]': 'item()?.isLeaf || null',
    '[attr.data-block]': 'block() || null',
    '[style.height.px]': 'root.rowHeight()',
    '[style.margin-inline-start.px]': 'item() ? item()!.depth * root.indent() : null',
    '[style.padding-inline-start.px]': '4',
    '[style.--tree-item-inline-start]': "'4px'",
  },
})
export class TreeItemDirective<TNode extends TreeNodeData = TreeNodeData> {
  readonly root = inject<TreeRoot<TNode>>(TreeRoot)
  readonly key = input.required<TreeKey>({ alias: 'fexTreeItem' })
  readonly block = input(false, { alias: 'fexTreeBlock' })
  private readonly version = signal(0)
  readonly item = computed(() => {
    this.version()
    return this.root.tree().getItem(this.key())
  })
  readonly expanded = computed(() => {
    this.version()
    return this.root.tree().getSnapshot().expandedKeys.includes(this.key())
  })
  readonly selected = computed(() => {
    this.version()
    return this.root.tree().getSnapshot().selectedKeys.includes(this.key())
  })
  readonly checked = computed(() => {
    this.version()
    return this.root.tree().getSnapshot().checkedKeys.includes(this.key())
  })
  readonly checkedState = computed(() => {
    this.version()
    return this.root.tree().getFeature<CheckFeatureApi>('check')?.getState(this.key()) ?? false
  })
  readonly focused = computed(() => {
    this.version()
    return this.root.tree().getSnapshot().focusedKey === this.key()
  })
  readonly loadState = computed(() => {
    this.version()
    return this.root.tree().getFeature<AsyncLoadFeatureApi>('async-load')?.getState(this.key()) ?? 'unloaded'
  })
  protected readonly hostClassName = createHostClassName(() => treeItemClassName())

  constructor() {
    // The effect owns the core node subscription and is disposed with the directive instance.
    effect((cleanup) => {
      const unsubscribe = this.root
        .tree()
        .subscribeNode(this.key(), () => this.version.update((value) => value + 1))
      cleanup(unsubscribe)
    })
  }

  @HostListener('focus')
  focus() {
    this.root.tree().getFeature<FocusFeatureApi>('focus')?.focus(this.key())
  }

  @HostListener('click', ['$event'])
  select(event: MouseEvent) {
    if (!event.defaultPrevented && !this.item()?.disabled) {
      this.root.tree().getFeature<SelectionFeatureApi>('selection')?.toggle(this.key())
    }
  }

  toggleChecked() {
    this.root.tree().getFeature<CheckFeatureApi>('check')?.check(this.key(), !this.checked())
  }
}

@Directive({
  selector: 'button[fexTreeTrigger]',
  standalone: true,
  host: {
    type: 'button',
    'data-slot': 'tree-trigger',
    '[class]': 'hostClassName()',
    '[attr.aria-expanded]': 'item.expanded()',
  },
})
export class TreeTriggerDirective {
  readonly item = inject(TreeItemDirective)
  protected readonly hostClassName = createHostClassName(treeTriggerClassName)

  @HostListener('click', ['$event'])
  trigger(event: MouseEvent) {
    event.stopPropagation()
    if (event.defaultPrevented) return
    const tree = this.item.root.tree()
    const expansion = tree.getFeature<ExpansionFeatureApi>('expansion')
    if (this.item.expanded()) {
      expansion?.collapse(this.item.key())
      return
    }
    const loading = tree.getFeature<AsyncLoadFeatureApi>('async-load')?.load(this.item.key())
    if (!loading) {
      expansion?.expand(this.item.key())
      return
    }
    void loading.then((result) => {
      if ((result as { ok?: boolean } | undefined)?.ok) expansion?.expand(this.item.key())
    })
  }
}

@Directive({
  selector: '[fexTreeTitle]',
  standalone: true,
  host: { '[class]': 'hostClassName()', 'data-slot': 'tree-title' },
})
export class TreeTitleDirective {
  protected readonly hostClassName = createHostClassName(treeTitleClassName)
}

export { createTreeSignals } from './create-tree-signals'

export type {
  TreeController,
  TreeKey,
  TreeNodeData,
  TreeOptions,
  TreeVisibleItem,
} from '@fex/components-core/tree/types'
