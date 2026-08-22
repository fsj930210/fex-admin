import { Badge } from '@fex-design/solid/primitive/badge'
import { Card } from '@fex-design/solid/ui/card'
import { BadgeOverflow } from '@fex-design/solid/primitive/badge'
import { A } from '@solidjs/router'
import { For } from 'solid-js'

const variants = ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const

export function BadgePage() {
  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-md">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">
            Back home
          </A>
          <h1 class="text-2xl font-semibold text-foreground">Badge</h1>
          <p class="max-w-2xl text-sm leading-6 text-muted-foreground">
            Use badges for compact status, category, and count labels.
          </p>
        </header>
        <div class="grid gap-space-xl">
          <Card title="Variants" description="Badge visual styles."><div class="flex min-w-0 flex-wrap items-center gap-space-md"><For each={variants}>{(variant) => <Badge variant={variant}>{variant}</Badge>}</For></div></Card>
          <Card title="Overflow" description="Keeps the collection compact without changing its values."><BadgeOverflow maxCount={3}><For each={['Design', 'Frontend', 'Backend', 'QA', 'Operations']}>{(item) => <Badge variant="secondary">{item}</Badge>}</For></BadgeOverflow></Card>
        </div>
      </div>
    </main>
  )
}
