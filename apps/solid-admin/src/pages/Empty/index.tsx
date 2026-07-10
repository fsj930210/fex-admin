import { Badge } from '@fex/components-solid/ui/badge'
import { Card } from '@fex/components-solid/ui/card'
import { InfoIcon } from '@fex/components-solid/icon/info'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@fex/components-solid/primitive/empty'
import { A } from '@solidjs/router'

export function EmptyPage() {
  return <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-md"><A class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</A><h1 class="text-2xl font-semibold text-foreground">Empty</h1><p class="max-w-2xl text-sm leading-6 text-muted-foreground">Use empty states when lists, search results, or filters return no data.</p></header><Card title="Primitive" description="Media, title, description, and content slots."><Empty><EmptyHeader><EmptyMedia variant="icon"><InfoIcon /></EmptyMedia><EmptyTitle>No approval tasks</EmptyTitle><EmptyDescription>Adjust filters and try again, or create a new workflow record.</EmptyDescription></EmptyHeader><EmptyContent><Badge variant="outline">0 items</Badge></EmptyContent></Empty></Card></div></main>
}
