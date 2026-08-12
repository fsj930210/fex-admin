import { A } from '@solidjs/router'
import { AnchorDemo } from './anchor-demo'
import { HorizontalDemo } from './horizontal-demo'
export function AnchorPage() { return <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-md"><A class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</A><h1 class="text-2xl font-semibold">Anchor</h1><p class="text-sm text-muted-foreground">Navigate and track sections in a scroll container.</p></header><div class="grid gap-space-xl"><AnchorDemo /><HorizontalDemo /></div></div></main> }

