import { Alert, AlertAction, AlertDescription, AlertTitle } from '@fex/components-react/primitive/alert'
import { Badge } from '@fex/components-react/ui/badge'
import { Card } from '@fex/components-react/ui/card'
import { Link } from 'react-router'

const variants = ['default', 'success', 'warning', 'destructive'] as const

export function AlertPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md"><Link className="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</Link><h1 className="text-2xl font-semibold text-foreground">Alert</h1><p className="max-w-2xl text-sm leading-6 text-muted-foreground">Show status messages with clear semantics.</p></header>
        <Card title="Primitive" description="Structure with icon, title, description, and action."><div className="grid gap-space-md">{variants.map((variant) => <Alert key={variant} variant={variant}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg><AlertTitle>{variant}</AlertTitle><AlertDescription>The current task is in {variant} state. Continue with the page action.</AlertDescription><AlertAction><Badge variant="outline">New</Badge></AlertAction></Alert>)}</div></Card>
      </div>
    </main>
  )
}
