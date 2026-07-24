import { createTimePickerController } from '@fex/components-core/time-picker/create-time-picker-controller'
import { format as formatDate, parse } from '@fex/components-core/date/utils'
import {
  createHourOptions,
  createMinuteOptions,
  createPeriodOptions,
  createSecondOptions,
  getDisplayedHour,
  getDisplayedPeriod,
  resolveDisabledTime,
} from '@fex/components-core/time-picker/options'
import type {
  DisabledTime,
  TimePeriod,
  TimePickerChangeDetails,
  TimePickerOption,
  TimeValue,
} from '@fex/components-core/time-picker/types'
import {
  timePickerColumnClassName,
  timePickerColumnItemClassName,
  timePickerColumnSpacerClassName,
  timePickerColumnViewportClassName,
  timePickerRootClassName,
} from '@fex/components-styles/time-picker'
import { cn } from '@fex/utils'
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  computed,
  Directive,
  effect,
  ElementRef,
  input,
  inject,
  numberAttribute,
  output,
  QueryList,
  signal,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import { ClockIcon } from '../../icon/clock'
import { InputClear, InputControl, InputPrefix, InputRoot, InputSuffix } from '../input/input'
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover'
import { ScrollbarBar, ScrollbarRoot, ScrollbarThumb, ScrollbarTrack, ScrollbarViewport } from '../scrollbar/scrollbar'
import { createCoreStoreSignal } from '../../signals/core-store-signal'
import { createHostClassName } from '../../signals/host-class'

@Component({
  selector: 'fex-time-picker',
  standalone: true,
  providers: [Popover],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
})
export class TimePickerRoot {
  value = input<TimeValue | null | undefined>()
  defaultValue = input<TimeValue | null | undefined>()
  format = input<string | undefined>()
  open = input<boolean | undefined>()
  defaultOpen = input(false)
  placement = input<'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight' | 'left' | 'leftTop' | 'leftBottom' | 'right' | 'rightTop' | 'rightBottom'>('bottomLeft')
  use12Hours = input(false, { transform: booleanAttribute })
  disabled = input(false, { transform: booleanAttribute })
  readOnly = input(false, { transform: booleanAttribute })
  disabledTime = input<DisabledTime | undefined>()
  change = output<{ value: TimeValue | null; details: TimePickerChangeDetails }>()
  openChange = output<boolean>()
  private readonly popover = inject(Popover)
  readonly popoverSnapshot = this.popover.snapshot
  readonly controller = createTimePickerController({
    value: this.value(),
    defaultValue: this.defaultValue(),
    onChange: (value, details) => this.change.emit({ value, details }),
  })
  private readonly coreSnapshot = createCoreStoreSignal(this.controller)
  readonly snapshot = computed(() => {
    this.coreSnapshot()
    return this.controller.getSnapshot()
  })
  readonly resolvedFormat = computed(() => this.format() ?? (this.use12Hours() ? 'hh:mm:ss A' : 'HH:mm:ss'))

  constructor() {
    this.popover.trigger = ['focus', 'click']
    this.popover.openChange.subscribe(value => this.openChange.emit(value))
    effect(() => {
      const value = this.value()
      if (value !== undefined) this.controller.setControlledValue(value)
    })
    effect(() => {
      const open = this.open()
      if (open !== undefined) this.popover.open = open
      const defaultOpen = this.defaultOpen()
      if (defaultOpen !== undefined) this.popover.defaultOpen = defaultOpen
      this.popover.placement = this.placement()
      this.popover.syncOptions()
    })
  }
}

@Directive({ selector: 'ng-template[fexTimePickerPrefix]', standalone: true })
export class TimePickerPrefixTemplate { readonly template = inject(TemplateRef<unknown>) }
@Directive({ selector: 'ng-template[fexTimePickerSuffix]', standalone: true })
export class TimePickerSuffixTemplate { readonly template = inject(TemplateRef<unknown>) }

