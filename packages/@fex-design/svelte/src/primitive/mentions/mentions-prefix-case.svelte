<script lang="ts">
  import type { Snippet } from 'svelte'
  import { useMentions } from './context'

  let { prefix, children }: { prefix: string; children?: Snippet } = $props()
  const mentions = useMentions('MentionsPrefixCase')
</script>

{#if mentions.snapshot().query?.prefix === prefix}
  {@render children?.()}
{/if}
