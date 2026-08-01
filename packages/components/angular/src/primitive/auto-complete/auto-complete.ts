import { NgTemplateOutlet } from '@angular/common'
import { createAutoCompleteController } from '@fex/components-core/auto-complete/create-auto-complete-controller'
import type {
  AutoCompleteChangeMeta,
  AutoCompleteController,
  AutoCompleteFieldNames,
  AutoCompleteSnapshot,
} from '@fex/components-core/auto-complete/types'
import {
  autoCompleteContentClassName,
  autoCompleteListClassName,
  autoCompleteOptionClassName,
} from '@fex/components-styles/auto-complete'
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  DestroyRef,
  EventEmitter,
  HostListener,
  Input,
  type OnChanges,
  Output,
  type SimpleChanges,
  TemplateRef,
  forwardRef,
  inject,
  signal,
  type Signal,
} from '@angular/core'
import { LoadingIcon } from '../../icon/loading'
import { Empty, EmptyDescription } from '../empty/empty'
import { createCoreStoreSignalBinding } from '../../signals/core-store-signal'
import { Spinner } from '../../ui/spinner/spinner'
import { InputClear, InputControl, InputRoot, InputSuffix } from '../input/input'
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover'
type Item = Record<string, unknown>
@Component({
  selector: 'fex-auto-complete',
  standalone: true,
  providers: [Popover],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
})
export class AutoCompleteRoot implements OnChanges {
  private readonly popover = inject(Popover)
  private readonly destroyRef = inject(DestroyRef)
  private readonly itemsState = signal<readonly Item[]>([])
  @Input() set items(value: readonly object[]) {
    this.itemsState.set(value as readonly Item[])
  }
  get items(): readonly object[] {
    return this.itemsState()
  }
  @Input() fieldNames?: Partial<AutoCompleteFieldNames<Item>>
  @Input() value?: string
  @Input() defaultValue?: string
  @Input() open?: boolean
  @Input() defaultOpen = false
  @Input() filterOption?: boolean | ((keyword: string, item: Item) => boolean)
  @Input() loading = false
  @Input() disabled = false
  @Input() readOnly = false
  @Input() closeOnSelect?: boolean
  @Input() loop?: boolean
  @Output() readonly change = new EventEmitter<{
    value: string
    meta: AutoCompleteChangeMeta<Item>
  }>()
  @Output() readonly search = new EventEmitter<{
    value: string
    meta: { reason: 'input' | 'clear'; previousValue: string }
  }>()
  @Output() readonly select = new EventEmitter<{
    value: string
    meta: { selectedItem: Item; selectedKey: string | number; previousValue: string }
  }>()
  @Output() readonly clear = new EventEmitter<{ previousValue: string }>()
  @Output() readonly openChange = new EventEmitter<{ open: boolean; meta: { reason: string } }>()
  readonly controller: AutoCompleteController<Item>
  readonly snapshot: Signal<AutoCompleteSnapshot>
  private readonly refreshSnapshot: () => void
  readonly listId = `auto-complete-${crypto.randomUUID()}`
  constructor() {
    // The option getters intentionally capture the component instance for live Angular inputs.
    // oxlint-disable-next-line typescript/no-this-alias
    const root = this
    this.popover.trigger = []
    this.controller = createAutoCompleteController<Item>({
      get items() {
        return root.items as readonly Item[]
      },
      get fieldNames() {
        return root.fieldNames
      },
      get value() {
        return root.value
      },
      get defaultValue() {
        return root.defaultValue
      },
      get open() {
        return root.open
      },
      get defaultOpen() {
        return root.defaultOpen
      },
      get filterOption() {
        return root.filterOption
      },
      get closeOnSelect() {
        return root.closeOnSelect
      },
      get loop() {
        return root.loop
      },
      onChange: (value, meta) => root.change.emit({ value, meta }),
      onSearch: (value, meta) => root.search.emit({ value, meta }),
      onSelect: (value, meta) => root.select.emit({ value, meta }),
      onClear: (meta) => root.clear.emit(meta),
      onOpenChange: (open, meta) => {
        root.popover.open = root.open ?? open
        root.popover.syncOptions()
        root.openChange.emit({ open, meta })
      },
    })
    const snapshotBinding = createCoreStoreSignalBinding(this.controller)
    this.snapshot = snapshotBinding.snapshot
    this.refreshSnapshot = snapshotBinding.refresh
    this.popover.open = this.snapshot().open
    this.popover.defaultOpen = this.defaultOpen
    this.popover.syncOptions()
    const subscription = this.popover.openChange.subscribe((open) =>
      this.controller.setOpen(open, open ? 'programmatic' : 'outside'),
    )
    this.destroyRef.onDestroy(() => subscription.unsubscribe())
  }
  ngOnChanges(_changes: SimpleChanges) {
    this.refreshSnapshot()
    this.popover.open = this.snapshot().open
    this.popover.defaultOpen = this.defaultOpen
    this.popover.syncOptions()
  }
  get visibleItems() {
    void this.itemsState()
    void this.snapshot().value
    return this.controller.getVisibleItems()
  }
}
@Component({
  selector: 'fex-auto-complete-trigger',
  standalone: true,
  imports: [InputRoot, InputControl, InputClear, InputSuffix, LoadingIcon, PopoverTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auto-complete-trigger.html',
})
export class AutoCompleteTrigger {
  readonly autoComplete = inject(AutoCompleteRoot)
  @Input() placeholder = ''
  @Input() clearable = false
  @Input() invalid = false
  @Input() status?: 'error' | 'warning'
  @Input('class') className = ''
  input(value: string) {
    this.autoComplete.controller.setValue(value)
    this.autoComplete.controller.setOpen(true, 'input')
  }
  keydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      this.autoComplete.controller.setOpen(true, 'keyboard')
      this.autoComplete.controller.moveActive(event.key === 'ArrowDown' ? 1 : -1)
    } else if (event.key === 'Enter' && this.autoComplete.snapshot().open) {
      if (this.autoComplete.controller.selectActive()) event.preventDefault()
    } else if (event.key === 'Escape') this.autoComplete.controller.setOpen(false, 'escape')
  }
}

