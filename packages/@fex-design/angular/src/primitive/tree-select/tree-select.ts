import { createTreeSelectController } from '@fex-design/core/tree-select/create-tree-select-controller'
import type { TreeSelectController, TreeSelectItem, TreeSelectSnapshot, TreeSelectValue } from '@fex-design/core/tree-select/types'
import { booleanAttribute, ChangeDetectionStrategy, Component, Directive, EventEmitter, HostBinding, HostListener, inject, Input, Output, signal, type OnChanges, type Signal } from '@angular/core'
import { createCoreStoreSignal } from '../../signals/core-store-signal'
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from '../popover/popover'
import { PopoverDomService } from '../popover/popover-dom'

@Component({
  selector: 'fex-tree-select',
  standalone: true,
  providers: [Popover, PopoverDomService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
})
export class TreeSelectRoot<TNode = unknown> implements OnChanges {
  @Input() items: readonly TreeSelectItem<TNode>[] | undefined
  @Input() value: TreeSelectValue | readonly TreeSelectValue[] | undefined
  @Input() defaultValue: TreeSelectValue | readonly TreeSelectValue[] | undefined
  @Input({ transform: booleanAttribute }) multiple = false
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) searchable = false
  @Input() defaultSearchValue = ''
  @Input() set searchValue(value: string | undefined) { this.controlledSearchValue = value; this.searchState.set(value ?? this.localSearchValue) }
  @Output() readonly change = new EventEmitter<{ value: TreeSelectValue | TreeSelectValue[] | undefined; meta: unknown }>()
  @Output() readonly searchValueChange = new EventEmitter<string>()
  private controlledSearchValue: string | undefined
  private localSearchValue = this.defaultSearchValue
  private defaultValueApplied = false
  private applyingDefaultValue = false
  readonly searchState = signal('')
  readonly controller: TreeSelectController<TNode>
  readonly snapshot: Signal<TreeSelectSnapshot<TNode>>
  private readonly popover = inject(Popover)

  constructor() {
    // The controller reads live Angular inputs through getters without duplicating component state.
    const root = this
    this.controller = createTreeSelectController<TNode>({
      get items() { return root.items }, get value() { return root.value }, get defaultValue() { return root.defaultValue },
      get multiple() { return root.multiple }, get disabled() { return root.disabled },
      onChange(value, meta) { if (!root.applyingDefaultValue) root.change.emit({ value, meta }) },
    })
    this.snapshot = createCoreStoreSignal(this.controller)
  }

  syncOptions() {
    this.controller.updateOptions({
      items: this.items,
      value: this.value,
      multiple: this.multiple,
      disabled: this.disabled,
    })
  }
  ngOnChanges() {
    this.syncOptions()
    if (this.defaultValueApplied || this.value !== undefined || this.defaultValue === undefined) return
    this.defaultValueApplied = true
    this.applyingDefaultValue = true
    const values = Array.isArray(this.defaultValue) ? this.defaultValue : [this.defaultValue]
    values.forEach((value) => {
      const item = this.controller.getItem(value) ?? { value, label: String(value) }
      if (this.multiple) this.controller.toggle(item)
      else this.controller.select(item)
    })
    this.applyingDefaultValue = false
  }
  setSearchValue(value: string) {
    if (this.controlledSearchValue === undefined) { this.localSearchValue = value; this.searchState.set(value) }
    this.searchValueChange.emit(value)
  }
  select(item: TreeSelectItem<TNode>, toggle = this.multiple, clearSearch = true, closeOnSelect = !toggle) {
    if (item.disabled) return
    this.syncOptions()
    if (toggle) this.controller.toggle(item)
    else this.controller.select(item)
    if (clearSearch) this.setSearchValue('')
    if (closeOnSelect) this.popover.overlay.close({ reason: 'manual', source: 'tree-select-option' })
  }
  clear() { this.controller.clear(); this.setSearchValue('') }
  openPanel() { if (!this.disabled) this.popover.overlay.open({ reason: 'manual', source: 'tree-select-input' }) }
  displayValue() { return this.snapshot().selectedItems.map((item) => item.label).join(', ') }
}

@Directive({
  selector: '[fexTreeSelectTrigger]',
  standalone: true,
  hostDirectives: [PopoverTrigger],
})
export class TreeSelectTrigger {
  constructor(readonly root: TreeSelectRoot) {}

  @HostListener('input')
  openWhileSearching() {
    if (this.root.searchable) this.root.openPanel()
  }
}

@Directive({ selector: '[fexTreeSelectOption]', standalone: true })
export class TreeSelectOption<TNode = unknown> {
  @Input({ required: true }) fexTreeSelectOption!: TreeSelectItem<TNode>
  @Input() treeSelectToggle: boolean | undefined
  @Input({ transform: booleanAttribute }) clearSearchOnSelect = true
  @Input() closeOnSelect: boolean | undefined
  constructor(private readonly root: TreeSelectRoot<TNode>) {}
  @HostBinding('attr.aria-selected') get selected() { return this.root.controller.isSelected(this.fexTreeSelectOption.value) }
  @HostBinding('attr.data-disabled') get disabled() { return this.fexTreeSelectOption.disabled ? 'true' : null }
  @HostListener('click') select() {
    const toggle = this.treeSelectToggle ?? this.root.multiple
    this.root.select(this.fexTreeSelectOption, toggle, this.clearSearchOnSelect, this.closeOnSelect ?? !toggle)
  }
}

export { PopoverContent as TreeSelectContent, PopoverPortal as TreeSelectPortal }
export type { TreeSelectItem, TreeSelectValue }
