import { NgTemplateOutlet } from '@angular/common'
import { afterNextRender, ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, numberAttribute, output, signal, type TemplateRef } from '@angular/core'
import { ensureAnchorLinkVisible, getAnchorIndicatorStyles, getAnchorScrollTop, getAnchorTargetTop, getAnchorViewportHeight, isAnchorScrolledToEnd, resolveAnchorTarget } from '@fex-design/core/anchor/dom'
import { createAnchorController, flattenAnchorItems, getAnchorActiveKeys, getAnchorHighlightedKeys } from '@fex-design/core/anchor/model'
import type { AnchorActiveMode, AnchorItem, AnchorOrientation } from '@fex-design/core/anchor/types'
import { anchorIndicatorClassName, anchorLinkClassName, anchorListClassName, anchorRailClassName, anchorRootClassName } from '@fex-design/styles/anchor'
import { cn } from '@fex/utils'
import { createHostClassName } from '../../signals/host-class'
import { createCoreStoreSignal } from '../../signals/core-store-signal'

@Component({
  selector: 'fex-anchor',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './anchor.html',
  host: { '[class]': 'hostClassName()', '[attr.data-orientation]': 'orientation()', 'data-slot': 'anchor' },
})
export class Anchor {
  items = input.required<readonly AnchorItem<string>[]>()
  activeKeys = input<readonly string[] | undefined>()
  defaultActiveKeys = input<readonly string[]>([])
  activeMode = input<AnchorActiveMode>('current')
  orientation = input<AnchorOrientation>('vertical')
  container = input<Window | HTMLElement | (() => Window | HTMLElement) | undefined>()
  offset = input(0, { transform: numberAttribute })
  activeOffset = input(0, { transform: numberAttribute })
  behavior = input<ScrollBehavior>('smooth')
  itemTemplate = input<TemplateRef<{ $implicit: AnchorItem<string>; active: boolean }> | undefined>()
  change = output<{ activeKeys: readonly string[]; items: readonly AnchorItem<string>[] }>()

  protected readonly inkStyles = signal<ReturnType<typeof getAnchorIndicatorStyles>>([])
  protected readonly indicatorClassName = () => anchorIndicatorClassName({ orientation: this.orientation() })
  protected readonly railClassName = () => anchorRailClassName({ orientation: this.orientation() })
  protected readonly hostClassName = createHostClassName(() => cn(anchorRootClassName({ orientation: this.orientation() })))
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly controller = createAnchorController<string>()
  private readonly storeSnapshot = createCoreStoreSignal(this.controller)
  protected readonly currentKeys = () => this.activeKeys() ?? this.storeSnapshot().activeKeys
  protected readonly highlightedKeys = () => getAnchorHighlightedKeys(this.currentKeys(), flattenAnchorItems(this.items()))
  protected listClassName(level: number) {
    return anchorListClassName({ orientation: this.orientation(), nested: level > 0 })
  }
  protected linkClassName(key: string) {
    return anchorLinkClassName({ orientation: this.orientation(), active: this.highlightedKeys().has(key) })
  }

  constructor() {
    afterNextRender(() => this.update())
    effect(() => {
      const activeKeys = this.activeKeys()
      this.controller.updateOptions({
        ...(activeKeys === undefined ? {} : { activeKeys }),
        defaultActiveKeys: this.defaultActiveKeys(),
        onChange: (activeKeys, items) => this.change.emit({ activeKeys, items }),
      })
    })
    effect((onCleanup) => {
      const targetContainer = this.resolveContainer()
      let frame = 0
      const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => this.update()) }
      schedule()
      targetContainer.addEventListener('scroll', schedule, { passive: true })
      window.addEventListener('resize', schedule)
      onCleanup(() => { cancelAnimationFrame(frame); targetContainer.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) })
    })
  }
  private resolveContainer() {
    const container = this.container()
    return typeof container === 'function' ? container() : (container ?? window)
  }
  private setKeys(keys: readonly string[]) {
    const keySet = new Set(keys)
    this.controller.change(keys, flattenAnchorItems(this.items()).filter(({ item }) => keySet.has(item.key)).map(({ item }) => item))
  }
  private update() {
    const targetContainer = this.resolveContainer()
    const flatItems = flattenAnchorItems(this.items()).filter((item) => this.orientation() === 'vertical' || item.level === 0)
    const positions = flatItems.flatMap(({ item }) => {
      const target = resolveAnchorTarget(item.target)
      return target ? [{ item, top: getAnchorTargetTop(target, targetContainer) }] : []
    })
    this.setKeys(getAnchorActiveKeys({ positions, scrollTop: getAnchorScrollTop(targetContainer), viewportHeight: getAnchorViewportHeight(targetContainer), offset: this.offset(), activeOffset: this.activeOffset(), mode: this.activeMode(), scrolledToEnd: isAnchorScrolledToEnd(targetContainer) }))
    ensureAnchorLinkVisible(this.element, this.currentKeys(), this.orientation())
    this.inkStyles.set(getAnchorIndicatorStyles(this.element, this.currentKeys(), this.orientation()))
  }
  protected activate(item: AnchorItem<string>) {
    const target = resolveAnchorTarget(item.target)
    if (!target) return
    const targetContainer = this.resolveContainer()
    const items = flattenAnchorItems(this.items()).filter((entry) => this.orientation() === 'vertical' || entry.level === 0)
    const index = items.findIndex(({ item: entry }) => entry.key === item.key)
    this.setKeys(this.activeMode() === 'progress' ? items.slice(0, index + 1).map(({ item: entry }) => entry.key) : [item.key])
    targetContainer.scrollTo({ top: Math.max(getAnchorTargetTop(target, targetContainer) - this.offset(), 0), behavior: this.behavior() })
  }
}

export type { AnchorActiveMode, AnchorItem, AnchorOrientation, AnchorTarget } from '@fex-design/core/anchor/types'
export { createAnchorController } from '@fex-design/core/anchor/model'