@Component({
  selector: 'fex-auto-complete-content',
  standalone: true,
  imports: [PopoverContent, forwardRef(() => AutoCompleteList)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auto-complete-content.html',
})
export class AutoCompleteContent {
  readonly contentClass = autoCompleteContentClassName
}

@Component({
  selector: 'fex-auto-complete-list',
  standalone: true,
  imports: [NgTemplateOutlet, Empty, EmptyDescription, Spinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'listbox', '[attr.id]': 'autoComplete.listId', '[class]': 'listClass' },
  templateUrl: './auto-complete-list.html',
})
export class AutoCompleteList {
  readonly autoComplete = inject(AutoCompleteRoot)
  @ContentChild('item') item?: TemplateRef<{ $implicit: Item; active: boolean; disabled: boolean }>
  readonly listClass = `${autoCompleteListClassName} block`
  readonly optionClass = autoCompleteOptionClassName
  @HostListener('pointerdown', ['$event']) pointerdown(event: PointerEvent) {
    event.preventDefault()
  }
}

@Component({
  selector: 'fex-auto-complete-option',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'option',
    '[attr.id]': 'autoComplete.listId + "-" + itemKey',
    '[attr.aria-selected]': 'active',
    '[attr.aria-disabled]': 'disabled || null',
    '[attr.data-active]': 'active || null',
    '[attr.data-disabled]': 'disabled || null',
    '[class]': 'optionClass',
    '(pointermove)': 'autoComplete.controller.setActiveKey(itemKey, "pointer")',
    '(pointerdown)': '$event.preventDefault()',
    '(click)': 'autoComplete.controller.selectItem(itemKey)',
  },
  template: '<ng-content />',
})
export class AutoCompleteOption {
  readonly autoComplete = inject(AutoCompleteRoot)
  @Input({ required: true }) itemKey!: string | number
  @Input('class') className = ''
  get entry() {
    return this.autoComplete.visibleItems.find((item) => item.key === this.itemKey)
  }
  get active() {
    return this.autoComplete.snapshot().activeKey === this.itemKey
  }
  get disabled() {
    return this.entry?.disabled === true
  }
  get optionClass() {
    return `${autoCompleteOptionClassName} ${this.className}`
  }
}