@Component({
  selector: 'fex-time-picker-trigger',
  standalone: true,
  imports: [NgTemplateOutlet, InputRoot, InputControl, InputClear, InputPrefix, InputSuffix, ClockIcon, PopoverTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClassName()' },
  templateUrl: './time-picker-trigger.html',
})
export class TimePickerTrigger {
  protected readonly hostClassName = createHostClassName('block')
  readonly root = inject(TimePickerRoot)
  allowClear = input(true, { transform: booleanAttribute })
  placeholder = input<string | undefined>()
  invalid = input(false, { transform: booleanAttribute })
  prefix = contentChild(TimePickerPrefixTemplate)
  suffix = contentChild(TimePickerSuffixTemplate)
  readonly text = signal('')
  constructor() { effect(() => this.text.set(this.root.snapshot().value ? formatDate(this.root.snapshot().value!, this.root.resolvedFormat()) : '')) }
  inputText(value: string) { this.text.set(value); const result = parse(value, this.root.resolvedFormat()); if (result.valid) this.root.controller.change(result.value, 'input', 'smooth') }
  clear() { this.text.set(''); this.root.controller.clear() }
}

@Component({ selector: 'fex-time-picker-content', standalone: true, imports: [PopoverContent], changeDetection: ChangeDetectionStrategy.OnPush, template: '<fex-popover-content class="overflow-hidden p-0" style="width:var(--floating-reference-width);max-width:var(--floating-available-width);max-height:var(--floating-available-height)"><ng-content /></fex-popover-content>' })
export class TimePickerContent {}

@Component({ selector: 'div[fexTimePickerPanel]', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { 'data-slot': 'time-picker-panel', '[class]': 'hostClassName()' }, template: '<ng-content />' })
export class TimePickerPanel { protected readonly hostClassName = createHostClassName(timePickerRootClassName) }

type ColumnValue = number | TimePeriod

@Directive()
abstract class TimePickerColumnBase<TValue extends ColumnValue> {
  disabled = input(false, { transform: booleanAttribute })
  protected readonly root: TimePickerRoot
  protected readonly elementRef: ElementRef<HTMLElement>
  @ViewChild('scrollViewport', { read: ElementRef }) scrollViewport?: ElementRef<HTMLElement>
  @ViewChildren('itemElement', { read: ElementRef }) itemElements?: QueryList<
    ElementRef<HTMLButtonElement>
  >
  readonly activeValue = signal<TValue | undefined>(undefined)
  readonly resolvedDisabled = computed(() => this.root.disabled() || this.disabled())
  abstract readonly options: ReturnType<typeof computed<readonly TimePickerOption<TValue>[]>>
  abstract readonly selectedValue: ReturnType<typeof computed<TValue | undefined>>
  abstract commit(value: TValue): void
  protected readonly itemClassName = timePickerColumnItemClassName
  protected readonly spacerClassName = timePickerColumnSpacerClassName
  protected readonly viewportClassName = timePickerColumnViewportClassName
  protected readonly hostClassName = createHostClassName(timePickerColumnClassName)

  constructor(root: TimePickerRoot, elementRef: ElementRef<HTMLElement>) {
    this.root = root
    this.elementRef = elementRef
    effect(() => {
      const selected = this.selectedValue()
      const request = this.root.snapshot().scrollRequest
      const open = this.root.popoverSnapshot().open
      if (!open) return
      queueMicrotask(() => this.scrollTo(selected, request?.behavior ?? 'auto'))
    })
  }

  select(item: TimePickerOption<TValue>, element: HTMLButtonElement) {
    if (this.resolvedDisabled() || this.root.readOnly() || item.disabled) return
    this.activeValue.set(item.value)
    this.commit(item.value)
    this.scrollViewport?.nativeElement.scrollTo({ top: element.offsetTop, behavior: 'smooth' })
  }

  handleKeydown(event: KeyboardEvent) {
    if (this.resolvedDisabled() || this.root.readOnly()) return
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const enabled = this.options().filter((item) => !item.disabled)
    const current = enabled.findIndex((item) => item.value === this.activeValue())
    const index = Math.min(
      enabled.length - 1,
      Math.max(0, current + (event.key === 'ArrowDown' ? 1 : -1)),
    )
    const next = enabled[index]
    if (!next) return
    this.activeValue.set(next.value)
    this.itemElements
      ?.get(this.options().findIndex((item) => item.value === next.value))
      ?.nativeElement.focus()
  }

  private scrollTo(value: TValue | undefined, behavior: ScrollBehavior) {
    if (value === undefined) return
    const index = this.options().findIndex((item) => item.value === value)
    const item = this.itemElements?.get(index)?.nativeElement
    if (item) this.scrollViewport?.nativeElement.scrollTo({ top: item.offsetTop, behavior })
  }
}

const columnHost = {
  role: 'listbox',
  '[class]': 'hostClassName()',
  '[attr.tabindex]': 'resolvedDisabled() ? -1 : 0',
  '[attr.aria-disabled]': 'resolvedDisabled() || null',
  '[attr.data-disabled]': "resolvedDisabled() ? 'true' : null",
  '(keydown)': 'handleKeydown($event)',
}

@Component({
  selector: 'div[fexTimePickerHourColumn]',
  standalone: true,
  imports: [ScrollbarRoot, ScrollbarViewport, ScrollbarBar, ScrollbarTrack, ScrollbarThumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: columnHost,
  templateUrl: './time-picker-column.html',
})
export class TimePickerHourColumn extends TimePickerColumnBase<number> {
  step = input(1, { transform: numberAttribute })
  isItemDisabled = input<((value: number) => boolean) | undefined>()
  readonly options = computed(() =>
    createHourOptions({
      step: this.step(),
      use12Hours: this.root.use12Hours(),
      period: this.root.snapshot().value ? getDisplayedPeriod(this.root.snapshot().value!) : 'am',
      disabled: resolveDisabledTime(this.root.disabledTime(), this.root.snapshot().value).hours,
    }).map((item) => ({
      ...item,
      disabled: item.disabled || Boolean(this.isItemDisabled()?.(item.value)),
    })),
  )
  readonly selectedValue = computed(() =>
    this.root.snapshot().value
      ? getDisplayedHour(this.root.snapshot().value!, this.root.use12Hours())
      : undefined,
  )
  constructor(root: TimePickerRoot, elementRef: ElementRef<HTMLElement>) {
    super(root, elementRef)
  }
  commit(value: number) {
    this.root.controller.selectHour(value, this.root.use12Hours())
  }
}

@Component({
  selector: 'div[fexTimePickerMinuteColumn]',
  standalone: true,
  imports: [ScrollbarRoot, ScrollbarViewport, ScrollbarBar, ScrollbarTrack, ScrollbarThumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: columnHost,
  templateUrl: './time-picker-column.html',
})
export class TimePickerMinuteColumn extends TimePickerColumnBase<number> {
  step = input(1, { transform: numberAttribute })
  isItemDisabled = input<((value: number) => boolean) | undefined>()
  readonly options = computed(() =>
    createMinuteOptions(
      this.step(),
      resolveDisabledTime(this.root.disabledTime(), this.root.snapshot().value).minutes,
    ).map((item) => ({
      ...item,
      disabled: item.disabled || Boolean(this.isItemDisabled()?.(item.value)),
    })),
  )
  readonly selectedValue = computed(() => this.root.snapshot().value?.minute)
  constructor(root: TimePickerRoot, elementRef: ElementRef<HTMLElement>) {
    super(root, elementRef)
  }
  commit(value: number) {
    this.root.controller.selectMinute(value)
  }
}

@Component({
  selector: 'div[fexTimePickerSecondColumn]',
  standalone: true,
  imports: [ScrollbarRoot, ScrollbarViewport, ScrollbarBar, ScrollbarTrack, ScrollbarThumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: columnHost,
  templateUrl: './time-picker-column.html',
})
export class TimePickerSecondColumn extends TimePickerColumnBase<number> {
  step = input(1, { transform: numberAttribute })
  isItemDisabled = input<((value: number) => boolean) | undefined>()
  readonly options = computed(() =>
    createSecondOptions(
      this.step(),
      resolveDisabledTime(this.root.disabledTime(), this.root.snapshot().value).seconds,
    ).map((item) => ({
      ...item,
      disabled: item.disabled || Boolean(this.isItemDisabled()?.(item.value)),
    })),
  )
  readonly selectedValue = computed(() => this.root.snapshot().value?.second)
  constructor(root: TimePickerRoot, elementRef: ElementRef<HTMLElement>) {
    super(root, elementRef)
  }
  commit(value: number) {
    this.root.controller.selectSecond(value)
  }
}

@Component({
  selector: 'div[fexTimePickerPeriodColumn]',
  standalone: true,
  imports: [ScrollbarRoot, ScrollbarViewport, ScrollbarBar, ScrollbarTrack, ScrollbarThumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: columnHost,
  templateUrl: './time-picker-column.html',
})
export class TimePickerPeriodColumn extends TimePickerColumnBase<TimePeriod> {
  labels = input<{ am: string; pm: string }>({ am: 'AM', pm: 'PM' })
  isItemDisabled = input<((value: TimePeriod) => boolean) | undefined>()
  readonly options = computed(() =>
    createPeriodOptions(this.labels()).map((item) => ({
      ...item,
      disabled: item.disabled || Boolean(this.isItemDisabled()?.(item.value)),
    })),
  )
  readonly selectedValue = computed(() =>
    this.root.snapshot().value ? getDisplayedPeriod(this.root.snapshot().value!) : undefined,
  )
  constructor(root: TimePickerRoot, elementRef: ElementRef<HTMLElement>) {
    super(root, elementRef)
  }
  commit(value: TimePeriod) {
    this.root.controller.selectPeriod(value)
  }
}

export type { DisabledTime, TimePeriod, TimePickerChangeDetails, TimeValue }
