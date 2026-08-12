import { Link } from 'react-router'
import { AnchorDemo } from './anchor-demo'
import { HorizontalDemo } from './horizontal-demo'

export function AnchorPage() {
  return <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div className="mx-auto w-full max-w-5xl space-y-space-xl">
    <header className="space-y-space-md"><Link className="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</Link><h1 className="text-2xl font-semibold">Anchor</h1><p className="text-sm text-muted-foreground">Navigate and track sections in a scroll container.</p></header>
    <div className="grid gap-space-xl"><AnchorDemo /><HorizontalDemo /></div>
  </div></main>
}

