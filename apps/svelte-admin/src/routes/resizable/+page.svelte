<script lang="ts">
  import { resizePanelPair } from '@fex/components-core/resizable/layout'
  import Card from '@fex/components-svelte/ui/card'

  type Direction = 'horizontal' | 'vertical'

  const horizontalPanels = [
    { id: 'sidebar', minSize: 18, maxSize: 45 },
    { id: 'content', minSize: 45 },
  ]
  const verticalPanels = [
    { id: 'header', minSize: 18, maxSize: 45 },
    { id: 'main', minSize: 40 },
  ]
  const nestedPanels = [
    { id: 'nested-sidebar', minSize: 18 },
    { id: 'nested-workspace', minSize: 45 },
  ]
  const nestedVerticalPanels = [
    { id: 'nested-editor', minSize: 35 },
    { id: 'nested-console', minSize: 25 },
  ]

  let horizontalLayout = $state([28, 72])
  let verticalLayout = $state([30, 70])
  let nestedLayout = $state([28, 72])
  let nestedVerticalLayout = $state([55, 45])

  function gridStyle(direction: Direction, layout: number[]) {
    const template = `${layout[0]}% 12px ${layout[1]}%`
    return direction === 'horizontal' ? `grid-template-columns:${template}` : `grid-template-rows:${template}`
  }

  function startResize(
    event: PointerEvent,
    options: {
      direction: Direction
      panelConfigs: typeof horizontalPanels
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

    function onPointerMove(pointerEvent: PointerEvent) {
      pointerEvent.preventDefault()
      const currentPoint = options.direction === 'horizontal' ? pointerEvent.clientX : pointerEvent.clientY
      const delta = ((currentPoint - startPoint) / size) * 100
      options.setLayout(resizePanelPair({ layout: startLayout, panelConfigs: options.panelConfigs, handleIndex: 0, delta }))
    }

    function onPointerUp() {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp, { once: true })
  }

  function resizeByKey(
    event: KeyboardEvent,
    options: {
      direction: Direction
      panelConfigs: typeof horizontalPanels
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
</script>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-xl">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a>
      <div><h1 class="text-2xl font-semibold text-foreground">Resizable</h1><p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">Split panel layout component for sidebars and workspace surfaces.</p></div>
    </header>
    <div class="space-y-space-xl">
      <Card title="Horizontal" description="Pointer and keyboard resizing with min and max constraints.">
        <div class="grid h-72 overflow-hidden rounded-md border border-border bg-background" style={gridStyle('horizontal', horizontalLayout)}>
          <div data-resizable-panel="sidebar" class="p-space-md"><h2 class="text-sm font-medium">Sidebar</h2><p class="mt-space-sm text-sm text-muted-foreground">Resize from the handle.</p></div>
          <button aria-label="Resize horizontal panels" data-resizable-handle type="button" class="relative flex cursor-col-resize touch-none items-center justify-center outline-none focus-visible:bg-muted-background after:h-full after:w-px after:bg-border" onpointerdown={(event) => startResize(event, { direction: 'horizontal', panelConfigs: horizontalPanels, layout: () => horizontalLayout, setLayout: (layout) => (horizontalLayout = layout) })} onkeydown={(event) => resizeByKey(event, { direction: 'horizontal', panelConfigs: horizontalPanels, layout: () => horizontalLayout, setLayout: (layout) => (horizontalLayout = layout) })}></button>
          <div data-resizable-panel="content" class="p-space-md"><h2 class="text-sm font-medium">Content</h2><p class="mt-space-sm text-sm text-muted-foreground">Use arrow keys while the handle is focused.</p></div>
        </div>
      </Card>
      <Card title="Vertical" description="Use a vertical group for stacked panels.">
        <div class="grid h-80 overflow-hidden rounded-md border border-border bg-background" style={gridStyle('vertical', verticalLayout)}>
          <div data-resizable-panel="header" class="p-space-md"><h2 class="text-sm font-medium">Header</h2><p class="mt-space-sm text-sm text-muted-foreground">Resize vertically.</p></div>
          <button aria-label="Resize vertical panels" data-resizable-handle type="button" class="relative flex cursor-row-resize touch-none items-center justify-center outline-none focus-visible:bg-muted-background after:h-px after:w-full after:bg-border" onpointerdown={(event) => startResize(event, { direction: 'vertical', panelConfigs: verticalPanels, layout: () => verticalLayout, setLayout: (layout) => (verticalLayout = layout) })} onkeydown={(event) => resizeByKey(event, { direction: 'vertical', panelConfigs: verticalPanels, layout: () => verticalLayout, setLayout: (layout) => (verticalLayout = layout) })}></button>
          <div data-resizable-panel="main" class="p-space-md"><h2 class="text-sm font-medium">Content</h2></div>
        </div>
      </Card>
      <Card title="Nested" description="Horizontal and vertical groups can be composed in one frame.">
        <div class="grid h-96 overflow-hidden rounded-md border border-border bg-background" style={gridStyle('horizontal', nestedLayout)}>
          <div data-resizable-panel="nested-sidebar" class="p-space-md">Sidebar</div>
          <button aria-label="Resize nested horizontal panels" data-resizable-handle type="button" class="relative cursor-col-resize touch-none outline-none focus-visible:bg-muted-background after:block after:h-full after:w-px after:bg-border" onpointerdown={(event) => startResize(event, { direction: 'horizontal', panelConfigs: nestedPanels, layout: () => nestedLayout, setLayout: (layout) => (nestedLayout = layout) })} onkeydown={(event) => resizeByKey(event, { direction: 'horizontal', panelConfigs: nestedPanels, layout: () => nestedLayout, setLayout: (layout) => (nestedLayout = layout) })}></button>
          <div data-resizable-panel="nested-workspace" class="grid" style={gridStyle('vertical', nestedVerticalLayout)}>
            <div data-resizable-panel="nested-editor" class="p-space-md">Editor</div>
            <button aria-label="Resize nested vertical panels" data-resizable-handle type="button" class="relative cursor-row-resize touch-none outline-none focus-visible:bg-muted-background after:block after:h-px after:w-full after:bg-border" onpointerdown={(event) => startResize(event, { direction: 'vertical', panelConfigs: nestedVerticalPanels, layout: () => nestedVerticalLayout, setLayout: (layout) => (nestedVerticalLayout = layout) })} onkeydown={(event) => resizeByKey(event, { direction: 'vertical', panelConfigs: nestedVerticalPanels, layout: () => nestedVerticalLayout, setLayout: (layout) => (nestedVerticalLayout = layout) })}></button>
            <div data-resizable-panel="nested-console" class="p-space-md">Console</div>
          </div>
        </div>
      </Card>
      <Card title="Disabled Handle" description="A disabled handle keeps the layout fixed.">
        <div class="grid h-48 grid-cols-[35%_12px_1fr] overflow-hidden rounded-md border border-border bg-background">
          <div class="p-space-md">Locked</div><button aria-label="Disabled resize handle" data-resizable-handle type="button" disabled class="relative cursor-not-allowed opacity-50 after:block after:h-full after:w-px after:bg-border"></button><div class="p-space-md">Fixed layout</div>
        </div>
      </Card>
    </div>
  </div>
</main>
