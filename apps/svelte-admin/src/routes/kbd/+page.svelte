<script lang="ts">
  import Kbd from '@fex/components-svelte/ui/kbd'
  import KbdGroup from '@fex/components-svelte/ui/kbd-group'
  import Card from '@fex/components-svelte/ui/card'
</script>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-md"><a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a><h1 class="text-2xl font-semibold text-foreground">Kbd</h1><p class="max-w-2xl text-sm leading-6 text-muted-foreground">Display keyboard keys and shortcut combinations.</p></header><Card title="Shortcuts" description="Single keys and key combinations."><div class="flex min-w-0 flex-wrap items-center gap-space-lg"><Kbd>Esc</Kbd><KbdGroup><Kbd>Ctrl</Kbd><Kbd>K</Kbd></KbdGroup><KbdGroup><Kbd>Cmd</Kbd><Kbd>Enter</Kbd></KbdGroup></div></Card></div></main>
