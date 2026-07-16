<script lang="ts">
  import type { Readable } from 'svelte/store'

  interface Props {
    snapshot: Readable<{ readonly revision: number }>
    text: (revision: number) => string
  }

  let { snapshot, text }: Props = $props()
</script>

<p class="text-xs text-muted-foreground">{text($snapshot.revision)}</p>
