import { A } from '@solidjs/router'
import { Toggle, ToggleGroup } from '@fex-design/solid/primitive/toggle'
import { Card } from '@fex-design/solid/ui/card'
import { createSignal } from 'solid-js'

export function TogglePage() {
  const [pressed, setPressed] = createSignal(false)
  const [alignment, setAlignment] = createSignal('left')
  const [formats, setFormats] = createSignal<string[]>(['bold'])
  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-xl"><A class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</A><div><h1 class="text-2xl font-semibold text-foreground">Toggle</h1><p class="mt-space-md text-sm text-muted-foreground">Two-state controls for independent actions and related option groups.</p></div></header>
        <div class="grid gap-space-xl">
          <Card title="Standalone" description="A single Toggle exposes a clear pressed state without needing a group."><div class="grid justify-items-start gap-space-md"><Toggle pressed={pressed()} onChange={setPressed}><span aria-hidden>★</span>Favorite</Toggle><p class="text-sm text-muted-foreground">{pressed() ? 'Added to favorites' : 'Not in favorites'}</p></div></Card>
          <Card title="Single selection" description="The group reads as one segmented control while keeping each option independently focusable."><div class="grid gap-space-md"><ToggleGroup value={alignment()} onChange={setAlignment} aria-label="Text alignment"><Toggle value="left">Left</Toggle><Toggle value="center">Center</Toggle><Toggle value="right">Right</Toggle></ToggleGroup><p class="text-sm text-muted-foreground">Alignment: {alignment() || 'none'}</p></div></Card>
          <Card title="Multiple selection" description="Multiple mode keeps related formatting controls inside one visual surface."><div class="grid gap-space-md"><ToggleGroup multiple value={formats()} onChange={setFormats} aria-label="Text formatting"><Toggle value="bold"><strong aria-hidden>B</strong>Bold</Toggle><Toggle value="italic"><em aria-hidden>I</em>Italic</Toggle><Toggle value="underline"><u aria-hidden>U</u>Underline</Toggle></ToggleGroup><p class="text-sm text-muted-foreground">Active: {formats().join(', ') || 'none'}</p></div></Card>
          <Card title="Variants and layout" description="Groups keep one visual identity across compact, outline, vertical, and disabled states."><div class="grid gap-space-lg"><div class="flex items-center gap-space-lg"><span class="w-20 text-sm text-muted-foreground">Compact</span><ToggleGroup defaultValue="day" size="sm"><Toggle value="day">Day</Toggle><Toggle value="week">Week</Toggle><Toggle value="month">Month</Toggle></ToggleGroup></div><div class="flex items-start gap-space-lg"><span class="w-20 pt-1.5 text-sm text-muted-foreground">Vertical</span><ToggleGroup defaultValue="top" orientation="vertical" variant="outline"><Toggle value="top">Top</Toggle><Toggle value="center">Center</Toggle><Toggle value="bottom">Bottom</Toggle></ToggleGroup></div><div class="flex items-center gap-space-lg"><span class="w-20 text-sm text-muted-foreground">Disabled</span><ToggleGroup defaultValue="one" disabled><Toggle value="one">One</Toggle><Toggle value="two">Two</Toggle></ToggleGroup></div></div></Card>
        </div>
      </div>
    </main>
  )
}
