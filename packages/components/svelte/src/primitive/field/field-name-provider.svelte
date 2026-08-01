<script lang="ts">
  import type { Snippet } from 'svelte'
  import { setFieldNameContext } from './context'

  let { name, children }: { name: string; children?: Snippet } = $props()
  // svelte-ignore state_referenced_locally -- a provider name is fixed for its mounted subtree.
  setFieldNameContext(name)
</script>

{@render children?.()}
