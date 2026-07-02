<script lang="ts">
  import Badge from '@fex/components-svelte/ui/badge'
  import Card from '@fex/components-svelte/ui/card'
  import Empty from '@fex/components-svelte/primitive/empty'
  import EmptyContent from '@fex/components-svelte/primitive/empty-content'
  import EmptyDescription from '@fex/components-svelte/primitive/empty-description'
  import EmptyHeader from '@fex/components-svelte/primitive/empty-header'
  import EmptyMedia from '@fex/components-svelte/primitive/empty-media'
  import EmptyTitle from '@fex/components-svelte/primitive/empty-title'
</script>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-md"><a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a><h1 class="text-2xl font-semibold text-foreground">Empty</h1><p class="max-w-2xl text-sm leading-6 text-muted-foreground">Use empty states when lists, search results, or filters return no data.</p></header><Card title="Primitive" description="Media, title, description, and content slots."><Empty><EmptyHeader><EmptyMedia variant="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="m5.45 5.11-3.27 6A2 2 0 0 0 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6a2 2 0 0 0-.18-.89l-3.27-6A2 2 0 0 0 16.79 4H7.21a2 2 0 0 0-1.76 1.11Z" /></svg></EmptyMedia><EmptyTitle>No approval tasks</EmptyTitle><EmptyDescription>Adjust filters and try again, or create a new workflow record.</EmptyDescription></EmptyHeader><EmptyContent><Badge variant="outline">0 items</Badge></EmptyContent></Empty></Card></div></main>
