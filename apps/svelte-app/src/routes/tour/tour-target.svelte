<script lang="ts">
  import type { Snippet } from 'svelte'
  import TourTarget from '@fex-design/svelte/primitive/tour-target'
  let { name, children: label }: { name: string; children?: Snippet } = $props()
</script>
<TourTarget {name}>{#snippet children(slot)}<div use:slot.action {...slot.props} role="button" tabindex="0" class="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted-background">{@render label?.()}</div>{/snippet}</TourTarget>
