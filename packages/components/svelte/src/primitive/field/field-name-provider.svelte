<script lang="ts">
  import type { Snippet } from 'svelte'
  import { setFieldNameContext } from './context'

  let { name, children }: { name: string; children?: Snippet } = $props()
  setFieldNameContext(name)
</script>

{@render children?.()}
