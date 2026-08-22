<script lang="ts">
  import { useTour } from '@fex-design/svelte/primitive/tour-context'
  import type { Snippet } from 'svelte'

  let { children }: { children?: Snippet } = $props()
  const { controller } = useTour()
</script>

<button type="button" class="inline-flex h-9 items-center justify-center rounded-md border border-primary bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90" onclick={controller.open}>
  {#if children}{@render children()}{:else}开始引导{/if}
</button>
