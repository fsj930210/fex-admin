import { Spinner } from '@fex/components-react/ui/spinner'
import { Card } from '@fex/components-react/ui/card'
import { Link } from 'react-router'

export function SpinnerPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</Link>
          <h1 className="text-2xl font-semibold text-foreground">Spinner</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Use spinners for local loading feedback.</p>
        </header>
        <Card title="Sizes" description="Available spinner sizes.">
          <div className="flex min-w-0 flex-wrap items-center gap-space-lg"><Spinner size="sm" aria-label="Loading" /><Spinner size="md" aria-label="Loading" /><Spinner size="lg" aria-label="Loading" /></div>
        </Card>
      </div>
    </main>
  )
}
