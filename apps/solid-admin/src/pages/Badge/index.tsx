import { Badge } from '@fex/components-solid/ui/badge'
import { Card } from '@fex/components-solid/ui/card'
import { A } from '@solidjs/router'
import { For } from 'solid-js'

const variants = ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const

export function BadgePage() {
  return <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-md"><A class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</A><h1 class="text-2xl font-semibold text-foreground">Badge</h1><p class="max-w-2xl text-sm leading-6 text-muted-foreground">Use badges for compact status, category, and count labels.</p></header><Card title="Variants" description="Badge visual styles."><div class="flex min-w-0 flex-wrap items-center gap-space-md"><For each={variants}>{(variant) => <Badge variant={variant}>{variant}</Badge>}</For></div></Card></div></main>
}
