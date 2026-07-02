<script lang="ts">
  import Badge from '@fex/components-svelte/ui/badge'
  import Card from '@fex/components-svelte/ui/card'

  const variants = ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const
</script>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-md"><a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a><h1 class="text-2xl font-semibold text-foreground">Badge</h1><p class="max-w-2xl text-sm leading-6 text-muted-foreground">Use badges for compact status, category, and count labels.</p></header><Card title="Variants" description="Badge visual styles."><div class="flex min-w-0 flex-wrap items-center gap-space-md">{#each variants as variant}<Badge {variant}>{variant}</Badge>{/each}</div></Card></div></main>
