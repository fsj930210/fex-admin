<script lang="ts">
  import ScrollbarRoot from '@fex/components-svelte/primitive/scrollbar'
  import ScrollbarViewport from '@fex/components-svelte/primitive/scrollbar-viewport'
  import ScrollbarBar from '@fex/components-svelte/primitive/scrollbar-bar'
  import ScrollbarTrack from '@fex/components-svelte/primitive/scrollbar-track'
  import ScrollbarThumb from '@fex/components-svelte/primitive/scrollbar-thumb'
  import ScrollbarCorner from '@fex/components-svelte/primitive/scrollbar-corner'
  import Card from '@fex/components-svelte/ui/card'

  const items = Array.from({ length: 30 }, (_, index) => index + 1)
  const virtualRowHeight = 40
  const virtualRowCount = 300
  let virtualStart = $state(0)
  let virtualRows = $derived(
    Array.from({ length: 14 }, (_, index) => virtualStart + index + 1).filter((row) => row <= virtualRowCount),
  )
</script>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-md">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a>
      <div>
        <h1 class="text-2xl font-semibold text-foreground">Scrollbar</h1>
        <p class="mt-space-sm text-sm text-muted-foreground">Primitive overlay scrollbar with native scrolling.</p>
      </div>
    </header>

    <div class="grid gap-space-xl lg:grid-cols-2">
      <Card title="Vertical" description="Single vertical Bar.">
        <ScrollbarRoot class="h-72 rounded-md border">
          <ScrollbarViewport overflowX="hidden">
            <div class="space-y-2 p-3">
              {#each items as item (item)}
                <div class="rounded-md border border-border p-3 text-sm">Activity {item}</div>
              {/each}
            </div>
          </ScrollbarViewport>
          <ScrollbarBar axis="y" />
        </ScrollbarRoot>
      </Card>

      <Card title="Horizontal" description="Single horizontal Bar.">
        <ScrollbarRoot class="h-40 rounded-md border">
          <ScrollbarViewport overflowY="hidden">
            <div class="flex w-max gap-3 p-3">
              {#each items as item (item)}
                <div class="grid size-28 shrink-0 place-items-center rounded-md border border-border">Card {item}</div>
              {/each}
            </div>
          </ScrollbarViewport>
          <ScrollbarBar axis="x" />
        </ScrollbarRoot>
      </Card>

      <Card title="Both axes" description="Independent floating Bars.">
        <ScrollbarRoot class="h-72 rounded-md border">
          <ScrollbarViewport>
            <div class="grid h-140 w-190 grid-cols-5 gap-3 p-3">
              {#each items as item (item)}
                <div class="grid h-24 place-items-center rounded-md border border-border">{item}</div>
              {/each}
            </div>
          </ScrollbarViewport>
          <ScrollbarBar axis="y" />
          <ScrollbarBar axis="x" />
          <ScrollbarCorner />
        </ScrollbarRoot>
      </Card>

      <Card title="Inset visible tracks" description="Tracks are opt-in; this rail starts below the fixed toolbar.">
        <ScrollbarRoot autoHide="never" class="h-72 rounded-md border">
          <div class="h-12 border-b border-border bg-muted-background px-3 py-3 text-sm font-medium">Fixed toolbar</div>
          <ScrollbarViewport class="h-[calc(100%-3rem)]">
            <div class="space-y-2 p-3">
              {#each items as item (item)}
                <div class="rounded-md border border-border bg-background p-3">Activity item {item}</div>
              {/each}
            </div>
          </ScrollbarViewport>
          <ScrollbarBar axis="y" class="top-12">
            <ScrollbarTrack axis="y" class="bg-muted-background/90">
              <ScrollbarThumb axis="y" class="bg-primary/70 hover:bg-primary" />
            </ScrollbarTrack>
          </ScrollbarBar>
          <ScrollbarBar axis="x" class="start-20">
            <ScrollbarTrack axis="x" class="bg-muted-background/90">
              <ScrollbarThumb axis="x" class="bg-primary/70 hover:bg-primary" />
            </ScrollbarTrack>
          </ScrollbarBar>
          <ScrollbarCorner />
        </ScrollbarRoot>
      </Card>
    </div>

    <Card title="Scroll events · virtual list" description="The scroll event updates only the rendered window; 300 rows keep native scrolling.">
      <ScrollbarRoot class="h-72 rounded-md border" onScrollChange={({ scrollTop }) => (virtualStart = Math.floor(scrollTop / virtualRowHeight))}>
        <ScrollbarViewport overflowX="hidden">
          <div class="relative h-[12000px]">
            <div class="absolute inset-x-0" style:transform={`translateY(${virtualStart * virtualRowHeight}px)`}>
              {#each virtualRows as row (row)}
                <div class="flex h-10 items-center border-b border-border px-3 text-sm">Virtual activity {row}</div>
              {/each}
            </div>
          </div>
        </ScrollbarViewport>
        <ScrollbarBar axis="y" />
      </ScrollbarRoot>
    </Card>

    <Card title="Data grid scroll" description="Plain table in a native viewport; layout controls the Bar track geometry.">
      <ScrollbarRoot class="h-96 rounded-md border">
        <ScrollbarViewport>
          <table class="w-full min-w-[1500px] text-left text-sm">
            <thead class="sticky top-0 bg-muted-background">
              <tr>
                {#each ['ID','Name','Status','Amount','Region'] as column (column)}
                  <th class="border-b border-border px-4 py-3">{column}</th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each items as row (row)}
                <tr class="border-b border-border">
                  <td class="px-4 py-3">{row}</td>
                  <td class="px-4 py-3">Customer {row}</td>
                  <td class="px-4 py-3">Active</td>
                  <td class="px-4 py-3">$128</td>
                  <td class="px-4 py-3">APAC</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </ScrollbarViewport>
        <ScrollbarBar axis="y" class="top-12" />
        <ScrollbarBar axis="x" />
        <ScrollbarCorner />
      </ScrollbarRoot>
    </Card>
  </div>
</main>
