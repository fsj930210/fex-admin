import { tabsContentClassName, tabsItemClassName, tabsListClassName } from '@fex/components-styles/tabs'
import { cn } from '@fex/utils'
import { booleanAttribute, computed, Directive, effect, ElementRef, HostListener, inject, input, output, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core'
import type { EmbeddedViewRef, OnDestroy } from '@angular/core'
import type { TabsChangeMeta, TabsItemRecord } from '@fex/components-core/tabs/types'
import { createHostClassName } from '../../signals/host-class'
import { createTabs } from './create-tabs'

let tabsId = 0

@Directive({ selector: '[fexTabsRoot]', standalone: true, exportAs: 'fexTabsRoot' })
export class TabsRoot {
  value = input<string | undefined>()
  defaultValue = input<string | undefined>()
  orientation = input<'horizontal' | 'vertical'>('horizontal')
  variant = input<'default' | 'line'>('default')
  activationMode = input<'automatic' | 'manual'>('automatic')
  loop = input(true, { transform: booleanAttribute })
  change = output<{ value: string | undefined, meta: TabsChangeMeta }>()
  close = output<TabsItemRecord>()
  readonly id = `fex-tabs-${++tabsId}`
  readonly elements = new Map<string, HTMLElement>()
  readonly tabs: ReturnType<typeof createTabs>
  constructor() {
    const value = this.value; const defaultValue = this.defaultValue; const orientation = this.orientation; const activationMode = this.activationMode; const loop = this.loop; const change = this.change
    this.tabs = createTabs({ get value() { return value() }, get defaultValue() { return defaultValue() }, get orientation() { return orientation() }, get activationMode() { return activationMode() }, get loop() { return loop() }, onChange(nextValue, meta) { change.emit({ value: nextValue, meta }) } })
    effect(() => {
      // Signal inputs are an external framework boundary; synchronize them into the shared controller.
      this.tabs.controller.updateOptions({ value: value(), defaultValue: defaultValue(), orientation: orientation(), activationMode: activationMode(), loop: loop(), onChange: (nextValue, meta) => change.emit({ value: nextValue, meta }) })
    })
  }
  register(item: TabsItemRecord, element: HTMLElement) { this.tabs.controller.registerItem(item); this.tabs.controller.selectFirstAvailable(); this.elements.set(item.value, element) }
  unregister(value: string) { this.elements.delete(value); this.tabs.controller.unregisterItem(value) }
  select(value: string) { this.tabs.controller.select(value, 'click') }
  requestClose(item: TabsItemRecord) { this.close.emit(item) }
}

@Directive({ selector: '[fexTabsList]', standalone: true, host: { role: 'tablist', '[class]': 'hostClassName()', '[attr.aria-orientation]': 'root.orientation()', '[attr.data-orientation]': 'root.orientation()' } })
export class TabsList { protected readonly root = inject(TabsRoot); protected readonly hostClassName = createHostClassName(() => cn(tabsListClassName({ variant: this.root.variant(), orientation: this.root.orientation() }))) }

@Directive({ selector: '[fexTabsItem]', standalone: true, exportAs: 'fexTabsItem', host: { '[class]': 'hostClassName()', role: 'tab', '[attr.id]': 'id()', '[attr.tabindex]': 'active() ? 0 : -1', '[attr.aria-selected]': 'active()', '[attr.aria-controls]': 'panelId()', '[attr.aria-disabled]': 'disabled() || null', '[attr.data-state]': "active() ? 'active' : 'inactive'", '[attr.data-disabled]': 'disabled() || null' } })
export class TabsItem implements OnDestroy {
  readonly root = inject(TabsRoot); private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  value = input.required<string>(); disabled = input(false, { transform: booleanAttribute }); closable = input(false, { transform: booleanAttribute })
  protected readonly active = computed(() => this.root.tabs.snapshot().value === this.value())
  protected readonly id = computed(() => `${this.root.id}-tab-${this.value()}`); protected readonly panelId = computed(() => `${this.root.id}-panel-${this.value()}`)
  protected readonly hostClassName = createHostClassName(() => cn(tabsItemClassName({ variant: this.root.variant() })))
  private readonly registration = effect((onCleanup) => { const value = this.value(); this.root.register({ value, disabled: this.disabled(), closable: this.closable() }, this.element); onCleanup(() => this.root.unregister(value)) })
  @HostListener('click', ['$event']) select(event: MouseEvent) { if (!event.defaultPrevented && !this.disabled()) this.root.select(this.value()) }
  @HostListener('keydown', ['$event']) keydown(event: KeyboardEvent) { const horizontal = this.root.orientation() === 'horizontal'; const direction = event.key === 'Home' ? 'first' : event.key === 'End' ? 'last' : event.key === (horizontal ? 'ArrowRight' : 'ArrowDown') ? 'next' : event.key === (horizontal ? 'ArrowLeft' : 'ArrowUp') ? 'previous' : undefined; if (direction) { event.preventDefault(); const value = this.root.tabs.controller.moveFocus(direction); if (value) this.root.elements.get(value)?.focus(); return } if (this.root.activationMode() === 'manual' && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); this.root.tabs.controller.select(this.value(), 'keyboard') } }
  requestClose(event?: Event) { event?.stopPropagation(); if (this.closable()) this.root.requestClose({ value: this.value(), disabled: this.disabled(), closable: true }) }
  ngOnDestroy() { this.root.unregister(this.value()) }
}

@Directive({ selector: '[fexTabsContent]', standalone: true })
export class TabsContent implements OnDestroy {
  private readonly root = inject(TabsRoot); private readonly template = inject(TemplateRef<unknown>); private readonly container = inject(ViewContainerRef); private readonly renderer = inject(Renderer2)
  fexTabsContent = input.required<string>(); private view?: EmbeddedViewRef<unknown>; private element: HTMLElement | undefined; private initialClassName: string | undefined
  private readonly visibility = effect(() => { const value = this.fexTabsContent(); const snapshot = this.root.tabs.snapshot(); if (!this.root.tabs.controller.isContentMounted(value)) return; if (!this.view) { this.view = this.container.createEmbeddedView(this.template); this.view.detectChanges(); this.element = this.view.rootNodes.find((node) => node?.nodeType === 1) as HTMLElement | undefined; this.initialClassName = this.element?.getAttribute('class') ?? undefined } const element = this.element; if (!element) return; this.renderer.setAttribute(element, 'id', `${this.root.id}-panel-${value}`); this.renderer.setAttribute(element, 'role', 'tabpanel'); this.renderer.setAttribute(element, 'aria-labelledby', `${this.root.id}-tab-${value}`); this.renderer.setAttribute(element, 'data-state', snapshot.value === value ? 'active' : 'inactive'); this.renderer.setProperty(element, 'hidden', snapshot.value !== value); this.renderer.setAttribute(element, 'class', cn(tabsContentClassName({ variant: this.root.variant() }), this.initialClassName)) })
  ngOnDestroy() { this.view?.destroy() }
}

export { createTabs }
