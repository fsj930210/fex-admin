import { createTransferController } from '@fex/components-core/transfer/create-transfer-controller'
import type {
  TransferCheckedKeys,
  TransferControllerOptions,
  TransferDataItem,
  TransferKey,
  TransferSide,
} from '@fex/components-core/transfer/types'
import {
  readTransferDisabled,
  readTransferKey,
  resolveTransferFieldNames,
} from '@fex/components-core/transfer/utils'
import { buttonClassName } from '@fex/components-styles/button'
import {
  checkboxCheckIconClassName,
  checkboxClassName,
  checkboxIndicatorClassName,
  checkboxMinusIconClassName,
} from '@fex/components-styles/checkbox'
import { listboxItemClassName, listboxRootClassName } from '@fex/components-styles/listbox'
import {
  transferActionsClassName,
  transferLayoutClassName,
  transferMessageClassName,
  transferPanelBodyClassName,
  transferPanelFooterClassName,
  transferPanelHeaderClassName,
  transferRootClassName,
  transferSourcePanelClassName,
  transferTargetPanelClassName,
  transferWarningMessageClassName,
} from '@fex/components-styles/transfer'
import { cn } from '@fex/utils'
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  Directive,
  effect,
  HostBinding,
  input,
  output,
  TemplateRef,
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import { createCoreStoreSignal } from '../../signals/core-store-signal'
import { CheckIcon } from '../../icon/check'
import { MinusIcon } from '../../icon/minus'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from '../../icon/chevron'
import { CheckboxIndicator, CheckboxRoot } from '../checkbox/checkbox'
import { ListboxItem, ListboxRoot } from '../listbox/listbox'

export interface TransferPanelApi<TItem extends TransferDataItem> {
  side: TransferSide
  items: readonly TItem[]
  checkedKeys: readonly TransferKey[]
  controller: ReturnType<typeof createTransferController<TItem>>
  setCheckedKeys(keys: readonly TransferKey[]): void
  isChecked(key: TransferKey): boolean
}
@Directive({ selector: 'ng-template[fexTransferPanel]', standalone: true })
export class TransferPanelTemplate<TItem extends TransferDataItem = TransferDataItem> {
  readonly side = input.required<TransferSide>({ alias: 'fexTransferPanel' })
  readonly region = input.required<'header' | 'body' | 'footer'>()
  constructor(
    readonly template: TemplateRef<{
      $implicit: TransferPanelApi<TItem> | TransferPanelApi<TransferDataItem>
    }>,
  ) {}
}
export interface TransferActionsApi<TItem extends TransferDataItem> {
  controller: ReturnType<typeof createTransferController<TItem>>
  canMoveToTarget: boolean
  canMoveToSource: boolean
  canMoveAllToTarget: boolean
  canMoveAllToSource: boolean
}
@Directive({ selector: 'ng-template[fexTransferActions]', standalone: true })
export class TransferActionsTemplate<TItem extends TransferDataItem = TransferDataItem> {
  constructor(
    readonly template: TemplateRef<{
      $implicit: TransferActionsApi<TItem> | TransferActionsApi<TransferDataItem>
    }>,
  ) {}
}
@Directive({ selector: 'ng-template[fexTransferItem]', standalone: true })
export class TransferItemTemplate<TItem extends TransferDataItem = TransferDataItem> {
  constructor(readonly template: TemplateRef<{ $implicit: TItem; side: TransferSide }>) {}
}

@Directive({ selector: 'button[fexTransferActionButton]', standalone: true })
class TransferActionButton {
  @HostBinding('class') readonly className =
    `${buttonClassName({ variant: 'outline', size: 'icon' })} !border-border`
}

