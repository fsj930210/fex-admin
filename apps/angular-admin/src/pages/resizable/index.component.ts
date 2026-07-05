import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { NgStyle } from '@angular/common'
import { RouterLink } from '@angular/router'
import { resizePanelPair } from '@fex/components-core/resizable/layout'
import Card from '@fex/components-angular/ui/card'

type Direction = 'horizontal' | 'vertical'
type PanelConfig = {
  id: string
  minSize?: number
  maxSize?: number
}

@Component({
  selector: 'fex-resizable-page',
  imports: [RouterLink, NgStyle, Card],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizableComponent {
  protected readonly horizontalPanels = [
    { id: 'sidebar', minSize: 18, maxSize: 45 },
    { id: 'content', minSize: 45 },
  ]
  protected readonly verticalPanels = [
    { id: 'header', minSize: 18, maxSize: 45 },
    { id: 'main', minSize: 40 },
  ]
  protected readonly nestedPanels = [
    { id: 'nested-sidebar', minSize: 18 },
    { id: 'nested-workspace', minSize: 45 },
  ]
  protected readonly nestedVerticalPanels = [
    { id: 'nested-editor', minSize: 35 },
    { id: 'nested-console', minSize: 25 },
  ]

  protected readonly horizontalLayout = signal([28, 72])
  protected readonly verticalLayout = signal([30, 70])
  protected readonly nestedLayout = signal([28, 72])
  protected readonly nestedVerticalLayout = signal([55, 45])

  protected startHorizontalResize(event: PointerEvent) {
    this.startResize(event, {
      direction: 'horizontal',
      panelConfigs: this.horizontalPanels,
      layout: () => this.horizontalLayout(),
      setLayout: (layout) => this.horizontalLayout.set(layout),
    })
  }

  protected resizeHorizontalByKey(event: KeyboardEvent) {
    this.resizeByKey(event, {
      direction: 'horizontal',
      panelConfigs: this.horizontalPanels,
      layout: () => this.horizontalLayout(),
      setLayout: (layout) => this.horizontalLayout.set(layout),
    })
  }

  protected startVerticalResize(event: PointerEvent) {
    this.startResize(event, {
      direction: 'vertical',
      panelConfigs: this.verticalPanels,
      layout: () => this.verticalLayout(),
      setLayout: (layout) => this.verticalLayout.set(layout),
    })
  }

  protected resizeVerticalByKey(event: KeyboardEvent) {
    this.resizeByKey(event, {
      direction: 'vertical',
      panelConfigs: this.verticalPanels,
      layout: () => this.verticalLayout(),
      setLayout: (layout) => this.verticalLayout.set(layout),
    })
  }

  protected startNestedResize(event: PointerEvent) {
    this.startResize(event, {
      direction: 'horizontal',
      panelConfigs: this.nestedPanels,
      layout: () => this.nestedLayout(),
      setLayout: (layout) => this.nestedLayout.set(layout),
    })
  }

  protected resizeNestedByKey(event: KeyboardEvent) {
    this.resizeByKey(event, {
      direction: 'horizontal',
      panelConfigs: this.nestedPanels,
      layout: () => this.nestedLayout(),
      setLayout: (layout) => this.nestedLayout.set(layout),
    })
  }

  protected startNestedVerticalResize(event: PointerEvent) {
    this.startResize(event, {
      direction: 'vertical',
      panelConfigs: this.nestedVerticalPanels,
      layout: () => this.nestedVerticalLayout(),
      setLayout: (layout) => this.nestedVerticalLayout.set(layout),
    })
  }

  protected resizeNestedVerticalByKey(event: KeyboardEvent) {
    this.resizeByKey(event, {
      direction: 'vertical',
      panelConfigs: this.nestedVerticalPanels,
      layout: () => this.nestedVerticalLayout(),
      setLayout: (layout) => this.nestedVerticalLayout.set(layout),
    })
  }

  protected gridStyle(direction: Direction, layout: number[]) {
    const template = `${layout[0]}% 12px ${layout[1]}%`
    return direction === 'horizontal' ? { gridTemplateColumns: template } : { gridTemplateRows: template }
  }

  protected startResize(
    event: PointerEvent,
    options: {
      direction: Direction
      panelConfigs: PanelConfig[]
      layout: () => number[]
      setLayout: (layout: number[]) => void
    },
  ) {
    event.preventDefault()
    const startPoint = options.direction === 'horizontal' ? event.clientX : event.clientY
    const rect = (event.currentTarget as HTMLElement).parentElement?.getBoundingClientRect()
    if (!rect) {
      return
    }

    const size = options.direction === 'horizontal' ? rect.width : rect.height
    const startLayout = options.layout()

    const onPointerMove = (pointerEvent: PointerEvent) => {
      pointerEvent.preventDefault()
      const currentPoint = options.direction === 'horizontal' ? pointerEvent.clientX : pointerEvent.clientY
      const delta = ((currentPoint - startPoint) / size) * 100
      options.setLayout(
        resizePanelPair({ layout: startLayout, panelConfigs: options.panelConfigs, handleIndex: 0, delta }),
      )
    }

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp, { once: true })
  }

  protected resizeByKey(
    event: KeyboardEvent,
    options: {
      direction: Direction
      panelConfigs: PanelConfig[]
      layout: () => number[]
      setLayout: (layout: number[]) => void
    },
  ) {
    const step = event.shiftKey ? 10 : 5
    const forward = options.direction === 'horizontal' ? event.key === 'ArrowRight' : event.key === 'ArrowDown'
    const backward = options.direction === 'horizontal' ? event.key === 'ArrowLeft' : event.key === 'ArrowUp'
    if (!forward && !backward) {
      return
    }

    event.preventDefault()
    options.setLayout(
      resizePanelPair({
        layout: options.layout(),
        panelConfigs: options.panelConfigs,
        handleIndex: 0,
        delta: forward ? step : -step,
      }),
    )
  }
}
