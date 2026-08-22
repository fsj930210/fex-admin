<script lang="ts">
  import Badge from '@fex-design/svelte/primitive/badge'
  import Card from '@fex-design/svelte/ui/card'
  import { BadgeOverflow } from '@fex-design/svelte/primitive/badge'

  const variants = ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const
  const overflowItems = ['Design', 'Frontend', 'Backend', 'QA', 'Operations']
</script>

{#snippet overflowBadge(item: string)}<Badge variant="secondary">{item}</Badge>{/snippet}

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-md"><a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a><h1 class="text-2xl font-semibold text-foreground">Badge</h1><p class="max-w-2xl text-sm leading-6 text-muted-foreground">Use badges for compact status, category, and count labels.</p></header><div class="grid gap-space-xl"><Card title="Variants" description="Badge visual styles."><div class="flex min-w-0 flex-wrap items-center gap-space-md">{#each variants as variant}<Badge {variant}>{variant}</Badge>{/each}</div></Card><Card title="Overflow" description="Keeps the collection compact without changing its values."><BadgeOverflow items={overflowItems} maxCount={3} item={overflowBadge} /></Card></div></div></main>