@Component({
  selector: 'fex-transfer',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    TransferActionButton,
    CheckboxRoot,
    CheckboxIndicator,
    CheckIcon,
    MinusIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    ListboxRoot,
    ListboxItem,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transfer.html',
})
export class Transfer<TItem extends TransferDataItem = TransferDataItem> {
  protected readonly sides: readonly TransferSide[] = ['source', 'target']
  readonly items = input.required<readonly TItem[]>()
  readonly fieldNames = input<TransferControllerOptions<TItem>['fieldNames']>()
  readonly disabled = input(false, { transform: booleanAttribute })
  readonly targetKeys = input<readonly TransferKey[]>()
  readonly defaultTargetKeys = input<readonly TransferKey[]>()
  readonly checkedKeys = input<Partial<TransferCheckedKeys>>()
  readonly defaultCheckedKeys = input<Partial<TransferCheckedKeys>>()
  readonly title = input<{ source?: string; target?: string }>({})
  readonly validation = input<{ status: 'error' | 'warning'; message: string }>()
  readonly targetKeysChange = output<readonly TransferKey[]>()
  readonly transferChange = output<{ keys: readonly TransferKey[]; meta: unknown }>()
  readonly checkedKeysChange = output<TransferCheckedKeys>()
  readonly transferCheckedChange = output<{ keys: TransferCheckedKeys; meta: unknown }>()
  protected readonly templates = contentChildren(TransferPanelTemplate)
  protected readonly actionsTemplate = contentChild(TransferActionsTemplate)
  protected readonly itemTemplate = contentChild(TransferItemTemplate)
  readonly controller = createTransferController<TItem>({ items: [] as TItem[] })
  readonly snapshot = createCoreStoreSignal(this.controller)
  protected readonly fields = computed(() => resolveTransferFieldNames(this.fieldNames()))
  protected readonly rootClass = computed(() =>
    cn(
      transferRootClassName,
      this.validation()?.status === 'warning' &&
        '[&_[data-slot=transfer-panel]]:border-warning [&_[data-slot=transfer-panel]]:ring-3 [&_[data-slot=transfer-panel]]:ring-warning/20',
    ),
  )
  protected readonly layoutClass = transferLayoutClassName
  protected readonly sourceClass = transferSourcePanelClassName
  protected readonly targetClass = transferTargetPanelClassName
  protected readonly headerClass = transferPanelHeaderClassName
  protected readonly bodyClass = transferPanelBodyClassName
  protected readonly footerClass = transferPanelFooterClassName
  protected readonly actionsClass = transferActionsClassName
  protected readonly listClass = listboxRootClassName({ variant: 'transfer' })
  protected readonly itemClass = listboxItemClassName({ size: 'sm' })
  protected readonly checkboxClass = checkboxClassName()
  protected readonly indicatorClass = checkboxIndicatorClassName
  protected readonly checkIconClass = checkboxCheckIconClassName
  protected readonly minusIconClass = checkboxMinusIconClassName
  constructor() {
    effect(() => {
      this.controller.updateOptions({
        items: this.items(),
        fieldNames: this.fieldNames(),
        disabled: this.disabled(),
        targetKeys: this.targetKeys(),
        defaultTargetKeys: this.defaultTargetKeys(),
        checkedKeys: this.checkedKeys(),
        defaultCheckedKeys: this.defaultCheckedKeys(),
        onChange: (keys, meta) => {
          this.targetKeysChange.emit(keys)
          this.transferChange.emit({ keys, meta })
        },
        onCheckedChange: (keys, meta) => {
          this.checkedKeysChange.emit(keys)
          this.transferCheckedChange.emit({ keys, meta })
        },
      })
    })
  }
  protected api(side: TransferSide): TransferPanelApi<TItem> {
    const source = side === 'source'
    const state = this.snapshot()
    const keys = source ? state.sourceCheckedKeys : state.targetCheckedKeys
    return {
      side,
      items: source ? state.sourceItems : state.targetItems,
      checkedKeys: keys,
      controller: this.controller,
      setCheckedKeys: source
        ? this.controller.setSourceCheckedKeys
        : this.controller.setTargetCheckedKeys,
      isChecked: (key) => keys.includes(key),
    }
  }
  protected panelItems(side: TransferSide) {
    return this.api(side).items
  }
  protected panelKeys(side: TransferSide) {
    return this.api(side).checkedKeys
  }
  protected itemKey(item: TItem) {
    return readTransferKey(item, this.fields())
  }
  protected itemLabel(item: TItem) {
    return item[this.fields().label]
  }
  protected itemDisabled(item: TItem) {
    return this.disabled() || readTransferDisabled(item, this.fields())
  }
  protected listValue(side: TransferSide) {
    return [...this.panelKeys(side)]
  }
  protected panelTitle(side: TransferSide) {
    return this.title()[side] ?? (side === 'source' ? 'Source' : 'Target')
  }
  protected enabledKeys(side: TransferSide) {
    return this.panelItems(side)
      .filter((item) => !this.itemDisabled(item))
      .map((item) => this.itemKey(item))
  }
  protected headerState(side: TransferSide) {
    const keys = this.enabledKeys(side)
    const count = keys.filter((key) => this.panelKeys(side).includes(key)).length
    return count === keys.length && keys.length > 0
      ? true
      : count > 0
        ? ('indeterminate' as const)
        : false
  }
  protected toggleAll(side: TransferSide, checked: boolean) {
    this.api(side).setCheckedKeys(checked ? this.enabledKeys(side) : [])
  }
  protected setChecked(
    side: TransferSide,
    event: [TransferKey | TransferKey[] | undefined, unknown],
  ) {
    const value = event[0]
    this.api(side).setCheckedKeys(Array.isArray(value) ? value : value === undefined ? [] : [value])
  }
  protected template(side: TransferSide, region: 'header' | 'body' | 'footer') {
    return this.templates().find((entry) => entry.side() === side && entry.region() === region)
      ?.template
  }
  protected actionsApi(): TransferActionsApi<TItem> {
    this.snapshot()
    return {
      controller: this.controller,
      canMoveToTarget: this.controller.canMoveToTarget(),
      canMoveToSource: this.controller.canMoveToSource(),
      canMoveAllToTarget: this.controller.canMoveAllToTarget(),
      canMoveAllToSource: this.controller.canMoveAllToSource(),
    }
  }
  protected messageClass() {
    return this.validation()?.status === 'warning'
      ? transferWarningMessageClassName
      : transferMessageClassName
  }
}
