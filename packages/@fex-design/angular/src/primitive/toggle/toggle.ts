import { createToggleGroupController } from '@fex-design/core/toggle/create-toggle-group-controller'
import { createToggleController } from '@fex-design/core/toggle/create-toggle-controller'
import { getToggleGroupFocusIndex, type ToggleController, type ToggleGroupController, type ToggleGroupSnapshot, type ToggleGroupValue, type ToggleSnapshot } from '@fex-design/core/toggle/types'
import { toggleClassName, toggleGroupClassName, type ToggleStyleProps } from '@fex-design/styles/toggle'
import { cn } from '@fex/utils'
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, HostListener, inject, input, output, type Signal } from '@angular/core'
import { createCoreStoreSignal } from '../../signals/core-store-signal'
import { createHostClassName } from '../../signals/host-class'

@Component({
  selector: 'div[fexToggleGroup]', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'group', '[class]': 'hostClassName()', '[style.gap.px]': 'spacing() || null', '[attr.aria-orientation]': 'orientation()', '[attr.data-slot]': "'toggle-group'", '[attr.data-orientation]': 'orientation()', '[attr.data-variant]': 'variant()', '[attr.data-disabled]': "disabled() ? 'true' : null" },
  template: '<ng-content />',
})
export class ToggleGroup {
  multiple = input(false, { transform: booleanAttribute })
  value = input<ToggleGroupValue | undefined>()
  defaultValue = input<ToggleGroupValue | undefined>()
  disabled = input(false, { transform: booleanAttribute })
  orientation = input<'horizontal' | 'vertical'>('horizontal')
  spacing = input(8)
  variant = input<ToggleStyleProps['variant']>('default')
  size = input<ToggleStyleProps['size']>('default')
  change = output<ToggleGroupValue>()
  readonly controller: ToggleGroupController
  readonly snapshot: Signal<ToggleGroupSnapshot>
  protected readonly hostClassName = createHostClassName(() => cn(toggleGroupClassName({ orientation: this.orientation(), variant: this.variant(), connected: this.spacing() === 0 })))
  constructor() {
    const owner = this
    this.controller = createToggleGroupController({ get multiple() { return owner.multiple() }, get value() { return owner.value() }, get defaultValue() { return owner.defaultValue() }, get disabled() { return owner.disabled() }, onChange(value) { owner.change.emit(value) } })
    this.snapshot = createCoreStoreSignal(this.controller)
  }
  isPressed(value: string) { this.value(); this.snapshot(); return this.controller.isPressed(value) }
  toggle(value: string) { this.controller.toggle(value) }
  @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
    if (event.defaultPrevented) return
    const currentTarget = event.currentTarget as HTMLDivElement
    const items = [...currentTarget.querySelectorAll<HTMLButtonElement>('[data-slot=toggle]:not(:disabled)')]
    const index = items.indexOf(event.target as HTMLButtonElement)
    const next = getToggleGroupFocusIndex(event.key, index, items.length, this.orientation())
    if (next === undefined || next === index) return
    event.preventDefault()
    items[next]?.focus()
  }
}

@Component({
  selector: 'button[fexToggle]', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { type: 'button', '[class]': 'hostClassName()', '[disabled]': 'disabledState()', '[attr.aria-pressed]': 'currentPressed()', '[attr.data-slot]': "'toggle'", '[attr.data-state]': "currentPressed() ? 'on' : 'off'", '[attr.data-value]': 'value()', '[attr.data-disabled]': "disabledState() ? 'true' : null" },
  template: '<ng-content />',
})
export class Toggle {
  private readonly group = inject(ToggleGroup, { optional: true })
  pressed = input<boolean | undefined>()
  defaultPressed = input(false, { transform: booleanAttribute })
  value = input<string | undefined>()
  disabled = input(false, { transform: booleanAttribute })
  variant = input<ToggleStyleProps['variant']>()
  size = input<ToggleStyleProps['size']>()
  change = output<boolean>()
  private readonly controller: ToggleController
  private readonly snapshot: Signal<ToggleSnapshot>
  protected readonly currentPressed = computed(() => { const value = this.value(); return this.group && value !== undefined ? this.group.isPressed(value) : (this.pressed() ?? this.snapshot().pressed) })
  protected readonly disabledState = computed(() => this.disabled() || (this.group?.disabled() ?? false))
  protected readonly hostClassName = createHostClassName(() => cn(toggleClassName({ variant: this.variant() ?? this.group?.variant(), size: this.size() ?? this.group?.size() })))
  constructor() {
    const owner = this
    this.controller = createToggleController({ get pressed() { return owner.pressed() }, get defaultPressed() { return owner.defaultPressed() }, get disabled() { return owner.disabledState() }, onChange(value) { owner.change.emit(value) } })
    this.snapshot = createCoreStoreSignal(this.controller)
  }
  @HostListener('click', ['$event']) onClick(event: MouseEvent) { if (event.defaultPrevented || this.disabledState()) return; const value = this.value(); if (this.group && value !== undefined) this.group.toggle(value); else this.controller.toggle() }
}
