import { createStepsController } from '@fex-design/core/steps/create-steps-controller'
import { deserializeStepValue, serializeStepValue, type StepRecord, type StepsChangeMeta, type StepsOrientation, type StepStatus, type StepValue } from '@fex-design/core/steps/types'
import { stepClassName, stepContentClassName, stepIndicatorClassName, stepsClassName } from '@fex-design/styles/steps'
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, effect, ElementRef, HostListener, inject, input, output } from '@angular/core'
import type { OnDestroy } from '@angular/core'
import { CheckIcon } from '../../icon/check'
import { createCoreStoreSignal } from '../../signals/core-store-signal'
import { createHostClassName } from '../../signals/host-class'

@Component({ selector: 'fex-steps', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[class]': 'hostClassName()', 'data-slot': 'steps', '[attr.data-orientation]': 'orientation()', role: 'list' }, template: '<ng-content />' })
export class Steps implements OnDestroy {
  current = input<StepValue>(); defaultCurrent = input<StepValue>(); navigation = input(false, { transform: booleanAttribute }); orientation = input<StepsOrientation>('horizontal'); responsive = input(true, { transform: booleanAttribute }); change = output<{ value: StepValue; meta: StepsChangeMeta }>()
  readonly elements = new Map<StepValue, HTMLElement>()
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  readonly controller = createStepsController({ current: this.current(), defaultCurrent: this.defaultCurrent(), navigation: this.navigation(), onChange: (value, meta) => this.change.emit({ value, meta }) })
  readonly snapshot = createCoreStoreSignal(this.controller)
  protected readonly hostClassName = createHostClassName(() => stepsClassName({ orientation: this.orientation(), responsive: this.responsive() }))
  private readonly orderObserver = new MutationObserver(() => this.syncOrder())
  constructor() { effect(() => this.controller.updateOptions({ current: this.current(), defaultCurrent: this.defaultCurrent(), navigation: this.navigation(), onChange: (value, meta) => this.change.emit({ value, meta }) })); this.orderObserver.observe(this.element, { childList: true, subtree: true }) }
  ngOnDestroy() { this.orderObserver.disconnect() }
  syncOrder() { this.controller.setOrder([...this.element.querySelectorAll<HTMLElement>('[data-step-value]')].filter((element) => element.closest('[data-slot="steps"]') === this.element).map((element) => deserializeStepValue(element.dataset.stepValue ?? 's:'))) }
}

@Component({ selector: 'fex-step', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[class]': 'hostClassName()', '[attr.role]': "root.navigation() ? 'button' : null", '[attr.tabindex]': 'tabIndex()', '[attr.aria-current]': "active() ? 'step' : null", '[attr.aria-disabled]': 'info().disabled || null', '[attr.data-status]': 'info().status', '[attr.data-disabled]': 'info().disabled || null', '[attr.data-navigation]': 'root.navigation() || null', '[attr.data-step-value]': 'serializedValue()' }, template: '<ng-content />' })
export class Step implements OnDestroy {
  readonly root = inject(Steps); private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  value = input.required<StepValue>(); disabled = input(false, { transform: booleanAttribute }); status = input<StepStatus>(); data = input<unknown>()
  readonly serializedValue = computed(() => serializeStepValue(this.value()))
  readonly info = computed(() => { this.root.snapshot().revision; return this.root.controller.getStepInfo(this.value()) ?? { value: this.value(), status: this.status() ?? 'wait', disabled: this.disabled() } })
  readonly position = computed(() => { this.root.snapshot().revision; return Math.max(1, this.root.controller.getPosition(this.value()) + 1) }); readonly active = computed(() => this.root.snapshot().current === this.value()); readonly tabIndex = computed(() => this.root.navigation() && !this.info().disabled ? (this.active() ? 0 : -1) : null)
  protected readonly hostClassName = createHostClassName(stepClassName)
  private registeredValue: StepValue | undefined
  private readonly registration = effect(() => { const record: StepRecord = { value: this.value(), disabled: this.disabled(), status: this.status(), data: this.data() }; if (this.registeredValue !== undefined && this.registeredValue !== record.value) { this.root.elements.delete(this.registeredValue); this.root.controller.unregisterStep(this.registeredValue) } this.registeredValue = record.value; this.root.controller.registerStep(record); this.root.elements.set(record.value, this.element); queueMicrotask(() => queueMicrotask(() => this.root.syncOrder())) })
  ngOnDestroy() { if (this.registeredValue !== undefined) { this.root.elements.delete(this.registeredValue); this.root.controller.unregisterStep(this.registeredValue); this.root.syncOrder() } }
  @HostListener('click') click() { this.root.controller.select(this.value(), 'pointer') }
  @HostListener('keydown', ['$event']) keydown(event: KeyboardEvent) { if (!this.root.navigation() || this.info().disabled) return; if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); this.root.controller.select(this.value(), 'keyboard'); return } const horizontal = this.root.orientation() === 'horizontal'; const direction = event.key === 'Home' ? 'first' : event.key === 'End' ? 'last' : event.key === (horizontal ? 'ArrowRight' : 'ArrowDown') ? 'next' : event.key === (horizontal ? 'ArrowLeft' : 'ArrowUp') ? 'previous' : undefined; if (direction) { event.preventDefault(); const value = this.root.controller.move(this.value(), direction); if (value !== undefined) { this.root.elements.get(value)?.focus(); this.root.controller.select(value, 'keyboard') } } }
}

@Component({ selector: 'fex-step-indicator', standalone: true, imports: [CheckIcon], changeDetection: ChangeDetectionStrategy.OnPush, host: { '[class]': 'hostClassName()' }, templateUrl: './step-indicator.html' })
export class StepIndicator { readonly step = inject(Step); protected readonly hostClassName = createHostClassName(stepIndicatorClassName) }
@Component({ selector: 'fex-step-content', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[class]': 'hostClassName()' }, template: '<ng-content />' })
export class StepContent { protected readonly hostClassName = createHostClassName(stepContentClassName) }
export type { StepBuiltinStatus, StepInfo, StepRecord, StepsChangeMeta, StepsChangeTrigger, StepsOrientation, StepStatus, StepValue } from '@fex-design/core/steps/types'
