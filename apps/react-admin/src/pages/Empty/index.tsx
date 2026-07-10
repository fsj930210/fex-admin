import { Badge } from '@fex/components-react/ui/badge'
import { Card } from '@fex/components-react/ui/card'
import { InfoIcon } from '@fex/components-react/icon/info'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@fex/components-react/primitive/empty'
import { Link } from 'react-router'

export function EmptyPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md"><Link className="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</Link><h1 className="text-2xl font-semibold text-foreground">Empty</h1><p className="max-w-2xl text-sm leading-6 text-muted-foreground">Use empty states when lists, search results, or filters return no data.</p></header>
        <Card title="Primitive" description="Media, title, description, and content slots."><Empty><EmptyHeader><EmptyMedia variant="icon"><InfoIcon /></EmptyMedia><EmptyTitle>No approval tasks</EmptyTitle><EmptyDescription>Adjust filters and try again, or create a new workflow record.</EmptyDescription></EmptyHeader><EmptyContent><Badge variant="outline">0 items</Badge></EmptyContent></Empty></Card>
      </div>
    </main>
  )
}
