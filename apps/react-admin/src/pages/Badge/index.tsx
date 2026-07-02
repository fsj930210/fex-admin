import { Badge } from '@fex/components-react/ui/badge'
import { Card } from '@fex/components-react/ui/card'
import { Link } from 'react-router'

const variants = ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const

export function BadgePage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</Link>
          <h1 className="text-2xl font-semibold text-foreground">Badge</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Use badges for compact status, category, and count labels.</p>
        </header>
        <Card title="Variants" description="Badge visual styles.">
          <div className="flex min-w-0 flex-wrap items-center gap-space-md">
            {variants.map((variant) => <Badge key={variant} variant={variant}>{variant}</Badge>)}
          </div>
        </Card>
      </div>
    </main>
  )
}
